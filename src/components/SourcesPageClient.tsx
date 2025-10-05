"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSources } from "@/redux/slices/sourcesSlice";
import SourceList from "@/components/SourceList";
import AddDataSource from "@/components/AddDataSource";

export default function SourcesPageClient() {
  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useAppDispatch();
  const sources = useAppSelector(state => state.sources.sources);
  const loading = useAppSelector(state => state.sources.loading);

  // Fetch sources on component mount
  useEffect(() => {
    dispatch(fetchSources());
  }, [dispatch]);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    // Refresh sources from server
    dispatch(fetchSources());
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">All News Sources</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-brandAccent text-white px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Data Source
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-brandAccent border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <SourceList sources={sources} />
      )}

      {showAddForm && (
        <AddDataSource
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </section>
  );
}