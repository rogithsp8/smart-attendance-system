'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Plus } from 'lucide-react';

const qrSessionsData = [
  {
    id: 1,
    sessionId: 'SESS-2024-001',
    faculty: 'Dr. Rajesh Kumar',
    className: 'CS-201 A',
    date: '2024-03-20',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Classroom A',
    scansCount: 42,
    status: 'completed',
  },
  {
    id: 2,
    sessionId: 'SESS-2024-002',
    faculty: 'Prof. Priya Singh',
    className: 'CS-202 B',
    date: '2024-03-20',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    location: 'Classroom B',
    scansCount: 38,
    status: 'completed',
  },
  {
    id: 3,
    sessionId: 'SESS-2024-003',
    faculty: 'Dr. Arjun Patel',
    className: 'CS-201 B',
    date: '2024-03-21',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Classroom C',
    scansCount: 0,
    status: 'pending',
  },
];

export default function AdminQRPage() {
  const qrColumns = [
    { key: 'sessionId', label: 'Session ID', className: 'font-medium' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'className', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'scansCount', label: 'Scans' },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  return (
    <AppLayout userRole="admin" pageTitle="QR Attendance Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">QR Attendance Sessions</h1>
            <p className="mt-2 text-muted-foreground">Monitor and manage geo-fenced QR attendance sessions</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* QR Sessions Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Active & Recent Sessions</h2>
          <DataTable columns={qrColumns} data={qrSessionsData} />
        </div>
      </div>
    </AppLayout>
  );
}
