"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, Bell, Save, Upload } from "lucide-react";

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

const initialForm: NoticeForm = {
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

export default function AdminNoticesPage() {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NoticeForm>(initialForm);
  const [uploading, setUploading] = useState(false);

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
    setForm(initialForm);
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
      setForm(initialForm);
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

  return (
    <>
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-gray-800">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-primary mt-2 flex items-center gap-3">
              <Bell className="text-accent" />
              Notice Board
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add New Notice
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Is New?</th>
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
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    No notices found.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-top hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.title}</p>
                    {item.subject && <p className="text-xs text-gray-500 mt-1 font-semibold italic">Sub: {item.subject}</p>}
                    {item.link && <p className="text-[10px] text-gray-400 mt-1 truncate max-w-xs">{item.link}</p>}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/5 text-primary uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-gray-500 font-medium">{new Date(item.date).toLocaleDateString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    {item.isNew ? (
                      <span className="text-accent font-black text-xs uppercase animate-pulse">Yes</span>
                    ) : (
                      <span className="text-gray-300 font-bold text-xs uppercase">No</span>
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
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{editingId ? "Edit Notice" : "Add New Notice"}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Full Announcement Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2.5 rounded-full hover:bg-gray-200 text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Short Title (for list) *</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                    required
                    placeholder="e.g. Winter Vacation 2024"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Category *</label>
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
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Formal Subject (for page)</label>
                <input
                  value={form.subject}
                  onChange={(event) => setForm((previous) => ({ ...previous, subject: event.target.value }))}
                  placeholder="e.g. Regarding declaration of winter holidays"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Ref No.</label>
                  <input
                    value={form.refNo}
                    onChange={(event) => setForm((previous) => ({ ...previous, refNo: event.target.value }))}
                    placeholder="LPS/2024/042"
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
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Announcement Body (Markdown supported)</label>
                <textarea
                  value={form.body}
                  onChange={(event) => setForm((previous) => ({ ...previous, body: event.target.value }))}
                  rows={8}
                  placeholder="The school will remain closed for winter vacation from..."
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-600 font-medium focus:border-accent focus:outline-none transition-all resize-none"
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
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Document / External Link (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      value={form.link}
                      onChange={(event) => setForm((previous) => ({ ...previous, link: event.target.value }))}
                      placeholder="https://... or uploaded file path"
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
                        {uploading ? "Uploading..." : "Upload File"}
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
                    Mark as &quot;NEW&quot; alert
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
                {saving ? "Saving..." : editingId ? "Update Notice" : "Publish Notice"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
