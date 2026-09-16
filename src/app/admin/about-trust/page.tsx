"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Save, Upload, User, ArrowUpRight, ArrowUpDown, Shield } from "lucide-react";

type TrustMember = {
  _id: string;
  name: string;
  title: string;
  image: string;
  sortOrder: number;
};

export default function AdminAboutTrustPage() {
  const [members, setMembers] = useState<TrustMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  async function fetchMembers() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/trust-members");
      if (!res.ok) throw new Error("Failed to load trust members.");
      const data = await res.json();
      setMembers(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setFormName("");
    setFormTitle("");
    setFormImage("");
    setFormSortOrder("0");
    setSelectedFile(null);
    setPreviewSrc("");
    setModalOpen(true);
  }

  function openEditModal(member: TrustMember) {
    setEditingId(member._id);
    setFormName(member.name);
    setFormTitle(member.title);
    setFormImage(member.image);
    setFormSortOrder(String(member.sortOrder ?? 0));
    setSelectedFile(null);
    setPreviewSrc(member.image);
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
      formData.append("page", "about-trust");
      formData.append("section", "team-cards");
      formData.append("title", `Trust Member - ${formName || "Profile"}`);

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
    if (!formName.trim() || !formTitle.trim()) {
      alert("Name and Heading/Title are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const finalImageUrl = selectedFile ? await handleImageUpload() : formImage;

      if (!finalImageUrl.trim()) {
        alert("Please upload an image or provide an image URL.");
        setSaving(false);
        return;
      }

      const payload = {
        id: editingId,
        name: formName.trim(),
        title: formTitle.trim(),
        image: finalImageUrl.trim(),
        sortOrder: Number(formSortOrder || "0"),
      };

      const res = await fetch("/api/admin/trust-members", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save operation failed.");

      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this person from the Trust Team?")) return;
    try {
      setError("");
      const res = await fetch("/api/admin/trust-members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      fetchMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
    }
  }

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-[#F7B801] font-black uppercase">School Information</p>
          <h1 className="text-4xl font-black mt-2 text-white">Trust Team Section Manager</h1>
          <p className="text-white/70 mt-2">
            Add people, upload profile images, enter titles and names displayed in the top section of /about/trust.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about/trust"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white"
          >
            <ArrowUpRight size={14} />
            View Public Page (/about/trust)
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Person
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading Trust Team database...</div>
      ) : members.length === 0 ? (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
          <Shield size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
          <p className="font-bold text-lg">No Trust Team entries found.</p>
          <p className="text-sm text-white/50 mt-1">Click &quot;Add Person&quot; to add the first profile card to /about/trust!</p>
        </div>
      ) : (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              Trust Team Members ({members.length})
            </h2>
            <span className="text-xs text-white/50 font-bold">Changes reflect automatically on /about/trust</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-[#081a3a] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#F7B801]/50 transition-all duration-300 shadow-md"
              >
                {/* Profile Image Aspect Container */}
                <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/lps-vidhyawadi/about-banner.jpg";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#3D348B]/90 border border-white/20 text-[#F7B801] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md">
                    Sort #{member.sortOrder ?? 0}
                  </div>
                </div>

                {/* Person details */}
                <div className="p-5 space-y-2 flex-grow">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F7B801] bg-[#F7B801]/10 px-2.5 py-0.5 rounded-md inline-block">
                    {member.title}
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight font-montserrat uppercase">
                    {member.name}
                  </h3>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-end gap-2 border-t border-white/5">
                  <button
                    onClick={() => openEditModal(member)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Person Entry" : "Add New Person"}
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
                  Heading / Title * (e.g. Managing Trustee, Patron, Founder)
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Executive Trustee"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Person Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Shri Leeladevi Sancheti"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">
                  Profile Image Upload / URL *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-1">
                    <div className="relative aspect-[4/5] w-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-white/20 mx-auto flex items-center justify-center">
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
                      <div className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/70 font-bold flex items-center gap-2 bg-[#081a3a] justify-center cursor-pointer hover:border-[#F7B801]">
                        <Upload size={14} className="text-[#F7B801]" />
                        <span>{selectedFile ? selectedFile.name : "Upload Image"}</span>
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
                  Display Order / Priority (lower numbers appear first)
                </label>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                  placeholder="0"
                  className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
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
                  {saving || uploading ? "Saving..." : editingId ? "Update Person" : "Add Person"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
