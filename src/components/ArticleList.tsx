"use client"; // Ensure this is a client component

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_ENDPOINTS } from "@/config/api";

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

interface ArticleListProps {
  articles: Article[];
  selectionMode?: boolean;
  selectedArticles?: number[];
  onToggleSelection?: (articleId: number) => void;
  showSource?: boolean;
}

export default React.memo(function ArticleList({ 
  articles, 
  selectionMode = false, 
  selectedArticles = [], 
  onToggleSelection,
  showSource = true
}: ArticleListProps) {
  const playAudio = async (articleId: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.articleAudio(articleId.toString()));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="card flex flex-col sm:flex-row sm:items-start justify-between hover:shadow-soft-lg transition-all duration-200 cursor-pointer group gap-4"
        >
          <div className="flex items-start sm:items-center w-full gap-4">
            {selectionMode && onToggleSelection && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedArticles.includes(article.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelection(article.id);
                  }}
                  className="w-5 h-5 text-brandAccent bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-brandAccent focus:ring-2"
                />
              </div>
            )}
            
            <Link href={`/articles/${article.id}`} className="flex-1 group-hover:text-brandAccent transition-colors duration-200" passHref>
              <div>
                {/* Source Badge - Only show when showSource is true */}
                {showSource && article.source ? (
                  <div className="mb-3">
                    <div className="inline-flex items-center bg-gradient-to-r from-brandAccent/15 via-blue-500/10 to-indigo-600/15 px-4 py-2 rounded-xl border border-brandAccent/30 hover:border-brandAccent/50 transition-all duration-200 group-hover:shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-brandAccent rounded-full animate-pulse"></div>
                        <span className="font-semibold text-brandAccent text-sm">{article.source.title || 'Unknown Source'}</span>
                        {article.source.domain && (
                          <>
                            <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{article.source.domain}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : showSource && !article.source ? (
                  <div className="mb-3">
                    <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">Unknown Source</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Article Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-heading group-hover:text-brandAccent transition-colors duration-200 line-clamp-2 mb-3">{article.title}</h3>
                
                {/* Article Metadata */}
                <div className="space-y-1">
                  <p className="text-body text-sm">{article.date || "No date provided"}</p>
                  {article.authors && (
                    <p className="text-muted text-xs">by {article.authors}</p>
                  )}
                </div>
              </div>
            </Link>
            
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                playAudio(article.id);
              }}
              className="btn-primary px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-200 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656m0 5.656a4 4 0 010-5.656m5.657 5.657a8 8 0 000-11.314m0 11.314a8 8 0 000-11.314" />
              </svg>
              <span className="hidden sm:inline">Play</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
});
