# DreamPulse — Journey Mode · Act 1 Opening
## Cinematic Narration Script + Sound Design Plan (2–3 min)

**Purpose:** Arrival · First emotional hook · Sense of movement · Subtle call forward  
**TTS:** Free tier (browser / Descript / Ava) — calm, slow, breath-aware  
**SFX:** Existing files in `frontend/SOUND EFFECTS/` and `frontend/assets/audio/` only  

---

# 1️⃣ CINEMATIC NARRATION SCRIPT

**Placeholder:** Replace `{USER_NAME}` with the listener’s name at runtime.  
**Pauses:** Honour timings so TTS doesn’t run lines together.  
**SFX cues:** For implementation; do not speak aloud.

---

### BEAT 1 — Threshold (0:00–0:35)

[FOREST AMBIENCE — VERY LOW, FADE IN 8s]

[PAUSE 2s]

{USER_NAME}.

[PAUSE 1s]

The wind moves before you do.

[PAUSE 1.5s]

[WIND SWELL — GENTLE]

You are at the edge of something.

[PAUSE 2s]

Not lost. Not yet. Just … here.

[PAUSE 2s]

---

### BEAT 2 — First step (0:35–1:10)

[FOOTSTEPS ON GRASS — SINGLE STEPS, SPACED]

[PAUSE 1s]

One step.

[PAUSE 1.5s]

Then another.

[PAUSE 1.5s]

The path doesn’t ask where you’re going. It only asks that you move.

[PAUSE 2s]

[MORNING BIRDS — SOFT, DISTANT]

[PAUSE 1s]

{USER_NAME}, the trees have been waiting. Not for a hero. For someone willing to walk.

[PAUSE 2.5s]

---

### BEAT 3 — Breath of the world (1:10–1:50)

[WIND AMBIENCE — MEDIUM-LOW, SUSTAINED]

[PAUSE 1s]

You breathe in.

[PAUSE 1.5s]

You breathe out.

[PAUSE 1.5s]

The air here is different. Older. Quieter.

[PAUSE 2s]

[FOREST AMBIENCE — SLIGHTLY FULLER, STILL LOW]

There is no hurry. There is only this moment. And the next step.

[PAUSE 2.5s]

---

### BEAT 4 — Call forward (1:50–2:30)

[PAUSE 1.5s]

Something ahead is pulling. Not with a hand. With silence.

[PAUSE 2s]

[WATER — VERY DISTANT, FAINT]

[PAUSE 1s]

{USER_NAME}, the journey doesn’t promise an answer. It promises that you will not walk it alone.

[PAUSE 2s]

The path is under your feet. The sky is above. The rest … we find as we go.

[PAUSE 2.5s]

[FOOTSTEPS — TWO OR THREE, THEN FADE]

[PAUSE 2s]

---

### BEAT 5 — Landing (2:30–2:50)

[AMBIENCE HOLDS — THEN VERY SLOW FADE OVER 10s]

You are here.

[PAUSE 1.5s]

You are moving.

[PAUSE 2s]

That is enough.

[LONG PAUSE — 3s]

---

**Total narrated content:** ~2 min 30 s (excluding pause markers; with pauses ~2:50–3:10)

---

# 2️⃣ SOUND DESIGN MAP (TIMELINE)

All paths relative to **frontend** (e.g. from `index.html` or `script.js`).

| Timecode | Sound | Source (existing) | Level | Notes |
|----------|--------|-------------------|--------|--------|
| **0:00–0:08** | Forest ambience | `SOUND EFFECTS/nature-ambience-323729.mp3` | 0.12 | Fade in over 8 s |
| **0:12** | Wind layer | `SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav` | 0.10 | Fade in 4 s, hold |
| **0:35** | Footsteps | `SOUND EFFECTS/mixkit-footsteps-on-tall-grass-532.wav` | 0.15 | Single hits or short bursts, not loop; 3–4 steps |
| **0:58** | Morning birds | `SOUND EFFECTS/mixkit-morning-birds-2472.wav` | 0.12 | Fade in 3 s, distant |
| **1:10** | Wind (sustain) | `SOUND EFFECTS/mixkit-wind-blowing-ambience-2658.wav` | 0.14 | Already in; slight bump or crossfade |
| **1:10–2:30** | Forest bed | `SOUND EFFECTS/spring-forest-nature-332842.mp3` | 0.10 | Optional layer; fade in 5 s, sits under wind |
| **1:58** | Distant water | `SOUND EFFECTS/mixkit-water-flowing-ambience-loop-3126.wav` | 0.06 | Fade in 6 s, very low, “far away” |
| **2:38** | Footsteps (out) | `SOUND EFFECTS/mixkit-footsteps-on-tall-grass-532.wav` | 0.12 | 2–3 steps, then fade out 3 s |
| **2:45–3:00** | All layers | — | — | Slow fade out: ambience last (over ~10 s) |

**Ducking:** When narration is speaking, reduce ambience/wind by ~30–40% (e.g. to 0.07–0.09). Restore over 400–600 ms after line end.

---

# 3️⃣ TTS PERFORMANCE DIRECTIONS

**For the narrator (or TTS config):**

- **Speed:** Slow. ~0.75–0.85× natural pace. No rush.
- **Tone:** Calm, grounded, emotionally restrained. Warm but not sweet. No over-acting.
- **Breath:**  
  - Pause 1–1.5 s at each `[PAUSE 1s]` / `[PAUSE 1.5s]`.  
  - Pause 2–2.5 s at each `[PAUSE 2s]` / `[PAUSE 2.5s]`.  
  - Treat “You breathe in.” / “You breathe out.” as two clear phrases with a full breath between them.
- **Names:** Say `{USER_NAME}` as the actual name. Slight softening on the name, not emphasis.
- **Slowing:**  
  - Slow down on: “You are at the edge of something.” / “Not lost. Not yet. Just … here.”  
  - Slight stretch on: “The rest … we find as we go.” and “That is enough.”
- **Avoid:**  
  - Rising inflection at end of every line.  
  - Melodrama.  
  - Running sentences into each other.  
  - Fast or monotone paragraphs.

**If using SSML (browser TTS / some APIs):**  
Insert `<break time="1s"/>` and `<break time="2s"/>` where [PAUSE 1s] and [PAUSE 2s] appear. Use `<prosody rate="slow">` for the “breathe in / breathe out” and “That is enough” lines if needed.

---

# 4️⃣ FILE STRUCTURE SUGGESTION

Keep narration, ambience, transitions, and silence as separate concerns so you can scale to 20-minute experiences and swap stems easily.

```
frontend/
  assets/
    audio/
      narration/
        journey_act1_opening.mp3      # Pre-rendered TTS (when ready)
        journey_act1_opening_tts.txt # This script (for runtime TTS)
      ambience/
        journey_act1_forest.mp3      # nature-ambience or spring-forest (export)
        journey_act1_wind.wav        # mixkit-wind (export or ref)
      transitions/
        journey_act1_in.wav          # 3–5 s fade-in bed for Act 1
        journey_act1_out.wav        # 8–10 s fade-out
      silence/
        (optional) 1–3 s of room tone or very low drone for between beats
```

**For now (no new exports):**  
- **Narration:** Use `journey_act1_opening_tts.txt` (or copy from this doc) and feed to free TTS; replace `{USER_NAME}` before synthesis.  
- **Ambience / SFX:** Reference existing files in `SOUND EFFECTS/` by path in your `soundMap` or timeline (see Section 2).  
- **Transitions:** Use fades in your app (e.g. in `script.js`) rather than new files, until you add dedicated transition stems.

**Scaling to 20 min:**  
- Add `journey_act2_*.txt` and `journey_act3_*.txt` with the same structure (beats, pauses, SFX cues).  
- Reuse the same `ambience/` and `transitions/` naming pattern (e.g. `journey_act2_forest.mp3`).  
- Keep one sound design map per act (like the table in Section 2) so implementation stays clear.

---

**Summary:**  
- **Script:** Second-person, `{USER_NAME}`, short lines, pause markers, SFX cues.  
- **Sound:** Existing forest, wind, footsteps, birds, water; levels low; duck under narration.  
- **TTS:** Slow, calm, breath-aware; honour pauses; no over-acting.  
- **Files:** Narration vs ambience vs transitions vs silence; same pattern for later acts.

Use this as the master for Journey Act 1 opening; expand Acts 2–3 in the same format when you’re ready.

---

# APPENDIX: TTS-READY SCRIPT (COPY-PASTE)

Replace `{USER_NAME}` with the listener’s name before synthesis.  
If your TTS supports breaks, map `[PAUSE 1s]` → 1 s, `[PAUSE 2s]` → 2 s, etc.  
If not, insert silence or a new audio clip between lines where pauses are marked.

```
[PAUSE 2s]
{USER_NAME}.
[PAUSE 1s]
The wind moves before you do.
[PAUSE 1.5s]
You are at the edge of something.
[PAUSE 2s]
Not lost. Not yet. Just … here.
[PAUSE 2s]
[PAUSE 1s]
One step.
[PAUSE 1.5s]
Then another.
[PAUSE 1.5s]
The path doesn't ask where you're going. It only asks that you move.
[PAUSE 2s]
[PAUSE 1s]
{USER_NAME}, the trees have been waiting. Not for a hero. For someone willing to walk.
[PAUSE 2.5s]
[PAUSE 1s]
You breathe in.
[PAUSE 1.5s]
You breathe out.
[PAUSE 1.5s]
The air here is different. Older. Quieter.
[PAUSE 2s]
There is no hurry. There is only this moment. And the next step.
[PAUSE 2.5s]
[PAUSE 1.5s]
Something ahead is pulling. Not with a hand. With silence.
[PAUSE 2s]
[PAUSE 1s]
{USER_NAME}, the journey doesn't promise an answer. It promises that you will not walk it alone.
[PAUSE 2s]
The path is under your feet. The sky is above. The rest … we find as we go.
[PAUSE 2.5s]
[PAUSE 2s]
You are here.
[PAUSE 1.5s]
You are moving.
[PAUSE 2s]
That is enough.
[PAUSE 3s]
```
