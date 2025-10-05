"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  currentSource: {
    id: string;
    name: string;
  } | null;
  setCurrentSource: (source: { id: string; name: string } | null) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentSource, setCurrentSource] = useState<{ id: string; name: string } | null>(null);

  return (
    <PageContext.Provider value={{ currentSource, setCurrentSource }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
}