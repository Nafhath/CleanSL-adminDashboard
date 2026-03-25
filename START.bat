@echo off
echo ========================================
echo CleanSL Admin Dashboard - Setup and Launch
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Preparing backend...
cd ..\backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to prepare backend
    cd ..\cleansl-admin
    pause
    exit /b 1
)
cd ..\cleansl-admin

echo.
echo 1) Start Both
echo 2) Start Backend Only
echo 3) Start Frontend Only
echo 4) Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    start cmd /k "cd /d %~dp0..\backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"
    timeout /t 3 /nobreak
    start cmd /k "cd /d %~dp0 && npm start"
    echo Frontend: http://localhost:3000
    echo Backend:  http://localhost:8000
)

if "%choice%"=="2" (
    cd ..\backend
    call venv\Scripts\activate.bat
    uvicorn app.main:app --reload --port 8000
)

if "%choice%"=="3" (
    npm start
)

if "%choice%"=="4" (
    exit /b 0
)

pause
