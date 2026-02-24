# 🎓 Smart Curriculum Attendance System

A modern, full-stack attendance management system with QR code scanning, real-time tracking, and beautiful UI.

## ✨ Features

### 👨‍🎓 Student Features
- 📊 **Real-time Attendance Dashboard** - View attendance statistics with interactive charts
- 📱 **QR Code Scanner** - Mark attendance by scanning faculty-generated QR codes
- ⚠️ **Low Attendance Alerts** - Get warnings when attendance falls below 75%
- 📈 **Visual Analytics** - Bar charts and pie charts for attendance overview

### 👨‍🏫 Faculty Features
- 🎯 **QR Session Management** - Generate time-limited QR codes for attendance
- ✍️ **Manual Attendance** - Mark attendance manually for multiple students
- 📋 **Student Selection** - Bulk select students for attendance marking
- 📚 **Subject Management** - Create sessions for different subjects

### 🔑 Admin Features
- 👥 **User Management** - View all users (students, faculty, admins)
- 📚 **Subject Management** - Add and manage subjects with codes
- 📝 **Curriculum Management** - Track topics covered with dates
- 📊 **System Statistics** - Overview of total users by role

## 🎨 UI Highlights

- 🌈 **Beautiful Gradient Design** - Purple gradient background with glassmorphism effects
- 🎯 **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Smooth Animations** - Slide-up animations and hover effects
- 🎨 **Color-coded Stats** - Different colors for different metrics
- 📱 **Modern Components** - Cards, badges, tables with professional styling

## 🛠️ Technology Stack

### Backend
- ☕ **Java 17** with Spring Boot 3.3.0
- 🔐 **Spring Security** with JWT authentication
- 🗄️ **MySQL** database with JPA/Hibernate
- 📱 **QR Code Generation** using ZXing library
- 📚 **API Documentation** with Swagger/OpenAPI

### Frontend
- ⚛️ **React 18** with Vite
- 🎨 **Custom CSS** with modern design
- 📊 **Recharts** for data visualization
- 📱 **React QR Scanner** for camera access
- 🔄 **Axios** for API communication

## 🚀 Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE smart_attendance;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_attendance
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Compile and run:
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 📱 Usage Guide

### First Time Setup

1. **Register an Admin Account**
   - Go to `http://localhost:5173/register`
   - Fill in details and select "Admin" role
   - Click Register

2. **Login as Admin**
   - Login with admin credentials
   - Add subjects from the Subjects tab
   - Add curriculum topics

3. **Register Faculty & Students**
   - Create faculty accounts with "Faculty" role
   - Create student accounts with "Student" role

### Faculty Workflow

1. **Create QR Session**
   - Select a subject from dropdown
   - Click "Generate QR Code"
   - QR code is valid for 5 minutes

2. **Manual Attendance**
   - After creating session, select students
   - Choose Present/Absent status
   - Click "Mark Students"

### Student Workflow

1. **View Dashboard**
   - See attendance statistics
   - Check attendance percentage
   - View charts

2. **Scan QR Code**
   - Click "Open Camera Scanner"
   - Point camera at faculty's QR code
   - Attendance marked automatically

## 🔐 Security Features

- 🔒 **JWT Authentication** - Secure token-based auth
- 🔑 **Password Encryption** - BCrypt hashing
- 🛡️ **Role-based Access** - Different permissions for each role
- ⏰ **QR Expiration** - Time-limited QR codes (5 minutes)
- 🚫 **CORS Protection** - Configured for security

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/users` - Get all users (Admin)

### Attendance
- `POST /api/attendance/session` - Create QR session
- `GET /api/attendance/session/{id}/qr` - Get QR code image
- `POST /api/attendance/mark` - Manual attendance marking
- `POST /api/attendance/scan` - Scan QR code
- `GET /api/attendance/summary` - Get student summary

### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create subject

### Curriculum
- `GET /api/curriculum` - List curriculum
- `POST /api/curriculum` - Add curriculum topic

## 🎯 Key Features Implemented

✅ JWT-based authentication
✅ Role-based dashboards (Admin, Faculty, Student)
✅ QR code generation and scanning
✅ Real-time attendance tracking
✅ Manual attendance marking
✅ Subject and curriculum management
✅ Interactive charts and statistics
✅ Responsive design
✅ Low attendance warnings
✅ Bulk student selection
✅ Time-limited QR codes
✅ Beautiful gradient UI
✅ Form validation
✅ Error handling
✅ Success notifications

## 🎨 Color Scheme

- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#48bb78)
- **Warning**: Orange (#ed8936)
- **Danger**: Red (#f56565)
- **Info**: Blue (#4299e1)

## 📝 Database Schema

- **users** - User accounts with roles
- **subjects** - Course subjects
- **attendance** - Attendance sessions with QR tokens
- **attendance_record** - Individual attendance records
- **curriculum** - Topics covered per subject
- **notifications** - System notifications

## 🤝 Contributing

This is a complete attendance management system ready for deployment!

## 📄 License

Educational project - Free to use and modify

## 👨‍💻 Developer Notes

- Backend runs on port 8080
- Frontend runs on port 5173
- QR codes expire after 5 minutes
- Attendance below 75% triggers warnings
- All passwords are encrypted with BCrypt
- JWT tokens expire after 24 hours

---

Made with ❤️ using Spring Boot & React
