"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, BookOpen, Save, Upload, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

type MagazineItem = {
  _id: string;
  name: string;
  pdfUrl: string;
  year: number;
  month: string;
  createdAt: string;
};

type MagazineForm = {
  name: string;
  pdfUrl: string;
  year: number;
  month: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate years from current year + 2 down to 2020
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear + 2 - i);

const initialForm: MagazineForm = {
  name: "Akashganga",
  pdfUrl: "",
  year: currentYear,
  month: MONTHS[new Date().getMonth()],
};

export default function AdminMagazinePage() {
  const [items, setItems] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MagazineForm>(initialForm);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/magazine", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch magazines.");
      }
      setItems(data as MagazineItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch magazines.";
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
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(item: MagazineItem) {
    setEditingId(item._id);
    setForm({
      name: item.name ?? "Akashganga",
      pdfUrl: item.pdfUrl ?? "",
      year: item.year ?? currentYear,
      month: item.month ?? MONTHS[0],
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate that it's a PDF
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file only.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const body = new FormData();
      body.set("page", "magazine");
      body.set("section", "documents");
      body.set("title", `${form.name} - ${form.month} ${form.year}`);
      body.set("description", `PDF for school magazine: ${form.name}`);
      body.set("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "File upload failed.");
      }

      setForm((prev) => ({ ...prev, pdfUrl: result.upload.src }));
      setSuccess("PDF uploaded successfully!");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      if (!form.pdfUrl) {
        throw new Error("Please upload a PDF or enter a PDF URL first.");
      }

      const payload = {
        id: editingId,
        ...form,
        year: Number(form.year),
      };

      const response = await fetch("/api/admin/magazine", {
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
    const confirmed = window.confirm("Are you sure you want to delete this magazine issue?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/magazine", {
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
              <BookOpen className="text-accent" />
              School Magazine
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add New Issue
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Magazine Name</th>
                <th className="py-3 pr-4">Issue Details</th>
                <th className="py-3 pr-4">Academic Year</th>
                <th className="py-3 pr-4">PDF Link</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    Loading magazines...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    No magazine issues found. Click &quot;Add New Issue&quot; to add one.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-middle hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.name}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/5 text-primary uppercase">
                      {item.month}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-bold text-gray-700">
                    Academics Year {item.year}
                  </td>
                  <td className="py-4 pr-4">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      <ExternalLink size={14} />
                      View PDF
                    </a>
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
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden text-gray-800 flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">
                  {editingId ? "Edit Magazine Issue" : "Add New Magazine Issue"}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Upload PDF and enter issue information
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2.5 rounded-full hover:bg-gray-200 text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                  Magazine Name *
                </label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  placeholder="e.g. Akashganga"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Month *
                  </label>
                  <select
                    value={form.month}
                    onChange={(event) => setForm((prev) => ({ ...prev, month: event.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all appearance-none"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Year *
                  </label>
                  <select
                    value={form.year}
                    onChange={(event) => setForm((prev) => ({ ...prev, year: Number(event.target.value) }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all appearance-none"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2 block">
                    Upload PDF File
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-sm font-bold text-primary rounded-xl shadow-sm transition-all cursor-pointer">
                      <Upload size={16} />
                      {uploading ? "Uploading..." : "Choose PDF"}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {form.pdfUrl && (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        File ready
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2 block">
                    Or Enter PDF URL directly
                  </label>
                  <input
                    value={form.pdfUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, pdfUrl: event.target.value }))}
                    placeholder="/uploads/documents/filename.pdf"
                    className="w-full border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-sm font-semibold text-error flex items-center gap-2 bg-error/5 p-3 rounded-xl border border-error/10">
                  <AlertTriangle size={16} className="shrink-0" />
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="text-sm font-semibold text-green-700 flex items-center gap-2 bg-green-50 p-3 rounded-xl border border-green-200">
                  <CheckCircle2 size={16} className="shrink-0" />
                  {success}
                </p>
              ) : null}
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
                disabled={saving || uploading}
                className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 disabled:opacity-70 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : editingId ? "Update Issue" : "Publish Issue"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
