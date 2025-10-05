"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { 
  refreshSource, 
  deleteSource, 
  selectIsRefreshing, 
  selectRefreshError,
  selectIsDeleting,
  selectDeleteError 
} from "@/redux/slices/sourcesSlice";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import Tooltip from "./Tooltip";

interface Source {
  id: string;
  name: string;
}

interface RefreshStatus {
  message?: string;
  articleCount?: number;
}

interface SourceCardProps {
  source: Source;
  onRefresh: (sourceId: string) => void;
  onDelete: (sourceId: string, sourceName: string) => void;
  refreshStatus?: RefreshStatus;
}

function SourceCard({ source, onRefresh, onDelete, refreshStatus }: SourceCardProps) {
  const isRefreshing = useAppSelector(state => selectIsRefreshing(state, source.id));
  const refreshError = useAppSelector(state => selectRefreshError(state, source.id));
  const isDeleting = useAppSelector(state => selectIsDeleting(state, source.id));
  const deleteError = useAppSelector(state => selectDeleteError(state, source.id));

  return (
    <div className="card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/sources/${source.id}`} className="flex-1 group-hover:text-brandAccent transition-colors duration-200">
          <h3 className="text-lg sm:text-xl font-semibold text-heading mb-3 group-hover:text-brandAccent transition-colors duration-200 line-clamp-2">{source.name}</h3>
          <p className="text-body text-sm flex items-center">
            View articles 
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </p>
        </Link>
        
        <div className="flex gap-2 sm:gap-3 ml-2 sm:ml-4 shrink-0">
          <Tooltip content="Refresh articles from source">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRefresh(source.id);
              }}
              disabled={isRefreshing || isDeleting}
              className="btn-primary p-2 sm:p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 transition-all duration-200 touch-target"
            >
              {isRefreshing ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          </Tooltip>

          <Tooltip content="Delete source and all its articles">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(source.id, source.name);
              }}
              disabled={isRefreshing || isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 shadow-sm hover:shadow-md touch-target"
            >
              {isDeleting ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Success message */}
      {refreshStatus && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm">
          <div className="flex items-center text-green-700 dark:text-green-300">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{refreshStatus.message}</span>
          </div>
          <div className="ml-7 mt-1 text-green-600 dark:text-green-400 text-xs">
            {refreshStatus.articleCount} new articles added
          </div>
        </div>
      )}

      {/* Error messages */}
      {refreshError && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm">
          <div className="flex items-center text-red-700 dark:text-red-300">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Refresh failed: {refreshError}</span>
          </div>
        </div>
      )}
      
      {deleteError && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm">
          <div className="flex items-center text-red-700 dark:text-red-300">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Delete failed: {deleteError}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SourceList({ sources }: { sources: Source[] }) {
  const dispatch = useAppDispatch();
  const [refreshStatus, setRefreshStatus] = useState<Record<string, RefreshStatus>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    sourceId: string;
    sourceName: string;
  }>({ isOpen: false, sourceId: '', sourceName: '' });

  const handleRefresh = async (sourceId: string) => {
    try {
      const result = await dispatch(refreshSource({ sourceId, maxArticles: 20 })).unwrap();
      
      // Show success message
      setRefreshStatus(prev => ({
        ...prev,
        [sourceId]: {
          message: result.result.message,
          articleCount: result.result.data.articles_scraped
        }
      }));

      // Clear success message after 5 seconds
      setTimeout(() => {
        setRefreshStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[sourceId];
          return newStatus;
        });
      }, 5000);
    } catch (error) {
      console.error('Failed to refresh source:', error);
    }
  };

  const handleDeleteClick = (sourceId: string, sourceName: string) => {
    setDeleteConfirm({
      isOpen: true,
      sourceId,
      sourceName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteSource({ sourceId: deleteConfirm.sourceId })).unwrap();
      console.log('Source deleted successfully:', result.result.message);
    } catch (error) {
      console.error('Failed to delete source:', error);
    } finally {
      setDeleteConfirm({ isOpen: false, sourceId: '', sourceName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, sourceId: '', sourceName: '' });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Source"
        message={`Are you sure you want to delete "${deleteConfirm.sourceName}"? This will permanently delete the source and all its articles. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={false}
      />
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sources.map((src) => (
          <SourceCard
            key={src.id}
            source={src}
            onRefresh={handleRefresh}
            onDelete={handleDeleteClick}
            refreshStatus={refreshStatus[src.id]}
          />
        ))}
      </div>
    </>
  );
}
