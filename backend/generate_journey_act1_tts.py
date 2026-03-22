"""
DreamPulse — Journey Act 1 Opening — Cinematic TTS Narration
Uses edge-tts (primary, free) or gTTS + pydub for pauses. Validates all files before use.

Requirements:
    pip install edge-tts pydub imageio-ffmpeg   (imageio-ffmpeg = bundled ffmpeg for mp3)
    Optional: pip install gtts   (fallback)

Usage:
    python generate_journey_act1_tts.py
    python generate_journey_act1_tts.py --name "Alex"
    python generate_journey_act1_tts.py --engine gtts
"""

import re
import time
import asyncio
from pathlib import Path

from pydub import AudioSegment

# Use bundled ffmpeg (imageio-ffmpeg) so pydub can load/export mp3 without system ffmpeg
try:
    import imageio_ffmpeg
    _ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    AudioSegment.converter = _ffmpeg_exe
    AudioSegment.ffmpeg = _ffmpeg_exe
except Exception:
    pass

# ==============================================================================
# CONFIG
# ==============================================================================

SCRIPT_PATH = Path(__file__).parent / "stories" / "journey_act1_opening_tts.txt"
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "assets" / "audio" / "CINEMATIC_AUDIO"
OUTPUT_FILE_MP3 = OUTPUT_DIR / "journey_act1_opening_narration.mp3"
OUTPUT_FILE_WAV = OUTPUT_DIR / "journey_act1_opening_narration.wav"
STEMS_DIR = OUTPUT_DIR / "journey_act1_stems"
# Temp dir for intermediate files (avoids permission issues, easy cleanup)
TMP_DIR = Path(__file__).parent / ".tts_tmp"

# Default name when pre-rendering one file for all users (personalization = runtime TTS later)
DEFAULT_USER_NAME = "friend"

# gTTS: slow = calmer, more breath-aware
TTS_SLOW = True
TTS_LANG = "en"
TTS_TLD = "com"

# Min file size (bytes) to consider TTS output valid
MIN_VALID_BYTES = 500
# Rate limit (seconds) between gTTS calls
RATE_LIMIT = 0.8
# edge-tts voice: calm, slow-friendly (en-US-JennyNeural = natural female)
EDGE_VOICE = "en-US-JennyNeural"
EDGE_RATE = "-5%"  # Slightly slower for calm feel


# ==============================================================================
# PARSER
# ==============================================================================

def parse_script(path, user_name=DEFAULT_USER_NAME):
    """
    Parse journey_act1_opening_tts.txt into a list of segments.
    Each segment is either {"type": "pause", "seconds": float} or {"type": "speech", "text": str}.
    """
    raw = path.read_text(encoding="utf-8")
    segments = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # [PAUSE 1s], [PAUSE 1.5s], [PAUSE 2.5s], etc.
        m = re.match(r"\[PAUSE\s+([\d.]+)s?\]", line, re.IGNORECASE)
        if m:
            segments.append({"type": "pause", "seconds": float(m.group(1))})
            continue
        # Speech: replace placeholder
        text = line.replace("{USER_NAME}", user_name).strip()
        if text:
            segments.append({"type": "speech", "text": text})
    return segments


# ==============================================================================
# AUDIO GENERATION
# ==============================================================================

def _safe_unlink(p):
    try:
        if p.exists():
            p.unlink()
    except (PermissionError, OSError):
        pass


async def _generate_speech_edge_async(text, out_path):
    """Generate one phrase with edge-tts (free, reliable). Saves MP3."""
    import edge_tts
    communicate = edge_tts.Communicate(text, EDGE_VOICE, rate=EDGE_RATE)
    await communicate.save(str(out_path))


def generate_speech_edge(text, out_path):
    """Sync wrapper for edge-tts."""
    asyncio.run(_generate_speech_edge_async(text, out_path))


def generate_speech_gtts(text, out_path):
    """Generate one phrase with gTTS (slow, calm). Requires network."""
    from gtts import gTTS
    tts = gTTS(text=text, lang=TTS_LANG, tld=TTS_TLD, slow=TTS_SLOW)
    tts.save(str(out_path))


def generate_speech_pyttsx3(text, out_path):
    """Generate one phrase with pyttsx3 (offline). Saves WAV."""
    import pyttsx3
    engine = pyttsx3.init()
    engine.setProperty("rate", 140)  # Slower = calmer
    engine.setProperty("volume", 1.0)
    engine.save_to_file(text, str(out_path))
    engine.runAndWait()


def _get_ffmpeg_exe():
    """Return path to ffmpeg (system or imageio-ffmpeg bundle)."""
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def _mp3_to_wav_via_ffmpeg(mp3_path, wav_path):
    """Convert mp3 to wav using ffmpeg. Returns True on success."""
    import subprocess
    ffmpeg = _get_ffmpeg_exe()
    try:
        subprocess.run(
            [ffmpeg, "-y", "-i", str(mp3_path), "-acodec", "pcm_s16le", "-ar", "44100", str(wav_path)],
            capture_output=True, timeout=30, check=True
        )
        return wav_path.exists() and wav_path.stat().st_size >= MIN_VALID_BYTES
    except (FileNotFoundError, subprocess.CalledProcessError, subprocess.TimeoutExpired):
        return False


def _load_valid_segment(tmp_path):
    """Load segment only if file exists, has valid size, and pydub can decode it.
    If mp3 load fails (e.g. no ffmpeg), try converting to wav with ffmpeg first."""
    if not tmp_path.exists():
        return None
    if tmp_path.stat().st_size < MIN_VALID_BYTES:
        _safe_unlink(tmp_path)
        return None
    try:
        if tmp_path.suffix.lower() == ".wav":
            return AudioSegment.from_wav(str(tmp_path))
        return AudioSegment.from_mp3(str(tmp_path))
    except Exception:
        # pydub often fails on mp3 without ffmpeg; try converting to wav
        wav_path = tmp_path.with_suffix(".wav")
        if _mp3_to_wav_via_ffmpeg(tmp_path, wav_path):
            try:
                seg = AudioSegment.from_wav(str(wav_path))
                _safe_unlink(wav_path)
                return seg
            except Exception:
                _safe_unlink(wav_path)
        _safe_unlink(tmp_path)
        return None


def build_full_narration(segments, output_base_path, export_stems=False, engine="edge"):
    """
    For each segment: generate speech (edge-tts or gTTS) or silence (pydub), then concatenate.
    Validates every file before use. Exports only if combined duration > 0.
    engine: "edge" (default), "gtts", or "pyttsx3"
    """
    # Clean any leftover temp files in output dir
    for f in OUTPUT_DIR.glob("_tmp_*"):
        _safe_unlink(f)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    if export_stems:
        STEMS_DIR.mkdir(parents=True, exist_ok=True)

    def generate_speech(text, path):
        if engine == "pyttsx3":
            generate_speech_pyttsx3(text, path)
        elif engine == "gtts":
            generate_speech_gtts(text, path)
        else:
            generate_speech_edge(text, path)

    combined = AudioSegment.empty()
    stem_index = 0

    for i, seg in enumerate(segments):
        if seg["type"] == "pause":
            duration_ms = int(seg["seconds"] * 1000)
            silence = AudioSegment.silent(duration=duration_ms)
            combined += silence
            continue

        stem_index += 1
        ext = "wav" if engine == "pyttsx3" else "mp3"
        tmp_path = TMP_DIR / f"journey_act1_{i}.{ext}"
        try:
            generate_speech(seg["text"], tmp_path)
            if engine == "gtts":
                time.sleep(RATE_LIMIT)
        except Exception as e:
            print(f"   [X] TTS failed: {e}")
            _safe_unlink(tmp_path)
            continue

        seg_audio = _load_valid_segment(tmp_path)
        _safe_unlink(tmp_path)
        if seg_audio is None:
            print(f"   [X] Invalid/empty output for: \"{seg['text'][:40]}...\"")
            continue
        combined += seg_audio
        if export_stems:
            stem_path = STEMS_DIR / f"segment_{stem_index:03d}_narration.{ext}"
            try:
                seg_audio.export(str(stem_path), format="mp3")
            except Exception:
                seg_audio.export(str(stem_path.with_suffix(".wav")), format="wav")
        print(f"   [OK] \"{seg['text'][:50]}{'...' if len(seg['text'])>50 else ''}\"")

    duration_sec = len(combined) / 1000.0
    out_mp3 = output_base_path.with_suffix(".mp3")
    out_wav = output_base_path.with_suffix(".wav")
    if duration_sec < 0.1:
        print("\n   [X] No valid audio generated; skipping export.")
        return 0.0
    try:
        combined.export(str(out_mp3), format="mp3", bitrate="192k")
        size_mb = out_mp3.stat().st_size / (1024 * 1024)
        print(f"\n   [OK] Exported: {out_mp3.name} - {duration_sec:.1f}s, {size_mb:.2f} MB")
    except Exception:
        combined.export(str(out_wav), format="wav")
        size_mb = out_wav.stat().st_size / (1024 * 1024)
        print(f"\n   [OK] Exported: {out_wav.name} - {duration_sec:.1f}s, {size_mb:.2f} MB (WAV)")
    return duration_sec


# ==============================================================================
# MAIN
# ==============================================================================

def main():
    import argparse
    p = argparse.ArgumentParser(description="Generate Journey Act 1 opening narration (gTTS + pauses)")
    p.add_argument("--name", default=DEFAULT_USER_NAME, help="Default name for USER_NAME (default: friend)")
    p.add_argument("--stems", action="store_true", help="Also export per-phrase stems to journey_act1_stems/")
    p.add_argument("--engine", choices=("edge", "gtts", "pyttsx3"), default="edge",
                   help="TTS engine: edge (default), gtts, pyttsx3")
    args = p.parse_args()

    print("=" * 60)
    print("DreamPulse - Journey Act 1 Opening - Cinematic TTS")
    print("=" * 60)
    print(f"   Script: {SCRIPT_PATH.name}")
    print(f"   Default name: {args.name}")
    print(f"   Output dir: {OUTPUT_DIR}")
    print("=" * 60)

    if not SCRIPT_PATH.exists():
        print(f"\n[ERROR] Script not found: {SCRIPT_PATH}")
        return 1

    print("\nParsing script...")
    segments = parse_script(SCRIPT_PATH, user_name=args.name)
    speech_count = sum(1 for s in segments if s["type"] == "speech")
    pause_count = sum(1 for s in segments if s["type"] == "pause")
    print(f"   {speech_count} speech segments, {pause_count} pauses")

    out_base = OUTPUT_DIR / "journey_act1_opening_narration"
    print(f"\nGenerating narration (engine={args.engine})...\n")
    build_full_narration(segments, out_base, export_stems=args.stems, engine=args.engine)

    # Cleanup temp dir
    if TMP_DIR.exists():
        for f in TMP_DIR.glob("journey_act1_*"):
            _safe_unlink(f)

    print("\n" + "=" * 60)
    print("Done. Use journey_act1_opening_narration.mp3 (or .wav) in your app.")
    print("For personalization, re-run with --name \"FirstName\" or use runtime TTS.")
    print("=" * 60 + "\n")
    return 0


if __name__ == "__main__":
    exit(main())
