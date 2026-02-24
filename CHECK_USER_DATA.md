# 🔍 Check User Data

## Check if user exists and password is encrypted

```sql
-- Connect to database
mysql -u root -p052927

-- Use database
USE smart_attendance;

-- Check all users
SELECT id, name, email, role, 
       LEFT(password, 20) as password_preview,
       LENGTH(password) as password_length
FROM users;

-- Check specific user
SELECT * FROM users WHERE email = 'rogithsp8@gmail.com';
```

## Expected Results:

### ✅ Correct (Password is encrypted):
```
password_preview: $2a$10$abcdefghij...
password_length: 60
```
The password should:
- Start with `$2a$` or `$2b$` (BCrypt)
- Be 60 characters long

### ❌ Wrong (Password is plain text):
```
password_preview: password123
password_length: 12
```

---

## If Password is NOT Encrypted:

### Option 1: Re-register
1. Delete the user:
```sql
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';
```

2. Register again through the app
3. Password will be encrypted automatically

### Option 2: Manually Encrypt Password

You can't manually encrypt because BCrypt generates random salt.
**Best solution: Re-register the user.**

---

## Test Login

### Method 1: Check Backend Logs
When you try to login, backend console will show:
- `BadCredentialsException` if password is wrong
- SQL query to find user
- Authentication attempt

### Method 2: Use curl
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"rogithsp8@gmail.com\",\"password\":\"YOUR_PASSWORD\"}"
```

**Expected Response:**
- Success: `{"token":"...", "role":"...", "userId":..., "name":"..."}`
- Failure: `{"message":"Invalid email or password"}`

---

## Common Login Issues:

### Issue 1: Wrong Password
**Symptom:** "Invalid email or password"
**Solution:** Make sure you're using the EXACT password you registered with

### Issue 2: User Doesn't Exist
**Symptom:** "Invalid email or password"
**Check:**
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```
If no results, user doesn't exist - register first

### Issue 3: Password Not Encrypted
**Symptom:** Login always fails even with correct password
**Check:**
```sql
SELECT LENGTH(password) FROM users WHERE email = 'your-email@example.com';
```
Should be 60. If not, re-register.

---

## Quick Fix:

```sql
-- 1. Check user
USE smart_attendance;
SELECT * FROM users WHERE email = 'rogithsp8@gmail.com';

-- 2. If password looks wrong (not 60 chars), delete and re-register
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';

-- 3. Go to http://localhost:5173/register
-- 4. Register again with same email
-- 5. Try login
```

---

## Debug Login:

1. **Open Browser Console (F12)**
2. **Try to login**
3. **Check console messages:**
   ```
   Attempting login with: your-email@example.com
   Login error: ...
   Error response: ...
   ```

4. **Check Backend Console:**
   - Look for authentication errors
   - Look for SQL queries
   - Look for stack traces

---

## Test with Known User:

Create a test user:
```sql
-- This won't work because password needs to be encrypted
-- Instead, register through the app:
```

1. Go to http://localhost:5173/register
2. Register with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Student
3. Try login with same credentials

---

## Verify Registration Created Encrypted Password:

```sql
-- After registering
SELECT email, LENGTH(password) as pwd_len, LEFT(password, 10) as pwd_start
FROM users 
WHERE email = 'test@example.com';

-- Should show:
-- pwd_len: 60
-- pwd_start: $2a$10$...
```

If this is correct, then registration is working properly.
If login still fails, there might be another issue.
