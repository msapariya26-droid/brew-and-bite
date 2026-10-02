const ALL_SLOTS = [
  { id: 'morning-coffee', label: 'Morning Coffee', time: '07:00', remaining: 15, full: false },
  { id: 'brunch', label: 'Brunch', time: '09:30', remaining: 8, full: false },
  { id: 'lunch', label: 'Lunch', time: '12:00', remaining: 5, full: false },
  { id: 'afternoon-tea', label: 'Afternoon Tea', time: '15:00', remaining: 12, full: false },
  { id: 'early-dinner', label: 'Early Dinner', time: '17:30', remaining: 0, full: true },
  { id: 'dinner', label: 'Dinner', time: '19:00', remaining: 10, full: false }
];

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { date } = req.query || {};
  if (!date) {
    return res.status(400).json({
      ok: false,
      error: 'date parameter is required (YYYY-MM-DD)'
    });
  }

  if (typeof date !== 'string' || date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
    return res.status(400).json({
      ok: false,
      error: 'date must be in YYYY-MM-DD format'
    });
  }

  return res.status(200).json({
    ok: true,
    slots: ALL_SLOTS
  });
};
