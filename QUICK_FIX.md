# 🚀 Quick Fix - Registration Issue

## TL;DR - Do This Now:

### Step 1: Delete Existing Email
```sql
mysql -u root -p052927
USE smart_attendance;
DELETE FROM users WHERE email = 'rogithsp8@gmail.com';
exit
```

### Step 2: Restart Backend
```bash
cd backend
mvn spring-boot:run
```

### Step 3: Try Registration
- Go to: http://localhost:5173/register
- Use email: `rogithsp8@gmail.com` (or any other)
- Password: `password123` (min 6 chars)
- Click Register

---

## OR Use Different Email

Just register with:
- `test123@gmail.com`
- `newuser@gmail.com`
- Any email you haven't used

---

## Still Not Working?

### Open Browser Console (F12)
You'll see messages like:
```
Attempting registration with: {...}
Registration error: {...}
```

### Check Backend Console
You'll see:
- SQL queries
- Error messages
- Stack traces

### Use Test Page
Open: `test-registration.html` in browser
- Auto-generates random email
- Shows detailed results
- No need for frontend

---

## Common Errors & Quick Fixes

| Error Message | Fix |
|---------------|-----|
| "Email already exists" | Use different email |
| "Cannot connect to server" | Start backend |
| "Unknown database" | `CREATE DATABASE smart_attendance;` |
| "Access denied" | Check DB password |

---

## Emergency Reset

```bash
mysql -u root -p052927 -e "DROP DATABASE smart_attendance; CREATE DATABASE smart_attendance;"
cd backend && mvn spring-boot:run
```

---

## Files to Help You

- `REGISTRATION_FIX.md` - Complete fix guide
- `DEBUG_REGISTRATION.md` - Step-by-step debugging
- `TROUBLESHOOTING.md` - All common issues
- `test-registration.html` - Test page

---

## Expected Behavior

✅ **Success**: Redirects to login page
❌ **Failure**: Shows specific error message

---

**Most Likely Issue**: Email already exists in database
**Quick Fix**: Use different email or delete existing user
