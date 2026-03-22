# Hosting the frontend (Vercel) and the backend (where?)

## Short answer

- **Vercel is built for:** static sites, Jamstack frontends, and **short-lived serverless functions** (often Node, also Python in limited form).
- **Your backend today is:** a **FastAPI** app meant to run as a normal web server (`uvicorn`), with **files on disk** (stories + `static/intro_video.mp4`).

So in practice:

| Part | Best fit on Vercel? | Typical approach |
|------|---------------------|------------------|
| **Frontend** (`frontend/`) | **Yes** | Deploy the `frontend` folder on Vercel (as you set up). |
| **Backend** (`backend/main.py`) | **Not the default** | Run it on a **small always-on** or **container** host (see below). |

You **do not** have to use two companies forever—but you **do** need **some** place that runs your Python API and serves your files. That place is often **not** the same Vercel project as your static UI, because Vercel doesn’t run `uvicorn main:app` like Railway or Render do out of the box.

---

## “Can’t Vercel handle both?”

**Partially.**

1. **Both in one Vercel project (frontend + API)**  
   - Vercel can host **static files** from your repo **and** **serverless functions**.  
   - Putting **FastAPI** on Vercel means **adapting** it to Vercel’s serverless model (one request → one function invocation, cold starts, limits on request/response size and duration).  
   - Serving a **large** `intro_video.mp4` from the same function is awkward; people usually put video on **R2, S3, or a CDN** and keep the API for JSON only.

2. **What we recommend for your current code**  
   - **Frontend → Vercel** (already documented in `frontend/VERCEL_DEPLOY.md`).  
   - **Backend → a Python-friendly host** (below).  
   - Set `DREAMEVO_API_BASE` on Vercel to that backend’s **https URL**.

This is the **simplest and most reliable** path for FastAPI + static story files + intro video without rewriting the app.

---

## Option A (recommended): Backend on Railway, Render, or Fly.io

These run a **Dockerfile** or **start command** and keep your app listening on a port—exactly what FastAPI expects.

### 1. Prepare the backend

From repo root, the app lives in `backend/`:

- `main.py` — FastAPI app  
- `stories/` — `.txt` files  
- `static/` — e.g. `intro_video.mp4`  
- `requirements.txt` — `fastapi`, `uvicorn` (added in this repo)

**Start command** (most platforms):

```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

(`$PORT` is often set by the host; some use `8080`—check their docs.)

### 2. Railway (example flow)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → pick this repo.  
2. **Root directory / working directory:** `backend` (or set start command to use `backend`).  
3. **Start command:**  
   `uvicorn main:app --host 0.0.0.0 --port $PORT`  
4. **Install:** Railway usually detects `requirements.txt` in the service root—point the service at `backend` so it finds `backend/requirements.txt`.  
5. After deploy, copy the **public HTTPS URL** (e.g. `https://something.up.railway.app`).  
6. In **Vercel** → your frontend project → **Environment Variables** → set:  
   `DREAMEVO_API_BASE` = that URL (no trailing slash).

### 3. Render (example flow)

1. [render.com](https://render.com) → **New** → **Web Service** → connect repo.  
2. **Root directory:** `backend`  
3. **Build command:** `pip install -r requirements.txt`  
4. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`  
5. Copy the service URL → same `DREAMEVO_API_BASE` on Vercel.

### 4. CORS

Your `main.py` already uses `allow_origins=["*"]`, so the Vercel frontend can call the API. For production, you can later restrict `allow_origins` to your real site URL only.

---

## Option B: “Everything on Vercel” (advanced)

If you insist on **only** Vercel:

1. Keep the **frontend** as today.  
2. Add **Vercel Serverless Functions** in Python **or** split routes into many small functions—this is **not** a drop-in for `uvicorn main:app`.  
3. **Large video:** host `intro_video.mp4` on **object storage + CDN** and set `DREAMEVO_INTRO_VIDEO_URL` in Vercel env (your frontend already supports that).

This usually means **extra engineering** compared to Option A. For your stack, **Option A is the practical “Vercel + backend” story**: Vercel handles the **site**, another service handles **Python + files**.

---

## Checklist after deploy

| Step | Action |
|------|--------|
| 1 | Backend URL opens in browser: `https://YOUR-API/` → JSON like `{"status":"DREAMEVO backend running"}`. |
| 2 | Story works: `https://YOUR-API/story/journey/calm` returns JSON with `story`. |
| 3 | Intro (if used): `https://YOUR-API/static/intro_video.mp4` returns video (200). |
| 4 | Vercel env `DREAMEVO_API_BASE` = `https://YOUR-API` (no slash at end). |
| 5 | Redeploy frontend on Vercel after changing env vars. |

---

## Summary

- **You need somewhere to run the FastAPI backend**—that’s “hosting the backend separately” from the **Vercel static frontend**, even if both are free tiers on different providers.  
- **Vercel can “handle both”** only if you **change** how the backend runs (serverless + likely CDN for video) or use **two Vercel-style pieces**: site + serverless API.  
- **Easiest path:** **Vercel = frontend**, **Railway/Render/Fly = backend**, **`DREAMEVO_API_BASE`** connects them.

See also: `frontend/VERCEL_DEPLOY.md` for the Vercel-only steps.
