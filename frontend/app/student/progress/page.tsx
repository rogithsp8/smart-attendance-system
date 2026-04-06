'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceTrendData = [
  { month: 'Jan', attendance: 95 },
  { month: 'Feb', attendance: 92 },
  { month: 'Mar', attendance: 90 },
];

const performanceData = [
  { subject: 'Data Structures', score: 85 },
  { subject: 'Algorithms', score: 82 },
  { subject: 'Database', score: 78 },
  { subject: 'Web Dev', score: 88 },
  { subject: 'OS', score: 75 },
];

export default function StudentProgressPage() {
  return (
    <AppLayout userRole="student" pageTitle="Progress">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your overall academic performance and learning journey</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall GPA"
            value="3.8"
            trend={2}
            icon="trending-up"
          />
          <StatCard
            title="Attendance"
            value="90%"
            trend={-2}
            icon="users"
          />
          <StatCard
            title="Average Score"
            value="82%"
            trend={3}
            icon="award"
          />
          <StatCard
            title="Risk Status"
            value="Normal"
            icon="shield-check"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Attendance Trend" subtitle="Last 3 months">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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

          <ChartCard title="Subject Performance" subtitle="Average scores by subject">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Subject-wise Summary */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Subject-wise Performance</h2>
          <div className="space-y-4">
            {performanceData.map((item, idx) => (
              <div key={idx}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.subject}</span>
                  <span className="text-sm text-primary">{item.score}%</span>
                </div>
                <ProgressBar percentage={item.score} variant={item.score >= 80 ? 'default' : 'warning'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
