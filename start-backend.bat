@echo off
title CineVerse X - Backend Services

echo.
echo  Starting CineVerse X backend microservices...
echo  Requires: Java 21+, Maven 3.9+
echo  Infrastructure must be running first (start.bat)
echo.

:: MongoDB runs on 27018 in dev (27017 was already in use on this machine)
set SPRING_DATA_MONGODB_URI=mongodb://cineverse:cineverse123@localhost:27018/cineverse?authSource=admin

:: Read JWT secret from root .env if present
for /f "tokens=1,* delims==" %%a in ('type .env 2^>nul ^| findstr /i "JWT_SECRET"') do set JWT_SECRET=%%b

echo  JWT_SECRET loaded: %JWT_SECRET:~0,10%...
echo  MongoDB URI: %SPRING_DATA_MONGODB_URI%
echo.

:: Start all services in separate windows
echo  [1/5] Starting Gateway Service (port 8080)...
start "Gateway Service" cmd /k "cd backend\gateway-service && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8080"

timeout /t 5 /nobreak >nul

echo  [2/5] Starting Auth Service (port 8081)...
start "Auth Service" cmd /k "cd backend\auth-service && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8081"

timeout /t 5 /nobreak >nul

echo  [3/5] Starting Movie Service (port 8082)...
start "Movie Service" cmd /k "cd backend\movie-service && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8082"

timeout /t 5 /nobreak >nul

echo  [4/5] Starting Booking Service (port 8083)...
start "Booking Service" cmd /k "cd backend\booking-service && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8083"

timeout /t 5 /nobreak >nul

echo  [5/5] Starting Notification Service (port 8084)...
start "Notification Service" cmd /k "cd backend\notification-service && mvn spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8084"

echo.
echo  All backend services starting in separate windows.
echo  Gateway: http://localhost:8080
echo  Auth:    http://localhost:8081
echo  Movies:  http://localhost:8082
echo  Booking: http://localhost:8083
echo  Notify:  http://localhost:8084
echo.
echo  Wait 30-60 seconds for all services to be ready.
echo.
pause
