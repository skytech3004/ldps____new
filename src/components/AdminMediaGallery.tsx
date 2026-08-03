"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon, Film, Trash2, Upload, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id?: string;
  title: string;
  src: string;
  alt: string;
  type: "photo" | "video" | "event-photo" | "hostel-photo";
  category?: string;
}

export default function AdminMediaGallery() {
  const [photoItems, setPhotoItems] = useState<MediaItem[]>([]);
  const [eventItems, setEventItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const [nssItems, setNssItems] = useState<MediaItem[]>([]);
  const [nccItems, setNccItems] = useState<MediaItem[]>([]);
  const [nccFeatured, setNccFeatured] = useState<MediaItem | null>(null);
  const [nssFeatured, setNssFeatured] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState<"photo" | "event-photo" | "video" | "nss-photo" | "ncc-photo">("photo");
  const [adminFilter, setAdminFilter] = useState<string>("All");
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Others", "Events", "Fun & Food Fest", "Hostel", "Infrastructure", "Laboratories"]);
  const [formData, setFormData] = useState({
    title: "",
    src: "",
    category: "Others",
  });

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setAdminFilter("All");
    setShowAddForm(false);
  };

  let rawItems = photoItems;
  if (activeTab === "event-photo") rawItems = eventItems;
  else if (activeTab === "video") rawItems = videoItems;
  else if (activeTab === "nss-photo") rawItems = nssItems;
  else if (activeTab === "ncc-photo") rawItems = nccItems;

  const currentItems = adminFilter === "All"
    ? rawItems
    : rawItems.filter((item) => item.category === adminFilter);

  const previewItem = currentItems.find((item) => item._id === activePreview);

  const handleCreateNewCategory = async () => {
    const newCat = window.prompt("Enter new gallery category name:");
    if (!newCat || !newCat.trim()) return;
    const trimmed = newCat.trim();
    try {
      const res = await fetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, type: "gallery" })
      });
      if (res.ok) {
        const data = await res.json();
        if (!categories.includes(data.name)) {
          setCategories([...categories, data.name]);
        }
        setFormData(prev => ({ ...prev, category: data.name }));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Error creating category.");
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    try {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[7].length === 11) ? match[7] : null;
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } catch (e) {
      console.error("Failed to parse YT URL", e);
    }
    return null;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadMediaItems() {
      try {
        const [
          photosRes,
          eventsRes,
          videosRes,
          nssRes,
          nccRes,
          nccFeaturedRes,
          nssFeaturedRes,
          filtersRes,
        ] = await Promise.all([
          fetch("/api/admin/media-items?type=photo"),
          fetch("/api/admin/media-items?type=event-photo"),
          fetch("/api/admin/media-items?type=video"),
          fetch("/api/admin/media-items?type=nss-photo"),
          fetch("/api/admin/media-items?type=ncc-photo"),
          fetch("/api/admin/media-items?type=ncc-featured"),
          fetch("/api/admin/media-items?type=nss-featured"),
          fetch("/api/admin/filters?type=gallery"),
        ]);

        if (cancelled) return;

        if (photosRes.ok) {
          const photos = await photosRes.json();
          setPhotoItems(photos);
        }

        if (eventsRes.ok) {
          const events = await eventsRes.json();
          setEventItems(events);
        }

        if (videosRes.ok) {
          const videos = await videosRes.json();
          setVideoItems(videos);
        }

        if (nssRes.ok) {
          const nss = await nssRes.json();
          setNssItems(nss);
        }

        if (nccRes.ok) {
          const ncc = await nccRes.json();
          setNccItems(ncc);
        }

        if (nccFeaturedRes.ok) {
          const items = await nccFeaturedRes.json();
          setNccFeatured(items && items.length > 0 ? items[0] : null);
        }

        if (nssFeaturedRes.ok) {
          const items = await nssFeaturedRes.json();
          setNssFeatured(items && items.length > 0 ? items[0] : null);
        }

        if (filtersRes.ok) {
          const data = await filtersRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data.map((filter: { name: string }) => filter.name));
          }
        }
      } catch (error) {
        console.error("Failed to fetch media items:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMediaItems();
    return () => {
      cancelled = true;
    };
  }, []);

  // Navigate preview
  const handlePrevPreview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePreview === null) return;
    const currentIdx = currentItems.findIndex((item) => item._id === activePreview);
    if (currentIdx === -1) return;
    const newIdx = currentIdx === 0 ? currentItems.length - 1 : currentIdx - 1;
    const nextId = currentItems[newIdx]._id;
    if (nextId) setActivePreview(nextId);
  };

  const handleNextPreview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePreview === null) return;
    const currentIdx = currentItems.findIndex((item) => item._id === activePreview);
    if (currentIdx === -1) return;
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
  }, [activePreview, currentItems]);

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

    if (activeTab === "video" && file.size > 25 * 1024 * 1024) {
      const proceed = window.confirm(
        `This video file is quite large (${(file.size / (1024 * 1024)).toFixed(1)} MB). ` +
        "Uploading large video files directly can cause slow loading times for your website visitors. " +
        "We recommend uploading the video to YouTube and inserting the YouTube URL instead. " +
        "\n\nDo you still want to upload this file directly?"
      );
      if (!proceed) return;
    }

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

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNcc: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataToUpload = new FormData();
      dataToUpload.append("file", file);
      dataToUpload.append("section", "media-items");
      dataToUpload.append("page", isNcc ? "ncc" : "nss");
      dataToUpload.append("title", `${isNcc ? "NCC" : "NSS"} Featured Banner`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: dataToUpload,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      const payload = {
        title: `${isNcc ? "NCC" : "NSS"} Featured Banner`,
        src: data.upload.src,
        alt: `${isNcc ? "NCC" : "NSS"} Featured Banner Image`,
        type: isNcc ? "ncc-featured" : "nss-featured",
      };

      const existingId = isNcc ? nccFeatured?._id : nssFeatured?._id;
      
      const saveRes = await fetch("/api/admin/media-items", {
        method: existingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existingId ? { _id: existingId, ...payload } : payload),
      });

      if (!saveRes.ok) throw new Error("Failed to save media item");
      const savedItem = await saveRes.json();

      if (isNcc) {
        setNccFeatured(savedItem);
      } else {
        setNssFeatured(savedItem);
      }
      alert("Featured image updated successfully!");
    } catch (error) {
      console.error("Featured image update failed:", error);
      alert("Failed to update featured image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFeatured = async (isNcc: boolean) => {
    const item = isNcc ? nccFeatured : nssFeatured;
    if (!item?._id) return;
    const confirmed = window.confirm("Are you sure you want to reset the featured image to its default banner?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/media-items?id=${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      
      if (isNcc) {
        setNccFeatured(null);
      } else {
        setNssFeatured(null);
      }
      alert("Featured image reset to default.");
    } catch (error) {
      console.error("Failed to delete featured image:", error);
      alert("Failed to reset featured image.");
    }
  };

  const handleAddItem = async () => {
    if (!formData.title || !formData.src) return;

    setSaving(true);
    try {
      const itemType =
        activeTab === "event-photo" || (activeTab === "photo" && formData.category === "Events")
          ? "event-photo"
          : activeTab;

      const newItem = {
        title: formData.title,
        src: formData.src,
        alt: formData.title,
        type: itemType,
        category: formData.category,
      };

      const res = await fetch("/api/admin/media-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedItem = await res.json();

      if (itemType === "photo") {
        setPhotoItems([...photoItems, savedItem]);
      } else if (itemType === "event-photo") {
        setEventItems([...eventItems, savedItem]);
      } else if (itemType === "video") {
        setVideoItems([...videoItems, savedItem]);
      } else if (itemType === "nss-photo") {
        setNssItems([...nssItems, savedItem]);
      } else if (itemType === "ncc-photo") {
        setNccItems([...nccItems, savedItem]);
      }

      setFormData({ title: "", src: "", category: "Others" });
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
    const confirmed = window.confirm(`Are you sure you want to delete this ${activeTab}?`);
    if (!confirmed) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media-items?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      if (activeTab === "photo") {
        setPhotoItems(photoItems.filter((item) => item._id !== id));
      } else if (activeTab === "event-photo") {
        setEventItems(eventItems.filter((item) => item._id !== id));
      } else if (activeTab === "video") {
        setVideoItems(videoItems.filter((item) => item._id !== id));
      } else if (activeTab === "nss-photo") {
        setNssItems(nssItems.filter((item) => item._id !== id));
      } else if (activeTab === "ncc-photo") {
        setNccItems(nccItems.filter((item) => item._id !== id));
      }

      if (activePreview === id) setActivePreview(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete media item");
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="w-full max-w-7xl mx-auto font-montserrat text-white">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 flex-wrap">
        <button
          onClick={() => handleTabChange("photo")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "photo"
              ? "text-white border-b-2 border-accent font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ImageIcon size={20} />
          Photos ({photoItems.length})
        </button>
        <button
          onClick={() => handleTabChange("event-photo")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "event-photo"
              ? "text-white border-b-2 border-accent font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ImageIcon size={20} />
          Event Photos ({eventItems.length})
        </button>
        <button
          onClick={() => handleTabChange("video")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "video"
              ? "text-white border-b-2 border-accent font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Film size={20} />
          Videos ({videoItems.length})
        </button>
        <button
          onClick={() => handleTabChange("nss-photo")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "nss-photo"
              ? "text-white border-b-2 border-accent font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ImageIcon size={20} />
          NSS Photos ({nssItems.length})
        </button>
        <button
          onClick={() => handleTabChange("ncc-photo")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ncc-photo"
              ? "text-white border-b-2 border-accent font-bold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ImageIcon size={20} />
          NCC Photos ({nccItems.length})
        </button>
      </div>

      {/* Header Area */}
      <div className="mb-8 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white bg-[#3D348B] border border-white/10 px-4 py-2 rounded-lg inline-block">
            {activeTab === "photo" 
              ? "Manage General Photos" 
              : activeTab === "event-photo"
              ? "Manage Event Photos"
              : activeTab === "video"
              ? "Manage General Videos"
              : activeTab === "nss-photo"
              ? "Manage NSS Photos"
              : "Manage NCC Photos"}
          </h2>
          <p className="text-white/60 text-xs mt-2">
            {activeTab === "photo" 
              ? "Upload and manage photos for the general school image gallery." 
              : activeTab === "event-photo"
              ? "Upload and manage photos for the event gallery feed."
              : activeTab === "video"
              ? "Upload and manage videos for the general school video gallery."
              : activeTab === "nss-photo"
              ? "Upload and manage photos for the NSS academic gallery."
              : "Upload and manage photos for the NCC academic gallery."}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-lg disabled:opacity-50 font-bold text-sm uppercase tracking-wider shrink-0 cursor-pointer"
          disabled={loading}
        >
          <Plus size={20} />
          Add {activeTab === "video" ? "Video" : "Photo"}
        </button>
      </div>

      {/* Featured Banner Image Manager for NSS / NCC */}
      {(activeTab === "nss-photo" || activeTab === "ncc-photo") && !loading && (
        <div className="bg-[#111c38]/40 border border-white/5 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center text-left">
          <div className="flex-1 space-y-2">
            <span className="px-2 py-0.5 bg-[#F7B801]/10 border border-[#F7B801]/25 text-[#F7B801] rounded text-[8px] font-mono font-bold uppercase tracking-wider">
              Featured Banner Section
            </span>
            <h3 className="text-lg font-black uppercase text-white font-montserrat tracking-tight">
              {activeTab === "ncc-photo" ? "NCC" : "NSS"} Main Page Banner Photo
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-semibold max-w-xl">
              This photo is displayed in the main introduction banner on the public {activeTab === "ncc-photo" ? "NCC" : "NSS"} page. Upload a horizontal high-resolution image to customize it.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center shrink-0">
            {/* Preview current featured image */}
            <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-800 border border-white/10 relative shrink-0">
              <img
                src={
                  activeTab === "ncc-photo"
                    ? nccFeatured?.src || "/uploads/gallery/ncc-img-2.jpg"
                    : nssFeatured?.src || "/uploads/gallery/nss-img-5.jpg"
                }
                alt="Featured Banner Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/65 px-1.5 py-0.5 rounded text-[8px] font-mono text-white/70">
                {activeTab === "ncc-photo"
                  ? nccFeatured ? "Custom" : "Default"
                  : nssFeatured ? "Custom" : "Default"}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="relative bg-[#F7B801] hover:bg-[#E5AA00] text-[#3D348B] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                <Upload size={14} />
                <span>{uploading ? "Updating..." : "Change Banner"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFeaturedUpload(e, activeTab === "ncc-photo")}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
              {(activeTab === "ncc-photo" ? nccFeatured : nssFeatured) && (
                <button
                  onClick={() => handleDeleteFeatured(activeTab === "ncc-photo")}
                  disabled={uploading}
                  className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer w-full text-center flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Reset to Default
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400">Loading media items...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Category Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-8 bg-[#0f234f]/40 p-4 rounded-2xl border border-white/5 items-center">
            <span className="text-white/40 text-xs font-bold mr-2 uppercase tracking-wider">Filter Category:</span>
            {["All", ...categories].map((filter) => (
              <button
                key={filter}
                onClick={() => setAdminFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  adminFilter === filter
                    ? "bg-[#F7B801] text-[#3D348B]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-[#0f234f]/80 p-6 rounded-2xl mb-8 border border-white/10">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setInputMode("url")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    inputMode === "url"
                      ? "bg-[#3D348B] text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  URL
                </button>
                <button
                  onClick={() => setInputMode("upload")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    inputMode === "upload"
                      ? "bg-[#3D348B] text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border bg-[#081736] text-white border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="md:col-span-4 flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-2 border bg-[#081736] text-white border-white/10 rounded-lg focus:outline-none focus:border-accent font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#081736] text-white font-semibold">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleCreateNewCategory}
                    className="px-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-lg font-black transition-colors"
                    title="Add new category"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="md:col-span-4">
                  {inputMode === "url" ? (
                    <input
                      type="text"
                      placeholder={activeTab === "video" ? "YouTube Embed URL" : "Image URL"}
                      value={formData.src}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      className="w-full px-4 py-2 border bg-[#081736] text-white border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  ) : (
                    <label className="relative w-full h-[40px] px-4 py-2 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-accent transition-colors flex items-center justify-center bg-[#081736]">
                      <input
                        type="file"
                        accept={activeTab === "video" ? "video/*" : "image/*"}
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <span className="text-white/60 font-semibold truncate text-xs">
                        {uploading ? "Uploading..." : formData.src ? `✓ ${activeTab === "video" ? "Video" : "Image"} Uploaded` : `Click to Upload ${activeTab === "video" ? "Video" : "Image"}`}
                      </span>
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddItem}
                  disabled={uploading || saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: "", src: "", category: "Others" });
                    setInputMode("url");
                  }}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
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
                key={item._id || `${activeTab}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="bg-[#0f234f]/60 rounded-xl border border-white/10 shadow-md overflow-hidden group hover:shadow-lg transition-all"
              >
                {/* Media Preview */}
                <div
                  onClick={() => {
                    if (item._id) setActivePreview(item._id);
                  }}
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {activeTab === "photo" ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isYouTubeUrl(item.src) ? (
                    getYouTubeThumbnail(item.src) ? (
                      <img
                        src={getYouTubeThumbnail(item.src)!}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#081736] flex items-center justify-center">
                        <Film size={48} className="text-[#F7B801]" />
                      </div>
                    )
                  ) : (
                    <video
                      src={item.src}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Preview</span>
                  </div>
                </div>

                {/* Title and Controls */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="text-white font-bold line-clamp-1 text-sm">
                      {item.title}
                    </h3>
                    {item.category && (
                      <span className="px-2 py-0.5 bg-accent/25 text-[#F7B801] text-[9px] font-black uppercase rounded shrink-0">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item._id!)}
                    className="w-full px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <Trash2 size={16} />
                    Delete {activeTab === "photo" ? "Photo" : "Video"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {currentItems.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">No items yet. Add one to get started!</p>
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
                    className="relative w-full max-w-4xl aspect-video flex flex-col items-center justify-center"
                  >
                    {activeTab === "photo" ? (
                      <img
                        src={previewItem.src}
                        alt={previewItem.alt}
                        className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl border border-white/10"
                      />
                    ) : isYouTubeUrl(previewItem.src) ? (
                      <iframe
                        src={previewItem.src}
                        title={previewItem.title}
                        allowFullScreen
                        className="w-full h-full rounded-xl border border-white/5 shadow-2xl"
                      />
                    ) : (
                      <video
                        src={previewItem.src}
                        controls
                        autoPlay
                        preload="auto"
                        className="w-full h-full rounded-xl border border-white/5 shadow-2xl object-contain bg-black"
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
                      {activeTab === "photo" ? "Photo" : "Video"} {currentItems.findIndex((item) => item._id === activePreview) + 1} of {currentItems.length}
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
