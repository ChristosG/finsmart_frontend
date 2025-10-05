"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleList from '@/components/ArticleList';
import ActivityIndicator from '@/components/ActivityIndicator';
import { API_ENDPOINTS } from '@/config/api';
import axios from 'axios';

interface Source {
  id: number;
  title?: string;
  domain?: string;
  url?: string;
}

interface Article {
  id: number;
  source_id: number;
  title: string;
  content?: string;
  authors?: string | null;
  date?: string | null;
  link?: string;
  summary?: string | null;
  analysis?: string | null;
  scrape_order?: number;
  created_at?: string;
  source?: Source;
  is_read?: boolean;
  is_favorite?: boolean;
  user_notes?: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface ArticlesResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchArticles = async (page: number, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const response = await axios.get<ArticlesResponse>(`${API_ENDPOINTS.articles}?page=${page}&limit=50`);
      
      console.log('Articles API Response:', response.data);
      
      if (response.data?.articles && Array.isArray(response.data.articles)) {
        const { articles: newArticles, pagination: paginationInfo } = response.data;
        
        console.log('First article structure:', newArticles[0]);
        
        if (append) {
          setArticles(prev => [...prev, ...newArticles]);
        } else {
          setArticles(newArticles);
        }
        
        setPagination(paginationInfo);
      } else {
        console.log('Invalid response structure:', response.data);
        if (!append) setArticles([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
      if (!append) setArticles([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreArticles = () => {
    if (pagination?.has_next) {
      fetchArticles(pagination.page + 1, true);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-heading">All Articles</h1>
        <div className="flex justify-center py-12">
          <ActivityIndicator />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-heading">All Articles</h1>
        <div className="card text-center py-12">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-heading">All Articles</h1>
        <div className="text-body">
          {pagination ? (
            <span>
              {pagination.total_count} article{pagination.total_count !== 1 ? 's' : ''} found
              {pagination.total_pages > 1 && (
                <span className="text-muted text-sm ml-2">
                  (Page {pagination.page} of {pagination.total_pages})
                </span>
              )}
            </span>
          ) : (
            <span>{articles.length} article{articles.length !== 1 ? 's' : ''} found</span>
          )}
        </div>
      </div>
      
      {articles.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-heading mb-2">No articles found</h3>
          <p className="text-body mb-6">Start by adding some news sources to see articles here.</p>
          <Link href="/sources" className="btn-primary">
            Manage Sources
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ArticleList articles={articles} />
          
          {/* Load More Button */}
          {pagination?.has_next && (
            <div className="flex justify-center pt-6">
              <button
                onClick={loadMoreArticles}
                disabled={loadingMore}
                className="btn-primary px-8 py-3 text-lg font-semibold inline-flex items-center gap-3 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Loading more articles...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Load More Articles ({pagination.total_count - articles.length} remaining)
                  </>
                )}
              </button>
            </div>
          )}
          
          {pagination && !pagination.has_next && articles.length > 0 && (
            <div className="text-center py-6">
              <p className="text-muted text-sm">You've reached the end of all {pagination.total_count} articles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}