@echo off
title CineVerse X - Stop

echo.
echo  Stopping all CineVerse X services...
docker compose -f docker-compose.local.yml down
if errorlevel 1 (
    docker-compose -f docker-compose.local.yml down
)
echo.
echo  All containers stopped. Data volumes are preserved.
echo  Run start.bat to start again.
echo.
pause
