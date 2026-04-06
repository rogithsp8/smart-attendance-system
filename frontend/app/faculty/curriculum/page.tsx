'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { subjectAPI, Subject } from '@/lib/api';

export default function FacultyCurriculumPage() {
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
      <AppLayout userRole="faculty" pageTitle="Curriculum Progress">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="faculty" pageTitle="Curriculum Progress">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="faculty" pageTitle="Curriculum Progress">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Curriculum Progress</h1>
            <p className="mt-2 text-muted-foreground">Track topics planned and completed for your subjects</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Topic
          </Button>
        </div>

        {/* Subjects Progress */}
        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.id} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Subject ID: {subject.id}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                      Faculty ID: {subject.facultyId}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Progress Overview</span>
                    <span className="text-sm font-medium text-primary">Active</span>
                  </div>
                  <ProgressBar value={75} max={100} label="Progress" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Topics Planned</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">10</p>
                  </div>
                  <div className="rounded border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Topics Completed</p>
                    <p className="mt-1 text-2xl font-bold text-success">7</p>
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
