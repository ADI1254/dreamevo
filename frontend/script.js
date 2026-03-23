/* ============================================
   DreamPulse — Premium Immersive Experience
   State Management & Cinematic Interactions
   ============================================ */

// ============================================
// State Management
// ============================================

let appState = {
  isActive: false,
  userName: '',
  world: 'journey',
  mood: 'calm',
  /** When true, mood/viking chapter videos are not loaded (audio-first journey). */
  suppressChapterVideo: false
};

var _userInitiatedPause = false;
var _journeyCompleted = false;
var _audioStartedTracked = false;
var _connectionErrorTryAgain = null;
var _journeyIntroVideoFinished = false;

// ============================================
// Journey progress & returning user (localStorage)
// ============================================

var STORAGE_KEYS = {
  progress: 'dreampulse_journey_progress',
  completed: 'dreampulse_journey_completed'
};

function saveProgress(data) {
  try {
    var payload = {
      inProgress: true,
      world: data.world || appState.world,
      mood: data.mood || appState.mood,
      userName: data.userName != null ? data.userName : (appState.userName || ''),
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(payload));
  } catch (e) {}
}

function getProgress() {
  try {
    var raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return null;
    var p = JSON.parse(raw);
    return p && p.inProgress ? p : null;
  } catch (e) {
    return null;
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.progress);
  } catch (e) {}
}

/** Keep <html> scroll class in sync with body.view-landing (mobile landing scroll + :has fallback). */
function syncViewLandingDocClass() {
  try {
    if (document.body && document.body.classList.contains('view-landing')) {
      document.documentElement.classList.add('view-landing-doc');
    } else {
      document.documentElement.classList.remove('view-landing-doc');
    }
  } catch (e) { /* ignore */ }
}

function setJourneyCompleted() {
  try {
    localStorage.setItem(STORAGE_KEYS.completed, 'true');
  } catch (e) {}
}

function getJourneyCompleted() {
  try {
    return localStorage.getItem(STORAGE_KEYS.completed) === 'true';
  } catch (e) {
    return false;
  }
}

function showConnectionError(tryAgainCallback) {
  _connectionErrorTryAgain = tryAgainCallback || null;
  var overlay = document.getElementById('connectionErrorOverlay');
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
  }
}

function hideConnectionError() {
  _connectionErrorTryAgain = null;
  var overlay = document.getElementById('connectionErrorOverlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

function showContinueJourneyOverlay() {
  var overlay = document.getElementById('continueJourneyOverlay');
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
  }
}

function hideContinueJourneyOverlay() {
  var overlay = document.getElementById('continueJourneyOverlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

function showReturningUserOverlay(email) {
  var overlay = document.getElementById('returningUserOverlay');
  var textEl = document.getElementById('returningUserEmailText');
  if (textEl) {
    textEl.textContent = email ? 'Welcome back, ' + email + '. Ready for another journey?' : 'Ready for another journey?';
  }
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
  }
}

function hideReturningUserOverlay() {
  var overlay = document.getElementById('returningUserOverlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// ============================================
// Analytics — user journey events (console now; Supabase optional later)
// ============================================

function generateSessionId() {
  return 'dp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11);
}

var _analyticsSessionId = null;
function getSessionId() {
  if (_analyticsSessionId == null) _analyticsSessionId = generateSessionId();
  return _analyticsSessionId;
}

function getAnalyticsUserEmail() {
  try {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('userEmail')) || '';
  } catch (e) {
    return '';
  }
}

function trackEvent(eventName, extra) {
  var payload = {
    event: eventName,
    timestamp: Date.now(),
    user_email: getAnalyticsUserEmail(),
    mode: appState && appState.world ? appState.world : '',
    session_id: getSessionId()
  };
  if (extra && typeof extra === 'object') {
    Object.keys(extra).forEach(function (k) {
      payload[k] = extra[k];
    });
  }
  console.log('[DreamPulse Analytics]', JSON.stringify(payload));
  // Optional: send to Supabase analytics table (enable when ready)
  if (typeof window !== 'undefined' && window.DREAMPULSE_ANALYTICS_TO_SUPABASE && SUPABASE_URL && SUPABASE_ANON_KEY) {
    sendAnalyticsToSupabase(payload);
  }
}

function sendAnalyticsToSupabase(payload) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  var url = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/journey_analytics';
  var row = {
    session_id: payload.session_id || '',
    user_email: payload.user_email || null,
    event_type: payload.event || 'unknown',
    event_data: {
      timestamp: payload.timestamp,
      mode: payload.mode || null,
      mood: payload.mood || null,
      pause_timestamp: payload.pause_timestamp || null
    }
  };
  var body = JSON.stringify(row);
  if (navigator.sendBeacon) {
    var blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: body
    }).catch(function () {});
  }
}

/**
 * Call when user submits feedback (e.g. rating or comment). Saves to Supabase feedback table if configured.
 * Optional payload: rating (1-5), comment, user_email.
 */
function trackFeedbackSubmitted(data) {
  var d = data || {};
  trackEvent('feedback_submitted', d);
  if (SUPABASE_URL && SUPABASE_ANON_KEY && (d.rating != null || (d.comment && d.comment.trim()))) {
    saveFeedbackToSupabase(d);
  }
}

function saveFeedbackToSupabase(data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  var payload = {
    user_email: (data.user_email || getAnalyticsUserEmail() || '').trim() || null,
    rating: data.rating != null ? Math.max(1, Math.min(5, Number(data.rating))) : null,
    comment: (data.comment && data.comment.trim()) ? data.comment.trim() : null
  };
  if (payload.rating == null && !payload.comment) return;
  fetch(SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  }).catch(function (err) { console.warn('Feedback save failed:', err); });
}

// ============================================
// Email capture: Supabase config (set window.DREAMPULSE_SUPABASE_URL / DREAMPULSE_SUPABASE_ANON_KEY)
// ============================================
const SUPABASE_URL = typeof window !== 'undefined' && window.DREAMPULSE_SUPABASE_URL ? window.DREAMPULSE_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof window !== 'undefined' && window.DREAMPULSE_SUPABASE_ANON_KEY ? window.DREAMPULSE_SUPABASE_ANON_KEY : '';
var OWNER_SITE_SETTINGS = {};

function normalizeOnOffValue(value, fallbackValue) {
  if (value == null) return !!fallbackValue;
  if (typeof value === 'boolean') return value;
  var v = String(value).trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
  return !!fallbackValue;
}

function applyOwnerSiteSettings(settings) {
  OWNER_SITE_SETTINGS = settings || {};
  var cta = document.getElementById('landingCta');
  if (cta) {
    var ctaText = OWNER_SITE_SETTINGS.start_cta_text;
    cta.textContent = (ctaText && String(ctaText).trim()) ? String(ctaText).trim() : 'START YOUR JOURNEY';
  }

  var reelLink = document.getElementById('landingInstagramReel');
  if (reelLink) {
    var fromSettings = OWNER_SITE_SETTINGS.instagram_reel_url;
    var fromConfig = (typeof window !== 'undefined') ? window.DREAMEVO_INSTAGRAM_REEL_URL : '';
    var reelUrl = (fromSettings && String(fromSettings).trim()) ? String(fromSettings).trim() : (fromConfig || '');
    var showReel = normalizeOnOffValue(OWNER_SITE_SETTINGS.show_reel_button, !!reelUrl);
    if (showReel && reelUrl) {
      reelLink.href = reelUrl;
      reelLink.setAttribute('target', '_blank');
      reelLink.setAttribute('rel', 'noopener noreferrer');
      reelLink.style.display = '';
    } else {
      reelLink.style.display = 'none';
    }
  }

  var chooseOwnSection = document.getElementById('choose-your-own-dream');
  if (chooseOwnSection) {
    var showChooseOwn = normalizeOnOffValue(OWNER_SITE_SETTINGS.show_choose_own_dream, true);
    chooseOwnSection.style.display = showChooseOwn ? '' : 'none';
  }
}

function loadOwnerSiteSettings() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    applyOwnerSiteSettings({});
    return Promise.resolve();
  }
  var url = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/site_settings?id=eq.1&select=*';
  return fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    }
  }).then(function (res) {
    if (!res.ok) return [];
    return res.json();
  }).then(function (rows) {
    var row = (rows && rows[0]) ? rows[0] : {};
    applyOwnerSiteSettings(row || {});
    return Promise.resolve();
  }).catch(function () {
    applyOwnerSiteSettings({});
    return Promise.resolve();
  });
}

function isValidEmail(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function getTurnstileTokenFromForm(formId) {
  var form = document.getElementById(formId);
  if (!form) return '';
  var tokenInput = form.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
  return tokenInput && tokenInput.value ? String(tokenInput.value).trim() : '';
}

function initTurnstileWidgets() {
  if (typeof window === 'undefined') return;
  if (!window.DREAMEVO_TURNSTILE_SITE_KEY) return;
  if (!window.turnstile || typeof window.turnstile.render !== 'function') {
    setTimeout(initTurnstileWidgets, 400);
    return;
  }
  var siteKey = String(window.DREAMEVO_TURNSTILE_SITE_KEY).trim();
  if (!siteKey) return;
  ['turnstileChooseOwn', 'turnstilePricing', 'turnstileMainEmail'].forEach(function (id) {
    var node = document.getElementById(id);
    if (!node || node.getAttribute('data-turnstile-mounted') === '1') return;
    try {
      window.turnstile.render('#' + id, { sitekey: siteKey, theme: 'dark' });
      node.setAttribute('data-turnstile-mounted', '1');
    } catch (e) {
      console.warn('Turnstile render failed:', id, e);
    }
  });
}

/**
 * Save email via Vercel serverless POST /api/save-email (service role on server — no anon key in browser).
 * Uses upsert: one row per email in Supabase email_captures.
 * On failure: log, show toast, but always resolve so user can proceed to audio.
 */
function saveEmailToSupabase(email, opts) {
  if (typeof window !== 'undefined' && window.DREAMEVO_DISABLE_EMAIL_API) {
    return Promise.resolve();
  }
  var formId = (opts && opts.formId) ? String(opts.formId) : '';
  var turnstileToken = formId ? getTurnstileTokenFromForm(formId) : '';
  var turnstileRequired = !!(typeof window !== 'undefined' && window.DREAMEVO_TURNSTILE_SITE_KEY);
  if (turnstileRequired && !turnstileToken) {
    showToast('Please complete verification and try again.');
    return Promise.resolve();
  }
  var source = (opts && opts.source) ? opts.source : 'app_start';
  var modeSel = (opts && Object.prototype.hasOwnProperty.call(opts, 'mode_selected'))
    ? opts.mode_selected
    : ((appState && appState.world) ? appState.world : null);
  var payload = {
    email: email.trim().toLowerCase(),
    source: source,
    mode_selected: modeSel,
    user_agent: typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : null,
    turnstile_token: turnstileToken || null
  };
  return fetch(apiUrl('/api/save-email'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function (res) {
    if (!res.ok) {
      console.error('save-email failed:', res.status, res.statusText);
      showToast("Couldn't save email, but enjoy your journey!");
    }
    return Promise.resolve();
  }).catch(function (err) {
    console.error('save-email failed:', err);
    showToast("Couldn't save email, but enjoy your journey!");
    return Promise.resolve();
  });
}

function showToast(message) {
  const existing = document.getElementById('dreampulse-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'dreampulse-toast';
  toast.className = 'dreampulse-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(function () {
    toast.classList.add('dreampulse-toast--visible');
  });
  setTimeout(function () {
    toast.classList.remove('dreampulse-toast--visible');
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, 4000);
}

function updateEmailSubmitState() {
  var emailInput = document.getElementById('emailCollectionInput');
  var btn = document.getElementById('emailCollectionSubmit');
  if (!btn) return;
  var emailValid = emailInput && isValidEmail(emailInput.value.trim());
  btn.disabled = !emailValid;
}

/**
 * Preload stem narration for (world, mood) so "Choose Experience" + email step matches the selected mode.
 * When ready, submit stays enabled; on error shows retry UI.
 */
function startJourneyAudioPreload(world, mood) {
  mood = mood || appState.mood || 'calm';
  var basePath = STEM_CONFIG.basePath;
  var format = STEM_CONFIG.format;
  var stemPrefix = world + '_' + mood;
  var btn = document.getElementById('emailCollectionSubmit');
  var loadingEl = document.getElementById('emailPreloadLoading');
  var errorEl = document.getElementById('emailPreloadError');
  var retryBtn = document.getElementById('emailPreloadRetry');

  journeyPreloadReady = false;
  journeyPreloadError = false;
  if (journeyPreloadTimeout) {
    clearTimeout(journeyPreloadTimeout);
    journeyPreloadTimeout = null;
  }
  if (journeyPreloadAudio) {
    journeyPreloadAudio.pause();
    journeyPreloadAudio.src = '';
    journeyPreloadAudio = null;
  }
  journeyPreloadMood = null;

  if (loadingEl) {
    loadingEl.style.display = '';
    loadingEl.setAttribute('aria-hidden', 'false');
  }
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.setAttribute('aria-hidden', 'true');
  }

  journeyPreloadWorld = world;
  journeyPreloadMood = mood;

  function setReady() {
    journeyPreloadReady = true;
    if (loadingEl) {
      loadingEl.style.display = 'none';
      loadingEl.setAttribute('aria-hidden', 'true');
    }
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.setAttribute('aria-hidden', 'true');
    }
    updateEmailSubmitState();
  }

  function setError() {
    journeyPreloadError = true;
    if (loadingEl) {
      loadingEl.style.display = 'none';
      loadingEl.setAttribute('aria-hidden', 'true');
    }
    if (errorEl) {
      errorEl.style.display = 'block';
      errorEl.setAttribute('aria-hidden', 'false');
    }
  }

  function markReady() {
    if (journeyPreloadReady) return;
    setReady();
  }

  function wirePreloadAudio(narrationUrlFinal) {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('loadeddata', markReady, { once: true });
    audio.addEventListener('canplaythrough', markReady, { once: true });
    audio.addEventListener('error', function () {
      setError();
    }, { once: true });
    audio.src = narrationUrlFinal;
    journeyPreloadAudio = audio;
    journeyPreloadTimeout = setTimeout(function () {
      journeyPreloadTimeout = null;
      if (!journeyPreloadReady && !journeyPreloadError) {
        setError();
      }
    }, 15000);
  }

  var fallbackNarration = basePath + stemPrefix + '_narration' + format;
  fetchMediaPresignStatus(function () {
    if (_mediaPresignEnabled) {
      presignJourneyMedia(world, mood, function (err) {
        var url =
          !err &&
          window.__secureMediaUrls &&
          window.__secureMediaUrls.stems &&
          window.__secureMediaUrls.stems.narration
            ? window.__secureMediaUrls.stems.narration
            : fallbackNarration;
        wirePreloadAudio(url);
      });
    } else {
      wirePreloadAudio(fallbackNarration);
    }
  });
}

function requestWakeLock() {
  if (typeof navigator !== 'undefined' && navigator.wakeLock && navigator.wakeLock.request) {
    navigator.wakeLock.request('screen').then(function (handle) {
      wakeLockHandle = handle;
      handle.addEventListener('release', function () {
        wakeLockHandle = null;
      });
    }).catch(function (err) {
      console.warn('Wake Lock not available:', err);
    });
  }
  lockOrientationPortrait();
}

function releaseWakeLock() {
  unlockOrientation();
  if (wakeLockHandle) {
    try {
      wakeLockHandle.release();
    } catch (e) {}
    wakeLockHandle = null;
  }
}

function lockOrientationPortrait() {
  if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.lock === 'function') {
    screen.orientation.lock('portrait').catch(function () {});
  }
}

function unlockOrientation() {
  if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.unlock === 'function') {
    try { screen.orientation.unlock(); } catch (e) {}
  }
}

function setupMediaSession() {
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'DreamPulse Journey',
    artist: 'DreamPulse',
    album: 'Guided Dream Immersion'
  });
  navigator.mediaSession.setActionHandler('play', function () {
    togglePlaybackPause();
  });
  navigator.mediaSession.setActionHandler('pause', function () {
    _userInitiatedPause = true;
    togglePlaybackPause();
  });
  navigator.mediaSession.setActionHandler('stop', function () {
    _userInitiatedPause = true;
    if (stemAudio.narration && stemLoaded.narration) stopAllStems(); else stopAllAudio();
  });
  try {
    navigator.mediaSession.setActionHandler('seekbackward', function () {
      var el = getMainPlaybackElement();
      if (el && el.duration) el.currentTime = Math.max(0, el.currentTime - 10);
    });
    navigator.mediaSession.setActionHandler('seekforward', function () {
      var el = getMainPlaybackElement();
      if (el && el.duration) el.currentTime = Math.min(el.duration, el.currentTime + 10);
    });
  } catch (e) {}
  updateMediaSessionState('playing');
}

function updateMediaSessionState(state) {
  if (typeof navigator === 'undefined' || !navigator.mediaSession || !navigator.mediaSession.setPositionState) return;
  var el = getMainPlaybackElement();
  if (!el || !el.duration || !isFinite(el.duration)) return;
  try {
    navigator.mediaSession.playbackState = state;
    navigator.mediaSession.setPositionState({
      duration: el.duration,
      playbackRate: el.playbackRate || 1,
      position: el.currentTime
    });
  } catch (err) {}
}

function clearMediaSession() {
  if (typeof navigator !== 'undefined' && navigator.mediaSession) {
    navigator.mediaSession.metadata = null;
    try { navigator.mediaSession.setActionHandler('play', null); } catch (e) {}
    try { navigator.mediaSession.setActionHandler('pause', null); } catch (e) {}
    try { navigator.mediaSession.setActionHandler('stop', null); } catch (e) {}
    try { navigator.mediaSession.setActionHandler('seekbackward', null); } catch (e) {}
    try { navigator.mediaSession.setActionHandler('seekforward', null); } catch (e) {}
  }
}

function attachPlaybackPauseHandler(element) {
  if (!element || element._dreamPulsePauseHandler) return;
  function onPause() {
    if (!appState.isActive) return;
    if (_userInitiatedPause) {
      _userInitiatedPause = false;
      return;
    }
    showToast('Playback paused. Tap the screen to show controls and resume.');
    showPlaybackEscapeControls();
  }
  element._dreamPulsePauseHandler = onPause;
  element.addEventListener('pause', onPause);
}

function togglePlaybackPause() {
  if (stemAudio.narration && stemLoaded.narration) {
    if (stemAudio.narration.paused) {
      stemAudio.narration.play().catch(function () {});
      if (stemAudio.ambient && stemLoaded.ambient) stemAudio.ambient.play().catch(function () {});
      updateMediaSessionState('playing');
      trackEvent('user_resumed');
    } else {
      _userInitiatedPause = true;
      trackEvent('user_paused', { pause_timestamp: Date.now() });
      stemAudio.narration.pause();
      if (stemAudio.ambient && stemLoaded.ambient) stemAudio.ambient.pause();
      updateMediaSessionState('paused');
    }
    return;
  }
  if (typeof speechSynthesis !== 'undefined') {
    if (speechSynthesis.speaking) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        trackEvent('user_resumed');
      } else {
        trackEvent('user_paused', { pause_timestamp: Date.now() });
        speechSynthesis.pause();
      }
    }
  }
  var el = getElements();
  if (el.ambientAudio) {
    if (el.ambientAudio.paused) {
      el.ambientAudio.play().catch(function () {});
      updateMediaSessionState('playing');
      trackEvent('user_resumed');
    } else {
      _userInitiatedPause = true;
      trackEvent('user_paused', { pause_timestamp: Date.now() });
      el.ambientAudio.pause();
      updateMediaSessionState('paused');
    }
  }
}

function getMainPlaybackElement() {
  if (stemAudio.narration && stemLoaded.narration) return stemAudio.narration;
  var el = getElements();
  return el.ambientAudio || null;
}

function updatePlaybackEscapeProgress() {
  var slider = document.getElementById('playbackSeekSlider');
  var fill = document.getElementById('playbackProgressFill');
  var el = getMainPlaybackElement();
  if (!el || !el.duration || !isFinite(el.duration)) {
    if (slider) {
      slider.value = '0';
      slider.disabled = true;
    }
    if (fill) fill.style.width = '0%';
    return;
  }
  if (slider) {
    slider.disabled = false;
    slider.value = String(Math.round((el.currentTime / el.duration) * 1000));
  }
  if (fill) {
    var pct = (el.currentTime / el.duration) * 100;
    fill.style.width = pct + '%';
  }
}

function skipToEndPlayback() {
  if (stemAudio.narration && stemLoaded.narration) {
    var d = stemAudio.narration.duration;
    if (isFinite(d)) {
      stemAudio.narration.currentTime = Math.max(0, d - 0.2);
    }
    return;
  }
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  var el = getElements();
  if (el.ambientAudio) {
    el.ambientAudio.pause();
    el.ambientAudio.currentTime = 0;
  }
}

function showPlaybackEscapeControls() {
  var hatch = document.getElementById('playbackEscapeHatch');
  if (!hatch || !document.body.classList.contains('state-active')) return;
  hatch.classList.add('is-visible');
  hatch.setAttribute('aria-hidden', 'false');
  updatePlaybackEscapeProgress();
  if (playbackEscapeProgressInterval) clearInterval(playbackEscapeProgressInterval);
  playbackEscapeProgressInterval = setInterval(updatePlaybackEscapeProgress, 250);
  var main = getMainPlaybackElement();
  var pauseBtn = document.getElementById('playbackPausePlayBtn');
  if (pauseBtn) {
    pauseBtn.textContent = main && main.paused ? '▶' : '‖';
    pauseBtn.setAttribute('aria-label', main && main.paused ? 'Play' : 'Pause');
  }
  resetPlaybackEscapeHideTimeout();
}

function hidePlaybackEscapeControls() {
  var hatch = document.getElementById('playbackEscapeHatch');
  if (hatch) {
    hatch.classList.remove('is-visible');
    hatch.setAttribute('aria-hidden', 'true');
  }
  if (playbackEscapeHideTimeout) {
    clearTimeout(playbackEscapeHideTimeout);
    playbackEscapeHideTimeout = null;
  }
  if (playbackEscapeProgressInterval) {
    clearInterval(playbackEscapeProgressInterval);
    playbackEscapeProgressInterval = null;
  }
}

function resetPlaybackEscapeHideTimeout() {
  if (playbackEscapeHideTimeout) clearTimeout(playbackEscapeHideTimeout);
  playbackEscapeHideTimeout = setTimeout(function () {
    hidePlaybackEscapeControls();
  }, 5000);
}

// ============================================
// Pre-Rendered Stem Configuration
// ============================================

const STEM_CONFIG = {
  enabled: true, // Set to false to use TTS fallback
  basePath: 'assets/audio/CINEMATIC_AUDIO/',
  format: '.mp3', // Use .mp3 for web, .wav for highest quality
  stems: {
    narration: true,  // {world}_{mood}_narration.mp3
    ambient: true,    // {world}_{mood}_ambient.mp3 (loops)
    sfx: true         // {world}_{mood}_sfx.mp3 (timed events)
  },
  volumes: {
    narration: 1.0,   // Full volume - primary focus
    ambient: 0.35,    // Background bed
    sfx: 0.6          // Punctuation/accents
  },
  ducking: {
    enabled: true,
    targetVolume: 0.15,  // Reduce ambient/SFX during narration
    fadeDuration: 600    // ms
  },
  // High-quality pre-rendered narration files
  preRendered: {
    clearing: {
      narration: 'the_clearing_narration.mp3',  // ElevenLabs Turbo v2, high-quality
      description: 'THE CLEARING - Cinematic audio cinema experience'
    },
    journey_calm: {
      narration: 'journey_calm_narration.mp3',  // ElevenLabs
      description: 'JOURNEY - Calm mood narration'
    }
  }
};

if (typeof window !== 'undefined' && window.DREAMEVO_STEMS_BASE_URL) {
  var stemsBase = String(window.DREAMEVO_STEMS_BASE_URL).replace(/\/$/, '') + '/';
  STEM_CONFIG.basePath = stemsBase;
}

let stemAudio = {
  narration: null,
  ambient: null,
  sfx: null
};

let stemLoaded = {
  narration: false,
  ambient: false,
  sfx: false
};

let usingStemsMode = false;

// Track last video to avoid redundant reloads
let lastVideoSrc = null;

// Journey audio preload (before email screen): enable "Begin Journey" when ready
var journeyPreloadAudio = null;
var journeyPreloadWorld = null;
var journeyPreloadMood = null;
var journeyPreloadReady = false;
var journeyPreloadError = false;
var journeyPreloadTimeout = null;

// Wake Lock: keep screen on during playback
var wakeLockHandle = null;

// Escape hatch: show controls for 3s then fade out
var playbackEscapeHideTimeout = null;
var playbackEscapeProgressInterval = null;

// ============================================
// Sound Effects Management
// ============================================

let soundLayers = {};
let currentAmbience = null;
let currentLayerAudios = [];

/**
 * Cinematic sound design map matching narrative progression
 * Mapped to percentage of story progression for precise timing
 */
const soundMap = {
  // 0% - Opening: The message/fever-struck urgency
  opening: {
    ambience: 'SOUND EFFECTS/mixkit-night-forest-with-insects-2414.wav',
    layers: [],
    volume: 0.2,
    fade: 'in',
    duration: 8000
  },
  
  // 15% - Jungle Entry/Dawn: Crossing the threshold
  jungleEntry: {
    ambience: 'SOUND EFFECTS/nature-ambience-323729.mp3',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-morning-birds-2472.wav', volume: 0.25, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.15, delay: 2 }
    ],
    volume: 0.4,
    fade: 'crossfade'
  },

  // 25% - First Hour Deception: Trails vanishing, air thickens
  firstHourDeception: {
    ambience: 'SOUND EFFECTS/mixkit-night-forest-with-insects-2414.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-footsteps-on-tall-grass-532.wav', volume: 0.2, delay: 1, loop: true },
      { sound: 'SOUND EFFECTS/birds-forest-nature-445379.mp3', volume: 0.15, delay: 3 }
    ],
    volume: 0.35
  },

  // 35% - Moving Deeper: Map leading deeper, roots form bridges
  movingDeeper: {
    ambience: 'SOUND EFFECTS/spring-forest-nature-332842.mp3',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.2, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-footsteps-on-tall-grass-532.wav', volume: 0.18, delay: 2, loop: true }
    ],
    volume: 0.38
  },

  // 45% - Ravine Approach: Ground dips, fog, water
  ravineApproach: {
    ambience: 'SOUND EFFECTS/mixkit-water-flowing-ambience-loop-3126.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.2, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-rain-long-loop-2394.wav', volume: 0.12, delay: 3 }
    ],
    volume: 0.4
  },

  // 50% - Crossing Water: Wading through stream, chest-high
  crossingWater: {
    ambience: 'SOUND EFFECTS/mixkit-fish-moving-in-water-2921.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-water-flowing-ambience-loop-3126.wav', volume: 0.3, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.15, delay: 1 }
    ],
    volume: 0.45,
    fade: 'up'
  },

  // 60% - Hostile Jungle: Thorns, roots, branches snapping, dusk
  hostileJungle: {
    ambience: 'SOUND EFFECTS/mixkit-night-forest-with-insects-2414.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-strong-wild-wind-in-a-storm-2407.wav', volume: 0.25, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-flock-of-wild-geese-20.wav', volume: 0.2, delay: 2 }
    ],
    volume: 0.4
  },

  // 70% - Bone Grove: Eerie, white trees, warnings
  boneGrove: {
    ambience: 'SOUND EFFECTS/mixkit-calm-thunderstorm-in-the-jungle-2415.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.18, delay: 1 },
      { sound: 'SOUND EFFECTS/mixkit-heavy-rain-drops-2399.wav', volume: 0.1, delay: 3 }
    ],
    volume: 0.35,
    fade: 'slow'
  },

  // 80% - Night Journey: Complete darkness, hand on bark, breakthrough
  nightJourney: {
    ambience: 'SOUND EFFECTS/mixkit-night-forest-with-insects-2414.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.12, delay: 0 },
      { sound: 'SOUND EFFECTS/mixkit-rain-long-loop-2394.wav', volume: 0.08, delay: 2 }
    ],
    volume: 0.25,
    fade: 'very-slow'
  },

  // 85% - Temple Discovery: Blue-green glow, sentinels, descent
  templeDiscovery: {
    ambience: 'SOUND EFFECTS/mixkit-calm-thunderstorm-in-the-jungle-2415.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-water-flowing-ambience-loop-3126.wav', volume: 0.2, delay: 1 },
      { sound: 'SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav', volume: 0.12, delay: 2 }
    ],
    volume: 0.3,
    fade: 'in'
  },

  // 92% - Chamber & Princess: Temple hums, resolution
  chamberResolution: {
    ambience: 'SOUND EFFECTS/mixkit-river-surroundings-in-the-jungle-2451.wav',
    layers: [
      { sound: 'SOUND EFFECTS/mixkit-water-flowing-ambience-loop-3126.wav', volume: 0.15, delay: 0 }
    ],
    volume: 0.28,
    fade: 'gentle'
  },

  // 100% - Completion: Mission fulfilled, gentle fade out
  completion: {
    ambience: 'SOUND EFFECTS/mixkit-river-surroundings-in-the-jungle-2451.wav',
    layers: [],
    volume: 0.15,
    fade: 'out'
  }
};

/**
 * Get sound config based on narrative progress
 */
function getSoundConfigForProgress(progress) {
  // progress is 0-1
  if (progress < 0.10) return soundMap.opening;
  if (progress < 0.20) return soundMap.jungleEntry;
  if (progress < 0.30) return soundMap.firstHourDeception;
  if (progress < 0.40) return soundMap.movingDeeper;
  if (progress < 0.48) return soundMap.ravineApproach;
  if (progress < 0.55) return soundMap.crossingWater;
  if (progress < 0.68) return soundMap.hostileJungle;
  if (progress < 0.78) return soundMap.boneGrove;
  if (progress < 0.85) return soundMap.nightJourney;
  if (progress < 0.90) return soundMap.templeDiscovery;
  if (progress < 0.98) return soundMap.chamberResolution;
  return soundMap.completion;
}

/**
 * Initialize sound layer
 */
function initSoundLayers() {
  const audioContainer = document.getElementById('soundContainer');
  if (!audioContainer) {
    const container = document.createElement('div');
    container.id = 'soundContainer';
    container.style.display = 'none';
    document.body.appendChild(container);
  }
}

/**
 * Stop all current layer sounds
 */
function stopAllLayers() {
  currentLayerAudios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  currentLayerAudios = [];
}

/**
 * Play ambient sound layer with smooth transitions
 */
function playAmbience(soundConfig, duration) {
  if (!soundConfig || !soundConfig.ambience) return;
  
  const audio = new Audio(soundConfig.ambience);
  audio.loop = true;
  audio.volume = soundConfig.volume || 0.3;
  
  // Handle fade-in
  if (soundConfig.fade === 'in' || soundConfig.fade === 'crossfade') {
    audio.volume = 0;
    let vol = 0;
    const targetVol = soundConfig.volume || 0.3;
    const fadeInterval = setInterval(() => {
      vol += 0.08;
      if (vol >= targetVol) {
        audio.volume = targetVol;
        clearInterval(fadeInterval);
      } else {
        audio.volume = vol;
      }
    }, 80);
  } else if (soundConfig.fade === 'slow') {
    audio.volume = 0;
    let vol = 0;
    const targetVol = soundConfig.volume || 0.3;
    const fadeInterval = setInterval(() => {
      vol += 0.04;
      if (vol >= targetVol) {
        audio.volume = targetVol;
        clearInterval(fadeInterval);
      } else {
        audio.volume = vol;
      }
    }, 100);
  } else if (soundConfig.fade === 'very-slow') {
    audio.volume = 0;
    let vol = 0;
    const targetVol = soundConfig.volume || 0.3;
    const fadeInterval = setInterval(() => {
      vol += 0.02;
      if (vol >= targetVol) {
        audio.volume = targetVol;
        clearInterval(fadeInterval);
      } else {
        audio.volume = vol;
      }
    }, 120);
  } else if (soundConfig.fade === 'up') {
    audio.volume = soundConfig.volume * 0.3;
    let vol = soundConfig.volume * 0.3;
    const targetVol = soundConfig.volume;
    const fadeInterval = setInterval(() => {
      vol += 0.06;
      if (vol >= targetVol) {
        audio.volume = targetVol;
        clearInterval(fadeInterval);
      } else {
        audio.volume = vol;
      }
    }, 100);
  }
  
  audio.play().catch(err => console.warn('Ambience play failed:', err));
  
  // Stop previous ambience
  if (currentAmbience) {
    currentAmbience.pause();
  }
  currentAmbience = audio;
  
  console.log('🎵 AMBIENCE:', soundConfig.ambience.split('/').pop(), `(vol: ${soundConfig.volume})`);
  
  return audio;
}

/**
 * Add sound layer effect with timing
 */
function playLayerEffect(layerConfig) {
  if (!layerConfig.sound) return;
  
  setTimeout(() => {
    const audio = new Audio(layerConfig.sound);
    audio.volume = layerConfig.volume || 0.2;
    if (layerConfig.loop) {
      audio.loop = true;
    }
    audio.play().catch(err => console.warn('Layer play failed:', err));
    currentLayerAudios.push(audio);
    console.log(`  ├─ Layer: ${layerConfig.sound.split('/').pop()} (vol: ${layerConfig.volume}, delay: ${layerConfig.delay}s)`);
  }, (layerConfig.delay || 0) * 1000);
}

// ============================================
// Pre-Rendered Stem Playback System
// ============================================

/**
 * Attempt to load and play pre-rendered audio stems
 * @returns {boolean} - true if stems loaded successfully, false to fallback to TTS
 */
function attemptStemPlayback(world, mood, onComplete) {
  const stemPrefix = `${world}_${mood}`;
  const basePath = STEM_CONFIG.basePath;
  const format = STEM_CONFIG.format;
  
  // Reset stem state
  stemLoaded = { narration: false, ambient: false, sfx: false };
  
  // Build file paths
  const files = {
    narration: `${basePath}${stemPrefix}_narration${format}`,
    ambient: `${basePath}${stemPrefix}_ambient${format}`,
    sfx: `${basePath}${stemPrefix}_sfx${format}`
  };

  if (window.__secureMediaUrls && window.__secureMediaUrls.stems) {
    var st = window.__secureMediaUrls.stems;
    if (st.narration) files.narration = st.narration;
    if (st.ambient) files.ambient = st.ambient;
    if (st.sfx) files.sfx = st.sfx;
  }

  console.log('🎬 Attempting to load stems:', files);
  
  // Load stems with error handling
  let loadedCount = 0;
  const requiredStems = Object.keys(STEM_CONFIG.stems).filter(k => STEM_CONFIG.stems[k]);
  
  requiredStems.forEach(stemType => {
    var audio;
    if (stemType === 'narration' && journeyPreloadAudio && journeyPreloadWorld === world && journeyPreloadMood === mood) {
      audio = journeyPreloadAudio;
      journeyPreloadAudio = null;
      stemLoaded[stemType] = true;
      loadedCount++;
      stemAudio[stemType] = audio;
      audio.volume = STEM_CONFIG.volumes[stemType] || 0.5;
      console.log('✅ Reusing preloaded narration stem');
      if (loadedCount === requiredStems.length) {
        playStemSequence(onComplete);
      }
      return;
    }
    audio = new Audio();
    
    audio.addEventListener('canplaythrough', () => {
      stemLoaded[stemType] = true;
      loadedCount++;
      console.log(`✅ Loaded ${stemType} stem (${loadedCount}/${requiredStems.length})`);
      
      if (loadedCount === requiredStems.length) {
        playStemSequence(onComplete);
      }
    }, { once: true });
    
    audio.addEventListener('error', (e) => {
      console.warn(`❌ Failed to load ${stemType} stem:`, e);
      if (loadedCount === 0) {
        stopAllStems();
        return false;
      }
    }, { once: true });
    
    audio.src = files[stemType];
    audio.preload = 'auto';
    audio.volume = STEM_CONFIG.volumes[stemType] || 0.5;
    
    if (stemType === 'ambient') {
      audio.loop = true;
    }
    
    stemAudio[stemType] = audio;
  });
  
  // Give stems 2 seconds to start loading
  // If none load, show connection error and offer Try Again
  setTimeout(() => {
    if (loadedCount === 0) {
      console.warn('⏱️ Stem loading timeout - audio failed to load');
      stopAllStems();
      showConnectionError(function () {
        hideConnectionError();
        handleStartDream();
      });
    }
  }, 2000);
  
  return true; // Optimistically return true, will fallback if load fails
}

/**
 * Play loaded stems in cinematic sequence
 */
function playStemSequence(onComplete) {
  console.log('🎬 Starting cinematic stem playback...');
  requestWakeLock();
  
  // Update video for this world/mood
  updateVideoForProgress(appState.world || 'journey', 0);
  
  // Start ambient bed first (loops in background)
  if (stemAudio.ambient && stemLoaded.ambient) {
    stemAudio.ambient.currentTime = 0;
    stemAudio.ambient.volume = STEM_CONFIG.volumes.ambient;
    stemAudio.ambient.play()
      .then(() => console.log('🌊 Ambient bed playing (looping)'))
      .catch(err => console.warn('Ambient play failed:', err));
  }
  
  // Start SFX layer (timed events, plays once)
  if (stemAudio.sfx && stemLoaded.sfx) {
    stemAudio.sfx.currentTime = 0;
    stemAudio.sfx.volume = STEM_CONFIG.volumes.sfx;
    stemAudio.sfx.play()
      .then(() => console.log('💥 SFX layer playing'))
      .catch(err => console.warn('SFX play failed:', err));
  }
  
  // Duck ambient/SFX when narration starts
  if (STEM_CONFIG.ducking.enabled) {
    setTimeout(() => {
      duckBackgroundStems(true);
    }, 500); // Small delay before ducking
  }
  
  // Start narration (primary focus)
  if (stemAudio.narration && stemLoaded.narration) {
    stemAudio.narration.currentTime = 0;
    stemAudio.narration.volume = STEM_CONFIG.volumes.narration;
    setupMediaSession();
    attachPlaybackPauseHandler(stemAudio.narration);
    
    // When narration ends, unduck and complete
    stemAudio.narration.onended = () => {
      console.log('✅ Narration complete');
      _journeyCompleted = true;
      clearProgress();
      setJourneyCompleted();
      trackEvent('audio_completed', { mode: appState.world, mood: appState.mood });
      releaseWakeLock();
      clearMediaSession();
      
      // Unduck background
      if (STEM_CONFIG.ducking.enabled) {
        duckBackgroundStems(false);
      }
      
      // Fade out all stems
      fadeOutAllStems(() => {
        stopAllStems();
        if (onComplete) onComplete();
      });
    };
    
    stemAudio.narration.play()
      .then(() => {
        console.log('🎙️ Narration playing');
        updateMediaSessionState('playing');
        if (!_audioStartedTracked) {
          _audioStartedTracked = true;
          trackEvent('audio_started', { mode: appState.world, mood: appState.mood });
        }
      })
      .catch(function (err) {
        console.warn('Narration play failed:', err);
        showConnectionError(function () {
          hideConnectionError();
          handleStartDream();
        });
      });
  } else {
    // If no narration, just let ambient/SFX play for a bit
    if (!_audioStartedTracked) {
      _audioStartedTracked = true;
      trackEvent('audio_started', { mode: appState.world, mood: appState.mood });
    }
    setTimeout(() => {
      _journeyCompleted = true;
      clearProgress();
      setJourneyCompleted();
      trackEvent('audio_completed', { mode: appState.world, mood: appState.mood });
      fadeOutAllStems(() => {
        stopAllStems();
        if (onComplete) onComplete();
      });
    }, 30000); // 30s default if no narration
  }
}

/**
 * Duck (reduce volume) of ambient/SFX during narration
 */
function duckBackgroundStems(duck) {
  const targetVol = duck ? STEM_CONFIG.ducking.targetVolume : 1.0;
  const duration = STEM_CONFIG.ducking.fadeDuration;
  const steps = 20;
  const stepTime = duration / steps;
  
  ['ambient', 'sfx'].forEach(stemType => {
    const audio = stemAudio[stemType];
    if (!audio || !stemLoaded[stemType]) return;
    
    const startVol = audio.volume;
    const endVol = STEM_CONFIG.volumes[stemType] * targetVol;
    const volStep = (endVol - startVol) / steps;
    
    let currentStep = 0;
    const duckInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, Math.min(1, startVol + volStep * currentStep));
      
      if (currentStep >= steps) {
        clearInterval(duckInterval);
        audio.volume = endVol;
      }
    }, stepTime);
  });
  
  console.log(duck ? '🔇 Ducking background stems' : '🔊 Unducking background stems');
}

/**
 * Fade out all stems smoothly
 */
function fadeOutAllStems(onComplete) {
  const duration = 2000; // 2s fade out
  const steps = 40;
  const stepTime = duration / steps;
  
  let activeStems = 0;
  let completedStems = 0;
  
  Object.keys(stemAudio).forEach(stemType => {
    const audio = stemAudio[stemType];
    if (!audio || !stemLoaded[stemType]) return;
    
    activeStems++;
    const startVol = audio.volume;
    const volStep = startVol / steps;
    
    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, startVol - volStep * currentStep);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = 0;
        completedStems++;
        
        if (completedStems === activeStems && onComplete) {
          onComplete();
        }
      }
    }, stepTime);
  });
  
  // Fallback if no stems were active
  if (activeStems === 0 && onComplete) {
    onComplete();
  }
  
  console.log('🌅 Fading out all stems...');
}

/**
 * Stop all stem playback immediately
 */
function stopAllStems() {
  _userInitiatedPause = true;
  releaseWakeLock();
  clearMediaSession();
  Object.keys(stemAudio).forEach(stemType => {
    if (stemAudio[stemType]) {
      stemAudio[stemType].pause();
      stemAudio[stemType].currentTime = 0;
      stemAudio[stemType] = null;
    }
  });
  stemLoaded = { narration: false, ambient: false, sfx: false };
  console.log('⏹️ All stems stopped');
}

// ============================================
// Text-to-Speech (TTS) Management
// ============================================

let voices = [];
let selectedVoice = null;

/**
 * Load available voices from browser
 */
function loadVoices() {
  if (typeof speechSynthesis === 'undefined') return;
  voices = speechSynthesis.getVoices();
  if (voices.length > 0 && !selectedVoice) {
    selectBestVoice();
  }
}

/**
 * Select the best available voice for storytelling
 * Prioritizes natural, human-like voices similar to ElevenLabs
 */
function selectBestVoice() {
  if (typeof speechSynthesis === 'undefined') return null;
  
  console.log('🎙️ Available voices:', voices.length);
  console.log(voices.map(v => `${v.name} (${v.lang})`).join('\n'));

  const normalize = (value) => (value || '').toLowerCase();
  
  // STRICT: US English neural female voices only
  const edgeNeuralEnglish = [
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)', 
    'Microsoft Michelle Online (Natural) - English (United States)',
    'Microsoft Ana Online (Natural) - English (United States)',
    'Microsoft Emma Online (Natural) - English (United States)',
    'Microsoft Sonia Online (Natural) - English (United Kingdom)',
    'Microsoft Libby Online (Natural) - English (United Kingdom)',
    'Microsoft Clara Online (Natural) - English (Canada)',
    'Microsoft Natasha Online (Natural) - English (Australia)'
  ];

  // Priority 1: Exact match for US English neural voices
  selectedVoice = voices.find(v => edgeNeuralEnglish.includes(v.name));
  if (selectedVoice) {
    console.log('✨ Selected voice via Edge neural English female:', selectedVoice.name);
  }
  
  // Priority 2: Any Microsoft English Neural voice (not just US)
  if (!selectedVoice) {
    selectedVoice = voices.find(v => {
      const name = normalize(v.name);
      const lang = normalize(v.lang);
      return name.includes('microsoft') && 
             (name.includes('natural') || name.includes('neural') || name.includes('online')) &&
             (lang.includes('en-us') || lang.includes('en-gb') || lang.includes('en-au') || lang.includes('en-ca')) &&
             lang.includes('en');
    });
    if (selectedVoice) {
      console.log('✨ Selected via Microsoft English Neural:', selectedVoice.name);
    }
  }
  
  // Priority 3: Any English-US Natural voice
  if (!selectedVoice) {
    selectedVoice = voices.find(v => {
      const name = normalize(v.name);
      return name.includes('online') && name.includes('natural') && v.lang === 'en-US';
    });
    if (selectedVoice) {
      console.log('✨ Selected via English-US Natural:', selectedVoice.name);
    }
  }
  
  // Priority 4: Apple/Mac premium voices
  if (!selectedVoice) {
    const preferredApple = ['samantha', 'karen', 'victoria', 'allison', 'susan', 'fiona'];
    selectedVoice = voices.find(v => {
      const nameLower = v.name.toLowerCase();
      return preferredApple.some(name => nameLower.includes(name)) && v.lang.includes('en');
    });
    if (selectedVoice) {
      console.log('✨ Selected via Apple premium voice:', selectedVoice.name);
    }
  }

  // Priority 5: Google voices
  if (!selectedVoice) {
    selectedVoice = voices.find(v => {
      const name = normalize(v.name);
      return name.includes('google') && v.lang.includes('en');
    });
    if (selectedVoice) {
      console.log('✨ Selected via Google:', selectedVoice.name);
    }
  }

  // Final fallback: First English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.includes('en')) || voices[0];
    console.log('⚠️ Fallback voice:', selectedVoice?.name);
  }

  if (selectedVoice) {
    console.log('🎤 FINAL VOICE:', selectedVoice.name, '|', selectedVoice.lang, '| local:', selectedVoice.localService);
  } else {
    console.warn('❌ No voice selected');
  }

  return selectedVoice;
}

/**
 * Speak text using Web Speech API
 * @param {string} text - Text to speak
 * @param {object} options - Speech options (rate, pitch, volume)
 * @param {function} onEnd - Callback when speech ends
 */
function speakText(text, options = {}, onEnd = null) {
  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }
  
  // Check if speech synthesis is available
  if (typeof speechSynthesis === 'undefined') {
    console.warn('Speech Synthesis API not available');
    if (onEnd) onEnd();
    return;
  }
  
  // Ensure voices are loaded
  if (voices.length === 0) {
    loadVoices();
  }
  
  // If still no voices, try one more time after a short delay
  if (voices.length === 0) {
    setTimeout(() => {
      loadVoices();
      if (voices.length === 0) {
        console.warn('No voices available after retry');
        if (onEnd) onEnd();
        return;
      }
      // Retry speaking
      speakText(text, options, onEnd);
    }, 300);
    return;
  }
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  // Small delay to ensure cancellation is processed
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (!selectedVoice) {
      selectBestVoice();
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Set speech properties for natural, human-like delivery
    const voiceLang = selectedVoice && selectedVoice.lang ? selectedVoice.lang : 'en-US';
    utterance.rate = options.rate ?? 0.86;   // Keep near-natural cadence
    utterance.pitch = options.pitch ?? 1.0;  // Neutral, warm tone
    utterance.volume = options.volume ?? 0.92; // Slightly fuller presence
    utterance.lang = voiceLang;
    
    // Use the original text (browser handles pauses naturally)
    utterance.text = text;
    
    // Callback when speech ends
    if (onEnd) {
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (error) => {
        console.warn('Speech synthesis error:', error);
        if (onEnd) onEnd();
      };
    }
    
    // Speak
    try {
      speechSynthesis.speak(utterance);
      console.log('Speaking:', text.substring(0, 50) + '...');
    } catch (error) {
      console.error('Error speaking:', error);
      if (onEnd) onEnd();
    }
  }, 100);
}

/**
 * Play pre-rendered high-quality narration file
 * Used for special experiences like THE CLEARING
 * @param {string} audioFileName - Filename of the pre-rendered narration
 * @param {function} onComplete - Callback when narration finishes
 */
function playPreRenderedNarration(audioFileName, onComplete) {
  try {
    const audioPath = `${STEM_CONFIG.basePath}${audioFileName}`;
    const narrator = new Audio(audioPath);
    
    narrator.volume = 1.0;
    narrator.addEventListener('ended', () => {
      console.log('✅ Pre-rendered narration complete');
      if (onComplete) onComplete();
    }, { once: true });
    
    narrator.addEventListener('error', (e) => {
      console.error('❌ Failed to load pre-rendered narration:', e);
      // Fallback: show error and trigger callback
      if (onComplete) onComplete();
    }, { once: true });
    
    console.log(`▶️  Playing: ${audioPath} (${audioFileName})`);
    narrator.play().catch(err => {
      console.warn('Autoplay prevented:', err);
      // User may need to interact first
      if (onComplete) onComplete();
    });
    
  } catch (error) {
    console.error('Error in playPreRenderedNarration:', error);
    if (onComplete) onComplete();
  }
}

/**
 * Speak story naturally with pauses between sentences
 * @param {string} storyText - Full story text
 * @param {string} mood - Current mood (affects speech rate)
 * @param {function} onComplete - Callback when all speech is complete
 */
function speakStoryNaturally(storyText, mood, onComplete) {
  if (!storyText || !storyText.trim()) {
    if (onComplete) onComplete();
    return;
  }
  
  // Check for special pre-rendered experiences (e.g., THE CLEARING)
  if (STEM_CONFIG.preRendered && STEM_CONFIG.preRendered.clearing && appState.world === 'clearing') {
    console.log('🎬 Playing THE CLEARING - High-quality cinematic narration');
    playPreRenderedNarration(STEM_CONFIG.preRendered.clearing.narration, onComplete);
    usingStemsMode = true;
    return;
  }
  
  // Check if pre-rendered stems are available
  if (STEM_CONFIG.enabled && attemptStemPlayback(appState.world, mood, onComplete)) {
    console.log('🎬 Playing pre-rendered cinematic stems');
    usingStemsMode = true;
    return;
  }
  
  // Fallback to TTS if stems not found
  console.log('🎙️ Fallback to TTS (stems not found)');
  usingStemsMode = false;
  
  // Initialize sound layers
  initSoundLayers();
  // Reset video tracking for chapter switching
  lastVideoSrc = null;
  
  // Start intro ambience
  playAmbience(soundMap.opening);
  soundMap.opening?.layers?.forEach(playLayerEffect);
  
  // Split into sentences
  const sentences = storyText
    .split(/[.!?]+\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  if (sentences.length === 0) {
    if (onComplete) onComplete();
    return;
  }
  
  let currentIndex = 0;
  let lastSoundConfig = null;
  
  // Adjust rate based on mood (calmer = slower, more natural)
  const moodRates = {
    calm: 0.84,       // Gentle but not dragging (more natural for neural voices)
    confident: 0.92,  // Steady, assured
    curious: 0.88     // Light, flowing
  };
  const baseRate = moodRates[mood] || 0.88;
  
  function speakNext() {
    if (currentIndex >= sentences.length) {
      // Fade out all sounds at end
      stopAllLayers();
      if (currentAmbience) {
        let vol = currentAmbience.volume;
        const fadeOut = setInterval(() => {
          vol -= 0.04;
          if (vol <= 0) {
            currentAmbience.pause();
            clearInterval(fadeOut);
          } else {
            currentAmbience.volume = vol;
          }
        }, 100);
      }
      console.log('✅ Story complete - sounds fading out');
      if (onComplete) onComplete();
      return;
    }
    
    const sentence = sentences[currentIndex];
    if (!sentence) {
      currentIndex++;
      speakNext();
      return;
    }
    
    // Dynamic sound switching based on narrative progress
    const progress = currentIndex / sentences.length;
    const newSoundConfig = getSoundConfigForProgress(progress);
    
    // Change sound when entering new narrative section (check by reference)
    if (!lastSoundConfig || 
        (lastSoundConfig.ambience && newSoundConfig.ambience && 
         lastSoundConfig.ambience !== newSoundConfig.ambience)) {
      stopAllLayers();
      playAmbience(newSoundConfig);
      newSoundConfig.layers?.forEach(playLayerEffect);
      lastSoundConfig = newSoundConfig;
      console.log(`🎬 Narrative progress: ${Math.round(progress * 100)}%`);
    }

    // Update video chapter for viking world (no-op for others)
    updateVideoForProgress(appState.world || 'journey', progress);
    
    // Add subtle variation for natural human-like speech
    // Keep variation minimal to avoid robotic feel
    const rate = baseRate + (Math.random() * 0.03 - 0.015); // Tiny variation to avoid monotone
    const pitch = 0.96 + Math.random() * 0.08; // Gentle pitch movement
    
    speakText(sentence + '.', {
      rate: Math.max(0.80, Math.min(0.96, rate)), // Clamp within natural bounds
      pitch: Math.max(0.92, Math.min(1.08, pitch)),
      volume: 0.92
    }, () => {
      // Natural pause between sentences (longer for calm, soothing effect)
      const pauseDuration = mood === 'calm' 
        ? 1100 + Math.random() * 400  // Longer pauses for calm
        : 800 + Math.random() * 350;  // Standard pauses
      
      setTimeout(() => {
        currentIndex++;
        speakNext();
      }, pauseDuration);
    });
  }
  
  speakNext();
}

// Initialize voice loading when available
function initTTS() {
  if (typeof speechSynthesis !== 'undefined') {
    // Load voices immediately
    loadVoices();
    
    // Also listen for voices to be loaded (some browsers load async)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Try loading again after a short delay
    setTimeout(() => {
      loadVoices();
    }, 500);
  } else {
    console.warn('Speech Synthesis API not available');
  }
}

// ============================================
// DOM Element References (Lazy Loading)
// ============================================

let elements = {};

function getElements() {
  if (!elements.body) {
    try {
      elements.body = document.body;
      elements.experienceCanvas = document.getElementById('experienceCanvas');
      elements.canvasIdle = document.getElementById('canvasIdle');
      elements.dreamVideoWrapper = document.getElementById('dreamVideoWrapper');
      elements.dreamVideo = document.getElementById('dreamVideo');
      elements.dreamTransition = document.getElementById('dreamTransition');
      elements.transitionMessage = document.getElementById('transitionMessage');
      elements.progressFill = document.getElementById('progressFill');
      elements.userNameInput = document.getElementById('userName');
      elements.worldSelect = document.getElementById('worldSelect');
      elements.moodSelect = document.getElementById('moodSelect');
      elements.startButton = document.getElementById('startButton');
      elements.ambientAudio = document.getElementById('ambientAudio');
      
      // World selection elements
      elements.worldCardsContainer = document.getElementById('worldCardsContainer');
      elements.cardJourney = document.getElementById('cardJourney');
      elements.cardSanctuary = document.getElementById('cardSanctuary');
      elements.cardRomantic = document.getElementById('cardRomantic');
      elements.moodSection = document.getElementById('moodSection');
      elements.nameSection = document.getElementById('nameSection');
      elements.ctaSection = document.getElementById('ctaSection');
      elements.moodButtons = document.querySelectorAll('.mood-btn');
      elements.emailCollectionScreen = document.getElementById('emailCollectionScreen');
      elements.emailCollectionForm = document.getElementById('emailCollectionForm');
      elements.emailCollectionInput = document.getElementById('emailCollectionInput');
      elements.emailCollectionError = document.getElementById('emailCollectionError');
      elements.emailCollectionSubmit = document.getElementById('emailCollectionSubmit');
    } catch (error) {
      console.error('Error getting elements:', error);
    }
  }
  return elements;
}

// ============================================
// Video Management
// ============================================

/** Prefix relative asset paths with DREAMEVO_MEDIA_BASE_URL when set (R2 / CDN). */
function resolveMediaUrl(relativePath) {
  if (!relativePath) return relativePath;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  var base = (typeof window !== 'undefined' && window.DREAMEVO_MEDIA_BASE_URL)
    ? String(window.DREAMEVO_MEDIA_BASE_URL).replace(/\/$/, '')
    : '';
  if (!base) return relativePath;
  return base + '/' + String(relativePath).replace(/^\/+/, '');
}

/**
 * API origin for Vercel serverless routes (/api/*).
 * Empty string = same origin (production on Vercel).
 * Override DREAMEVO_API_BASE for local `vercel dev` on a fixed port or legacy setups.
 */
function getApiBase() {
  if (typeof window !== 'undefined' && window.DREAMEVO_API_BASE) {
    return String(window.DREAMEVO_API_BASE).replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return '';
  }
  return 'http://localhost:3000';
}

/** Build absolute URL for /api/... and paths. Same-origin when getApiBase() is ''. */
function apiUrl(path) {
  var p = path.startsWith('/') ? path : '/' + path;
  var base = getApiBase();
  if (!base) return p;
  return base.replace(/\/$/, '') + p;
}

// --- Short-lived media URLs (R2 presign via API). Not “unbreakable”; raises bar vs static CDN links. ---
var _mediaPresignEnabled = null;
var _mediaPresignTTL = 900;
/** @type {{ intro?: string, ambient?: string, stems?: Record<string, string> } | null} */
window.__secureMediaUrls = null;

function fetchMediaPresignStatus(cb) {
  if (_mediaPresignEnabled !== null) {
    if (cb) cb();
    return;
  }
  fetch(apiUrl('/api/media/status'))
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      _mediaPresignEnabled = !!d.presign_enabled;
      if (d.ttl_seconds) _mediaPresignTTL = d.ttl_seconds;
      if (cb) cb();
    })
    .catch(function () {
      _mediaPresignEnabled = false;
      if (cb) cb();
    });
}

function buildPresignItems(world, mood) {
  return [
    { kind: 'intro' },
    { kind: 'ambient' },
    { kind: 'stem', world: world, mood: mood, part: 'narration' },
    { kind: 'stem', world: world, mood: mood, part: 'ambient' },
    { kind: 'stem', world: world, mood: mood, part: 'sfx' }
  ];
}

/**
 * Fills window.__secureMediaUrls when API + R2 are configured on the server.
 * @param {function(*): void} callback - err is null on success
 */
function presignJourneyMedia(world, mood, callback) {
  fetchMediaPresignStatus(function () {
    if (!_mediaPresignEnabled) {
      window.__secureMediaUrls = null;
      if (callback) callback(null);
      return;
    }
    fetch(apiUrl('/api/media/presign'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: buildPresignItems(world, mood) })
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.error) {
          window.__secureMediaUrls = null;
          if (callback) callback(d.error);
          return;
        }
        window.__secureMediaUrls = d.urls || null;
        if (callback) callback(null);
      })
      .catch(function (e) {
        window.__secureMediaUrls = null;
        if (callback) callback(e);
      });
  });
}

/**
 * Intro clip played once when journey audio starts (visual hook; muted so it does not clash with voice/ambient).
 * Uses presigned intro URL, DREAMEVO_INTRO_VIDEO_URL, or same-origin /static/intro_video.mp4 (e.g. under public/).
 */
function getJourneyIntroVideoUrl() {
  if (typeof window !== 'undefined' && window.DREAMEVO_INTRO_VIDEO_URL) {
    var cdn = String(window.DREAMEVO_INTRO_VIDEO_URL).trim();
    if (cdn) return cdn;
  }
  return apiUrl('/static/intro_video.mp4');
}

/** @deprecated Prefer getJourneyIntroVideoUrl (default is /static/intro_video.mp4). */
function getIntroVideoUrl() {
  return getJourneyIntroVideoUrl();
}

/**
 * Looping mood / world background video (not the one-off intro).
 */
function getDreamLoopVideoSource(world, mood) {
  const videoMap = {
    journey: {
      calm: 'assets/videos/journey_calm.mp4',
      confident: 'assets/videos/journey_confident.mp4',
      curious: 'assets/videos/journey_curious.mp4'
    },
    sanctuary: {
      calm: 'assets/videos/sanctuary_calm.mp4',
      confident: 'assets/videos/sanctuary_confident.mp4',
      curious: 'assets/videos/sanctuary_curious.mp4'
    },
    exploration: {
      calm: 'assets/videos/exploration_calm.mp4',
      confident: 'assets/videos/exploration_confident.mp4',
      curious: 'assets/videos/exploration_curious.mp4'
    },
    clearing: {
      calm: 'assets/videos/exploration_calm.mp4',
      confident: 'assets/videos/exploration_confident.mp4',
      curious: 'assets/videos/exploration_curious.mp4'
    }
  };

  const worldVideos = videoMap[world] || videoMap.journey;
  var rel = worldVideos[mood] || worldVideos.calm;
  return resolveMediaUrl(rel);
}

/**
 * @deprecated Use getDreamLoopVideoSource for playback; getIntroVideoUrl for intro.
 * Kept for window.DreamPulse compatibility.
 */
function getVideoSource(world, mood) {
  return getDreamLoopVideoSource(world, mood);
}

/**
 * Load and prepare video for playback
 * @param {string} videoSrc - Path to video file
 * @param {{ loop?: boolean, muted?: boolean, playbackRate?: number }} [opts]
 */
function loadVideo(videoSrc, opts) {
  const { dreamVideo } = getElements();
  var o = opts || {};

  if (!dreamVideo || !videoSrc) return;

  dreamVideo.setAttribute('playsinline', '');
  dreamVideo.setAttribute('webkit-playsinline', '');
  try {
    dreamVideo.playsInline = true;
  } catch (e0) { /* ignore */ }

  dreamVideo.src = videoSrc;
  dreamVideo.load();

  var loop = o.loop !== undefined ? o.loop : true;
  var muted = o.muted !== undefined ? o.muted : true;
  var rate = o.playbackRate != null ? o.playbackRate : 0.5;

  dreamVideo.loop = loop;
  dreamVideo.defaultMuted = muted;
  dreamVideo.muted = muted;
  dreamVideo.playbackRate = rate;

  function syncVideoAVFlags() {
    dreamVideo.muted = muted;
    dreamVideo.defaultMuted = muted;
    dreamVideo.loop = loop;
    dreamVideo.playbackRate = rate;
  }
  dreamVideo.addEventListener('loadedmetadata', syncVideoAVFlags, { once: true });
  dreamVideo.addEventListener('loadeddata', syncVideoAVFlags, { once: true });
}

/**
 * Start video playback when ready
 * @returns {Promise<void>}
 */
function playVideo() {
  const { dreamVideo } = getElements();

  if (!dreamVideo || !dreamVideo.src) return Promise.resolve();

  return dreamVideo.play().catch(function (error) {
    console.warn('Video autoplay prevented:', error);
  });
}

/**
 * Get video for world based on narrative progress (0-1)
 */
function getVideoForProgress(world, progress) {
  // Default to existing mapping for non-viking worlds
  if (world !== 'viking') return null;

  if (progress < 0.12) return resolveMediaUrl('assets/videos/viking_sea.mp4');
  if (progress < 0.25) return resolveMediaUrl('assets/videos/viking_coast.mp4');
  if (progress < 0.45) return resolveMediaUrl('assets/videos/viking_mountain.mp4');
  if (progress < 0.65) return resolveMediaUrl('assets/videos/viking_river.mp4');
  return resolveMediaUrl('assets/videos/viking_throne.mp4');
}

/**
 * Update video source when chapter changes
 */
function updateVideoForProgress(world, progress) {
  if (appState.suppressChapterVideo) return;
  const { dreamVideo } = getElements();
  if (!dreamVideo) return;

  const videoSrc = getVideoForProgress(world, progress);
  if (!videoSrc) return;

  if (lastVideoSrc === videoSrc) return;

  loadVideo(videoSrc);
  playVideo();
  lastVideoSrc = videoSrc;
  console.log('🎥 Video chapter:', videoSrc.split('/').pop());
}

// ============================================
// State Transitions
// ============================================

/**
 * Update app state class on body element
 * @param {string} state - New state ('idle' or 'active')
 */
function setAppState(state) {
  const { body } = getElements();
  if (!body) return;
  
  body.classList.remove('state-idle', 'state-active');
  body.classList.add(`state-${state}`);
  appState.isActive = (state === 'active');
  if (state !== 'active') {
    hidePlaybackEscapeControls();
    appState.suppressChapterVideo = false;
    var wrapIdle = document.getElementById('dreamVideoWrapper');
    if (wrapIdle) {
      wrapIdle.classList.remove('dream-video-wrapper--intro', 'dream-video-wrapper--audio-only');
    }
  }
}

/**
 * Show transition overlay with message
 * @param {string} message - Text to display
 */
function showTransition(message) {
  const { dreamTransition, transitionMessage } = getElements();
  
  if (dreamTransition) {
    dreamTransition.classList.add('active');
  }
  
  // Update message words if needed (for word-by-word animation)
  if (transitionMessage && message) {
    // Reset word animations
    const words = transitionMessage.querySelectorAll('.message-word');
    words.forEach((word, index) => {
      word.style.animation = 'none';
      setTimeout(() => {
        word.style.animation = '';
      }, 10);
    });
  }
}

/**
 * Hide transition overlay
 */
function hideTransition() {
  const { dreamTransition } = getElements();
  
  if (dreamTransition) {
    dreamTransition.classList.remove('active');
  }
}

/**
 * Update progress bar
 * @param {number} percentage - Progress percentage (0-100)
 */
function updateProgress(percentage) {
  const { progressFill } = getElements();
  
  if (progressFill) {
    progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }
}

// ============================================
// Audio Management
// ============================================

/**
 * Stop all audio (TTS, ambient, video)
 */
function stopAllAudio() {
  _userInitiatedPause = true;
  releaseWakeLock();
  clearMediaSession();
  // Cancel TTS
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  
  // Stop ambient audio
  const { ambientAudio, dreamVideo } = getElements();
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
  
  // Pause video
  if (dreamVideo) {
    dreamVideo.pause();
    dreamVideo.currentTime = 0;
  }
}

// Stop audio on page unload; track journey abandoned if user left before completion
function onPageUnload() {
  if (appState.isActive && !_journeyCompleted) {
    trackEvent('journey_abandoned', { mode: appState.world, mood: appState.mood });
  }
  stopAllAudio();
}
window.addEventListener('beforeunload', onPageUnload);
window.addEventListener('pagehide', onPageUnload);

// ============================================
// Main Interaction Handler
// ============================================

/**
 * Stop intro visuals after clip ends — journey continues audio-only (minimal on-screen distraction).
 */
function finishJourneyIntroVideo() {
  if (_journeyIntroVideoFinished) return;
  _journeyIntroVideoFinished = true;
  var wrap = document.getElementById('dreamVideoWrapper');
  if (wrap) {
    wrap.classList.remove('dream-video-wrapper--intro');
    wrap.classList.add('dream-video-wrapper--audio-only');
  }
  var v = getElements().dreamVideo;
  if (v) {
    try {
      v.pause();
    } catch (e1) { /* ignore */ }
    v.removeAttribute('src');
    try {
      v.load();
    } catch (e2) { /* ignore */ }
  }
  lastVideoSrc = null;
}

/**
 * When journey audio starts: play backend intro clip once (muted, visual only), then no video.
 */
function startJourneyIntroVideoWithAudio(el) {
  _journeyIntroVideoFinished = false;
  appState.suppressChapterVideo = true;
  lastVideoSrc = null;

  var wrap = document.getElementById('dreamVideoWrapper');
  if (wrap) {
    wrap.classList.remove('dream-video-wrapper--audio-only');
    wrap.classList.add('dream-video-wrapper--intro');
  }

  var introUrl =
    (window.__secureMediaUrls && window.__secureMediaUrls.intro) || getJourneyIntroVideoUrl();
  if (!introUrl || !el.dreamVideo) {
    finishJourneyIntroVideo();
    return;
  }

  function onIntroDone() {
    if (el.dreamVideo) {
      el.dreamVideo.removeEventListener('ended', onIntroDone);
      el.dreamVideo.removeEventListener('error', onIntroErr);
    }
    finishJourneyIntroVideo();
  }
  function onIntroErr() {
    if (el.dreamVideo) {
      el.dreamVideo.removeEventListener('ended', onIntroDone);
      el.dreamVideo.removeEventListener('error', onIntroErr);
    }
    console.warn('Journey intro video failed:', introUrl);
    finishJourneyIntroVideo();
  }

  loadVideo(introUrl, { loop: false, muted: true, playbackRate: 1 });
  lastVideoSrc = introUrl;
  el.dreamVideo.addEventListener('ended', onIntroDone, { once: true });
  el.dreamVideo.addEventListener('error', onIntroErr, { once: true });

  playVideo().catch(function () {
    loadVideo(introUrl, { loop: false, muted: true, playbackRate: 1 });
    playVideo().catch(function () {
      onIntroErr();
    });
  });
}

/**
 * After prep reminder: intro video once with audio start, then audio-only journey (no loop video).
 */
function beginDreamJourneyMedia(el, world, mood, userName) {
  hideTransition();
  updateProgress(0);

  if (el.startButton) {
    el.startButton.disabled = false;
    var buttonText = el.startButton.querySelector('.button-text');
    if (buttonText) buttonText.textContent = 'Enter Dream';
  }

  presignJourneyMedia(world, mood, function (err) {
    if (err) console.warn('Media presign (optional):', err);
    beginDreamJourneyMediaContinue(el, world, mood, userName);
  });
}

function beginDreamJourneyMediaContinue(el, world, mood, userName) {
  if (el.ambientAudio && window.__secureMediaUrls && window.__secureMediaUrls.ambient) {
    var srcEl = el.ambientAudio.querySelector('source');
    if (srcEl) {
      srcEl.src = window.__secureMediaUrls.ambient;
      srcEl.type = 'audio/mpeg';
    }
    el.ambientAudio.load();
  }

  startJourneyIntroVideoWithAudio(el);

  if (el.ambientAudio) {
    setupMediaSession();
    attachPlaybackPauseHandler(el.ambientAudio);
    setTimeout(function () {
      el.ambientAudio.volume = 0.15;
      el.ambientAudio.play().then(function () {
        updateMediaSessionState('playing');
        if (!_audioStartedTracked) {
          _audioStartedTracked = true;
          trackEvent('audio_started', { mode: world, mood: mood });
        }
      }).catch(function () {
        console.warn('Ambient audio autoplay prevented');
        showConnectionError(function () {
          hideConnectionError();
          handleStartDream();
        });
      });
    }, 400);
  }

  fetchStoryAndSpeak(userName, world, mood);
}

/**
 * Reminder only (earphones / eyes closed). Intro video runs when user taps “Begin journey” with audio.
 */
function startDreamPrepSequence(el, world, mood, userName) {
  var overlay = document.getElementById('dreamPrepOverlay');
  var step2 = document.getElementById('dreamPrepStep2');
  var btn2 = document.getElementById('dreamPrepContinue2');
  if (!overlay || !btn2) {
    beginDreamJourneyMedia(el, world, mood, userName);
    return;
  }

  function showPrepStep2Only() {
    if (!overlay) return;
    overlay.classList.add('dream-prep-overlay--visible');
    overlay.setAttribute('aria-hidden', 'false');
    if (step2) step2.classList.remove('is-hidden');
  }

  function hidePrepOverlay() {
    if (!overlay) return;
    overlay.classList.remove('dream-prep-overlay--visible');
    overlay.setAttribute('aria-hidden', 'true');
    if (step2) step2.classList.add('is-hidden');
  }

  hidePrepOverlay();
  showPrepStep2Only();

  btn2.onclick = function () {
    hidePrepOverlay();
    beginDreamJourneyMedia(el, world, mood, userName);
  };
}

/**
 * Handle "Start Dream" button click
 * Main entry point for the dream experience
 */
function handleStartDream() {
  try {
    const el = getElements();
    
    if (!el || !el.body) {
      console.error('Elements not initialized');
      return;
    }
    
    // Stop any existing audio
    stopAllAudio();
    
    // Get user inputs (from cards or hidden dropdowns)
    const userName = el.userNameInput?.value.trim() || '';
    const world = appState.world || el.worldSelect?.value || 'journey';
    const mood = appState.mood || el.moodSelect?.value || 'calm';
    
    // Validation (silent - no alerts)
    if (!userName) {
      return;
    }
  
    // Update app state
    appState.userName = userName;
    appState.world = world;
    appState.mood = mood;

    trackEvent('journey_started', { mode: world, mood: mood });
    _audioStartedTracked = false;
    saveProgress({ world: world, mood: mood, userName: userName });
  
    // Disable button
    if (el.startButton) {
      el.startButton.disabled = true;
      const buttonText = el.startButton.querySelector('.button-text');
      if (buttonText) {
        buttonText.textContent = 'Entering...';
      }
    }
    
    // Fade out world selection screen smoothly
    const worldSelectionScreen = document.getElementById('worldSelectionScreen');
    if (worldSelectionScreen) {
      worldSelectionScreen.style.transition = 'opacity var(--duration-cinematic) var(--ease-premium), transform var(--duration-cinematic) var(--ease-premium)';
    }
  
    // Transition to active state
    setAppState('active');
    requestWakeLock();

    hideTransition();
    updateProgress(0);

    startDreamPrepSequence(el, world, mood, userName);
  } catch (error) {
    console.error('Error in handleStartDream:', error);
    // Reset button on error
    const el = getElements();
    var wrapErr = document.getElementById('dreamVideoWrapper');
    if (wrapErr) {
      wrapErr.classList.remove('dream-video-wrapper--intro', 'dream-video-wrapper--audio-only');
    }
    appState.suppressChapterVideo = false;
    if (el.startButton) {
      el.startButton.disabled = false;
      const buttonText = el.startButton.querySelector('.button-text');
      if (buttonText) {
        buttonText.textContent = 'Enter Dream';
      }
    }
    var prepOv = document.getElementById('dreamPrepOverlay');
    if (prepOv) {
      prepOv.classList.remove('dream-prep-overlay--visible');
      prepOv.setAttribute('aria-hidden', 'true');
    }
    hideTransition();
    updateProgress(0);
  }
}

// ============================================
// Story Fetching & TTS Integration
// ============================================

/**
 * Fetch story from backend and speak it using TTS
 * @param {string} userName - User's name
 * @param {string} world - Selected world
 * @param {string} mood - Selected mood
 */
async function fetchStoryAndSpeak(userName, world, mood) {
  try {
    updateProgress(30);
    
    // Fetch story from backend
    const response = await fetch(apiUrl(`/api/story/${encodeURIComponent(world)}/${encodeURIComponent(mood)}`));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Story error:', data.error);
      setTimeout(() => {
        hideTransition();
      }, 3000);
      return;
    }
    
    updateProgress(50);
    
    // Speak intro first with warm, human-like delivery
    const introText = `Tonight, ${userName}.`;
    
    speakText(introText, {
      rate: 0.70,  // Slower for emphasis and warmth
      pitch: 0.90, // Slightly lower for soothing effect
      volume: 0.90
    }, () => {
      // After intro, start ambient and speak story
      const el = getElements();
      if (el.ambientAudio) {
        el.ambientAudio.volume = 0.15;
        el.ambientAudio.play().catch(() => {
          console.warn('Ambient audio autoplay prevented');
        });
      }
      
      updateProgress(70);
      hideTransition();
      
      // Speak the full story
      if (data.story) {
        speakStoryNaturally(data.story, mood, () => {
          // Story complete
          console.log('Story narration complete');
          _journeyCompleted = true;
          clearProgress();
          setJourneyCompleted();
          updateProgress(100);
        });
      }
    });
    
  } catch (error) {
    console.error('Error fetching story:', error);
    
    // Still speak a simple intro
    setTimeout(() => {
      speakText(`Tonight, ${userName}. Let your mind drift.`, {
        rate: 0.75,
        pitch: 1.0,
        volume: 0.9
      }, () => {
        hideTransition();
      });
    }, 1000);
    
    // Start ambient audio anyway
    const el = getElements();
    if (el.ambientAudio) {
      setTimeout(() => {
        el.ambientAudio.volume = 0.15;
        el.ambientAudio.play().catch(() => {
          console.warn('Ambient audio autoplay prevented');
        });
      }, 2000);
    }
  }
}

// ============================================
// Initialization
// ============================================

/**
 * Setup parallax effect for card background on mouse move
 * Enhanced with slow zoom for depth effect
 * @param {HTMLElement} card - Card element
 */
function setupCardParallax(card) {
  const bg = card.querySelector('.card-background');
  const img = card.querySelector('.card-bg-image');
  if (!bg) return;
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 25;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 25;
    
    // Parallax with slow zoom for depth
    if (img) {
      img.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      img.style.transition = 'transform 0.1s ease-out';
    } else {
      bg.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      bg.style.transition = 'transform 0.1s ease-out';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    if (img) {
      img.style.transform = 'translate(0, 0) scale(1)';
      img.style.transition = 'transform var(--duration-base) var(--ease-premium)';
    } else {
      bg.style.transform = 'translate(0, 0) scale(1)';
      bg.style.transition = 'transform var(--duration-base) var(--ease-premium)';
    }
  });
  
  // Handle image load errors - show fallback
  if (img) {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      console.warn('Card image failed to load, using fallback gradient');
    });
    
    img.addEventListener('load', () => {
      img.style.display = 'block';
      img.style.opacity = '1';
    });
  }
}

/**
 * Handle world card selection with cinematic transitions
 * @param {string} world - Selected world (journey, sanctuary, exploration)
 */
function selectWorld(world) {
  const el = getElements();
  
  // Update app state
  appState.world = world;
  
  // Update hidden dropdown for backward compatibility
  if (el.worldSelect) {
    el.worldSelect.value = world;
  }
  
  // Get all cards (Journey, Sanctuary, Romantic)
  const allCards = [
    el.cardJourney,
    el.cardSanctuary,
    el.cardRomantic
  ].filter(card => card !== null);
  
  // Get selected card
  const selectedCard = document.querySelector(`[data-world="${world}"]`);
  
  if (!selectedCard || !el.worldCardsContainer) {
    console.warn('Card or container not found');
    return;
  }
  
  // Remove selected class from all cards
  allCards.forEach(card => {
    if (card) card.classList.remove('selected');
  });
  
  // Add selected class to chosen card
  selectedCard.classList.add('selected');
  
  // Add has-selection class to container (triggers fade/blur on non-selected)
  el.worldCardsContainer.classList.add('has-selection');
  
  // CSS handles the centering via has-selection class
  selectedCard.style.transition = 'all var(--duration-slow) var(--ease-premium)';
  
  // Always show email popup when "Choose Experience" is clicked (including after refresh).
  // Pre-fill email from localStorage if present; we still show the popup every time.
  const emailScreen = document.getElementById('emailCollectionScreen');
  const emailInput = document.getElementById('emailCollectionInput');
  const emailError = document.getElementById('emailCollectionError');
  const submitBtn = document.getElementById('emailCollectionSubmit');
  if (emailScreen) {
    emailScreen.setAttribute('aria-hidden', 'false');
    emailScreen.classList.remove('is-out');
    emailScreen.classList.add('is-visible');
    if (emailInput) {
      const storedEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('userEmail') : null;
      emailInput.value = storedEmail || '';
      emailInput.classList.remove('input-invalid');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(function () { emailInput.focus(); }, 100);
    }
    if (emailError) emailError.textContent = '';
    if (submitBtn) {
      submitBtn.classList.remove('is-loading');
      var textSpan = submitBtn.querySelector('.email-collection-submit-text');
      if (textSpan) textSpan.textContent = 'Begin My Journey';
    }
    updateEmailSubmitState();
    var moodPreload = appState.mood || (el.moodSelect && el.moodSelect.value) || 'calm';
    startJourneyAudioPreload(world, moodPreload);
  }
  console.log('World selected:', world, '→ preload mood:', appState.mood || 'calm');
}

/**
 * Handle mood button selection
 * @param {string} mood - Selected mood (calm, confident, curious)
 */
function selectMood(mood) {
  const el = getElements();
  
  // Update app state
  appState.mood = mood;
  
  // Update hidden dropdown for backward compatibility
  if (el.moodSelect) {
    el.moodSelect.value = mood;
  }
  
  // Remove active class from all mood buttons
  if (el.moodButtons) {
    el.moodButtons.forEach(btn => {
      btn.classList.remove('active');
    });
  }
  
  // Add active class to selected button
  const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }

  // Refresh stem preload if email step is open (same world, new mood = correct audio files)
  var emailScreen = document.getElementById('emailCollectionScreen');
  if (emailScreen && emailScreen.classList.contains('is-visible') && appState.world) {
    startJourneyAudioPreload(appState.world, mood);
  }

  console.log('Mood selected:', mood);
}

/**
 * Initialize app when DOM is ready
 */
function init() {
  try {
    // Get all elements
    getElements();
    initTurnstileWidgets();

    if (typeof window !== 'undefined' && window.DREAMEVO_AMBIENT_URL) {
      var ambEl = document.getElementById('ambientAudio');
      if (ambEl) {
        var srcEl = ambEl.querySelector('source');
        if (srcEl) {
          srcEl.src = window.DREAMEVO_AMBIENT_URL;
          srcEl.type = 'audio/mpeg';
        }
        ambEl.load();
      }
    }
    
    // Initialize TTS
    initTTS();
    
    // Set initial state
    setAppState('idle');
    
    // Landing: switch to world selection (wire CTAs here)
    function showWorldSelection(preSelectWorld) {
      document.body.classList.remove('view-landing');
      syncViewLandingDocClass();
      const ws = document.getElementById('worldSelectionScreen');
      if (ws) ws.setAttribute('aria-hidden', 'false');
      const lv = document.getElementById('landingView');
      if (lv) lv.setAttribute('aria-hidden', 'true');
      if (typeof preSelectWorld === 'string' && typeof selectWorld === 'function') {
        selectWorld(preSelectWorld);
      }
    }
    
    // Edge cases: check for abandoned journey or returning user
    var progress = getProgress();
    var storedEmail = getAnalyticsUserEmail();
    if (progress || (getJourneyCompleted() && storedEmail)) {
      document.body.classList.remove('view-landing');
      syncViewLandingDocClass();
      var ws = document.getElementById('worldSelectionScreen');
      var lv = document.getElementById('landingView');
      if (ws) ws.setAttribute('aria-hidden', 'false');
      if (lv) lv.setAttribute('aria-hidden', 'true');
    }
    if (progress) {
      showContinueJourneyOverlay();
    } else if (getJourneyCompleted() && storedEmail) {
      showReturningUserOverlay(storedEmail);
    }
    
    // Connection error overlay: Try Again / Download for Offline
    var tryAgainBtn = document.getElementById('connectionErrorTryAgain');
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', function () {
        if (typeof _connectionErrorTryAgain === 'function') {
          _connectionErrorTryAgain();
        }
        hideConnectionError();
      });
    }
    var downloadOfflineBtn = document.getElementById('connectionErrorDownloadOffline');
    if (downloadOfflineBtn) {
      downloadOfflineBtn.addEventListener('click', function () {
        showToast('Download for offline coming soon.');
      });
    }
    
    // Continue journey overlay: Yes / Start Fresh
    var continueYesBtn = document.getElementById('continueJourneyYes');
    if (continueYesBtn) {
      continueYesBtn.addEventListener('click', function () {
        var p = getProgress();
        clearProgress();
        hideContinueJourneyOverlay();
        if (p && p.world) {
          showWorldSelection(p.world);
          if (p.mood && typeof selectMood === 'function') selectMood(p.mood);
          if (p.userName && el.userNameInput) el.userNameInput.value = p.userName;
          if (appState) {
            appState.world = p.world;
            appState.mood = p.mood || 'curious';
            appState.userName = p.userName || '';
          }
        } else {
          showWorldSelection();
        }
      });
    }
    var startFreshBtn = document.getElementById('continueJourneyStartFresh');
    if (startFreshBtn) {
      startFreshBtn.addEventListener('click', function () {
        clearProgress();
        hideContinueJourneyOverlay();
      });
    }
    
    // Returning user overlay: Start New Journey
    var returningStartBtn = document.getElementById('returningUserStartBtn');
    if (returningStartBtn) {
      returningStartBtn.addEventListener('click', function () {
        hideReturningUserOverlay();
        showWorldSelection();
      });
    }
    loadOwnerSiteSettings();
    const landingCta = document.getElementById('landingCta');
    if (landingCta) {
      landingCta.addEventListener('click', function () {
        var dm = document.getElementById('dream-modes');
        if (dm) {
          dm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          dm.classList.add('landing-section--highlight');
          setTimeout(function () { dm.classList.remove('landing-section--highlight'); }, 2200);
        }
      });
    }
    var landingWorldCards = document.getElementById('landingWorldCards');
    if (landingWorldCards) {
      landingWorldCards.addEventListener('click', function (e) {
        var exploreBtn = e.target.closest('.landing-world-btn');
        if (exploreBtn) {
          var w = exploreBtn.getAttribute('data-landing-world');
          if (w) {
            e.preventDefault();
            showWorldSelection(w);
            return;
          }
        }
        var card = e.target.closest('.landing-world-card--clickable');
        if (!card) return;
        var mode = card.getAttribute('data-mode');
        if (mode) {
          e.preventDefault();
          showWorldSelection(mode);
        }
      });
      landingWorldCards.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.landing-world-card--clickable');
        if (!card || e.target.closest('.landing-world-btn')) return;
        e.preventDefault();
        var mode = card.getAttribute('data-mode');
        if (mode) showWorldSelection(mode);
      });
    }
    var chooseOwnDreamForm = document.getElementById('chooseOwnDreamForm');
    if (chooseOwnDreamForm) {
      chooseOwnDreamForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('chooseOwnDreamEmail');
        var email = input && input.value ? input.value.trim() : '';
        if (!isValidEmail(email)) {
          showToast('Please enter a valid email address.');
          return;
        }
        try {
          localStorage.setItem('dreamevo_choose_own_dream_email', email.toLowerCase());
        } catch (err) { /* ignore */ }
        var submitBtn = document.getElementById('chooseOwnDreamSubmit');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saved…';
        }
        saveEmailToSupabase(email, { source: 'choose_own_dream_waitlist', mode_selected: null, formId: 'chooseOwnDreamForm' }).then(function () {
          showToast("You're on the list — we'll email you when custom dreams launch.");
          if (chooseOwnDreamForm) chooseOwnDreamForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Notify me';
          }
        });
      });
    }
    var pricingExplorerBtn = document.getElementById('pricingExplorerBtn');
    if (pricingExplorerBtn) {
      pricingExplorerBtn.addEventListener('click', function () {
        var dm = document.getElementById('dream-modes');
        if (dm) {
          dm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          dm.classList.add('landing-section--highlight');
          setTimeout(function () { dm.classList.remove('landing-section--highlight'); }, 2200);
        }
      });
    }
    var pricingMasterBtn = document.getElementById('pricingMasterBtn');
    var pricingArchitectBtn = document.getElementById('pricingArchitectBtn');
    var pricingWaitlistBox = document.getElementById('pricingWaitlistBox');
    var pricingWaitlistPlanInput = document.getElementById('pricingWaitlistPlan');
    var pricingWaitlistPlanLabel = document.getElementById('pricingWaitlistPlanLabel');
    function openPricingWaitlist(plan) {
      if (!pricingWaitlistBox || !pricingWaitlistPlanInput) return;
      pricingWaitlistPlanInput.value = plan;
      if (pricingWaitlistPlanLabel) {
        pricingWaitlistPlanLabel.textContent = 'Selected plan: ' + plan;
      }
      pricingWaitlistBox.classList.add('is-visible');
      pricingWaitlistBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var emailInput = document.getElementById('pricingWaitlistEmail');
      if (emailInput) emailInput.focus();
    }
    if (pricingMasterBtn) {
      pricingMasterBtn.addEventListener('click', function () { openPricingWaitlist('dream_master'); });
    }
    if (pricingArchitectBtn) {
      pricingArchitectBtn.addEventListener('click', function () { openPricingWaitlist('dream_architect'); });
    }
    var pricingWaitlistForm = document.getElementById('pricingWaitlistForm');
    if (pricingWaitlistForm) {
      pricingWaitlistForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = document.getElementById('pricingWaitlistEmail');
        var submitBtn = document.getElementById('pricingWaitlistSubmit');
        var plan = pricingWaitlistPlanInput && pricingWaitlistPlanInput.value ? pricingWaitlistPlanInput.value : '';
        var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
        if (!plan) {
          showToast('Please choose Dream Master or Dream Architect first.');
          return;
        }
        if (!isValidEmail(email)) {
          showToast('Please enter a valid email address.');
          return;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
        }
        var sourceName = plan === 'dream_architect' ? 'pricing_dream_architect_waitlist' : 'pricing_dream_master_waitlist';
        saveEmailToSupabase(email, { source: sourceName, mode_selected: null, formId: 'pricingWaitlistForm' }).then(function () {
          showToast('You are on the ' + (plan === 'dream_architect' ? 'Dream Architect' : 'Dream Master') + ' waitlist.');
          if (pricingWaitlistForm) pricingWaitlistForm.reset();
          if (pricingWaitlistPlanLabel) pricingWaitlistPlanLabel.textContent = '';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Join waitlist';
          }
        });
      });
    }
    
    // Add input listeners for real-time updates
    const el = getElements();
    
    if (el.userNameInput) {
      el.userNameInput.addEventListener('input', (e) => {
        appState.userName = e.target.value.trim();
      });
    }
    
    // World card click: use delegation so clicks always work (no overlay or init-order issues)
    const worldSelectionScreen = document.getElementById('worldSelectionScreen');
    if (worldSelectionScreen) {
      worldSelectionScreen.addEventListener('click', function (e) {
        var chooseBtn = e.target.closest('.card-choose-btn');
        if (chooseBtn) {
          var wBtn = chooseBtn.getAttribute('data-choose-world');
          if (wBtn) {
            e.preventDefault();
            e.stopPropagation();
            selectWorld(wBtn);
            return;
          }
        }
        const card = e.target.closest('.world-card');
        if (!card) return;
        const world = card.getAttribute('data-world');
        if (world) {
          e.preventDefault();
          e.stopPropagation();
          selectWorld(world);
        }
      });
    }
    // Parallax on cards (non-blocking)
    if (el.cardJourney) setupCardParallax(el.cardJourney);
    if (el.cardSanctuary) setupCardParallax(el.cardSanctuary);
    if (el.cardRomantic) setupCardParallax(el.cardRomantic);
    
    // Mood button click handlers
    if (el.moodButtons) {
      el.moodButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const mood = e.currentTarget.getAttribute('data-mood');
          if (mood) {
            selectMood(mood);
          }
        });
      });
    }
    
    // Email collection: real-time validation (disable submit until valid, show error)
    if (el.emailCollectionInput) {
      el.emailCollectionInput.addEventListener('input', function () {
        var errorEl = document.getElementById('emailCollectionError');
        var val = (this.value || '').trim();
        var valid = isValidEmail(val);
        if (errorEl) {
          errorEl.textContent = valid ? '' : (val.length ? 'Please enter a valid email address.' : '');
        }
        if (this.classList) {
          if (valid) this.classList.remove('input-invalid'); else if (val.length) this.classList.add('input-invalid');
        }
        updateEmailSubmitState();
      });
      el.emailCollectionInput.addEventListener('blur', function () {
        var val = (this.value || '').trim();
        var errorEl = document.getElementById('emailCollectionError');
        if (val && !isValidEmail(val) && errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
        }
      });
    }

    // Email collection form: submit → save userEmail, Supabase, then start audio (proceed even if save fails)
    if (el.emailCollectionForm) {
      el.emailCollectionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailEl = el.emailCollectionInput;
        var errorEl = document.getElementById('emailCollectionError');
        var submitBtn = document.getElementById('emailCollectionSubmit');
        var email = (emailEl && emailEl.value && emailEl.value.trim()) || '';
        if (!isValidEmail(email)) {
          if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
          if (emailEl) emailEl.classList.add('input-invalid');
          if (emailEl) emailEl.focus();
          return;
        }
        if (errorEl) errorEl.textContent = '';
        if (emailEl) emailEl.classList.remove('input-invalid');

        // Loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('is-loading');
          var textSpan = submitBtn.querySelector('.email-collection-submit-text');
          if (textSpan) textSpan.textContent = 'Starting…';
        }

        try {
          localStorage.setItem('userEmail', email);
        } catch (err) {
          console.warn('localStorage not available:', err);
        }

        trackEvent('email_collected', { user_email: email });

        var nameFromEmail = email.split('@')[0] || 'Dreamer';
        if (el.userNameInput) el.userNameInput.value = nameFromEmail;
        if (appState) appState.userName = nameFromEmail;
        if (appState && !appState.mood) appState.mood = 'curious';
        if (el.moodSelect) el.moodSelect.value = appState.mood || 'curious';

        // Save to Supabase; on failure we already log + toast inside saveEmailToSupabase
        saveEmailToSupabase(email, { formId: 'emailCollectionForm' }).then(function () {
          var screen = el.emailCollectionScreen;
          if (screen) {
            screen.classList.remove('is-visible');
            screen.classList.add('is-out');
            setTimeout(function () {
              if (screen) {
                screen.setAttribute('aria-hidden', 'true');
                screen.classList.remove('is-out');
              }
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-loading');
                var span = submitBtn && submitBtn.querySelector('.email-collection-submit-text');
                if (span) span.textContent = 'Begin My Journey';
              }
              handleStartDream();
            }, 400);
          } else {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.classList.remove('is-loading');
              var span = submitBtn && submitBtn.querySelector('.email-collection-submit-text');
              if (span) span.textContent = 'Begin My Journey';
            }
            handleStartDream();
          }
        }).catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            var span = submitBtn && submitBtn.querySelector('.email-collection-submit-text');
            if (span) span.textContent = 'Begin My Journey';
          }
          handleStartDream();
        });
      });
    }
    
    // Spacebar: pause/play during dream playback
    document.addEventListener('keydown', function (e) {
      if (e.code !== 'Space') return;
      var target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (!appState.isActive) return;
      e.preventDefault();
      togglePlaybackPause();
    });

    // Escape hatch: tap once to show minimal controls; 3s no interaction then hide. No download.
    var playbackHatch = document.getElementById('playbackEscapeHatch');
    if (playbackHatch) {
      playbackHatch.addEventListener('click', function (e) {
        if (!document.body.classList.contains('state-active')) return;
        if (!playbackHatch.classList.contains('is-visible')) {
          showPlaybackEscapeControls();
        } else {
          resetPlaybackEscapeHideTimeout();
        }
      });
      var pausePlayBtn = document.getElementById('playbackPausePlayBtn');
      if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          togglePlaybackPause();
          var main = getMainPlaybackElement();
          pausePlayBtn.textContent = main && main.paused ? '▶' : '‖';
          pausePlayBtn.setAttribute('aria-label', main && main.paused ? 'Play' : 'Pause');
          resetPlaybackEscapeHideTimeout();
        });
      }
      var seekSlider = document.getElementById('playbackSeekSlider');
      if (seekSlider) {
        seekSlider.addEventListener('input', function () {
          var main = getMainPlaybackElement();
          if (!main || !main.duration || !isFinite(main.duration)) return;
          var t = (parseInt(this.value, 10) / 1000) * main.duration;
          main.currentTime = Math.max(0, Math.min(t, main.duration - 0.01));
          resetPlaybackEscapeHideTimeout();
        });
        seekSlider.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        seekSlider.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
      }
      var skipBtn = document.getElementById('playbackSkipEndBtn');
      if (skipBtn) {
        skipBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          skipToEndPlayback();
          resetPlaybackEscapeHideTimeout();
        });
      }
      var volSlider = document.getElementById('playbackVolumeSlider');
      if (volSlider) {
        volSlider.addEventListener('input', function () {
          var v = parseInt(this.value, 10) / 100;
          if (stemAudio.narration) stemAudio.narration.volume = v;
          if (stemAudio.ambient) stemAudio.ambient.volume = v;
          var el = getElements();
          if (el.ambientAudio) el.ambientAudio.volume = v;
          resetPlaybackEscapeHideTimeout();
        });
        volSlider.addEventListener('click', function (e) { e.stopPropagation(); });
      }
    }

    // No download: disable context menu and selection during playback
    document.body.addEventListener('contextmenu', function (e) {
      if (document.body.classList.contains('state-active')) {
        e.preventDefault();
      }
    });
    var dreamVideo = document.getElementById('dreamVideo');
    if (dreamVideo) {
      dreamVideo.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    }
    var ambientAudioEl = document.getElementById('ambientAudio');
    if (ambientAudioEl) {
      ambientAudioEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    }

    // Set default mood to calm
    selectMood('calm');
    
    // Backward compatibility: sync dropdown changes
    if (el.worldSelect) {
      el.worldSelect.addEventListener('change', (e) => {
        selectWorld(e.target.value);
      });
    }
    
    if (el.moodSelect) {
      el.moodSelect.addEventListener('change', (e) => {
        selectMood(e.target.value);
      });
    }
    
    syncViewLandingDocClass();

    fetchMediaPresignStatus(function () {
      if (_mediaPresignEnabled) {
        console.log('DREAMEVO: short-lived media URLs enabled (R2 presign)');
      }
    });

    console.log('DreamPulse Premium initialized');
    console.log('TTS voices available:', voices.length);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// ============================================
// Start App
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
window.DreamPulse = {
  handleStartDream,
  setAppState,
  getVideoSource,
  getIntroVideoUrl,
  getJourneyIntroVideoUrl,
  getApiBase,
  presignJourneyMedia,
  fetchMediaPresignStatus,
  getDreamLoopVideoSource,
  selectWorld,
  selectMood,
  appState,
  trackEvent,
  trackFeedbackSubmitted
};

// Make selectWorld globally accessible for inline onclick handlers
window.selectWorld = selectWorld;
