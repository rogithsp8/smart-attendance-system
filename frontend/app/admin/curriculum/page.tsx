'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { subjectAPI, Subject } from '@/lib/api';

export default function AdminCurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', facultyId: '' });

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    try {
      const response = await subjectAPI.getSubjects();
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!formData.name || !formData.code || !formData.facultyId) {
      alert('Please fill all fields');
      return;
    }
    try {
      await subjectAPI.createSubject({
        name: formData.name,
        code: formData.code,
        facultyId: parseInt(formData.facultyId),
      });
      alert('Subject created successfully!');
      setIsDialogOpen(false);
      setFormData({ name: '', code: '', facultyId: '' });
      loadSubjects();
    } catch (err) {
      console.error('Error creating subject:', err);
      alert('Failed to create subject');
    }
  };

  const curriculumColumns = [
    { key: 'id' as keyof Subject, label: 'Subject ID', className: 'font-medium' },
    { key: 'name' as keyof Subject, label: 'Subject Name' },
    { key: 'code' as keyof Subject, label: 'Code' },
    { key: 'facultyId' as keyof Subject, label: 'Faculty ID' },
  ];

  if (loading) {
    return (
      <AppLayout userRole="admin" pageTitle="Curriculum Management">
        <div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin" pageTitle="Curriculum Management">
        <div className="flex items-center justify-center h-64"><div className="text-lg text-red-500">Error: {error}</div></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin" pageTitle="Curriculum Management">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Curriculum Management</h1>
            <p className="mt-2 text-muted-foreground">Oversee curriculum planning and topic coverage across all subjects</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Subject</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input id="subjectName" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Data Structures" />
              </div>
              <div>
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input id="subjectCode" value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS301" />
              </div>
              <div>
                <Label htmlFor="facultyId">Faculty ID</Label>
                <Input id="facultyId" type="number" value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  placeholder="e.g., 2" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateSubject} className="flex-1">Create Subject</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">All Subjects</h2>
          {subjects.length > 0 ? (
            <DataTable columns={curriculumColumns} data={subjects} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">No subjects found</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
