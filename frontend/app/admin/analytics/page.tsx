'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ChartCard } from '@/components/dashboard/chart-card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  HeatMap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
} from 'recharts';

const attendanceVsPerformanceData = [
  { attendance: 95, performance: 92, students: 12 },
  { attendance: 92, performance: 88, students: 18 },
  { attendance: 85, performance: 82, students: 25 },
  { attendance: 78, performance: 75, students: 15 },
  { attendance: 68, performance: 65, students: 8 },
  { attendance: 45, performance: 42, students: 2 },
];

const weeklyAttendanceData = [
  { day: 'Monday', percentage: 88 },
  { day: 'Tuesday', percentage: 90 },
  { day: 'Wednesday', percentage: 87 },
  { day: 'Thursday', percentage: 85 },
  { day: 'Friday', percentage: 89 },
];

const atRiskTrendData = [
  { week: 'Week 1', count: 3 },
  { week: 'Week 2', count: 5 },
  { week: 'Week 3', count: 4 },
  { week: 'Week 4', count: 6 },
  { week: 'Week 5', count: 4 },
  { week: 'Week 6', count: 2 },
];

const departmentPerformanceData = [
  { department: 'CS', avgPerformance: 82, avgAttendance: 87 },
  { department: 'ECE', avgPerformance: 78, avgAttendance: 85 },
  { department: 'Mechanical', avgPerformance: 80, avgAttendance: 83 },
  { department: 'Civil', avgPerformance: 75, avgAttendance: 81 },
];

const engagementDistributionData = [
  { range: '90-100', students: 15 },
  { range: '80-89', students: 32 },
  { range: '70-79', students: 48 },
  { range: '60-69', students: 28 },
  { range: 'Below 60', students: 12 },
];

export default function AnalyticsPage() {
  return (
    <AppLayout userRole="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Advanced Analytics
          </h1>
          <p className="mt-1 text-muted-foreground">
            Deep insights into institutional performance and student engagement patterns
          </p>
        </div>

        {/* Primary Analytics Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Attendance vs Performance Correlation */}
          <ChartCard
            title="Attendance vs Performance Correlation"
            description="Strong correlation between attendance and academic performance"
          >
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="attendance"
                  name="Attendance %"
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis
                  dataKey="performance"
                  name="Performance %"
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter
                  name="Student Distribution"
                  data={attendanceVsPerformanceData}
                  fill="var(--color-primary)"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Weekly Attendance Heatmap */}
          <ChartCard
            title="Weekly Attendance Heatmap"
            description="Attendance patterns across weekdays"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Bar
                  dataKey="percentage"
                  fill="var(--color-secondary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Secondary Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* At-Risk Student Trend */}
          <ChartCard
            title="At-Risk Student Trend"
            description="Weekly count of at-risk students requiring intervention"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={atRiskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-destructive)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-destructive)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Department Performance Comparison */}
          <ChartCard
            title="Department Performance Comparison"
            description="Average performance and attendance by department"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={departmentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend />
                <Bar dataKey="avgPerformance" fill="var(--color-primary)" />
                <Bar dataKey="avgAttendance" fill="var(--color-secondary)" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Engagement Distribution */}
        <ChartCard
          title="Engagement Score Distribution"
          description="Distribution of student engagement scores across institution"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="range" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Bar dataKey="students" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Key Insights */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h4 className="font-semibold mb-2">Average Attendance</h4>
            <p className="text-3xl font-bold text-primary">87.8%</p>
            <p className="text-sm text-muted-foreground mt-2">
              Slight decrease from previous semester
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h4 className="font-semibold mb-2">Average Performance</h4>
            <p className="text-3xl font-bold text-secondary">79.5%</p>
            <p className="text-sm text-muted-foreground mt-2">
              Maintained from last assessment period
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h4 className="font-semibold mb-2">At-Risk Count</h4>
            <p className="text-3xl font-bold text-yellow-600">12</p>
            <p className="text-sm text-muted-foreground mt-2">
              Trending downward with interventions
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
