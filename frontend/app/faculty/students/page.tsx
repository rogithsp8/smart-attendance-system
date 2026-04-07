'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { userAPI, attendanceAPI, attemptAPI, User, Attendance, Attempt } from '@/lib/api';

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [allAttendance, setAllAttendance] = useState<Attendance[]>([]);
  const [allAttempts, setAllAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      userAPI.getStudents(),
      attendanceAPI.getAttendance(),
    ])
      .then(([studentsRes, attendanceRes]) => {
        const studentList = studentsRes.data;
        setStudents(studentList);
        setAllAttendance(attendanceRes.data);

        // Fetch attempts for every student in parallel
        Promise.allSettled(
          studentList.map((s) => attemptAPI.getAttemptsByUser(s.id))
        ).then((results) => {
          const merged: Attempt[] = [];
          results.forEach((r) => {
            if (r.status === 'fulfilled') merged.push(...r.value.data);
          });
          setAllAttempts(merged);
        });
      })
      .catch(() => setError('Failed to load student data'))
      .finally(() => setLoading(false));
  }, []);

  // Compute attendance % for a student from the bulk attendance list
  const getAttendance = (studentId: number): number => {
    const records = allAttendance.filter((a) => a.studentId === studentId);
    if (records.length === 0) return 0;
    const present = records.filter((a) => a.status === 'PRESENT').length;
    return Math.round((present / records.length) * 100);
  };

  // Compute avg score from attempts collected per student
  const getAvgScore = (studentId: number): number => {
    const attempts = allAttempts.filter((a) => a.userId === studentId);
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, a) => sum + (a.score ?? 0), 0);
    return Math.round(total / attempts.length);
  };

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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-48">Attendance</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-48">Avg Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const attendance = getAttendance(student.id);
                  const avgScore = getAvgScore(student.id);
                  const isAtRisk = attendance < 75;
                  const hasAttendanceData = allAttendance.some((a) => a.studentId === student.id);

                  return (
                    <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground">{student.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.email}</td>

                      {/* Attendance */}
                      <td className="px-4 py-3">
                        {hasAttendanceData ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBar
                                label=""
                                value={attendance}
                                max={100}
                                showPercentage={false}
                                variant={attendance >= 75 ? 'success' : 'warning'}
                              />
                            </div>
                            <span className="text-xs font-semibold w-9 text-right">
                              {attendance}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No data</span>
                        )}
                      </td>

                      {/* Avg Score */}
                      <td className="px-4 py-3">
                        {allAttempts.some((a) => a.userId === student.id) ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBar
                                label=""
                                value={avgScore}
                                max={100}
                                showPercentage={false}
                                variant={avgScore >= 70 ? 'success' : 'warning'}
                              />
                            </div>
                            <span className="text-xs font-semibold w-9 text-right">
                              {avgScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No attempts</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          hasAttendanceData && isAtRisk
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {hasAttendanceData && isAtRisk ? 'At Risk' : 'Normal'}
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
