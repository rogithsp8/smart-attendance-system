'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Plus } from 'lucide-react';
import { subjectAPI, topicAPI, Subject, Topic } from '@/lib/api';

export default function FacultyCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateTopicDialogOpen, setIsCreateTopicDialogOpen] = useState(false);
  const [topicFormData, setTopicFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
  });

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

  const handleCreateTopic = async () => {
    console.log('Creating topic:', topicFormData);
    
    if (!topicFormData.title || !topicFormData.description || !topicFormData.subjectId) {
      alert('Please fill all fields');
      return;
    }

    try {
      const topicData = {
        title: topicFormData.title,
        description: topicFormData.description,
        subject: {
          id: parseInt(topicFormData.subjectId),
          name: '', // Backend will populate this
          code: '', // Backend will populate this
          facultyId: 0, // Backend will populate this
        },
      };
      
      await topicAPI.createTopic(topicData);
      alert('Topic created successfully!');
      setIsCreateTopicDialogOpen(false);
      setTopicFormData({ title: '', description: '', subjectId: '' });
    } catch (err) {
      console.error('Error creating topic:', err);
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
          <Button className="gap-2" onClick={() => setIsCreateTopicDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Topic
          </Button>
        </div>

        {/* Create Topic Dialog */}
        <Dialog open={isCreateTopicDialogOpen} onOpenChange={setIsCreateTopicDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input
                  id="topicTitle"
                  value={topicFormData.title}
                  onChange={(e) => setTopicFormData({ ...topicFormData, title: e.target.value })}
                  placeholder="e.g., Introduction to Algorithms"
                />
              </div>
              <div>
                <Label htmlFor="topicDescription">Description</Label>
                <Textarea
                  id="topicDescription"
                  value={topicFormData.description}
                  onChange={(e) => setTopicFormData({ ...topicFormData, description: e.target.value })}
                  placeholder="Enter topic description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="topicSubject">Subject</Label>
                <Select value={topicFormData.subjectId} onValueChange={(value) => setTopicFormData({ ...topicFormData, subjectId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateTopic} className="flex-1">
                  Add Topic
                </Button>
                <Button variant="outline" onClick={() => setIsCreateTopicDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
