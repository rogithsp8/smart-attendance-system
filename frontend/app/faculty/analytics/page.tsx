'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ChartCard } from '@/components/dashboard/chart-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceTrendData = [
  { date: 'Week 1', attendance: 92 },
  { date: 'Week 2', attendance: 88 },
  { date: 'Week 3', attendance: 85 },
  { date: 'Week 4', attendance: 90 },
  { date: 'Week 5', attendance: 87 },
  { date: 'Week 6', attendance: 91 },
];

const performanceData = [
  { subject: 'Data Structures', average: 78 },
  { subject: 'Algorithms', average: 82 },
  { subject: 'Database', average: 75 },
  { subject: 'Web Dev', average: 88 },
  { subject: 'OS', average: 71 },
];

export default function FacultyAnalyticsPage() {
  return (
    <AppLayout userRole="faculty" pageTitle="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Class Analytics</h1>
          <p className="mt-2 text-muted-foreground">Analyze attendance and performance trends for your classes</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Average Attendance"
            value="88%"
            trend={3}
            icon="users"
          />
          <StatCard
            title="Class Average Score"
            value="79%"
            trend={-2}
            icon="trending-up"
          />
          <StatCard
            title="Total Students"
            value="156"
            icon="graduation-cap"
          />
          <StatCard
            title="At Risk Students"
            value="12"
            trend={-1}
            icon="alert-triangle"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Attendance Trend (Weekly)" subtitle="Last 6 weeks">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--chart-1)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Subject-wise Performance" subtitle="Average scores by subject">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </AppLayout>
  );
}
