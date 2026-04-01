import React, { Suspense, lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const FloatingChatbot = lazy(() => import('@/components/ai/ChatBot'));

export function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Checking session"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <FloatingChatbot />
      </Suspense>
    </>
  );
}
