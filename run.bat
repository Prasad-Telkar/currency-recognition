@echo off
echo ========================================================
echo Starting CurrencyAI Full Stack Application...
echo ========================================================

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%refactor\backend"

echo Starting Flask Backend (Port 5000)...
start "CurrencyAI Backend (Flask)" cmd /k "python app.py"

ping -n 4 127.0.0.1 >nul

cd /d "%SCRIPT_DIR%refactor\frontend\frontend-app"
echo Starting Vite Frontend (Port 5173)...
start "CurrencyAI Frontend (Vite)" cmd /k "npm.cmd run dev -- --open"

echo ========================================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================================
