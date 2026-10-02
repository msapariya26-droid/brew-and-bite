export async function fetchMenu() {
  const res = await fetch('/api/menu');
  if (!res.ok) {
    throw new Error('Failed to fetch menu from server');
  }
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || 'API returned an error');
  }
  return data.items;
}

export async function fetchSlots(date) {
  const res = await fetch(`/api/slots?date=${encodeURIComponent(date)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch slots from server');
  }
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || 'API returned an error');
  }
  return data.slots;
}

export async function submitBooking(bookingData) {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.error || 'Failed to submit booking');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  
  return await res.json();
}

export async function submitEnquiry(enquiryData) {
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(enquiryData)
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.error || 'Failed to submit enquiry');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  
  return await res.json();
}
