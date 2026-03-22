"""
Azure TTS Generation for THE CLEARING
Generates cinematic narration using Azure Cognitive Services
Voice: Ava (en-US-AvaMultilingualNeural)

Requirements:
    pip install azure-cognitiveservices-speech

Usage:
    python generate_clearing_azure.py
"""

import azure.cognitiveservices.speech as speechsdk
import os
import re
from pathlib import Path

# ==============================================================================
# AZURE CONFIGURATION
# ==============================================================================

# Set your Azure credentials here or via environment variables
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY", "YOUR_AZURE_KEY_HERE")
AZURE_REGION = os.getenv("AZURE_REGION", "eastus")  # e.g., eastus, westus, etc.

# Voice configuration
VOICES = {
    "NARRATOR": "en-US-AvaMultilingualNeural",  # Warm, intimate female
    "YOU": "en-US-AvaMultilingualNeural",        # Same voice, softer/vulnerable
    "MARCUS": "en-US-AndrewMultilingualNeural",  # Weathered male, calm
    "ELENA": "en-US-EmmaMultilingualNeural",     # Younger female, intense
    "OLDER_WOMAN": "en-US-JennyNeural",          # Knowing, maternal
    "RON": "en-US-GuyNeural",                    # Elderly male, reflective
    "TRUCKER": "en-US-EricNeural",               # Brief radio voice
    "VOICE_1": "en-US-AvaMultilingualNeural",    # Journal entries
    "VOICE_2": "en-US-EmmaMultilingualNeural",
    "VOICE_3": "en-US-JennyNeural"
}

# ==============================================================================
# SSML CONFIGURATION FOR CINEMATIC QUALITY
# ==============================================================================

def create_ssml(text, voice_name, character_type="NARRATOR"):
    """
    Creates SSML with cinematic timing and emotion.
    
    Character types determine speaking style:
    - NARRATOR: Slow, intimate, grounded (rate: 0.80)
    - YOU: Vulnerable, quiet, honest (rate: 0.75, pitch: -5%)
    - MARCUS/RON: Calm wisdom, weathered (rate: 0.85, pitch: -10%)
    - ELENA/OLDER_WOMAN: Warm, knowing (rate: 0.85)
    """
    
    # Base styles by character type
    styles = {
        "NARRATOR": {
            "rate": "0.80",  # 80 WPM target (very slow, contemplative)
            "pitch": "0%",
            "volume": "default",
            "style": "calm"
        },
        "YOU": {
            "rate": "0.75",  # Even slower, vulnerable
            "pitch": "-5%",
            "volume": "soft",
            "style": "gentle"
        },
        "MARCUS": {
            "rate": "0.85",
            "pitch": "-10%",  # Deeper, weathered
            "volume": "default",
            "style": "calm"
        },
        "ELENA": {
            "rate": "0.85",
            "pitch": "+5%",  # Younger, energetic
            "volume": "default",
            "style": "friendly"
        },
        "OLDER_WOMAN": {
            "rate": "0.82",
            "pitch": "+3%",
            "volume": "default",
            "style": "friendly"
        },
        "RON": {
            "rate": "0.78",  # Very slow, reflective
            "pitch": "-8%",
            "volume": "default",
            "style": "calm"
        },
        "TRUCKER": {
            "rate": "1.0",
            "pitch": "0%",
            "volume": "default",
            "style": "default"
        },
        "VOICE_1": {"rate": "0.80", "pitch": "0%", "volume": "soft", "style": "gentle"},
        "VOICE_2": {"rate": "0.80", "pitch": "+3%", "volume": "soft", "style": "gentle"},
        "VOICE_3": {"rate": "0.80", "pitch": "+5%", "volume": "soft", "style": "gentle"}
    }
    
    style = styles.get(character_type, styles["NARRATOR"])
    
    # Convert natural pauses to SSML breaks
    # "..." → 1.5s pause (dramatic reflection)
    # "(pause)" → 1.0s pause
    # "(beat)" → 0.8s pause
    # "(brief silence)" → 2.0s pause
    text = re.sub(r'\.\.\.', '<break time="1500ms"/>', text)
    text = re.sub(r'\(pause\)', '<break time="1000ms"/>', text)
    text = re.sub(r'\(beat\)', '<break time="800ms"/>', text)
    text = re.sub(r'\(brief silence\)', '<break time="2000ms"/>', text)
    text = re.sub(r'\(trails off\)', '<break time="1200ms"/>', text)
    
    # Add emphasis to emotional moments
    text = re.sub(r'\*\*(.+?)\*\*', r'<emphasis level="strong">\1</emphasis>', text)
    
    ssml = f"""<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
                xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="{voice_name}">
            <mstts:express-as style="{style['style']}" styledegree="1.5">
                <prosody rate="{style['rate']}" pitch="{style['pitch']}" volume="{style['volume']}">
                    {text}
                </prosody>
            </mstts:express-as>
        </voice>
    </speak>"""
    
    return ssml


# ==============================================================================
# SCRIPT PARSER
# ==============================================================================

def parse_script(file_path):
    """
    Parse the_clearing.txt into segments:
    Returns list of dicts with:
        - character: Who's speaking
        - text: What they say
        - sfx: Sound effects (removed from narration)
    """
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    segments = []
    
    # Split by lines
    lines = content.split('\n')
    
    current_character = None
    current_text = []
    
    for line in lines:
        line = line.strip()
        
        # Skip production notes and dividers
        if line.startswith('═') or line.startswith('---'):
            continue
        if 'PRODUCTION OVERVIEW' in line or 'VOICE DIRECTION' in line:
            continue
        if 'AMBIENT DESIGN' in line or 'ACT I:' in line or 'ACT II:' in line or 'ACT III:' in line:
            continue
        if 'AUDIO PRODUCTION MASTER NOTES' in line:
            break  # Stop at production notes
            
        # Skip SFX markers (we'll handle these separately in audio mixing)
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
            
            # Clean character name (remove parenthetical direction)
            char = re.sub(r'\s*\(.*?\)', '', char)
            
            current_character = char
            
            # If there's text after the colon, add it
            if len(parts) > 1 and parts[1].strip():
                current_text.append(parts[1].strip())
        
        # Detect parenthetical stage direction (usually remove, but keep pauses)
        elif line.startswith('(') and line.endswith(')'):
            # Keep pause indicators
            if any(word in line.lower() for word in ['pause', 'beat', 'silence', 'trails']):
                current_text.append(line)
        
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

def generate_audio_segment(segment, output_file, voice_name, character_type):
    """
    Generate audio for a single segment using Azure TTS
    """
    
    # Configure speech
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_REGION
    )
    
    # High-quality audio: 48kHz, 24-bit
    speech_config.set_speech_synthesis_output_format(
        speechsdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3
    )
    
    # Output to file
    audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
    
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config
    )
    
    # Create SSML
    ssml = create_ssml(segment['text'], voice_name, character_type)
    
    # Synthesize
    result = synthesizer.speak_ssml_async(ssml).get()
    
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return True
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation = result.cancellation_details
        print(f"❌ Speech synthesis canceled: {cancellation.reason}")
        if cancellation.reason == speechsdk.CancellationReason.Error:
            print(f"   Error: {cancellation.error_details}")
        return False
    
    return False


def generate_clearing_narration():
    """
    Main generation function
    Produces separate audio files per character, then provides mixing instructions
    """
    
    print("=" * 70)
    print("THE CLEARING - Azure TTS Generation (Ava Multilingual)")
    print("=" * 70)
    
    # Paths
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_dir = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "clearing_stems"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse script
    print("\n📖 Parsing script...")
    segments = parse_script(script_path)
    print(f"   Found {len(segments)} dialogue/narration segments")
    
    # Generate audio for each segment
    print("\n🎙️  Generating audio segments...\n")
    
    successful = 0
    failed = 0
    
    for i, segment in enumerate(segments):
        char = segment['character']
        
        # Map character to voice
        voice_name = VOICES.get(char, VOICES["NARRATOR"])
        
        # Output filename
        output_file = output_dir / f"segment_{i:03d}_{char.lower().replace(' ', '_')}.mp3"
        
        print(f"   [{i+1}/{len(segments)}] {char}: Generating...")
        
        # Generate
        success = generate_audio_segment(
            segment=segment,
            output_file=str(output_file),
            voice_name=voice_name,
            character_type=char
        )
        
        if success:
            successful += 1
            print(f"      ✓ Saved to {output_file.name}")
        else:
            failed += 1
            print(f"      ✗ Failed")
    
    # Summary
    print("\n" + "=" * 70)
    print(f"✅ Generation complete: {successful} successful, {failed} failed")
    print("=" * 70)
    
    # Next steps
    print("\n📋 NEXT STEPS FOR CINEMATIC MIXING:")
    print("-" * 70)
    print("1. Import all segment_*.mp3 files into your DAW (Audacity, Reaper, etc.)")
    print("2. Arrange them in chronological order (segment_000, segment_001, etc.)")
    print("3. Add SFX layers according to the [SFX: ...] markers in the script:")
    print("   - Act I: City sounds → car → highway → rest stop")
    print("   - Act II: Forest ambience → stream → storm → alpine wind")
    print("   - Act III: Clearing ambience → final walk → silence")
    print("4. Add theta wave layer (4-8 Hz binaural beats) throughout")
    print("5. Apply binaural spatial audio for character positioning:")
    print("   - Narrator: Center (intimate)")
    print("   - Marcus/Elena/Ron: Left/Right (arriving/departing)")
    print("   - Older Woman: Right")
    print("6. Duck ambient layers to -12dB when dialogue plays")
    print("7. Export as 48kHz/24-bit WAV master")
    print("8. Convert to 256-320kbps MP3 for web: the_clearing_narration.mp3")
    print("9. Place in frontend/assets/audio/CINEMATIC_AUDIO/")
    print("-" * 70)
    
    print(f"\n📂 Segments location: {output_dir}\n")
    
    return successful, failed


# ==============================================================================
# ALTERNATIVE: SINGLE-FILE NARRATION (NARRATOR ONLY)
# ==============================================================================

def generate_narrator_only():
    """
    Alternative approach: Generate only the NARRATOR parts as a single file
    (For simpler integration if you want to mix dialogue separately later)
    """
    
    print("=" * 70)
    print("THE CLEARING - Narrator-Only Generation (Ava)")
    print("=" * 70)
    
    script_path = Path(__file__).parent / "stories" / "the_clearing.txt"
    output_file = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO" / "the_clearing_narrator_only.mp3"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Parse and filter narrator segments
    print("\n📖 Parsing script (narrator only)...")
    all_segments = parse_script(script_path)
    narrator_segments = [s for s in all_segments if s['character'] == 'NARRATOR']
    
    print(f"   Found {len(narrator_segments)} narrator segments")
    
    # Combine into single text
    narrator_text = "\n\n".join([s['text'] for s in narrator_segments])
    
    # Generate single file
    print(f"\n🎙️  Generating narrator audio...")
    
    success = generate_audio_segment(
        segment={'text': narrator_text, 'character': 'NARRATOR'},
        output_file=str(output_file),
        voice_name=VOICES["NARRATOR"],
        character_type="NARRATOR"
    )
    
    if success:
        print(f"\n✅ Narrator audio saved: {output_file}")
    else:
        print(f"\n❌ Generation failed")
    
    return success


# ==============================================================================
# MAIN
# ==============================================================================

if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 70)
    print("AZURE TTS GENERATOR - THE CLEARING")
    print("=" * 70)
    print("\nChoose generation mode:")
    print("1. Full multi-character stems (recommended for cinematic mixing)")
    print("2. Narrator-only (simpler, single file)")
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
        print("Invalid choice. Exiting...")
        sys.exit(1)
