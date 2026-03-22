/* ============================================
   VIKING SEA VIDEO + AUDIO SYNCHRONIZATION
   Video playback with intelligent audio layering
   ============================================ */

class VikingVideoExperience {
  constructor() {
    this.videoElement = null;
    this.audioSystem = null;
    this.currentNarrativeIndex = 0;
    this.isPlaying = false;
    
    // Scene timing markers (seconds in video)
    this.sceneMarkers = {
      'opening': { start: 0, end: 15, audioScene: 'opening' },
      'voyageBegins': { start: 15, end: 40, audioScene: 'voyageBegins' },
      'seaAdventure': { start: 40, end: 90, audioScene: 'seaAdventure' },
      'stormApproach': { start: 90, end: 135, audioScene: 'stormApproach' },
      'battleReady': { start: 135, end: 180, audioScene: 'battleReady' },
      'triumph': { start: 180, end: 220, audioScene: 'triumph' },
      'ending': { start: 220, end: 260, audioScene: 'ending' }
    };

    // Narrative text chunks for each scene
    this.narrativeScript = {
      opening: "A Viking warrior stands at the bow of his ship, eyes fixed on the horizon. The wind fills his lungs. The sea stretches infinite before him.",
      
      voyageBegins: "The crew prepares for journey. Sails billow like the wings of great ravens. Ropes creak under tension. Orders echo across the deck—urgent, purposeful.",
      
      seaAdventure: "Hours pass beneath an endless sky. The horizon calls. Every wave is a whispered secret, every gust of wind carries the voice of ancient gods.",
      
      stormApproach: "Dark clouds gather like gathering armies. The sky darkens. The air grows thick. Something vast is turning its attention toward them.",
      
      battleReady: "They appear on the horizon. Raiders. Enemies. The warrior draws his weapon. His hand is steady. His breath is calm. This is his moment.",
      
      triumph: "Victory flows through their veins like liquid gold. The gods smile upon them. Songs will be sung of this day. Legends born in spray and steel.",
      
      ending: "And so the journey ends, but the story lives on. In the hearts of warriors. In the songs around the fire. In the dreams of those yet to sail."
    };

    // Narrative scenes for structured delivery
    this.narrativeSequence = [
      { scene: 'opening', delay: 2000 },
      { scene: 'voyageBegins', delay: 18000 },
      { scene: 'seaAdventure', delay: 42000 },
      { scene: 'stormApproach', delay: 92000 },
      { scene: 'battleReady', delay: 137000 },
      { scene: 'triumph', delay: 182000 },
      { scene: 'ending', delay: 222000 }
    ];

    this.narrativeTimers = [];
  }

  /**
   * Initialize the video + audio experience
   */
  async initialize(videoSrc, options = {}) {
    const {
      containerId = 'video-container',
      elevenLabsApiKey = '',
      masterVolume = 0.85,
      autoPlay = true
    } = options;

    // Create video element
    this.createVideoElement(containerId, videoSrc);

    // Initialize audio system
    this.audioSystem = new VikingAudioSystem();
    this.audioSystem.setMasterVolume(masterVolume);

    // Setup video event listeners
    this.setupVideoListeners();

    // Preload first scene audio
    await this.audioSystem.initializeAudioLayers('opening');

    console.log('✅ Viking Video Experience initialized');

    if (autoPlay) {
      this.play(elevenLabsApiKey);
    }
  }

  /**
   * Create responsive video element
   */
  createVideoElement(containerId, videoSrc) {
    const container = document.getElementById(containerId) || document.body;
    
    const videoWrapper = document.createElement('div');
    videoWrapper.id = 'viking-video-wrapper';
    videoWrapper.style.cssText = `
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    `;

    this.videoElement = document.createElement('video');
    this.videoElement.id = 'viking-video';
    this.videoElement.src = videoSrc;
    this.videoElement.controls = true;
    this.videoElement.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    `;

    videoWrapper.appendChild(this.videoElement);
    container.appendChild(videoWrapper);
  }

  /**
   * Setup video playback listeners
   */
  setupVideoListeners() {
    this.videoElement.addEventListener('play', () => {
      console.log('▶️ Video started');
      this.isPlaying = true;
      this.scheduleNarratives();
    });

    this.videoElement.addEventListener('pause', () => {
      console.log('⏸️ Video paused');
      this.isPlaying = false;
      this.clearNarrativeTimers();
    });

    this.videoElement.addEventListener('ended', () => {
      console.log('✅ Video ended');
      this.isPlaying = false;
      this.clearNarrativeTimers();
      this.audioSystem.stopAllLayers();
    });

    // Monitor video progress to sync audio scenes
    this.videoElement.addEventListener('timeupdate', () => {
      this.syncAudioToVideoProgress();
    });
  }

  /**
   * Synchronize audio scene changes with video timeline
   */
  syncAudioToVideoProgress() {
    const currentTime = this.videoElement.currentTime;

    // Check which scene we're in
    for (const [sceneName, marker] of Object.entries(this.sceneMarkers)) {
      if (currentTime >= marker.start && currentTime < marker.end) {
        // If we've changed scenes, update audio
        if (this.audioSystem.currentScene !== marker.audioScene) {
          console.log(`🎬 Scene change: ${marker.audioScene} (${currentTime.toFixed(1)}s)`);
          this.audioSystem.transitionToScene(marker.audioScene, 600);
        }
        break;
      }
    }
  }

  /**
   * Schedule narrative playback at specific video timestamps
   */
  scheduleNarratives() {
    // Clear any existing timers
    this.clearNarrativeTimers();

    // Schedule each narrative chunk
    this.narrativeSequence.forEach((narrativePoint, index) => {
      const timer = setTimeout(async () => {
        if (this.isPlaying) {
          await this.playNarrative(
            narrativePoint.scene,
            index
          );
        }
      }, narrativePoint.delay);

      this.narrativeTimers.push(timer);
    });
  }

  /**
   * Clear all scheduled narrative timers
   */
  clearNarrativeTimers() {
    this.narrativeTimers.forEach(timer => clearTimeout(timer));
    this.narrativeTimers = [];
  }

  /**
   * Play narrative for a specific scene
   */
  async playNarrative(sceneName, sequenceIndex, elevenLabsApiKey = '') {
    const narrativeText = this.narrativeScript[sceneName];
    
    if (!narrativeText) {
      console.warn(`⚠️ No narrative for scene: ${sceneName}`);
      return;
    }

    console.log(`🎙️ Playing narrative: ${sceneName}`);

    // Get scene config for pacing
    const sceneConfig = this.audioSystem.getSceneAudioMap()[sceneName];
    const pacing = sceneConfig.pacing || 0.75;

    try {
      // Use ElevenLabs if API key provided
      if (elevenLabsApiKey) {
        await this.audioSystem.playNarrativeWithVoice(narrativeText, {
          apiKey: elevenLabsApiKey,
          voiceId: '5o4wB8o3X8zqoGdNbk6C', // Deep Viking voice option
          pacing: pacing
        });
      } else {
        // Fallback to Web Speech API
        this.audioSystem.playNarrativeWithWebSpeech(narrativeText, {
          pacing: pacing
        });
      }
    } catch (error) {
      console.error('❌ Narrative playback error:', error);
    }
  }

  /**
   * Play the entire experience
   */
  async play(elevenLabsApiKey = '') {
    if (!this.videoElement) {
      console.error('❌ Video element not initialized');
      return;
    }

    // Start audio system
    await this.audioSystem.initializeAudioLayers('opening');

    // Play video
    this.videoElement.play();

    console.log('▶️ Viking Sea experience started');
  }

  /**
   * Pause the experience
   */
  pause() {
    this.videoElement.pause();
    console.log('⏸️ Experience paused');
  }

  /**
   * Resume from pause
   */
  resume() {
    this.videoElement.play();
    console.log('▶️ Experience resumed');
  }

  /**
   * Stop and reset everything
   */
  stop() {
    this.pause();
    this.audioSystem.stopAllLayers();
    this.clearNarrativeTimers();
    this.videoElement.currentTime = 0;
    console.log('⏹️ Experience stopped');
  }

  /**
   * Seek to specific time
   */
  seekTo(seconds) {
    if (this.videoElement) {
      this.videoElement.currentTime = seconds;
      this.syncAudioToVideoProgress();
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume) {
    if (this.audioSystem) {
      this.audioSystem.setMasterVolume(volume);
      this.videoElement.volume = volume;
    }
  }

  /**
   * Get current experience status
   */
  getStatus() {
    return {
      videoTime: this.videoElement?.currentTime || 0,
      videoDuration: this.videoElement?.duration || 0,
      isPlaying: this.isPlaying,
      audioStatus: this.audioSystem?.getStatus(),
      currentScene: this.audioSystem?.currentScene,
      progress: this.videoElement ? 
        ((this.videoElement.currentTime / this.videoElement.duration) * 100).toFixed(1) + '%' 
        : '0%'
    };
  }
}

// Export for use in main script
window.VikingVideoExperience = VikingVideoExperience;

/**
 * Quick initialization helper
 */
async function initializeVikingExperience(videoSrc, options = {}) {
  const experience = new VikingVideoExperience();
  await experience.initialize(videoSrc, options);
  return experience;
}

window.initializeVikingExperience = initializeVikingExperience;
