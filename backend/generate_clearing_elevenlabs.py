"""
ElevenLabs TTS Generation for THE CLEARING
HIGH-QUALITY NEURAL VOICES | NATURAL EMOTIONS | MOVIE-LEVEL
Free tier available: https://elevenlabs.io

Requirements:
    pip install elevenlabs

Setup:
    1. Sign up: https://elevenlabs.io/sign-up (free)
    2. Get API key from: https://elevenlabs.io/api
    3. Set: $env:ELEVENLABS_API_KEY = "your_api_key"

Usage:
    python generate_clearing_elevenlabs.py
"""

import os
from pathlib import Path
import re
from elevenlabs.client import ElevenLabs

# ==============================================================================
# ELEVENLABS SETUP
# ==============================================================================

API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not API_KEY:
    print("❌ ELEVENLABS_API_KEY not set!")
    print("\nSetup instructions:")
    print("1. Sign up FREE: https://elevenlabs.io/sign-up")
    print("2. Get API key: https://elevenlabs.io/api")
    print("3. Set environment variable:")
    print('   $env:ELEVENLABS_API_KEY = "your_key_here"')
    print("4. Run again")
    exit(1)

client = ElevenLabs(api_key=API_KEY)

# ==============================================================================
# VOICE CONFIGURATION
# ==============================================================================

VOICES = {
    "NARRATOR": {
        "voice_id": "21m00Tcm4TlvDq8ikWAM",  # Rachel (warm, professional)
        "description": "Warm, intimate female narrator"
    },
    "YOU": {
        "voice_id": "21m00Tcm4TlvDq8ikWAM",  # Rachel (vulnerable, closer)
        "description": "Honest, vulnerable (same voice, different prosody)"
    },
    "MARCUS": {
        "voice_id": "EXAVITQu4vr4xnSDxMaL",  # Gigi (deeper, weathered)
        "description": "Weathered male, calm wisdom"
    },
    "ELENA": {
        "voice_id": "MF3mGyEYCl7XYWbV4B8K",  # Elli (younger, energetic)
        "description": "Younger female, intense"
    },
    "OLDER_WOMAN": {
        "voice_id": "EXAVITQu4vr4xnSDxMaL",  # Gigi (warm, knowing)
        "description": "Knowing, maternal (60s-70s feel)"
    },
    "RON": {
        "voice_id": "cgSgspJ2msm4577dNhWi",  # Adam (deep, reflective)
        "description": "Elderly male, reflective (70s)"
    },
    "TRUCKER": {
        "voice_id": "cgSgspJ2msm4577dNhWi",  # Adam (brief)
        "description": "Radio voice (brief)"
    },
    "VOICE_1": {
        "voice_id": "21m00Tcm4TlvDq8ikWAM",  # Rachel
        "description": "Journal reading voice 1"
    },
    "VOICE_2": {
        "voice_id": "MF3mGyEYCl7XYWbV4B8K",  # Elli
        "description": "Journal reading voice 2"
    },
    "VOICE_3": {
        "voice_id": "EXAVITQu4vr4xnSDxMaL",  # Gigi
        "description": "Journal reading voice 3"
    }
}

# ==============================================================================
# SCRIPT PARSER
# ==============================================================================

def parse_script(file_path):
    """Parse THE CLEARING script"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    segments = []
    lines = content.split('\n')
    
    current_character = None
    current_text = []
    
    for line in lines:
        line = line.strip()
        
        if line.startswith('═') or line.startswith('---'):
            continue
        if any(x in line for x in ['PRODUCTION OVERVIEW', 'VOICE DIRECTION', 'AMBIENT DESIGN',
                                    'ACT I:', 'ACT II:', 'ACT III:', 'AUDIO PRODUCTION']):
            continue
        if 'AUDIO PRODUCTION MASTER NOTES' in line:
            break
        
        if line.startswith('[SFX:'):
            continue
        
        if not line:
            continue
        
        # Character detection
        if ':' in line and line.isupper() and len(line) < 100:
            if current_character and current_text:
                text = ' '.join(current_text).strip()
                if text:
                    segments.append({'character': current_character, 'text': text})
                current_text = []
            
            parts = line.split(':', 1)
            char = parts[0].strip()
            char = re.sub(r'\s*\(.*?\)', '', char)
            current_character = char
            
            if len(parts) > 1 and parts[1].strip():
                current_text.append(parts[1].strip())
        
        elif line.startswith('(') and line.endswith(')'):
            if any(word in line.lower() for word in ['pause', 'beat', 'silence', 'trails']):
                current_text.append(line)
        
        else:
            if current_character is None:
                current_character = "NARRATOR"
            current_text.append(line)
    
    if current_character and current_text:
        text = ' '.join(current_text).strip()
        if text:
            segments.append({'character': current_character, 'text': text})
    
    return segments


def process_text(text):
    """Clean text for TTS"""
    # Remove SFX markers
    text = re.sub(r'\[SFX:.*?\]', '', text, flags=re.IGNORECASE)
    
    # Convert pause markers
    text = re.sub(r'\(pause\)', '.', text, flags=re.IGNORECASE)
    text = re.sub(r'\(beat\)', '.', text, flags=re.IGNORECASE)
    text = re.sub(r'\(brief silence\)', '..', text, flags=re.IGNORECASE)
    text = re.sub(r'\(trails off\)', '.', text, flags=re.IGNORECASE)
    
    return text.strip()


# ==============================================================================
# AUDIO GENERATION
# ==============================================================================

def generate_audio_segment(text, voice_id, character, output_file):
    """Generate audio using ElevenLabs"""
    
    try:
        print(f"   Generating...", end=" ", flush=True)
        
        # Generate speech using text_to_speech endpoint
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_turbo_v2"  # Newer model, free tier compatible
        )
        
        # Save
        with open(output_file, 'wb') as f:
            for chunk in audio:
                f.write(chunk)
        
        size_mb = output_file.stat().st_size / (1024 * 1024)
        print(f"✓ ({size_mb:.2f}MB)")
        
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


# ==============================================================================
# MAIN
# ==============================================================================

def generate_all_characters():
    """Generate all character segments"""
    
    print("=" * 70)
    print("THE CLEARING - ElevenLabs TTS")
    print("HIGH-QUALITY NEURAL VOICES | NATURAL EMOTIONS")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_dir = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "clearing_stems"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse
    print("\n📖 Parsing script...")
    segments = parse_script(script_path)
    print(f"   Found {len(segments)} dialogue segments")
    
    # Generate
    print(f"\n🎙️  Generating {len(segments)} audio segments...\n")
    print("   (You have 10,000 characters/month free; THE CLEARING = ~60k chars)")
    print("   (Free tier limit: ~30 requests/day)\n")
    
    successful = 0
    failed = 0
    
    for i, segment in enumerate(segments, 1):
        char = segment['character']
        voice_config = VOICES.get(char, VOICES["NARRATOR"])
        
        output_file = output_dir / f"segment_{i:03d}_{char.lower().replace(' ', '_')}.mp3"
        
        print(f"   [{i:2d}/{len(segments)}] {char:<15}", end=" ")
        
        text = process_text(segment['text'])
        
        success = generate_audio_segment(
            text=text,
            voice_id=voice_config['voice_id'],
            character=char,
            output_file=output_file
        )
        
        if success:
            successful += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 70)
    print(f"✅ Generated: {successful} successful, {failed} failed")
    print("=" * 70)
    print(f"\n📂 Output: {output_dir}\n")
    
    return successful, failed


def generate_narrator_only():
    """Generate narrator-only version"""
    
    print("=" * 70)
    print("THE CLEARING - Narrator Only (ElevenLabs)")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_file = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "the_clearing_narration.mp3"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Parse
    print("\n📖 Parsing script...")
    all_segments = parse_script(script_path)
    narrator_segments = [s for s in all_segments if s['character'] == 'NARRATOR']
    
    print(f"   Found {len(narrator_segments)} narrator segments")
    
    # Combine
    narrator_text = "\n\n".join([process_text(s['text']) for s in narrator_segments])
    
    print(f"\n🎙️  Generating narrator audio...\n")
    
    success = generate_audio_segment(
        text=narrator_text,
        voice_id=VOICES["NARRATOR"]['voice_id'],
        character="NARRATOR",
        output_file=output_file
    )
    
    if success:
        print(f"\n✅ Narrator audio: {output_file.name}")
        print(f"📂 Location: {output_file}\n")
    else:
        print(f"\n❌ Generation failed\n")
    
    return success


if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 70)
    print("ELEVENLABS TTS - THE CLEARING")
    print("HIGH-QUALITY | NATURAL | MOVIE-LEVEL CINEMATIC")
    print("=" * 70)
    print("\nChoose mode:")
    print("1. All characters (cinematic, full dialogue)")
    print("2. Narrator only (faster)")
    print("3. Exit")
    
    choice = input("\nEnter choice (1/2/3): ").strip()
    
    if choice == "1":
        generate_all_characters()
    elif choice == "2":
        generate_narrator_only()
    elif choice == "3":
        print("Exiting...")
        sys.exit(0)
    else:
        print("Invalid choice.")
        sys.exit(1)
