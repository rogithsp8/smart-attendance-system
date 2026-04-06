'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { StatCard } from '@/components/dashboard/stat-card';
import { attendanceAPI, Attendance } from '@/lib/api';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface AttendanceRow {
    date: string;
    subjectId: string;
    status: string;
  }

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const loadAttendance = async () => {
      try {
        const response = await attendanceAPI.getStudentAttendance(user.id);
        setAttendance(response.data);
      } catch (err) {
        setError('Failed to load attendance data');
        console.error('Error loading attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user?.id]);

  // Calculate attendance statistics
  const totalClasses = attendance.length;
  const attendedClasses = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = totalClasses > 0 
    ? Math.round((attendedClasses / totalClasses) * 100)
    : 0;

  const attendanceColumns = [
    { key: 'date' as keyof AttendanceRow, label: 'Date', className: 'font-medium' },
    { key: 'subjectId' as keyof AttendanceRow, label: 'Subject ID' },
    {
      key: 'status' as keyof AttendanceRow,
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  const attendanceData = attendance.map(record => ({
    date: record.date,
    subjectId: record.subjectId.toString(),
    status: record.status.toLowerCase(),
  }));

  if (loading) {
    return (
      <AppLayout userRole="student" pageTitle="Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="student" pageTitle="Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="student" pageTitle="Attendance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="mt-2 text-muted-foreground">View your attendance records for all subjects</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard 
            title="Overall Attendance" 
            value={`${attendancePercentage}%`} 
            icon={Users}
            variant={attendancePercentage >= 75 ? "success" : "warning"}
          />
          <StatCard 
            title="Classes Attended" 
            value={`${attendedClasses} / ${totalClasses}`} 
            icon={CheckCircle}
            variant="success"
          />
          <StatCard 
            title="Classes Missed" 
            value={(totalClasses - attendedClasses).toString()} 
            icon={AlertCircle}
            variant={(totalClasses - attendedClasses) > 0 ? "warning" : "success"}
          />
        </div>

        {/* Attendance Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Attendance Records</h2>
          {attendanceData.length > 0 ? (
            <DataTable columns={attendanceColumns} data={attendanceData} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
