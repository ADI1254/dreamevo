# 🎬 Cinematic Audio Stems

Place your professionally produced audio stems here.

## 📁 Required Files (27 total)

### Journey World
```
journey_calm_narration.mp3      ← Voice narration for Journey/Calm
journey_calm_ambient.mp3        ← Looping atmospheric bed
journey_calm_sfx.mp3            ← Timed sound effects/punctuation

journey_confident_narration.mp3
journey_confident_ambient.mp3
journey_confident_sfx.mp3

journey_curious_narration.mp3
journey_curious_ambient.mp3
journey_curious_sfx.mp3
```

### Sanctuary World
```
sanctuary_calm_narration.mp3
sanctuary_calm_ambient.mp3
sanctuary_calm_sfx.mp3

sanctuary_confident_narration.mp3
sanctuary_confident_ambient.mp3
sanctuary_confident_sfx.mp3

sanctuary_curious_narration.mp3
sanctuary_curious_ambient.mp3
sanctuary_curious_sfx.mp3
```

### Exploration World
```
exploration_calm_narration.mp3
exploration_calm_ambient.mp3
exploration_calm_sfx.mp3

exploration_confident_narration.mp3
exploration_confident_ambient.mp3
exploration_confident_sfx.mp3

exploration_curious_narration.mp3
exploration_curious_ambient.mp3
exploration_curious_sfx.mp3
```

## 🎯 File Specifications

### Narration Stems
- **Format**: MP3 320kbps or WAV 48kHz/24-bit
- **Duration**: 3-5 minutes (matches story script)
- **Content**: Human voice reading the story with natural pauses
- **Processing**: EQ, compression, de-ess, subtle reverb
- **Peak Level**: -3 to -1 dBTP
- **Purpose**: Primary focus - the guided dream narrative

### Ambient Stems
- **Format**: MP3 256-320kbps or WAV 48kHz/24-bit
- **Duration**: 60-90 seconds
- **Content**: Atmospheric bed (wind, water, nature textures)
- **Looping**: MUST loop seamlessly (no clicks/pops)
- **Stereo Field**: Wide (70-100%)
- **Peak Level**: -6 dBFS
- **Purpose**: Immersive background atmosphere

### SFX Stems
- **Format**: MP3 256kbps or WAV 48kHz/24-bit
- **Duration**: Full narration length (3-5 min) with silence padding
- **Content**: 4-6 timed cinematic events (risers, impacts, accents)
- **Spacing**: Events placed at key emotional moments
- **Peak Level**: -10 to -6 dBFS (code will duck during narration)
- **Purpose**: Punctuation and emotional enhancement

## 🔄 How Stems Are Used

1. **User starts experience** → App checks for stems
2. **Stems found** → Loads all 3 for selected world/mood
3. **Playback sequence**:
   - Ambient starts (loops continuously)
   - SFX starts (timed events trigger)
   - Narration starts (primary focus)
   - Code ducks ambient/SFX by -12dB during narration
   - When narration ends, everything fades out smoothly

4. **Stems NOT found** → Falls back to TTS (Web Speech API)

## ✅ Production Checklist

Before placing files here, ensure:

- [ ] Files named exactly as shown above (lowercase, underscores)
- [ ] Ambient stems loop perfectly (test 3+ loops)
- [ ] Narration timing matches story script pauses
- [ ] SFX events don't collide with key narration phrases
- [ ] All files normalized to proper peak levels
- [ ] No clipping or distortion
- [ ] Consistent loudness across all 9 experiences

## 🎚️ Testing Your Stems

1. Place files in this folder
2. Open `frontend/index.html` in browser
3. Select world/mood combination
4. Click "Begin Dream"
5. Check browser console for:
   - "🎬 Attempting to load stems..."
   - "✅ Loaded narration stem (1/3)"
   - "✅ Loaded ambient stem (2/3)"
   - "✅ Loaded sfx stem (3/3)"
   - "🎬 Starting cinematic stem playback..."

If you see "🎙️ Fallback to TTS (stems not found)", check:
- File paths match exactly (case-sensitive)
- Files are in this `CINEMATIC_AUDIO/` folder
- File format is .mp3 (or change `STEM_CONFIG.format` in script.js)

## 📊 Recommended Workflow

1. **Generate narration** using ElevenLabs or voice actor
2. **Design ambient bed** in DAW (60-90s loop)
3. **Create SFX events** and place at emotional peaks
4. **Mix all 3 stems** following AUDIO_PRODUCTION_SPECS.md
5. **Export MP3s** at specified bitrates
6. **Place here** with exact filenames
7. **Test** in browser
8. **Iterate** until perfect

## 🎬 Production Guide

See `AUDIO_PRODUCTION_SPECS.md` in parent folder for:
- Detailed voice direction for each world/mood
- DAW processing chain (EQ, compression, reverb)
- Cinematic mixing techniques
- Quality control checklist
- Tool recommendations

---

**Status**: Waiting for professionally produced stems  
**Fallback**: App currently uses TTS (Web Speech API)  
**Target**: Movie/streaming quality narration + immersive sound design
