'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  QrCode,
  BookOpen,
  BarChart3,
  TrendingUp,
  Users,
  Settings,
  ChevronLeft,
  GraduationCap,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  userRole: 'admin' | 'faculty' | 'student';
}

const navigationItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ClipboardCheck, label: 'Attendance', href: '/admin/attendance' },
    { icon: QrCode, label: 'QR Attendance', href: '/admin/qr' },
    { icon: BookOpen, label: 'Curriculum', href: '/admin/curriculum' },
    { icon: BarChart3, label: 'Assessments', href: '/admin/assessments' },
    { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
    { icon: Users, label: 'Students', href: '/admin/users' },
  ],
  faculty: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/faculty' },
    { icon: ClipboardCheck, label: 'Attendance', href: '/faculty/attendance' },
    { icon: QrCode, label: 'QR Attendance', href: '/faculty/qr' },
    { icon: BookOpen, label: 'Curriculum', href: '/faculty/curriculum' },
    { icon: BarChart3, label: 'Assessments', href: '/faculty/assessments' },
    { icon: TrendingUp, label: 'Analytics', href: '/faculty/analytics' },
    { icon: Users, label: 'Students', href: '/faculty/students' },
  ],
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
    { icon: ClipboardCheck, label: 'Attendance', href: '/student/attendance' },
    { icon: QrCode, label: 'QR Scan', href: '/student/qr' },
    { icon: BookOpen, label: 'Curriculum', href: '/student/curriculum' },
    { icon: BarChart3, label: 'Assessments', href: '/student/assessments' },
    { icon: TrendingUp, label: 'Progress', href: '/student/progress' },
  ],
};

export function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();
  const items = navigationItems[userRole];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-sidebar transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href={`/${userRole}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden text-lg font-bold text-sidebar-foreground sm:inline">
              Smart EduSys
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-sidebar-accent md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border px-3 py-4">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/settings')
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
