# Smart Curriculum Activity & Attendance System

A modern education platform for attendance management, curriculum tracking, and analytics.

## Tech Stack

### Frontend
- Next.js 16
- TypeScript
- TailwindCSS
- Radix UI Components
- Axios

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL
- Lombok

## Database Setup

1. Install MySQL on your system
2. Create a database named `attendance_system`
3. Run the database initialization script:

```bash
mysql -u root -p < backend/database-init.sql
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

3. Run the backend:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### User APIs
- `GET /api/students` - Get all students
- `GET /api/faculty` - Get all faculty members

### Attendance APIs
- `GET /api/attendance?subjectId=&date=` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance
- `POST /api/attendance/qr-session` - Create QR session

### Subject APIs
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject

### Assessment APIs
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create a new assessment

## Features

- **Role-based Access**: Admin, Faculty, and Student roles
- **Attendance Management**: Mark and track student attendance
- **Subject Management**: Create and manage subjects
- **Assessment Tracking**: Create and track assessments
- **QR Code Support**: Basic QR session generation
- **Responsive Design**: Works on desktop and mobile devices

## Navigation Routes

All major routes are available:
- `/admin` - Admin dashboard
- `/faculty` - Faculty dashboard
- `/faculty/attendance` - Faculty attendance management
- `/faculty/assessments` - Faculty assessments
- `/student` - Student dashboard
- `/settings` - Settings page

## Development Notes

- The frontend is configured to connect to `http://localhost:8080/api`
- CORS is enabled for `http://localhost:3000`
- Database schema auto-updates on application start
- Sample data is included for testing
