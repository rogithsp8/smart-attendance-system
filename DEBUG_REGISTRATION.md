# 🔍 Registration Debug Guide

## Step-by-Step Instructions to Fix Registration

### Step 1: Restart Backend with Logging
```bash
cd backend
mvn spring-boot:run
```

**Watch for:**
- "Started SmartCurriculumAttendanceApplication" message
- Any error messages during startup
- Database connection confirmation

### Step 2: Check Database Connection

Open MySQL and verify:
```sql
mysql -u root -p052927

-- Check if database exists
SHOW DATABASES;

-- If smart_attendance doesn't exist, create it:
CREATE DATABASE smart_attendance;

-- Use the database
USE smart_attendance;

-- Check tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;
```

### Step 3: Test Registration with Browser Console

1. Open http://localhost:5173/register
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Student
5. Click "Register"

**Look for console messages:**
- "Attempting registration with: ..."
- "Registration error: ..."
- "Error response: ..."

### Step 4: Check Backend Console

When you click Register, look at the backend console for:

**Success:**
```
Hibernate: insert into users (email, name, password, role) values (?, ?, ?, ?)
```

**Error Examples:**

1. **Duplicate Email:**
```
Duplicate entry 'test@example.com' for key 'users.UK_...'
```
**Fix:** Use different email or delete existing user

2. **Database Connection Error:**
```
Access denied for user 'root'@'localhost'
```
**Fix:** Check password in application.properties

3. **Table Doesn't Exist:**
```
Table 'smart_attendance.users' doesn't exist
```
**Fix:** Restart backend to create tables

### Step 5: Common Fixes

#### Fix 1: Clear Existing Users
```sql
USE smart_attendance;
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';
```

#### Fix 2: Drop and Recreate Database
```sql
DROP DATABASE IF EXISTS smart_attendance;
CREATE DATABASE smart_attendance;
```
Then restart backend.

#### Fix 3: Check Backend is Running
```bash
# Windows
netstat -ano | findstr :8080

# Should show something like:
# TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345
```

#### Fix 4: Test with curl
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test123@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"
```

**Expected Response:**
- Success: No output (HTTP 201)
- Error: JSON with error message

### Step 6: Check Network Tab

In Browser (F12):
1. Go to "Network" tab
2. Try to register
3. Look for "register" request
4. Click on it
5. Check:
   - Status Code (should be 201 for success)
   - Response (error message if failed)
   - Request Payload (verify data is sent correctly)

### Step 7: Verify Frontend is Sending Correct Data

In browser console, you should see:
```
Attempting registration with: {name: "hello", email: "rogithsp8@gmail.com", role: "STUDENT"}
```

If you see this, data is being sent correctly.

### Step 8: Check for CORS Issues

In browser console, if you see:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/auth/register' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix:** Backend CORS is already configured, but restart backend to apply changes.

---

## Quick Diagnostic Commands

### Check if Backend is Running
```bash
curl http://localhost:8080/api/auth/login
# Should return 400 or 401 (means backend is running)
```

### Check Database
```sql
mysql -u root -p052927 -e "USE smart_attendance; SELECT COUNT(*) FROM users;"
```

### Check Logs
Backend console will show:
- SQL queries (because show-sql=true)
- Error stack traces
- Request details

---

## Most Likely Issues & Solutions

### Issue 1: Email Already Exists ✅
**Symptom:** "Email already exists" or "Duplicate entry"
**Solution:**
```sql
USE smart_attendance;
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';
```

### Issue 2: Backend Not Running ❌
**Symptom:** "Cannot connect to server"
**Solution:** Start backend with `mvn spring-boot:run`

### Issue 3: Database Not Created ❌
**Symptom:** "Unknown database 'smart_attendance'"
**Solution:**
```sql
CREATE DATABASE smart_attendance;
```

### Issue 4: Wrong Password ❌
**Symptom:** "Access denied for user 'root'"
**Solution:** Update password in application.properties

### Issue 5: Port Already in Use ❌
**Symptom:** "Port 8080 is already in use"
**Solution:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## What to Send Me for Help

If still not working, check:

1. **Backend Console Output** - Copy the error message
2. **Browser Console** - Copy the error message
3. **Network Tab** - Screenshot of the failed request
4. **Database Check:**
```sql
USE smart_attendance;
SHOW TABLES;
SELECT * FROM users;
```

---

## Expected Behavior

### Successful Registration:
1. Browser console: "Registration successful"
2. Backend console: SQL INSERT statement
3. Redirects to login page
4. Can login with registered credentials

### Failed Registration:
1. Browser shows specific error message
2. Backend console shows error details
3. Stays on registration page

---

## Test Registration Step-by-Step

1. ✅ Backend running on port 8080
2. ✅ Frontend running on port 5173
3. ✅ Database 'smart_attendance' exists
4. ✅ Open http://localhost:5173/register
5. ✅ Open browser console (F12)
6. ✅ Fill form with NEW email
7. ✅ Click Register
8. ✅ Check console for messages
9. ✅ Check backend console for SQL/errors

---

## Emergency Reset

If nothing works, do a complete reset:

```bash
# 1. Stop backend (Ctrl+C)
# 2. Stop frontend (Ctrl+C)

# 3. Reset database
mysql -u root -p052927
DROP DATABASE IF EXISTS smart_attendance;
CREATE DATABASE smart_attendance;
exit

# 4. Start backend
cd backend
mvn clean spring-boot:run

# 5. Wait for "Started SmartCurriculumAttendanceApplication"

# 6. Start frontend (new terminal)
cd frontend
npm run dev

# 7. Try registration with NEW email
```

---

## Contact Points

After following these steps, you should see:
- Exact error message in browser console
- SQL queries or errors in backend console
- Network request details in browser DevTools

This will tell us exactly what's wrong!
