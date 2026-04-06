'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  userRole: 'admin' | 'faculty' | 'student';
  userName?: string;
  onMenuToggle?: () => void;
}

export function Navbar({ userRole, userName = 'User', onMenuToggle }: NavbarProps) {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getRoleLabel = () => {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      faculty: 'Faculty',
      student: 'Student',
    };
    return labels[userRole];
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section - Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="rounded-lg p-2 hover:bg-muted md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {getRoleLabel()}
            </h2>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {/* Settings */}
          <Link href="/settings" className="rounded-lg p-2 hover:bg-muted transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium md:inline-block">
                {userName}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel()}
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted text-foreground">
                  My Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted text-foreground">
                  Preferences
                </button>
                <div className="border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
