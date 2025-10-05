"use client";

import React from "react";

interface ArticleListSkeletonProps {
  count?: number;
}

export default function ArticleListSkeleton({ count = 5 }: ArticleListSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded mb-2" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              {/* Date skeleton */}
              <div className="h-4 bg-gray-200 rounded" style={{ width: '120px' }}></div>
            </div>
            {/* Button skeleton */}
            <div className="w-16 h-10 bg-gray-200 rounded ml-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}