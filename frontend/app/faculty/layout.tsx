'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="FACULTY">{children}</ProtectedRoute>;
}
