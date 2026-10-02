// slots.cpp — implementation of slot availability helpers
#include "slots.hpp"

namespace slots {

    int total_guests_for_slot(const nlohmann::json &bookings,
                              const std::string   &date,
                              const std::string   &slot_id) {
        int total = 0;
        for (const auto &b : bookings) {
            if (b.value("date", "") == date && b.value("slot", "") == slot_id) {
                total += b.value("guests", 0);
            }
        }
        return total;
    }

}  // namespace slots
