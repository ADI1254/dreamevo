# 🎬 DreamPulse Audio Production Specifications
## Movie-Quality Narration & Sound Design

---

## 📋 OVERVIEW

This document provides complete specifications for producing cinematic-quality audio stems for DreamPulse. Follow these specs to create broadcast-ready audio that rivals Netflix/HBO productions.

**Target Quality**: Theatrical/Streaming Grade  
**Format**: 48kHz / 24-bit WAV (lossless master) + 320kbps MP3 (web delivery)  
**Dynamic Range**: -23 LUFS integrated, -1 dBTP max peak  
**Production Time**: ~2-4 hours per world/mood combo

---

## 🎯 WHAT YOU'LL PRODUCE

For each world × mood combination (9 total):

```
📁 frontend/assets/audio/CINEMATIC_AUDIO/
├── journey_calm_narration.wav
├── journey_calm_narration.mp3
├── journey_calm_ambient.wav
├── journey_calm_ambient.mp3
├── journey_calm_sfx.wav
├── journey_calm_sfx.mp3
├── journey_confident_narration.wav
├── journey_confident_narration.mp3
... (27 stem files total)
```

**3 Stems per Experience**:
1. **Narration** - Human voice (premium TTS or voice actor)
2. **Ambient** - Continuous atmospheric bed (loopable)
3. **SFX** - Punctuation/risers/transitions (triggered events)

---

## 🎙️ NARRATION STEM SPECIFICATIONS

### Voice Direction

**Journey (Movement & Progress)**
- Tone: Warm, reassuring guide
- Pacing: Steady forward momentum
- Voice Type: Neutral gender, mid-range pitch
- Example: "You are walking now... each step lighter than the last..."

**Sanctuary (Safety & Rest)**
- Tone: Gentle, nurturing presence
- Pacing: Slow, deeply relaxed
- Voice Type: Soft, maternal/paternal warmth
- Example: "Here, you are held... nothing to prove... nothing to fix..."

**Exploration (Curiosity & Wonder)**
- Tone: Playful guide, open-ended
- Pacing: Moderate with excited lifts
- Voice Type: Bright, inviting
- Example: "What if you could fly?... where would you go first?..."

### Mood Adjustments

**Calm** - Rate: 0.70-0.75 | Long pauses (2-4s) | Soft consonants  
**Confident** - Rate: 0.80-0.85 | Medium pauses (1.5-2.5s) | Clear diction  
**Curious** - Rate: 0.75-0.80 | Varied pauses (1-3s) | Upward inflections

### Technical Specs

- **Format**: 48kHz / 24-bit WAV mono
- **Duration**: Match story script length (~3-5 minutes)
- **Timing**: Include scripted pauses (marked as "..." in story files)
- **Breaths**: Remove loud breaths, keep subtle ones for realism
- **Room Tone**: None - clean isolated voice

### Processing Chain (DAW)

1. **Recording/Generation**
   - ElevenLabs: "Adam" (deep male), "Rachel" (warm female), "Antoni" (gentle male)
   - Voice Actor: Pop filter, cardioid mic, 6-12" distance, quiet room
   - TTS Settings: Stability 0.5, Similarity 0.85, Style 0.3

2. **Editing**
   - Remove clicks, pops, breaths (keep natural ones)
   - Align pauses to script timing
   - Fade in: 50ms | Fade out: 200ms

3. **EQ** (Subtractive First)
   - HPF: 80 Hz (12 dB/octave) - remove rumble
   - Notch: -2 dB @ 250 Hz (narrow Q) - reduce boxiness
   - Boost: +1.5 dB @ 3-5 kHz (broad) - presence/clarity
   - LPF: 15 kHz (gentle slope) - remove harshness

4. **Compression**
   - Ratio: 3:1
   - Threshold: -18 dB
   - Attack: 10ms | Release: 100ms
   - Gain Reduction: 3-5 dB average
   - Goal: Even, controlled voice without pumping

5. **De-Esser**
   - Frequency: 6-8 kHz
   - Reduction: 3-6 dB on sibilants
   - Keep natural "s" sounds, just tame peaks

6. **Reverb** (Subtle Presence)
   - Type: Small hall or plate
   - Pre-Delay: 15-25ms
   - Decay: 0.8-1.2s
   - Mix: 8-12% (barely noticeable)
   - Goal: Voice feels "in a space" not dry studio

7. **Limiter** (Safety)
   - Ceiling: -1 dBTP
   - Release: 100ms
   - Gain: Adjust so peaks kiss -3 dBFS before limiting

8. **Final Loudness**
   - Target: -16 LUFS integrated (narration stem only)
   - This allows room for ambient/SFX in final mix

### Export Settings

**Master WAV**:
- 48kHz / 24-bit / Mono
- Normalize to -1 dBTP
- File: `{world}_{mood}_narration.wav`

**Web MP3**:
- 320 kbps / Joint Stereo (upmix from mono)
- Same normalization
- File: `{world}_{mood}_narration.mp3`

---

## 🌊 AMBIENT STEM SPECIFICATIONS

### Sound Design by World

**Journey**
- **Calm**: Gentle wind, distant footsteps on soft ground, leaves rustling
- **Confident**: Steady walking rhythm, clear path sounds, birdsong (distant)
- **Curious**: Varied textures - water, gravel, grass transitions

**Sanctuary**
- **Calm**: Soft rain on roof, distant ocean waves, heartbeat (subliminal 60 bpm)
- **Confident**: Warm fireplace crackle, safe enclosed space reverb
- **Curious**: Garden sounds - light breeze, chimes, water fountain

**Exploration**
- **Calm**: Floating in space/water - gentle whooshes, slow sweeps
- **Confident**: Magical shimmer, uplifting pads, crystalline textures
- **Curious**: Otherworldly drones, playful sparkles, morphing tones

### Technical Specs

- **Format**: 48kHz / 24-bit WAV stereo
- **Duration**: 60-90 seconds (seamless loop)
- **Loop Points**: Exact zero-crossing match for glitch-free playback
- **Stereo Field**: Wide (70-100%) - immersive but not fatiguing
- **Frequency Range**: 40 Hz - 12 kHz (leave room for narration clarity)

### Processing Chain

1. **Sound Selection**
   - Freesound.org (CC0 license)
   - Splice/Epidemic Sound (licensed libraries)
   - Field recordings (your own, royalty-free)

2. **Layering** (3-5 elements)
   - Base: Low drone/pad (40-200 Hz)
   - Mid: Atmospheric texture (200-2000 Hz)
   - High: Sparkle/air (3-10 kHz)
   - Movement: Slow LFO on volume/filter

3. **EQ** (Per Layer)
   - Cut overlapping frequencies between layers
   - Example: If drone is 60-150 Hz, cut texture below 150 Hz
   - Create space for narration: gentle dip -2 dB @ 2-4 kHz

4. **Stereo Imaging**
   - Width: 80-100% (Ozone Imager or similar)
   - Keep low end (<200 Hz) centered (mono)
   - Avoid hard L/R panning - use subtle movement

5. **Dynamics**
   - Gentle compression (2:1 ratio, -24 dB threshold)
   - Goal: Steady bed, no sudden jumps
   - Allow subtle breathing (0.5-1 dB variation)

6. **Reverb** (Space Creation)
   - Large hall or cathedral (if appropriate to world)
   - Mix: 15-25%
   - Pre-delay: 30-50ms
   - Creates sense of vast environment

7. **Final Mix**
   - Peak Level: -6 dBFS (leaves headroom for SFX/narration)
   - LUFS: -20 to -18 integrated
   - Check loop point: no click/pop when repeating

### Export Settings

**Master WAV**:
- 48kHz / 24-bit / Stereo
- Seamless loop (trim to exact loop length)
- File: `{world}_{mood}_ambient.wav`

**Web MP3**:
- 256-320 kbps / Stereo
- File: `{world}_{mood}_ambient.mp3`

---

## 💥 SFX STEM SPECIFICATIONS

### Event Types

**Opening** (0-10s): Gentle swell, welcoming tone  
**Mid-Journey** (40-60s): Punctuation, emotional accent  
**Climax** (80-90%): Revelation, uplifting moment  
**Resolution** (End): Gentle descent, completion

### Sound Design by World

**Journey**
- Opening: Distant horn, path opening
- Mid: Footstep emphasis, terrain shift
- Climax: Vista reveal, panoramic sweep
- Resolution: Arrival chime, gate closing

**Sanctuary**
- Opening: Door closing softly, safety established
- Mid: Embrace sound, warm wrap
- Climax: Heart opening (metaphorical riser)
- Resolution: Deep exhale, settling

**Exploration**
- Opening: Portal open, magical shimmer
- Mid: Discovery chime, "aha" moment
- Climax: Universe expanding, cosmic sweep
- Resolution: Return home, grounding

### Technical Specs

- **Format**: 48kHz / 24-bit WAV stereo
- **Duration**: 90-120 seconds (non-looping, timed events)
- **Events**: 4-6 distinct SFX moments
- **Spacing**: Events spaced to avoid narration collisions
- **Silence**: Pad with silence so events occur at specific timestamps

### Processing Chain

1. **Sound Selection**
   - Cinematic SFX libraries (Boom Library, Sonniss)
   - Synthesized risers/impacts (Serum, Omnisphere)
   - Foley recordings

2. **Timing** (Example for 3-min narration)
   - Event 1: 0:05 (intro swell)
   - Event 2: 0:45 (first accent)
   - Event 3: 1:30 (mid-journey punctuation)
   - Event 4: 2:15 (climax build)
   - Event 5: 2:50 (resolution)

3. **Individual SFX Processing**
   - Fade in: 100-300ms (smooth entry)
   - Fade out: 500ms-1s (natural decay)
   - EQ: Cut below 60 Hz (remove rumble)
   - Reverb: Match ambient space (10-20% mix)

4. **Ducking Preparation**
   - Peak at -10 to -6 dBFS
   - Code will duck to -18 dB during narration
   - Design SFX to sound good at both levels

5. **Stereo Placement**
   - Opening: Center-wide (welcoming)
   - Mid: L/R alternating (movement)
   - Climax: Full stereo (immersive)
   - Resolution: Return to center (grounding)

### Export Settings

**Master WAV**:
- 48kHz / 24-bit / Stereo
- Contains all timed SFX for one experience
- File: `{world}_{mood}_sfx.wav`

**Web MP3**:
- 256 kbps / Stereo
- File: `{world}_{mood}_sfx.mp3`

---

## 🎚️ FINAL MIX GUIDELINES

When all three stems are played together:

### Volume Balance (Relative Levels)
- **Narration**: 100% (0 dB) - Primary focus
- **Ambient**: 30-40% (-10 to -8 dB) - Supportive bed
- **SFX**: 50-70% (-6 to -3 dB) - Accents, not overpowering

### Frequency Balance
- **20-80 Hz**: Ambient only (low drone)
- **80-200 Hz**: Ambient + SFX bass (narration clean)
- **200-4 kHz**: All three (narration dominant)
- **4-10 kHz**: Narration + sparkle from ambient/SFX
- **10-15 kHz**: Air/shimmer (subtle)

### Ducking (Handled by Code)
- When narration plays: Ambient/SFX reduce by 8-12 dB
- Fade duration: 600ms (smooth transition)
- This is automatic - design stems assuming code will duck

### Test Mix Checklist
- [ ] Can you clearly understand every word?
- [ ] Does ambient support without distracting?
- [ ] Do SFX enhance emotional moments?
- [ ] Is there headroom (-1 dBTP ceiling)?
- [ ] Does it loop seamlessly (ambient)?

---

## 📦 DELIVERY CHECKLIST

For EACH world/mood (9 combinations):

### Files to Deliver
- [ ] `{world}_{mood}_narration.wav` (48kHz/24-bit mono)
- [ ] `{world}_{mood}_narration.mp3` (320kbps)
- [ ] `{world}_{mood}_ambient.wav` (48kHz/24-bit stereo, looping)
- [ ] `{world}_{mood}_ambient.mp3` (256-320kbps)
- [ ] `{world}_{mood}_sfx.wav` (48kHz/24-bit stereo)
- [ ] `{world}_{mood}_sfx.mp3` (256kbps)

### Quality Checks (Per File)
- [ ] Peak level: -1 dBTP or lower
- [ ] No clipping/distortion
- [ ] No clicks/pops at start/end
- [ ] Ambient loops seamlessly (zero-crossing match)
- [ ] Narration timing matches script pauses
- [ ] SFX events don't collide with key narration phrases

### Metadata (Embed in Files)
- Title: "DreamPulse - {World} - {Mood} - {Stem Type}"
- Artist: "Your Name/Studio"
- Album: "DreamPulse Audio Stems"
- Year: 2026
- Genre: "Cinematic / Meditation"

---

## 🎬 PRODUCTION WORKFLOW (Step-by-Step)

### Phase 1: Script Preparation (30 min)
1. Read story file: `backend/stories/{world}_{mood}.txt`
2. Mark pause durations: "..." = 2s, "......." = 4s
3. Note emotional peaks for SFX placement
4. Estimate total narration duration

### Phase 2: Narration Generation (1 hour)
1. **ElevenLabs Route** (Recommended)
   - Create account: elevenlabs.io
   - Select voice (see Voice Direction above)
   - Paste script, adjust stability/similarity
   - Generate and download 24-bit WAV
   
2. **Voice Actor Route** (Premium)
   - Book Fiverr/Voices.com talent ($50-150/script)
   - Send them this spec doc
   - Request 48kHz/24-bit WAV dry vocal
   
3. Import to DAW (Reaper/Audition/Pro Tools/Logic)

### Phase 3: Vocal Editing (30 min)
1. Remove breaths/clicks (keep subtle ones)
2. Adjust pause timing to match script
3. Trim silence at start/end (leave 0.5s pad)
4. Add 50ms fade-in, 200ms fade-out

### Phase 4: Vocal Processing (30 min)
1. Insert plugins in order:
   - EQ → Compressor → De-Esser → Reverb → Limiter
2. Follow processing chain (see Narration Specs)
3. A/B compare: Processed vs. Raw
4. Adjust until natural but polished

### Phase 5: Ambient Design (1 hour)
1. Gather 3-5 sound sources (Freesound/Splice)
2. Layer in DAW on separate tracks
3. EQ each layer (cut overlaps)
4. Add reverb/width to taste
5. Find loop point (exact bar/beat)
6. Test loop 3x - listen for clicks
7. Export seamless 60-90s loop

### Phase 6: SFX Design (45 min)
1. Mark SFX timestamps on timeline
2. Place cinematic SFX at key moments
3. Process each: fade in/out, EQ, reverb
4. Ensure spacing between events (no overlap)
5. Export full timeline with silence padding

### Phase 7: Final Mix & Export (30 min)
1. Test all 3 stems together in DAW
2. Check levels (narration dominant)
3. Export master WAV (24-bit) for each stem
4. Convert to MP3 (Lame encoder, V0 or 320kbps)
5. Tag metadata
6. Organize into folder structure

### Phase 8: Quality Control (15 min)
1. Play all stems simultaneously
2. Check intelligibility of narration
3. Verify ambient loops without glitches
4. Confirm SFX timing enhances (not distracts)
5. Measure peaks: Should not exceed -1 dBTP
6. Listen on multiple devices (headphones, speakers, phone)

---

## 🛠️ RECOMMENDED TOOLS

### DAW (Choose One)
- **Reaper** - $60, industry standard, Win/Mac
- **Audition** - Adobe CC, excellent for audio post
- **Pro Tools** - Industry standard, expensive
- **Logic Pro** - Mac only, great value
- **Studio One** - Free version available

### Plugins (Free Options)
- **EQ**: ReaEQ (Reaper) or TDR Nova (free)
- **Compressor**: ReaComp or TDR Kotelnikov (free)
- **De-Esser**: Lisp (free) or ReaDeEss
- **Reverb**: Valhalla FreqEcho or Dragonfly Plate
- **Limiter**: LoudMax (free) or ReaLimit
- **Metering**: Youlean Loudness Meter (free)

### Sound Libraries
- **Freesound.org** - CC0 license, free
- **Sonniss GDC Bundle** - Free cinematic SFX
- **Splice** - $8/mo, massive library
- **Epidemic Sound** - $15/mo, royalty-free

### TTS Services
- **ElevenLabs** - $5/mo (30k chars), best quality
- **Azure TTS** - Pay-as-go, neural voices
- **Google Cloud TTS** - Similar pricing
- **Amazon Polly** - Neural voices, good value

---

## 📊 BUDGET ESTIMATE

### Free Route
- DAW: Reaper ($60) or free trial
- Plugins: All free options listed above
- TTS: ElevenLabs free tier (10k chars/mo)
- SFX: Freesound.org (free)
- **Total**: $60 one-time

### Premium Route
- DAW: Pro Tools ($30/mo) or Logic ($200 one-time)
- Plugins: FabFilter bundle ($600) or Waves ($300)
- Voice Actor: $100/script × 9 = $900
- SFX: Splice ($8/mo) + Boom Library ($200)
- **Total**: ~$2000-3000

### Recommended Hybrid
- DAW: Reaper ($60)
- Plugins: Mix free + TDR bundle ($60)
- TTS: ElevenLabs Pro ($22/mo)
- SFX: Splice ($8/mo) + Freesound (free)
- **Total**: ~$150 + $30/mo

---

## 🎯 FIRST STEM TO PRODUCE

Start with: **Journey - Calm**

This is the most common use case and will teach you the workflow. Once you've mastered this, the other 8 will be faster.

**Estimated Time for First Stem**: 3-4 hours  
**Subsequent Stems**: 1.5-2 hours each

---

## 📞 NEXT STEPS

1. ✅ Read this spec fully
2. ✅ Set up DAW and plugins
3. ✅ Create ElevenLabs account (or book voice actor)
4. ✅ Produce Journey-Calm stems (narration + ambient + SFX)
5. ✅ Place files in `frontend/assets/audio/CINEMATIC_AUDIO/`
6. ✅ Test in DreamPulse app
7. ✅ Iterate based on feedback
8. ✅ Produce remaining 8 world/mood combinations

---

**Questions?** Update this spec as you learn what works best for your workflow.

**Good luck!** You're creating something truly cinematic. 🎬✨
