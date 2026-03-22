# Automated deploy + Cloudflare media (without sharing passwords)

## Important: I can’t “take access” or log in for you

**Do not paste** GitHub passwords, Personal Access Tokens, Cloudflare API tokens, or Render keys into chat with anyone (including AI tools). Those secrets should only go into:

- **Your PC** (Git credential manager / SSH agent)
- **GitHub / Vercel / Render / Cloudflare dashboards** (each service’s own “Secrets” or “Environment Variables” section)

That’s how you stay safe. Automation still works: **you connect each service once**, then **every `git push` deploys**—no manual upload each time.

---

## The automation model (recommended)

| Step | Who does it | What happens |
|------|-------------|----------------|
| 1 | You (one time) | Create GitHub repo **ADI1254/your-repo-name** (you’re on the “Create repository” screen—pick a name, e.g. `dreamevo` or `dreampulse`). |
| 2 | You (one time) | `git push` from your machine (see `docs/PUSH_TO_GITHUB.md`). |
| 3 | You (one time) | **Vercel** → Import that GitHub repo → Root = `frontend` → add env vars → Save. |
| 4 | You (one time) | **Render** → New Web Service → same repo → Root = `backend` → add start command → Save. |
| 5 | Ongoing | You only run **`git push`**. Vercel + Render **pull from GitHub and redeploy** automatically. |

No AI tool needs your tokens. **You** paste env vars only inside Vercel/Render/Cloudflare dashboards.

---

## Cloudflare: video + audio already in the cloud

You said media is on **Cloudflare**—usually **R2** (storage) + **public URL** (custom domain or `r2.dev`).

### 1. Public URLs for files

Upload (or sync) files so they’re reachable over **HTTPS**, for example:

- `https://media.yourdomain.com/intro_video.mp4`
- `https://media.yourdomain.com/cinematic/journey_calm_narration.mp3`
- `https://media.yourdomain.com/ambient.mp3`
- Same folder layout as local `assets/videos/...` if you use `DREAMEVO_MEDIA_BASE_URL`

### 2. CORS (required for browser playback)

In **R2 bucket** → **Settings** → **CORS**, allow your **Vercel site origin** (and localhost for testing), e.g.:

```json
[
  {
    "AllowedOrigins": ["https://your-app.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"]
  }
]
```

### 3. Wire the frontend via Vercel env vars

After `npm run vercel-build`, the app reads **`config.runtime.js`**, built from environment variables. Set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview as you like):

| Variable | Example | Purpose |
|----------|---------|---------|
| `DREAMEVO_API_BASE` | `https://your-api.onrender.com` | FastAPI: `/story/...`, optional `/static/...` |
| `DREAMEVO_INTRO_VIDEO_URL` | `https://media.yourdomain.com/intro_video.mp4` | Intro clip (overrides API static path) |
| `DREAMEVO_MEDIA_BASE_URL` | `https://media.yourdomain.com` | Prefix for `assets/videos/...` |
| `DREAMEVO_STEMS_BASE_URL` | `https://media.yourdomain.com/cinematic` | Stem MP3s (`journey_calm_narration.mp3`, etc.) |
| `DREAMEVO_AMBIENT_URL` | `https://media.yourdomain.com/ambient.mp3` | Landing / journey ambient loop |

Redeploy the Vercel project after changing variables.

**Local dev:** use `frontend/config.js` (from `config.example.js`) with the same `window.DREAMEVO_*` lines—**never commit** real `config.js` (it’s gitignored).

---

## Naming your GitHub repo (from your screenshot)

On **Create a new repository**:

1. **Repository name:** e.g. `dreamevo` or `dreampulse` (any valid name).
2. Leave **README / .gitignore / license** off (this repo already has them).
3. **Create repository**, then follow `docs/PUSH_TO_GITHUB.md` with:

   `https://github.com/ADI1254/REPO_NAME.git`

---

## Optional: GitHub Actions

This repo can include a small workflow that runs `npm run vercel-build` on every push to verify the build script. **Deploy** still happens on **Vercel/Render** when those apps are connected to the repo—no deploy secrets need to live in GitHub unless you choose advanced setups.

See `.github/workflows/ci-frontend.yml` if present.

---

## Summary

- **I can’t push or host for you** using your passwords—by design.
- **You automate** by: GitHub + Vercel + Render **connected once**, media on **Cloudflare with CORS**, env vars in **Vercel** for all `DREAMEVO_*` URLs.
- Every future change: **`git push`** → sites update automatically.
