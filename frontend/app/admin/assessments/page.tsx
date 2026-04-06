'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Plus } from 'lucide-react';

const assessmentsData = [
  {
    id: 1,
    assessmentName: 'Midterm Exam',
    subject: 'Data Structures',
    faculty: 'Dr. Rajesh Kumar',
    date: '2024-03-15',
    totalMarks: 100,
    averageScore: 72.5,
    submittedCount: 156,
    totalStudents: 168,
    status: 'completed',
  },
  {
    id: 2,
    assessmentName: 'Assignment 1',
    subject: 'Algorithms',
    faculty: 'Prof. Priya Singh',
    date: '2024-03-20',
    totalMarks: 50,
    averageScore: 85.3,
    submittedCount: 152,
    totalStudents: 160,
    status: 'completed',
  },
  {
    id: 3,
    assessmentName: 'Quiz 3',
    subject: 'Database Systems',
    faculty: 'Dr. Arjun Patel',
    date: '2024-03-25',
    totalMarks: 25,
    averageScore: null,
    submittedCount: 0,
    totalStudents: 150,
    status: 'pending',
  },
];

export default function AdminAssessmentsPage() {
  const assessmentColumns = [
    { key: 'assessmentName', label: 'Assessment', className: 'font-medium' },
    { key: 'subject', label: 'Subject' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'date', label: 'Date' },
    { key: 'totalMarks', label: 'Total Marks' },
    {
      key: 'averageScore',
      label: 'Avg Score',
      render: (value: any) => (value !== null ? `${value}` : '—'),
    },
    {
      key: 'submittedCount',
      label: 'Submissions',
      render: (value: any, row: any) => `${value}/${row.totalStudents}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  return (
    <AppLayout userRole="admin" pageTitle="Assessments Overview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Institution Assessments</h1>
            <p className="mt-2 text-muted-foreground">Monitor all assessments across the institution</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Assessments" value="28" icon="file-text" />
          <StatCard title="Avg Submission Rate" value="92%" icon="check-circle" />
          <StatCard title="Avg Score" value="79%" icon="trending-up" />
        </div>

        {/* Assessments Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">All Assessments</h2>
          <DataTable columns={assessmentColumns} data={assessmentsData} />
        </div>
      </div>
    </AppLayout>
  );
}
