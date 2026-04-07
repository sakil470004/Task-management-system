'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Auth Provider
 * Client-side wrapper that initializes auth state on app load
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth from localStorage on app load
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
