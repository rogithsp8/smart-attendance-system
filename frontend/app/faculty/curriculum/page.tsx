'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { subjectAPI, topicAPI, Subject, Topic } from '@/lib/api';

export default function FacultyCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<number, Topic[]>>({});
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', subjectId: '' });
  const [markingComplete, setMarkingComplete] = useState<Record<number, boolean>>({});

  useEffect(() => {
    subjectAPI.getSubjects()
      .then((res) => {
        console.log('Subjects:', res.data);
        setSubjects(res.data);
      })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  const loadTopics = async (subjectId: number, forceRefresh = false) => {
    if (topicsBySubject[subjectId] && !forceRefresh) return;
    setLoadingTopics((prev) => ({ ...prev, [subjectId]: true }));
    try {
      const res = await topicAPI.getTopicsBySubject(subjectId);
      console.log(`Topics for subject ${subjectId}:`, res.data);
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: res.data }));
    } catch (err) {
      console.error('Failed to load topics:', err);
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: [] }));
    } finally {
      setLoadingTopics((prev) => ({ ...prev, [subjectId]: false }));
    }
  };

  const handleSubjectClick = (subjectId: number) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
      return;
    }
    setExpandedSubjectId(subjectId);
    loadTopics(subjectId);
  };

  const handleMarkComplete = async (subjectId: number, topicId: number) => {
    setMarkingComplete((prev) => ({ ...prev, [topicId]: true }));
    try {
      const res = await topicAPI.markComplete(topicId);
      console.log('Mark complete response:', res.data);
      // Update this topic in local state immediately
      setTopicsBySubject((prev) => ({
        ...prev,
        [subjectId]: (prev[subjectId] ?? []).map((t) =>
          t.id === topicId ? { ...t, completed: true } : t
        ),
      }));
    } catch (err) {
      console.error('Failed to mark topic as complete:', err);
      alert('Failed to mark topic as complete. Check console for details.');
    } finally {
      setMarkingComplete((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  const handleCreateTopic = async () => {
    if (!formData.title || !formData.description || !formData.subjectId) {
      alert('Please fill all fields');
      return;
    }
    try {
      await topicAPI.createTopic({
        title: formData.title,
        description: formData.description,
        completed: false,
        subject: { id: parseInt(formData.subjectId), name: '', code: '', facultyId: 0 },
      });
      alert('Topic created successfully!');
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', subjectId: '' });
      // Invalidate cache for that subject so it reloads
      const sid = parseInt(formData.subjectId);
      setTopicsBySubject((prev) => {
        const next = { ...prev };
        delete next[sid];
        return next;
      });
      // If that subject is expanded, reload it
      if (expandedSubjectId === sid) {
        loadTopics(sid);
      }
    } catch {
      alert('Failed to create topic');
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
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="faculty" pageTitle="Curriculum Progress">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Curriculum Progress</h1>
            <p className="mt-2 text-muted-foreground">
              Track topics planned and completed for your subjects
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Topic
          </Button>
        </div>

        {/* Create Topic Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input
                  id="topicTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to Algorithms"
                />
              </div>
              <div>
                <Label htmlFor="topicDescription">Description</Label>
                <Textarea
                  id="topicDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter topic description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="topicSubject">Subject</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleCreateTopic} className="flex-1">Add Topic</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Subjects list */}
        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => {
              const topics = topicsBySubject[subject.id] ?? [];
              const isExpanded = expandedSubjectId === subject.id;
              const isLoadingTopics = loadingTopics[subject.id] ?? false;
              const completed = topics.filter((t) => t.completed).length;
              const total = topics.length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={subject.id} className="rounded-lg border border-border bg-card">
                  {/* Clickable header */}
                  <button
                    onClick={() => handleSubjectClick(subject.id)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-muted/30 transition-colors rounded-lg"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isExpanded && total > 0 && (
                        <span className="text-xs font-medium text-primary">
                          {completed}/{total} done
                        </span>
                      )}
                      {isExpanded
                        ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded section */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-border">
                      {isLoadingTopics ? (
                        <p className="py-4 text-sm text-muted-foreground">Loading topics...</p>
                      ) : (
                        <>
                          {/* Progress */}
                          {total > 0 && (
                            <div className="mt-4 mb-4">
                              <ProgressBar
                                label="Curriculum Progress"
                                value={progress}
                                max={100}
                              />
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="rounded border border-border bg-muted/40 p-3 text-center">
                                  <p className="text-xs text-muted-foreground">Topics Planned</p>
                                  <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
                                </div>
                                <div className="rounded border border-border bg-muted/40 p-3 text-center">
                                  <p className="text-xs text-muted-foreground">Topics Completed</p>
                                  <p className="mt-1 text-2xl font-bold text-success">{completed}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Topic list */}
                          {topics.length > 0 ? (
                            <div className="space-y-2">
                              {topics.map((topic) => (
                                <div
                                  key={topic.id}
                                  className={`flex items-start justify-between rounded border p-3 ${
                                    topic.completed
                                      ? 'border-green-200 bg-green-50'
                                      : 'border-border bg-muted/20'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {topic.completed
                                      ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                      : <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />}
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{topic.title}</p>
                                      {topic.description && (
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                          {topic.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {!topic.completed && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={markingComplete[topic.id]}
                                      onClick={() => handleMarkComplete(subject.id, topic.id)}
                                      className="ml-3 shrink-0 text-xs"
                                    >
                                      {markingComplete[topic.id] ? 'Saving...' : 'Mark Complete'}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="py-4 text-sm text-muted-foreground">
                              No topics yet. Click "Add Topic" to create one.
                            </p>
                          )}
                        </>
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
