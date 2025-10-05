// src/components/FramerMotionLayout.tsx
"use client";

import React from "react";

export function FramerMotionLayout({ children }: { children: React.ReactNode }) {
  // Temporarily disable animations to test if they're causing invisible content
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
