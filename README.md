# DreamPulse — Guided Dream Immersion

A cinematic, immersive web experience for guided dream transitions.

## Quick Start

### Option 1: Start Both Servers (Recommended)
Double-click `start_all.bat` to start both backend and frontend servers.

### Option 2: Start Servers Separately

**Backend (Port 8000):**
```bash
# Windows
start_backend.bat

# Or manually:
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (Port 3000):**
```bash
# Windows
start_frontend.bat

# Or manually:
cd frontend
python server.py
```

### Option 3: Using Python HTTP Server (Alternative)
```bash
cd frontend
python -m http.server 3000
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Health Check**: http://localhost:8000/

## Deploy (GitHub → Vercel + Render)

- **Push only necessary files (lean repo):** [`docs/LEAN_PUSH_TO_GITHUB.md`](docs/LEAN_PUSH_TO_GITHUB.md)  
- **Push (generic):** [`docs/PUSH_TO_GITHUB.md`](docs/PUSH_TO_GITHUB.md)  
- **Automate deploy + Cloudflare media (no shared passwords):** [`docs/AUTOMATED_DEPLOY_AND_CLOUDFLARE.md`](docs/AUTOMATED_DEPLOY_AND_CLOUDFLARE.md)  
- **Frontend on Vercel:** [`frontend/VERCEL_DEPLOY.md`](frontend/VERCEL_DEPLOY.md)  
- **Backend on Render:** [`docs/HOSTING_FRONTEND_AND_BACKEND.md`](docs/HOSTING_FRONTEND_AND_BACKEND.md)

## Project Structure

```
dreampulse/
├── backend/
│   ├── main.py          # FastAPI backend server
│   └── stories/          # Story text files
├── frontend/
│   ├── index.html       # Main HTML
│   ├── style.css        # Cinematic styles
│   ├── script.js        # Application logic
│   ├── server.py        # Frontend HTTP server
│   └── assets/          # Images, videos, audio
└── start_all.bat        # Start both servers
```

## Requirements

### Backend
- Python 3.7+
- FastAPI
- Uvicorn

Install:
```bash
cd backend
pip install fastapi uvicorn[standard]
```

### Frontend
- Python 3.7+ (for HTTP server)
- Modern web browser with Web Speech API support

## Email storage (Supabase, free tier)

To store user emails in a database (e.g. for up to 10k users), use Supabase:

1. See **[frontend/SUPABASE_EMAIL_SETUP.md](frontend/SUPABASE_EMAIL_SETUP.md)** for creating a free Supabase project, the `email_captures` table, and RLS.
2. Copy `frontend/config.example.js` to `frontend/config.js` and add your Project URL and anon key.

Emails are upserted (one row per email); if the same email is submitted again, `captured_at` is updated.

## Mobile & Lock Screen

The experience is optimized for mobile and works when the phone is locked:

- **Portrait lock**: Screen orientation locks to portrait when playback starts (where supported).
- **Screen dimming**: Wake Lock keeps the screen on during playback; released when playback stops.
- **Notification/lock screen controls**: Media Session API shows "DreamPulse Journey" with play/pause and seek in the system media controls.
- **Background audio**: Playback continues when the user locks the device (platform-dependent; works on Android Chrome; iOS Safari has limitations).
- **Headphone disconnect**: If audio pauses unexpectedly (e.g. unplugging headphones), a toast appears and the in-app controls are shown so the user can resume.
- **Touch targets**: Buttons and controls use at least 44×44px hit areas for accessibility.

**Testing**: Verify on **iOS Safari** and **Android Chrome**, including starting playback, locking the phone, and using lock-screen play/pause. Ensure the journey continues correctly after unlocking.

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use:

**Windows:**
```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill
lsof -ti:8000 | xargs kill
```

### Images Not Loading
Ensure these image files exist in `frontend/assets/images/`:
- `journey.jpg`
- `sanctuary.jpg`
- `exploration.jpg`

### Backend Not Responding
1. Check if backend is running on port 8000
2. Verify story files exist in `backend/stories/`
3. Check browser console for CORS errors

## Features

- **Full-Screen Cinematic UI**: Immersive tarot card-style world selection
- **Three Worlds**: Journey, Sanctuary, Exploration
- **Three Moods**: Calm, Confident, Curious
- **Text-to-Speech**: Natural voice narration
- **Ambient Audio**: Atmospheric background sounds
- **Smooth Transitions**: Cinematic animations and effects

## Development

The frontend uses pure HTML, CSS, and JavaScript (no frameworks).

The backend is a FastAPI application serving story content via REST API.

## License

DreamPulse — Premium Immersive Experience

