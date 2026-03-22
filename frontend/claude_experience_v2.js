const STORY_URL = window.DREAM_STORY_URL || 'http://localhost:8000/story/claude/tts';
const AUDIO_BASE = 'assets/audio/CLAUDE_STORY/';

const SCENES = [
  { start: 0.0, name: 'opening', ambience: 'forest_night.mp3.mp3', volume: 0.40 },
  { start: 0.12, name: 'bus', ambience: 'bus_metal_ambience.mp3.mp3', volume: 0.48 },
  { start: 0.25, name: 'rainey_jan', ambience: 'ocean_waves.mp3.mp3', volume: 0.42, layers: [ { src: 'campfire_crackle.mp3.mp3', volume: 0.44, delayMs: 200 } ] },
  { start: 0.38, name: 'rapids', ambience: 'river_rapids.mp3.mp3', volume: 0.56 },
  { start: 0.52, name: 'wayne', ambience: 'nature-ambience-323729.mp3', volume: 0.38 },
  { start: 0.62, name: 'ron_franz', ambience: 'wind_mountain.mp3.wav', volume: 0.50 },
  { start: 0.74, name: 'alaska', ambience: 'alaska_wilderness.mp3.mp3', volume: 0.54 },
  { start: 0.86, name: 'realization', ambience: 'silence_drone.mp3.mp3', volume: 0.28, layers: [ { src: 'breathing_calm.mp3.mp3', volume: 0.30 } ] },
  { start: 0.94, name: 'closing', ambience: 'ocean_waves.mp3.mp3', volume: 0.40 }
];

let voices = [];
let selectedVoice = null;
let baseBed = null;
let currentAmbience = null;
let currentLayers = [];
let ducking = false;
let currentSceneName = '';

const ui = {
  startBtn: document.getElementById('startBtn'),
  status: document.getElementById('status'),
  voiceName: document.getElementById('voiceName'),
  sceneName: document.getElementById('sceneName'),
  progressFill: document.getElementById('progressFill')
};

function setStatus(text) {
  if (ui.status) ui.status.textContent = text;
}

function setSceneLabel(text) {
  if (ui.sceneName) ui.sceneName.textContent = `Scene: ${text}`;
}

function setVoiceLabel(text) {
  if (ui.voiceName) ui.voiceName.textContent = `Voice: ${text}`;
}

function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function fadeTo(audio, target, duration = 1200) {
  if (!audio) return;
  const steps = 30;
  const stepTime = duration / steps;
  const delta = (target - audio.volume) / steps;
  let count = 0;
  const timer = setInterval(() => {
    count += 1;
    audio.volume = clamp01(audio.volume + delta);
    if (count >= steps) {
      audio.volume = clamp01(target);
      clearInterval(timer);
    }
  }, stepTime);
}

function loadAudio(src, targetVolume = 0.2, loop = true) {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = 0;
  audio._targetVolume = targetVolume;
  return audio;
}

function startBaseLayer() {
  if (baseBed) {
    baseBed.play().catch(() => {});
    fadeTo(baseBed, baseBed._targetVolume, 900);
    return;
  }
  baseBed = loadAudio(`${AUDIO_BASE}lucid_dreaming_base.mp3.m4a`, 0.12, true);
  baseBed.play().catch(() => {});
  fadeTo(baseBed, baseBed._targetVolume, 1800);
  console.log('🔊 Lucid base layer started');
}

function stopLayers() {
  currentLayers.forEach(layer => {
    layer.pause();
    layer.currentTime = 0;
  });
  currentLayers = [];
}

function setScene(scene) {
  if (!scene || scene.name === currentSceneName) return;
  currentSceneName = scene.name;
  setSceneLabel(scene.name);
  console.log(`📍 Scene: ${scene.name} | Ambience: ${scene.volume}`);

  const nextAmbience = loadAudio(`${AUDIO_BASE}${scene.ambience}`, scene.volume, true);
  nextAmbience.play().catch(() => {});
  fadeTo(nextAmbience, scene.volume, 1400);

  if (currentAmbience) {
    fadeTo(currentAmbience, 0, 1100);
    setTimeout(() => currentAmbience && currentAmbience.pause(), 1200);
  }
  currentAmbience = nextAmbience;

  stopLayers();
  if (scene.layers && scene.layers.length) {
    scene.layers.forEach(layerCfg => {
      const layer = loadAudio(`${AUDIO_BASE}${layerCfg.src}`, layerCfg.volume, layerCfg.loop !== false);
      currentLayers.push(layer);
      const start = () => {
        layer.play().catch(() => {});
        fadeTo(layer, layerCfg.volume, 900);
      };
      if (layerCfg.delayMs) {
        setTimeout(start, layerCfg.delayMs);
      } else {
        start();
      }
    });
  }
}

function sceneForProgress(progress) {
  let current = SCENES[0];
  for (const scene of SCENES) {
    if (progress >= scene.start) current = scene;
  }
  return current;
}

function duckStart() {
  if (ducking) return;
  ducking = true;
  const targets = [baseBed, currentAmbience, ...currentLayers];
  targets.forEach(a => {
    if (!a) return;
    const target = (a._targetVolume || a.volume || 0.2) * 0.72;
    fadeTo(a, target, 300);
  });
}

function duckEnd() {
  ducking = false;
  const targets = [baseBed, currentAmbience, ...currentLayers];
  targets.forEach(a => {
    if (!a) return;
    fadeTo(a, a._targetVolume || a.volume || 0.2, 520);
  });
}

function loadVoices() {
  if (typeof speechSynthesis === 'undefined') {
    console.error('❌ Speech Synthesis API not available');
    return;
  }
  voices = speechSynthesis.getVoices();
  console.log(`🎙️ Loaded ${voices.length} voices`);
  if (voices.length && !selectedVoice) selectBestVoice();
}

function selectBestVoice() {
  // TRY: US English with Natural/Online suffix (most stable)
  selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Online') || v.name.includes('Natural'))) || null;
  if (selectedVoice) {
    console.log('✨ Found stable en-US Online voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name.substring(0, 30));
    return selectedVoice;
  }

  // FALLBACK: Legacy Windows voices (most compatible with Edge)
  selectedVoice = voices.find(v => ['David', 'Zira', 'Mark'].some(name => v.name.includes(name))) || null;
  if (selectedVoice) {
    console.log('✨ Found legacy voice:', selectedVoice.name);
    setVoiceLabel('Windows Legacy');
    return selectedVoice;
  }

  // FALLBACK: Any en-US
  selectedVoice = voices.find(v => v.lang === 'en-US') || null;
  if (selectedVoice) {
    console.log('✨ Found en-US:', selectedVoice.name);
    setVoiceLabel('en-US');
    return selectedVoice;
  }

  // FALLBACK: Any English
  selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  if (selectedVoice) {
    console.log('✨ Using:', selectedVoice.name);
    setVoiceLabel('English');
    return selectedVoice;
  }

  console.warn('⚠️ No voice!');
  setVoiceLabel('none');
  return null;
}

// Attempt TTS with EXTREME caution for Edge
function speakText(text, opts = {}, onEnd = () => {}) {
  if (!text || typeof speechSynthesis === 'undefined') {
    return onEnd();
  }
  
  if (voices.length === 0) loadVoices();
  if (!selectedVoice && voices.length > 0) selectBestVoice();

  // LONG stabilization delay (600ms for Edge)
  setTimeout(() => {
    try {
      speechSynthesis.cancel();
      
      setTimeout(() => {
        try {
          const utter = new SpeechSynthesisUtterance(text);
          
          if (selectedVoice) {
            utter.voice = selectedVoice;
          }
          
          utter.lang = 'en-US';
          utter.rate = 0.90;
          utter.pitch = 1.0;
          utter.volume = 1.0;

          utter.onstart = () => {
            console.log('🎤 Speaking');
            duckStart();
          };
          utter.onend = () => {
            console.log('✅ Done speaking');
            duckEnd();
            onEnd();
          };
          utter.onerror = (e) => {
            console.error('❌ TTS error:', e.error);
            duckEnd();
            setTimeout(onEnd, 100);
          };

          speechSynthesis.speak(utter);
        } catch (err) {
          console.error('❌ Utterance error:', err);
          onEnd();
        }
      }, 100);
    } catch (err) {
      console.error('❌ Cancel error:', err);
      onEnd();
    }
  }, 600);  // 600ms pre-flight for Edge
}

function cleanStoryText(raw) {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line &&
      !line.startsWith('#') &&
      !line.startsWith('---') &&
      !line.startsWith('[AMBIENT') &&
      !line.startsWith('[VOICE') &&
      !line.startsWith('[PAUSE') &&
      !line.startsWith('[FADE'))
    .join(' ');
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

async function fetchStory() {
  const res = await fetch(STORY_URL);
  if (!res.ok) {
    throw new Error(`Story fetch failed (${res.status})`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`Backend error: ${data.error}`);
  }
  if (!data.story || !data.story.trim()) {
    throw new Error('Story is empty from backend');
  }
  return data.story;
}

function updateProgress(pct) {
  if (ui.progressFill) ui.progressFill.style.width = `${Math.round(pct * 100)}%`;
}

async function playExperience() {
  ui.startBtn.disabled = true;
  setStatus('Loading voices and audio...');

  loadVoices();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  startBaseLayer();

  const storyRaw = await fetchStory();
  const cleaned = cleanStoryText(storyRaw);
  const sentences = splitSentences(cleaned);
  if (!sentences.length) throw new Error('Story is empty');

  let idx = 0;
  const total = sentences.length;
  setStatus('Playing story...');

  const speakNext = () => {
    if (idx >= total) {
      setStatus('Complete.');
      fadeTo(baseBed, 0, 2000);
      fadeTo(currentAmbience, 0, 2000);
      stopLayers();
      ui.startBtn.disabled = false;
      return;
    }

    const progress = idx / total;
    updateProgress(progress);
    const scene = sceneForProgress(progress);
    setScene(scene);

    speakText(`${sentences[idx]}`, {}, () => {
      idx += 1;
      setTimeout(speakNext, 500 + Math.random() * 200);
    });
  };

  speakNext();
}

function wireUI() {
  loadVoices();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  setTimeout(() => {
    if (voices.length === 0) {
      console.log('⏱️ Retrying voice load...');
      loadVoices();
    }
  }, 1500);
  
  ui.startBtn?.addEventListener('click', async () => {
    try {
      await playExperience();
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
      ui.startBtn.disabled = false;
    }
  });
}

wireUI();
setStatus('Ready');
