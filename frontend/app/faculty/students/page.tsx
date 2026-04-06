'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ProgressBar } from '@/components/dashboard/progress-bar';

const studentsData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rollNumber: 'CS-001',
    email: 'rajesh@university.edu',
    attendance: 92,
    averageScore: 85,
    status: 'normal',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rollNumber: 'CS-002',
    email: 'priya@university.edu',
    attendance: 88,
    averageScore: 78,
    status: 'normal',
  },
  {
    id: 3,
    name: 'Arjun Singh',
    rollNumber: 'CS-003',
    email: 'arjun@university.edu',
    attendance: 65,
    averageScore: 55,
    status: 'at-risk',
  },
  {
    id: 4,
    name: 'Neha Patel',
    rollNumber: 'CS-004',
    email: 'neha@university.edu',
    attendance: 95,
    averageScore: 92,
    status: 'normal',
  },
  {
    id: 5,
    name: 'Vikram Desai',
    rollNumber: 'CS-005',
    email: 'vikram@university.edu',
    attendance: 72,
    averageScore: 68,
    status: 'at-risk',
  },
];

export default function FacultyStudentsPage() {
  const studentColumns = [
    { key: 'name', label: 'Name', className: 'font-medium' },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'email', label: 'Email' },
    {
      key: 'attendance',
      label: 'Attendance',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16">
            <ProgressBar percentage={value} variant={value >= 75 ? 'default' : 'warning'} />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: 'averageScore',
      label: 'Avg Score',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16">
            <ProgressBar percentage={value} variant={value >= 70 ? 'default' : 'warning'} />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  return (
    <AppLayout userRole="faculty" pageTitle="Students">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-2 text-muted-foreground">View and manage student records, attendance, and performance</p>
        </div>

        {/* Students Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Enrolled Students</h2>
          <DataTable columns={studentColumns} data={studentsData} />
        </div>
      </div>
    </AppLayout>
  );
}
