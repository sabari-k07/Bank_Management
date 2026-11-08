@echo off
TITLE Apex Bank Recruitment System
echo ========================================================
echo   Starting Apex Bank Recruitment Portal (Full Stack)
echo ========================================================

echo.
echo [1/2] Launching Backend API Server (Port 5000)...
start "Bank API Server" cmd /k "cd server && npm run dev"

echo [2/2] Launching Vite React Client (Port 5173)...
start "Bank Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo   Services are starting up:
echo   - Frontend:  http://localhost:5173
echo   - Backend:   http://localhost:5000
echo   - Health:    http://localhost:5000/api/v1/health
echo ========================================================
echo.
pause
