# 🔐 Login Issue - Complete Fix Guide

## Quick Diagnosis

### Step 1: Check if User Exists
```sql
mysql -u root -p052927
USE smart_attendance;
SELECT * FROM users WHERE email = 'rogithsp8@gmail.com';
```

**If no results:** User doesn't exist - register first
**If results:** Continue to Step 2

### Step 2: Check Password Encryption
```sql
SELECT email, LENGTH(password) as len FROM users WHERE email = 'rogithsp8@gmail.com';
```

**Expected:** `len: 60` (BCrypt encrypted)
**If different:** Password not encrypted properly

---

## 🚀 Quick Fixes

### Fix 1: Re-register (RECOMMENDED)
```sql
-- Delete user
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';
```

Then:
1. Go to http://localhost:5173/register
2. Register with same email
3. Use a simple password like: `password123`
4. Try login with same credentials

### Fix 2: Use Test Account
Register a new test account:
- Email: `test@example.com`
- Password: `password123`
- Role: Student

Then try logging in with these credentials.

---

## 🔍 Detailed Debugging

### Check 1: Backend Console
When you try to login, look for:

**Success:**
```
Hibernate: select ... from users where email=?
```

**Failure:**
```
BadCredentialsException: Bad credentials
```

### Check 2: Browser Console (F12)
You should see:
```
Attempting login with: rogithsp8@gmail.com
Login error: ...
Error response: ...
```

### Check 3: Network Tab (F12)
1. Go to Network tab
2. Try login
3. Click on "login" request
4. Check:
   - Status Code (should be 200 for success, 401 for wrong password)
   - Response body (error message)

---

## Common Issues & Solutions

### Issue 1: "Invalid email or password"

**Possible Causes:**
1. Wrong password
2. User doesn't exist
3. Password not encrypted properly

**Solutions:**
```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'your-email';

-- Check password length (should be 60)
SELECT LENGTH(password) FROM users WHERE email = 'your-email';

-- If wrong, delete and re-register
DELETE FROM users WHERE email = 'your-email';
```

### Issue 2: "Cannot connect to server"

**Cause:** Backend not running

**Solution:**
```bash
cd backend
mvn spring-boot:run
```

### Issue 3: Login works but redirects to wrong page

**Cause:** Role mismatch

**Check:**
```sql
SELECT email, role FROM users WHERE email = 'your-email';
```

**Fix:** Update role if needed:
```sql
UPDATE users SET role = 'STUDENT' WHERE email = 'your-email';
```

---

## Test Login Step-by-Step

### 1. Verify Backend is Running
```bash
curl http://localhost:8080/api/auth/login
# Should return 400 or 401 (means backend is running)
```

### 2. Test Login with curl
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"rogithsp8@gmail.com\",\"password\":\"YOUR_PASSWORD\"}"
```

**Success Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "STUDENT",
  "userId": 1,
  "name": "hello"
}
```

**Failure Response:**
```json
{
  "message": "Invalid email or password"
}
```

### 3. Test in Browser
1. Open http://localhost:5173/login
2. Open Console (F12)
3. Enter credentials
4. Click "Sign In"
5. Check console for errors

---

## Verify Registration & Login Flow

### Complete Test:

1. **Register:**
   ```
   Email: test123@example.com
   Password: password123
   Role: Student
   ```

2. **Check Database:**
   ```sql
   SELECT * FROM users WHERE email = 'test123@example.com';
   -- Password should be 60 chars and start with $2a$
   ```

3. **Login:**
   ```
   Email: test123@example.com
   Password: password123
   ```

4. **Expected:** Redirect to student dashboard

---

## Password Encryption Check

### Correct Password (Encrypted):
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```
- Starts with `$2a$` or `$2b$`
- 60 characters long
- Random characters

### Wrong Password (Plain Text):
```
password123
```
- Readable text
- Short length
- **This will NOT work for login**

---

## Emergency Reset

If nothing works:

```sql
-- 1. Clear all users
mysql -u root -p052927
USE smart_attendance;
DELETE FROM users;

-- 2. Restart backend
cd backend
mvn spring-boot:run

-- 3. Register new user through app
-- 4. Try login
```

---

## What Should Happen

### Successful Login:
1. ✅ Backend validates credentials
2. ✅ Generates JWT token
3. ✅ Returns user data
4. ✅ Frontend stores token
5. ✅ Redirects to dashboard

### Failed Login:
1. ❌ Backend rejects credentials
2. ❌ Returns 401 error
3. ❌ Shows error message
4. ❌ Stays on login page

---

## Debug Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] Database 'smart_attendance' exists
- [ ] User exists in database
- [ ] Password is 60 characters (encrypted)
- [ ] Using correct email
- [ ] Using correct password
- [ ] Browser console shows no errors
- [ ] Backend console shows no errors

---

## Still Not Working?

### Collect This Information:

1. **Database Check:**
```sql
SELECT id, email, role, LENGTH(password) as pwd_len 
FROM users 
WHERE email = 'your-email';
```

2. **Backend Console Output:**
   - Copy error messages
   - Copy stack traces

3. **Browser Console Output:**
   - Copy error messages
   - Copy network request details

4. **What You Registered With:**
   - Email
   - Password (remember it!)
   - Role

5. **What You're Trying to Login With:**
   - Email (exact match?)
   - Password (exact match?)

---

## Most Common Mistake

**Using different password for login than registration!**

**Solution:**
1. Delete user
2. Register with simple password: `password123`
3. Login with EXACT same password: `password123`

---

## Quick Test

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test999@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"

# 2. Login
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test999@example.com\",\"password\":\"password123\"}"

# Should return token and user data
```

If this works, then backend is fine. Issue is with your specific credentials.
