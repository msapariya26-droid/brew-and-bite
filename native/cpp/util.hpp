// util.hpp — low-level file I/O helpers
// Compile with -Ithird_party so <json.hpp> resolves to third_party/json.hpp
#ifndef UTIL_HPP
#define UTIL_HPP

#include <string>
#include <fstream>
#include <sstream>
#include <filesystem>
#include <json.hpp>

namespace util {

    // Read the contents of a text file as a raw string.
    // Returns "" if the file does not exist or cannot be read.
    inline std::string read_file(const std::string &path) {
        std::ifstream f(path, std::ios::binary);
        if (!f) return "";
        std::ostringstream ss;
        ss << f.rdbuf();
        return ss.str();
    }

    // Parse a file as JSON.
    // Returns a null json value if the file is missing or contains invalid JSON.
    inline nlohmann::json read_json(const std::string &path) {
        std::ifstream f(path);
        if (!f) return nlohmann::json{};  // null
        try {
            return nlohmann::json::parse(f);
        } catch (...) {
            return nlohmann::json{};  // null on parse error
        }
    }

    // Write JSON atomically: write to a .tmp file then rename.
    // Creates parent directories if needed.
    // Returns true on success.
    inline bool write_json_atomic(const std::string &path, const nlohmann::json &j) {
        try {
            std::filesystem::path p(path);
            // Ensure parent directory exists (e.g., data/)
            if (!p.parent_path().empty())
                std::filesystem::create_directories(p.parent_path());

            std::filesystem::path tmp = p.parent_path() / (p.filename().string() + ".tmp");
            std::ofstream ofs(tmp, std::ios::binary);
            if (!ofs) return false;
            ofs << j.dump(2);
            ofs.close();
            // Rename is atomic on the same filesystem
            std::filesystem::rename(tmp, p);
            return true;
        } catch (...) {
            return false;
        }
    }

}  // namespace util

#endif  // UTIL_HPP
