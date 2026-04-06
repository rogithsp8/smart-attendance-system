'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function AccessDeniedPage() {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    return `/${user.role.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          <Link href={getDashboardRoute()}>
            <Button className="w-full">
              Go to Your Dashboard
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Sign In with Different Account
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>If you believe this is an error, please contact your administrator.</p>
        </div>
      </div>
    </div>
  );
}
