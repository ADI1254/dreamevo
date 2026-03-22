# 🎬 Cinematic Audio Production - Complete Setup Guide

## What I've Built for You

I **cannot** actually run DAW software or generate audio files (I don't have access to desktop applications or audio processing tools), but I've created a **complete production pipeline** so you can produce movie-quality audio stems.

---

## 📦 FILES CREATED

### 1. Production Specifications
**`AUDIO_PRODUCTION_SPECS.md`** - Master reference document
- Voice direction for each world/mood
- Technical specs (48kHz/24-bit, loudness targets)
- Complete DAW processing chain (EQ, compression, reverb, limiting)
- Sound design guidance by world archetype
- Budget estimates (free vs. premium tools)

### 2. Code Integration
**`script.js`** - Updated to use pre-rendered stems
- Automatic stem detection system
- Falls back to TTS if stems not found
- Ducking system (reduces ambient/SFX during narration)
- Smooth fades and volume control
- Works with `.mp3` or `.wav` files

### 3. Folder Structure
**`frontend/assets/audio/CINEMATIC_AUDIO/`** - Ready for your stems
- Created folder with full README
- Lists all 27 required files (9 worlds/moods × 3 stems)
- Filename conventions: `{world}_{mood}_{narration|ambient|sfx}.mp3`

### 4. Automation Script
**`generate_narration.py`** - ElevenLabs automation
- Generates all 9 narration stems automatically
- Cost estimation (dry-run mode)
- Voice selection per world (Antoni, Bella, Rachel)
- Mood-specific pacing adjustments
- Requires: `pip install -r narration_requirements.txt`

### 5. Step-by-Step Guide
**`DAW_MIXING_GUIDE.md`** - Complete mixing workflow
- 5-part process: Narration → Ambient → SFX → QC
- Plugin settings with free alternatives
- Time estimates per stem (~3 hours per world/mood)
- Quality control checklist

---

## 🎯 HOW TO USE THIS SYSTEM

### Option 1: Fully Automated (Easiest)
**Time**: ~4 hours for all 9 narrations (mostly waiting)

1. **Get ElevenLabs API Key**
   - Sign up: https://elevenlabs.io
   - Free tier: 10,000 chars/month
   - Or paid: $5/mo for 30k chars

2. **Run Generation Script**
   ```powershell
   cd "f:\DREAMPULSE 6 JAN 26\NEW\dreampulse\frontend"
   
   # Install dependencies
   pip install -r narration_requirements.txt
   
   # Create .env file
   echo "ELEVENLABS_API_KEY=your_key_here" > .env
   
   # Dry run (estimate costs)
   python generate_narration.py --dry-run
   
   # Generate all 9 narrations
   python generate_narration.py
   ```

3. **Output**: 9 raw narration MP3s in `CINEMATIC_AUDIO/`

4. **Next**: Import to DAW for mixing (see Option 2 below)

---

### Option 2: DAW Production (For Quality)
**Time**: ~3 hours per world/mood combo

1. **Install DAW** (choose one):
   - Reaper ($60) - recommended
   - Audition ($20/mo)
   - Studio One Free

2. **Open**: `DAW_MIXING_GUIDE.md`

3. **Follow Step-by-Step**:
   - Import raw narration (from ElevenLabs or voice actor)
   - Apply processing chain (EQ, compression, de-ess, reverb, limiter)
   - Design ambient bed (3-5 layered sounds, loopable)
   - Create SFX events (4-6 timed cinematic moments)
   - Export 3 stems per world/mood

4. **Result**: Broadcast-quality stems ready for web

---

### Option 3: Hire Producer (Fastest)
**Time**: 1 week, **Cost**: $500-2000

1. **Find Audio Producer** (Fiverr, Upwork, Soundbetter)

2. **Send Them**:
   - `AUDIO_PRODUCTION_SPECS.md`
   - `DAW_MIXING_GUIDE.md`
   - Story files: `backend/stories/*.txt`

3. **Request**: 27 stems (9 × 3 files) following specs

4. **Receive**: Professional stems, drop into `CINEMATIC_AUDIO/`

---

## 🚀 QUICK START (Recommended Path)

### Path A: Test with ONE Experience First

**Goal**: Prove the system works before producing all 9

```powershell
# 1. Generate ONE narration (Journey-Calm)
python generate_narration.py --world journey --mood calm

# 2. Create ambient bed in DAW
#    - Follow DAW_MIXING_GUIDE.md Part 2
#    - Export: journey_calm_ambient.mp3

# 3. Create SFX in DAW
#    - Follow DAW_MIXING_GUIDE.md Part 3
#    - Export: journey_calm_sfx.mp3

# 4. Place all 3 files in CINEMATIC_AUDIO/

# 5. Test in browser
#    - Open frontend/index.html
#    - Select Journey + Calm
#    - Click "Begin Dream"
#    - Check console for "🎬 Starting cinematic stem playback..."
```

**If it works**: Repeat for remaining 8 combinations  
**If it doesn't**: Check console for errors, verify filenames

---

### Path B: Generate All Narrations Now, Mix Later

```powershell
# Generate all 9 narrations in one go
python generate_narration.py

# Result: 9 raw MP3s
# Then: Mix in DAW when you have time (2-3 hours each)
```

---

### Path C: Use TTS Fallback (Current State)

**No action needed** - App already works with Web Speech API  
Stems are **optional upgrade** for cinematic quality

---

## 📁 FILE STRUCTURE OVERVIEW

```
frontend/
├── assets/audio/CINEMATIC_AUDIO/
│   ├── README.md                      ← Stem placement guide
│   ├── journey_calm_narration.mp3     ← YOU CREATE THESE (27 total)
│   ├── journey_calm_ambient.mp3
│   ├── journey_calm_sfx.mp3
│   ├── journey_confident_narration.mp3
│   └── ... (24 more files)
│
├── script.js                          ← UPDATED (stem detection + playback)
├── generate_narration.py              ← ElevenLabs automation
├── narration_requirements.txt         ← Python dependencies
├── AUDIO_PRODUCTION_SPECS.md          ← Master reference
├── DAW_MIXING_GUIDE.md                ← Step-by-step workflow
└── .env                               ← CREATE THIS (ELEVENLABS_API_KEY=...)
```

---

## ✅ WHAT'S READY NOW

- ✅ Code updated to use stems (with TTS fallback)
- ✅ Folder structure created
- ✅ ElevenLabs automation script ready
- ✅ Complete production documentation
- ✅ Step-by-step mixing guide

---

## ⏳ WHAT YOU NEED TO DO

### Minimum Viable Product (MVP):
1. Create `.env` file with ElevenLabs API key
2. Run: `python generate_narration.py`
3. Wait ~30 minutes for 9 narrations to generate
4. **Test**: Open app, stems will play (no ambient/SFX yet, but narration is cinematic)

### Full Cinematic Experience:
1. Generate narrations (above)
2. Open DAW (Reaper/Audition/Logic)
3. Follow `DAW_MIXING_GUIDE.md` for each world/mood
4. Export ambient + SFX stems
5. Place all 27 files in `CINEMATIC_AUDIO/`
6. **Result**: Movie-quality dream experience

---

## 💰 COST BREAKDOWN

### Free Tier (Minimum)
- Reaper DAW: $60 (or use free trial)
- Free plugins: $0
- ElevenLabs free tier: 10k chars/month ($0)
- Sound libraries (Freesound): $0
- **Total**: $60 one-time

### Premium Tier (Recommended)
- DAW: $60-200
- ElevenLabs Pro: $5-22/mo
- Splice sounds: $8/mo
- Premium plugins (optional): $0-500
- **Total**: $100-300 + $10/mo

### Professional Tier
- Hire producer: $500-2000
- Professional voice actor: $100-300/script
- **Total**: $1500-5000 (done for you)

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Decide Your Path**:
   - [ ] DIY with ElevenLabs + DAW (cheapest, most control)
   - [ ] Hire producer (fastest, most expensive)
   - [ ] Hybrid (generate narrations, hire for mixing)

2. **If DIY**: 
   - [ ] Get ElevenLabs API key
   - [ ] Install Python dependencies: `pip install -r narration_requirements.txt`
   - [ ] Create `.env` file with API key
   - [ ] Run: `python generate_narration.py --dry-run` (test first)
   - [ ] Run: `python generate_narration.py` (generate all)

3. **If Hiring**:
   - [ ] Post job on Fiverr/Upwork
   - [ ] Share `AUDIO_PRODUCTION_SPECS.md` with producer
   - [ ] Request quote for 27 stems

4. **Test Current System**:
   - [ ] Open `frontend/index.html`
   - [ ] Select any world/mood
   - [ ] Click "Begin Dream"
   - [ ] Verify TTS fallback works (you'll hear browser voice)
   - [ ] Check console: "🎙️ Fallback to TTS (stems not found)"

---

## 📞 TROUBLESHOOTING

### "Stems not loading"
- Check filenames match exactly: `journey_calm_narration.mp3`
- Verify files in: `frontend/assets/audio/CINEMATIC_AUDIO/`
- Check browser console for 404 errors

### "ElevenLabs script fails"
- Verify API key in `.env` file
- Check free tier limit (10k chars/month)
- Run with `--dry-run` first to estimate costs

### "Ambient doesn't loop smoothly"
- Find exact loop point in DAW (zero-crossing)
- Use crossfade (50-100ms) at loop boundary
- Test 5+ loops before exporting

---

## 🎬 FINAL NOTES

**What I Can't Do**:
- I cannot run DAW software
- I cannot generate audio files directly
- I cannot access ElevenLabs API for you

**What You Have Now**:
- ✅ Complete production pipeline
- ✅ Automation scripts ready to run
- ✅ Step-by-step guides
- ✅ Code integration done
- ✅ Folder structure created

**Your Job**: Follow the guides and create the actual audio files

**Estimated Total Time**:
- Narration generation: 30-60 min (automated)
- DAW mixing: 20-30 hours for all 9 (or hire it out)

---

**You're ready to produce movie-quality audio!** 🎬✨

Start with **Path A** (one experience) to test the system, then scale up.
