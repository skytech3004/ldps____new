"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Sparkles, Image as ImageIcon, ArrowUpDown, X } from "lucide-react";

interface Facility {
  _id: string;
  name: string;
  code: string;
  fallback: string;
  sortOrder: number;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/facilities");
      if (res.ok) {
        const data = await res.json();
        setFacilities(data);
      }
    } catch (err) {
      console.error(err);
      alert("Error loading facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(""); // Clear text URL if file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  // Optimize image client-side before upload
  const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas to Blob failed"));
            },
            "image/webp",
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    let finalImageUrl = imageUrl.trim() || "/lps-vidhyawadi/gallery-01.jpg";

    try {
      // 1. Handle file upload if present
      if (selectedFile) {
        setUploading(true);
        const optimizedBlob = await optimizeImage(selectedFile);
        const formData = new FormData();
        formData.append("file", optimizedBlob, `facility-${Date.now()}.webp`);
        formData.append("page", "scholastic");
        formData.append("section", "facilities");
        formData.append("title", name);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.upload.src;
        setUploading(false);
      }

      // 2. Submit data to Facilities API
      const payload = {
        id: editingId,
        name: name.trim(),
        code: code.trim(),
        fallback: finalImageUrl,
        sortOrder: Number(sortOrder) || 0,
      };

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/facilities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API submit failed.");

      resetForm();
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Error saving facility.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingId(facility._id);
    setName(facility.name);
    setCode(facility.code || "");
    setImageUrl(facility.fallback);
    setSortOrder(facility.sortOrder);
    clearFile();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/facilities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed.");
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Error deleting facility.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCode("");
    setImageUrl("");
    setSortOrder(0);
    clearFile();
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">Administration</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <Sparkles size={36} className="text-accent" />
            <span>Advanced Facilities</span>
          </h1>
          <p className="text-white/70 mt-2">Manage the 3x5 innovation & infrastructure showcase grid shown on the Scholastic page.</p>
        </div>
        <div className="flex items-center gap-3">
          {(saving || uploading) ? (
            <div className="px-4 py-2 rounded-xl border border-accent/20 bg-accent/10 text-accent flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Saving Changes...</span>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Ready</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading facilities records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Facilities List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <ArrowUpDown size={18} className="text-accent" />
                <span>Facilities Roster ({facilities.length})</span>
              </h2>

              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto pr-2 space-y-3">
                {facilities.length === 0 ? (
                  <p className="py-8 text-center text-white/40 text-xs font-bold uppercase tracking-wider">No facilities found. Seed some or add.</p>
                ) : (
                  facilities.map((fac) => (
                    <div key={fac._id} className="flex items-center justify-between p-3.5 bg-[#0b1738]/50 hover:bg-[#0b1738]/80 border border-white/5 rounded-xl transition-all gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {fac.fallback && (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            <img src={fac.fallback} alt={fac.name} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-sm text-white truncate max-w-[250px]">{fac.name}</h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] font-black uppercase bg-accent/20 border border-accent/30 text-accent px-2 py-0.5 rounded-full">
                              Order: {fac.sortOrder}
                            </span>
                            {fac.code && (
                              <span className="text-[9px] font-bold text-white/40">
                                Code: {fac.code}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(fac)}
                          className="p-2 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-lg border border-white/5 transition-all text-white/80"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(fac._id)}
                          className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg border border-white/5 transition-all text-white/80"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Form Editor */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4 sticky top-6">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Plus size={18} className="text-accent" />
                <span>{editingId ? "Modify Facility" : "Add New Facility"}</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Facility Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Facility Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AI Lab, Smart Classes..."
                    className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Subtitle / Code */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Reference Code (Optional)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. DSC05229, Aeronautics..."
                    className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Display Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Image upload preview */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block">Facility Image</label>
                  
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/15 max-h-[160px] aspect-[4/3] group">
                      <img src={imagePreview} className="object-cover w-full h-full" alt="Preview" />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/15 max-h-[160px] aspect-[4/3] group">
                      <img src={imageUrl} className="object-cover w-full h-full" alt="Database src" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Saved URL</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center text-white/40 flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors">
                      <ImageIcon size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No Image Configured</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <label className="bg-[#0b1738] border border-white/15 hover:border-accent text-white font-black text-[10px] uppercase tracking-wider px-4 py-3.5 rounded-xl cursor-pointer text-center block transition-all">
                      {uploading ? "Optimizing..." : "Upload Local Photo"}
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    
                    {!selectedFile && (
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or input image web path..."
                        className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-accent transition-colors"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-white/5 border border-white/15 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving || uploading || !name}
                    className={`bg-accent hover:bg-accent-hover text-primary font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md shadow-accent/15 ${
                      editingId ? "" : "col-span-2"
                    }`}
                  >
                    {saving ? "Saving..." : editingId ? "Update Facility" : "Add Facility"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
