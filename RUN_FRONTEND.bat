@echo off
echo ========================================
echo Starting Smart Attendance Frontend
echo ========================================
echo.
echo Frontend will open at: http://localhost:5173
echo.
cd frontend
python -m http.server 5173
