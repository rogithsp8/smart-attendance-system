'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { subjectAPI, topicAPI, Subject, Topic } from '@/lib/api';

export default function StudentCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<number, Topic[]>>({});
  const [loadingTopics, setLoadingTopics] = useState<Record<number, boolean>>({});

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

  const handleSubjectClick = async (subjectId: number) => {
    // Collapse if already expanded
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
      return;
    }

    setExpandedSubjectId(subjectId);

    // Don't re-fetch if already loaded
    if (topicsBySubject[subjectId]) return;

    setLoadingTopics((prev) => ({ ...prev, [subjectId]: true }));
    try {
      const response = await topicAPI.getTopicsBySubject(subjectId);
      console.log('Topics:', response.data);
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: response.data }));
    } catch (err) {
      console.error('Error loading topics for subject', subjectId, err);
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: [] }));
    } finally {
      setLoadingTopics((prev) => ({ ...prev, [subjectId]: false }));
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Curriculum Progress</h1>
          <p className="mt-2 text-muted-foreground">
            Click a subject to view its topics
          </p>
        </div>

        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => {
              const isExpanded = expandedSubjectId === subject.id;
              const topics = topicsBySubject[subject.id] ?? [];
              const isLoadingTopics = loadingTopics[subject.id] ?? false;

              return (
                <div key={subject.id} className="rounded-lg border border-border bg-card">
                  {/* Clickable subject header */}
                  <button
                    onClick={() => handleSubjectClick(subject.id)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-muted/30 transition-colors rounded-lg"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                        Active
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded topics section */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-border">
                      {isLoadingTopics ? (
                        <div className="py-4 text-sm text-muted-foreground">Loading topics...</div>
                      ) : topics.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm font-medium text-foreground">
                            {topics.length} topic{topics.length !== 1 ? 's' : ''}
                          </p>
                          {topics.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex items-start gap-3 rounded border border-border bg-muted/40 p-3"
                            >
                              {topic.completed ? (
                                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                              ) : (
                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-foreground">{topic.title}</p>
                                {topic.description && (
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {topic.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-sm text-muted-foreground">
                          No topics found for this subject
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">No subjects found</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
