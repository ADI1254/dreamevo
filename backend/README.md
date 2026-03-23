# Backend (optional — FastAPI)

This folder is **not required** for the production MVP if you deploy **`frontend/`** on **Vercel** with serverless routes (`/api/save-email`, `/api/story/...`). Those replace the former Render/Python endpoints for email and story text.

Use `main.py` locally if you want to run the original FastAPI stack (e.g. `uvicorn main:app --port 8000`) for development or legacy tooling.

See **`frontend/VERCEL_DEPLOY.md`** for the recommended architecture.
