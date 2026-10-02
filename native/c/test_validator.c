#include "validator.h"
#include <stdio.h>

int tests_run = 0;
int tests_passed = 0;

void expect_eq(int expected, int actual, const char* name) {
    tests_run++;
    if (expected == actual) {
        tests_passed++;
        printf("PASS: %s\n", name);
    } else {
        printf("FAIL: %s (Expected %d, got %d)\n", name, expected, actual);
    }
}

int main() {
    // Name
    expect_eq(1, bb_validate_name("John Doe"), "Valid Name: John Doe");
    expect_eq(1, bb_validate_name("O'Connor"), "Valid Name: O'Connor");
    expect_eq(1, bb_validate_name("Mary-Jane"), "Valid Name: Mary-Jane");
    expect_eq(0, bb_validate_name("A"), "Invalid Name: length 1");
    expect_eq(0, bb_validate_name("John123"), "Invalid Name: contains numbers");
    
    // Email
    expect_eq(1, bb_validate_email("test@example.com"), "Valid Email: test@example.com");
    expect_eq(0, bb_validate_email("testexample.com"), "Invalid Email: no @");
    expect_eq(0, bb_validate_email("test@example"), "Invalid Email: no dot after @");
    expect_eq(0, bb_validate_email("test@@example.com"), "Invalid Email: double @");
    
    // Phone
    expect_eq(1, bb_validate_phone("12345678"), "Valid Phone: 8 digits");
    expect_eq(1, bb_validate_phone("+1 800-555-1234"), "Valid Phone: formatting");
    expect_eq(0, bb_validate_phone("1234567"), "Invalid Phone: < 8 digits");
    expect_eq(0, bb_validate_phone("+1234567890123456"), "Invalid Phone: > 15 digits");
    expect_eq(0, bb_validate_phone("123a45678"), "Invalid Phone: letters");
    
    // Bucket
    expect_eq(2, bb_guests_from_bucket(0), "Bucket 0 -> 2");
    expect_eq(4, bb_guests_from_bucket(1), "Bucket 1 -> 4");
    expect_eq(6, bb_guests_from_bucket(2), "Bucket 2 -> 6");
    expect_eq(8, bb_guests_from_bucket(3), "Bucket 3 -> 8");
    expect_eq(-1, bb_guests_from_bucket(4), "Invalid bucket 4 -> -1");

    printf("\nTests Run: %d\n", tests_run);
    printf("Tests Passed: %d\n", tests_passed);

    return (tests_run == tests_passed) ? 0 : 1;
}
