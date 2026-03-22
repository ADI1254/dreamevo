# Quick Start: Generate THE CLEARING Narration with Azure TTS

## Prerequisites

1. **Azure Account** with Speech Services
   - Get free trial: https://azure.microsoft.com/free/
   - Or use existing subscription

2. **Python 3.8+** installed
   ```powershell
   python --version
   ```

3. **Install Azure Speech SDK**
   ```powershell
   cd backend
   pip install azure-cognitiveservices-speech
   ```

---

## Step 1: Get Azure Credentials

### Option A: Azure Portal (Recommended)
1. Go to https://portal.azure.com
2. Search for **"Speech Services"**
3. Click **"Create"**
4. Fill in:
   - **Resource Group**: Create new (e.g., "dreampulse-tts")
   - **Region**: Choose closest (e.g., "East US")
   - **Pricing**: Free (F0) or Standard (S0)
5. Click **"Review + Create"** → **"Create"**
6. After deployment, go to resource → **"Keys and Endpoint"**
7. Copy:
   - **KEY 1** (your API key)
   - **LOCATION/REGION** (e.g., "eastus")

### Option B: Azure CLI (Fast)
```powershell
# Login
az login

# Create resource group
az group create --name dreampulse-tts --location eastus

# Create speech service
az cognitiveservices account create `
    --name dreampulse-speech `
    --resource-group dreampulse-tts `
    --kind SpeechServices `
    --sku F0 `
    --location eastus

# Get key
az cognitiveservices account keys list `
    --name dreampulse-speech `
    --resource-group dreampulse-tts
```

---

## Step 2: Configure Credentials

### Option A: Environment Variables (Recommended)
**PowerShell:**
```powershell
$env:AZURE_SPEECH_KEY = "your_key_from_step_1"
$env:AZURE_REGION = "eastus"
```

**Check it worked:**
```powershell
echo $env:AZURE_SPEECH_KEY
echo $env:AZURE_REGION
```

### Option B: Edit Script Directly
Open `backend/generate_clearing_azure.py` and edit lines 17-18:
```python
AZURE_SPEECH_KEY = "paste_your_actual_key_here"
AZURE_REGION = "eastus"  # or your region
```

---

## Step 3: Generate Narration

### Option 1: Multi-Character Stems (Recommended)
**For professional DAW mixing with all characters**

```powershell
cd backend
python generate_clearing_azure.py
```

When prompted, enter **1**

**Output:**
- `clearing_stems/segment_000_narrator.mp3`
- `clearing_stems/segment_001_you.mp3`
- `clearing_stems/segment_002_older_woman.mp3`
- ... (all dialogue segments)

**Total segments:** ~50-80 files
**Total duration:** ~18-22 minutes

### Option 2: Narrator-Only (Simpler)
**For quick integration, single file**

```powershell
cd backend
python generate_clearing_azure.py
```

When prompted, enter **2**

**Output:**
- `frontend/assets/audio/CINEMATIC_AUDIO/the_clearing_narrator_only.mp3`

**Duration:** ~12-15 minutes (narrator only, no character dialogue)

---

## Step 4: Verify Output

### Check Files
**Multi-character:**
```powershell
ls frontend\assets\audio\CINEMATIC_AUDIO\clearing_stems\
```

**Narrator-only:**
```powershell
ls frontend\assets\audio\CINEMATIC_AUDIO\the_clearing_narrator_only.mp3
```

### Test Audio Quality
1. Open any `.mp3` file in media player
2. Listen for:
   - ✅ Slow, contemplative pacing (not rushed)
   - ✅ Natural pauses between thoughts
   - ✅ Warm, intimate voice quality
   - ✅ No robotic rhythm or harsh sounds

If it sounds too fast or robotic, see [Troubleshooting](#troubleshooting) below.

---

## Step 5: Mix in DAW (Multi-Character Only)

### Import Segments
1. Open **Audacity** (free) or **Reaper** (pro)
2. **File → Import → Audio**
3. Select all `clearing_stems/segment_*.mp3` files
4. They'll import as separate tracks in chronological order

### Arrange Timeline
- Segments are numbered in story order
- Align them end-to-end (no gaps unless intentional)
- Total timeline: ~18-22 minutes

### Add SFX Layers (Per Script)
Create new tracks for:

**Act I (0-6 min):**
- City ambient (distant sirens, traffic)
- Car interior (engine, road markings)
- Highway sounds (wind, distant traffic)
- Rest stop (gravel, wind through trees)

**Act II (6-14 min):**
- Forest layers (wind, water, birds, insects)
- Stream sounds (water over rocks)
- Storm sequence (rain, thunder, wind)
- Alpine wind (open, vast space)

**Act III (14-20 min):**
- Clearing ambience (balanced, spacious)
- Theta wave layer (4-8Hz binaural beat, subtle)
- Final walk (forest + civilization blend)
- Silence (profound, complete)

### Duck Background During Dialogue
1. Select ambient/SFX tracks
2. Use **Auto Duck** or **Volume Envelope**
3. When dialogue plays, reduce to **-12dB** (15% volume)
4. Fade back up during pauses

### Export Master
**Settings:**
- **Format**: WAV
- **Sample Rate**: 48000 Hz
- **Bit Depth**: 24-bit
- **Channels**: Stereo (after binaural processing)
- **Filename**: `the_clearing_master.wav`

### Convert to Web MP3
**Audacity:**
1. **File → Export → Export Audio**
2. **Format**: MP3
3. **Quality**: 256-320 kbps (Variable)
4. **Filename**: `the_clearing_narration.mp3`
5. **Save to**: `frontend/assets/audio/CINEMATIC_AUDIO/`

**FFmpeg (command line):**
```powershell
ffmpeg -i the_clearing_master.wav -b:a 320k the_clearing_narration.mp3
```

---

## Step 6: Integrate with Frontend

### Update script.js
Open `frontend/script.js` and add to `STEM_CONFIG`:

```javascript
STEM_CONFIG = {
    enabled: true,
    basePath: 'assets/audio/CINEMATIC_AUDIO',
    format: 'mp3',
    stems: {
        // ... existing stems ...
        
        clearing_calm: {
            ambient: 'clearing_calm_ambient.mp3',    // Create this
            narration: 'the_clearing_narration.mp3', // Your generated file
            sfx: 'clearing_calm_sfx.mp3'             // Create this
        }
    }
};
```

### Create Additional Stems
You still need:
1. **clearing_calm_ambient.mp3**: Background theta waves, subtle nature sounds
2. **clearing_calm_sfx.mp3**: All SFX moments from the script

### Test in Browser
1. Start frontend server:
   ```powershell
   cd frontend
   python server.py
   ```

2. Open http://localhost:3000

3. Select **"Clearing"** world + **"Calm"** mood

4. Check browser console:
   ```
   ✓ Loaded narration stem: the_clearing_narration.mp3
   ✓ Loaded ambient stem: clearing_calm_ambient.mp3
   ✓ Loaded SFX stem: clearing_calm_sfx.mp3
   🎭 Using STEMS mode (cinematic)
   ```

5. Click **"Begin Journey"** → should play stems sequentially

---

## Troubleshooting

### ❌ "Speech synthesis canceled: Error"
**Cause:** Invalid Azure credentials

**Fix:**
```powershell
# Check env vars
echo $env:AZURE_SPEECH_KEY
echo $env:AZURE_REGION

# Re-set if missing
$env:AZURE_SPEECH_KEY = "your_key_here"
$env:AZURE_REGION = "eastus"
```

### ❌ Voice sounds too fast/robotic
**Cause:** Default rate too high

**Fix:** Edit `generate_clearing_azure.py`, line ~74:
```python
"NARRATOR": {
    "rate": "0.70",  # Changed from 0.80 — even slower
    ...
}
```

### ❌ No pauses between thoughts
**Cause:** Script parser removing pause markers

**Fix:** Check that `the_clearing.txt` has proper markers:
- `...` → converted to 1.5s pause
- `(pause)` → 1.0s pause
- `(brief silence)` → 2.0s pause

### ❌ Harsh "s" sounds (sibilance)
**Cause:** Azure TTS emphasis on consonants

**Fix:** Apply **De-Esser** in DAW:
- Frequency: 6-8kHz
- Reduction: -3 to -6dB

### ❌ Segments out of order
**Cause:** Improper import in DAW

**Fix:** 
- Files are named `segment_000_...`, `segment_001_...`, etc.
- Import in numerical order
- Or use DAW's "Sort by name" feature

### ❌ File not found errors
**Cause:** Script can't locate `the_clearing.txt`

**Fix:**
```powershell
# Check file exists
ls backend\stories\the_clearing.txt

# Run from correct directory
cd backend
python generate_clearing_azure.py
```

---

## Cost Estimate

### Azure Speech (Standard S0 Tier)
- **Pricing**: $16 per 1 million characters
- **THE CLEARING script**: ~60,000 characters
- **Cost**: $0.96 (less than $1)

### Azure Speech (Free F0 Tier)
- **Free quota**: 500,000 characters/month
- **THE CLEARING**: Uses ~12% of monthly free quota
- **Cost**: $0

**Recommendation:** Start with Free tier for testing, upgrade to Standard if generating multiple stories.

---

## Expected Timeline

| Task | Time |
|------|------|
| Azure account setup | 5-10 min |
| Install dependencies | 2 min |
| Configure credentials | 2 min |
| Generate multi-character stems | 10-15 min |
| Import to DAW | 5 min |
| Add SFX layers | 30-60 min |
| Mixing & ducking | 20-30 min |
| Export master + MP3 | 5 min |
| Test in frontend | 5 min |
| **Total** | **1.5-2.5 hours** |

---

## Next Steps After Generation

1. ✅ **Multi-character stems**: Mix in DAW with SFX
2. ✅ **Create ambient stem**: Theta waves + subtle nature
3. ✅ **Create SFX stem**: Act I/II/III sound effects
4. ✅ **Export final MP3**: `the_clearing_narration.mp3`
5. ✅ **Update frontend**: Add to STEM_CONFIG
6. ✅ **Test playback**: Verify stems load and play correctly

---

## Advanced: Batch Generate All Stories

To generate multiple stories at once, create `batch_generate.py`:

```python
import subprocess

stories = [
    "the_clearing",
    "the_crossing",
    "the_convergence"
]

for story in stories:
    print(f"\n{'='*70}")
    print(f"Generating: {story}")
    print('='*70)
    
    subprocess.run([
        "python", 
        "generate_clearing_azure.py",
        "--story", story,
        "--mode", "multi"
    ])
```

---

## Support Resources

- **Azure Speech Docs**: https://learn.microsoft.com/azure/cognitive-services/speech-service/
- **SSML Reference**: https://learn.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup
- **Audacity Manual**: https://manual.audacityteam.org/
- **FFmpeg Guide**: https://ffmpeg.org/documentation.html

---

**THE CLEARING** © 2026 | Azure TTS Quick Start Guide
Ready to generate cinematic narration in < 30 minutes
