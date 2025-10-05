"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, selectIsAuthenticated, logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { usePageContext } from '@/contexts/PageContext';

export default function Header() {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { currentSource } = usePageContext();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show header on auth page
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-soft border-b border-gray-200 dark:border-gray-700 supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-gray-900/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brandAccent via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-brandDark dark:text-white group-hover:text-brandAccent transition-colors duration-200">
                  FinSmart
                </span>
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                  News Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Current Source Display */}
          {currentSource && (
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center bg-gradient-to-r from-brandAccent/10 to-blue-600/10 px-4 py-2 rounded-xl border border-brandAccent/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-brandAccent rounded-full animate-pulse"></div>
                  <span className="font-semibold text-brandAccent text-sm truncate max-w-xs">{currentSource.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-6">
            {/* Navigation - square buttons on mobile, full text on desktop */}
            <nav className="flex space-x-1 sm:space-x-2 lg:space-x-4">
              <Link 
                href="/sources" 
                className="relative w-10 h-10 sm:w-auto sm:h-auto flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 hover:text-brandAccent dark:hover:text-brandAccent transition-colors duration-200 font-medium sm:px-2 lg:px-3 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent hover:bg-gray-200 sm:hover:bg-gray-50 dark:hover:bg-gray-700 sm:dark:hover:bg-gray-800 group"
                title="Sources"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1M7 7h10" />
                </svg>
                <span className="hidden sm:inline">Sources</span>
                {/* Mobile tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none sm:hidden z-50">
                  Sources
                </div>
              </Link>
              <Link 
                href="/articles" 
                className="relative w-10 h-10 sm:w-auto sm:h-auto flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 hover:text-brandAccent dark:hover:text-brandAccent transition-colors duration-200 font-medium sm:px-2 lg:px-3 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent hover:bg-gray-200 sm:hover:bg-gray-50 dark:hover:bg-gray-700 sm:dark:hover:bg-gray-800 group"
                title="Articles"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Articles</span>
                {/* Mobile tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none sm:hidden z-50">
                  Articles
                </div>
              </Link>
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brandAccent dark:hover:text-brandAccent transition-all duration-200 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-brandAccent to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-soft group-hover:shadow-md transition-all duration-200">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium">{user?.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Account</div>
                </div>
                <svg 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-soft-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-brandAccent/5 to-blue-600/5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-brandAccent to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-semibold shadow-soft">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user?.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brandAccent dark:hover:text-brandAccent transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">View and edit profile</div>
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Log out of your account</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay to close menu when clicking outside */}
              {showUserMenu && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}