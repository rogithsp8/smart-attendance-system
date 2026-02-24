# 🔧 Troubleshooting Guide

## Registration Issues

### Problem: "Registration failed. Email may already exist."

**Possible Causes:**
1. Email already exists in database
2. Database connection issue
3. Validation error

**Solutions:**

#### 1. Check if email already exists
```sql
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE smart_attendance;

-- Check existing users
SELECT * FROM users WHERE email = 'your-email@example.com';

-- If email exists, delete it (for testing)
DELETE FROM users WHERE email = 'your-email@example.com';
```

#### 2. Check database connection
- Verify MySQL is running
- Check credentials in `application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/smart_attendance
  spring.datasource.username=root
  spring.datasource.password=YOUR_PASSWORD
  ```

#### 3. Check backend logs
- Look at the console where backend is running
- Error messages will show the actual problem
- Common errors:
  - `Duplicate entry` - Email already exists
  - `Access denied` - Wrong database password
  - `Unknown database` - Database doesn't exist

#### 4. Create database if missing
```sql
CREATE DATABASE IF NOT EXISTS smart_attendance;
```

#### 5. Clear all data (CAUTION: Deletes everything)
```sql
USE smart_attendance;
DROP TABLE IF EXISTS attendance_record;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS curriculum;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subjects;
```
Then restart backend to recreate tables.

---

## Login Issues

### Problem: "Invalid email or password"

**Solutions:**
1. Verify email and password are correct
2. Check if user exists in database
3. Try registering a new account

---

## Backend Issues

### Problem: Backend won't start

**Check:**
1. **Port 8080 already in use**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```

2. **MySQL not running**
   - Start MySQL service
   - Windows: Services → MySQL → Start

3. **Database doesn't exist**
   ```sql
   CREATE DATABASE smart_attendance;
   ```

4. **Wrong Java version**
   ```bash
   java -version
   # Should be Java 17 or higher
   ```

---

## Frontend Issues

### Problem: Frontend won't start

**Check:**
1. **Port 5173 already in use**
   ```bash
   # Kill process on port 5173
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Dependencies not installed**
   ```bash
   cd frontend
   npm install
   ```

3. **Node version**
   ```bash
   node -v
   # Should be 16 or higher
   ```

---

## API Connection Issues

### Problem: "Network Error" or "Failed to fetch"

**Check:**
1. Backend is running on http://localhost:8080
2. Frontend is running on http://localhost:5173
3. CORS is enabled (already configured)
4. Check browser console for errors

---

## QR Code Issues

### Problem: QR code not generating

**Check:**
1. Subject ID is valid
2. Faculty is logged in
3. Backend logs for errors

### Problem: QR code expired

**Solution:**
- QR codes expire after 5 minutes
- Generate a new QR code

### Problem: Camera not working

**Check:**
1. Browser has camera permission
2. HTTPS or localhost (required for camera)
3. Camera is not used by another app

---

## Database Issues

### Problem: Tables not created

**Solution:**
```properties
# In application.properties
spring.jpa.hibernate.ddl-auto=create
# Then change back to 'update' after first run
```

### Problem: Data not saving

**Check:**
1. Database connection
2. Backend logs for SQL errors
3. Table structure matches entities

---

## Common Error Messages

### "Access denied for user 'root'@'localhost'"
- Wrong database password
- Update `application.properties`

### "Unknown database 'smart_attendance'"
- Database doesn't exist
- Run: `CREATE DATABASE smart_attendance;`

### "Duplicate entry for key 'PRIMARY'"
- ID conflict
- Usually auto-resolved by auto-increment

### "Cannot find symbol: class var"
- Java version issue
- Use Java 17 or replace `var` with explicit type

---

## Quick Fixes

### Reset Everything
```bash
# 1. Stop backend and frontend
# 2. Drop database
mysql -u root -p
DROP DATABASE smart_attendance;
CREATE DATABASE smart_attendance;
exit

# 3. Restart backend (tables will be recreated)
cd backend
mvn spring-boot:run

# 4. Restart frontend
cd frontend
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Check Logs
```bash
# Backend logs
cd backend
mvn spring-boot:run

# Look for:
# - SQL errors
# - Connection errors
# - Validation errors
```

---

## Testing Registration

### Test with curl
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### Expected Response
```json
// Success: HTTP 201 Created
// Error: HTTP 409 Conflict (email exists)
// Error: HTTP 400 Bad Request (validation error)
```

---

## Contact & Support

If issues persist:
1. Check backend console for detailed errors
2. Check browser console (F12) for frontend errors
3. Verify all prerequisites are installed
4. Review README.md for setup instructions

---

## Debug Mode

Enable detailed logging in `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.springframework.web=DEBUG
logging.level.com.example.scas=DEBUG
```

This will show:
- All SQL queries
- Request/Response details
- Error stack traces
