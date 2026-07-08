"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, X, Save, Image, 
  Upload, ArrowUpRight, BookOpen, Calendar, User, Eye 
} from "lucide-react";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  status: "Draft" | "Published";
  publishedAt: string;
};

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formAuthor, setFormAuthor] = useState("Admin");
  const [formTagsText, setFormTagsText] = useState("");
  const [formStatus, setFormStatus] = useState<"Draft" | "Published">("Published");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [uploading, setUploading] = useState(false);

  async function fetchBlogs() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/blogs?admin=true");
      if (!res.ok) throw new Error("Failed to load blogs database.");
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  useEffect(() => {
    if (!manualSlug && !editingId) {
      setFormSlug(generateSlug(formTitle));
    }
  }, [formTitle, manualSlug, editingId]);

  // Handle featured image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "blog");
      formData.append("section", "blogs");
      formData.append("title", `Blog - ${formTitle || "New Post"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      setFormImage(json.upload.src);
    } catch (err) {
      alert("Failed to upload featured image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setManualSlug(false);
    setFormExcerpt("");
    setFormContent("");
    setFormImage("");
    setFormAuthor("Admin");
    setFormTagsText("");
    setFormStatus("Published");
    setFormPublishedAt(new Date().toISOString().substring(0, 16)); // current datetime-local input string

    setModalOpen(true);
  }

  function openEditModal(post: BlogPost) {
    setEditingId(post._id);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setManualSlug(true);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormImage(post.image);
    setFormAuthor(post.author);
    setFormTagsText(post.tags ? post.tags.join(", ") : "");
    setFormStatus(post.status);
    setFormPublishedAt(new Date(post.publishedAt).toISOString().substring(0, 16));

    setModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        title: formTitle.trim(),
        slug: formSlug.trim(),
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        image: formImage.trim(),
        author: formAuthor.trim() || "Admin",
        tags: formTagsText.split(",").map(t => t.trim()).filter(Boolean),
        status: formStatus,
        publishedAt: formPublishedAt ? new Date(formPublishedAt) : new Date(),
      };

      const res = await fetch("/api/blogs", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save operation failed.");
      
      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      setError("");
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      fetchBlogs();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2">Blog Manager</h1>
          <p className="text-white/70 mt-2">Publish posts, draft contents, upload featured covers, and categorize tags.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/blog" target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white">
            <ArrowUpRight size={14} />
            View Public Blog
          </Link>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
            <Plus size={16} />
            Create Post
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading blog lists...</div>
      ) : blogs.length === 0 ? (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
          <BookOpen size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
          <p className="font-bold text-lg">No blog posts found in database.</p>
          <p className="text-sm text-white/50 mt-1">Click "Create Post" to write your very first blog article!</p>
        </div>
      ) : (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-white/60 text-xs font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Cover</th>
                  <th className="py-4 px-6">Post Details</th>
                  <th className="py-4 px-6">Author & Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {blogs.map((post) => (
                  <tr key={post._id} className="hover:bg-white/5">
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-950 border border-white/10">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <h3 className="font-bold text-white leading-snug">{post.title}</h3>
                      <p className="text-xs text-white/60">/{post.slug}</p>
                    </td>
                    <td className="py-4 px-6 text-xs text-white/70 space-y-1">
                      <p className="font-semibold flex items-center gap-1"><User size={10} /> {post.author}</p>
                      <p className="flex items-center gap-1"><Calendar size={10} /> {new Date(post.publishedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        post.status === "Published" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => openEditModal(post)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Blog Post" : "Write Blog Post"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Blog Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={formTitle} 
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Innovations in Preschool Curriculum" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block">Route URL Slug *</label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#F7B801] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={manualSlug} 
                        onChange={(e) => setManualSlug(e.target.checked)} 
                        className="rounded accent-[#F7B801]"
                      />
                      Edit manual
                    </label>
                  </div>
                  <input 
                    type="text" 
                    required 
                    disabled={!manualSlug && !editingId}
                    value={formSlug} 
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="innovations-in-preschool" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] disabled:opacity-50 focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Brief Excerpt * (shown on listing cards)</label>
                <input 
                  type="text" 
                  required 
                  value={formExcerpt} 
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Summarize the core theme of this article..." 
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Cover File Upload</label>
                  <div className="relative w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full border border-white/10 border-dashed rounded-xl px-4 py-3 text-xs text-white/60 font-bold flex items-center gap-2 bg-[#081a3a]">
                      <Upload size={14} className="text-[#F7B801]" />
                      <span>{uploading ? "Uploading..." : "Upload Featured Cover"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Featured Image URL *</label>
                  <input 
                    type="text" 
                    required 
                    value={formImage} 
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/uploads/blogs/filename.jpg" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Author Name</label>
                  <input 
                    type="text" 
                    value={formAuthor} 
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Status</label>
                  <select 
                    value={formStatus} 
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Publish Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={formPublishedAt} 
                    onChange={(e) => setFormPublishedAt(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Tags / Categories (comma separated)</label>
                <input 
                  type="text" 
                  value={formTagsText} 
                  onChange={(e) => setFormTagsText(e.target.value)}
                  placeholder="Academics, Early Childhood, Events" 
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Blog Content * (HTML format supported)</label>
                <textarea 
                  rows={12} 
                  required
                  value={formContent} 
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="<p>Write your detailed blog contents here...</p>" 
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] resize-y font-mono"
                />
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
                  {saving ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
