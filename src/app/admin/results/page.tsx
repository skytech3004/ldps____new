"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Trophy, Upload, X, Shield, Sparkles } from "lucide-react";

interface BoardResult {
  _id: string;
  year: string;
  title?: string;
  images?: string[];
}

export default function AdminResultsPage() {
  const [resultYears, setResultYears] = useState<BoardResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BoardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add Result Year inputs
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // Select Result Year inputs for editing
  const [editYear, setEditYear] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  
  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/results");
      if (res.ok) {
        const data = await res.json();
        setResultYears(data);
        if (data.length > 0) {
          selectResult(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error loading board results data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const selectResult = (result: BoardResult) => {
    setSelectedResult(result);
    setEditYear(result.year);
    setEditTitle(result.title || "");
    setImages(result.images || []);
    // Reset file preview
    setUploadFile(null);
    setUploadPreview(null);
  };

  // Add a new Result Year
  const handleAddResultYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear.trim() || !newTitle.trim()) {
      alert("Please fill in both the Year and Title.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: newYear.trim(),
          title: newTitle.trim(),
          images: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create result year.");
      } else {
        setResultYears((prev) => [data, ...prev]);
        selectResult(data);
        setNewYear("");
        setNewTitle("");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating result record.");
    } finally {
      setSaving(false);
    }
  };

  // Save changes to current Result Year
  const handleSaveResultYear = async () => {
    if (!selectedResult) return;
    if (!editYear.trim() || !editTitle.trim()) {
      alert("Please fill in both the Year and Title.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedResult._id,
          year: editYear.trim(),
          title: editTitle.trim(),
          images: images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save changes.");
      } else {
        // Update local list
        setResultYears((prev) =>
          prev.map((item) => (item._id === data._id ? data : item))
        );
        setSelectedResult(data);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving result record.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Result Year record
  const handleDeleteResultYear = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this result year? All uploaded charts for this year will be detached.")) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const nextList = resultYears.filter((item) => item._id !== id);
        setResultYears(nextList);
        if (nextList.length > 0) {
          selectResult(nextList[0]);
        } else {
          setSelectedResult(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting result year.");
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload results poster image
  const handleUploadImage = async () => {
    if (!uploadFile || !selectedResult) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("page", "result");
      formData.append("section", "results");
      formData.append("title", `Result Year ${editYear}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed.");
      const data = await res.json();

      const updatedImages = [...images, data.upload.src];
      setImages(updatedImages);

      // Save changes to db immediately
      const saveRes = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedResult._id,
          year: editYear.trim(),
          title: editTitle.trim(),
          images: updatedImages,
        }),
      });
      const saveData = await saveRes.json();
      if (saveRes.ok) {
        setResultYears((prev) =>
          prev.map((item) => (item._id === saveData._id ? saveData : item))
        );
        setSelectedResult(saveData);
      }

      setUploadFile(null);
      setUploadPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Remove image from list
  const handleRemoveImage = async (idx: number) => {
    if (!selectedResult) return;
    const nextImages = images.filter((_, i) => i !== idx);
    setImages(nextImages);

    // Save changes to db immediately
    try {
      const res = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedResult._id,
          year: editYear.trim(),
          title: editTitle.trim(),
          images: nextImages,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultYears((prev) =>
          prev.map((item) => (item._id === data._id ? data : item))
        );
        setSelectedResult(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="space-y-6 text-white font-montserrat text-left">
      {/* Header Panel */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">CMS Operations</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <Trophy size={36} className="text-accent" />
            <span>Board Results Hub</span>
          </h1>
          <p className="text-white/70 mt-2">Manage academic years, session titles, and upload results posters / chart graphics.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
            saving ? "bg-accent/10 border-accent/20 text-accent" : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}>
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Saving Changes...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">All Synced</span>
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading Board Results Console...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (4): Add Result Year & Select Result Year */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Add Result Year Form */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2 text-accent">
                <Plus size={18} />
                <span>Add Result Year</span>
              </h2>
              
              <form onSubmit={handleAddResultYear} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Academic Year *</label>
                  <input 
                    type="text" 
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="e.g. 2024-25"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Result Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Board Exam Results"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-white hover:bg-white/90 text-primary font-black uppercase text-xs tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={14} />
                  <span>Create Record</span>
                </button>
              </form>
            </div>

            {/* Select Result Year List */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2 text-accent">
                <Trophy size={18} />
                <span>Select Result Year</span>
              </h2>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {resultYears.length === 0 ? (
                  <p className="text-center py-6 text-white/40 text-xs font-semibold">No result records found.</p>
                ) : (
                  resultYears.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => selectResult(item)}
                      className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                        selectedResult?._id === item._id 
                          ? "bg-accent/15 border-accent text-white" 
                          : "bg-[#081736]/40 border-white/5 text-white/70 hover:bg-[#081736]/80 hover:text-white"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{item.year}</p>
                        <p className="text-[10px] text-white/50 font-semibold truncate max-w-[180px]">{item.title}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResultYear(item._id);
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column (8): Manage selected result year details and upload charts */}
          <div className="lg:col-span-8">
            {selectedResult ? (
              <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Modify Result details</h2>
                    <p className="text-xs text-white/50 font-bold mt-1">Configuring year record: {selectedResult.year}</p>
                  </div>
                  <button 
                    onClick={handleSaveResultYear}
                    disabled={saving}
                    className="bg-accent hover:bg-accent/90 text-primary font-black uppercase text-xs tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-premium-sm"
                  >
                    <span>Save Title & Year</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase">Academic Session Year *</label>
                    <input 
                      type="text" 
                      required
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      placeholder="e.g. 2024-25"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase">Session Display Title *</label>
                    <input 
                      type="text" 
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Board Exam Results"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                </div>

                {/* Images Upload block */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-wider text-accent">Uploaded Result Charts ({images.length})</h3>
                  
                  {/* File Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-white/50 uppercase block">Select Chart Graphic</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-24 bg-[#081736] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-accent/40 transition-colors">
                          <Upload size={20} className="text-white/40 group-hover:text-accent" />
                          <p className="text-[10px] font-bold text-white/50 uppercase">Choose Result Chart Image</p>
                        </div>
                      </div>
                    </div>

                    {uploadPreview && (
                      <div className="space-y-3">
                        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-accent/20">
                          <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={handleUploadImage}
                          disabled={uploading}
                          className="w-full bg-white hover:bg-white/95 text-primary font-black uppercase text-xs tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                        >
                          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                          <span>Upload & Attach Chart</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Attached Images Grid */}
                  <div className="pt-4">
                    {images.length === 0 ? (
                      <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-white/40 text-xs font-semibold uppercase">
                        No results posters attached yet. Upload a chart above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img, i) => (
                          <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#081736] group shadow-md">
                            <img src={img} alt={`Result poster ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => handleRemoveImage(i)}
                                className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg"
                                title="Remove Image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-white/15 bg-[#0f234f]/50 p-12 text-center text-white/40 font-semibold uppercase">
                Please create or select a result year record to manage charts.
              </div>
            )}
          </div>

        </div>
      )}
    </section>
  );
}
