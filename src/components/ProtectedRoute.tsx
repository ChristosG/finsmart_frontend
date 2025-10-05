"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectAuthLoading, selectUser, selectReturnUrl, getCurrentUser, refreshAccessToken, clearReturnUrl, setReturnUrl } from '@/redux/slices/authSlice';
import AuthForm from './AuthForm';
import ActivityIndicator from './ActivityIndicator';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);
  const returnUrl = useAppSelector(selectReturnUrl);

  // Get current user info if authenticated but no user data
  useEffect(() => {
    if (isAuthenticated && !loading && !user) {
      // Only get user info if we don't have it yet
      dispatch(getCurrentUser()).catch(error => {
        console.error('Failed to get user info:', error);
      });
    }
  }, [dispatch, isAuthenticated, user, loading]);

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated && !loading && returnUrl && returnUrl !== pathname) {
      // Small delay to prevent conflicts with other navigation
      const timeoutId = setTimeout(() => {
        router.push(returnUrl);
        dispatch(clearReturnUrl());
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, loading, returnUrl, pathname, router, dispatch]);

  // Save current path when becoming unauthenticated
  useEffect(() => {
    if (!isAuthenticated && !loading && pathname !== '/' && !pathname.includes('/login') && !pathname.includes('/signup')) {
      dispatch(setReturnUrl(pathname));
    }
  }, [isAuthenticated, loading, pathname, dispatch]);

  // Remove the automatic token refresh logic - this is handled by axios interceptors

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ActivityIndicator />
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm />;
  }

  // Show children if authenticated
  return <>{children}</>;
}