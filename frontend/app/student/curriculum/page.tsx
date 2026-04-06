'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { CheckCircle, Clock } from 'lucide-react';
import { subjectAPI, Subject } from '@/lib/api';

export default function StudentCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await subjectAPI.getSubjects();
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to load subjects');
      console.error('Error loading subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout userRole="student" pageTitle="Curriculum">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="student" pageTitle="Curriculum">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="student" pageTitle="Curriculum">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Curriculum Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your progress across all subjects</p>
        </div>

        {/* Subject Progress Cards */}
        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.id} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Subject ID: {subject.id}
                    </p>
                  </div>
                  <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                    75% Complete
                  </span>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <span className="text-sm font-medium text-primary">75%</span>
                  </div>
                  <ProgressBar value={75} max={100} label="Progress" />
                </div>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded border border-border bg-muted/40 p-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Covered Topics</p>
                      <p className="font-semibold text-foreground">7</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded border border-border bg-muted/40 p-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Topics</p>
                      <p className="font-semibold text-foreground">3</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Status</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No subjects found
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
