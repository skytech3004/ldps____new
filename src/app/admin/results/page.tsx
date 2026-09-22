"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Trophy, Upload, X, FileText, Download, Edit3, Image as ImageIcon, Sparkles, Layers } from "lucide-react";

interface ResultImage {
  url: string;
  title: string;
}

interface BoardResult {
  _id: string;
  year: string;
  title?: string;
  images?: (string | ResultImage)[];
}

interface NonBoardResult {
  _id: string;
  title: string;
  year: string;
  classLevel: string;
  imageUrl: string;
  pdfUrl: string;
  description?: string;
  createdAt?: string;
}

export default function AdminResultsPage() {
  const [activeTab, setActiveTab] = useState<"board" | "non-board">("board");

  // Board Results State
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
  const [images, setImages] = useState<ResultImage[]>([]);
  const [chartTitle, setChartTitle] = useState("");
  
  // File upload state for Board Results
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Non-Board Results State
  const [nonBoardList, setNonBoardList] = useState<NonBoardResult[]>([]);
  const [loadingNonBoard, setLoadingNonBoard] = useState(false);
  const [savingNonBoard, setSavingNonBoard] = useState(false);
  
  // Form State for Non-Board Result
  const [nbEditingId, setNbEditingId] = useState<string | null>(null);
  const [nbTitle, setNbTitle] = useState("");
  const [nbYear, setNbYear] = useState("2024-25");
  const [nbClassLevel, setNbClassLevel] = useState("Class 9");
  const [nbImageUrl, setNbImageUrl] = useState("");
  const [nbPdfUrl, setNbPdfUrl] = useState("");
  const [nbDescription, setNbDescription] = useState("");
  const [nbUploadingImg, setNbUploadingImg] = useState(false);
  const [nbUploadingPdf, setNbUploadingPdf] = useState(false);

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

  const fetchNonBoardResults = async () => {
    try {
      setLoadingNonBoard(true);
      const res = await fetch("/api/admin/non-board-results");
      if (res.ok) {
        const data = await res.json();
        setNonBoardList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNonBoard(false);
    }
  };

  useEffect(() => {
    fetchResults();
    fetchNonBoardResults();
  }, []);

  const selectResult = (result: BoardResult) => {
    setSelectedResult(result);
    setEditYear(result.year);
    setEditTitle(result.title || "");
    
    const normalized = (result.images || []).map((img: any) => {
      if (typeof img === "string") {
        return { url: img, title: "" };
      }
      return { url: img.url || "", title: img.title || "" };
    });
    setImages(normalized);

    setUploadFile(null);
    setUploadPreview(null);
    setChartTitle("");
  };

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

  const handleSaveResultYear = async (overrideImages?: ResultImage[]) => {
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
          images: overrideImages || images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save changes.");
      } else {
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

  const handleDeleteResultYear = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this result year?")) return;
    
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

  const handleUploadImage = async () => {
    if (!uploadFile || !selectedResult) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("page", "result");
      formData.append("section", "results");
      formData.append("title", `Result Year ${editYear} - ${chartTitle}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed.");
      const data = await res.json();

      const newImgObj = { url: data.upload.src, title: chartTitle.trim() };
      const updatedImages = [...images, newImgObj];
      setImages(updatedImages);

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
      setChartTitle("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (idx: number) => {
    if (!selectedResult) return;
    const nextImages = images.filter((_, i) => i !== idx);
    setImages(nextImages);

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

  // Handle Non-Board Uploads (Image & PDF)
  const handleNbImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNbUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "result");
      formData.append("section", "results");
      formData.append("title", `Non-Board Img - ${nbTitle || file.name}`);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Image upload failed.");
      const data = await res.json();
      setNbImageUrl(data.upload.src);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setNbUploadingImg(false);
    }
  };

  const handleNbPdfFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNbUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "result");
      formData.append("section", "results");
      formData.append("title", `Non-Board PDF - ${nbTitle || file.name}`);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("PDF upload failed.");
      const data = await res.json();
      setNbPdfUrl(data.upload.src);
    } catch (err) {
      alert("Failed to upload PDF file.");
    } finally {
      setNbUploadingPdf(false);
    }
  };

  const resetNbForm = () => {
    setNbEditingId(null);
    setNbTitle("");
    setNbYear("2024-25");
    setNbClassLevel("Class 9");
    setNbImageUrl("");
    setNbPdfUrl("");
    setNbDescription("");
  };

  const handleNbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nbTitle.trim()) {
      alert("Please enter a result title/name.");
      return;
    }

    setSavingNonBoard(true);
    try {
      const isEdit = !!nbEditingId;
      const url = "/api/admin/non-board-results";
      const method = isEdit ? "PUT" : "POST";
      const payload: any = {
        title: nbTitle.trim(),
        year: nbYear.trim(),
        classLevel: nbClassLevel.trim(),
        imageUrl: nbImageUrl.trim(),
        pdfUrl: nbPdfUrl.trim(),
        description: nbDescription.trim(),
      };
      if (isEdit) payload.id = nbEditingId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save non-board result.");
      } else {
        if (isEdit) {
          setNonBoardList((prev) => prev.map((item) => (item._id === data._id ? data : item)));
        } else {
          setNonBoardList((prev) => [data, ...prev]);
        }
        resetNbForm();
      }
    } catch (err) {
      console.error(err);
      alert("Error saving non-board result.");
    } finally {
      setSavingNonBoard(false);
    }
  };

  const handleEditNonBoardItem = (item: NonBoardResult) => {
    setNbEditingId(item._id);
    setNbTitle(item.title);
    setNbYear(item.year || "2024-25");
    setNbClassLevel(item.classLevel || "Class 9");
    setNbImageUrl(item.imageUrl || "");
    setNbPdfUrl(item.pdfUrl || "");
    setNbDescription(item.description || "");
  };

  const handleDeleteNonBoardItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this non-board result entry?")) return;
    setSavingNonBoard(true);
    try {
      const res = await fetch("/api/admin/non-board-results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNonBoardList((prev) => prev.filter((item) => item._id !== id));
        if (nbEditingId === id) resetNbForm();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    } finally {
      setSavingNonBoard(false);
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
            <span>Academic Results Hub</span>
          </h1>
          <p className="text-white/70 mt-2">Manage 10th & 12th Board Results and Class 1-9 & 11 Non-Board Results.</p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex bg-[#081736] p-1.5 rounded-2xl border border-white/10 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "board"
                ? "bg-accent text-primary shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy size={14} />
            <span>Board Results (10th & 12th)</span>
          </button>
          <button
            onClick={() => setActiveTab("non-board")}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "non-board"
                ? "bg-accent text-primary shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={14} />
            <span>Non-Board Results (1-9, 11)</span>
          </button>
        </div>
      </div>

      {activeTab === "board" ? (
        /* Board Results Section */
        loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Board Results Console...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (4): Add Result Year & Select Result Year */}
            <div className="lg:col-span-4 space-y-6">
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
                      onClick={() => handleSaveResultYear()}
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/50 uppercase block">Card Heading (e.g. CLASS XII BOARD RESULTS 2026)</label>
                        <input 
                          type="text" 
                          value={chartTitle}
                          onChange={(e) => setChartTitle(e.target.value)}
                          placeholder="e.g. CLASS XII BOARD RESULTS 2026"
                          className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white mb-3"
                        />
                        
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

                    <div className="pt-4">
                      {images.length === 0 ? (
                        <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-white/40 text-xs font-semibold uppercase">
                          No results posters attached yet. Upload a chart above.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {images.map((img, i) => (
                            <div key={i} className="bg-[#081736]/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group relative">
                              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                <img src={img.url} alt={`Result poster ${i + 1}`} className="max-w-full max-h-full object-contain" />
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
                              
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-white/40 uppercase">Card Heading:</label>
                                <input 
                                  type="text" 
                                  value={img.title} 
                                  onChange={(e) => {
                                    const newTitle = e.target.value;
                                    const updated = images.map((item, idx) => idx === i ? { ...item, title: newTitle } : item);
                                    setImages(updated);
                                  }}
                                  onBlur={() => handleSaveResultYear()}
                                  placeholder="e.g. CLASS XII BOARD RESULTS"
                                  className="w-full bg-[#081736] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-bold focus:outline-none focus:border-accent text-white"
                                />
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
        )
      ) : (
        /* Non-Board Results Management Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5): Add/Edit Non-Board Result Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-black flex items-center gap-2 text-accent">
                  <Plus size={18} />
                  <span>{nbEditingId ? "Edit Non-Board Result" : "Upload Non-Board Result"}</span>
                </h2>
                {nbEditingId && (
                  <button
                    onClick={resetNbForm}
                    className="text-xs text-white/60 hover:text-white font-bold underline"
                  >
                    Clear Form
                  </button>
                )}
              </div>

              <form onSubmit={handleNbSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Result Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={nbTitle}
                    onChange={(e) => setNbTitle(e.target.value)}
                    placeholder="e.g. Class IX Annual Examination Result 2024-25"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Class Level / Category</label>
                    <input
                      type="text"
                      value={nbClassLevel}
                      onChange={(e) => setNbClassLevel(e.target.value)}
                      placeholder="e.g. Class IX, Class XI"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Academic Session Year</label>
                    <input
                      type="text"
                      value={nbYear}
                      onChange={(e) => setNbYear(e.target.value)}
                      placeholder="e.g. 2024-25"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase block">1. Result Poster Image (Optional/Required)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={nbImageUrl}
                      onChange={(e) => setNbImageUrl(e.target.value)}
                      placeholder="Image URL or upload file..."
                      className="flex-1 bg-[#081736] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5 shrink-0">
                      {nbUploadingImg ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                      <span>{nbUploadingImg ? "Uploading..." : "Upload Img"}</span>
                      <input type="file" accept="image/*" onChange={handleNbImageFileSelect} className="hidden" />
                    </label>
                  </div>
                  {nbImageUrl && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 mt-2">
                      <img src={nbImageUrl} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setNbImageUrl("")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload PDF Section */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase block">2. Result PDF Document (For PDF Download)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={nbPdfUrl}
                      onChange={(e) => setNbPdfUrl(e.target.value)}
                      placeholder="PDF URL or upload file..."
                      className="flex-1 bg-[#081736] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                    <label className="bg-accent/20 hover:bg-accent/30 text-accent font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5 shrink-0">
                      {nbUploadingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                      <span>{nbUploadingPdf ? "Uploading..." : "Upload PDF"}</span>
                      <input type="file" accept="application/pdf" onChange={handleNbPdfFileSelect} className="hidden" />
                    </label>
                  </div>
                  {nbPdfUrl && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-between text-xs text-accent">
                      <span className="truncate max-w-[250px] font-bold">PDF Attached: {nbPdfUrl.split("/").pop()}</span>
                      <button
                        type="button"
                        onClick={() => setNbPdfUrl("")}
                        className="text-red-400 hover:text-red-300 font-bold ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingNonBoard || nbUploadingImg || nbUploadingPdf}
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-black uppercase text-xs tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-4"
                >
                  {savingNonBoard ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{nbEditingId ? "Save Changes" : "Publish Non-Board Result"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (7): Uploaded Non-Board Results List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-lg font-black flex items-center gap-2 text-accent">
                  <Layers size={18} />
                  <span>Uploaded Non-Board Results ({nonBoardList.length})</span>
                </h2>
              </div>

              {loadingNonBoard ? (
                <div className="py-12 text-center text-white/40">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-accent" />
                  <p className="text-xs font-bold uppercase">Loading non-board entries...</p>
                </div>
              ) : nonBoardList.length === 0 ? (
                <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center text-white/40 text-xs font-semibold uppercase">
                  No Non-Board results uploaded yet. Use the form on the left to add entries.
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {nonBoardList.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[#081736]/60 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-accent/40 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-accent/20 text-accent px-2.5 py-0.5 rounded-full">
                            {item.classLevel || "Non-Board"}
                          </span>
                          <span className="text-[10px] font-bold text-white/50 uppercase">
                            Year: {item.year || "2024-25"}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white uppercase tracking-tight">{item.title}</h3>
                        <div className="flex flex-wrap gap-4 pt-1 text-xs text-white/60">
                          {item.imageUrl && (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:underline inline-flex items-center gap-1 font-bold"
                            >
                              <ImageIcon size={12} /> View Image
                            </a>
                          )}
                          {item.pdfUrl && (
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:underline inline-flex items-center gap-1 font-bold"
                            >
                              <FileText size={12} /> View PDF
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                        <button
                          onClick={() => handleEditNonBoardItem(item)}
                          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNonBoardItem(item._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
