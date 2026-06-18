@echo off
title CineVerse X

echo.
echo  ====================================================
echo   CineVerse X - Starting...
echo  ====================================================
echo.

REM Check Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop is not running!
    echo         Start Docker Desktop first, then run this again.
    pause
    exit /b 1
)
echo [OK] Docker is running

REM Start all containers (builds Spring Boot services first time ~5-10min)
echo.
echo [INFO] Starting infra + backend services via Docker...
echo [INFO] First run builds all JARs inside Docker - this can take 5-10 minutes.
echo [INFO] Subsequent starts are fast (cached).
echo.
docker compose -f docker-compose.local.yml up -d --build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] docker compose failed. See error above.
    pause
    exit /b 1
)
echo.
echo [OK] All Docker containers started.

REM Wait for backend
echo.
echo [INFO] Waiting 30 seconds for Spring Boot services to boot...
timeout /t 30 /nobreak

REM Show status
echo.
docker compose -f docker-compose.local.yml ps
echo.

REM Frontend
if not exist "frontend\node_modules" (
    echo [INFO] Installing npm packages (first run only)...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo  ====================================================
echo   Frontend  ->  http://localhost:3000
echo   Gateway   ->  http://localhost:8080
echo   RabbitMQ  ->  http://localhost:15672
echo  ====================================================
echo.
echo  Press Ctrl+C to stop the frontend dev server.
echo.

start "" "http://localhost:3000"

cd frontend
npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm run dev failed. See error above.
    pause
)
