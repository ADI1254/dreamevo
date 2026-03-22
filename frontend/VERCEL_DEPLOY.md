# Deploy the DREAMEVO frontend on Vercel

The app is **static HTML/CSS/JS** in this folder.

**Important:** Vercel runs this **frontend** beautifully, but it does **not** run your **FastAPI** server (`uvicorn main:app`) the same way a Python host does. So the **backend** usually lives on **another service** (Railway, Render, Fly.io, etc.), and you point the frontend at it with `DREAMEVO_API_BASE`. That’s still “using Vercel for the site”—just not “one Vercel box running Python 24/7.”

**Full explanation + step-by-step backend hosting:** see **`../docs/HOSTING_FRONTEND_AND_BACKEND.md`**.

The Python API must be reachable over **HTTPS** and allowed by **CORS** (already `allow_origins=["*"]` in `backend/main.py` for development—tighten for production).

## 1. Push the repo to GitHub (or GitLab / Bitbucket)

## 2. Create a Vercel project

1. [Vercel Dashboard](https://vercel.com) → **Add New…** → **Project** → import the repo.
2. **Root Directory**: set to `frontend` (this folder).
3. **Framework Preset**: **Other** (or “No framework”).
4. **Build Command**: `npm run vercel-build` (already in `vercel.json`).
5. **Output Directory**: `.` (current directory).
6. **Install Command**: `npm install` (default).

## 3. Environment variables (Vercel)

Set in **Vercel → Project → Settings → Environment Variables**. `npm run vercel-build` writes `config.runtime.js` from these:

| Name | Required | Example |
|------|----------|---------|
| `DREAMEVO_API_BASE` | **Yes** for production | `https://your-api.onrender.com` (no trailing slash) |
| `DREAMEVO_INTRO_VIDEO_URL` | No | `https://media.yourdomain.com/intro_video.mp4` (e.g. Cloudflare R2 public URL) |
| `DREAMEVO_MEDIA_BASE_URL` | No | `https://media.yourdomain.com` — prefixes `assets/videos/...` |
| `DREAMEVO_STEMS_BASE_URL` | No | `https://media.yourdomain.com/cinematic` — stem MP3s |
| `DREAMEVO_AMBIENT_URL` | No | `https://media.yourdomain.com/ambient.mp3` |

See **`docs/AUTOMATED_DEPLOY_AND_CLOUDFLARE.md`** for CORS on R2 and the full automation flow.

## 4. Optional: Supabase / `config.js`

`config.js` is **gitignored** locally. On Vercel you can:

- Add **Environment Variables** for any future build-time injection, or  
- Use Vercel’s **Sensitive** env vars + extend `scripts/vercel-build.js` to emit them into `config.runtime.js`.

For local dev, keep copying `config.example.js` → `config.js` as today.

## 5. Backend checklist

- Deploy FastAPI with **`/story/{world}/{mood}`** and **`/static/intro_video.mp4`** (see `backend/main.py`).
- Set **`DREAMEVO_API_BASE`** on Vercel to that deployment’s **https** origin.
- Ensure story files exist for each **world** × **mood** you offer (`journey`, `sanctuary`, `clearing` × `calm`, `confident`, `curious`).

## 6. Deploy

Push to your main branch (or connect a preview branch). Vercel builds and serves the site.

**Note:** `debug.js` is still loaded in `index.html`; remove or gate it for production if you do not want extra logging.
