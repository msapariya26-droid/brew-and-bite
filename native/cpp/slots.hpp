// slots.hpp — seating slot definitions and availability helpers
#ifndef SLOTS_HPP
#define SLOTS_HPP

#include <string>
#include <vector>
#include <json.hpp>

namespace slots {

    struct Slot {
        std::string id;     // used in API & bookings file (e.g. "brunch")
        std::string label;  // human-readable (e.g. "Brunch")
        std::string time;   // HH:MM 24-hour (e.g. "09:30")
    };

    // All available seating slots, in time order.
    // Inline (C++17) so the header can be included by multiple TUs.
    inline const std::vector<Slot> ALL_SLOTS = {
        { "morning-coffee", "Morning Coffee", "07:00" },
        { "brunch",         "Brunch",         "09:30" },
        { "lunch",          "Lunch",          "12:00" },
        { "afternoon-tea",  "Afternoon Tea",  "15:00" },
        { "early-dinner",   "Early Dinner",   "17:30" },
        { "dinner",         "Dinner",         "19:00" },
    };

    // Capacity per slot (guests).
    inline constexpr int SLOT_CAPACITY = 30;

    // Sum up guest counts for every booking on the given date in the given slot.
    int total_guests_for_slot(const nlohmann::json &bookings,
                              const std::string   &date,
                              const std::string   &slot_id);

}  // namespace slots

#endif  // SLOTS_HPP
