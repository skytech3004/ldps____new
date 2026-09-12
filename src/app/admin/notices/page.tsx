"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, Plus, Trash2, X, Bell, Save, Upload, Newspaper, GraduationCap, ShieldAlert, Layers } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

type NoticeItem = {
  _id: string;
  title: string;
  subject: string;
  body: string;
  refNo: string;
  signatory: string;
  category: string;
  date: string;
  isNew: boolean;
  link: string;
};

type NoticeForm = {
  title: string;
  subject: string;
  body: string;
  refNo: string;
  signatory: string;
  category: string;
  date: string;
  isNew: boolean;
  link: string;
};

const initialFormDefault: NoticeForm = {
  title: "",
  subject: "",
  body: "",
  refNo: "",
  signatory: "Principal,\nLPS English Medium School",
  category: "News & Circulars",
  date: new Date().toISOString().slice(0, 10),
  isNew: true,
  link: "",
};

function toInputDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

const categories = ["News & Circulars", "Announcements", "Admission", "School Rules"];

function AdminNoticesContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Selected category filter tab ("All" or specific category name)
  const [activeTab, setActiveTab] = useState<string>(
    initialCategoryParam && categories.includes(initialCategoryParam) ? initialCategoryParam : "All"
  );
  
  const [form, setForm] = useState<NoticeForm>({
    ...initialFormDefault,
    category: initialCategoryParam && categories.includes(initialCategoryParam) ? initialCategoryParam : "News & Circulars",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialCategoryParam && categories.includes(initialCategoryParam)) {
      setActiveTab(initialCategoryParam);
      setForm((prev) => ({ ...prev, category: initialCategoryParam }));
    }
  }, [initialCategoryParam]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "notice");
      formData.append("section", "notice");
      formData.append("title", `Notice - ${form.title || "File"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      setForm((previous) => ({ ...previous, link: json.upload.src }));
    } catch (err) {
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/notices", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch notices.");
      }
      setItems(data as NoticeItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch notices.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    const defaultCat = activeTab !== "All" ? activeTab : "News & Circulars";
    setForm({
      ...initialFormDefault,
      category: defaultCat,
      date: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  }

  function openEditModal(item: NoticeItem) {
    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      subject: item.subject ?? "",
      body: item.body ?? "",
      refNo: item.refNo ?? "",
      signatory: item.signatory ?? "Principal,\nLPS English Medium School",
      category: item.category ?? "News & Circulars",
      date: toInputDate(item.date),
      isNew: item.isNew ?? true,
      link: item.link ?? "",
    });
    setModalOpen(true);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        ...form,
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      };

      const response = await fetch("/api/admin/notices", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed.");
      }

      setModalOpen(false);
      setEditingId(null);
      await fetchItems();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this notice?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Delete failed.");
      }
      await fetchItems();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Delete failed.";
      setError(message);
    }
  }

  // Filter items based on active tab
  const filteredItems = activeTab === "All"
    ? items
    : items.filter((item) => item.category === activeTab);

  // Tab Icons mapping
  const tabIcons: Record<string, any> = {
    "All": Layers,
    "News & Circulars": Newspaper,
    "Announcements": Bell,
    "Admission": GraduationCap,
    "School Rules": ShieldAlert,
  };

  return (
    <>
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-gray-800">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">School Communication</p>
            <h1 className="text-3xl md:text-4xl font-black text-primary mt-2 flex items-center gap-3">
              <Bell className="text-accent" />
              {activeTab === "All" ? "Notice Board & Circulars" : activeTab}
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Manage public notices, news, admission alerts, and school rules displayed on the website.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors shrink-0"
          >
            <Plus size={16} />
            Add {activeTab !== "All" ? activeTab : "Notice"}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-6 border-b border-gray-100 bg-slate-50/50 flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => {
            const Icon = tabIcons[cat] || Layers;
            const count = cat === "All" ? items.length : items.filter(i => i.category === cat).length;
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t-2 border-x ${
                  isActive
                    ? "bg-white text-primary border-t-accent border-x-gray-200 shadow-sm"
                    : "text-gray-500 border-transparent hover:text-primary hover:bg-gray-100"
                }`}
              >
                <Icon size={14} className={isActive ? "text-accent" : "text-gray-400"} />
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? "bg-accent/20 text-primary" : "bg-gray-200 text-gray-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Title & Details</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    Loading notices...
                  </td>
                </tr>
              ) : null}
              {!loading && filteredItems.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-gray-400" colSpan={5}>
                    <p className="font-bold text-sm">No entries found for {activeTab}.</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent font-bold hover:underline"
                    >
                      <Plus size={14} /> Add new entry now
                    </button>
                  </td>
                </tr>
              ) : null}
              {filteredItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-top hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.title}</p>
                    {item.subject && <p className="text-xs text-gray-500 mt-1 font-semibold italic">Sub: {item.subject}</p>}
                    {item.link && <p className="text-[10px] text-gray-400 mt-1 truncate max-w-xs">{item.link}</p>}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/5 text-primary uppercase border border-primary/10">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-gray-500 font-medium">{new Date(item.date).toLocaleDateString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    {item.isNew ? (
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-primary font-black text-[10px] uppercase">NEW Alert</span>
                    ) : (
                      <span className="text-gray-300 font-bold text-xs uppercase">Archived</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-colors"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-error/5 text-error font-bold hover:bg-error/10 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden text-gray-800 flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{editingId ? "Edit Entry" : `Add Entry — ${form.category}`}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Public Website Announcement Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2.5 rounded-full hover:bg-gray-200 text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Short Title *</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                    required
                    placeholder="e.g. Admission Open 2025-26"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Category Section *</label>
                  <select
                    value={form.category}
                    onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Formal Subject / Headline</label>
                <input
                  value={form.subject}
                  onChange={(event) => setForm((previous) => ({ ...previous, subject: event.target.value }))}
                  placeholder="e.g. Detailed rules and guidelines for school campus"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Ref No.</label>
                  <input
                    value={form.refNo}
                    onChange={(event) => setForm((previous) => ({ ...previous, refNo: event.target.value }))}
                    placeholder="LPS/2025/001"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Display Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Body Content</label>
                <TipTapEditor
                  value={form.body}
                  onChange={(value) => setForm((previous) => ({ ...previous, body: value }))}
                  placeholder="Write full text or rules..."
                  uploadPage="notices"
                  uploadSection="notice"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Signatory / Authority</label>
                <textarea
                  value={form.signatory}
                  onChange={(event) => setForm((previous) => ({ ...previous, signatory: event.target.value }))}
                  rows={2}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Attached Document PDF or Link</label>
                  <div className="flex gap-2">
                    <input
                      value={form.link}
                      onChange={(event) => setForm((previous) => ({ ...previous, link: event.target.value }))}
                      placeholder="https://... or upload PDF file"
                      className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                    />
                    <div className="relative shrink-0">
                      <input 
                        type="file" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button type="button" disabled={uploading} className="h-[52px] px-5 bg-primary hover:bg-secondary text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm">
                        <Upload size={14} />
                        {uploading ? "Uploading..." : "Upload PDF"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/5 h-[62px] mt-6">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={form.isNew}
                    onChange={(event) => setForm((previous) => ({ ...previous, isNew: event.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label htmlFor="isNew" className="text-sm font-black text-primary cursor-pointer uppercase tracking-tight">
                    Mark as &quot;NEW&quot; alert badge
                  </label>
                </div>
              </div>
            </form>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={onSubmit}
                disabled={saving} 
                className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 disabled:opacity-70 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : editingId ? "Update Entry" : "Publish Entry"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function AdminNoticesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white font-bold">Loading notices...</div>}>
      <AdminNoticesContent />
    </Suspense>
  );
}
