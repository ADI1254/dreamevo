/**
 * DreamPulse — Supabase config
 * Copy this file to config.js and fill in your Supabase project URL and anon key.
 * Get them from: https://supabase.com/dashboard → your project → Settings → API
 * Do not commit config.js (it's in .gitignore).
 *
 * Optional: set DREAMPULSE_ANALYTICS_TO_SUPABASE = true to send journey events
 * (email_collected, journey_started, audio_started, user_paused, etc.) to the journey_analytics table.
 */
(function () {
  'use strict';
  window.DREAMPULSE_SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
  window.DREAMPULSE_SUPABASE_ANON_KEY = 'your-anon-key-here';
  // window.DREAMPULSE_ANALYTICS_TO_SUPABASE = true;
  /** Optional: Instagram reel URL — hero shows “Watch reel” when set (opens new tab). Leave unset to hide. */
  // window.DREAMEVO_INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/YOUR_REEL_ID/';
  /** Owner/admin emails allowed to use admin.html */
  // window.DREAMEVO_OWNER_EMAILS = ['owner@dreamevo.com'];
  /** Private route key required on admin page URL: admin.html?k=YOUR_KEY */
  // window.DREAMEVO_OWNER_ROUTE_KEY = 'change-this-private-key';
  /** API origin for /story/... and /static/intro_video.mp4 (default http://localhost:8000) */
  // window.DREAMEVO_API_BASE = 'https://api.yourdomain.com';
  /** Optional: full URL to intro clip (overrides default API_BASE/static/intro_video.mp4) */
  // window.DREAMEVO_INTRO_VIDEO_URL = 'https://media.yourdomain.com/intro_video.mp4';
  /** Optional: prefix assets/videos/... paths (mirror same paths on R2) */
  // window.DREAMEVO_MEDIA_BASE_URL = 'https://media.yourdomain.com';
  /** Optional: stem MP3s folder on R2 (trailing slash optional) */
  // window.DREAMEVO_STEMS_BASE_URL = 'https://media.yourdomain.com/cinematic';
  /** Optional: landing ambient loop from R2 */
  // window.DREAMEVO_AMBIENT_URL = 'https://media.yourdomain.com/ambient.mp3';
})();
