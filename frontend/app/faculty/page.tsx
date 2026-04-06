'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  BookOpen,
  AlertTriangle,
  QrCode,
  MapPin,
  Download,
  BarChart3,
  TrendingDown,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Button } from '@/components/ui/button';
import { userAPI, attendanceAPI, subjectAPI, assessmentAPI, User, Attendance, Subject, Assessment } from '@/lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FacultyDashboard() {
  return <FacultyDashboardContent />;
}

function FacultyDashboardContent() {
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface EngagementData {
    name: string;
    status: string;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, subjectsRes, assessmentsRes, attendanceRes] = await Promise.all([
        userAPI.getStudents(),
        subjectAPI.getSubjects(),
        assessmentAPI.getAssessments(),
        attendanceAPI.getAttendance()
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      setAssessments(assessmentsRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const presentToday = todayAttendance.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = todayAttendance.length > 0 
    ? Math.round((presentToday / todayAttendance.length) * 100)
    : 0;

  const engagementData: EngagementData[] = students.slice(0, 5).map(student => ({
    name: student.name,
    status: attendance.find(a => a.studentId === student.id)?.status || 'ABSENT',
  }));

  if (loading) {
    return (
      <AppLayout userRole="faculty">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="faculty">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="faculty">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Faculty Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Data Structures - Semester 3 | Class Batch 2024
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Attendance %"
            value={`${attendancePercentage}%`}
            icon={Users}
            description={`${presentToday} of ${todayAttendance.length} students present`}
            variant={attendancePercentage >= 75 ? "success" : "warning"}
          />
          <StatCard
            title="Active Sessions"
            value="1"
            icon={Clock}
            description="Current class in session"
            variant="success"
          />
          <StatCard
            title="Subjects Handled"
            value={subjects.length.toString()}
            icon={BookOpen}
            description="Assigned subjects this semester"
          />
          <StatCard
            title="At-Risk Students"
            value="2"
            icon={AlertTriangle}
            trend={{ value: 1, isPositive: false }}
            description="Requires intervention"
            variant="warning"
          />
        </div>

        {/* Engagement-Based Attendance */}
        <DataTable
          title="Student Engagement"
          description="Current attendance status for all students"
          columns={[
            { key: 'name' as keyof EngagementData, label: 'Student Name' },
            {
              key: 'status' as keyof EngagementData,
              label: 'Status',
              render: (value) => <StatusBadge status={value} />,
            },
          ]}
          data={engagementData}
        />

        {/* Subjects Summary */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Subjects Overview</h3>
          <div className="space-y-4">
            {subjects.slice(0, 3).map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium">{subject.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Subject ID: {subject.id}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Faculty ID: {subject.facultyId}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Assessments</h3>
          {assessments.length > 0 ? (
            <div className="space-y-2">
              {assessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{assessment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Total Marks: {assessment.totalMarks}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Subject ID: {assessment.subjectId}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No assessments found</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
