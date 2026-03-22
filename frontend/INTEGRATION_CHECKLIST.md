# 🎬 Cinematic Audio Integration Checklist

## Current Status

✅ **Narration**: `journey_calm_narration.mp3` (ElevenLabs) - Ready
⏳ **SFX**: Generated timeline with 33 cinematic moments - Follow guide
⏳ **Ambient**: Optional looping bed for immersion
✅ **Code**: App automatically detects and plays stems

---

## Quick Start - Test Your Narration NOW

### Option 1: Verify Current Setup (30 seconds)

```powershell
# Move to frontend
cd "f:\DREAMPULSE 6 JAN 26\NEW\dreampulse\frontend"

# Rename narration to correct format (if needed)
# Current: journey_calm_narration.mp3 ✅ (already correct!)

# Open browser
start index.html
```

**In Browser**:
1. Select **Journey** world + **Calm** mood
2. Click **Begin Dream**
3. Press **F12** (Open Developer Console)
4. Look for: `🎬 Attempting to load stems...`

**What you should see**:
- If narration plays: `✅ Loaded narration stem (1/3)` 🎉
- If fails: `❌ Fallback to TTS (stems not found)`

---

### Option 2: Create Movie-Level SFX (3-4 hours)

**Follow this workflow**:

1. **Open the guide**:
   ```powershell
   Start "SFX_COMPOSITION_GUIDE.txt"
   ```

2. **Get sound elements** from:
   - Splice.com (Search: "orchestral riser", "temple bell")
   - Freesound.org (Search: "cinematic", "epic")
   - Epidemic Sound (Search: "transition", "revelation")

3. **In your DAW** (Reaper/Audition/Logic):
   - Import `journey_calm_narration.mp3`
   - Create Track 2 for SFX
   - Follow the 33-point timeline from guide
   - Place sounds at exact times with emotional precision

4. **Export**:
   ```
   journey_calm_sfx.mp3  (256 kbps, stereo)
   journey_calm_sfx.wav  (48kHz/24-bit, stereo)
   ```

5. **Move to correct folder**:
   ```powershell
   Copy-Item "journey_calm_sfx.mp3" `
     "frontend/assets/audio/CINEMATIC_AUDIO/"
   ```

6. **Test in browser** (same as Option 1)
   - Should now show: `✅ Loaded sfx stem (3/3)` 🎬

---

## File Structure Check

```
frontend/assets/audio/CINEMATIC_AUDIO/
├── journey_calm_narration.mp3    ✅ YOU ADDED THIS
├── journey_calm_ambient.mp3      ⏳ Optional (looping bed)
├── journey_calm_sfx.mp3          ⏳ You'll create this
└── [24 more for other worlds/moods]
```

---

## What the App Does Now

### Playback Sequence:
1. **Detects stems** for selected world/mood
2. **Loads all 3**:
   - Narration (primary, full volume)
   - Ambient (background, looping)
   - SFX (cinematic accents)
3. **Plays in sync**:
   - Ambient starts first (soft bed)
   - SFX events play at exact times
   - Narration starts (app ducks SFX/ambient by -12dB)
4. **Orchestrates ducking**:
   - When narration plays: Ambient/SFX reduce volume
   - When narration pauses: Ambient/SFX return to normal
   - Creates professional radio/podcast feel
5. **Fades out smoothly** when complete

### Console Output Example:
```
🎬 Attempting to load stems...
✅ Loaded narration stem (1/3)
✅ Loaded ambient stem (2/3)  [optional]
✅ Loaded sfx stem (3/3)
🎬 Starting cinematic stem playback...
🌊 Ambient bed playing (looping)
💥 SFX layer playing
🎙️ Narration playing
🔇 Ducking background stems
[...playback...]
✅ Narration complete
🔊 Unducking background stems
🌅 Fading out all stems...
⏹️ All stems stopped
```

---

## Pro Tips for Movie-Level Quality

### Timing Precision
- **±100ms** = Noticeable to trained ear
- **±50ms** = Professional
- Align SFX to narration stress points (highlighted phrases)

### Volume Discipline
- Narration: Always 0 dB (100%) - primary focus
- SFX at peak emotion: -4 to -6 dB (before ducking)
- Ambient: -10 dB (let narration cut through)
- Tender moments: -12 to -14 dB (barely there)

### Emotional Beats to Hit:
```
0:00-1:00   URGENCY        → Horn calls, rising tension
1:00-2:00   ADVENTURE      → Footsteps, exploration
2:00-2:45   TENSION        → Dark orchestral, danger
2:45-3:30   REVELATION     → Ethereal, sacred space
3:30-4:00   TRIUMPH        → Orchestral swell, victory
4:00+       PEACE          → Gentle resolution
```

### EQ Rules:
- **HPF @ 60Hz**: Always (remove rumble)
- **Notch -2dB @ 2-4kHz**: Leaves room for narration
- **Boost +1.5dB @ 5-8kHz**: Adds presence/clarity

### Reverb Strategy:
- **SFX reverb**: 10-20% (match temple/jungle space)
- **Short pre-delay**: 20-40ms (sounds natural)
- **Decay**: 0.8-1.2s (not too echoey)

---

## Testing Checklist

When you finish your SFX:

- [ ] Every sound enhances emotion (doesn't distract)
- [ ] Timing matches narration beat (±50ms)
- [ ] Ducking feels natural (not sudden drops)
- [ ] No harsh frequencies (EQ smooth)
- [ ] Stereo width feels immersive (70-100%)
- [ ] Peak levels correct (-6 dBFS max)
- [ ] Fades smooth (no clicks)
- [ ] Total duration matches narration
- [ ] File names exact: `journey_calm_sfx.mp3`
- [ ] Location correct: `frontend/assets/audio/CINEMATIC_AUDIO/`

---

## Troubleshooting

### SFX not loading in browser?
1. Check console (F12) for 404 errors
2. Verify filename matches exactly (lowercase, underscores)
3. File should be in: `frontend/assets/audio/CINEMATIC_AUDIO/`
4. Try hard refresh: `Ctrl+Shift+R`

### Sounds distorted/harsh?
1. Check peak level: Should be -6 dBFS, not 0
2. Apply HPF @ 60Hz to remove rumble
3. Reduce harsh frequencies (2-4kHz dip)
4. Add smooth reverb (10-15%)

### Timing feels off?
1. Use DAW grid (16th notes for precision)
2. Snap to narration's natural rhythm
3. Anticipate dramatic moments 200-500ms early
4. Test multiple times - ears adjust after ~3 listens

### Volume inconsistent?
1. Use loudness meter (Youlean free)
2. Aim for -16 LUFS integrated (narration)
3. Peak no higher than -1 dBTP
4. Compress gently (2:1, -24dB threshold)

---

## Next Steps

### Immediate (Test Current Setup):
1. ✅ Open `index.html` in browser
2. ✅ Select Journey + Calm
3. ✅ Click "Begin Dream"
4. ✅ Verify narration plays
5. ✅ Check console output

### Short Term (Add Movie SFX):
1. ⏳ Read: `SFX_COMPOSITION_GUIDE.txt`
2. ⏳ Install: Reaper ($60) or use free trial
3. ⏳ Gather sounds from Splice/Freesound
4. ⏳ Follow 33-point timeline
5. ⏳ Export SFX stems
6. ⏳ Place in `CINEMATIC_AUDIO/`
7. ⏳ Test in browser

### Medium Term (Complete System):
1. ⏳ Create ambient beds (60-90s loops)
2. ⏳ Produce remaining 8 world/mood combos
3. ⏳ Test all 9 experiences
4. ⏳ Iterate based on feedback

---

## Quality Gates

### Bronze (Acceptable)
- ✅ Narration plays clearly
- ✅ Generic SFX at major beats
- ✅ Basic ducking works

### Silver (Good)
- ✅ Well-timed SFX throughout
- ✅ Emotional arc follows story
- ✅ Natural ducking/mixing
- ✅ No harsh frequencies

### Gold (Movie-Level)
- ✅ Orchestral foundation beneath tense moments
- ✅ Custom Foley recordings (footsteps, breath)
- ✅ Psychoacoustic layering (sub-bass to air)
- ✅ Automated volume dynamics
- ✅ Perfectly timed to ±50ms precision
- ✅ Professional loudness standards (-16 LUFS)
- ✅ Zero artifacts, clicks, or phase issues

---

## You're Currently At: **BRONZE**
Narration is playing! Now level up to GOLD by adding the SFX. 🎬✨

---

**Questions?** Check `AUDIO_PRODUCTION_SPECS.md` or `DAW_MIXING_GUIDE.md`
