import os

from fastapi import Body, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from media_secure import build_presign_response, presign_configured

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


def _client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


@app.get("/media/status")
def media_status():
    """Frontend calls this to see if short-lived R2 URLs are available."""
    ttl = int(os.getenv("R2_PRESIGN_EXPIRES", "900"))
    return {"presign_enabled": presign_configured(), "ttl_seconds": ttl}


@app.post("/media/presign")
def media_presign(request: Request, body: dict = Body(...)):
    """
    Return presigned GET URLs (expire in minutes). Keys are derived server-side from
    allowed world/mood/parts only — not arbitrary paths.
    """
    items = body.get("items")
    if not isinstance(items, list):
        return {"error": "invalid_body", "presign_enabled": presign_configured()}
    return build_presign_response(items, _client_ip(request))

