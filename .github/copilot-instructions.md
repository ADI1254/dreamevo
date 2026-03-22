# DreamPulse AI Coding Guidelines

## Architecture Overview
- **Backend**: FastAPI application serving REST API endpoints for mood-based dream stories
- **Frontend**: Web application that creates a guided transition between waking and dream states
- **Data Storage**: Stories stored as plain text files in `backend/stories/` with naming pattern `{world}_{mood}.txt`

## Key Components
- `backend/main.py`: FastAPI app with CORS, endpoints for home and `/story/{world}/{mood}`
- `/story/{world}/{mood}`: Returns JSON with world, mood, and suggestive story text
- Frontend: HTML form for name/world/mood selection, JavaScript for speech synthesis with ambient audio
- Speech: Personalized intro, then ambient "breathing" background, mood-adjusted pacing
- Audio: Ambient MP3 plays softly after intro, with subtle volume oscillation

## Development Workflow
- **Run Backend**: `cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- **Run Frontend**: Serve `frontend/` via local server (e.g., `python -m http.server 3000` in frontend/)
- **Dependencies**: Backend: `fastapi`, `uvicorn[standard]`; Frontend: Web Speech API + HTML5 Audio

## Code Patterns
- API responses: JSON with `{"world": "...", "mood": "...", "story": "..."}`
- Story content: Suggestive phrases like "You are here now...", "You may notice...", "There is nothing you need to do..."
- Speech pacing: Mood-based rate (calm: 0.7, confident: 0.8, curious: 0.75)
- Ambient audio: Starts after intro, "breathes" with volume oscillation (0.1-0.2 range)
- Voice selection: Prefers female voices, falls back to English voices

## Dream Experience Features
- **Personalization**: Addresses user by name in intro
- **Silence as Feature**: Text includes "..." for natural pauses between suggestions
- **Spatial Sound**: Ambient layer provides atmospheric depth
- **Social Presence**: Voice feels close and gentle, not instructional
- **Mood Worlds**: 3 worlds × 3 moods = 9 unique experiences
- **Transition Design**: Intro → Ambient → Story narration sequence

## World Archetypes
- 🌍 **Journey**: Movement, progress, direction (for restlessness)
- 🌿 **Sanctuary**: Safety, rest, healing (for stress/anxiety)
- ✨ **Exploration**: Curiosity, imagination, possibility (for creativity)

## Mood Personalization
- **Calm**: Slower pacing, grounding imagery, longer pauses
- **Confident**: Steady rhythm, reassurance, upright metaphors
- **Curious**: Open-ended imagery, gentle wonder, exploratory language