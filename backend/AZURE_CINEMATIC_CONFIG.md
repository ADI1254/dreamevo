# Azure TTS Cinematic Configuration for THE CLEARING

## Achieving Human-Like Narration (Not Robotic)

### Voice Selection Strategy

**Primary Narrator: Ava (en-US-AvaMultilingualNeural)**
- Warm, intimate female voice (40s-50s feel)
- Best for contemplative, grounded narration
- Multilingual neural model = more natural prosody
- Alternative: `en-US-JennyMultilingualNeural` (slightly warmer)

**Supporting Characters:**
- **Marcus** (weathered male): `en-US-AndrewMultilingualNeural` or `en-US-GuyNeural`
- **Elena** (younger female): `en-US-EmmaMultilingualNeural`
- **Ron** (elderly reflective): `en-US-GuyNeural` with slower rate
- **Older Woman**: `en-US-JennyNeural`

---

## Critical Settings for Human Feel

### 1. Speech Rate (Most Important)
```xml
<prosody rate="0.75-0.85">
```
- **Narrator**: 0.80 (80 words/min) — very slow, contemplative
- **Vulnerable moments** (YOU): 0.75 — even slower
- **Default Azure**: 1.0 (too fast, robotic)
- **Never exceed**: 0.90 for this story

**Why it matters**: Slow pacing allows natural pauses, breath, and reflection. Fast TTS = informational robotic lecture. Slow TTS = human storytelling.

### 2. Pauses & Silence (Second Most Important)
```xml
<break time="1500ms"/>  <!-- For "..." -->
<break time="1000ms"/>  <!-- For "(pause)" -->
<break time="2000ms"/>  <!-- For "(brief silence)" -->
```
- Strategic silence makes narration breathe
- Allows listener time to visualize scenes
- Creates dramatic tension
- **Robotic TTS**: No pauses or only grammatical pauses
- **Human TTS**: Intentional silences for emotional resonance

### 3. Expression Styles
```xml
<mstts:express-as style="calm" styledegree="1.5">
```
Available styles for neural voices:
- `calm` — grounded, relaxed (use for most of this story)
- `gentle` — soft, warm (use for intimate moments)
- `sad` — reflective (Act III emotional beats)
- `hopeful` — optimistic (final scenes)

**Style Degree**:
- `1.0` = default
- `1.5` = enhanced emotion (recommended for cinematic)
- `2.0` = very strong (use sparingly)

### 4. Pitch Variation (Character Differentiation)
```xml
<prosody pitch="-10%">  <!-- Deeper, weathered -->
<prosody pitch="+5%">   <!-- Younger, energetic -->
```
- **Marcus/Ron**: -8% to -10% (older, deeper)
- **Elena**: +5% (younger, energetic)
- **Narrator**: 0% (neutral baseline)

### 5. Volume Dynamics
```xml
<prosody volume="soft">     <!-- Intimate moments -->
<prosody volume="default">  <!-- Normal narration -->
```
- Use `soft` for journal readings, vulnerable dialogue
- Use `default` for main narration
- **Never use `loud`** — this is a quiet, intimate story

---

## SSML Best Practices for Cinematic Quality

### Natural Pause Patterns
```xml
<!-- Short breath -->
You walk to the parking lot.<break time="500ms"/> Your car is waiting.

<!-- Emotional pause -->
You've driven for hours.<break time="1000ms"/> The city is now a smudge in the mirror.

<!-- Profound silence (letting it sink in) -->
She leaves. And you stay.<break time="2000ms"/> Three hours.
```

### Emphasis for Emotion
```xml
<emphasis level="strong">really</emphasis> seeing you
<emphasis level="moderate">transforms</emphasis>
```
- Use sparingly (1-2 per paragraph max)
- Mark emotional revelations only

### Prosody Layering
```xml
<prosody rate="0.75" pitch="-5%" volume="soft">
    <mstts:express-as style="gentle" styledegree="1.5">
        (quietly, honestly) I am.
    </mstts:express-as>
</prosody>
```
- Combine rate + pitch + volume + style for maximum human feel

---

## Audio Quality Settings

### Azure Output Format
```python
speech_config.set_speech_synthesis_output_format(
    speechsdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3
)
```
- **48kHz** sample rate (broadcast quality)
- **192kbps** MP3 (high clarity)
- Mono channel (Azure doesn't support stereo TTS natively)

### Post-Processing for Cinematic Sound

**In DAW (Audacity/Reaper):**
1. **EQ**:
   - Cut: Below 80Hz (rumble removal)
   - Boost: 200-500Hz (warmth, body)
   - Boost: 3-5kHz (clarity, presence)
   - Cut: Above 12kHz (harshness)

2. **Compression** (gentle):
   - Ratio: 2:1
   - Threshold: -18dB
   - Attack: 10ms
   - Release: 100ms
   - Makes volume consistent without sounding crushed

3. **Reverb** (subtle room):
   - Room size: Small (10-15%)
   - Wet/Dry: 10-15% wet
   - Pre-delay: 15-20ms
   - Creates "closeness" without echo

4. **De-Esser**:
   - Reduce sibilance (harsh "s" sounds)
   - Threshold: -25dB
   - Frequency: 6-8kHz

5. **Normalize**:
   - Peak: -3dB (leaves headroom for mixing with SFX)

---

## Character Voice Configuration

### NARRATOR (Ava)
```python
{
    "rate": "0.80",      # 80 WPM — contemplative
    "pitch": "0%",       # Natural baseline
    "volume": "default", # Clear but not loud
    "style": "calm"      # Grounded, reflective
}
```

### YOU (Ava, modified)
```python
{
    "rate": "0.75",      # Even slower — vulnerable
    "pitch": "-5%",      # Slightly lower — intimate
    "volume": "soft",    # Quiet honesty
    "style": "gentle"    # Warm, close
}
```

### MARCUS (Andrew/Guy)
```python
{
    "rate": "0.85",      # Measured, few words
    "pitch": "-10%",     # Weathered, deeper
    "volume": "default",
    "style": "calm"      # Wisdom, not lecture
}
```

### ELENA (Emma)
```python
{
    "rate": "0.85",      # Energetic but controlled
    "pitch": "+5%",      # Younger voice
    "volume": "default",
    "style": "friendly"  # Warm, seeing you
}
```

### RON (Guy)
```python
{
    "rate": "0.78",      # Very slow — reflective elder
    "pitch": "-8%",      # Aged, deep
    "volume": "default",
    "style": "calm"      # End of a long journey
}
```

---

## Avoiding Robotic TTS (Checklist)

### ❌ What Makes TTS Sound Robotic:
- Rate ≥ 1.0 (too fast)
- No pauses between thoughts
- Uniform volume throughout
- No emotional expression
- Perfect pronunciation (ironically sounds fake)
- No breath sounds
- Monotone pitch

### ✅ What Makes TTS Sound Human:
- Rate ≤ 0.85 (allows natural rhythm)
- Strategic pauses (500ms-2000ms)
- Volume variation (soft for intimate, default for clarity)
- Expression styles matched to emotion
- Slight pitch variation per character
- Imperfect timing (SSML breaks create this)
- Layered prosody (rate + pitch + volume + style together)

---

## Generation Workflow

### Option 1: Multi-Character Stems (Recommended)
**For cinematic mixing in DAW**

1. Run script:
   ```bash
   python generate_clearing_azure.py
   ```
   Choose option `1` (multi-character stems)

2. Output: `clearing_stems/segment_000_narrator.mp3`, `segment_001_you.mp3`, etc.

3. Import all segments into DAW in order

4. Add SFX layers per script markers:
   - Act I: City → car → highway → rest stop
   - Act II: Forest → stream → cabin storm → alpine wind
   - Act III: Clearing → final walk → silence

5. Add theta wave layer (4-8Hz binaural, subtle)

6. Duck ambient to -12dB when dialogue plays

7. Export as `the_clearing_master.wav` (48kHz/24-bit)

8. Convert to `the_clearing_narration.mp3` (256-320kbps)

### Option 2: Narrator-Only (Simpler)
**For quick integration, dialogue added later**

1. Run script, choose option `2`

2. Output: `the_clearing_narrator_only.mp3`

3. Mix with ambient/SFX in separate layers

4. Add character dialogue via separate TTS or voice actors

---

## Azure Subscription Setup

### 1. Get Azure Speech Key
1. Go to [Azure Portal](https://portal.azure.com)
2. Create **Speech Service** resource
3. Copy **Key** and **Region** (e.g., `eastus`)

### 2. Set Environment Variables
**Windows (PowerShell):**
```powershell
$env:AZURE_SPEECH_KEY = "your_key_here"
$env:AZURE_REGION = "eastus"
```

**Or edit script directly:**
```python
AZURE_SPEECH_KEY = "your_actual_key_here"
AZURE_REGION = "eastus"
```

### 3. Install Dependencies
```bash
pip install azure-cognitiveservices-speech
```

---

## Expected Output Quality

### File Specs:
- **Sample Rate**: 48kHz
- **Bitrate**: 192kbps MP3
- **Format**: Mono (stereo spatialization added in DAW)
- **Duration**: ~18-22 minutes (depending on pauses)

### Listening Test:
- Voice should sound close, intimate (like in your ear)
- Pauses should feel natural, not awkward
- Characters should be distinguishable by voice
- Emotion should be subtle but present
- No harsh "s" sounds, clipping, or robotic rhythm

### If It Still Sounds Robotic:
1. **Slow down more**: Try rate="0.70" for narrator
2. **Add more pauses**: Use 2000ms breaks more liberally
3. **Increase style degree**: Try styledegree="2.0"
4. **Post-process with reverb**: Adds human "room presence"
5. **Layer with ambient breathing**: Subtle inhale/exhale SFX

---

## Comparison: Azure vs ElevenLabs

| Feature | Azure (Ava) | ElevenLabs |
|---------|-------------|------------|
| **Naturalness** | Very good with SSML tuning | Excellent out-of-box |
| **Control** | High (SSML, prosody, styles) | Moderate (stability slider) |
| **Cost** | Pay-per-character (~$16/1M chars) | Subscription ($5-$99/mo) |
| **Quality** | 48kHz/192kbps | 44.1kHz/128kbps |
| **Emotion** | Style tags (calm, gentle, sad) | Voice cloning + slider |
| **Setup** | Requires Azure account | Web UI, simpler |
| **Best For** | Fine control, multi-character | Quick high-quality narration |

**For THE CLEARING**: Azure is ideal because:
- Multiple characters with distinct voices
- Precise SSML control for pauses and pacing
- High-quality output for professional mixing
- Cost-effective for 20-minute multi-character script

---

## Troubleshooting

### "Speech synthesis canceled: Error"
- **Check**: Azure key and region are correct
- **Check**: Internet connection active
- **Check**: Text length < 10 minutes per segment (Azure limit)

### Voice sounds too fast
- Lower `rate` value (try 0.70 instead of 0.80)
- Add more `<break time="..."/>` tags

### Voice sounds monotone
- Increase `styledegree` to 2.0
- Use different expression styles per act:
  - Act I: `style="curious"`
  - Act II: `style="calm"`
  - Act III: `style="hopeful"`

### Harsh sibilance (sharp "s" sounds)
- Post-process with de-esser in DAW
- Target 6-8kHz frequency range
- Reduce by 3-6dB when detected

### Characters sound too similar
- Increase pitch variation:
  - Male characters: -10% to -15%
  - Female younger: +5% to +10%
- Use different voices from VOICES dict
- Vary speaking rate per character

---

## Final Export Settings

### Master WAV (For DAW Mixing):
- **Format**: WAV
- **Sample Rate**: 48kHz
- **Bit Depth**: 24-bit
- **Channels**: Stereo (after binaural processing)

### Web MP3 (For Frontend):
- **Format**: MP3
- **Sample Rate**: 48kHz
- **Bitrate**: 256-320kbps (VBR)
- **Channels**: Stereo
- **Filename**: `the_clearing_narration.mp3`
- **Location**: `frontend/assets/audio/CINEMATIC_AUDIO/`

---

## Integration with Stem System

Once `the_clearing_narration.mp3` is ready:

1. Place in `frontend/assets/audio/CINEMATIC_AUDIO/`

2. Update `script.js` STEM_CONFIG:
   ```javascript
   STEM_CONFIG = {
       enabled: true,
       basePath: 'assets/audio/CINEMATIC_AUDIO',
       format: 'mp3',
       stems: {
           clearing_calm: {
               ambient: 'clearing_calm_ambient.mp3',
               narration: 'the_clearing_narration.mp3',
               sfx: 'clearing_calm_sfx.mp3'  // Create this in DAW
           }
       }
   }
   ```

3. Create SFX stem per production notes in `the_clearing.txt`:
   - Act I: City → car → highway → rest stop
   - Act II: Forest → water → storm → alpine
   - Act III: Clearing → final walk → silence

4. Test stem playback in browser console:
   ```javascript
   attemptStemPlayback('clearing', 'calm')
   ```

---

## Next Steps After Generation

1. ✅ Run `python generate_clearing_azure.py`
2. ✅ Choose option 1 (multi-character stems)
3. ✅ Import segments into DAW (Audacity, Reaper, etc.)
4. ✅ Arrange in chronological order
5. ✅ Add SFX layers per script markers
6. ✅ Add theta wave binaural layer (4-8Hz)
7. ✅ Apply binaural spatial positioning for characters
8. ✅ Duck ambient/SFX to -12dB during dialogue
9. ✅ EQ, compress, normalize narration track
10. ✅ Export master WAV (48kHz/24-bit stereo)
11. ✅ Convert to web MP3 (256-320kbps)
12. ✅ Place `the_clearing_narration.mp3` in CINEMATIC_AUDIO folder
13. ✅ Update `script.js` stem config
14. ✅ Test in browser

---

**THE CLEARING** © 2026 | Azure TTS Configuration Guide
Cinematic | Human-Like | Transformative
