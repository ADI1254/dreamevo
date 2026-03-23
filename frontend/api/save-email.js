/**
 * Vercel Serverless — POST /api/save-email
 * Validates email and upserts into Supabase (service role — never expose key to browser).
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

const RATE_WINDOW_MS = Number(process.env.EMAIL_RATE_WINDOW_MS || 10 * 60 * 1000);
const RATE_MAX_REQUESTS = Number(process.env.EMAIL_RATE_MAX_REQUESTS || 15);
const rateBucket = new Map();

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

function rateKey(req) {
  const ip = getClientIp(req);
  const ua = String(req.headers['user-agent'] || '').slice(0, 200);
  return crypto.createHash('sha256').update(ip + '|' + ua).digest('hex');
}

function isRateLimited(req) {
  const now = Date.now();
  const key = rateKey(req);
  const bucket = rateBucket.get(key);
  if (!bucket || now >= bucket.resetAt) {
    rateBucket.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { limited: false, retryAfterSec: Math.ceil(RATE_WINDOW_MS / 1000) };
  }
  bucket.count += 1;
  if (bucket.count > RATE_MAX_REQUESTS) {
    return { limited: true, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { limited: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, error: 'Missing captcha token' };

  const params = new URLSearchParams();
  params.set('secret', secret);
  params.set('response', String(token));
  if (ip) params.set('remoteip', ip);

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const d = await r.json();
    if (!d || !d.success) return { ok: false, error: 'Captcha verification failed' };
    return { ok: true, skipped: false };
  } catch {
    return { ok: false, error: 'Captcha verification unavailable' };
  }
}

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

  const limit = isRateLimited(req);
  if (limit.limited) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ ok: false, error: 'Too many requests' });
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

  const captchaToken =
    (body && body.turnstile_token) ||
    (body && body.cf_turnstile_response) ||
    (body && body['cf-turnstile-response']) ||
    null;
  const captcha = await verifyTurnstile(captchaToken, getClientIp(req));
  if (!captcha.ok) {
    return res.status(400).json({ ok: false, error: captcha.error });
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
