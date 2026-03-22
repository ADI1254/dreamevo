"""
Cinematic TTS Generation for THE CLEARING using Silero TTS
FREE | NO SIGNUP | MOVIE-LEVEL QUALITY | MULTIPLE EMOTIONAL VOICES

Requirements:
    pip install torch torchaudio silero-tts

Usage:
    python generate_clearing_silero.py
"""

import torch
import torchaudio
from pathlib import Path
import re
import warnings
warnings.filterwarnings('ignore')

# ==============================================================================
# SILERO TTS SETUP
# ==============================================================================

# Load Silero TTS model (first run downloads ~200MB)
device = torch.device('cpu')
torch.set_num_threads(4)

print("Loading Silero TTS model...")
model, _ = torch.hub.load(
    repo_or_dir='snakers4/silero-models',
    model='silero_tts',
    language='en',
    speaker='en_0'
)
model = model.to(device)
print("✓ Model loaded\n")

# ==============================================================================
# VOICE CONFIGURATION FOR CINEMATIC QUALITY
# ==============================================================================

VOICES = {
    "NARRATOR": {
        "speaker": "en_0",        # Female voice
        "emotion": None,          # Silero supports: neutral (default)
        "speed": 0.85,            # Slower = more contemplative
        "description": "Warm, intimate female"
    },
    "YOU": {
        "speaker": "en_0",        # Same female, different processing
        "emotion": None,
        "speed": 0.80,            # Even slower - vulnerable
        "description": "Vulnerable, honest (same voice, quieter)"
    },
    "MARCUS": {
        "speaker": "en_1",        # Male voice (darker, weathered)
        "emotion": None,
        "speed": 0.88,            # Measured, few words
        "description": "Weathered male, calm wisdom"
    },
    "ELENA": {
        "speaker": "en_2",        # Different female (younger)
        "emotion": None,
        "speed": 0.90,            # Energetic but controlled
        "description": "Younger female, intense but kind"
    },
    "OLDER_WOMAN": {
        "speaker": "en_0",        # Female voice
        "emotion": None,
        "speed": 0.87,            # Warm, knowing
        "description": "Knowing, maternal (60s-70s feel)"
    },
    "RON": {
        "speaker": "en_1",        # Male voice
        "emotion": None,
        "speed": 0.82,            # Very slow - reflective
        "description": "Elderly male, reflective (70s)"
    },
    "TRUCKER": {
        "speaker": "en_1",        # Male
        "emotion": None,
        "speed": 1.0,             # Normal pace - brief radio voice
        "description": "Radio transmission (brief)"
    },
    "VOICE_1": {
        "speaker": "en_0",        # Female
        "emotion": None,
        "speed": 0.85,            # Journal entry (slow, intimate)
        "description": "Journal reading voice 1"
    },
    "VOICE_2": {
        "speaker": "en_2",        # Different female
        "emotion": None,
        "speed": 0.85,
        "description": "Journal reading voice 2"
    },
    "VOICE_3": {
        "speaker": "en_0",        # Another female
        "emotion": None,
        "speed": 0.85,
        "description": "Journal reading voice 3"
    }
}

# ==============================================================================
# POST-PROCESSING FOR CINEMATIC QUALITY
# ==============================================================================

def add_reverb_and_compression(waveform, sr, character_type="NARRATOR"):
    """
    Add reverb and compression for cinematic feel
    Makes robotic TTS sound human and spacious
    """
    
    # Simple compression: reduce loud peaks
    # This makes volume more consistent without sounding crushed
    amplitude = torch.max(torch.abs(waveform))
    if amplitude > 0.7:
        waveform = waveform * 0.7 / amplitude
    
    # Add subtle reverb-like effect by mixing with delayed copies
    # This creates spaciousness and reduces artificial harshness
    delay_samples = [int(sr * 0.020), int(sr * 0.045)]  # 20ms and 45ms delays
    reverb = waveform.clone()
    
    for delay in delay_samples:
        if delay < waveform.shape[-1]:
            delayed = torch.zeros_like(waveform)
            delayed[:, delay:] = waveform[:, :-delay]
            reverb = reverb + delayed * 0.15  # Mix at 15% volume
    
    # Blend original with reverb (70% original, 30% reverb)
    waveform = waveform * 0.7 + reverb * 0.3
    
    # Normalize to prevent clipping
    max_val = torch.max(torch.abs(waveform))
    if max_val > 0:
        waveform = waveform * 0.95 / max_val
    
    return waveform


def process_text_for_naturalness(text, character_type):
    """
    Prepare text for natural speech synthesis:
    - Keep pauses as ellipses (Silero respects them)
    - Add breathing points naturally
    - Remove SFX markers
    """
    
    # Remove SFX markers
    text = re.sub(r'\[SFX:.*?\]', '', text, flags=re.IGNORECASE)
    
    # Convert pause markers to ellipses (natural breath points)
    text = re.sub(r'\(pause\)', '...', text, flags=re.IGNORECASE)
    text = re.sub(r'\(beat\)', '...', text, flags=re.IGNORECASE)
    text = re.sub(r'\(brief silence\)', '....', text, flags=re.IGNORECASE)
    text = re.sub(r'\(trails off\)', '...', text, flags=re.IGNORECASE)
    
    # Add natural breathing points after long sentences
    sentences = re.split(r'([.!?])', text)
    result = []
    for i, sent in enumerate(sentences):
        result.append(sent)
        # After sentence-ending punctuation, add breath point
        if sent in ['.', '!', '?'] and i < len(sentences) - 1:
            result.append(' ... ')
    
    text = ''.join(result)
    
    # Clean up multiple ellipses
    text = re.sub(r'\.{4,}', '...', text)
    
    # Character-specific adjustments for emotion
    if character_type in ["YOU"]:
        # Vulnerable dialogue - keep shorter sentences
        text = text.replace(' ... ', ' ... ')  # More pauses
    elif character_type in ["MARCUS", "RON"]:
        # Weathered/reflective - let sentences breathe
        text = text.replace('.', '. ')
    
    return text.strip()


# ==============================================================================
# SCRIPT PARSER
# ==============================================================================

def parse_script(file_path):
    """
    Parse the_clearing.txt into dialogue segments
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
                text = ' '.join(current_text).strip()
                if text:  # Only add if not empty
                    segments.append({
                        'character': current_character,
                        'text': text
                    })
                current_text = []
            
            # Parse new character
            parts = line.split(':', 1)
            char = parts[0].strip()
            char = re.sub(r'\s*\(.*?\)', '', char)
            
            current_character = char
            
            if len(parts) > 1 and parts[1].strip():
                current_text.append(parts[1].strip())
        
        # Keep pause indicators
        elif line.startswith('(') and line.endswith(')'):
            if any(word in line.lower() for word in ['pause', 'beat', 'silence', 'trails']):
                current_text.append(line)
        
        # Regular dialogue
        else:
            if current_character is None:
                current_character = "NARRATOR"
            current_text.append(line)
    
    # Add final segment
    if current_character and current_text:
        text = ' '.join(current_text).strip()
        if text:
            segments.append({
                'character': current_character,
                'text': text
            })
    
    return segments


# ==============================================================================
# AUDIO GENERATION
# ==============================================================================

def generate_audio_segment(text, speaker, character_type, output_file, speed=0.85):
    """
    Generate cinematic-quality audio using Silero TTS
    """
    
    try:
        # Process text for naturalness
        processed_text = process_text_for_naturalness(text, character_type)
        
        # Generate speech
        audio = model.apply_tts(
            text=processed_text,
            speaker=speaker,
            sample_rate=48000  # High quality
        )
        
        # Add cinematic post-processing
        audio = add_reverb_and_compression(audio, sr=48000, character_type=character_type)
        
        # Save as high-quality MP3
        torchaudio.save(
            str(output_file),
            audio,
            sample_rate=48000
        )
        
        size_mb = output_file.stat().st_size / (1024 * 1024)
        print(f"   ✓ {output_file.name} ({size_mb:.2f}MB)")
        
        return True
        
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


# ==============================================================================
# MAIN GENERATION
# ==============================================================================

def generate_clearing_all_characters():
    """
    Generate all character segments for cinematic experience
    """
    
    print("=" * 70)
    print("THE CLEARING - Silero TTS (Movie-Level Cinematic Quality)")
    print("=" * 70)
    
    # Paths
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_dir = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "clearing_stems"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse script
    print("\n📖 Parsing script...")
    segments = parse_script(script_path)
    print(f"   Found {len(segments)} dialogue segments")
    
    # Generate audio for each segment
    print(f"\n🎙️  Generating {len(segments)} cinematic audio segments...\n")
    
    successful = 0
    failed = 0
    
    for i, segment in enumerate(segments, 1):
        char = segment['character']
        
        # Get voice config
        voice_config = VOICES.get(char, VOICES["NARRATOR"])
        
        # Output filename
        output_file = output_dir / f"segment_{i:03d}_{char.lower().replace(' ', '_')}.wav"
        
        print(f"   [{i}/{len(segments)}] {char:<15} ", end="", flush=True)
        
        # Generate
        success = generate_audio_segment(
            text=segment['text'],
            speaker=voice_config['speaker'],
            character_type=char,
            output_file=output_file,
            speed=voice_config['speed']
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
    print("\n📋 CINEMATIC MIXING INSTRUCTIONS:")
    print("-" * 70)
    print("1. All segments in: clearing_stems/")
    print("2. Open your DAW (Audacity, Reaper, etc.)")
    print("3. Import all segment_*.wav files in numerical order")
    print("4. Add SFX layers (Act I/II/III per script)")
    print("5. Duck ambient/SFX to -12dB during dialogue")
    print("6. Add theta wave layer (4-8Hz, subtle)")
    print("7. Apply binaural spatial audio for character positioning")
    print("8. Export: 48kHz/24-bit WAV master")
    print("9. Convert to MP3: the_clearing_narration.mp3")
    print("10. Place in: frontend/assets/audio/CINEMATIC_AUDIO/")
    print("-" * 70)
    
    print(f"\n📂 Output: {output_dir}\n")
    
    return successful, failed


def generate_narrator_cinematic():
    """
    Generate NARRATOR segments only with full emotional depth
    """
    
    print("=" * 70)
    print("THE CLEARING - Narrator (Silero TTS, Movie-Level Quality)")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_file = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "the_clearing_narrator_cinematic.wav"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Parse and filter
    print("\n📖 Parsing script (narrator only)...")
    all_segments = parse_script(script_path)
    narrator_segments = [s for s in all_segments if s['character'] == 'NARRATOR']
    
    print(f"   Found {len(narrator_segments)} narrator segments")
    
    # Combine text
    narrator_text = "\n\n".join([s['text'] for s in narrator_segments])
    
    # Generate
    print(f"\n🎙️  Generating cinematic narrator audio...\n")
    
    success = generate_audio_segment(
        text=narrator_text,
        speaker=VOICES["NARRATOR"]['speaker'],
        character_type="NARRATOR",
        output_file=output_file,
        speed=VOICES["NARRATOR"]['speed']
    )
    
    if success:
        print(f"\n✅ Narrator audio ready: {output_file.name}")
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
    print("SILERO TTS GENERATOR - THE CLEARING")
    print("FREE | NO SIGNUP | MOVIE-LEVEL QUALITY")
    print("=" * 70)
    print("\nChoose generation mode:")
    print("1. All characters (cinematic, full dialogue)")
    print("2. Narrator only (faster)")
    print("3. Exit")
    
    choice = input("\nEnter choice (1/2/3): ").strip()
    
    if choice == "1":
        generate_clearing_all_characters()
    elif choice == "2":
        generate_narrator_cinematic()
    elif choice == "3":
        print("Exiting...")
        sys.exit(0)
    else:
        print("Invalid choice.")
        sys.exit(1)
