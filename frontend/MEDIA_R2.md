# Media on Cloudflare R2 (`media.dreamevo.org`)

**Default intro:** `{DREAMEVO_API_BASE or http://localhost:8000}/static/intro_video.mp4` (put the file in `backend/static/`).  
Override in `config.js` with full URL:

- `window.DREAMEVO_INTRO_VIDEO_URL = 'https://media.dreamevo.org/intro_video.mp4';`

**Flow:** the intro clip plays **once** when journey audio starts (muted so it does not clash with voice/ambient), then the experience is **audio-only** (no looping mood video).  
Optional `DREAMEVO_MEDIA_BASE_URL` still prefixes stem/asset paths where used.

## Optional: more files from R2

| Config | Effect |
|--------|--------|
| `DREAMEVO_MEDIA_BASE_URL` | Prefixes paths like `assets/videos/journey_calm.mp4` → `https://media.dreamevo.org/assets/videos/journey_calm.mp4` (mirror that path on R2). |
| `DREAMEVO_STEMS_BASE_URL` | Sets stem MP3 base (same filenames as `assets/audio/CINEMATIC_AUDIO/`). |
| `DREAMEVO_AMBIENT_URL` | Replaces `<audio id="ambientAudio">` source at startup. |

## CORS

If the browser blocks audio/video from R2, add a **CORS** policy on the bucket allowing your site origin (`https://dreamevo.org`, etc.) for `GET`/`HEAD`.
