"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import ArticleDetail from "@/components/ArticleDetail";
import ActivityIndicator from "@/components/ActivityIndicator";
import Link from "next/link";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

interface Article {
  id: string;
  source_id: string;
  title: string;
  content?: string;
  date?: string;
  authors?: string[];
  link?: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const allSourcesData = useAppSelector(state => state.articles.bySourceId);

  useEffect(() => {
    const findAndSetArticle = async () => {
      if (!id) return;

      let foundArticle = null;
      for (const sourceId in allSourcesData) {
        const sourceData = allSourcesData[sourceId];
        const storeArticle = sourceData.articles.find((a) => a.id.toString() === id);
        if (storeArticle) {
          foundArticle = storeArticle;
          break;
        }
      }

      if (foundArticle) {
        console.log("Found article in store:", foundArticle);
        setArticle({
          id: foundArticle.id.toString(),
          source_id: foundArticle.source_id.toString(),
          title: foundArticle.title,
          content: foundArticle.content || '',
          date: foundArticle.date || undefined,
          authors: foundArticle.authors ? [foundArticle.authors] : undefined,
          link: foundArticle.link || undefined,
        });
        setLoading(false);
        return;
      }

      console.log("Article not in store, fetching from API for ID:", id);
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_ENDPOINTS.articles}/${id}`);
        if (response.data) {
          setArticle(response.data);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    findAndSetArticle();
  }, [id, allSourcesData]);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-3xl font-semibold mb-4">Loading Article...</h2>
        <ActivityIndicator />
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-3xl font-semibold mb-4">Article Not Found</h2>
        <p className="text-gray-600 mb-4">
          {error || "The article you're looking for does not exist."}
        </p>
        <Link href="/sources" className="text-blue-500 underline">
          Return to Sources Page
        </Link>
      </section>
    );
  }

  const transformedArticle = {
    ...article,
    authors: typeof article.authors === 'string' 
      ? (article.authors === 'No Authors Found' ? [] : [article.authors])
      : article.authors || []
  };

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold mb-4">Article Details</h2>
      <ArticleDetail article={transformedArticle} />
    </section>
  );
}