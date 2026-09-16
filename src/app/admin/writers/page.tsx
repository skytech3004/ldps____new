"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Save, Upload, User, BookOpen, ArrowLeft } from "lucide-react";

type Writer = {
  _id: string;
  name: string;
  image: string;
  designation: string;
  bio: string;
};

export default function AdminWritersPage() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDesignation, setFormDesignation] = useState("Author");
  const [formBio, setFormBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  async function fetchWriters() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/writers");
      if (!res.ok) throw new Error("Failed to load writers database.");
      const data = await res.json();
      setWriters(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWriters();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setFormName("");
    setFormImage("");
    setFormDesignation("Author");
    setFormBio("");
    setSelectedFile(null);
    setPreviewSrc("");
    setModalOpen(true);
  }

  function openEditModal(writer: Writer) {
    setEditingId(writer._id);
    setFormName(writer.name);
    setFormImage(writer.image || "");
    setFormDesignation(writer.designation || "Author");
    setFormBio(writer.bio || "");
    setSelectedFile(null);
    setPreviewSrc(writer.image || "");
    setModalOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(String(reader.result ?? ""));
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleImageUpload(): Promise<string> {
    if (!selectedFile) return formImage;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("page", "blog");
      formData.append("section", "writers");
      formData.append("title", `Writer - ${formName || "Profile"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      return json.upload.src;
    } finally {
      setUploading(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Writer Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const finalImageUrl = selectedFile ? await handleImageUpload() : formImage;

      const payload = {
        id: editingId,
        name: formName.trim(),
        image: finalImageUrl.trim(),
        designation: formDesignation.trim() || "Author",
        bio: formBio.trim(),
      };

      const res = await fetch("/api/admin/writers", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save operation failed.");

      setModalOpen(false);
      fetchWriters();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this writer profile?")) return;
    try {
      setError("");
      const res = await fetch("/api/admin/writers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      fetchWriters();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/blog" className="text-white/60 hover:text-white text-xs font-bold inline-flex items-center gap-1">
              <ArrowLeft size={12} /> Back to Blog Manager
            </Link>
          </div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-1 text-white">Blog Authors & Writers</h1>
          <p className="text-white/70 mt-2">Manage blog post writers, profile pictures, titles, and author bios.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors"
          >
            <Plus size={16} />
            Add New Writer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading writers database...</div>
      ) : writers.length === 0 ? (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
          <User size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
          <p className="font-bold text-lg">No blog writers found in database.</p>
          <p className="text-sm text-white/50 mt-1">Click &quot;Add New Writer&quot; to register your first blog author!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writers.map((writer) => (
            <div
              key={writer._id}
              className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#F7B801]/40 shrink-0">
                  {writer.image ? (
                    <img src={writer.image} alt={writer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3D348B] to-[#7678ED] flex items-center justify-center text-white font-black text-xl">
                      {writer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white text-lg leading-tight truncate">{writer.name}</h3>
                  <p className="text-xs text-[#F7B801] font-bold uppercase tracking-wider mt-0.5">{writer.designation || "Author"}</p>
                  {writer.bio && (
                    <p className="text-xs text-white/70 line-clamp-2 mt-2 leading-relaxed font-medium">{writer.bio}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(writer)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(writer._id)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Writer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Writer Profile" : "Add Blog Writer"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-white">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Writer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Sunita Sharma"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  placeholder="e.g. Principal & Senior Academician"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Profile Photo Upload / URL
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-1">
                    <div className="relative aspect-square w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-white/20 mx-auto flex items-center justify-center">
                      {previewSrc || formImage ? (
                        <img src={previewSrc || formImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-white/40" size={32} />
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 font-bold flex items-center gap-2 bg-[#081a3a] justify-center cursor-pointer hover:border-[#F7B801]">
                        <Upload size={14} className="text-[#F7B801]" />
                        <span>{selectedFile ? selectedFile.name : "Upload Photo"}</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setSelectedFile(null);
                        setPreviewSrc(e.target.value);
                      }}
                      placeholder="Or paste image URL"
                      className="w-full border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Short Bio / Description
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Brief introductory bio of the author..."
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-white/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving || uploading ? "Saving..." : editingId ? "Update Writer" : "Create Writer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
