'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { assessmentAPI, subjectAPI, Assessment, Subject } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([assessmentAPI.getAssessments(), subjectAPI.getSubjects()])
      .then(([assessmentsRes, subjectsRes]) => {
        console.log('Assessments:', assessmentsRes.data);
        console.log('Subjects:', subjectsRes.data);
        setAssessments(assessmentsRes.data);
        setSubjects(subjectsRes.data);
      })
      .catch(() => setError('Failed to load assessments'))
      .finally(() => setLoading(false));
  }, []);

  const getSubjectName = (subjectId: number) =>
    subjects.find((s) => s.id === subjectId)?.name ?? `Subject ${subjectId}`;

  const avgMarks = assessments.length > 0
    ? Math.round(assessments.reduce((sum, a) => sum + a.totalMarks, 0) / assessments.length)
    : 0;

  if (loading) {
    return (
      <AppLayout userRole="admin" pageTitle="Assessments Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin" pageTitle="Assessments Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin" pageTitle="Assessments Overview">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Institution Assessments</h1>
            <p className="mt-2 text-muted-foreground">Monitor all assessments across the institution</p>
          </div>
          <Button className="gap-2" onClick={() => router.push('/faculty/assessments')}>
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Assessments"
            value={assessments.length.toString()}
            icon={FileText}
            description="Assessments created"
          />
          <StatCard
            title="Total Subjects"
            value={subjects.length.toString()}
            icon={CheckCircle}
            description="Active subjects"
          />
          <StatCard
            title="Avg Total Marks"
            value={avgMarks.toString()}
            icon={TrendingUp}
            description="Average marks per assessment"
          />
        </div>

        {/* Assessments Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">All Assessments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total Marks</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground">{assessment.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{assessment.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getSubjectName(assessment.subjectId)}
                    </td>
                    <td className="px-4 py-3 text-foreground">{assessment.totalMarks}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
                {assessments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No assessments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
