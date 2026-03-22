@echo off
echo Starting DreamPulse - Backend and Frontend...
echo.
echo Starting Backend on port 8000...
start "DreamPulse Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend on port 3000...
start "DreamPulse Frontend" cmd /k "cd frontend && python server.py"
echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause

