'use client';

import React, { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'faculty' | 'student';
  userName?: string;
  pageTitle?: string;
}

export function AppLayout({ children, userRole, userName, pageTitle }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const displayName = userName ?? user?.name ?? 'User';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          userRole={userRole}
          userName={displayName}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
