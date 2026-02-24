@echo off
echo ========================================
echo Testing Login for hell@gmail.com
echo ========================================
echo.

echo Test 1: Check if user exists
echo.
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"hell@gmail.com\",\"password\":\"password123\"}"

echo.
echo.
echo ========================================
echo If you see a token, login works!
echo If you see error, password is wrong.
echo ========================================
echo.

echo Test 2: Try with different password
echo.
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"hell@gmail.com\",\"password\":\"123456\"}"

echo.
echo.
pause
