// Allows override via global if backend runs elsewhere
const STORY_URL = window.DREAM_STORY_URL || (typeof location !== 'undefined' && location.origin ? location.origin + '/api/story/claude/tts' : 'http://localhost:3000/api/story/claude/tts');
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
  // Minimal ducking: only reduce base layer slightly, keep SFX/ambience full
  if (baseBed) {
    fadeTo(baseBed, (baseBed._targetVolume || 0.12) * 0.65, 250);
  }
}

function duckEnd() {
  ducking = false;
  // Restore base layer to normal
  if (baseBed) {
    fadeTo(baseBed, baseBed._targetVolume || 0.12, 400);
  }
}

function loadVoices() {
  if (typeof speechSynthesis === 'undefined') {
    console.error('❌ Speech Synthesis API not available');
    return;
  }
  voices = speechSynthesis.getVoices();
  console.log(`🎙️ Loaded ${voices.length} voices`);
  if (voices.length > 0) {
    console.log('Available voices:', voices.map(v => v.name).join(', '));
  }
  if (voices.length && !selectedVoice) selectBestVoice();
}

function selectBestVoice() {
  const prefs = [
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

  selectedVoice = voices.find(v => prefs.includes(v.name)) || null;
  if (selectedVoice) {
    console.log('✨ Found premium Microsoft voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name);
    return selectedVoice;
  }

  // Fallback 1: Any Microsoft Natural voice
  selectedVoice = voices.find(v => v.name.includes('Microsoft') && v.name.includes('Natural') && v.lang.startsWith('en')) || null;
  if (selectedVoice) {
    console.log('✨ Found Microsoft Natural voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name);
    return selectedVoice;
  }

  // Fallback 2: Google voices
  selectedVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en')) || null;
  if (selectedVoice) {
    console.log('✨ Found Google voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name);
    return selectedVoice;
  }

  // Fallback 3: Apple/Mac voices
  const apple = ['samantha', 'karen', 'victoria', 'allison', 'susan', 'fiona'];
  selectedVoice = voices.find(v => apple.some(a => v.name.toLowerCase().includes(a)) && v.lang.startsWith('en')) || null;
  if (selectedVoice) {
    console.log('✨ Found Apple voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name);
    return selectedVoice;
  }

  // Fallback 4: Any English voice
  selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  if (selectedVoice) {
    console.log('✨ Using fallback voice:', selectedVoice.name);
    setVoiceLabel(selectedVoice.name);
    return selectedVoice;
  }

  console.warn('⚠️ No voice found!');
  setVoiceLabel('unavailable');
  return null;
}

function speakText(text, opts = {}, onEnd = () => {}) {
  if (!text || !window.speechSynthesis) {
    console.warn('⚠️ Speech synthesis not available');
    return onEnd();
  }
  
  // Ensure voices are loaded
  if (voices.length === 0) {
    loadVoices();
  }
  if (!selectedVoice && voices.length > 0) {
    selectBestVoice();
  }

  // Wait before speaking to avoid synthesis-failed errors
  setTimeout(() => {
    try {
      // Cancel any pending utterances
      speechSynthesis.cancel();
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text);
        
        // ONLY set voice if we have one; don't force non-existent voice
        if (selectedVoice) {
          try {
            utter.voice = selectedVoice;
          } catch (e) {
            console.warn('Could not set voice:', e);
          }
        }
        
        // Use safe defaults for speech properties
        utter.lang = 'en-US';
        utter.rate = 0.90;  // Fixed rate to avoid Edge issues
        utter.pitch = 1.0;  // Fixed pitch
        utter.volume = 1.0; // Full volume

        utter.onstart = () => console.log('🎤 Speaking:', text.substring(0, 40) + '...');
        utter.onend = () => {
          console.log('✅ Speech ended');
          onEnd();
        };
        utter.onerror = (e) => {
          console.error('❌ Speech error:', e.error);
          // Continue anyway on error
          setTimeout(onEnd, 100);
        };

        duckStart();
        speechSynthesis.speak(utter);
        console.log('🔊 Utterance queued');
      }, 50);
    } catch (error) {
      console.error('❌ Fatal error in speakText:', error);
      onEnd();
    }
  }, 200);  // 200ms delay before attempting speech
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
      duckEnd();
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

    const rate = 0.96 + (Math.random() * 0.05 - 0.025);
    const pitch = 0.98 + Math.random() * 0.04;

    speakText(`${sentences[idx]}`, { rate, pitch, volume: 0.9 }, () => {
      duckEnd();
      idx += 1;
      setTimeout(speakNext, 480 + Math.random() * 160);
    });
  };

  speakNext();
}

function wireUI() {
  // Load voices immediately and set up listener
  loadVoices();
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      console.log('🎙️ Voice list changed, reloading...');
      loadVoices();
    };
  }
  
  // Retry voice loading after a delay (some browsers load async)
  setTimeout(() => {
    if (voices.length === 0) {
      console.log('⏱️ Retrying voice load...');
      loadVoices();
    }
  }, 1000);
  
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
