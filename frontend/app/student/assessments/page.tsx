'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const upcomingAssessments = [
  {
    id: 1,
    name: 'Midterm Exam',
    subject: 'Data Structures',
    dueDate: '2024-03-25',
    type: 'exam',
    totalMarks: 100,
  },
  {
    id: 2,
    name: 'Assignment 2',
    subject: 'Algorithms',
    dueDate: '2024-03-22',
    type: 'assignment',
    totalMarks: 50,
  },
  {
    id: 3,
    name: 'Quiz 4',
    subject: 'Database Systems',
    dueDate: '2024-03-23',
    type: 'quiz',
    totalMarks: 25,
  },
];

const pastResults = [
  {
    id: 1,
    name: 'Quiz 1',
    subject: 'Data Structures',
    date: '2024-03-10',
    obtainedMarks: 22,
    totalMarks: 25,
    percentage: 88,
    status: 'completed',
  },
  {
    id: 2,
    name: 'Assignment 1',
    subject: 'Algorithms',
    date: '2024-03-12',
    obtainedMarks: 42,
    totalMarks: 50,
    percentage: 84,
    status: 'completed',
  },
  {
    id: 3,
    name: 'Quiz 2',
    subject: 'Database Systems',
    date: '2024-03-15',
    obtainedMarks: 18,
    totalMarks: 25,
    percentage: 72,
    status: 'completed',
  },
];

export default function StudentAssessmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'results'>('upcoming');

  return (
    <AppLayout userRole="student" pageTitle="Assessments">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="mt-2 text-muted-foreground">View upcoming assessments and past results</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Results
          </button>
        </div>

        {/* Content */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">You have {upcomingAssessments.length} upcoming assessments</div>
            {upcomingAssessments.map((assessment) => (
              <div key={assessment.id} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{assessment.name}</h3>
                    <p className="text-sm text-muted-foreground">{assessment.subject}</p>
                  </div>
                  <span className="inline-block rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning">
                    {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                  </span>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Due: {assessment.dueDate}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Total: {assessment.totalMarks} marks</div>
                </div>
                <Button className="w-full">Start Assessment</Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">You have completed {pastResults.length} assessments</div>
            {pastResults.map((result) => (
              <div key={result.id} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{result.name}</h3>
                    <p className="text-sm text-muted-foreground">{result.subject}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{result.percentage}%</div>
                    <p className="text-sm text-muted-foreground">
                      {result.obtainedMarks}/{result.totalMarks} marks
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed on {result.date}</span>
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
