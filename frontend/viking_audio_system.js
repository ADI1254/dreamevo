/* ============================================
   VIKING SEA - CINEMATIC AUDIO SYSTEM
   Multi-layer orchestration with voice ducking
   ============================================ */

/**
 * Viking Sea Audio Architecture:
 * LAYER 1: Orchestral Music (30-50% volume, ducks for voice)
 * LAYER 2: Cinematic SFX (20-35% volume, ships/waves/wind)
 * LAYER 3: Voice Narration (0.8-1.0 volume, always on top)
 * LAYER 4: Ambient Pads (15-25% volume, sustains emotion)
 */

class VikingAudioSystem {
  constructor() {
    this.layers = {
      orchestral: null,
      sfx: null,
      voice: null,
      ambient: null
    };
    
    this.layerAudios = [];
    this.isVoiceSpeaking = false;
    this.currentScene = 'opening';
    this.masterVolume = 0.85;
    
    // Ducking state - orchestral volume reduced when voice speaks
    this.orchVolume = 0.4;
    this.orchVolumeNormal = 0.4;
    this.orchVolumeDucked = 0.15;
  }

  /**
   * Viking Sea Narrative Arc with Audio Cues
   * Maps story progression (0-100%) to cinematic moments
   */
  getSceneAudioMap() {
    return {
      opening: {
        // "A Viking warrior stands at the bow..."
        orchestral: '/CINEMATIC_AUDIO/viking_opening_theme.mp3', // Epic strings + horns
        sfx: '/CINEMATIC_AUDIO/ship_creaks.mp3',
        ambient: '/CINEMATIC_AUDIO/ocean_distant_waves.mp3',
        narrationVoice: 'viking_authority', // Deep, gravelly, commanding
        narratorGender: 'male',
        musicIntensity: 0.7,
        pacing: 0.65 // Slightly slower for gravitas
      },

      voyageBegins: {
        // "The crew prepares... sails billow..."
        orchestral: '/CINEMATIC_AUDIO/viking_voyage_theme.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/sails_flapping.mp3', volume: 0.3, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/rope_creaks.mp3', volume: 0.25, delay: 2 },
          { sound: '/CINEMATIC_AUDIO/crew_orders.mp3', volume: 0.2, delay: 4 } // Faint shouting
        ],
        ambient: '/CINEMATIC_AUDIO/storm_brewing.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.6,
        pacing: 0.7
      },

      seaAdventure: {
        // "Hours pass... the horizon calls..."
        orchestral: '/CINEMATIC_AUDIO/viking_discovery_theme.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/waves_crashing.mp3', volume: 0.35, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/wind_howling.mp3', volume: 0.25, delay: 1 },
          { sound: '/CINEMATIC_AUDIO/seagulls.mp3', volume: 0.15, delay: 3 }
        ],
        ambient: '/CINEMATIC_AUDIO/endless_sea_pad.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.65,
        pacing: 0.72
      },

      stormApproach: {
        // "Dark clouds gather... the sky darkens..."
        orchestral: '/CINEMATIC_AUDIO/viking_storm_rising.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/thunder_distant.mp3', volume: 0.3, delay: 5 },
          { sound: '/CINEMATIC_AUDIO/wind_intensifies.mp3', volume: 0.4, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/ship_rocks.mp3', volume: 0.25, delay: 2 }
        ],
        ambient: '/CINEMATIC_AUDIO/storm_pad_intense.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.85,
        pacing: 0.65
      },

      battleReady: {
        // "They appear on the horizon... weapons drawn..."
        orchestral: '/CINEMATIC_AUDIO/viking_battle_drums.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/drums_war.mp3', volume: 0.4, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/swords_clash.mp3', volume: 0.3, delay: 3 },
          { sound: '/CINEMATIC_AUDIO/horn_battle_call.mp3', volume: 0.35, delay: 1 }
        ],
        ambient: '/CINEMATIC_AUDIO/adrenaline_pad.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.95,
        pacing: 0.75
      },

      triumph: {
        // "Victory... the gods smile upon us..."
        orchestral: '/CINEMATIC_AUDIO/viking_victory_fanfare.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/cheer_crew.mp3', volume: 0.3, delay: 2 },
          { sound: '/CINEMATIC_AUDIO/horn_fanfare.mp3', volume: 0.35, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/bells_celebration.mp3', volume: 0.25, delay: 4 }
        ],
        ambient: '/CINEMATIC_AUDIO/victory_pad.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.8,
        pacing: 0.78
      },

      ending: {
        // "And so the journey ends... legend born..."
        orchestral: '/CINEMATIC_AUDIO/viking_ending_theme.mp3',
        sfx: [
          { sound: '/CINEMATIC_AUDIO/distant_land.mp3', volume: 0.2, delay: 0 },
          { sound: '/CINEMATIC_AUDIO/waves_gentle.mp3', volume: 0.25, delay: 1 }
        ],
        ambient: '/CINEMATIC_AUDIO/resolution_pad.mp3',
        narrationVoice: 'viking_authority',
        musicIntensity: 0.6,
        pacing: 0.68
      }
    };
  }

  /**
   * Initialize multi-layer audio system
   */
  async initializeAudioLayers(scene = 'opening') {
    this.currentScene = scene;
    const sceneConfig = this.getSceneAudioMap()[scene];
    
    if (!sceneConfig) {
      console.warn(`⚠️ Unknown Viking scene: ${scene}`);
      return;
    }

    // Stop all existing audio
    this.stopAllLayers();

    try {
      // Layer 1: Orchestral Music (foundation)
      if (sceneConfig.orchestral) {
        this.layers.orchestral = this.createAudioLayer(
          sceneConfig.orchestral,
          this.orchVolumeNormal * sceneConfig.musicIntensity,
          true // loop
        );
      }

      // Layer 2: Cinematic SFX
      if (sceneConfig.sfx) {
        if (Array.isArray(sceneConfig.sfx)) {
          for (const sfxLayer of sceneConfig.sfx) {
            const sfxAudio = this.createAudioLayer(
              sfxLayer.sound,
              sfxLayer.volume || 0.3,
              sfxLayer.loop || false
            );
            if (sfxLayer.delay > 0) {
              setTimeout(() => sfxAudio.play(), sfxLayer.delay * 1000);
            } else {
              sfxAudio.play();
            }
            this.layerAudios.push(sfxAudio);
          }
        } else {
          const sfxAudio = this.createAudioLayer(sceneConfig.sfx, 0.3, false);
          sfxAudio.play();
          this.layerAudios.push(sfxAudio);
        }
      }

      // Layer 4: Ambient Pad (emotion sustainer)
      if (sceneConfig.ambient) {
        this.layers.ambient = this.createAudioLayer(
          sceneConfig.ambient,
          0.2,
          true // loop
        );
        this.layers.ambient.play();
      }

      // Start orchestral/ambient
      if (this.layers.orchestral) {
        this.layers.orchestral.play();
      }

      console.log(`✅ Viking audio initialized: ${scene}`);
    } catch (error) {
      console.error('❌ Error initializing Viking audio:', error);
    }
  }

  /**
   * Create a single audio layer with error handling
   */
  createAudioLayer(src, volume = 0.5, loop = false) {
    const audio = new Audio(src);
    audio.volume = volume * this.masterVolume;
    audio.loop = loop;
    
    audio.onerror = () => {
      console.warn(`⚠️ Failed to load audio: ${src}`);
    };
    
    this.layerAudios.push(audio);
    return audio;
  }

  /**
   * Transition between scenes with crossfade
   */
  async transitionToScene(newScene, fadeTime = 1000) {
    console.log(`🎬 Transitioning to: ${newScene}`);
    
    // Fade out current layers
    await this.fadeOutLayers(fadeTime / 2);
    
    // Initialize new scene
    await this.initializeAudioLayers(newScene);
  }

  /**
   * VOICE DUCKING SYSTEM
   * Automatically reduce orchestral volume when voice speaks
   */
  startNarration() {
    this.isVoiceSpeaking = true;
    
    // Smoothly duck orchestral volume
    if (this.layers.orchestral) {
      this.smoothVolumeTransition(
        this.layers.orchestral,
        this.orchVolumeNormal,
        this.orchVolumeDucked,
        300 // 300ms fade
      );
    }
  }

  endNarration() {
    this.isVoiceSpeaking = false;
    
    // Restore orchestral volume
    if (this.layers.orchestral) {
      this.smoothVolumeTransition(
        this.layers.orchestral,
        this.orchVolumeDucked,
        this.orchVolumeNormal,
        500 // 500ms restore
      );
    }
  }

  /**
   * Smooth volume transition for ducking effect
   */
  smoothVolumeTransition(audioElement, fromVol, toVol, duration) {
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newVol = fromVol + (toVol - fromVol) * progress;
      audioElement.volume = newVol * this.masterVolume;

      if (currentStep >= steps) {
        clearInterval(interval);
        audioElement.volume = toVol * this.masterVolume;
      }
    }, stepDuration);
  }

  /**
   * Fade out all active layers
   */
  async fadeOutLayers(duration = 1000) {
    const steps = 30;
    const stepDuration = duration / steps;

    return new Promise((resolve) => {
      let completedLayers = 0;
      const allLayers = [
        this.layers.orchestral,
        this.layers.sfx,
        this.layers.voice,
        this.layers.ambient
      ].filter(layer => layer && layer.volume > 0);

      if (allLayers.length === 0) {
        resolve();
        return;
      }

      allLayers.forEach((audio) => {
        const initialVolume = audio.volume;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
          currentStep++;
          audio.volume = initialVolume * (1 - currentStep / steps);

          if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.volume = 0;
            completedLayers++;

            if (completedLayers === allLayers.length) {
              resolve();
            }
          }
        }, stepDuration);
      });
    });
  }

  /**
   * Play narrative text using ElevenLabs API
   * Premium human voice with cinematic timing
   */
  async playNarrativeWithVoice(text, options = {}) {
    const {
      voiceId = '21m00Tcm4TlvDq8ikWAM', // Default: Rachel
      apiKey = '',
      onNarrativeEnd = null
    } = options;

    // Start ducking
    this.startNarration();

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
            style: 0.3, // Add subtle emotion
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) throw new Error('ElevenLabs API error');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      this.layers.voice = new Audio(audioUrl);
      this.layers.voice.volume = 0.95 * this.masterVolume;

      this.layers.voice.onended = () => {
        this.endNarration();
        if (onNarrativeEnd) onNarrativeEnd();
      };

      this.layers.voice.play();
      console.log('🎙️ Viking narration playing');
    } catch (error) {
      console.error('❌ ElevenLabs error:', error);
      this.endNarration();
      
      // Fallback to Web Speech API
      this.playNarrativeWithWebSpeech(text, options, onNarrativeEnd);
    }
  }

  /**
   * Fallback: Web Speech API narration
   */
  playNarrativeWithWebSpeech(text, options = {}, onNarrativeEnd) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = options.pacing || 0.75; // Slow, dramatic pacing
    utterance.pitch = 0.9; // Slightly lower for authority
    utterance.volume = 0.95;

    // Select deep male voice for Viking authority
    const voices = synth.getVoices();
    const maleVoice = voices.find(v => 
      v.name.includes('Male') || v.name.includes('David') || v.name.includes('Marcus')
    );
    if (maleVoice) utterance.voice = maleVoice;

    utterance.onend = () => {
      this.endNarration();
      if (onNarrativeEnd) onNarrativeEnd();
    };

    synth.speak(utterance);
  }

  /**
   * Stop all audio layers
   */
  stopAllLayers() {
    Object.values(this.layers).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    this.layerAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    this.layerAudios = [];
  }

  /**
   * Master volume control
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    Object.values(this.layers).forEach(audio => {
      if (audio) {
        audio.volume = (audio.dataset?.baseVolume || 0.5) * this.masterVolume;
      }
    });
  }

  /**
   * Get system status for debugging
   */
  getStatus() {
    return {
      currentScene: this.currentScene,
      isVoiceSpeaking: this.isVoiceSpeaking,
      masterVolume: this.masterVolume,
      orchestralPlaying: this.layers.orchestral?.playing,
      voicePlaying: this.layers.voice?.playing,
      activeLayers: this.layerAudios.length
    };
  }
}

// Export for use in script.js
window.VikingAudioSystem = VikingAudioSystem;
