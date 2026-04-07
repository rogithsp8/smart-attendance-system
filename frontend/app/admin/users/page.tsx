'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen, Trash2 } from 'lucide-react';
import { userAPI, subjectAPI, User, Subject } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSubjects, setUserSubjects] = useState<Subject[]>([]);
  const [loadingUserSubjects, setLoadingUserSubjects] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([userAPI.getAllUsers(), subjectAPI.getSubjects()])
      .then(([usersRes, subjectsRes]) => {
        setUsers(usersRes.data);
        setSubjects(subjectsRes.data);
      })
      .catch((err) => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  }, []);

  const openAssignDialog = async (user: User) => {
    setSelectedUser(user);
    setSelectedSubjectId('');
    setIsDialogOpen(true);
    setLoadingUserSubjects(true);
    try {
      const res = await userAPI.getUserSubjects(user.id);
      setUserSubjects(res.data);
    } catch (err) {
      console.error('Failed to load user subjects:', err);
      setUserSubjects([]);
    } finally {
      setLoadingUserSubjects(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedSubjectId) return;
    try {
      const res = await userAPI.assignSubject(selectedUser.id, parseInt(selectedSubjectId));
      setUserSubjects(res.data);
      setSelectedSubjectId('');
    } catch (err) {
      console.error('Failed to assign subject:', err);
      alert('Failed to assign subject');
    }
  };

  const handleRemove = async (subjectId: number) => {
    if (!selectedUser) return;
    try {
      const res = await userAPI.removeSubject(selectedUser.id, subjectId);
      setUserSubjects(res.data);
    } catch (err) {
      console.error('Failed to remove subject:', err);
      alert('Failed to remove subject');
    }
  };

  const unassignedSubjects = subjects.filter(
    (s) => !userSubjects.some((us) => us.id === s.id)
  );

  if (loading) {
    return (
      <AppLayout userRole="admin" pageTitle="User Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin" pageTitle="User Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage users and assign subjects to students
          </p>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground">{user.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === 'STUDENT'
                          ? 'bg-blue-100 text-blue-700'
                          : user.role === 'FACULTY'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role === 'STUDENT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openAssignDialog(user)}
                        >
                          <BookOpen className="h-3 w-3" />
                          Assign Subjects
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Subject Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Assign Subjects — {selectedUser?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Assign new subject */}
              <div>
                <Label>Add Subject</Label>
                <div className="mt-1 flex gap-2">
                  <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {unassignedSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name} ({s.code})
                        </SelectItem>
                      ))}
                      {unassignedSubjects.length === 0 && (
                        <SelectItem value="none" disabled>
                          All subjects assigned
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssign} disabled={!selectedSubjectId}>
                    Assign
                  </Button>
                </div>
              </div>

              {/* Current subjects */}
              <div>
                <Label>Assigned Subjects</Label>
                {loadingUserSubjects ? (
                  <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                ) : userSubjects.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {userSubjects.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between rounded border border-border bg-muted/40 px-3 py-2"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {s.name}
                          <span className="ml-2 text-xs text-muted-foreground">({s.code})</span>
                        </span>
                        <button
                          onClick={() => handleRemove(s.id)}
                          className="text-destructive hover:text-destructive/80"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">No subjects assigned yet</p>
                )}
              </div>

              <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
