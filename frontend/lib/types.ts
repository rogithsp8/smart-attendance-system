export type UserRole = 'admin' | 'faculty' | 'student';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'active' | 'passive';
export type RiskStatus = 'normal' | 'at-risk';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  attendancePercentage: number;
  engagementScore: number;
  overallPerformance: number;
  riskStatus: RiskStatus;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  qualifications: string;
  subjectsHandled: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  faculty: Faculty;
  semester: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  status: AttendanceStatus;
  timeIn?: Date;
  location?: string;
}

export interface Curriculum {
  id: string;
  subjectId: string;
  subjectName: string;
  totalTopics: number;
  completedTopics: number;
  plannedTopics: number;
  delayDays?: number;
  estimatedCompletionDate: Date;
}

export interface Assessment {
  id: string;
  name: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  subjectId: string;
  subjectName: string;
  totalMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  scheduledDate: Date;
  studentScore?: number;
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  order: number;
  completed: boolean;
  averageScore?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface RemediationGroup {
  id: string;
  name: string;
  type: 'weak' | 'average' | 'advanced';
  students: Student[];
  subjectId: string;
  createdDate: Date;
}

export interface AnalyticsData {
  attendanceVsPerformance: Array<{
    attendance: number;
    performance: number;
    count: number;
  }>;
  weeklyAttendance: Array<{
    day: string;
    percentage: number;
  }>;
  atRiskTrend: Array<{
    week: string;
    count: number;
  }>;
}
