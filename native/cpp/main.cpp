// main.cpp — Brew & Bite C++17 HTTP server
// Serves the built React SPA from client/dist and the /api/* endpoints.
// Linked against: build/validator.o  (C validator, same source as the WASM build)
// Third-party headers in third_party/ — compiled with -Ithird_party -Inative/c
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <chrono>
#include <ctime>
#include <random>
#include <algorithm>
#include <unordered_map>
#include <vector>
#include <mutex>

// cpp-httplib (single header, no OpenSSL — plain HTTP only)
#include "httplib.h"
// nlohmann/json (single header)
#include "json.hpp"

#include "storage.hpp"
#include "slots.hpp"
// Validator symbols live in build/validator.o (C linkage)
#include "validator.h"

using json = nlohmann::json;
using namespace std::chrono;

// ─── Reference code  BB-XXXXXX ──────────────────────────────────────────────
// 6 uppercase alphanumeric characters. Thread-safe.
static std::string generate_ref() {
    static const char CHARS[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    static std::mt19937 rng(std::random_device{}());
    static std::uniform_int_distribution<int> dist(0, 35);
    static std::mutex mu;

    std::lock_guard<std::mutex> lk(mu);
    std::string code = "BB-";
    for (int i = 0; i < 6; ++i) code += CHARS[dist(rng)];
    return code;
}

// ─── ISO-8601 UTC timestamp ──────────────────────────────────────────────────
static std::string iso_now() {
    auto now = system_clock::now();
    std::time_t t = system_clock::to_time_t(now);
    char buf[25];
    // gmtime is fine here: buf is local and we don't reuse the struct
    std::strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", std::gmtime(&t));
    return buf;
}

// ─── Rate limiter: max 5 POSTs per IP per 10 minutes ────────────────────────
class RateLimiter {
public:
    bool allow(const std::string &ip) {
        std::lock_guard<std::mutex> lk(mu_);
        auto now = steady_clock::now();
        auto &vec = map_[ip];
        // Drop timestamps older than 10 minutes
        vec.erase(
            std::remove_if(vec.begin(), vec.end(), [&](const auto &tp) {
                return duration_cast<minutes>(now - tp) >= minutes(10);
            }),
            vec.end()
        );
        if (vec.size() >= 5) return false;
        vec.push_back(now);
        return true;
    }
private:
    std::mutex mu_;
    std::unordered_map<std::string, std::vector<steady_clock::time_point>> map_;
};

static RateLimiter rateLimiter;

// ─── Response helpers ────────────────────────────────────────────────────────
static void respond(httplib::Response &res, int status, const json &body) {
    res.status = status;
    res.set_content(body.dump(), "application/json");
}
static json ok_body(json extra = {}) {
    extra["ok"] = true;
    return extra;
}
static json err_body(const std::string &msg) {
    return { {"ok", false}, {"error", msg} };
}
static json field_err_body(const json &errs) {
    return { {"ok", false}, {"errors", errs} };
}

// Read a file to string (for serving index.html as SPA fallback)
static std::string read_file_str(const std::string &path) {
    std::ifstream f(path, std::ios::binary);
    if (!f) return "";
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

// ─── Main ────────────────────────────────────────────────────────────────────
int main() {
    httplib::Server svr;

    // Serve the production build of the React app.
    // set_mount_point returns false if the directory does not exist; that is
    // fine in dev mode (Vite serves the frontend on :5173 and proxies /api here).
    if (!svr.set_mount_point("/", "client/dist")) {
        std::cerr << "[warn] client/dist not found — running in API-only mode.\n"
                  << "       Run 'make client' first, or use 'npm run dev' for development.\n";
    }

    // ── GET /api/health ──────────────────────────────────────────────────────
    svr.Get("/api/health", [](const httplib::Request &, httplib::Response &res) {
        respond(res, 200, ok_body());
    });

    // ── GET /api/menu ────────────────────────────────────────────────────────
    svr.Get("/api/menu", [](const httplib::Request &, httplib::Response &res) {
        respond(res, 200, ok_body({ {"items", storage::load_menu()} }));
    });

    // ── GET /api/slots?date=YYYY-MM-DD ───────────────────────────────────────
    svr.Get("/api/slots", [](const httplib::Request &req, httplib::Response &res) {
        if (!req.has_param("date")) {
            respond(res, 400, err_body("date parameter is required (YYYY-MM-DD)"));
            return;
        }
        std::string date = req.get_param_value("date");
        if (date.size() != 10 || date[4] != '-' || date[7] != '-') {
            respond(res, 400, err_body("date must be in YYYY-MM-DD format"));
            return;
        }

        json bookings = storage::load_bookings();
        json result   = json::array();
        for (const auto &s : slots::ALL_SLOTS) {
            int booked    = slots::total_guests_for_slot(bookings, date, s.id);
            int remaining = std::max(0, slots::SLOT_CAPACITY - booked);
            result.push_back({
                {"id",        s.id},
                {"label",     s.label},
                {"time",      s.time},
                {"remaining", remaining},
                {"full",      remaining == 0}
            });
        }
        respond(res, 200, ok_body({ {"slots", result} }));
    });

    // ── POST /api/enquiry ────────────────────────────────────────────────────
    // Accepts: name, email, phone (optional), type, notes (optional), website (honeypot)
    svr.Post("/api/enquiry", [](const httplib::Request &req, httplib::Response &res) {
        if (!rateLimiter.allow(req.remote_addr)) {
            respond(res, 429, err_body("Too many requests — please try again in a few minutes."));
            return;
        }
        if (req.body.size() > 16 * 1024) {
            respond(res, 413, err_body("Request body too large."));
            return;
        }
        json payload;
        try { payload = json::parse(req.body); }
        catch (...) { respond(res, 400, err_body("Invalid JSON body.")); return; }

        // Honeypot: bots fill a hidden "website" field; humans leave it blank.
        if (!payload.value("website", std::string{}).empty()) {
            // Silently accept so the bot doesn't know it was caught.
            respond(res, 200, ok_body({ {"id", "BB-000000"} }));
            return;
        }

        std::string name  = payload.value("name",  "");
        std::string email = payload.value("email", "");
        std::string phone = payload.value("phone", "");
        std::string type  = payload.value("type",  "general");
        std::string notes = payload.value("notes", "");

        // Server-side validation using the same C validator as the WASM build.
        json errs = json::object();
        if (!bb_validate_name(name.c_str()))
            errs["name"]  = "Please enter a valid name (2–60 letters).";
        if (!bb_validate_email(email.c_str()))
            errs["email"] = "Please enter a valid email address.";
        if (!phone.empty() && !bb_validate_phone(phone.c_str()))
            errs["phone"] = "Please enter a valid phone number.";
        if (notes.size() > 500)
            errs["notes"] = "Notes must be 500 characters or fewer.";

        if (!errs.empty()) { respond(res, 422, field_err_body(errs)); return; }

        std::string ref = generate_ref();
        json record = {
            {"id",        ref},
            {"type",      type},
            {"name",      name},
            {"email",     email},
            {"phone",     phone},
            {"notes",     notes},
            {"createdAt", iso_now()}
        };

        json enquiries = storage::load_enquiries();
        enquiries.push_back(record);
        if (!storage::save_enquiries(enquiries)) {
            respond(res, 500, err_body("Could not save your enquiry. Please try again."));
            return;
        }
        respond(res, 200, ok_body({ {"id", ref} }));
    });

    // ── POST /api/booking ────────────────────────────────────────────────────
    // Accepts: name, email, phone, type, guestBucket (0-3), date, slot, notes,
    //          preorder (array), website (honeypot)
    svr.Post("/api/booking", [](const httplib::Request &req, httplib::Response &res) {
        if (!rateLimiter.allow(req.remote_addr)) {
            respond(res, 429, err_body("Too many requests — please try again in a few minutes."));
            return;
        }
        if (req.body.size() > 16 * 1024) {
            respond(res, 413, err_body("Request body too large."));
            return;
        }
        json payload;
        try { payload = json::parse(req.body); }
        catch (...) { respond(res, 400, err_body("Invalid JSON body.")); return; }

        // Honeypot
        if (!payload.value("website", std::string{}).empty()) {
            respond(res, 200, ok_body({ {"id", "BB-000000"} }));
            return;
        }

        std::string name   = payload.value("name",   "");
        std::string email  = payload.value("email",  "");
        std::string phone  = payload.value("phone",  "");
        std::string type   = payload.value("type",   "reservation");
        int         bucket = payload.value("guestBucket", -1);
        std::string date   = payload.value("date",   "");
        std::string slot   = payload.value("slot",   "");
        std::string notes  = payload.value("notes",  "");

        // Server-side validation
        json errs = json::object();
        if (!bb_validate_name(name.c_str()))
            errs["name"]  = "Please enter a valid name (2–60 letters).";
        if (!bb_validate_email(email.c_str()))
            errs["email"] = "Please enter a valid email address.";
        if (!phone.empty() && !bb_validate_phone(phone.c_str()))
            errs["phone"] = "Please enter a valid phone number.";
        if (notes.size() > 500)
            errs["notes"] = "Notes must be 500 characters or fewer.";

        if (!errs.empty()) { respond(res, 422, field_err_body(errs)); return; }

        // Guest bucket → guest count (bb_guests_from_bucket: 0→2, 1→4, 2→6, 3→8)
        int guests = bb_guests_from_bucket(bucket);
        if (guests <= 0) {
            respond(res, 422, field_err_body({
                {"guestBucket", "Please select a valid number of guests."}
            }));
            return;
        }

        // Validate that the slot ID exists
        bool valid_slot = false;
        for (const auto &s : slots::ALL_SLOTS)
            if (s.id == slot) { valid_slot = true; break; }

        if (!valid_slot || date.empty()) {
            respond(res, 422, field_err_body({
                {"slot", "Please select a valid seating time."},
                {"date", date.empty() ? "Please select a date." : ""}
            }));
            return;
        }

        // Capacity check — load bookings inside the storage mutex implicitly
        json bookings = storage::load_bookings();
        int existing  = slots::total_guests_for_slot(bookings, date, slot);
        if (existing + guests > slots::SLOT_CAPACITY) {
            respond(res, 409, {
                {"ok",    false},
                {"error", "This time slot is fully booked. Please choose another time."},
                {"errors", {{"slot", "Slot is full for this date."}}}
            });
            return;
        }

        // Pre-order items (array of item name strings, optional)
        json preorder = (payload.contains("preorder") && payload["preorder"].is_array())
                        ? payload["preorder"]
                        : json::array();

        std::string ref = generate_ref();
        json record = {
            {"id",        ref},
            {"type",      type},
            {"name",      name},
            {"email",     email},
            {"phone",     phone},
            {"guests",    guests},
            {"date",      date},
            {"slot",      slot},
            {"notes",     notes},
            {"preorder",  preorder},
            {"createdAt", iso_now()}
        };

        bookings.push_back(record);
        if (!storage::save_bookings(bookings)) {
            respond(res, 500, err_body("Could not save your booking. Please try again."));
            return;
        }
        respond(res, 200, ok_body({ {"id", ref} }));
    });

    // ── SPA fallback — serve index.html for any non-API GET that 404s ────────
    // This lets React Router (or anchor links) handle deep routes client-side.
    svr.set_error_handler([](const httplib::Request &req, httplib::Response &res) {
        if (res.status == 404 && req.path.rfind("/api/", 0) != 0) {
            std::string html = read_file_str("client/dist/index.html");
            if (!html.empty()) {
                res.status = 200;
                res.set_content(html, "text/html");
            }
        }
    });

    // ── Per-request console log ───────────────────────────────────────────────
    svr.set_logger([](const httplib::Request &req, const httplib::Response &res) {
        std::cout << res.status << "  " << req.method << "  " << req.path << "\n";
    });

    std::cout << "Brew & Bite server → http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);
    return 0;
}
