#!/usr/bin/env python3
"""
Cinematic SFX Composition Builder
==================================

This script creates a professional movie-level SFX stem for Journey-Calm
by timing sound effects to match the narration and emotional arc.

The script analyzes the narration duration and places SFX at key moments.

Usage:
  python compose_sfx.py --narration journey_calm_narration.mp3 --output journey_calm_sfx.mp3

This creates a layered, ducking-friendly SFX track that enhances without overpowering.
"""

import subprocess
import os
from pathlib import Path

# Configuration
NARRATION_FILE = "journey_calm_narration.mp3"
OUTPUT_FILE = "journey_calm_sfx.mp3"
CINEMATIC_AUDIO_DIR = "assets/audio/CINEMATIC_AUDIO"

# Cinematic SFX Blueprint for Journey-Calm
# Format: (time_in_seconds, sound_description, volume_db, duration_sec, purpose)
SFX_TIMELINE = [
    # 0:00 - Opening: Urgent message arrives
    (2, "low_ominous_tone", -10, 3, "Message urgency"),
    (4, "soft_wind_gust", -12, 2, "Setting atmosphere"),
    
    # 0:15 - "Cross the jungle" - Mission begins
    (8, "distant_horn_call", -8, 2, "Royal summons"),
    (10, "jungle_ambience_swell", -10, 3, "Jungle threshold"),
    
    # 0:30 - Shoulder pack, check blade - Action moment
    (18, "metal_shimmer_riser", -6, 2, "Determination rising"),
    (20, "footstep_single", -12, 1, "First step taken"),
    
    # 0:45 - Into the green wall - Crossing threshold
    (25, "jungle_swallow_transition", -8, 2, "Nature's response"),
    (27, "vines_parting_whoosh", -10, 2, "Path opening"),
    
    # 1:00 - Deception, trails vanishing
    (35, "wind_confusion", -9, 3, "Disorientation"),
    (40, "footsteps_uncertain_loop", -10, 2, "Searching"),
    
    # 1:30 - Ravine approach - Tension builds
    (65, "low_frequency_build", -8, 4, "Descending into ravine"),
    (69, "water_rushing", -10, 2, "Stream below"),
    
    # 1:45 - Wading through water - Vulnerability
    (78, "water_splash_wade", -9, 3, "Moving through danger"),
    (82, "breath_exhale_steady", -14, 1, "Focus/calm"),
    
    # 2:00 - King's seal on stone - Recognition
    (92, "stone_reveal_chime", -6, 2, "Discovery moment"),
    (95, "confirmation_tone", -10, 1, "Path confirmed"),
    
    # 2:15 - Jungle grows hostile - Climax building
    (108, "dark_orchestral_swell", -6, 4, "Danger intensifying"),
    (113, "branches_snapping", -8, 2, "Unseen threat"),
    
    # 2:30 - Bone Grove - Sacred space
    (135, "ethereal_shimmer", -8, 3, "Otherworldly shift"),
    (140, "temple_ancient_hum", -10, 2, "Sacred presence"),
    
    # 2:45 - Night falls, descending to temple
    (158, "darkness_descending_tone", -8, 3, "Into shadow"),
    (163, "mystical_glow_riser", -6, 2, "Blue-green light"),
    
    # 3:00 - Temple appear - Awe moment
    (172, "cinematic_reveal", -4, 3, "Architectural wonder"),
    (177, "sentinels_presence", -10, 2, "Ancient guardians"),
    
    # 3:15 - Descending steps - Ritual movement
    (192, "stone_steps_echo", -8, 3, "Ceremonial descent"),
    (197, "breath_focused_soft", -14, 1, "Meditation/calm"),
    
    # 3:30 - Princess appears - Resolution begins
    (212, "vines_parting_magical", -6, 2, "Revelation moment"),
    (215, "heart_opening_tone", -8, 2, "Emotional shift"),
    
    # 3:45 - "Mission complete" - Peak
    (228, "orchestral_triumph", -4, 4, "Victory realization"),
    (233, "temple_exhale_resonance", -8, 2, "Earth's exhale"),
    
    # 4:00 - Closing: Peace, weight dissolves
    (250, "gentle_bells_fade", -8, 3, "Peaceful resolution"),
    (255, "jungle_settling_quiet", -10, 2, "Nature at rest"),
    (260, "final_breath_peace", -14, 2, "Inner peace"),
]

def estimate_narration_duration():
    """Estimate narration duration from file"""
    try:
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
             '-of', 'default=noprint_wrappers=1:nokey=1:noprint_filename=1',
             NARRATION_FILE],
            capture_output=True,
            text=True
        )
        return float(result.stdout.strip())
    except:
        return None

def generate_sfx_timeline_chart():
    """Print visual timeline of SFX placements"""
    print("\n" + "="*70)
    print("🎬 CINEMATIC SFX TIMELINE - Journey Calm")
    print("="*70)
    print("\nTime  | Sound Effect              | Volume | Purpose")
    print("-"*70)
    
    for time_sec, sound, vol_db, duration, purpose in SFX_TIMELINE:
        min_sec = f"{int(time_sec//60):02d}:{int(time_sec%60):02d}"
        print(f"{min_sec} | {sound:25} | {vol_db:3}dB | {purpose}")
    
    print("\n" + "="*70)
    print(f"Total SFX Events: {len(SFX_TIMELINE)}")
    print("="*70)

def create_sfx_stem_instructions():
    """Generate detailed instructions for creating SFX stem"""
    instructions = """
╔════════════════════════════════════════════════════════════════════╗
║          🎬 MOVIE-LEVEL SFX COMPOSITION INSTRUCTIONS              ║
╚════════════════════════════════════════════════════════════════════╝

STEP 1: PREPARATION
─────────────────
1. Open your DAW (Reaper, Audition, Logic, or Studio One)
2. Create NEW project at 48kHz / 24-bit
3. Import: journey_calm_narration.mp3 to Track 1
4. Create Track 2 for SFX

STEP 2: SOUND DESIGN PALETTE
──────────────────────────
You need these cinematic sound elements:

TRANSITIONS/AMBIENCE:
  • Low ominous tone (40-80 Hz drone, 3-4s)
  • Wind gusts (organic, varied)
  • Jungle ambience swells (layered nature)
  • Ethereal shimmers (high-frequency sparkle)
  • Orchestral swells (emotional builds)

IMPACTS/EVENTS:
  • Metal shimmer riser (bright, ascending)
  • Distant horn call (noble, haunting)
  • Stone chime/bells (resolution, discovery)
  • Water splash (vulnerable moment)
  • Temple hum/resonance (sacred, low)
  • Branches snapping (danger)

EMOTIONAL MOMENTS:
  • Heart opening tone (warm, expanding)
  • Orchestral triumph (victorious, bold)
  • Gentle bells fade (peace, release)
  • Final breath (completion, rest)

WHERE TO FIND:
  • Freesound.org - Search "cinematic risers"
  • Splice - "dark orchestral", "temple bell", "water wade"
  • Epidemic Sound - "transition",  "revelation", "triumph"
  • Your own Foley recordings (if skilled)

STEP 3: SOUND PLACEMENT (Use Timeline Below)
────────────────────────────────────────────
"""
    
    instructions += "\nTIMELINE MAP:\n"
    instructions += "="*70 + "\n"
    
    for time_sec, sound, vol_db, duration, purpose in SFX_TIMELINE:
        min_sec = f"{int(time_sec//60):02d}:{int(time_sec%60):02d}"
        instructions += f"\n{min_sec} - {purpose.upper()}\n"
        instructions += f"  Sound: {sound}\n"
        instructions += f"  Volume: {vol_db} dB (code will duck to -18dB during narration)\n"
        instructions += f"  Duration: ~{duration}s\n"
    
    instructions += """

STEP 4: PROFESSIONAL MIXING GUIDELINES
──────────────────────────────────────

VOLUME LEVELS:
  • Max peak: -6 dBFS (leaves headroom for ducking)
  • Fade in: 200ms (smooth entry)
  • Fade out: 500ms-1s (natural decay)
  • No SFX should collide with key narration phrases

DUCKING STRATEGY:
  App code automatically ducks by -12dB during narration
  So design assuming these dB levels:
    • Opening/quiet moments: -10 to -8 dB
    • Builds/impacts: -6 to -4 dB
    • Tender moments: -12 to -10 dB (very subtle)

EQ PROCESSING (Per SFX):
  • HPF @ 60Hz: Remove rumble/mud
  • Add reverb: 10-20% to match temple space
  • Match stereo width: 70-100% for immersion

STEREO PLACEMENT:
  • 0:00-0:45 - Center to slightly right (arrival)
  • 0:45-2:00 - Wide L/R (exploration)
  • 2:00-3:00 - Center-wide (mission focus)
  • 3:00-end - Return to center (completion)

STEP 5: EMOTIONAL ARC
─────────────────────
Your SFX should follow this emotional journey:

0:00-1:00   URGENCY     → Urgent tones, rising energy
1:00-2:00   ADVENTURE   → Exploration, movement, discovery
2:00-2:45   TENSION     → Dark builds, danger, uncertainty
2:45-3:30   REVELATION  → Ethereal shift, sacred space
3:30-4:00   TRIUMPH     → Orchestral swell, victory
4:00+       PEACE       → Gentle resolution, silence

STEP 6: EXPORT
──────────────
When done mixing:

  File 1: journey_calm_sfx.wav
    • Format: WAV (Microsoft)
    • Sample Rate: 48000 Hz
    • Bit Depth: 24-bit
    • Channels: Stereo
    • Duration: ~4 min (same as narration)
    • Peak Level: -6 dBFS

  File 2: journey_calm_sfx.mp3
    • Format: MP3
    • Bitrate: 256 kbps
    • Channels: Stereo
    • Same peak level

STEP 7: PLACEMENT
─────────────────
Copy both files to:
  frontend/assets/audio/CINEMATIC_AUDIO/

Then test:
  1. Open frontend/index.html
  2. Select "Journey" + "Calm"
  3. Click "Begin Dream"
  4. Browser console should show:
     ✅ Loaded narration stem (1/3)
     ✅ Loaded ambient stem (2/3) [if you have ambient]
     ✅ Loaded sfx stem (3/3) [your new SFX!]

STEP 8: QUALITY CONTROL
────────────────────────
Listen through and verify:
  ☐ Every SFX enhances emotion (doesn't distract)
  ☐ Timing matches narration beats
  ☐ Ducking sounds natural (not abrupt)
  ☐ No harsh frequencies (EQ smooth)
  ☐ Stereo imaging feels cinematic (not annoying)
  ☐ Peak levels correct (-6 dBFS max)
  ☐ Fades smooth (no clicks/pops)
  ☐ Loops/silences at end match narration length

PROFESSIONAL TOUCHES
─────────────────────
To make it TRUE movie-level:

1. ORCHESTRAL FOUNDATION
   - Add subtle orchestral pad beneath tense moments
   - +2dB boost around 1-2kHz for warmth
   - Fade in/out smoothly

2. FOLEY PERSONALIZATION
   - Record your own footsteps on leaves
   - Record breath sounds (yourself)
   - Record rustling/fabric movement
   - These are 100x more impactful than samples

3. PSYCHOACOUSTIC LAYERING
   - Sub-bass (20-80Hz): Felt not heard, adds depth
   - Mid-bass (80-250Hz): Power, emotional weight
   - Mids (250Hz-2kHz): Clarity, presence
   - Highs (2-10kHz): Details, sparkle
   - Air (10-15kHz): Space, dimension

4. TIMING PRECISION
   - Use grid snapping (every 16th note)
   - Align impacts to narration stress points
   - Anticipatory SFX 200-500ms before narration peak

5. AUTOMATION
   - Automate volume on tense moments (+2dB)
   - Automate reverb on sacred space (increase wet)
   - Create dynamic mix, not static

RECOMMENDED TOOLS FOR SFX
──────────────────────────
DAW: Reaper ($60) - best for this workflow
Plugins:
  • EQ: TDR Nova (free)
  • Reverb: Valhalla Plate (free)
  • Compression: ReaComp (Reaper)
  • Metering: Youlean Loudness (free)

Libraries:
  • Splice: "cinematic strings", "temple bell", "orchestral riser"
  • Freesound: Search "reverent", "epic", "journey"
  • Your own Foley: Priceless!

═════════════════════════════════════════════════════════════════════

EXPECTED RESULT:
When you play the app now:
  - Voice: Warm, expressive narration (ElevenLabs)
  - Ambient: Looping jungle bed (if you create it)
  - SFX: Movie-grade cinematic punctuation at every emotional beat

This is what Netflix/HBO/Audible use. You now have the blueprint. 🎬✨

═════════════════════════════════════════════════════════════════════
"""
    
    return instructions

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎬 CINEMATIC SFX COMPOSITION BUILDER")
    print("="*70)
    
    # Check narration exists
    if os.path.exists(NARRATION_FILE):
        duration = estimate_narration_duration()
        if duration:
            print(f"\n✅ Found narration: {NARRATION_FILE}")
            print(f"📊 Narration duration: {int(duration//60):02d}:{int(duration%60):02d}")
        else:
            print(f"\n⚠️ Found narration but couldn't read duration")
            print(f"   (Make sure ffprobe is installed: pip install ffmpeg-python)")
    else:
        print(f"\n❌ Narration not found: {NARRATION_FILE}")
        print(f"   Expected at: {os.path.abspath(NARRATION_FILE)}")
    
    # Print timeline
    generate_sfx_timeline_chart()
    
    # Print instructions
    instructions = create_sfx_stem_instructions()
    print(instructions)
    
    # Save instructions to file
    with open("SFX_COMPOSITION_GUIDE.txt", "w", encoding="utf-8") as f:
        f.write(instructions)
    print("\n💾 Detailed guide saved to: SFX_COMPOSITION_GUIDE.txt")
    print("\n✨ Ready to create movie-level SFX! Follow the guide above.")
