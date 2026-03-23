# Short-lived media URLs (R2 presign)

This adds **defense in depth**, not DRM:

- The **browser** still receives audio/video bytes to play them — determined users can still record or inspect the network.
- What you get: **no permanent public URL** baked into the frontend; links **expire** (default 15 minutes); **rate limits** on the presign API; object keys are chosen **server-side** only.

## When presign is active

The API returns `presign_enabled: true` from `GET /media/status` when these **Render** (or local) env vars are set:

| Variable | Required | Example |
|----------|----------|---------|
| `R2_ACCOUNT_ID` | Yes | Cloudflare dashboard → R2 → account id |
| `R2_ACCESS_KEY_ID` | Yes | R2 API token |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API token secret |
| `R2_BUCKET_NAME` | Yes | Your bucket name |

Optional:

| Variable | Default |
|----------|---------|
| `R2_ENDPOINT` | `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `R2_KEY_PREFIX` | (empty) |
| `R2_KEY_INTRO` | `intro/intro_video.mp4` |
| `R2_KEY_AMBIENT` | `audio/ambient.mp3` |
| `R2_STEM_PREFIX` | `cinematic/` |
| `R2_STEM_EXT` | `.mp3` |
| `R2_PRESIGN_EXPIRES` | `900` (seconds, max 3600) |

Stems are stored as: `{R2_STEM_PREFIX}{world}_{mood}_{part}.mp3`  
Example: `cinematic/journey_calm_narration.mp3`

## API

- `GET /media/status` → `{ presign_enabled, ttl_seconds }`
- `POST /media/presign` with JSON body `{ "items": [ ... ] }` — see `backend/media_secure.py` for allowed `kind` / `world` / `mood` / `part`.

## Frontend

If `presign_enabled` is false, behavior is unchanged (public `DREAMEVO_*` URLs or local `assets/` paths).

## CORS

R2 public bucket CORS must allow your **Vercel** origin for `GET`/`HEAD` on the presigned URL host (often the `r2.dev` or custom domain used in the signed URL).
