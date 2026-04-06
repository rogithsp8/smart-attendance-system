-- Create database
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'FACULTY', 'STUDENT') NOT NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculty_id BIGINT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES users(id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE KEY unique_attendance (student_id, subject_id, date)
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    total_marks INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Insert sample data
INSERT INTO users (name, email, password, role) VALUES
('Dr. Amit Sharma', 'amit.sharma@university.edu', 'password123', 'FACULTY'),
('Prof. Sneha Verma', 'sneha.verma@university.edu', 'password123', 'FACULTY'),
('Aisha Patel', 'aisha.patel@university.edu', 'password123', 'STUDENT'),
('Rajesh Kumar', 'rajesh.kumar@university.edu', 'password123', 'STUDENT'),
('Priya Singh', 'priya.singh@university.edu', 'password123', 'STUDENT'),
('Vikram Desai', 'vikram.desai@university.edu', 'password123', 'STUDENT'),
('Neha Gupta', 'neha.gupta@university.edu', 'password123', 'STUDENT'),
('Admin User', 'admin@university.edu', 'admin123', 'ADMIN');

INSERT INTO subjects (name, faculty_id) VALUES
('Data Structures', 1),
('Database Systems', 1),
('Web Development', 2);

INSERT INTO assessments (subject_id, title, total_marks) VALUES
(1, 'Arrays and Linked Lists Quiz', 50),
(2, 'SQL Assignment', 100),
(3, 'React Project', 150);
