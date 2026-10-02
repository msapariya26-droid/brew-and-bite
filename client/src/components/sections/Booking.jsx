import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Field from '../ui/Field';
import SelectField from '../ui/SelectField';
import GuestPicker from '../ui/GuestPicker';
import Button from '../ui/Button';
import { Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { usePreorder } from '../../context/PreorderContext';
import { formatPrice } from '../../lib/format';
import { useValidator } from '../../hooks/useValidator';
import { fetchSlots, submitBooking, submitEnquiry } from '../../lib/api';

const ALL_SEATING_TIMES = [
  { label: 'Morning Coffee', value: 'morning' },
  { label: 'Brunch', value: 'brunch' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Afternoon Tea', value: 'afternoon' },
  { label: 'Early Dinner', value: 'early_dinner' },
  { label: 'Dinner', value: 'dinner' }
];

export default function Booking() {
  const [guests, setGuests] = useState(1);
  const { items } = usePreorder();
  const [enquiryType, setEnquiryType] = useState('reservation');
  const [specialRequests, setSpecialRequests] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', seatingTime: 'morning' });
  
  const [errors, setErrors] = useState({});
  const { ready: validatorReady, error: validatorLoadError, validateName, validateEmail, validatePhone } = useValidator();

  const [availableSlots, setAvailableSlots] = useState(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Sync preorder items to special requests
  useEffect(() => {
    if (items.length > 0) {
      setEnquiryType('preorder');
      const itemNames = items.map(i => i.name).join(', ');
      
      setSpecialRequests(prev => {
        const withoutOld = prev.replace(/(\n|^)Pre-order: .*$/, '').trim();
        return withoutOld ? `${withoutOld}\nPre-order: ${itemNames}` : `Pre-order: ${itemNames}`;
      });
    } else {
      setSpecialRequests(prev => prev.replace(/(\n|^)Pre-order: .*$/, '').trim());
    }
  }, [items]);
  
  // Fetch slots on date change
  useEffect(() => {
    let active = true;
    if (formData.date && enquiryType !== 'general') {
      setIsFetchingSlots(true);
      fetchSlots(formData.date)
        .then(slots => {
          if (active) setAvailableSlots(slots);
        })
        .catch(err => {
          if (active) setSubmitError(err.message || 'Failed to check availability');
        })
        .finally(() => {
          if (active) setIsFetchingSlots(false);
        });
    } else {
      setAvailableSlots(null);
    }
    return () => { active = false; };
  }, [formData.date, enquiryType]);

  const requiresBookingInfo = enquiryType !== 'general';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateField = (name, value) => {
    if (!validatorReady) return null;
    
    switch (name) {
      case 'name':
        if (!validateName(value || '')) return "Name must be 2-60 characters and contain only letters, spaces, hyphens, or apostrophes.";
        break;
      case 'email':
        if (!validateEmail(value || '')) return "Invalid email address.";
        break;
      case 'phone':
        if (value && !validatePhone(value)) return "Invalid phone number (8-15 digits, optional +).";
        break;
      case 'date':
        if (requiresBookingInfo) {
          if (!value) return "Date is required.";
          
          const pad = (n) => n.toString().padStart(2, '0');
          const toLocalDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          
          const today = new Date();
          const todayStr = toLocalDateStr(today);
          
          const maxDate = new Date();
          maxDate.setDate(today.getDate() + 60);
          const maxDateStr = toLocalDateStr(maxDate);
          
          if (value < todayStr || value > maxDateStr) {
            return "Please select a date between today and 60 days from now.";
          }
        }
        break;
      case 'seatingTime':
        if (requiresBookingInfo && availableSlots) {
          const slot = availableSlots.find(s => s.id === value);
          if (slot && slot.full) {
            return "This seating time is currently full.";
          }
        }
        break;
      case 'specialRequests':
        if (value.length > 500) return "Special requests cannot exceed 500 characters.";
        break;
    }
    return null;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatorReady || isSubmitting) return;

    const newErrors = {};
    const fieldsToValidate = ['name', 'email', 'phone', 'specialRequests'];
    if (requiresBookingInfo) {
      fieldsToValidate.push('date', 'seatingTime');
    }

    fieldsToValidate.forEach(field => {
      const val = field === 'specialRequests' ? specialRequests : formData[field];
      const err = validateField(field, val);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (requiresBookingInfo) {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          type: enquiryType,
          guestBucket: guests, // guest bucket index 0-3
          date: formData.date,
          slot: formData.seatingTime,
          notes: specialRequests || undefined,
          preorder: items.length > 0 ? items.map(i => i.name) : undefined,
          website: formData.website || undefined // Honeypot
        };
        result = await submitBooking(payload);
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          type: enquiryType,
          notes: specialRequests || undefined,
          website: formData.website || undefined // Honeypot
        };
        result = await submitEnquiry(payload);
      }
      
      setSubmitSuccess(result);
    } catch (err) {
      if (err.status === 409) {
        setSubmitError("The selected time slot is now full. Please choose another time.");
        if (formData.date) {
          fetchSlots(formData.date).then(slots => setAvailableSlots(slots)).catch(()=>{});
        }
      } else if (err.status === 429) {
        setSubmitError("Too many requests. Please wait a moment and try again.");
      } else {
        setSubmitError(err.message || "Booking is temporarily unavailable, please call us on +91 883079015666.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(null);
    setFormData({ name: '', email: '', phone: '', date: '', seatingTime: 'morning' });
    setSpecialRequests('');
    setGuests(1); // Default bucket 1 which is index 0
    setEnquiryType('reservation');
  };

  const pad = (n) => n.toString().padStart(2, '0');
  const toLocalDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  
  const todayDate = new Date();
  const minDateStr = toLocalDateStr(todayDate);
  const maxDateObj = new Date();
  maxDateObj.setDate(todayDate.getDate() + 60);
  const maxDateStr = toLocalDateStr(maxDateObj);

  const seatingOptions = availableSlots 
    ? availableSlots.map(s => ({
        value: s.id,
        label: s.full ? `${s.label} (Full)` : s.label,
        disabled: s.full
      }))
    : ALL_SEATING_TIMES;

  return (
    <section id="book" className="flex flex-col px-margin-mobile py-space-lg bg-surface-container-low xl:max-w-7xl xl:mx-auto w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-surface rounded-3xl p-space-xl shadow-md flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-2">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Request Received!</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Thank you, {formData.name.split(' ')[0]}. We have received your {enquiryType === 'general' ? 'enquiry' : 'booking request'}.
            </p>
            <div className="bg-surface-container-low rounded-xl p-6 w-full max-w-md flex flex-col gap-3">
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="font-label-md text-on-surface-variant">Reference</span>
                <span className="font-bold text-on-surface">{submitSuccess.id || 'BB-CONFIRMED'}</span>
              </div>
              {requiresBookingInfo && (
                <>
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="font-label-md text-on-surface-variant">Date</span>
                    <span className="font-bold text-on-surface">{formData.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="font-label-md text-on-surface-variant">Time</span>
                    <span className="font-bold text-on-surface capitalize">{formData.seatingTime.replace('_', ' ')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="font-label-md text-on-surface-variant">Status</span>
                <span className="font-bold text-primary">Pending Confirmation</span>
              </div>
            </div>
            <Button onClick={handleReset} variant="secondary" className="mt-4">
              Make another request
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-surface rounded-3xl p-space-md shadow-md flex flex-col lg:flex-row gap-space-md max-w-2xl lg:max-w-5xl mx-auto w-full"
          >
            <div className="flex flex-col gap-1 text-center lg:text-left lg:w-1/3 lg:pt-space-md lg:pr-space-md lg:sticky lg:top-32 h-fit">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest">Plan Your Experience</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Have a Question or Planning a Visit?</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed lg:mt-4">
                Reserve a cozy table for brunch, inquire about private café events, or drop us a line. We will get back to you within 2 hours.
              </p>
            </div>

            <form className="flex flex-col gap-space-sm lg:w-2/3 lg:pl-space-md lg:border-l lg:border-outline-variant" onSubmit={handleSubmit}>
              
              {validatorLoadError && (
                <div className="bg-error-container text-on-error-container p-4 rounded-xl flex gap-3 items-start mb-2">
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md">Booking is temporarily unavailable</span>
                    <span className="font-body-sm text-body-sm">We are unable to validate your request at the moment. Please call us to book your table.</span>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-error-container text-on-error-container p-4 rounded-xl flex gap-3 items-start mb-2">
                  <AlertCircle className="flex-shrink-0" size={20} />
                  <span className="font-body-sm text-body-sm pt-0.5">{submitError}</span>
                </div>
              )}

              {items.length > 0 && (
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-1 mb-1">
                  <span className="font-label-md text-label-md text-on-surface">Your pre-order</span>
                  <ul className="text-body-sm font-body-sm text-on-surface-variant list-disc pl-5">
                    {items.map((item, idx) => (
                      <li key={idx}>{item.name} <span className="font-bold">{formatPrice(item.price)}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <Field 
                name="name"
                label="Full Name" 
                required 
                placeholder="e.g. Eleanor Vance" 
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                disabled={isSubmitting}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <Field 
                  name="email"
                  label="Email Address" 
                  required 
                  type="email" 
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  disabled={isSubmitting}
                />
                <Field 
                  name="phone"
                  label="Phone Number" 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  disabled={isSubmitting}
                />
              </div>

              <SelectField 
                name="enquiryType"
                label="Enquiry Type"
                value={enquiryType}
                onChange={(e) => {
                  setEnquiryType(e.target.value);
                  setSubmitError(null);
                }}
                disabled={isSubmitting}
                options={[
                  { label: 'Table Reservation', value: 'reservation' },
                  { label: 'General Question', value: 'general' },
                  { label: 'Private Event', value: 'event' },
                  { label: 'Pre-Order', value: 'preorder' }
                ]}
              />

              {requiresBookingInfo && (
                <>
                  <GuestPicker value={guests} onChange={(v) => { setGuests(v); setSubmitError(null); }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <Field 
                      name="date"
                      label="Preferred Date" 
                      type="date" 
                      required 
                      min={minDateStr}
                      max={maxDateStr}
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.date}
                      disabled={isSubmitting}
                    />
                    <div className="relative">
                      <SelectField 
                        name="seatingTime"
                        label="Seating Time" 
                        value={formData.seatingTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.seatingTime}
                        disabled={isSubmitting || isFetchingSlots}
                        options={seatingOptions} 
                      />
                      {isFetchingSlots && (
                        <div className="absolute right-8 top-10 text-on-surface-variant animate-spin">
                          <Loader2 size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface-variant">Special Requests / Seating Notes</label>
                  <span className={`font-label-sm text-label-sm ${specialRequests.length > 500 ? 'text-error' : 'text-on-surface-variant'}`}>{specialRequests.length}/500</span>
                </div>
                <textarea 
                  name="specialRequests"
                  className={`p-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors ${errors.specialRequests ? 'border border-error' : ''}`}
                  placeholder="Window booth, dietary accommodations..." 
                  rows="3"
                  value={specialRequests}
                  onChange={(e) => {
                    setSpecialRequests(e.target.value);
                    if (errors.specialRequests) setErrors(prev => ({...prev, specialRequests: null}));
                    if (submitError) setSubmitError(null);
                  }}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.specialRequests}
                  aria-describedby={errors.specialRequests ? "specialRequests-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.specialRequests && <span id="specialRequests-error" className="font-label-sm text-error" aria-live="polite">{errors.specialRequests}</span>}
              </div>
              
              <input 
                type="text" 
                name="website" 
                className="hidden" 
                tabIndex="-1" 
                autoComplete="off"
                value={formData.website || ''}
                onChange={handleChange}
              />

              <Button type="submit" variant="secondary" className="mt-2 w-full h-12 text-label-lg font-label-lg flex items-center justify-center gap-2" disabled={!validatorReady || isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Send Enquiry & Reserve</span>
                    <Send size={18} />
                  </>
                )}
              </Button>
              
              <p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-1">
                ✓ Instant confirmation SMS • No booking fee required
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
