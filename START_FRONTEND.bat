@echo off
echo ========================================
echo Starting Smart Attendance Frontend
echo ========================================
echo.
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
call npx --yes vite
