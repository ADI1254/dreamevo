from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="DREAMEVO Backend")

# Serve intro and other assets at /static/... (e.g. /static/intro_video.mp4)
_static_dir = Path(__file__).resolve().parent / "static"
if _static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(_static_dir)), name="static")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "DREAMEVO backend running"}

@app.get("/story/{world}/{mood}")
def get_story(world: str, mood: str):
    story_path = Path(__file__).parent / "stories" / f"{world}_{mood}.txt"

    if not story_path.exists():
        return {"error": "Story not found"}

    story_text = story_path.read_text(encoding="utf-8")
    return {"world": world, "mood": mood, "story": story_text}

@app.get("/story/{world}")
def get_story_default(world: str):
    # Backward-compatible endpoint defaults to calm mood
    story_path = Path(__file__).parent / "stories" / f"{world}_calm.txt"

    if not story_path.exists():
        return {"error": "Story not found"}

    story_text = story_path.read_text(encoding="utf-8")
    return {"world": world, "mood": "calm", "story": story_text}


@app.get("/story/claude/tts")
def get_claude_tts():
    story_path = Path(__file__).parent / "stories" / "claude_story_tts.txt"

    if not story_path.exists():
        return {"error": "Claude TTS story not found"}

    story_text = story_path.read_text(encoding="utf-8")
    return {"world": "claude", "mood": "tts", "story": story_text}

