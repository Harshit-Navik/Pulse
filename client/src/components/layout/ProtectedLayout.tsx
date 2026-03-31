import React, { Suspense, lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const FloatingChatbot = lazy(() => import('@/components/ai/ChatBot'));

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

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
