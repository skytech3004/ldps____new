"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon, Film, Trash2, Upload, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id?: string;
  title: string;
  src: string;
  alt: string;
  type: "photo" | "video";
}

export default function AdminMediaGallery() {
  const [photoItems, setPhotoItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    src: "",
  });

  // Load media items from database
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const photosRes = await fetch("/api/admin/media-items?type=photo");
      const videosRes = await fetch("/api/admin/media-items?type=video");

      if (photosRes.ok) {
        const photos = await photosRes.json();
        setPhotoItems(photos);
      }

      if (videosRes.ok) {
        const videos = await videosRes.json();
        setVideoItems(videos);
      }
    } catch (error) {
      console.error("Failed to fetch media items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Navigate preview
  const handlePrevPreview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePreview === null) return;
    const currentItems = activeTab === "photo" ? photoItems : videoItems;
    const currentIdx = currentItems.findIndex((item) => item._id === activePreview);
    const newIdx = currentIdx === 0 ? currentItems.length - 1 : currentIdx - 1;
    const nextId = currentItems[newIdx]._id;
    if (nextId) setActivePreview(nextId);
  };

  const handleNextPreview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePreview === null) return;
    const currentItems = activeTab === "photo" ? photoItems : videoItems;
    const currentIdx = currentItems.findIndex((item) => item._id === activePreview);
    const newIdx = currentIdx === currentItems.length - 1 ? 0 : currentIdx + 1;
    const nextId = currentItems[newIdx]._id;
    if (nextId) setActivePreview(nextId);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePreview === null) return;
      if (e.key === "ArrowLeft") handlePrevPreview();
      if (e.key === "ArrowRight") handleNextPreview();
      if (e.key === "Escape") setActivePreview(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePreview, activeTab, photoItems, videoItems]);

  // Lock scroll when preview is open
  useEffect(() => {
    if (activePreview !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePreview]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataToUpload = new FormData();
      dataToUpload.append("file", file);
      dataToUpload.append("section", "media-items");
      dataToUpload.append("page", "gallery");
      dataToUpload.append("title", file.name);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: dataToUpload,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      setFormData((prev) => ({ ...prev, src: data.upload.src }));
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
      setUploading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.title || !formData.src) return;

    setSaving(true);
    try {
      const newItem = {
        title: formData.title,
        src: formData.src,
        alt: formData.title,
        type: activeTab,
      };

      const res = await fetch("/api/admin/media-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedItem = await res.json();

      if (activeTab === "photo") {
        setPhotoItems([...photoItems, savedItem]);
      } else {
        setVideoItems([...videoItems, savedItem]);
      }

      setFormData({ title: "", src: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save media item");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!id) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media-items?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      if (activeTab === "photo") {
        setPhotoItems(photoItems.filter((item) => item._id !== id));
      } else {
        setVideoItems(videoItems.filter((item) => item._id !== id));
      }

      if (activePreview === id) setActivePreview(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete media item");
    } finally {
      setSaving(false);
    }
  };

  const currentItems = activeTab === "photo" ? photoItems : videoItems;
  const previewItem = currentItems.find((item) => item._id === activePreview);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("photo")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === "photo"
              ? "text-white-600 border-b-2 border-[#3D348B]"
              : "text-white-400 hover:text-slate-900"
          }`}
        >
          <ImageIcon size={20} />
          Photos ({photoItems.length})
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === "video"
              ? "text-white-600 border-b-2 border-[#3D348B]"
              : "text-white-400 hover:text-slate-900"
          }`}
        >
          <Film size={20} />
          Videos ({videoItems.length})
        </button>
      </div>

      {/* Add Item Button */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white bg-yellow-500 px-4 py-2 rounded-lg">
          {activeTab === "photo" ? "Manage Photos" : "Manage Videos"}
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 hover:bg-white-500 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Plus size={20} />
          Add {activeTab === "photo" ? "Photo" : "Video"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading media items...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Add Form */}
      {showAddForm && (
        <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setInputMode("url")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                inputMode === "url"
                  ? "bg-[#3D348B] text-white"
                  : "bg-slate-300 text-slate-700 hover:bg-slate-400"
              }`}
            >
              URL
            </button>
            <button
              onClick={() => setInputMode("upload")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                inputMode === "upload"
                  ? "bg-[#3D348B] text-white"
                  : "bg-slate-300 text-slate-700 hover:bg-slate-400"
              }`}
            >
              <Upload size={16} />
              Upload
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
            />
            
            {inputMode === "url" ? (
              <input
                type="text"
                placeholder={activeTab === "photo" ? "Image URL" : "YouTube Embed URL"}
                value={formData.src}
                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                className="px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
              />
            ) : (
              <label className="relative px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#3D348B] transition-colors flex items-center justify-center">
                <input
                  type="file"
                  accept={activeTab === "photo" ? "image/*" : "video/*"}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <span className="text-black font-semibold">
                  {uploading ? "Uploading..." : formData.src ? "✓ File Selected" : "Click to Upload"}
                </span>
              </label>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddItem}
              disabled={uploading || saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Add"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ title: "", src: "" });
                setInputMode("url");
              }}
              className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((item, idx) => (
          <motion.div
            key={item._id || `${item.type}-${idx}-${item.title}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden group hover:shadow-lg transition-all"
          >
            {/* Media Preview */}
            <div
              onClick={() => {
                if (item._id) setActivePreview(item._id);
              }}
              className="relative aspect-video bg-slate-100 cursor-pointer overflow-hidden"
            >
              {activeTab === "photo" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-black/80 flex items-center justify-center">
                  <Film size={48} className="text-[#F7B801]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-sm">Preview</span>
              </div>
            </div>

            {/* Title and Controls */}
            <div className="p-4">
              <h3 className="text-[#3D348B] font-bold line-clamp-2 mb-3 text-sm">
                {item.title}
              </h3>
              <button
                onClick={() => handleDeleteItem(item._id!)}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No {activeTab === "photo" ? "photos" : "videos"} yet. Add one to get started!</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {activePreview !== null && previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePreview(null)}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-6 px-4"
          >
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center text-white px-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-[#F7B801] uppercase">
                LPS Vidyawadi Media Portal
              </span>
              <button
                onClick={() => setActivePreview(null)}
                className="p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Area */}
            <div className="flex-1 w-full flex items-center justify-center relative my-4 max-h-[75vh]">
              <button
                onClick={handlePrevPreview}
                className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-full hidden sm:block"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div
                key={previewItem._id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full md:max-w-4xl flex flex-col items-center justify-center"
              >
                {activeTab === "photo" ? (
                  <img
                    src={previewItem.src}
                    alt={previewItem.alt}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl border border-white/10"
                  />
                ) : (
                  <iframe
                    src={previewItem.src}
                    title={previewItem.title}
                    allowFullScreen
                    className="w-full max-w-4xl aspect-video rounded-xl border border-white/10"
                  />
                )}
              </motion.div>

              <button
                onClick={handleNextPreview}
                className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-full hidden sm:block"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl text-center flex flex-col items-center gap-4 text-white px-4"
            >
              <div className="space-y-1">
                <p className="text-sm md:text-lg font-bold text-white max-w-2xl">
                  {previewItem.title}
                </p>
                <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase">
                  {activeTab === "photo" ? "Photo" : "Video"} {currentItems.findIndex((item) => item._id === activePreview) + 1} of{" "}
                  {currentItems.length}
                </p>
              </div>

              {/* Mobile Arrows */}
              <div className="flex sm:hidden items-center gap-6 mt-1">
                <button onClick={handlePrevPreview} className="p-2.5 bg-white/5 rounded-full">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextPreview} className="p-2.5 bg-white/5 rounded-full">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
