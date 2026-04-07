'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Protected Route Wrapper
 * Redirects to login if user is not authenticated
 * Only allows specific roles if specified
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show nothing if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
