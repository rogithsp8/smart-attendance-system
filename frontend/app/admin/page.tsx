'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart3, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { userAPI, attendanceAPI, User } from '@/lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [faculty, setFaculty] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, studentsRes, facultyRes] = await Promise.all([
        userAPI.getAllUsers(),
        userAPI.getStudents(),
        userAPI.getFaculty()
      ]);
      setUsers(usersRes.data);
      setStudents(studentsRes.data);
      setFaculty(facultyRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Administration Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Comprehensive overview of institutional performance and student engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={students.length.toString()}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            description="Active enrollments this semester"
          />
          <StatCard
            title="Total Faculty"
            value={faculty.length.toString()}
            icon={BookOpen}
            trend={{ value: 2, isPositive: true }}
            description="Full-time and part-time instructors"
          />
          <StatCard
            title="Total Users"
            value={users.length.toString()}
            icon={BarChart3}
            description="All registered users"
          />
          <StatCard
            title="System Status"
            value="Active"
            icon={TrendingUp}
            trend={{ value: 0, isPositive: true }}
            description="All systems operational"
            variant="success"
          />
        </div>

        {/* Users Table */}
        <DataTable
          title="All Users"
          description="Complete list of registered users in the system"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
          ]}
          data={users}
        />
      </div>
    </AppLayout>
  );
}
