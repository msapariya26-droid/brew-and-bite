function generateRef() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'BB-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  let payload = req.body || {};
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      payload = {};
    }
  }

  // Honeypot check
  if (payload.website && String(payload.website).trim() !== '') {
    return res.status(200).json({ ok: true, id: 'BB-000000' });
  }

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();

  const errors = {};
  if (!name || name.length < 2 || name.length > 60) {
    errors.name = 'Please enter a valid name (2–60 letters).';
  }
  if (!email || !email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ ok: false, errors });
  }

  const refCode = generateRef();
  return res.status(200).json({
    ok: true,
    id: refCode
  });
};
