'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { userAPI, User } from '@/lib/api';

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userAPI.getStudents()
      .then((res) => {
        console.log('Students:', res.data);
        setStudents(res.data);
      })
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout userRole="faculty" pageTitle="Students">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="faculty" pageTitle="Students">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="faculty" pageTitle="Students">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage student records ({students.length} enrolled)
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Enrolled Students</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Attendance</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Avg Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  // Attendance and score not available from /api/students — default to 0
                  const attendance = 0;
                  const avgScore = 0;
                  const isAtRisk = attendance > 0 && attendance < 75;

                  return (
                    <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground">{student.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
                      <td className="px-4 py-3 w-40">
                        <ProgressBar
                          label=""
                          value={attendance}
                          max={100}
                          showPercentage={false}
                        />
                      </td>
                      <td className="px-4 py-3 w-40">
                        <ProgressBar
                          label=""
                          value={avgScore}
                          max={100}
                          showPercentage={false}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          isAtRisk
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isAtRisk ? 'At Risk' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No students found
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
