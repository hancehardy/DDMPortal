'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (adminOnly && !isAdmin) {
        router.push('/'); // Redirect non-admin users to home page
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router, adminOnly, isMounted]);

  // Don't render anything during server-side rendering or before hydration
  // This prevents hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin (when required), don't render children
  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null;
  }

  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute; 