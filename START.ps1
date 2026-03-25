#!/usr/bin/env pwsh

Write-Host ""
Write-Host "CleanSL Admin Dashboard - Setup and Launch" -ForegroundColor Cyan
Write-Host ""

try {
    node --version | Out-Null
} catch {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`nPreparing backend..." -ForegroundColor Cyan
Push-Location ..\backend
python -m venv venv
& .\venv\Scripts\activate.ps1
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "`n1) Start Both"
Write-Host "2) Start Backend Only"
Write-Host "3) Start Frontend Only"
Write-Host "4) Exit"
$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd ..\backend; .\venv\Scripts\activate.ps1; uvicorn app.main:app --reload --port 8000"
        Start-Sleep -Seconds 3
        Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
        Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
    }
    "2" {
        Set-Location ..\backend
        & .\venv\Scripts\activate.ps1
        uvicorn app.main:app --reload --port 8000
    }
    "3" {
        npm start
    }
    default {
        exit 0
    }
}
