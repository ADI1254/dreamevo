/** POST /api/media/presign — stub; add R2 signing here later if needed. */
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed', presign_enabled: false });
  }
  return res.status(200).json({ presign_enabled: false, error: 'not_configured', urls: null });
};
