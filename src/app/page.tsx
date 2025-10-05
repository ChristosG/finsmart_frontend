"use client";

import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import Link from "next/link";

export default function Home() {
  const user = useAppSelector(selectUser);

  return (
    <div className="space-y-8">
      <section className="card">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading mb-4">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-base sm:text-lg text-body max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Your personal financial and political news portal. Stay informed with the latest developments from your selected sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link
              href="/sources"
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold inline-flex items-center justify-center group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1M7 7h10" />
              </svg>
              Manage Your Sources
            </Link>
            <Link
              href="/articles"
              className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold inline-flex items-center justify-center group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brandAccent to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-heading mb-2">Sources</h3>
          <p className="text-body text-sm">Manage your news sources and stay up to date with fresh content</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-heading mb-2">Articles</h3>
          <p className="text-body text-sm">Read and analyze the latest articles from your curated sources</p>
        </div>
        
        <div className="card text-center sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-heading mb-2">Profile</h3>
          <p className="text-body text-sm">Customize your experience and manage account settings</p>
        </div>
      </section>
    </div>
  );
}
