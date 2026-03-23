/**
 * Vercel Serverless — POST /api/save-email
 * Validates email and upserts into Supabase (service role — never expose key to browser).
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
  try {
    const p = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, 'utf8');
    raw.split(/\r?\n/).forEach(function (line) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    });
  } catch (_) { /* ignore */ }
}

loadLocalEnv();

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }
  }

  const email = (body && body.email ? String(body.email) : '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email' });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'Server configuration missing' });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const payload = {
    email: email,
    captured_at: new Date().toISOString(),
    source: (body && body.source) || 'app_start',
    mode_selected: body && Object.prototype.hasOwnProperty.call(body, 'mode_selected')
      ? body.mode_selected
      : null,
    user_agent: (body && body.user_agent) || null
  };

  const { error } = await supabase.from('email_captures').upsert(payload, {
    onConflict: 'email'
  });

  if (error) {
    console.error('save-email supabase:', error);
    return res.status(500).json({ ok: false, error: 'Save failed' });
  }

  return res.status(200).json({ ok: true });
};
