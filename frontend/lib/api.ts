import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
}

export interface Subject {
  id: number;
  name: string;
  facultyId: number;
}

export interface Attendance {
  id: number;
  studentId: number;
  subjectId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface Assessment {
  id: number;
  subjectId: number;
  title: string;
  totalMarks: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
}

export const authAPI = {
  register: (data: RegisterRequest) => api.post<LoginResponse>('/auth/register', data),
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
};

export const userAPI = {
  getAllUsers: () => api.get<User[]>('/users'),
  getStudents: () => api.get<User[]>('/students'),
  getFaculty: () => api.get<User[]>('/faculty'),
};

export const attendanceAPI = {
  getAttendance: (subjectId?: number, date?: string) => 
    api.get<Attendance[]>('/attendance', { params: { subjectId, date } }),
  getStudentAttendance: (studentId: number) => 
    api.get<Attendance[]>(`/attendance/student/${studentId}`),
  markAttendance: (attendance: Omit<Attendance, 'id'>) => 
    api.post<Attendance>('/attendance/mark', attendance),
  createQRSession: (subjectId: number) => 
    api.post<{ sessionId: string; subjectId: number; expiryTime: number }>('/attendance/qr-session', { subjectId }),
};

export const subjectAPI = {
  getSubjects: () => api.get<Subject[]>('/subjects'),
  createSubject: (subject: Omit<Subject, 'id'>) => 
    api.post<Subject>('/subjects', subject),
};

export const assessmentAPI = {
  getAssessments: () => api.get<Assessment[]>('/assessments'),
  createAssessment: (assessment: Omit<Assessment, 'id'>) => 
    api.post<Assessment>('/assessments', assessment),
};

export default api;
