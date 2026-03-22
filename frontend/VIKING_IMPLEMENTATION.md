# 🎭 Viking Sea Cinematic Audio System - Implementation Guide

## Overview

Your Viking Sea experience now features a **professional multi-layer audio architecture** that transforms basic TTS narration into a cinematic, immersive journey. This system combines:

- **🎼 Orchestral Themes** - Epic music that shifts per scene
- **🌊 Cinematic Sound Effects** - Ships, waves, wind, battle sounds  
- **🎙️ Human Voice Narration** - Natural-sounding voice with emotional pacing
- **🎚️ Smart Volume Ducking** - Music automatically ducks when voice speaks
- **⚡ Video Synchronization** - Audio cues trigger at exact video timestamps

---

## File Structure

```
frontend/
├── viking_audio_system.js          ← Multi-layer audio orchestration
├── viking_video_experience.js       ← Video + audio synchronization
├── viking_experience.html           ← Demo page with full UI
├── assets/
│   ├── audio/
│   │   ├── VIKING_AUDIO_README.md  ← Audio asset requirements
│   │   └── CINEMATIC_AUDIO/         ← Your sound library (to create)
│   └── videos/
│       └── viking_sea.mp4.mp4       ← Your video file
```

---

## Quick Start

### 1. Add Script Tags to Your HTML

```html
<!-- Load the audio systems first -->
<script src="viking_audio_system.js"></script>
<script src="viking_video_experience.js"></script>

<!-- Initialize the experience -->
<script>
  async function initializeVikingExperience() {
    const experience = new VikingVideoExperience();
    await experience.initialize('assets/videos/viking_sea.mp4.mp4', {
      containerId: 'video-container',
      masterVolume: 0.85,
      autoPlay: false
    });
    return experience;
  }
  
  // Call when page loads
  let vikingExperience;
  document.addEventListener('DOMContentLoaded', async () => {
    vikingExperience = await initializeVikingExperience();
  });
</script>
```

### 2. Create Video Container

```html
<div id="video-container"></div>
```

### 3. Add Control Buttons (Optional)

```html
<button onclick="vikingExperience.play()">▶️ Play</button>
<button onclick="vikingExperience.pause()">⏸️ Pause</button>
<button onclick="vikingExperience.stop()">⏹️ Stop</button>
<button onclick="vikingExperience.resume()">▶️ Resume</button>

<!-- Volume Control -->
<input type="range" min="0" max="100" value="85" 
  onchange="vikingExperience.setVolume(this.value / 100)">
```

---

## Audio Layer System

### Architecture

```
ORCHESTRAL MUSIC (40% volume, ducks to 15% when voice speaks)
     ↓
CINEMATIC SFX (20-35% volume, layered scenes)
     ↓
VOICE NARRATION (95% volume, always on top)
     ↓
AMBIENT PADS (20% volume, emotional sustenance)
```

### How Volume Ducking Works

When narration starts:
```
Before:  [ORCHESTRA: 40%] + [VOICE: 0%] = Good
During:  [ORCHESTRA: 15%] + [VOICE: 95%] = Crystal clear voice!
After:   [ORCHESTRA: 40%] + [VOICE: 0%] = Music returns smoothly
```

### Scene Progression

The system automatically triggers audio changes at video timestamps:

| Time | Scene | Audio Change |
|------|-------|--------------|
| 0s | Opening | Epic theme + wind sounds |
| 15s | Voyage Begins | Sails flapping, crew orders |
| 40s | Sea Adventure | Waves crashing, seagulls |
| 90s | Storm Approach | Dark strings, thunder |
| 135s | Battle Ready | War drums, swords clashing |
| 180s | Triumph | Victory fanfare, celebration |
| 220s | Ending | Resolution, gentle waves |

---

## Setting Up Cinematic Audio Assets

### Step 1: Create Audio Directory

```powershell
mkdir frontend\assets\audio\CINEMATIC_AUDIO
```

### Step 2: Gather Audio Files

You need these categories:

**Orchestral Themes (7 files)**
- viking_opening_theme.mp3
- viking_voyage_theme.mp3
- viking_discovery_theme.mp3
- viking_storm_rising.mp3
- viking_battle_drums.mp3
- viking_victory_fanfare.mp3
- viking_ending_theme.mp3

**Sound Effects (18 files)**
- Ship sounds: ship_creaks.mp3, sails_flapping.mp3, rope_creaks.mp3
- Crew: crew_orders.mp3
- Ocean: waves_crashing.mp3, seagulls.mp3, waves_gentle.mp3
- Weather: wind_howling.mp3, wind_intensifies.mp3, thunder_distant.mp3
- Ship: ship_rocks.mp3
- Battle: drums_war.mp3, swords_clash.mp3, horn_battle_call.mp3
- Celebration: cheer_crew.mp3, horn_fanfare.mp3, bells_celebration.mp3
- Other: distant_land.mp3

**Ambient Pads (7 files)**
- ocean_distant_waves.mp3
- storm_brewing.mp3
- endless_sea_pad.mp3
- storm_pad_intense.mp3
- adrenaline_pad.mp3
- victory_pad.mp3
- resolution_pad.mp3

### Step 3: Recommended Audio Sources

#### Free/Royalty-Free
- **Epidemic Sound** - Professional orchestral + SFX
- **YouTube Audio Library** - Search "epic orchestral", "Norse", "cinematic"
- **Freesound.org** - Community SFX (CC0/CC-BY)
- **Pixabay Music** - Free orchestral themes
- **Zapsplat** - Cinematic effects library

#### Search Terms
```
"Epic orchestral theme"
"Viking Norse music"
"Ship sailing sound effect"
"Ocean waves ambience"
"War drums cinematic"
"Victory fanfare"
"Storm thunder ambience"
```

### Step 4: Optimize Audio Files

Each file should be:
- **Format**: MP3 (web-optimized)
- **Bitrate**: 128-192 kbps (balance quality/size)
- **Loudness**: Normalize to -14dB LUFS
- **Trimming**: Remove silence from start/end
- **Size**: Keep under 5MB per file

**Optimization Tool**:
```bash
# Using FFmpeg (free)
ffmpeg -i input.wav -b:a 192k output.mp3
```

---

## Using ElevenLabs for Premium Narration

For human-quality voice that sounds professional:

### 1. Get API Key

Visit [ElevenLabs.io](https://elevenlabs.io) and get free credits to start.

### 2. Choose Voice

Recommended for Viking (deep, authoritative):
- **Voice ID**: `5o4wB8o3X8zqoGdNbk6C` (Marcus - Deep, formal)
- **Voice ID**: `nPczCjzI2devNBz1zQrb` (Adam - Authoritative)

### 3. Initialize with API Key

```javascript
const experience = new VikingVideoExperience();
await experience.initialize('assets/videos/viking_sea.mp4.mp4', {
  containerId: 'video-container',
  elevenLabsApiKey: 'your-api-key-here',
  masterVolume: 0.85,
  autoPlay: false
});

// Then play with narration
experience.play('your-api-key-here');
```

---

## API Reference

### VikingAudioSystem

```javascript
// Initialize all audio layers
audioSystem.initializeAudioLayers('opening');

// Transition between scenes
audioSystem.transitionToScene('battleReady', 1000);

// Control narration with volume ducking
audioSystem.startNarration(); // Ducks orchestra
audioSystem.endNarration();   // Restores orchestra

// Play narration via ElevenLabs
audioSystem.playNarrativeWithVoice(text, {
  apiKey: 'your-key',
  voiceId: '5o4wB8o3X8zqoGdNbk6C',
  onNarrativeEnd: () => console.log('Done')
});

// Fallback narration (Web Speech API)
audioSystem.playNarrativeWithWebSpeech(text, { pacing: 0.75 });

// Volume control
audioSystem.setMasterVolume(0.85); // 0-1

// Stop everything
audioSystem.stopAllLayers();

// Get status
console.log(audioSystem.getStatus());
```

### VikingVideoExperience

```javascript
// Initialize experience
const experience = new VikingVideoExperience();
await experience.initialize('video.mp4', options);

// Playback control
experience.play(apiKey);
experience.pause();
experience.resume();
experience.stop();

// Seeking
experience.seekTo(45); // Go to 45 seconds

// Volume
experience.setVolume(0.85); // 0-1

// Get current status
console.log(experience.getStatus());
// Returns: { videoTime, videoDuration, isPlaying, audioStatus, currentScene, progress }
```

---

## Customization Guide

### Changing Scene Markers

Edit the scene timing in `viking_video_experience.js`:

```javascript
this.sceneMarkers = {
  'opening': { start: 0, end: 15, audioScene: 'opening' },
  'voyageBegins': { start: 15, end: 40, audioScene: 'voyageBegins' },
  // ... adjust start/end times to match your video
};
```

### Changing Narrative Text

Edit the narrative script in `viking_video_experience.js`:

```javascript
this.narrativeScript = {
  opening: "Your custom narrative here...",
  voyageBegins: "Next scene narrative...",
  // etc
};
```

### Adjusting Orchestral Intensity

In `viking_audio_system.js`, each scene has `musicIntensity`:

```javascript
opening: {
  // ...
  musicIntensity: 0.7,  // 0-1 scale
  pacing: 0.65          // 0-1 (lower = slower)
}
```

### Fine-Tuning Voice Ducking

Adjust ducking values in `VikingAudioSystem` constructor:

```javascript
this.orchVolumeNormal = 0.4;   // Normal orchestra level
this.orchVolumeDucked = 0.15;  // When voice speaks
```

---

## Testing & Debugging

### Enable Console Logging

All console messages are prefixed with emojis for easy scanning:
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 🎙️ Narration events
- 🎬 Scene changes
- ▶️ Playback events

### Test Individual Layers

```javascript
// Test orchestra only
const audioSystem = new VikingAudioSystem();
await audioSystem.initializeAudioLayers('opening');

// Check SFX layer
console.log(audioSystem.layers.sfx?.currentTime);

// Manual narration test
audioSystem.playNarrativeWithWebSpeech("Test narration");
```

### Common Issues & Solutions

**Audio won't play**
- Check browser's autoplay policy (may need user gesture)
- Verify audio file paths are correct
- Check browser console for errors

**Voice too quiet/loud**
- Adjust `experience.setVolume(0.85)`
- Check ElevenLabs voice settings

**Narration cuts off music too much**
- Adjust `orchVolumeDucked` value (higher = less reduction)

**Scene changes at wrong time**
- Update `sceneMarkers` to match your video timeline

---

## Example: Complete Page

See `viking_experience.html` for a fully-featured demo page with:
- ✅ Video player with controls
- ✅ Volume slider
- ✅ Status panel showing real-time audio layers
- ✅ Scene tracker
- ✅ Progress visualization
- ✅ Responsive design

---

## Performance Tips

1. **Pre-cache audio** - Browser caches frequently used layers
2. **Use MP3 format** - Best web compression
3. **Lazy load SFX** - Only load when approaching scene
4. **Mobile optimization** - Reduce bitrate for mobile users
5. **Test on actual devices** - Mobile audio behavior differs

---

## Next Steps

1. ✅ Copy audio asset files to `frontend/assets/audio/CINEMATIC_AUDIO/`
2. ✅ Update scene markers if your video timing differs
3. ✅ Test playback in browser (open `viking_experience.html`)
4. ✅ Get ElevenLabs API key for premium narration
5. ✅ Customize narrative text for your story

---

## Support & Troubleshooting

**Check the console** (`F12` → Console tab) for detailed error messages with emoji indicators.

**All features are modular** - You can use just the audio system without video, or vice versa.

**Fallback to Web Speech API** - If ElevenLabs isn't available, narration automatically uses browser's built-in TTS.

---

🎭 **Your Viking Sea experience is now cinematic, immersive, and professional.**
