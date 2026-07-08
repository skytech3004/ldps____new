"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface FilterItem {
  _id: string;
  name: string;
  type: "gallery" | "blog" | "hostel";
}

export default function AdminFiltersPage() {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [activeTab, setActiveTab] = useState<"gallery" | "blog" | "hostel">("gallery");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newFilterName, setNewFilterName] = useState("");

  const fetchFilters = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/admin/filters?type=${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch filters.");
      const data = await res.json();
      setFilters(data);
    } catch (err) {
      console.error(err);
      setError("Error loading filter tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [activeTab]);

  const handleAddFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilterName.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFilterName.trim(),
          type: activeTab,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create filter tag.");

      setNewFilterName("");
      fetchFilters();
    } catch (err: any) {
      setError(err.message || "Failed to create filter tag.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFilter = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this filter tag? Content categorized with this filter might display under 'Others' or fallback categories.")) return;

    setError("");
    try {
      const res = await fetch(`/api/admin/filters?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete filter tag.");

      fetchFilters();
    } catch (err: any) {
      setError(err.message || "Failed to delete filter tag.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2">Filter Tags & Categories</h1>
          <p className="text-white/70 mt-2">Manage custom categories dynamically across Gallery, Blogs, and Hostel pages.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 flex-wrap">
        {(["gallery", "blog", "hostel"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-black uppercase text-xs tracking-widest border-b-2 transition-all ${
              activeTab === tab ? "border-[#F7B801] text-[#F7B801]" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            {tab === "gallery" ? "Media Gallery Tabs" : tab === "blog" ? "Blog Category Tags" : "Hostel Photo Tabs"}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Add Filter Form */}
      <form onSubmit={handleAddFilter} className="bg-[#0f234f]/85 border border-white/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full text-left">
          <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">New Filter Tag Name</label>
          <input 
            type="text" 
            required 
            value={newFilterName} 
            onChange={(e) => setNewFilterName(e.target.value)}
            placeholder="e.g. Science Fair, Chemistry Lab, Guest Suite" 
            className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
          />
        </div>
        <button 
          type="submit" 
          disabled={saving || loading}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-6 h-[46px] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={16} />}
          Add Filter Tag
        </button>
      </form>

      {/* Filters list */}
      <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-6">
        {loading ? (
          <div className="py-12 text-center text-white/60 font-bold flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#F7B801]" />
            <span className="text-xs uppercase tracking-widest">Fetching custom filters...</span>
          </div>
        ) : filters.length === 0 ? (
          <div className="text-center py-12 text-white/50 font-bold text-xs uppercase tracking-widest">No custom filters defined for this tab. Add one above!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <motion.div 
                key={filter._id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#0b1738] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Tag size={14} className="text-[#F7B801]" />
                  <span className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{filter.name}</span>
                </div>
                <button 
                  onClick={() => handleDeleteFilter(filter._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
