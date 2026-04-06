'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

const classAttendanceData = [
  {
    id: 1,
    className: 'CS-201 A',
    faculty: 'Dr. Rajesh Kumar',
    presentCount: 42,
    absentCount: 3,
    lateCount: 2,
    totalStudents: 47,
    attendancePercentage: 89,
    date: '2024-03-20',
  },
  {
    id: 2,
    className: 'CS-202 B',
    faculty: 'Prof. Priya Singh',
    presentCount: 38,
    absentCount: 5,
    lateCount: 2,
    totalStudents: 45,
    attendancePercentage: 84,
    date: '2024-03-20',
  },
  {
    id: 3,
    className: 'CS-201 B',
    faculty: 'Dr. Arjun Patel',
    presentCount: 40,
    absentCount: 4,
    lateCount: 1,
    totalStudents: 45,
    attendancePercentage: 89,
    date: '2024-03-20',
  },
];

export default function AdminAttendancePage() {
  const attendanceColumns = [
    { key: 'className', label: 'Class', className: 'font-medium' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'date', label: 'Date' },
    {
      key: 'attendancePercentage',
      label: 'Attendance %',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">{value}%</span>
        </div>
      ),
    },
    {
      key: 'presentCount',
      label: 'Present',
      render: (value: any) => <span className="font-medium text-success">{value}</span>,
    },
    {
      key: 'absentCount',
      label: 'Absent',
      render: (value: any) => <span className="font-medium text-error">{value}</span>,
    },
  ];

  return (
    <AppLayout userRole="admin" pageTitle="Attendance Overview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Institution Attendance</h1>
            <p className="mt-2 text-muted-foreground">Monitor attendance across all classes and sections</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Overall Attendance" value="87%" icon="users" />
          <StatCard title="Classes Monitored" value="12" icon="book-open" />
          <StatCard title="At-Risk Classes" value="2" icon="alert-triangle" />
        </div>

        {/* Attendance Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Class-wise Attendance</h2>
          <DataTable columns={attendanceColumns} data={classAttendanceData} />
        </div>
      </div>
    </AppLayout>
  );
}
