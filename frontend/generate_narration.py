#!/usr/bin/env python3
"""
ElevenLabs Narration Generator for DreamPulse
==============================================

This script automates the generation of high-quality narration
using the ElevenLabs API for all DreamPulse world/mood combinations.

Requirements:
- ElevenLabs API key (free tier: 10k chars/month, paid: starts at $5/mo)
- Python 3.8+
- Install: pip install elevenlabs python-dotenv

Usage:
1. Create .env file with: ELEVENLABS_API_KEY=your_key_here
2. Run: python generate_narration.py
3. Output: frontend/assets/audio/CINEMATIC_AUDIO/{world}_{mood}_narration.mp3

Voices (can customize in VOICE_CONFIG below):
- Journey: "Antoni" (soft male, reassuring guide)
- Sanctuary: "Bella" (warm female, nurturing presence)
- Exploration: "Rachel" (bright female, curious wonder)
"""

import os
import sys
from pathlib import Path
from typing import Dict, List
from elevenlabs import generate, save, voices, Voice, VoiceSettings
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not API_KEY:
    print("❌ ERROR: ELEVENLABS_API_KEY not found in .env file")
    print("   Create a .env file with: ELEVENLABS_API_KEY=your_key_here")
    print("   Get your key at: https://elevenlabs.io/app/settings/api-keys")
    sys.exit(1)

# ============================================
# Configuration
# ============================================

# Story file paths (source narration text)
STORIES_DIR = Path("../../backend/stories")

# Output directory for generated narration stems
OUTPUT_DIR = Path("../assets/audio/CINEMATIC_AUDIO")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# World/mood combinations (9 total)
WORLDS = ["journey", "sanctuary", "exploration"]
MOODS = ["calm", "confident", "curious"]

# Voice selection per world (ElevenLabs voice IDs or names)
VOICE_CONFIG = {
    "journey": {
        "voice_name": "Antoni",  # Soft male, reassuring
        "voice_id": "ErXwobaYiN019PkySvjV",  # ElevenLabs voice ID
        "settings": {
            "stability": 0.5,        # Balance between consistency and emotion
            "similarity_boost": 0.85, # How closely to match original voice
            "style": 0.3,            # Amount of stylistic variation (0-1)
            "use_speaker_boost": True # Enhance speaker clarity
        }
    },
    "sanctuary": {
        "voice_name": "Bella",  # Warm female, nurturing
        "voice_id": "EXAVITQu4vr4xnSDxMaL",
        "settings": {
            "stability": 0.6,        # More stable for calming effect
            "similarity_boost": 0.85,
            "style": 0.2,            # Gentler, less dramatic
            "use_speaker_boost": True
        }
    },
    "exploration": {
        "voice_name": "Rachel",  # Bright female, curious
        "voice_id": "21m00Tcm4TlvDq8ikWAM",
        "settings": {
            "stability": 0.45,       # More dynamic for playfulness
            "similarity_boost": 0.8,
            "style": 0.4,            # More expressive
            "use_speaker_boost": True
        }
    }
}

# Mood-specific pacing adjustments (handled by model parameter)
MOOD_CONFIG = {
    "calm": {
        "model": "eleven_multilingual_v2",  # Supports emotional range
        "note": "Read slowly with long pauses between sentences"
    },
    "confident": {
        "model": "eleven_multilingual_v2",
        "note": "Read steadily with clear, measured pacing"
    },
    "curious": {
        "model": "eleven_multilingual_v2",
        "note": "Read with gentle wonder and upward inflections"
    }
}

# ============================================
# Helper Functions
# ============================================

def load_story_text(world: str, mood: str) -> str:
    """Load story text from backend/stories/{world}_{mood}.txt"""
    story_file = STORIES_DIR / f"{world}_{mood}.txt"
    
    if not story_file.exists():
        raise FileNotFoundError(f"Story file not found: {story_file}")
    
    with open(story_file, 'r', encoding='utf-8') as f:
        text = f.read().strip()
    
    print(f"📖 Loaded story: {world}_{mood}.txt ({len(text)} chars)")
    return text

def estimate_cost(text: str) -> dict:
    """Estimate ElevenLabs API cost for text generation"""
    char_count = len(text)
    
    # Pricing (as of Jan 2026 - check elevenlabs.io/pricing)
    # Free tier: 10,000 chars/month
    # Starter ($5/mo): 30,000 chars/month
    # Creator ($22/mo): 100,000 chars/month
    
    free_tier_limit = 10000
    
    return {
        "chars": char_count,
        "within_free_tier": char_count <= free_tier_limit,
        "estimated_cost": f"${(char_count / 1000) * 0.30:.2f}" if char_count > free_tier_limit else "$0 (free tier)"
    }

def generate_narration(world: str, mood: str, dry_run: bool = False) -> Path:
    """
    Generate narration for a specific world/mood combination
    
    Args:
        world: journey, sanctuary, or exploration
        mood: calm, confident, or curious
        dry_run: If True, estimate cost but don't generate
    
    Returns:
        Path to generated audio file
    """
    print(f"\n{'='*60}")
    print(f"🎬 Generating: {world.upper()} × {mood.upper()}")
    print(f"{'='*60}")
    
    # Load story text
    story_text = load_story_text(world, mood)
    
    # Estimate cost
    cost_info = estimate_cost(story_text)
    print(f"💰 Characters: {cost_info['chars']}")
    print(f"💰 Estimated Cost: {cost_info['estimated_cost']}")
    print(f"💰 Within Free Tier: {'✅ Yes' if cost_info['within_free_tier'] else '❌ No'}")
    
    if dry_run:
        print("🔍 DRY RUN - Skipping generation")
        return None
    
    # Get voice configuration
    voice_config = VOICE_CONFIG[world]
    mood_config = MOOD_CONFIG[mood]
    
    print(f"🎙️ Voice: {voice_config['voice_name']} ({voice_config['voice_id']})")
    print(f"🎚️ Model: {mood_config['model']}")
    print(f"📝 Direction: {mood_config['note']}")
    
    # Generate audio using ElevenLabs
    print("⏳ Generating audio (this may take 30-60 seconds)...")
    
    try:
        audio = generate(
            text=story_text,
            voice=Voice(
                voice_id=voice_config['voice_id'],
                settings=VoiceSettings(**voice_config['settings'])
            ),
            model=mood_config['model']
        )
        
        # Save to file
        output_file = OUTPUT_DIR / f"{world}_{mood}_narration.mp3"
        save(audio, str(output_file))
        
        file_size_mb = output_file.stat().st_size / (1024 * 1024)
        print(f"✅ Generated: {output_file.name} ({file_size_mb:.2f} MB)")
        
        return output_file
        
    except Exception as e:
        print(f"❌ Generation failed: {e}")
        raise

def list_available_voices():
    """List all available ElevenLabs voices for reference"""
    print("\n🎙️ Available ElevenLabs Voices:")
    print("="*60)
    
    try:
        all_voices = voices()
        for voice in all_voices:
            print(f"- {voice.name}: {voice.voice_id}")
            if hasattr(voice, 'labels'):
                print(f"  Labels: {', '.join(voice.labels.values())}")
    except Exception as e:
        print(f"❌ Failed to fetch voices: {e}")

# ============================================
# Main Generation Workflow
# ============================================

def main():
    """Generate all narration stems or run in dry-run mode"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate DreamPulse narration with ElevenLabs")
    parser.add_argument("--dry-run", action="store_true", help="Estimate costs without generating")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--world", choices=WORLDS, help="Generate only this world")
    parser.add_argument("--mood", choices=MOODS, help="Generate only this mood")
    
    args = parser.parse_args()
    
    # List voices and exit
    if args.list_voices:
        list_available_voices()
        return
    
    # Determine which combinations to generate
    worlds_to_generate = [args.world] if args.world else WORLDS
    moods_to_generate = [args.mood] if args.mood else MOODS
    
    total_combinations = len(worlds_to_generate) * len(moods_to_generate)
    
    print(f"\n🎬 DreamPulse Narration Generator")
    print(f"="*60)
    print(f"📊 Generating {total_combinations} narration stems")
    print(f"🌍 Worlds: {', '.join(worlds_to_generate)}")
    print(f"😌 Moods: {', '.join(moods_to_generate)}")
    print(f"💾 Output: {OUTPUT_DIR}")
    
    if args.dry_run:
        print(f"🔍 DRY RUN MODE - Estimating costs only")
    
    total_chars = 0
    generated_files = []
    
    # Generate each combination
    for world in worlds_to_generate:
        for mood in moods_to_generate:
            try:
                result = generate_narration(world, mood, dry_run=args.dry_run)
                
                if result:
                    generated_files.append(result)
                
                # Track total characters
                story_text = load_story_text(world, mood)
                total_chars += len(story_text)
                
            except Exception as e:
                print(f"\n❌ Failed to generate {world}_{mood}: {e}")
                continue
    
    # Summary
    print(f"\n{'='*60}")
    print(f"📊 GENERATION SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Files Generated: {len(generated_files)}/{total_combinations}")
    print(f"📝 Total Characters: {total_chars:,}")
    
    if not args.dry_run:
        cost_info = estimate_cost("a" * total_chars)
        print(f"💰 Estimated Total Cost: {cost_info['estimated_cost']}")
        print(f"\n📁 Output Location: {OUTPUT_DIR.resolve()}")
        print(f"\n🎯 Next Steps:")
        print(f"   1. Listen to each narration file")
        print(f"   2. Verify timing and emotional tone")
        print(f"   3. Import to DAW for processing (EQ, compression, reverb)")
        print(f"   4. Export final stems following AUDIO_PRODUCTION_SPECS.md")
    else:
        print(f"\n🔍 This was a dry run. Use without --dry-run to generate files.")
    
    print(f"\n✨ Done!")

if __name__ == "__main__":
    main()
