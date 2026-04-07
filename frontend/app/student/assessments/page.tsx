'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { assessmentAPI, Assessment } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function StudentAssessmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'results'>('upcoming');

  const handleStartAssessment = (assessmentId: number) => {
    router.push(`/student/take-assessment/${assessmentId}`);
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadAssessments = async () => {
      try {
        const response = await assessmentAPI.getStudentAssessments(user.id);
        setAssessments(response.data);
      } catch (err) {
        setError('Failed to load assessments');
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [user?.id]);

  if (loading) {
    return (
      <AppLayout userRole="student" pageTitle="Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="student" pageTitle="Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

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
            <div className="text-sm text-muted-foreground">You have {assessments.length} assessments</div>
            {assessments.length > 0 ? (
              assessments.map((assessment) => (
                <div key={assessment.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{assessment.title}</h3>
                      <p className="text-sm text-muted-foreground">Subject ID: {assessment.subjectId}</p>
                    </div>
                    <span className="inline-block rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning">
                      Assessment
                    </span>
                  </div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">Total: {assessment.totalMarks} marks</div>
                  </div>
                  <Button onClick={() => handleStartAssessment(assessment.id)} className="w-full">
                    Start Assessment
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming assessments found
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Your completed assessments will appear here</div>
            <div className="text-center py-8 text-muted-foreground">
              No completed assessments found
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
