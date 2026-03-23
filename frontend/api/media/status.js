/** GET /api/media/status — R2 presign not wired on Vercel MVP; frontend falls back to public URLs. */
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({ presign_enabled: false, ttl_seconds: 900 });
};
