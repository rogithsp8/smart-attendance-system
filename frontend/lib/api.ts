import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include user id header (backend uses session-based auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Also attach stored user id for endpoints that need it
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.id) config.headers['X-User-Id'] = String(user.id);
      } catch { /* ignore */ }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
}

export interface Subject {
  id: number;
  name: string;
  code: string;
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

export interface Topic {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  subject: {
    id: number;
    name: string;
    code: string;
    facultyId: number;
  };
}

export interface Question {
  id: number;
  questionText: string;
  options: string; // JSON string from backend
  correctAnswer: string;
  assessment: {
    id: number;
    subjectId: number;
    title: string;
    totalMarks: number;
  };
}

export interface Attempt {
  id: number;
  userId: number;
  assessmentId: number;
  score: number;
  status: 'PENDING' | 'COMPLETED';
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
  getUserSubjects: (userId: number) => api.get<Subject[]>(`/users/${userId}/subjects`),
  assignSubject: (userId: number, subjectId: number) =>
    api.post<Subject[]>(`/users/${userId}/subjects/${subjectId}`),
  removeSubject: (userId: number, subjectId: number) =>
    api.delete<Subject[]>(`/users/${userId}/subjects/${subjectId}`),
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
  getSubjects: () => {
    console.log('Fetching subjects...');
    return api.get<Subject[]>('/subjects');
  },
  createSubject: (subject: Omit<Subject, 'id'>) => {
    console.log('Creating subject:', subject);
    return api.post<Subject>('/subjects', subject);
  },
};

export const assessmentAPI = {
  getAssessments: () => api.get<Assessment[]>('/assessments'),
  getStudentAssessments: (userId: number) => api.get<Assessment[]>(`/assessments/student/${userId}`),
  createAssessment: (assessment: Omit<Assessment, 'id'>) => 
    api.post<Assessment>('/assessments', assessment),
};

export const topicAPI = {
  getTopicsBySubject: (subjectId: number) => {
    console.log('Fetching topics for subject ID:', subjectId);
    return api.get<Topic[]>(`/topics/subject/${subjectId}`);
  },
  createTopic: (topic: Omit<Topic, 'id'>) => {
    console.log('Creating topic:', topic);
    return api.post<Topic>('/topics', topic);
  },
  markComplete: (topicId: number) =>
    api.patch<Topic>(`/topics/${topicId}/complete`),
};

export const questionAPI = {
  getQuestionsByAssessment: (assessmentId: number) => {
    console.log('Fetching questions for assessment ID:', assessmentId);
    return api.get<Question[]>(`/questions/${assessmentId}`);
  },
  createQuestion: (assessmentId: number, question: Omit<Question, 'id'>) => {
    console.log('Creating question for assessment ID:', assessmentId, question);
    return api.post<Question>(`/questions/${assessmentId}`, question);
  },
};

export const attemptAPI = {
  submitAttempt: (userId: number, assessmentId: number, answers: Record<number, string>) => 
    api.post<Attempt>('/attempts/submit', { userId, assessmentId, answers }),
  getAttemptsByUser: (userId: number) => api.get<Attempt[]>(`/attempts/user/${userId}`),
};

export default api;
