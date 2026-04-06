'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { userAPI, attendanceAPI, subjectAPI, User, Attendance, Subject } from '@/lib/api';
import { Download, Plus, Users } from 'lucide-react';

export default function FacultyAttendancePage() {
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  interface AttendanceRow {
    id: number;
    studentName: string;
    email: string;
    date: string;
    status: string;
    studentId: number;
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      loadAttendance();
    }
  }, [selectedSubject, selectedDate]);

  const loadData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        userAPI.getStudents(),
        subjectAPI.getSubjects()
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      if (subjectsRes.data.length > 0) {
        setSelectedSubject(subjectsRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    if (!selectedSubject || !selectedDate) return;
    
    try {
      const response = await attendanceAPI.getAttendance(selectedSubject, selectedDate);
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  };

  const markAttendance = async (studentId: number, status: 'PRESENT' | 'ABSENT') => {
    if (!selectedSubject || !selectedDate) return;

    try {
      await attendanceAPI.markAttendance({
        studentId,
        subjectId: selectedSubject,
        date: selectedDate,
        status
      });
      loadAttendance(); // Refresh attendance data
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const attendanceColumns = [
    { key: 'studentName' as keyof AttendanceRow, label: 'Student Name', className: 'font-medium' },
    { key: 'email' as keyof AttendanceRow, label: 'Email' },
    { key: 'date' as keyof AttendanceRow, label: 'Date' },
    {
      key: 'status' as keyof AttendanceRow,
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  const attendanceData = attendance.map(record => {
    const student = students.find(s => s.id === record.studentId);
    return {
      id: record.id,
      studentName: student?.name || 'Unknown',
      email: student?.email || '',
      date: record.date,
      status: record.status.toLowerCase(),
      studentId: record.studentId
    };
  });

  if (loading) {
    return (
      <AppLayout userRole="faculty" pageTitle="Attendance Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="faculty" pageTitle="Attendance Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
            <p className="mt-2 text-muted-foreground">Track and manage student attendance records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Students List for Marking Attendance */}
        {selectedSubject && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mark Attendance
            </h2>
            <div className="space-y-2">
              {students.map(student => {
                const existingAttendance = attendance.find(a => a.studentId === student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={existingAttendance?.status === 'PRESENT' ? 'default' : 'outline'}
                        onClick={() => markAttendance(student.id, 'PRESENT')}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={existingAttendance?.status === 'ABSENT' ? 'destructive' : 'outline'}
                        onClick={() => markAttendance(student.id, 'ABSENT')}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Today's Attendance</h2>
          <DataTable columns={attendanceColumns} data={attendanceData} />
        </div>
      </div>
    </AppLayout>
  );
}
