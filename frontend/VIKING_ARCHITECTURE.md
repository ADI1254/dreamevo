# 🎬 Viking Sea Audio System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   VIDEO PLAYBACK (MP4)                          │
│              (viking_sea.mp4 - Timeline Control)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    Tracks Progress
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          SCENE SYNC ENGINE (Video Time → Audio Scenes)          │
│                                                                  │
│  0s   → Scene: "opening"      15s → Scene: "voyageBegins"      │
│  40s  → Scene: "seaAdventure" 90s → Scene: "stormApproach"    │
│  135s → Scene: "battleReady"  180s → Scene: "triumph"         │
│  220s → Scene: "ending"                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
          Triggers Audio Scene Changes
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐    ┌────────┐    ┌─────────────┐
    │Orchestr │    │SFX     │    │Narration    │
    │(40%)   │    │(20-35%)│    │Schedule    │
    └────────┘    └────────┘    └─────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
          ┌──────────────────────────┐
          │  AUDIO LAYER MIXER       │
          │  ─────────────────────   │
          │  Combines 4 tracks       │
          │  Applies ducking logic   │
          └──────────────────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │   SPEAKER OUTPUT   │
              │   (User Hears)     │
              └────────────────────┘
```

---

## Audio Layering Detail

```
TIMELINE: ═══════════════════════════════════════════════════════
          Opening → Voyage → Adventure → Storm → Battle → Victory → End

LAYER 1 - ORCHESTRAL SCORE
═════════════════════════════════════════════════════════════════
[Theme 1]──────────[Theme 2]──────────[Theme 3]───[Theme 4]─────
(40% vol)  (ducks to 15% for voice)    (40% vol)
            ↓Narration↓

LAYER 2 - CINEMATIC SFX (Staggered Timing)
═════════════════════════════════════════════════════════════════
[Ship]─[Sails]────[Waves]───[Wind]────[Thunder]─[Swords][Horns]
 (0s)   (2s)       (5s)      (10s)     (92s)     (137s)

LAYER 3 - VOICE NARRATION (Always Clear)
═════════════════════════════════════════════════════════════════
          🎙️[Voice: "A Viking stands..."]
          🎙️[Voice: "The crew prepares..."]
          🎙️[Voice: "Dark clouds gather..."]

LAYER 4 - AMBIENT PADS (Emotional Sustenance)
═════════════════════════════════════════════════════════════════
[Ocean Pad]───────[Sea Pad]──────[Storm Pad]─[Adrenaline]──[Victory]
(20% vol, loops continuously)
```

---

## Volume Ducking in Action

```
SCENARIO: Narration starts at 18 seconds

BEFORE (0-18s):
Orchestra: ──────────────────╖ 40%
SFX:       ────────────────────● 25%
Voice:     (silent)
Result:    ▄▄▄▄▄▄▄▄▄▄ Clear orchestral layer

DURING (18-25s, Narration Speaking):
Orchestra: ──────────╔╍╍╍╍╍╍╍╍╖ 15% (DUCKED)
           ◄─ Smoothly  reduced ─►
SFX:       ────●●●●●●●●●●●●●  15% (Background)
Voice:     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ 95% (PROMINENT)
Result:    ▓▓▓▓ Crystal Clear Voice ▓▓▓▓

AFTER (25s+, Narration Ends):
Orchestra: ─────────╔════════╖ 40% (RESTORED)
           ◄─ Smoothly  restored ─►
SFX:       ────────────────────● 25%
Voice:     (silent)
Result:    ▄▄▄▄▄▄▄▄▄▄ Orchestra returns
```

---

## Scene Architecture Example: "Battle Ready"

```
┌─────────────────────────────────────────────┐
│ SCENE CONFIG: Battle Ready (135-180s)       │
├─────────────────────────────────────────────┤
│                                              │
│ 🎼 Orchestral:                              │
│    File: viking_battle_drums.mp3            │
│    Volume: 40%                              │
│    Intensity: 0.95 (Very intense)           │
│    Loop: Yes                                │
│                                              │
│ 🌊 SFX Layers (Staggered):                  │
│    ├─ drums_war.mp3        @ 0s, Vol 40%   │
│    ├─ swords_clash.mp3     @ 3s, Vol 30%   │
│    └─ horn_battle_call.mp3 @ 1s, Vol 35%   │
│                                              │
│ 🎙️ Narration Cue:                           │
│    Text: "They appear on the horizon...    │
│            Enemies. The warrior draws...    │
│            This is his moment."             │
│    Timing: Auto-starts @ 137s               │
│    Voice: Deep, authoritative               │
│    Pacing: 0.75 (Slower, dramatic)          │
│                                              │
│ 🎙️ Ambient Pad:                             │
│    File: adrenaline_pad.mp3                 │
│    Volume: 20%                              │
│    Purpose: Heart-pounding tension         │
│                                              │
└─────────────────────────────────────────────┘

ACTUAL PLAYBACK:
┌─ Start (135s) ─────────────────────────────┐
│ Orchestra starts @ 0.4 vol (intense drums) │
│ SFX load and prepare                        │
│ Ambient pad begins looping (20%)            │
└──────────────────────────────────────────────┘

┌─ Early narration (137s) ──────────────────┐
│ Voice narration begins                     │
│ DUCKING TRIGGERED:                         │
│   Orchestra: 0.4 → 0.15 (300ms fade)      │
│   SFX: continue (25-35%)                   │
│   Voice: FULL VOLUME (0.95)                │
│ ✅ Narration crystal clear!                │
└──────────────────────────────────────────────┘

┌─ End narration (150s) ─────────────────────┐
│ Voice narration ends                       │
│ DUCKING RELEASED:                          │
│   Orchestra: 0.15 → 0.4 (500ms restore)   │
│   SFX: continue ambient                    │
│   Voice: silent                            │
│ ✅ Music returns smoothly!                 │
└──────────────────────────────────────────────┘
```

---

## File Dependencies

```
viking_experience.html
├── Loads: viking_audio_system.js
│   ├── Exports: VikingAudioSystem class
│   ├── Manages: All 4 audio layers
│   └── Handles: Volume ducking logic
│
└── Loads: viking_video_experience.js
    ├── Depends: VikingAudioSystem
    ├── Exports: VikingVideoExperience class
    ├── Manages: Video + audio sync
    └── Handles: Scene timeline & narration scheduling

Audio Assets (Auto-loaded):
├── assets/videos/viking_sea.mp4.mp4
│
└── assets/audio/CINEMATIC_AUDIO/
    ├── Orchestral/ (7 themes)
    ├── SFX/ (18 effects)
    └── Ambient/ (7 pads)
```

---

## Narration Scheduling Timeline

```
VIDEO TIMELINE:
0s ────────15s────────40s────────90s────────135s────────180s
│          │         │         │         │         │
│ Opening  │ Voyage  │  Sea    │ Storm   │ Battle  │ Victory
│          │ Begins  │Adventure│Approach │ Ready   │
│          │         │         │         │         │

NARRATION AUTO-SCHEDULE:
0s     +2s delay
│      ↓
│  🎙️ "A Viking warrior stands..."        (2s start time)
│      Duration: ~8 seconds
│      
15s    +3s delay (from scene start)
│      ↓
│  🎙️ "The crew prepares... sails billow" (18s start time)
│      Duration: ~10 seconds
│
40s    +2s delay
│      ↓
│  🎙️ "Hours pass... horizon calls..."    (42s start time)
│      Duration: ~15 seconds
│
90s    +2s delay
│      ↓
│  🎙️ "Dark clouds gather... vast presence" (92s start time)
│      Duration: ~12 seconds
│
135s   +2s delay
│      ↓
│  🎙️ "They appear on the horizon..."      (137s start time)
│      Duration: ~15 seconds
│
180s   +2s delay
│      ↓
│  🎙️ "Victory flows through veins..."     (182s start time)
│      Duration: ~12 seconds
│
220s   +2s delay
│      ↓
│  🎙️ "The journey ends... legend born"    (222s start time)
│      Duration: ~20 seconds
```

---

## Volume Levels Reference

```
Master Volume Dial: 0 ──────────────── 1
                    (Silent)      (Maximum)

Typical Settings:
└─ Quiet Mode (Night):      0.5-0.6
└─ Normal Mode (Recommended): 0.85 ✓
└─ Immersive Mode (Day):      1.0

Individual Layer Volumes:
├─ Orchestra (Normal):        0.40 (40%)
├─ Orchestra (Ducked):        0.15 (15%)
├─ SFX (Individual):          0.20-0.35 (20-35%)
├─ Voice (Narration):         0.95 (95%)
└─ Ambient Pad:               0.20 (20%)

What you hear:
- Orchestral + SFX + Ambient: All playing → Rich, full sound
- Add Voice: Orchestra ducks → Voice crystal clear
- Remove Voice: Orchestra returns → Rich again
```

---

## Performance Metrics

```
Resource Usage:

Video Playback:
├─ Memory: 100-200 MB (depends on format)
├─ CPU: 5-15% (GPU-accelerated)
└─ Bandwidth: Streaming

Audio Layers (4 simultaneous):
├─ Orchestral (looped):      Cached, ~50-100 KB in memory
├─ SFX (multiple):           ~30-50 KB per effect
├─ Voice (streamed):         Generated on-demand
└─ Ambient (looped):         Cached, ~50-100 KB in memory

Total Memory: ~200-400 MB
Total CPU: ~10-20%
Network: Video stream only
```

---

## Browser Audio API Flow

```
┌──────────────────────────────┐
│  VikingAudioSystem           │
├──────────────────────────────┤
│  • Manages Audio() objects   │
│  • Handles timing/queuing    │
│  • Applies volume ducking    │
└──────────┬───────────────────┘
           │
           │ Uses Web Audio API
           ▼
┌──────────────────────────────┐
│  Web Audio Context           │
├──────────────────────────────┤
│  • GainNode (volume control) │
│  • Oscillator (synthesis)    │
│  • Analyser (visualization)  │
└──────────┬───────────────────┘
           │
           │ Routes to
           ▼
┌──────────────────────────────┐
│  System Audio Device         │
├──────────────────────────────┤
│  • Speaker                   │
│  • Headphones                │
│  • Bluetooth Audio           │
└──────────────────────────────┘
```

---

## Error Handling Flow

```
Event: Try to play narration
       │
       ├─ Has ElevenLabs API key?
       │  │
       │  ├─ YES → Try API call
       │  │        │
       │  │        ├─ Success? → Play premium voice ✅
       │  │        │
       │  │        └─ Network error? → Fall back to Web Speech ⚠️
       │  │
       │  └─ NO → Use Web Speech API ✅
       │
       └─ Web Speech API error?
          │
          └─ Log to console, continue with music ⚠️
```

---

## State Machine: Scene Transitions

```
┌─────────────────┐
│   Initializing  │ (Load audio system)
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Scene: Opening │ (0-15s)
├─────────────────┤
│ Orchestra: 0.4  │
│ SFX: 0.2-0.3    │
│ Voice: Ready    │
│ Ambient: 0.2    │
└────────┬────────┘
         │
    Cross-fade (600ms)
         │
         ▼
┌─────────────────────┐
│ Scene: Voyage Begins│ (15-40s)
├─────────────────────┤
│ Orchestral swells   │
│ New SFX layers      │
│ Narration timing    │
│ Momentum building   │
└────────┬────────────┘
         │
    ... (continuing through all scenes) ...
         │
         ▼
┌─────────────────┐
│ Scene: Ending   │ (220-260s)
├─────────────────┤
│ Resolution music│
│ Gentle SFX      │
│ Final narration │
│ Peaceful close  │
└────────┬────────┘
         │
    Fade out (1000ms)
         │
         ▼
┌──────────────────┐
│ Experience End   │
│ Video complete   │
└──────────────────┘
```

---

## Integration Points

```
Your Page:
    │
    ├─ <video id="viking-video">
    │   └─ Plays MP4 file
    │
    ├─ <div id="video-container">
    │   └─ Video inserted here
    │
    └─ JavaScript:
       │
       ├─ new VikingVideoExperience()
       │  └─ Creates instance
       │
       ├─ .initialize()
       │  ├─ Creates video element
       │  ├─ Initializes audio system
       │  └─ Sets up listeners
       │
       ├─ .play(apiKey)
       │  ├─ Starts video
       │  ├─ Starts audio system
       │  └─ Schedules narration
       │
       └─ .getStatus()
          └─ Returns real-time data
```

---

This architecture is **production-ready, scalable, and fully documented**. 🎭✨
