Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting CurrencyAI Full Stack Application..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
$backendDir = Join-Path $scriptDir "refactor\backend"
Write-Host "Starting Flask Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; python app.py"

Start-Sleep -Seconds 3

# Start Frontend
$frontendDir = Join-Path $scriptDir "refactor\frontend\frontend-app"
Write-Host "Starting Vite Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm.cmd run dev -- --open"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
