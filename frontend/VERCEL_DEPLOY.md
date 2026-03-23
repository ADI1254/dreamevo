# Deploy DREAMEVO on Vercel (frontend + serverless API)

**MVP architecture:** one Vercel project serves static files **and** `/api/*` serverless functions. No separate Python/Render host is required for email capture or story text.

| Layer | Role |
|--------|------|
| **Vercel** | Static site + Node serverless (`/api/save-email`, `/api/story/...`, optional media stubs) |
| **Supabase** | Postgres (`email_captures`, optional analytics with anon key in `config.js`) |
| **Cloudflare** | DNS / CDN in front of Vercel (optional) |

## 1. Import the repo

1. [Vercel](https://vercel.com) → **Add New…** → **Project** → import repo.
2. **Root Directory**: `frontend`.
3. **Framework Preset**: **Other**.
4. **Build Command**: `npm run vercel-build` (see `vercel.json`).
5. **Output Directory**: `.`
6. **Install Command**: `npm install` (installs `@supabase/supabase-js` for API routes).

## 2. Environment variables (Vercel)

**Serverless API (required for email waitlist):**

| Name | Required | Notes |
|------|----------|--------|
| `SUPABASE_URL` | **Yes** | Project URL from Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | **Server only.** Never expose in the browser or commit. |

**Build-time / client (optional — injected into `config.runtime.js`):**

| Name | Notes |
|------|--------|
| `DREAMEVO_API_BASE` | Usually **omit** on Vercel (same-origin `/api`). Set only if API is on another origin. |
| `DREAMEVO_INTRO_VIDEO_URL` | Full URL to intro MP4 if not using `/static/intro_video.mp4` |
| `DREAMEVO_MEDIA_BASE_URL` | Prefix for `assets/videos/...` |
| `DREAMEVO_STEMS_BASE_URL` | Stem MP3s base URL |
| `DREAMEVO_AMBIENT_URL` | Landing ambient loop URL |

**Client Supabase (optional):** For `journey_analytics` / `feedback` / `site_settings`, keep `config.js` (from `config.example.js`) with **anon** key — not the service role.

## 3. Supabase: `email_captures`

Ensure a **unique constraint** on `email` so upserts work:

```sql
create table if not exists public.email_captures (
  email text primary key,
  captured_at timestamptz not null default now(),
  source text,
  mode_selected text,
  user_agent text
);
```

## 4. Local development

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with real Supabase URL + service role
npx vercel dev
```

Open the URL Vercel prints (often `http://localhost:3000`). Email submit and `/api/story/...` work against local serverless.

**Plain `python server.py` or `http.server`:** API routes are **not** available unless you use `vercel dev`.

## 5. Legacy Python backend (`backend/main.py`)

Optional for local TTS/video experiments. **Not required** for production if you deploy only the Vercel project above.

## 6. File map

```
frontend/
├── api/
│   ├── save-email.js          # POST /api/save-email
│   ├── story/[world]/[mood].js # GET /api/story/:world/:mood
│   └── media/                 # stubs (presign disabled on MVP)
├── data/stories/              # Story .txt files for serverless
├── scripts/vercel-build.js    # Writes config.runtime.js from env
└── vercel.json
```
