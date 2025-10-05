// src/components/ActivityIndicator.tsx
"use client";

import React from "react";

interface ActivityIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ActivityIndicator = ({ size = 'md', className = '' }: ActivityIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClasses[size]} border-brandAccent border-solid border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default ActivityIndicator;
