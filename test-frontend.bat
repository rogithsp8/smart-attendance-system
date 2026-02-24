@echo off
echo Testing Smart Attendance Frontend...
echo.
echo Starting Vite dev server...
cd frontend
start /B npm run dev
echo.
echo Frontend should be starting on http://localhost:5173
echo.
echo Press any key to stop the server...
pause > nul
taskkill /f /im node.exe 2>nul
echo Server stopped.
pause