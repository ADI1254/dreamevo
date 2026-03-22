(function () {
  'use strict';

  var SUPABASE_URL = window.DREAMPULSE_SUPABASE_URL || '';
  var SUPABASE_ANON_KEY = window.DREAMPULSE_SUPABASE_ANON_KEY || '';
  var OWNER_EMAILS = Array.isArray(window.DREAMEVO_OWNER_EMAILS) ? window.DREAMEVO_OWNER_EMAILS : [];
  var OWNER_ROUTE_KEY = window.DREAMEVO_OWNER_ROUTE_KEY || '';
  var client = null;

  var authCard = document.getElementById('authCard');
  var settingsCard = document.getElementById('settingsCard');
  var authStatus = document.getElementById('authStatus');
  var settingsStatus = document.getElementById('settingsStatus');
  var ownerEmailInput = document.getElementById('ownerEmail');
  var ctaTextInput = document.getElementById('ctaText');
  var reelUrlInput = document.getElementById('reelUrl');
  var showReelInput = document.getElementById('showReel');
  var showChooseOwnDreamInput = document.getElementById('showChooseOwnDream');

  function hasValidRouteKey() {
    if (!OWNER_ROUTE_KEY) return false;
    try {
      var params = new URLSearchParams(window.location.search || '');
      var keyFromUrl = params.get('k') || '';
      return keyFromUrl === OWNER_ROUTE_KEY;
    } catch (e) {
      return false;
    }
  }

  function setStatus(el, text, isError) {
    if (!el) return;
    el.textContent = text || '';
    el.style.color = isError ? '#f5a0a0' : '';
  }

  function normalizeEmail(value) {
    return (value || '').trim().toLowerCase();
  }

  function isOwnerEmail(email) {
    var e = normalizeEmail(email);
    return OWNER_EMAILS.some(function (x) { return normalizeEmail(x) === e; });
  }

  function toggleAuthState(signedIn) {
    if (signedIn) {
      authCard.classList.add('is-hidden');
      settingsCard.classList.remove('is-hidden');
    } else {
      settingsCard.classList.add('is-hidden');
      authCard.classList.remove('is-hidden');
    }
  }

  async function ensureClient() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase config in config.js');
    }
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('Supabase SDK failed to load.');
    }
    if (!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  }

  async function sendMagicLink(email) {
    var c = await ensureClient();
    var redirectTo = window.location.origin + window.location.pathname;
    var res = await c.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: redirectTo }
    });
    if (res.error) throw res.error;
  }

  async function getCurrentUser() {
    var c = await ensureClient();
    var sessionRes = await c.auth.getSession();
    if (sessionRes.error) throw sessionRes.error;
    if (!sessionRes.data || !sessionRes.data.session) return null;
    var userRes = await c.auth.getUser();
    if (userRes.error) throw userRes.error;
    return userRes.data && userRes.data.user ? userRes.data.user : null;
  }

  async function loadSettings() {
    var c = await ensureClient();
    var out = await c.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (out.error) throw out.error;
    var row = out.data || {};
    ctaTextInput.value = row.start_cta_text || 'START YOUR JOURNEY';
    reelUrlInput.value = row.instagram_reel_url || '';
    showReelInput.checked = row.show_reel_button !== false;
    showChooseOwnDreamInput.checked = row.show_choose_own_dream !== false;
  }

  async function saveSettings() {
    var c = await ensureClient();
    var payload = {
      id: 1,
      start_cta_text: (ctaTextInput.value || '').trim() || 'START YOUR JOURNEY',
      instagram_reel_url: (reelUrlInput.value || '').trim() || null,
      show_reel_button: !!showReelInput.checked,
      show_choose_own_dream: !!showChooseOwnDreamInput.checked,
      updated_at: new Date().toISOString()
    };
    var out = await c.from('site_settings').upsert(payload, { onConflict: 'id' });
    if (out.error) throw out.error;
  }

  async function tryRestoreSession() {
    try {
      var user = await getCurrentUser();
      if (!user) return;
      if (!isOwnerEmail(user.email || '')) {
        setStatus(authStatus, 'Signed in, but this email is not in DREAMEVO_OWNER_EMAILS.', true);
        toggleAuthState(false);
        return;
      }
      toggleAuthState(true);
      setStatus(settingsStatus, 'Signed in as ' + user.email);
      await loadSettings();
    } catch (err) {
      setStatus(authStatus, err && err.message ? err.message : 'Could not restore session.', true);
    }
  }

  if (!hasValidRouteKey()) {
    toggleAuthState(false);
    setStatus(authStatus, 'Private owner access key missing or invalid.', true);
    var authFormBlocked = document.getElementById('authForm');
    if (authFormBlocked) authFormBlocked.classList.add('is-hidden');
    var refreshBtnBlocked = document.getElementById('refreshSessionBtn');
    if (refreshBtnBlocked) refreshBtnBlocked.classList.add('is-hidden');
    return;
  }

  document.getElementById('authForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = normalizeEmail(ownerEmailInput.value);
    if (!email) {
      setStatus(authStatus, 'Enter your owner email first.', true);
      return;
    }
    if (!OWNER_EMAILS.length) {
      setStatus(authStatus, 'Add DREAMEVO_OWNER_EMAILS in config.js first.', true);
      return;
    }
    if (!isOwnerEmail(email)) {
      setStatus(authStatus, 'This email is not in DREAMEVO_OWNER_EMAILS.', true);
      return;
    }
    try {
      setStatus(authStatus, 'Sending magic link...');
      await sendMagicLink(email);
      setStatus(authStatus, 'Magic link sent. Open your email and click it, then press refresh session.');
    } catch (err) {
      setStatus(authStatus, err && err.message ? err.message : 'Failed to send magic link.', true);
    }
  });

  document.getElementById('refreshSessionBtn').addEventListener('click', function () {
    tryRestoreSession();
  });

  document.getElementById('settingsForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      setStatus(settingsStatus, 'Saving...');
      await saveSettings();
      setStatus(settingsStatus, 'Settings saved. Reload the landing page to verify.');
    } catch (err) {
      setStatus(settingsStatus, err && err.message ? err.message : 'Save failed.', true);
    }
  });

  document.getElementById('signOutBtn').addEventListener('click', async function () {
    try {
      var c = await ensureClient();
      await c.auth.signOut();
      toggleAuthState(false);
      setStatus(authStatus, 'Signed out.');
      setStatus(settingsStatus, '');
    } catch (err) {
      setStatus(settingsStatus, err && err.message ? err.message : 'Sign-out failed.', true);
    }
  });

  tryRestoreSession();
})();
