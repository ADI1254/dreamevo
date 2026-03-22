"""
Free TTS Generation for THE CLEARING using gTTS (Google Text-to-Speech)
NO SIGNUP REQUIRED | FREE & UNLIMITED | HIGH QUALITY

Requirements:
    pip install gtts pydub

Usage:
    python generate_clearing_gtts.py
"""

from gtts import gTTS
from pathlib import Path
import re
import time

# ==============================================================================
# CONFIGURATION
# ==============================================================================

VOICES = {
    "NARRATOR": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},   # Warm female
    "YOU": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},         # Vulnerable
    "MARCUS": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},      # Weathered male
    "ELENA": {"lang": "en", "tld": "com", "slow": False, "break_pause": False},      # Younger female
    "OLDER_WOMAN": {"lang": "en", "tld": "com", "slow": False, "break_pause": True}, # Maternal
    "RON": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},         # Reflective elder
    "TRUCKER": {"lang": "en", "tld": "com", "slow": False, "break_pause": False},    # Radio voice
    "VOICE_1": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},     # Journal entry
    "VOICE_2": {"lang": "en", "tld": "com", "slow": False, "break_pause": True},
    "VOICE_3": {"lang": "en", "tld": "com", "slow": False, "break_pause": True}
}

# ==============================================================================
# SCRIPT PARSER
# ==============================================================================

def parse_script(file_path):
    """
    Parse the_clearing.txt into segments
    Returns list of dicts: {'character', 'text'}
    """
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    segments = []
    lines = content.split('\n')
    
    current_character = None
    current_text = []
    
    for line in lines:
        line = line.strip()
        
        # Skip headers and dividers
        if line.startswith('═') or line.startswith('---'):
            continue
        if any(x in line for x in ['PRODUCTION OVERVIEW', 'VOICE DIRECTION', 'AMBIENT DESIGN', 
                                    'ACT I:', 'ACT II:', 'ACT III:', 'AUDIO PRODUCTION']):
            continue
        if 'AUDIO PRODUCTION MASTER NOTES' in line:
            break
            
        # Skip SFX markers
        if line.startswith('[SFX:'):
            continue
        
        # Skip empty lines
        if not line:
            continue
        
        # Detect character cues
        if ':' in line and line.isupper() and len(line) < 100:
            # Save previous segment
            if current_character and current_text:
                segments.append({
                    'character': current_character,
                    'text': ' '.join(current_text).strip()
                })
                current_text = []
            
            # Parse new character
            parts = line.split(':', 1)
            char = parts[0].strip()
            char = re.sub(r'\s*\(.*?\)', '', char)  # Remove parenthetical directions
            
            current_character = char
            
            if len(parts) > 1 and parts[1].strip():
                current_text.append(parts[1].strip())
        
        # Keep pause indicators but remove brackets
        elif line.startswith('(') and line.endswith(')'):
            if any(word in line.lower() for word in ['pause', 'beat', 'silence', 'trails']):
                # Convert to natural text pauses
                if '...' not in ' '.join(current_text):
                    current_text.append('...')
        
        # Regular dialogue/narration
        else:
            if current_character is None:
                current_character = "NARRATOR"
            current_text.append(line)
    
    # Add final segment
    if current_character and current_text:
        segments.append({
            'character': current_character,
            'text': ' '.join(current_text).strip()
        })
    
    return segments


# ==============================================================================
# AUDIO GENERATION
# ==============================================================================

def generate_audio_segment(segment, output_file, character_type):
    """
    Generate audio using gTTS (free, no signup)
    """
    
    text = segment['text']
    config = VOICES.get(character_type, VOICES["NARRATOR"])
    
    try:
        print(f"   🎙️  Generating: {output_file.name}...", end="", flush=True)
        
        # Create TTS object
        tts = gTTS(
            text=text,
            lang=config['lang'],
            tld=config['tld'],
            slow=config['slow']  # True = slower/more natural pacing
        )
        
        # Save
        tts.save(str(output_file))
        
        # Get file size
        size_mb = output_file.stat().st_size / (1024 * 1024)
        print(f" ✓ ({size_mb:.2f}MB)")
        
        # Rate limit (be nice to Google's servers)
        time.sleep(1)
        
        return True
        
    except Exception as e:
        print(f" ✗ Error: {e}")
        return False


# ==============================================================================
# MAIN GENERATION
# ==============================================================================

def generate_clearing_narration():
    """
    Generate all character segments for THE CLEARING
    """
    
    print("=" * 70)
    print("THE CLEARING - Free TTS Generation (gTTS - No Signup Required)")
    print("=" * 70)
    
    # Paths
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_dir = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "clearing_stems"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse script
    print("\n📖 Parsing script...")
    segments = parse_script(script_path)
    print(f"   Found {len(segments)} segments")
    
    # Generate audio
    print(f"\n🎙️  Generating {len(segments)} audio segments...\n")
    
    successful = 0
    failed = 0
    
    for i, segment in enumerate(segments):
        char = segment['character']
        output_file = output_dir / f"segment_{i:03d}_{char.lower().replace(' ', '_')}.mp3"
        
        success = generate_audio_segment(
            segment=segment,
            output_file=output_file,
            character_type=char
        )
        
        if success:
            successful += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 70)
    print(f"✅ Generation complete: {successful} successful, {failed} failed")
    print("=" * 70)
    
    # Instructions
    print("\n📋 NEXT STEPS:")
    print("-" * 70)
    print("1. All segments are in: clearing_stems/")
    print("2. Arrange them in order (segment_000, segment_001, etc.) in your DAW")
    print("3. Add SFX layers for cinematic effect:")
    print("   - Act I: City → car → highway → rest stop")
    print("   - Act II: Forest → water → storm → alpine wind")
    print("   - Act III: Clearing → final walk → silence")
    print("4. Export as: the_clearing_narration.mp3")
    print("5. Place in: frontend/assets/audio/CINEMATIC_AUDIO/")
    print("-" * 70)
    
    print(f"\n📂 Output location: {output_dir}\n")
    
    return successful, failed


def generate_narrator_only():
    """
    Generate NARRATOR segments only (faster, simpler)
    """
    
    print("=" * 70)
    print("THE CLEARING - Narrator Only (gTTS)")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_file = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "the_clearing_narrator_only.mp3"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Parse and filter
    print("\n📖 Parsing script (narrator only)...")
    all_segments = parse_script(script_path)
    narrator_segments = [s for s in all_segments if s['character'] == 'NARRATOR']
    
    print(f"   Found {len(narrator_segments)} narrator segments")
    
    # Combine text
    narrator_text = "\n\n".join([s['text'] for s in narrator_segments])
    
    # Generate
    print(f"\n🎙️  Generating narrator audio...")
    
    try:
        tts = gTTS(
            text=narrator_text,
            lang="en",
            tld="com",
            slow=True  # Slower pacing for contemplative feel
        )
        
        tts.save(str(output_file))
        
        size_mb = output_file.stat().st_size / (1024 * 1024)
        
        print(f"\n✅ Narrator audio saved: {output_file.name} ({size_mb:.2f}MB)")
        print(f"\n📂 Location: {output_file}\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Generation failed: {e}\n")
        return False


# ==============================================================================
# MAIN
# ==============================================================================

if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 70)
    print("GTTS GENERATOR - THE CLEARING (FREE, NO SIGNUP)")
    print("=" * 70)
    print("\nChoose mode:")
    print("1. Multi-character stems (all segments, recommended for cinematic)")
    print("2. Narrator-only (faster, simpler)")
    print("3. Exit")
    
    choice = input("\nEnter choice (1/2/3): ").strip()
    
    if choice == "1":
        generate_clearing_narration()
    elif choice == "2":
        generate_narrator_only()
    elif choice == "3":
        print("Exiting...")
        sys.exit(0)
    else:
        print("Invalid choice.")
        sys.exit(1)
