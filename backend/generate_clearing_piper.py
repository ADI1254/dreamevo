"""
PIPER TTS - High-Quality Neural Voices
FREE | NO SIGNUP | NATURAL SOUNDING | MULTIPLE VOICES
Lighter weight than Silero, movie-level quality

Requirements:
    pip install piper-tts

Usage:
    python generate_clearing_piper.py
"""

import subprocess
import os
import shutil
from pathlib import Path
import re
import json

# ==============================================================================
# PIPER SETUP (Auto-downloads voices on first run)
# ==============================================================================

print("Setting up Piper TTS...")
print("(First run will download neural voice models ~100MB)\n")

# ==============================================================================
# VOICE CONFIGURATION
# ==============================================================================

VOICES = {
    "NARRATOR": {
        "model": "en_US-hfc_female-medium",  # Warm female voice
        "description": "Warm, intimate female (contemplative)"
    },
    "YOU": {
        "model": "en_US-hfc_female-medium",  # Same voice, processed differently
        "description": "Vulnerable, honest (intimate)"
    },
    "MARCUS": {
        "model": "en_US-lessac_male-medium",  # Male voice (weathered)
        "description": "Weathered male, calm wisdom"
    },
    "ELENA": {
        "model": "en_US-hfc_female-medium",  # Younger female impression
        "description": "Younger female, intense (energetic)"
    },
    "OLDER_WOMAN": {
        "model": "en_US-hfc_female-medium",  # Female voice
        "description": "Knowing, maternal (warm)"
    },
    "RON": {
        "model": "en_US-lessac_male-medium",  # Male voice
        "description": "Elderly male, reflective (deep)"
    },
    "TRUCKER": {
        "model": "en_US-lessac_male-medium",  # Male
        "description": "Radio voice (brief)"
    },
    "VOICE_1": {
        "model": "en_US-hfc_female-medium",  # Female
        "description": "Journal entry voice 1"
    },
    "VOICE_2": {
        "model": "en_US-hfc_female-medium",  # Female variation
        "description": "Journal entry voice 2"
    },
    "VOICE_3": {
        "model": "en_US-hfc_female-medium",  # Female variation
        "description": "Journal entry voice 3"
    }
}

# ==============================================================================
# TEXT PROCESSING
# ==============================================================================

def process_text_for_naturalness(text, character_type):
    """
    Prepare text for natural speech:
    - Keep pauses as ellipses
    - Break long sentences for natural rhythm
    - Remove SFX markers
    """
    
    # Remove SFX markers
    text = re.sub(r'\[SFX:.*?\]', '', text, flags=re.IGNORECASE)
    
    # Convert pause markers to natural pauses
    text = re.sub(r'\(pause\)', ' ... ', text, flags=re.IGNORECASE)
    text = re.sub(r'\(beat\)', ' ... ', text, flags=re.IGNORECASE)
    text = re.sub(r'\(brief silence\)', ' .... ', text, flags=re.IGNORECASE)
    text = re.sub(r'\(trails off\)', ' ... ', text, flags=re.IGNORECASE)
    
    # Add pauses after sentence-ending punctuation
    text = re.sub(r'([.!?])\s+([A-Z])', r'\1 ... \2', text)
    
    # For vulnerable dialogue, add more natural pauses
    if character_type == "YOU":
        text = re.sub(r',', ' ...', text)  # Commas become breaths
    
    # Clean up excessive ellipses
    text = re.sub(r'\.{5,}', '...', text)
    text = re.sub(r'\.{4}', '...', text)
    
    return text.strip()


# ==============================================================================
# SCRIPT PARSER
# ==============================================================================

def parse_script(file_path):
    """Parse THE CLEARING script into dialogue segments"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    segments = []
    lines = content.split('\n')
    
    current_character = None
    current_text = []
    
    for line in lines:
        line = line.strip()
        
        # Skip headers, dividers, production notes
        if line.startswith('═') or line.startswith('---'):
            continue
        if any(x in line for x in ['PRODUCTION OVERVIEW', 'VOICE DIRECTION', 'AMBIENT DESIGN',
                                    'ACT I:', 'ACT II:', 'ACT III:', 'AUDIO PRODUCTION']):
            continue
        if 'AUDIO PRODUCTION MASTER NOTES' in line:
            break
        
        # Skip SFX
        if line.startswith('[SFX:'):
            continue
        
        if not line:
            continue
        
        # Character detection
        if ':' in line and line.isupper() and len(line) < 100:
            # Save previous segment
            if current_character and current_text:
                text = ' '.join(current_text).strip()
                if text:
                    segments.append({'character': current_character, 'text': text})
                current_text = []
            
            # New character
            parts = line.split(':', 1)
            char = parts[0].strip()
            char = re.sub(r'\s*\(.*?\)', '', char)
            current_character = char
            
            if len(parts) > 1 and parts[1].strip():
                current_text.append(parts[1].strip())
        
        # Pause markers
        elif line.startswith('(') and line.endswith(')'):
            if any(word in line.lower() for word in ['pause', 'beat', 'silence', 'trails']):
                current_text.append(line)
        
        # Dialogue
        else:
            if current_character is None:
                current_character = "NARRATOR"
            current_text.append(line)
    
    # Final segment
    if current_character and current_text:
        text = ' '.join(current_text).strip()
        if text:
            segments.append({'character': current_character, 'text': text})
    
    return segments


# ==============================================================================
# AUDIO GENERATION WITH PIPER
# ==============================================================================

def generate_with_piper(text, voice_model, output_file, speed=1.0, pitch=1.0):
    """
    Generate audio using Piper TTS
    """
    
    try:
        # Piper command-line usage
        cmd = [
            'piper',
            '--model', voice_model,
            '--output-file', str(output_file),
            '--speaker', '0',
            '--length-scale', str(1.0 / speed),  # Inverse for piper
            '--noise-scale', '0.667'
        ]
        
        # Run piper
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=text, timeout=60)
        
        if process.returncode == 0:
            size_mb = output_file.stat().st_size / (1024 * 1024)
            print(f"   ✓ Generated ({size_mb:.2f}MB)")
            return True
        else:
            print(f"   ✗ Piper error: {stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"   ✗ Timeout")
        return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


# ==============================================================================
# FALLBACK: ESPEAK (FASTER, ALWAYS AVAILABLE)
# ==============================================================================

def generate_with_espeak(text, output_file, speed=1.0, pitch=1.0, voice="default"):
    """
    Fallback to eSpeak-NG (available on all systems)
    Lower quality than Piper but reliable and fast
    """
    
    try:
        # eSpeak parameters
        rate = int(150 * speed)  # Words per minute
        pitch_val = int(50 * pitch)
        
        cmd = [
            'espeak-ng',
            '-s', str(rate),
            '-p', str(pitch_val),
            '-w', str(output_file),
            '-m',  # SSML mode
            text
        ]
        
        result = subprocess.run(cmd, capture_output=True, timeout=30)
        
        if result.returncode == 0:
            size_mb = output_file.stat().st_size / (1024 * 1024)
            print(f"   ✓ Generated with eSpeak ({size_mb:.2f}MB)")
            return True
        else:
            print(f"   ✗ eSpeak error")
            return False
            
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


# ==============================================================================
# MAIN GENERATION
# ==============================================================================

def generate_all_characters():
    """Generate all character segments"""
    
    print("=" * 70)
    print("THE CLEARING - High-Quality TTS (Piper/eSpeak)")
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
    
    successful = 0
    failed = 0
    
    for i, segment in enumerate(segments, 1):
        char = segment['character']
        voice_config = VOICES.get(char, VOICES["NARRATOR"])
        
        output_file = output_dir / f"segment_{i:03d}_{char.lower().replace(' ', '_')}.wav"
        
        print(f"   [{i:2d}/{len(segments)}] {char:<15}", end=" ", flush=True)
        
        # Process text
        text = process_text_for_naturalness(segment['text'], char)
        
        # Try Piper first, fall back to eSpeak
        success = generate_with_piper(
            text=text,
            voice_model=voice_config['model'],
            output_file=output_file,
            speed=0.85 if char in ["NARRATOR", "YOU", "RON"] else 0.95
        )
        
        if not success:
            # Fallback to eSpeak
            success = generate_with_espeak(
                text=text,
                output_file=output_file,
                speed=0.85 if char in ["NARRATOR", "YOU", "RON"] else 0.95
            )
        
        if success:
            successful += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 70)
    print(f"✅ Generation: {successful} successful, {failed} failed")
    print("=" * 70)
    print(f"\n📂 Output: {output_dir}\n")
    
    return successful, failed


def generate_narrator_only():
    """Generate narrator-only version"""
    
    print("=" * 70)
    print("THE CLEARING - Narrator Only")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_file = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "the_clearing_narration.wav"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Parse
    print("\n📖 Parsing script...")
    all_segments = parse_script(script_path)
    narrator_segments = [s for s in all_segments if s['character'] == 'NARRATOR']
    
    print(f"   Found {len(narrator_segments)} narrator segments")
    
    # Combine
    narrator_text = "\n\n".join([process_text_for_naturalness(s['text'], 'NARRATOR') for s in narrator_segments])
    
    # Generate
    print(f"\n🎙️  Generating narrator audio...\n")
    
    success = generate_with_piper(
        text=narrator_text,
        voice_model=VOICES["NARRATOR"]['model'],
        output_file=output_file,
        speed=0.85
    )
    
    if not success:
        success = generate_with_espeak(
            text=narrator_text,
            output_file=output_file,
            speed=0.85
        )
    
    if success:
        print(f"\n✅ Narrator audio: {output_file.name}")
        print(f"📂 Location: {output_file}\n")
    else:
        print(f"\n❌ Generation failed\n")
    
    return success


# ==============================================================================
# MAIN
# ==============================================================================

if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 70)
    print("HIGH-QUALITY TTS GENERATOR - THE CLEARING")
    print("Free | No Signup | Natural Voices | Movie-Level Quality")
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
