"use client";

import React, { useEffect, useState } from "react";
import ArticleList from "@/components/ArticleList";
import { useParams } from "next/navigation";
import ActivityIndicator from "@/components/ActivityIndicator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePageContext } from "@/contexts/PageContext";
import { selectSourceById } from "@/redux/slices/sourcesSlice";
import { 
  fetchArticlesBySource, 
  selectArticlesBySource, 
  selectIsLoadingForSource, 
  selectErrorForSource,
  selectPaginationForSource,
  selectSelectedArticles,
  selectIsDeletingArticles,
  selectDeleteError as selectArticleDeleteError,
  toggleArticleSelection,
  selectAllArticles,
  clearArticleSelection,
  deleteArticles
} from "@/redux/slices/articlesSlice";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import Tooltip from "@/components/Tooltip";

export default function ArticlesBySourcePage() {
  const params = useParams();
  const sourceId = params.id as string;
  const dispatch = useAppDispatch();
  const { setCurrentSource } = usePageContext();

  const sourceData = useAppSelector(state => selectArticlesBySource(state, sourceId));
  const isLoading = useAppSelector(state => selectIsLoadingForSource(state, sourceId));
  const error = useAppSelector(state => selectErrorForSource(state, sourceId));
  const pagination = useAppSelector(state => selectPaginationForSource(state, sourceId));
  const selectedArticles = useAppSelector(state => selectSelectedArticles(state, sourceId));
  const isDeletingArticles = useAppSelector(state => selectIsDeletingArticles(state));
  const deleteError = useAppSelector(state => selectArticleDeleteError(state));
  const currentSourceInfo = useAppSelector(state => selectSourceById(state, sourceId));

  const { articles, lastFetched } = sourceData;
  const [selectionMode, setSelectionMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    count: number;
  }>({ isOpen: false, count: 0 });

  const handlePageChange = (page: number) => {
    dispatch(fetchArticlesBySource({ sourceId, page }));
  };

  const handleLoadMore = () => {
    if (pagination?.has_next) {
      dispatch(fetchArticlesBySource({ 
        sourceId, 
        page: pagination.page + 1, 
        append: true 
      }));
    }
  };

  const handleToggleSelectionMode = () => {
    if (selectionMode) {
      dispatch(clearArticleSelection(sourceId));
    }
    setSelectionMode(!selectionMode);
  };

  const handleToggleArticleSelection = (articleId: number) => {
    dispatch(toggleArticleSelection({ sourceId, articleId }));
  };

  const handleSelectAll = () => {
    dispatch(selectAllArticles(sourceId));
  };

  const handleClearSelection = () => {
    dispatch(clearArticleSelection(sourceId));
  };

  const handleDeleteSelected = () => {
    setDeleteConfirm({
      isOpen: true,
      count: selectedArticles.length
    });
  };


  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteArticles({ articleIds: selectedArticles })).unwrap();
      
      setSelectionMode(false);
      dispatch(clearArticleSelection(sourceId));
      
      dispatch(fetchArticlesBySource({ sourceId, page: 1, forceRefresh: true }));
      
    } catch (error) {
      console.error('Failed to delete articles:', error);
    } finally {
      setDeleteConfirm({ isOpen: false, count: 0 });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, count: 0 });
  };

  useEffect(() => {
    if (!sourceId) return;

    if (currentSourceInfo) {
      setCurrentSource({
        id: sourceId,
        name: currentSourceInfo.name
      });
    }

    return () => {
      setCurrentSource(null);
    };
  }, [sourceId, currentSourceInfo, setCurrentSource]);

  useEffect(() => {
    if (!sourceId) return;

    if (articles.length === 0 && !isLoading) {
      console.log(`Fetching articles for source ${sourceId} (no articles in store)`);
      dispatch(fetchArticlesBySource({ sourceId, page: 1 }));
      return;
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const needsRefresh = lastFetched && lastFetched < fiveMinutesAgo;

    if (needsRefresh && !isLoading) {
      console.log(`Refreshing articles for source ${sourceId} (stale data)`);
      dispatch(fetchArticlesBySource({ sourceId, page: 1, forceRefresh: true }));
    }
  }, [sourceId, dispatch, lastFetched, articles.length, isLoading]);

  if (isLoading && articles.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold mb-4">Articles</h2>
        <div className="flex justify-center py-8">
          <ActivityIndicator />
        </div>
      </section>
    );
  }

  if (error && articles.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold mb-4">Articles</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => dispatch(fetchArticlesBySource({ sourceId, page: 1, forceRefresh: true }))}
            className="bg-brandAccent text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!isLoading && articles.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold mb-4">Articles</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">No articles found for this source.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Selected Articles"
        message={`Are you sure you want to delete ${deleteConfirm.count} selected articles? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"  
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeletingArticles}
      />
      
      <section className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Articles ({articles.length})</h2>
          
          <div className="flex items-center gap-3">
            {selectionMode && selectedArticles.length > 0 && (
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''} selected
              </span>
            )}
            
            {selectionMode && (
              <div className="flex items-center gap-2">
                <Tooltip content="Select all articles">
                  <button
                    onClick={handleSelectAll}
                    disabled={selectedArticles.length === articles.length || isDeletingArticles}
                    className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                  >
                    Select All
                  </button>
                </Tooltip>
                
                <span className="text-gray-300">|</span>
                
                <Tooltip content="Clear selection">
                  <button
                    onClick={handleClearSelection}
                    disabled={selectedArticles.length === 0 || isDeletingArticles}
                    className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                  >
                    Clear
                  </button>
                </Tooltip>
              </div>
            )}
            
            {selectionMode && selectedArticles.length > 0 && (
              <Tooltip content="Delete selected articles">
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeletingArticles}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeletingArticles ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </Tooltip>
            )}
            
            <Tooltip content={selectionMode ? "Exit selection mode" : "Enter selection mode"}>
              <button
                onClick={handleToggleSelectionMode}
                disabled={isDeletingArticles}
                className={`p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                  selectionMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      
      {error && articles.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => dispatch(fetchArticlesBySource({ sourceId, page: 1, forceRefresh: true }))}
              className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">❌ Delete error: {deleteError}</span>
          </div>
        </div>
      )}

      <ArticleList 
        articles={articles} 
        selectionMode={selectionMode}
        selectedArticles={selectedArticles}
        onToggleSelection={handleToggleArticleSelection}
        showSource={false}
      />
      
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLoadMore={handleLoadMore}
          loading={isLoading}
          showLoadMore={false}
        />
      )}
      </section>
    </>
  );
}