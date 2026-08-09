"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, X, Save, Image, 
  Upload, ArrowUpRight, ImageIcon, Eye 
} from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

type PrePrimaryItem = {
  _id: string;
  section: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  sortOrder: number;
};

const SECTIONS = [
  "Pre School",
  "Academics",
  "Co-Curricular Activities",
  "Sports Activities",
  "Projector Class",
  "Skill Classes"
];

export default function AdminPrePrimaryPage() {
  const [items, setItems] = useState<PrePrimaryItem[]>([]);
  const [activeSection, setActiveSection] = useState("Pre School");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSection, setFormSection] = useState("Pre School");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSrc, setFormSrc] = useState("");
  const [formAlt, setFormAlt] = useState("");
  const [formSort, setFormSort] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/pre-primary");
      if (!res.ok) throw new Error("Failed to load pre-primary database.");
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "pre-primary");
      formData.append("section", "pre-primary");
      formData.append("title", `PrePrimary - ${formTitle || "New Item"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      setFormSrc(json.upload.src);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormSection(activeSection);
    setFormTitle("");
    setFormDescription("");
    setFormSrc("");
    setFormAlt("");
    setFormSort(items.filter(i => i.section === activeSection).length + 1);

    setModalOpen(true);
  }

  function openEditModal(item: PrePrimaryItem) {
    setEditingId(item._id);
    setFormSection(item.section);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormSrc(item.src);
    setFormAlt(item.alt);
    setFormSort(item.sortOrder);

    setModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        section: formSection,
        title: formTitle.trim(),
        description: formDescription.trim(),
        src: formSrc.trim(),
        alt: formAlt.trim() || formTitle.trim(),
        sortOrder: formSort,
      };

      const res = await fetch("/api/pre-primary", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save operation failed.");
      
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this showcase item?")) return;
    try {
      setError("");
      const res = await fetch("/api/pre-primary", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      fetchItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
    }
  }

  const filteredItems = items.filter(i => i.section === activeSection);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2">Pre-Primary Showcase Manager</h1>
          <p className="text-white/70 mt-2">Manage visual showcase blocks and early childhood activities displayed on Pre-Primary page.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/pre-primary" target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white">
            <ArrowUpRight size={14} />
            View Public Page
          </Link>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
            <Plus size={16} />
            Add Card
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
        {SECTIONS.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-5 py-4 font-black uppercase text-[10px] md:text-xs tracking-widest border-b-2 whitespace-nowrap transition-all ${
              activeSection === sec ? "border-[#F7B801] text-[#F7B801]" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading showcase items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
          <p className="font-bold text-lg">No showcase items defined for this section.</p>
          <p className="text-sm text-white/50 mt-1">Click "Add Card" to add activities inside "{activeSection}"!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-[#0b1738] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/11] bg-slate-950">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-base uppercase tracking-tight">{item.title}</h3>
                  <span className="text-[9px] text-[#F7B801] font-bold">Order: {item.sortOrder}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{item.description}</p>
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-black/10">
                <button onClick={() => openEditModal(item)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Showcase Item" : "Create Showcase Item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Section *</label>
                  <select 
                    value={formSection} 
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Card Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={formTitle} 
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ladybug Papercraft" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Card Description</label>
                <TipTapEditor
                  value={formDescription}
                  onChange={setFormDescription}
                  placeholder="Details shown under title on card hover/expansion..."
                  uploadPage="pre-primary"
                  uploadSection="pre-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image File Upload</label>
                  <div className="relative w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full border border-white/10 border-dashed rounded-xl px-4 py-3 text-xs text-white/60 font-bold flex items-center gap-2 bg-[#081a3a]">
                      <Upload size={14} className="text-[#F7B801]" />
                      <span>{uploading ? "Uploading..." : "Upload Showcase Image"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image URL *</label>
                  <input 
                    type="text" 
                    required 
                    value={formSrc} 
                    onChange={(e) => setFormSrc(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/pre-primary/filename.jpg" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image Alt Text (SEO)</label>
                  <input 
                    type="text" 
                    value={formAlt} 
                    onChange={(e) => setFormAlt(e.target.value)}
                    placeholder="origami ladybug craft by preschoolers" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Sort Position</label>
                  <input 
                    type="number" 
                    value={formSort} 
                    onChange={(e) => setFormSort(Number(e.target.value))}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 border border-white/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving || uploading} 
                  className="px-6 py-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : editingId ? "Update Card" : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
