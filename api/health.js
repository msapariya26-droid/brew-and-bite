module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  return res.status(200).json({
    ok: true,
    status: 'ok'
  });
};
