'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Plus } from 'lucide-react';

const assessmentsData = [
  {
    id: 1,
    assessmentName: 'Midterm Exam',
    subject: 'Data Structures',
    date: '2024-03-15',
    totalMarks: 100,
    averageScore: 72.5,
    submittedCount: 42,
    totalStudents: 45,
    status: 'completed',
  },
  {
    id: 2,
    assessmentName: 'Assignment 1',
    subject: 'Algorithms',
    date: '2024-03-20',
    totalMarks: 50,
    averageScore: 85.3,
    submittedCount: 44,
    totalStudents: 45,
    status: 'completed',
  },
  {
    id: 3,
    assessmentName: 'Quiz 3',
    subject: 'Database Systems',
    date: '2024-03-25',
    totalMarks: 25,
    averageScore: null,
    submittedCount: 0,
    totalStudents: 45,
    status: 'pending',
  },
  {
    id: 4,
    assessmentName: 'Final Project',
    subject: 'Web Development',
    date: '2024-04-10',
    totalMarks: 200,
    averageScore: null,
    submittedCount: 12,
    totalStudents: 45,
    status: 'in-progress',
  },
];

export default function FacultyAssessmentsPage() {
  const assessmentColumns = [
    { key: 'assessmentName', label: 'Assessment Name', className: 'font-medium' },
    { key: 'subject', label: 'Subject' },
    { key: 'date', label: 'Date' },
    { key: 'totalMarks', label: 'Total Marks' },
    {
      key: 'averageScore',
      label: 'Average Score',
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
    <AppLayout userRole="faculty" pageTitle="Assessments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
            <p className="mt-2 text-muted-foreground">Manage quizzes, assignments, and exams for your classes</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assessment
          </Button>
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
