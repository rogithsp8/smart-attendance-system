'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BarChart3,
  Users,
  BookOpen,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, user, isReady, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (isAuthenticated && user) {
      router.push(`/${user.role.toLowerCase()}`);
    }
  }, [isReady, isAuthenticated, user, router]);

  const handleRoleClick = (role: string) => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Smart Curriculum Activity & Attendance System</h1>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-20 md:px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Intelligent Education Platform
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground md:text-xl">
            Real-time attendance tracking, curriculum management, and student performance analytics
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Admin Card */}
          <div onClick={() => handleRoleClick('admin')}>
            <div className="group cursor-pointer rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Administrator</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Institutional oversight, analytics, and system management
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  System-wide analytics
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Student performance tracking
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  At-risk student identification
                </div>
              </div>
              <Button className="mt-6 w-full bg-primary hover:bg-primary-dark">
                {isAuthenticated ? 'Go to Dashboard' : 'Enter as Admin'}
              </Button>
            </div>
          </div>

          {/* Faculty Card */}
          <div onClick={() => handleRoleClick('faculty')}>
            <div className="group cursor-pointer rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-secondary">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 group-hover:bg-secondary/20">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Faculty</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Class management, attendance marking, and student engagement
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Geo-fenced QR attendance
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Curriculum progress tracking
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Remedial group management
                </div>
              </div>
              <Button className="mt-6 w-full bg-secondary hover:bg-secondary-dark">
                {isAuthenticated ? 'Go to Dashboard' : 'Enter as Faculty'}
              </Button>
            </div>
          </div>

          {/* Student Card */}
          <div onClick={() => handleRoleClick('student')}>
            <div className="group cursor-pointer rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-accent">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Student</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Personal learning profile and academic progress
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Attendance tracking
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  QR-based attendance scanning
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Performance analytics
                </div>
              </div>
              <Button className="mt-6 w-full bg-accent hover:bg-accent-foreground text-foreground">
                {isAuthenticated ? 'Go to Dashboard' : 'Enter as Student'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-20 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <BarChart3 className="mb-3 h-6 w-6 text-primary" />
            <h4 className="font-semibold">Real-time Analytics</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Comprehensive dashboards with actionable insights
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <Clock className="mb-3 h-6 w-6 text-secondary" />
            <h4 className="font-semibold">Instant Attendance</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Geo-fenced QR codes for accurate location-based marking
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <TrendingUp className="mb-3 h-6 w-6 text-accent" />
            <h4 className="font-semibold">Performance Tracking</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor student progress across subjects and topics
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <Users className="mb-3 h-6 w-6 text-primary" />
            <h4 className="font-semibold">Smart Remediation</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Automated grouping for targeted intervention
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 Smart Curriculum System. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
