"use client";

import React from 'react';
import { PaginationInfo } from '@/redux/slices/articlesSlice';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  showLoadMore?: boolean;
}

export default function Pagination({ 
  pagination, 
  onPageChange, 
  onLoadMore,
  loading = false,
  showLoadMore = false 
}: PaginationProps) {
  const { page, total_pages, has_prev, has_next } = pagination;

  if (showLoadMore && has_next) {
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="bg-brandAccent text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    );
  }

  if (total_pages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(total_pages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 border ${
            i === page
              ? 'border-brandAccent bg-brandAccent text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={total_pages}
          onClick={() => onPageChange(total_pages)}
          className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          {total_pages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!has_prev || loading}
        className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!has_next || loading}
        className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}