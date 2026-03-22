# Push this project to GitHub (for Render + Vercel)

I can’t log into your GitHub account from Cursor—you run these commands **on your PC** in a terminal (PowerShell is fine).

## 1. Create an empty repo on GitHub

1. Open [github.com/new](https://github.com/new).
2. **Repository name:** e.g. `dreampulse` or `dreamevo`.
3. **Public** or **Private** (your choice).
4. **Do not** add README, .gitignore, or license (this repo already has files).
5. Click **Create repository**. GitHub will show you commands—use the steps below instead so they match your folder.

## 2. In your project folder

```powershell
cd "F:\DREAMPULSE 6 JAN 26\NEW\dreampulse"
```

### If Git is not initialized yet

```powershell
git init
git branch -M main
```

### Remove accidentally tracked junk (if you previously staged `__pycache__` or `.pyc`)

```powershell
git rm -r --cached backend/__pycache__ 2>$null
git rm -r --cached frontend/__pycache__ 2>$null
```

### Stage everything (respects `.gitignore`)

```powershell
git add .
git status
```

You should **not** see `.venv/`, `__pycache__/`, `frontend/config.js`, `backend/SkyReels-V2/`, or `TTS/`.

### Commit

```powershell
git commit -m "Initial commit: DREAMEVO frontend + FastAPI backend for Render/Vercel"
```

### Add GitHub as remote (replace YOUR_USER and REPO)

```powershell
git remote add origin https://github.com/YOUR_USER/REPO.git
```

### Push

```powershell
git push -u origin main
```

If GitHub asks you to log in, use a **Personal Access Token** (classic) as the password when using HTTPS, or set up **SSH** and use `git@github.com:YOUR_USER/REPO.git`.

---

## 3. After the push

- **Render:** New Web Service → connect this repo → root directory **`backend`** → see `docs/HOSTING_FRONTEND_AND_BACKEND.md`.
- **Vercel:** Import same repo → root **`frontend`** → set `DREAMEVO_API_BASE` → see `frontend/VERCEL_DEPLOY.md`.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| **File too large** | `intro_video.mp4` might exceed GitHub’s 100MB limit. Use [Git LFS](https://git-lfs.github.com/) for that file, or host the video on R2/CDN and don’t commit the MP4. |
| **Push rejected** | `git pull origin main --rebase` then `git push` (only if you added a README on GitHub by mistake). |
| **config.js** | Stays ignored; use `config.example.js` / `config.runtime.js` on CI. |
