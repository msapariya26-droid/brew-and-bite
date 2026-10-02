// storage.hpp — JSON file persistence for menu, bookings, and enquiries
// All write operations are guarded by a single mutex.
// Files are written atomically via util::write_json_atomic.
#ifndef STORAGE_HPP
#define STORAGE_HPP

#include <string>
#include <mutex>
#include <json.hpp>
#include "util.hpp"

namespace storage {

    // Inline variables (C++17) so this header can be included by multiple TUs.
    inline const std::string data_dir        = "data";
    inline const std::string menu_file       = data_dir + "/menu.json";
    inline const std::string bookings_file   = data_dir + "/bookings.json";
    inline const std::string enquiries_file  = data_dir + "/enquiries.json";

    // Single mutex protects all write operations to avoid torn files.
    inline std::mutex mtx;

    // ── Loaders ─────────────────────────────────────────────────────────
    // Each loader falls back to an empty array so callers never see null.

    inline nlohmann::json load_menu() {
        auto j = util::read_json(menu_file);
        return j.is_array() ? j : nlohmann::json::array();
    }

    inline nlohmann::json load_bookings() {
        auto j = util::read_json(bookings_file);
        return j.is_array() ? j : nlohmann::json::array();
    }

    inline nlohmann::json load_enquiries() {
        auto j = util::read_json(enquiries_file);
        return j.is_array() ? j : nlohmann::json::array();
    }

    // ── Writers ──────────────────────────────────────────────────────────

    inline bool save_bookings(const nlohmann::json &j) {
        std::lock_guard<std::mutex> lock(mtx);
        return util::write_json_atomic(bookings_file, j);
    }

    inline bool save_enquiries(const nlohmann::json &j) {
        std::lock_guard<std::mutex> lock(mtx);
        return util::write_json_atomic(enquiries_file, j);
    }

}  // namespace storage

#endif  // STORAGE_HPP
