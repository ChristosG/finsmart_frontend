"use client";

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

interface AddDataSourceProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDataSource({ onClose, onSuccess }: AddDataSourceProps) {
  const [formData, setFormData] = useState({
    site_url: "",
    source_name: "",
    max_articles: 50
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Sending scrape request:", formData);
      
      const response = await axios.post(API_ENDPOINTS.scrape, {
        site_url: formData.site_url,
        source_name: formData.source_name,
        max_articles: formData.max_articles
      });
      
      console.log("Scrape response:", response.data);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Error adding data source:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.message || "Failed to add data source. Please try again.";
        setError(errorMessage);
      } else {
        setError("Failed to add data source. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Data Source</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site URL
            </label>
            <input
              type="url"
              id="site_url"
              value={formData.site_url}
              onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
              placeholder="https://www.naftemporiki.gr/politics"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandAccent focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Full URL to the page you want to scrape</p>
          </div>

          <div>
            <label htmlFor="source_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Name
            </label>
            <input
              type="text"
              id="source_name"
              value={formData.source_name}
              onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
              placeholder="Navy"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandAccent focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Display name for this source</p>
          </div>

          <div>
            <label htmlFor="max_articles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Articles
            </label>
            <input
              type="number"
              id="max_articles"
              value={formData.max_articles}
              onChange={(e) => setFormData({ ...formData, max_articles: parseInt(e.target.value) || 50 })}
              min="1"
              max="200"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandAccent focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum number of articles to scrape (1-200)</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brandAccent text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scraping...
                </div>
              ) : (
                "Add Source"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}