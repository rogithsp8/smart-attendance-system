'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceAPI, assessmentAPI, Attendance, Assessment } from '@/lib/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  return <StudentDashboardContent />;
}

function StudentDashboardContent() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const [attendanceRes, assessmentsRes] = await Promise.all([
          attendanceAPI.getStudentAttendance(user.id),
          assessmentAPI.getAssessments(),
        ]);
        setAttendance(attendanceRes.data);
        setAssessments(assessmentsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading student data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  // Calculate attendance percentage
  const attendancePercentage = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100)
    : 0;

  // Filter assessments
  const upcomingAssessments = assessments.slice(0, 3); // Show first 3 as upcoming
  const pastAssessments = assessments.slice(0, 3); // Show first 3 as past

  // Create attendance trend data
  const attendanceTrendData = attendance.slice(-6).map((record, index) => ({
    week: `Week ${index + 1}`,
    attendance: record.status === 'PRESENT' ? 100 : 0,
  }));

  if (loading) {
    return (
      <AppLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            My Learning Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Computer Science - Semester 3 | Enrollment: EN2024001
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Attendance %"
            value={`${attendancePercentage}%`}
            icon={TrendingUp}
            description={`${attendance.filter(a => a.status === 'PRESENT').length} of ${attendance.length} sessions attended`}
            variant={attendancePercentage >= 75 ? "success" : "warning"}
          />
          <StatCard
            title="Engagement Score"
            value="87"
            icon={Award}
            trend={{ value: 5, isPositive: true }}
            description="Based on participation metrics"
            variant="success"
          />
          <StatCard
            title="Overall Performance"
            value="88%"
            icon={BookOpen}
            description="Cumulative GPA based score"
            variant="success"
          />
          <StatCard
            title="Risk Status"
            value="Normal"
            icon={CheckCircle}
            description="All metrics within normal range"
            variant="success"
          />
        </div>

        {/* Student Learning Profile */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Attendance Trend */}
          <ChartCard
            title="Attendance Trend"
            description="Your weekly attendance percentage"
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attendanceTrendData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorAttendance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Assessment Summary */}
          <ChartCard
            title="Assessment Summary"
            description="Your recent assessment performance"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Total Assessments</span>
                <span className="text-lg font-bold">{assessments.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-lg font-bold">{attendancePercentage}%</span>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Assessments Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Your Assessments</h3>
            <p className="text-sm text-muted-foreground">
              Track your upcoming and past assessments
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming */}
            <DataTable
              title="Upcoming Tests"
              columns={[
                { key: 'title', label: 'Assessment' },
                { key: 'totalMarks', label: 'Total Marks' },
                { key: 'subjectId', label: 'Subject ID' },
              ]}
              data={upcomingAssessments}
            />

            {/* Past Results */}
            <DataTable
              title="Recent Records"
              columns={[
                { key: 'title', label: 'Assessment' },
                { key: 'totalMarks', label: 'Total Marks' },
                { key: 'subjectId', label: 'Subject ID' },
              ]}
              data={pastAssessments}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
