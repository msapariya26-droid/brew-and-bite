#ifndef VALIDATOR_H
#define VALIDATOR_H

#ifdef __cplusplus
extern "C" {
#endif

int bb_validate_name(const char *s);
int bb_validate_email(const char *s);
int bb_validate_phone(const char *s);
int bb_guests_from_bucket(int bucket);

#ifdef __cplusplus
}
#endif

#endif
