'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Plus } from 'lucide-react';

const usersData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    role: 'faculty',
    department: 'Computer Science',
    joinDate: '2023-01-15',
    status: 'active',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.singh@university.edu',
    role: 'faculty',
    department: 'Computer Science',
    joinDate: '2022-06-10',
    status: 'active',
  },
  {
    id: 3,
    name: 'Arjun Patel',
    email: 'arjun.patel@university.edu',
    role: 'faculty',
    department: 'Information Technology',
    joinDate: '2023-08-20',
    status: 'active',
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Administration',
    joinDate: '2022-01-01',
    status: 'active',
  },
  {
    id: 5,
    name: 'Neha Desai',
    email: 'neha.desai@university.edu',
    role: 'faculty',
    department: 'Electronics',
    joinDate: '2023-03-15',
    status: 'inactive',
  },
];

export default function AdminUsersPage() {
  const userColumns = [
    { key: 'name', label: 'Name', className: 'font-medium' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'joinDate', label: 'Join Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
    },
  ];

  return (
    <AppLayout userRole="admin" pageTitle="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-muted-foreground">Manage faculty, admin, and student accounts</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">All Users</h2>
          <DataTable columns={userColumns} data={usersData} />
        </div>
      </div>
    </AppLayout>
  );
}
