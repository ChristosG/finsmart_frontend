"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { API_ENDPOINTS } from "@/config/api";

interface Article {
  id: string;
  title: string;
  content?: string;
  date?: string;
  authors?: string[];
  link?: string;
}

export default function ArticleDetail({ article }: { article: Article }) {
  const [summary, setSummary] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const { data } = await axios.get(
        API_ENDPOINTS.articleSummary(article.id)
      );
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const { data } = await axios.get(
        API_ENDPOINTS.articleAnalysis(article.id)
      );
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Custom markdown components for better styling
  const markdownComponents: any = {
    h1: ({ children }: {children: React.ReactNode}) => (
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }: {children: React.ReactNode}) => (
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: {children: React.ReactNode}) => (
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-4">{children}</h3>
    ),
    ul: ({ children }: {children: React.ReactNode}) => (
      <ul className="list-disc list-inside space-y-1 ml-4 mb-4">{children}</ul>
    ),
    ol: ({ children }: {children: React.ReactNode}) => (
      <ol className="list-decimal list-inside space-y-1 ml-4 mb-4">{children}</ol>
    ),
    li: ({ children }: {children: React.ReactNode}) => (
      <li className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</li>
    ),
    p: ({ children }: {children: React.ReactNode}) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{children}</p>
    ),
    strong: ({ children }: {children: React.ReactNode}) => (
      <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
    ),
    em: ({ children }: {children: React.ReactNode}) => (
      <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
    ),
    blockquote: ({ children }: {children: React.ReactNode}) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }: {children: React.ReactNode}) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
        {children}
      </code>
    ),
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-brandDark dark:text-gray-100">{article.title}</h2>
      
      {article.authors && article.authors.length > 0 && (
        <p className="text-gray-600 dark:text-gray-400">By: {article.authors.join(", ")}</p>
      )}
      
      {article.date && (
        <p className="text-gray-600 dark:text-gray-400">Published on: {article.date}</p>
      )}
      
      {article.link && (
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
          Read Original Article
        </a>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={fetchSummary}
          disabled={loadingSummary}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loadingSummary ? "Loading Summary..." : "View Summary"}
        </button>

        <button
          onClick={fetchAnalysis}
          disabled={loadingAnalysis}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loadingAnalysis ? "Loading Analysis..." : "View Analysis"}
        </button>

        <button
          onClick={() => setShowOriginal((prev) => !prev)}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          {showOriginal ? "Hide Original" : "View Original"}
        </button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div
            className="border-l-4 border-blue-500 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-xl mb-4 text-blue-800 dark:text-blue-300">Summary:</h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {summary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysis && (
          <motion.div
            className="border-l-4 border-green-500 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-xl mb-4 text-green-800 dark:text-green-300">Analysis:</h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {analysis}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOriginal && (
          <motion.div
            className="border-l-4 border-gray-500 dark:border-gray-400 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200">Original Content:</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{article.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}