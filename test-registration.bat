@echo off
echo ========================================
echo Testing Registration Endpoint
echo ========================================
echo.

echo Testing with curl...
echo.

curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test%RANDOM%@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"

echo.
echo.
echo ========================================
echo If you see HTTP 201 or success message, registration works!
echo If you see error, check backend logs.
echo ========================================
echo.
pause
