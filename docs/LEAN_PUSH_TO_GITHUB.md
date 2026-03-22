# Push only what you need to GitHub (lean repo)

Your machine may have **extra folders** (raw audio, video, experiments, Wix export, huge ML subprojects). **GitHub should hold the minimum** needed to:

- **Deploy the frontend** (Vercel): HTML, CSS, JS, small images, `package.json`, `vercel.json`, docs.
- **Deploy the API** (Render): `backend/main.py`, `backend/requirements.txt`, `backend/stories/*.txt`, optional small `backend/static/` (not huge video).

**Video / long audio on Cloudflare:** set `DREAMEVO_INTRO_VIDEO_URL`, `DREAMEVO_MEDIA_BASE_URL`, etc. in Vercel (see `docs/AUTOMATED_DEPLOY_AND_CLOUDFLARE.md`) so you **don’t need** multi‑GB files in git.

---

## What usually stays OUT of git

| Path / pattern | Why |
|----------------|-----|
| `.venv/`, `__pycache__/` | Regenerated with `pip install` |
| `frontend/config.js` | Secrets (Supabase); use `config.example.js` |
| `backend/SkyReels-V2/`, `TTS/` | Huge; not required for `main.py` API |
| `audio/` (repo root) | Raw exports; use CDN |
| `frontend/assets/audio/`, `frontend/assets/videos/` | Often large; mirror on R2 if needed |
| `frontend/SOUND EFFECTS/` | Large SFX packs |
| `wix-integration/` | Not needed for Vercel app |
| `backend/static/*.mp4` | Intro on R2 instead (see below) |
| `*.wav` | Large; optional in git |

**Root `.gitignore`** already lists most of these. Adjust it if you **want** to commit a specific folder (remove that line).

---

## Step 1 — Use the updated `.gitignore`

Pull the latest `.gitignore` from this repo (or copy from the project). Save it at:

`F:\DREAMPULSE 6 JAN 26\NEW\dreampulse\.gitignore`

---

## Step 2 — Stop tracking files that were already added (important)

If you ran `git add .` before, Git may still **track** huge files. Remove them from the index **without deleting files on disk**:

Open **PowerShell** in the project root:

```powershell
cd "F:\DREAMPULSE 6 JAN 26\NEW\dreampulse"

# See what Git thinks is tracked / staged
git status
```

**Untrack everything** (safe: working tree files stay on disk), then re-add with `.gitignore` applied:

```powershell
git rm -r --cached .
git add .
git status
```

You should **not** see `.venv`, `TTS`, `audio/`, big `*.mp4`, etc. If something huge still appears, add a line to `.gitignore` and run `git rm -r --cached path/to/folder` then `git add .` again.

---

## Step 3 — Commit the lean tree

```powershell
git commit -m "Lean codebase: frontend + API + stories; media on CDN"
```

If Git says “nothing to commit”, you’re already clean or not in a repo—in that case:

```powershell
git init
git branch -M main
git add .
git commit -m "Lean codebase: frontend + API + stories; media on CDN"
```

---

## Step 4 — Connect to `github.com/ADI1254/dreamevo`

Your remote already has **one commit** (README only). Pick **one** approach.

### Option A — Replace GitHub with your local (simplest)

Use only if you **don’t need** to keep the README commit on GitHub as history:

```powershell
git remote add origin https://github.com/ADI1254/dreamevo.git
git push -u origin main --force
```

`--force` overwrites `main` on GitHub with your local `main`. The old “Initial commit” README-only commit is replaced.

### Option B — Keep GitHub’s README and merge

```powershell
git remote add origin https://github.com/ADI1254/dreamevo.git
git fetch origin
git pull origin main --allow-unrelated-histories
# If merge conflicts in README.md, edit README.md, then:
# git add README.md
# git commit -m "Merge GitHub README with local project"
git push -u origin main
```

---

## Step 5 — Check size before push

```powershell
git count-objects -vH
```

If the pack is still huge, something large is tracked:

```powershell
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n -r | Select-Object -First 20
```

(On Windows PowerShell, use Git Bash for the one-liner above, or use **GitHub Desktop** / **git-sizer**.)

Remove big paths with `git rm -r --cached <path>`, commit again, then push.

---

## GitHub limits

- **~100 MB** per file (hard limit for normal Git).
- **Recommended repo size:** stay well under **1 GB** for a smooth experience.

If you must version a large binary, use **[Git LFS](https://git-lfs.github.com/)**—or **don’t commit it** and use Cloudflare R2 URLs only.

---

## After a successful push

- **Render:** connect `ADI1254/dreamevo`, root **`backend`**.
- **Vercel:** same repo, root **`frontend`**, env vars for API + Cloudflare media.

---

## Quick checklist

- [ ] `.gitignore` at repo root excludes heavy dirs.
- [ ] `git rm -r --cached .` then `git add .` so ignores apply.
- [ ] `git status` shows no multi‑GB paths.
- [ ] Remote `origin` → `https://github.com/ADI1254/dreamevo.git`
- [ ] `git push` (with `--force` only if you chose Option A)
