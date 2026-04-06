'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Plus } from 'lucide-react';
import { subjectAPI, Subject } from '@/lib/api';

export default function AdminCurriculumPage() {
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

  const curriculumColumns = [
    { key: 'id' as keyof Subject, label: 'Subject ID', className: 'font-medium' },
    { key: 'name' as keyof Subject, label: 'Subject Name' },
    { key: 'facultyId' as keyof Subject, label: 'Faculty ID' },
  ];

  if (loading) {
    return (
      <AppLayout userRole="admin" pageTitle="Curriculum Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin" pageTitle="Curriculum Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin" pageTitle="Curriculum Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Curriculum Management</h1>
            <p className="mt-2 text-muted-foreground">Oversee curriculum planning and topic coverage across all subjects</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {/* Subjects Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">All Subjects</h2>
          {subjects.length > 0 ? (
            <DataTable columns={curriculumColumns} data={subjects} />
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
