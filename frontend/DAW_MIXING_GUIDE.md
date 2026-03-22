# 🎚️ DAW Mixing Workflow - Step by Step
## From Raw Narration to Cinematic Stems

This guide walks you through the complete mixing process in a DAW (Reaper, Audition, Pro Tools, Logic, or Studio One).

---

## 📋 OVERVIEW

**What You're Creating**: 3 stems per world/mood (27 files total)
1. Narration - Processed voice (3-5 min)
2. Ambient - Looping atmospheric bed (60-90s)
3. SFX - Timed cinematic events (3-5 min with silence padding)

**Estimated Time Per Experience**: 2-3 hours
**Tools Needed**: DAW + plugins (see recommended tools below)

---

## 🎙️ PART 1: NARRATION STEM (60-90 minutes)

### Step 1: Import Raw Narration (5 min)

**If using ElevenLabs:**
1. Run `python generate_narration.py --world journey --mood calm`
2. This generates: `journey_calm_narration.mp3` (raw, unprocessed)
3. Import to DAW → Track 1

**If using Voice Actor:**
1. Receive 48kHz/24-bit WAV dry vocal recording
2. Import to DAW → Track 1

**Setup:**
- Sample Rate: 48kHz
- Bit Depth: 24-bit
- Track Type: Mono audio

---

### Step 2: Editing - Clean & Time (15 min)

**Goal**: Remove unwanted sounds and match script timing

1. **Remove Breaths**
   - Listen through entire track
   - Delete loud/distracting breaths (keep subtle ones for realism)
   - Use crossfade (10-20ms) when cutting to avoid clicks

2. **Adjust Pause Timing**
   - Open story script: `backend/stories/journey_calm.txt`
   - Find "..." markers (should be 2-4s pauses)
   - Measure pauses in DAW (select gap between sentences)
   - If too short: Insert silence or stretch region
   - If too long: Trim or compress time

3. **Remove Clicks/Pops**
   - Zoom in on waveform looking for spikes
   - Use pencil tool to redraw clicks (or RX plugin if available)

4. **Trim Silence**
   - Remove excess silence at start (leave 0.5s pad)
   - Remove excess silence at end (leave 0.5s pad)
   - Fade in: 50ms linear
   - Fade out: 200ms exponential

**Before/After Check**:
- Duration should match estimated script time
- No unexpected noises
- Clean waveform with no clipping (red)

---

### Step 3: Processing - Make It Cinematic (30 min)

**Insert Plugins in This Order** (on narration track):

#### Plugin 1: EQ (Subtractive)
**Purpose**: Remove muddy/harsh frequencies

- **HPF**: 80 Hz, 12 dB/octave slope
  - Removes rumble, room tone
- **Notch**: -2 dB @ 250 Hz, Q=2
  - Reduces boxiness (boxy/hollow sound)
- **Boost**: +1.5 dB @ 3-5 kHz, Q=1
  - Adds presence/clarity (intelligibility)
- **LPF**: 15 kHz, gentle slope
  - Removes sibilance harshness

**Free Plugin**: ReaEQ (Reaper) or TDR Nova (free)
**Bypass check**: A/B to ensure it sounds more natural, not worse

---

#### Plugin 2: Compressor
**Purpose**: Even out volume, add control

**Settings**:
- **Ratio**: 3:1
- **Threshold**: -18 dB
- **Attack**: 10 ms (fast enough to catch syllables)
- **Release**: 100 ms (natural decay)
- **Makeup Gain**: Adjust so average level is -12 dB

**What to Listen For**:
- Quieter words should be more audible
- Should not hear "pumping" (volume wobbling)
- 3-5 dB gain reduction on louder syllables

**Free Plugin**: ReaComp (Reaper) or TDR Kotelnikov (free)

---

#### Plugin 3: De-Esser
**Purpose**: Tame harsh "S" sounds

**Settings**:
- **Frequency**: 6-8 kHz (where sibilance lives)
- **Threshold**: Set so it triggers only on "S" sounds
- **Reduction**: 3-6 dB

**How to Set**:
1. Find a word with strong "S" (like "steps" or "silence")
2. Loop that section
3. Adjust threshold until de-esser kicks in only on "S"
4. Reduce by 3-6 dB (keep natural, don't remove completely)

**Free Plugin**: Lisp (free) or ReaDeEss (Reaper)

---

#### Plugin 4: Reverb (Subtle Space)
**Purpose**: Add sense of "place" without sounding echoey

**Settings**:
- **Type**: Small Hall or Plate
- **Pre-Delay**: 15-25 ms
- **Decay Time**: 0.8-1.2 seconds
- **Mix**: 8-12% (barely noticeable)
- **High-Cut**: 8 kHz (darker reverb, more natural)

**What to Listen For**:
- Voice should feel "in a room" not dry studio
- Should NOT sound like cave/bathroom
- If you hear obvious echo, reduce mix

**Free Plugin**: Valhalla FreqEcho or Dragonfly Plate Reverb

---

#### Plugin 5: Limiter (Safety)
**Purpose**: Prevent clipping, control peaks

**Settings**:
- **Ceiling**: -1 dBTP (true peak, prevents distortion)
- **Release**: 100 ms
- **Gain**: Adjust so loudest peaks reach -3 dBFS

**What to Listen For**:
- Loudest syllables should kiss -3 dB (not slam into 0)
- Should not hear distortion
- If limiter is constantly engaged, pull back gain

**Free Plugin**: LoudMax (free) or ReaLimit (Reaper)

---

### Step 4: Check Levels & Loudness (10 min)

1. **Install Loudness Meter** (free): Youlean Loudness Meter
2. Insert on narration track (post-limiter)
3. Play full track
4. Check integrated LUFS: Should be around **-16 LUFS**
5. Check true peak: Should not exceed **-1 dBTP**

**Adjustments**:
- If too quiet (below -18 LUFS): Add makeup gain on limiter
- If too loud (above -14 LUFS): Reduce gain before limiter
- If clipping (0 dBTP): Reduce limiter ceiling or pre-gain

---

### Step 5: Export Narration Stem (5 min)

**Master WAV**:
- Format: WAV (Microsoft)
- Sample Rate: 48000 Hz
- Bit Depth: 24
- Channels: Mono
- Normalize: Off (already processed)
- Dither: None (24-bit doesn't need it)
- **Filename**: `journey_calm_narration.wav`

**Web MP3**:
- Format: MP3
- Bitrate: 320 kbps CBR (constant bitrate)
- Channels: Joint Stereo (upmix from mono OK)
- Quality: Highest
- **Filename**: `journey_calm_narration.mp3`

**Save Location**: `frontend/assets/audio/CINEMATIC_AUDIO/`

---

## 🌊 PART 2: AMBIENT STEM (45-60 minutes)

### Step 1: Gather Sound Sources (15 min)

**What You Need**: 3-5 atmospheric sounds per world/mood

**Journey - Calm**:
- Gentle wind (low rumble, 40-150 Hz)
- Distant footsteps on grass (rhythmic, 60 bpm)
- Soft birdsong (distant, sparse)

**Journey - Confident**:
- Steady walking rhythm (clear, purposeful)
- Light breeze (mid-range texture)
- Subtle bird calls

**Journey - Curious**:
- Varying footsteps (changing terrain)
- Playful wind gusts
- Exploratory nature sounds

**Sanctuary - Calm**:
- Soft rain on roof
- Distant ocean waves (slow, 0.1 Hz)
- Subliminal heartbeat (60 bpm, felt not heard)

**Sanctuary - Confident**:
- Warm fireplace crackle
- Enclosed space reverb (IR or synthetic)
- Gentle breathing (barely audible)

**Sanctuary - Curious**:
- Garden ambience (light breeze)
- Wind chimes (distant, sparse)
- Water fountain (soft trickle)

**Exploration - Calm**:
- Floating whoosh (slow sweeps)
- Space/water drone (40-80 Hz)
- Gentle shimmer (high sparkle)

**Exploration - Confident**:
- Uplifting pad (major key, warm)
- Crystalline textures (bright, clear)
- Subtle magic shimmer

**Exploration - Curious**:
- Otherworldly drones (evolving, morphing)
- Playful sparkles (random, delicate)
- Morphing tones (sci-fi, organic)

**Where to Find**:
- **Freesound.org** (CC0, free)
- **Splice** ($8/mo, huge library)
- **Epidemic Sound** ($15/mo, royalty-free)
- **Sonniss GDC Bundle** (free cinematic SFX)

---

### Step 2: Layer Sounds in DAW (20 min)

1. **Create 5 Tracks** (one per layer)
2. **Import Sounds**:
   - Track 1: Low drone/rumble (40-200 Hz)
   - Track 2: Mid texture (200-2000 Hz)
   - Track 3: High air/shimmer (3-10 kHz)
   - Track 4: Movement (LFO/slow variation)
   - Track 5: Accent (sparse, occasional)

3. **Loop Each Track**:
   - Find loop points (zero-crossing, exact bars)
   - Test loop 3x - listen for clicks
   - Trim to 60-90 seconds

4. **Solo Each Track**:
   - Verify it sounds good alone
   - Check for unwanted frequencies

---

### Step 3: EQ Each Layer (15 min)

**Goal**: Each layer occupies its own frequency space

**Low Drone (Track 1)**:
- HPF: 40 Hz (remove sub-rumble)
- LPF: 200 Hz (keep it low)
- Volume: -12 dB

**Mid Texture (Track 2)**:
- HPF: 150 Hz (don't clash with drone)
- LPF: 2 kHz (leave room for narration)
- Dip: -2 dB @ 2-4 kHz (narration clarity space)
- Volume: -10 dB

**High Shimmer (Track 3)**:
- HPF: 3 kHz (purely high end)
- LPF: 12 kHz (too high is fatiguing)
- Volume: -15 dB (subtle)

**Movement (Track 4)**:
- EQ as needed (depends on source)
- Volume: -12 to -8 dB

**Accent (Track 5)**:
- EQ to fit gaps in other layers
- Volume: -14 dB (sparse, background)

---

### Step 4: Stereo Imaging (10 min)

**Goal**: Wide, immersive soundscape (but not fatiguing)

1. **Keep Low End Mono**:
   - Below 200 Hz should be centered
   - Use stereo width plugin: Set <200 Hz to 0% width

2. **Widen Mid/High**:
   - 200 Hz - 10 kHz: 70-100% width
   - Use Ozone Imager or similar

3. **Test in Mono**:
   - Sum to mono (DAW function)
   - Should still sound full (no phase cancellation)

**Free Plugin**: Ozone Imager (free), Voxengo MSED (free)

---

### Step 5: Final Ambient Mix (10 min)

1. **Adjust Levels**:
   - All layers should blend (no one layer dominates)
   - Peak level: -6 dBFS (leaves headroom)

2. **Add Master Reverb** (optional):
   - Large hall or cathedral
   - Mix: 15-25%
   - Creates sense of vast space

3. **Gentle Compression**:
   - Ratio: 2:1
   - Threshold: -24 dB
   - Attack: 30ms | Release: 300ms
   - Goal: Steady bed, no sudden jumps

4. **Check Loop Point**:
   - Play 5x loops - listen for clicks/pops
   - If click: Adjust crossfade at loop boundary

5. **Export** (60-90s seamless loop):
   - WAV: 48kHz/24-bit/Stereo
   - MP3: 256-320 kbps/Stereo
   - **Filename**: `journey_calm_ambient.wav` + `.mp3`

---

## 💥 PART 3: SFX STEM (30-45 minutes)

### Step 1: Mark SFX Timestamps (10 min)

1. Open narration stem in DAW (for timing reference)
2. Listen through and mark emotional peaks:
   - 0:00-0:10 - **Opening**: Welcoming swell
   - 0:40-1:00 - **First Accent**: Emotional hook
   - 1:30-1:45 - **Mid Journey**: Punctuation
   - 2:15-2:30 - **Climax Build**: Rising tension
   - 2:50-3:00 - **Resolution**: Gentle descent

3. Place markers in DAW timeline

---

### Step 2: Place SFX at Markers (15 min)

**Opening (0:05)**:
- Sound: Gentle riser/swell
- Duration: 3-5s
- Volume: -10 dB
- Purpose: Welcoming entry

**First Accent (0:45)**:
- Sound: Subtle impact or chime
- Duration: 1-2s
- Volume: -12 dB
- Purpose: Emotional hook

**Mid Journey (1:30)**:
- Sound: Transition whoosh or texture shift
- Duration: 2-3s
- Volume: -10 dB
- Purpose: Mark narrative shift

**Climax Build (2:15)**:
- Sound: Rising tension (crescendo, riser)
- Duration: 5-8s
- Volume: -8 dB
- Purpose: Emotional peak

**Resolution (2:50)**:
- Sound: Gentle descent, completion chime
- Duration: 3-5s
- Volume: -12 dB
- Purpose: Closure, peace

---

### Step 3: Process Each SFX (10 min)

**For Each SFX**:
1. **Fade In**: 100-300ms (smooth entry)
2. **Fade Out**: 500ms-1s (natural decay)
3. **EQ**: HPF @ 60 Hz (remove rumble)
4. **Reverb**: Match ambient space (10-20% mix)

**Stereo Placement**:
- Opening: Center-wide (welcoming)
- Accent: Slight L/R (movement)
- Mid Journey: Opposite side of Accent
- Climax: Full stereo (immersive)
- Resolution: Return to center (grounding)

---

### Step 4: Export SFX Stem (5 min)

1. **Silence Padding**:
   - Ensure timeline is same length as narration (3-5 min)
   - SFX events should have silence between them

2. **Check Peaks**:
   - Loudest SFX: -10 to -6 dBFS
   - Code will duck to -18 dB during narration

3. **Export**:
   - WAV: 48kHz/24-bit/Stereo
   - MP3: 256 kbps/Stereo
   - **Filename**: `journey_calm_sfx.wav` + `.mp3`

---

## ✅ PART 4: QUALITY CONTROL (15 minutes)

### Step 1: Test All 3 Stems Together (10 min)

1. **Import to DAW**:
   - Track 1: Narration (0 dB)
   - Track 2: Ambient (-10 dB)
   - Track 3: SFX (-6 dB)

2. **Play Full Experience**:
   - Can you hear every word clearly?
   - Does ambient support without distracting?
   - Do SFX enhance emotion without overpowering?

3. **Check Frequency Clash**:
   - Use spectrum analyzer
   - Narration should dominate 200 Hz - 4 kHz

### Step 2: Final Checks (5 min)

- [ ] All files normalized to proper peaks
- [ ] No clipping (0 dBFS)
- [ ] No clicks/pops at start/end
- [ ] Ambient loops seamlessly
- [ ] SFX timing feels natural
- [ ] Filenames match exactly: `{world}_{mood}_{stem}.mp3`

---

## 🎯 RECOMMENDED TOOLS

### DAW (Choose One)
- **Reaper** - $60 (Windows/Mac/Linux) - Best value
- **Audition** - $20/mo (Adobe CC) - Industry standard for audio post
- **Logic Pro** - $200 (Mac only) - Great all-in-one
- **Studio One Free** - $0 - Good for beginners

### Essential Plugins (Free Options)
- **EQ**: ReaEQ (Reaper), TDR Nova (free)
- **Compressor**: ReaComp (Reaper), TDR Kotelnikov (free)
- **De-Esser**: Lisp (free), ReaDeEss (Reaper)
- **Reverb**: Valhalla FreqEcho (free), Dragonfly Plate (free)
- **Limiter**: LoudMax (free), ReaLimit (Reaper)
- **Metering**: Youlean Loudness Meter (free)
- **Stereo**: Ozone Imager (free), MSED (free)

### Premium Plugins (Optional)
- **FabFilter Pro-Q 3** - $179 (best EQ)
- **FabFilter Pro-C 2** - $169 (best compressor)
- **Valhalla Room** - $50 (best reverb for price)
- **iZotope RX 10** - $399 (audio repair/cleanup)

---

## 📊 TIME ESTIMATE PER WORLD/MOOD

- **Narration Stem**: 60-90 min
- **Ambient Stem**: 45-60 min
- **SFX Stem**: 30-45 min
- **Quality Control**: 15 min
- **TOTAL**: ~2.5-3.5 hours

**For All 9 Combinations**: 20-30 hours total

---

## 🚀 NEXT STEPS

1. ✅ Install DAW + plugins
2. ✅ Generate raw narration (ElevenLabs or voice actor)
3. ✅ Follow this workflow for Journey-Calm first
4. ✅ Test in DreamPulse app
5. ✅ Iterate based on what works
6. ✅ Repeat for remaining 8 combinations

---

**Good luck!** You're creating broadcast-quality audio. 🎬✨
