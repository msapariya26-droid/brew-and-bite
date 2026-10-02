#include "validator.h"
#include <string.h>
#include <ctype.h>

int bb_validate_name(const char *s) {
    if (!s) return 0;
    size_t len = strlen(s);
    if (len < 2 || len > 60) return 0;
    for (size_t i = 0; i < len; i++) {
        char c = s[i];
        if (!isalpha((unsigned char)c) && c != ' ' && c != '\'' && c != '-') {
            return 0;
        }
    }
    return 1;
}

int bb_validate_email(const char *s) {
    if (!s) return 0;
    size_t len = strlen(s);
    if (len == 0 || len > 120) return 0;
    
    const char *at = strchr(s, '@');
    if (!at || at == s || at == s + len - 1) return 0;
    if (strchr(at + 1, '@')) return 0; // Multiple @
    
    const char *dot = strchr(at + 1, '.');
    if (!dot || dot == at + 1 || dot == s + len - 1) return 0;
    
    return 1; // Basic valid format: a@b.c
}

int bb_validate_phone(const char *s) {
    if (!s) return 0;
    size_t len = strlen(s);
    if (len == 0 || len > 50) return 0; // Max reasonable length for spaces/dashes
    
    int digit_count = 0;
    for (size_t i = 0; i < len; i++) {
        char c = s[i];
        if (isdigit((unsigned char)c)) {
            digit_count++;
        } else if (c == '+') {
            if (i != 0) return 0; // '+' only at start
        } else if (c != ' ' && c != '-') {
            return 0;
        }
    }
    
    if (digit_count < 8 || digit_count > 15) return 0;
    return 1;
}

int bb_guests_from_bucket(int bucket) {
    switch (bucket) {
        case 0: return 2;
        case 1: return 4;
        case 2: return 6;
        case 3: return 8;
        default: return -1;
    }
}
