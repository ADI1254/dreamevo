# ⚔️ VIKING SEA - QUICK REFERENCE

## 🎬 What You Now Have

✅ **Multi-layer Audio System** - Orchestral + SFX + Voice + Ambient  
✅ **Smart Volume Ducking** - Music automatically reduces when voice speaks  
✅ **Video Sync Engine** - Audio scenes trigger at precise video timestamps  
✅ **ElevenLabs Integration** - Premium human-quality narration  
✅ **Web Speech Fallback** - Works without API key  
✅ **Fully Responsive Design** - Desktop, tablet, mobile  
✅ **Demo HTML Page** - Complete working example  

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `viking_audio_system.js` | Multi-layer audio orchestration + volume ducking |
| `viking_video_experience.js` | Video playback + audio scene synchronization |
| `viking_experience.html` | Full-featured demo page with UI controls |
| `VIKING_IMPLEMENTATION.md` | Comprehensive implementation guide |
| `assets/audio/VIKING_AUDIO_README.md` | Audio asset specifications |

---

## ⚡ Quick Start (30 seconds)

### Option A: Use Demo Page (Easiest)
```
1. Open: viking_experience.html
2. Click: ▶️ Play
3. Done! Video + audio sync plays automatically
```

### Option B: Integrate Into Existing Page
```html
<!-- Add to your HTML -->
<div id="video-container"></div>
<script src="viking_audio_system.js"></script>
<script src="viking_video_experience.js"></script>

<!-- Initialize in your JavaScript -->
<script>
  const experience = new VikingVideoExperience();
  await experience.initialize('path/to/viking_sea.mp4', {
    containerId: 'video-container',
    masterVolume: 0.85
  });
  experience.play();
</script>
```

---

## 🎙️ Audio Architecture at a Glance

```
LAYER 1: ORCHESTRAL THEME (40% → ducks to 15% for voice)
         Epic opening → Voyage theme → Discovery → Storm → Battle → Victory → Ending

LAYER 2: CINEMATIC SFX (20-35%)
         Ships, waves, wind, thunder, swords, horns, crew, celebration

LAYER 3: VOICE NARRATION (95%)
         Human-like voice with emotional pacing
         Uses ElevenLabs API OR Web Speech API

LAYER 4: AMBIENT PADS (20%)
         Emotional sustenance, no dead air, always supporting
```

### Volume Ducking Flow
```
Narration Starts
    ↓
Detects voice playing
    ↓
Smoothly reduces orchestra 40% → 15% over 300ms
    ↓
Narration plays clearly
    ↓
Narration Ends
    ↓
Smoothly restores orchestra 15% → 40% over 500ms
```

---

## 🎬 Scene Timeline

| Scene | Time | Audio | Purpose |
|-------|------|-------|---------|
| Opening | 0-15s | Epic theme + wind | Establish mood |
| Voyage Begins | 15-40s | Adventure theme + sails | Journey starts |
| Sea Adventure | 40-90s | Discovery theme + waves | Exploration |
| Storm Approach | 90-135s | Dark strings + thunder | Rising tension |
| Battle Ready | 135-180s | War drums + swords | Action moment |
| Triumph | 180-220s | Victory fanfare + cheers | Peak emotion |
| Ending | 220-260s | Resolution theme | Peaceful close |

---

## 💻 API One-Liner Cheat Sheet

```javascript
// Playback
experience.play(apiKey);      // Start with ElevenLabs narration
experience.pause();            // Pause video + audio
experience.stop();             // Stop & reset everything
experience.resume();           // Resume from pause

// Seeking
experience.seekTo(45);         // Jump to 45 seconds

// Volume
experience.setVolume(0.85);   // Set volume 0-1

// Status
experience.getStatus();        // Get detailed status object

// Direct audio control
experience.audioSystem.transitionToScene('battleReady', 1000);
experience.audioSystem.startNarration();   // Ducks orchestra
experience.audioSystem.endNarration();     // Restores orchestra
```

---

## 🎧 Audio Files You Need

### Minimum Setup (Works with Web Speech API)
- Just video file: `viking_sea.mp4`
- Uses browser's built-in voice (free!)

### Recommended Setup (Professional)
- **7 Orchestral Themes** - One per scene
- **18 Sound Effects** - Ships, waves, battle, celebration
- **7 Ambient Pads** - Emotional layers

### Total Files Needed: 32 audio files (optional orchestral setup)

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Excellent |
| Safari | ✅ Full | Mac/iOS |
| Edge | ✅ Full | Neural TTS available |
| Mobile | ✅ Responsive | Audio may require user tap |

---

## 🔊 Voice Options

### Option 1: ElevenLabs (Premium - Recommended)
- **Cost**: Free tier available (~10k characters/month)
- **Quality**: Indistinguishable from human
- **Voices**: 100+ to choose from
- **Setup**: 5 minutes (get API key, add to code)

```javascript
experience.play('your-eleven-labs-api-key');
```

### Option 2: Web Speech API (Free - Always Works)
- **Cost**: Free
- **Quality**: Good, system-dependent
- **Voices**: Browser default voices
- **Setup**: Zero - works automatically

```javascript
experience.play(); // Falls back to Web Speech API
```

---

## 📊 File Sizes (Reference)

| File Type | Typical Size | Notes |
|-----------|-------------|-------|
| MP3 (2-4min @ 192kbps) | 2-4 MB | Orchestral themes |
| MP3 (30s @ 128kbps) | 300 KB | SFX layers |
| MP4 Video (4K) | 100-500 MB | Your video file |

---

## ✅ Testing Checklist

- [ ] Demo page loads (`viking_experience.html`)
- [ ] Video plays when clicking ▶️ Play
- [ ] Narration starts automatically after 2 seconds
- [ ] Audio layers are active (shows in info panel)
- [ ] Scene changes at video milestones
- [ ] Volume slider adjusts loudness
- [ ] Pause/Resume buttons work
- [ ] Status panel updates in real-time
- [ ] Progress bar shows video timeline
- [ ] Works on mobile device

---

## 🎯 Next Steps

### Phase 1: Quick Test (Now)
1. Open `viking_experience.html` in browser
2. Click ▶️ Play
3. Listen to narration with background sounds

### Phase 2: Add Premium Audio (1-2 hours)
1. Download orchestral themes from Epidemic Sound or YouTube Audio Library
2. Place in `assets/audio/CINEMATIC_AUDIO/`
3. Refresh page - audio automatically loads

### Phase 3: Premium Narration (15 minutes)
1. Get free ElevenLabs account
2. Get API key
3. Pass to `.play(apiKey)` method
4. Enjoy professional voice narration

### Phase 4: Customization (30 minutes)
1. Adjust scene markers to match your video
2. Update narrative text
3. Fine-tune volume levels

---

## 🐛 Troubleshooting

### Video won't play
- Check video file path matches
- Check browser console for errors (F12)
- Make sure video format is supported

### Audio won't play
- Refresh page (browser cache)
- Check audio file permissions
- Try using demo page first to verify system works

### Narration sounds robotic
- Use ElevenLabs instead of Web Speech API
- Get API key and pass to `.play(apiKey)`

### Narration cuts off music too much
- Edit `orchVolumeDucked` value in `viking_audio_system.js`
- Increase from 0.15 to 0.25 for less ducking

### Scene changes at wrong time
- Edit `sceneMarkers` object in `viking_video_experience.js`
- Adjust start/end times to match your video

---

## 📞 Support

**All system logs go to browser console:**
```
Press F12 → Console tab
```

**Look for emoji prefixes:**
- ✅ Success messages
- ❌ Errors  
- ⚠️ Warnings
- 🎙️ Narration events
- 🎬 Scene changes

---

## 🎭 What Makes This Cinematic?

1. **Layered Audio** - 4 independent audio tracks blend seamlessly
2. **Smart Ducking** - Orchestra knows when to back off for voice
3. **Scene Transitions** - Audio changes match video storytelling
4. **Emotional Pacing** - Narration speed matches scene intensity
5. **Human Voice** - Premium TTS sounds natural, not robotic
6. **Atmospheric SFX** - Ambient depth without being intrusive
7. **No Dead Air** - Pads fill silence, building immersion

---

## 🚀 You're Ready!

Your Viking Sea video is now **fully cinematic** with:
- ✅ Professional audio layering
- ✅ Intelligent volume ducking
- ✅ Natural human-like narration
- ✅ Scene-synchronized effects
- ✅ Mobile-responsive design

**Open `viking_experience.html` and hit play.** 🎬

---

**Questions? Check `VIKING_IMPLEMENTATION.md` for detailed docs.**
