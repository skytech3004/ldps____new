"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, FileText, Save, Upload, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

type DisclosureItem = {
  _id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
};

type DisclosureForm = {
  title: string;
  pdfUrl: string;
};

const initialForm: DisclosureForm = {
  title: "",
  pdfUrl: "",
};

export default function AdminDisclosuresPage() {
  const [items, setItems] = useState<DisclosureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DisclosureForm>(initialForm);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/disclosures", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch disclosures.");
      }
      setItems(data as DisclosureItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch disclosures.";
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

  function openEditModal(item: DisclosureItem) {
    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      pdfUrl: item.pdfUrl ?? "",
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file only.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const body = new FormData();
      body.set("page", "disclosures");
      body.set("section", "documents");
      body.set("title", form.title || file.name);
      body.set("description", `CBSE Disclosure PDF: ${form.title}`);
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
      };

      const response = await fetch("/api/admin/disclosures", {
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
    const confirmed = window.confirm("Delete this disclosure document?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/disclosures", {
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
              <FileText className="text-accent" />
              CBSE Public Disclosures
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add Document
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Document Title</th>
                <th className="py-3 pr-4">PDF Link</th>
                <th className="py-3 pr-4">Uploaded Date</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={4}>
                    Loading documents...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={4}>
                    No documents found. Click &quot;Add Document&quot; to begin.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-middle hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.title}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      <ExternalLink size={14} />
                      View Document
                    </a>
                  </td>
                  <td className="py-4 pr-4 text-gray-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
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
                  {editingId ? "Edit Compliance Document" : "Add Compliance Document"}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Upload PDF and enter document information
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
                  Document Title *
                </label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                  placeholder="e.g. Building Safety Certificate"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
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
                {saving ? "Saving..." : editingId ? "Update Document" : "Publish Document"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
