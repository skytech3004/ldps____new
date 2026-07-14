"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, FileText, Save, Upload, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

type DownloadItem = {
  _id: string;
  title: string;
  description: string;
  filename: string;
  fileSize: string;
  pdfUrl: string;
  createdAt: string;
};

type DownloadForm = {
  title: string;
  description: string;
  filename: string;
  fileSize: string;
  pdfUrl: string;
};

const initialForm: DownloadForm = {
  title: "",
  description: "",
  filename: "",
  fileSize: "",
  pdfUrl: "",
};

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DownloadForm>(initialForm);

  // Prospectus states
  const [prospectusInfo, setProspectusInfo] = useState<{
    exists: boolean;
    url?: string;
    filename?: string;
    size?: string;
    updatedAt?: string;
  } | null>(null);
  const [prospectusUploading, setProspectusUploading] = useState(false);
  const [prospectusError, setProspectusError] = useState("");
  const [prospectusSuccess, setProspectusSuccess] = useState("");

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/downloads", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch downloads.");
      }
      setItems(data as DownloadItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch downloads.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProspectusInfo() {
    try {
      const response = await fetch("/api/admin/prospectus");
      if (response.ok) {
        const data = await response.json();
        setProspectusInfo(data);
      }
    } catch (e) {
      console.error("Failed to fetch prospectus info", e);
    }
  }

  useEffect(() => {
    fetchItems();
    fetchProspectusInfo();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(item: DownloadItem) {
    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      filename: item.filename ?? "",
      fileSize: item.fileSize ?? "",
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
      body.set("page", "downloads");
      body.set("section", "documents");
      body.set("title", form.title || file.name);
      body.set("description", `Resource Download PDF: ${form.title}`);
      body.set("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "File upload failed.");
      }

      // Calculate file size
      const formattedSize = formatBytes(file.size);

      setForm((prev) => ({
        ...prev,
        filename: file.name,
        fileSize: formattedSize,
        pdfUrl: result.upload.src,
      }));
      setSuccess("PDF uploaded successfully!");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function handleProspectusUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setProspectusError("Please upload a PDF file only.");
      return;
    }

    setProspectusUploading(true);
    setProspectusError("");
    setProspectusSuccess("");

    try {
      const body = new FormData();
      body.set("file", file);

      const response = await fetch("/api/admin/prospectus", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Prospectus upload failed.");
      }

      setProspectusInfo({
        exists: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
        updatedAt: result.updatedAt,
      });
      setProspectusSuccess("Prospectus PDF uploaded and activated successfully!");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setProspectusError(message);
    } finally {
      setProspectusUploading(false);
    }
  }

  async function handleProspectusRemove() {
    const confirmed = window.confirm(
      "Are you sure you want to remove the school prospectus? This will delete the prospectus file from the server."
    );
    if (!confirmed) return;

    setProspectusUploading(true);
    setProspectusError("");
    setProspectusSuccess("");

    try {
      const response = await fetch("/api/admin/prospectus", {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? "Failed to delete prospectus.");
      }

      setProspectusInfo({ exists: false });
      setProspectusSuccess("Prospectus PDF removed successfully.");
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Failed to delete prospectus.";
      setProspectusError(message);
    } finally {
      setProspectusUploading(false);
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
      if (!form.filename) {
        throw new Error("Filename is required.");
      }

      const payload = {
        id: editingId,
        ...form,
      };

      const response = await fetch("/api/admin/downloads", {
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
    const confirmed = window.confirm("Delete this download document?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/downloads", {
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
    <div className="space-y-8">
      {/* Prospectus Manager Section */}
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-gray-800 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-teal/5 pb-5">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7678ED]">Official Publications</span>
            <h2 className="text-2xl font-black text-primary mt-1 uppercase font-montserrat flex items-center gap-2">
              <Upload className="text-[#7678ED]" size={20} />
              School Prospectus Manager
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Upload, update, or remove the official school prospectus. This updates the prospectus download link across the whole site.
            </p>
          </div>
        </div>

        {prospectusError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold leading-relaxed flex gap-2 text-left">
            <AlertTriangle className="shrink-0" size={14} />
            <span>{prospectusError}</span>
          </div>
        )}

        {prospectusSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-semibold leading-relaxed flex gap-2 text-left">
            <CheckCircle2 className="shrink-0" size={14} />
            <span>{prospectusSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Status Display */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Prospectus Status</span>
              {prospectusInfo?.exists ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-gray-200 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Not Uploaded
                </span>
              )}
            </div>

            {prospectusInfo?.exists ? (
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary truncate" title={prospectusInfo.filename}>{prospectusInfo.filename}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Size: {prospectusInfo.size}</p>
                  </div>
                </div>
                {prospectusInfo.updatedAt && (
                  <div className="text-[10px] text-gray-400 font-medium">
                    Last updated: {new Date(prospectusInfo.updatedAt).toLocaleString("en-IN")}
                  </div>
                )}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href={prospectusInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm hover:bg-secondary transition-all"
                  >
                    <ExternalLink size={12} />
                    View Live
                  </a>
                  <button
                    onClick={handleProspectusRemove}
                    disabled={prospectusUploading}
                    className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm font-bold text-gray-400">No official prospectus file uploaded.</p>
                <p className="text-xs text-gray-400 mt-1">Users will see a message prompting them to contact registry.</p>
              </div>
            )}
          </div>

          {/* Upload Drag/Select Panel */}
          <div className="border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center transition-all bg-white relative h-40">
            <Upload className="text-gray-400 mb-3" size={28} />
            <p className="text-xs font-bold text-gray-600 text-center">
              {prospectusUploading ? "Uploading PDF..." : "Upload or Drop PDF File"}
            </p>
            <p className="text-[10px] text-gray-400 text-center mt-1">Accepts prospectus.pdf up to 10MB</p>
            
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleProspectusUpload}
              disabled={prospectusUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Existing Downloads List */}
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-gray-800">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-primary mt-2 flex items-center gap-3">
              <FileText className="text-accent" />
              Downloads Manager
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add Download
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Title & Description</th>
                <th className="py-3 pr-4">File Details</th>
                <th className="py-3 pr-4">Uploaded Date</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={4}>
                    Loading downloads...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={4}>
                    No download items found. Click &quot;Add Download&quot; to begin.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-middle hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-2 max-w-[400px]">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="space-y-1">
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                      >
                        <ExternalLink size={14} />
                        View/Download File
                      </a>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {item.filename} ({item.fileSize || "Size N/A"})
                      </p>
                    </div>
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
                  {editingId ? "Edit Download Document" : "Add Download Document"}
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
                  placeholder="e.g. Student Leave Application Form"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Prescribed form for submitting student leave requests..."
                  rows={3}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all resize-none"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2 block">
                      Filename *
                    </label>
                    <input
                      value={form.filename}
                      onChange={(event) => setForm((prev) => ({ ...prev, filename: event.target.value }))}
                      required
                      placeholder="LPS_Student_Leave_Form.pdf"
                      className="w-full border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2 block">
                      File Size (e.g. 184 KB)
                    </label>
                    <input
                      value={form.fileSize}
                      onChange={(event) => setForm((prev) => ({ ...prev, fileSize: event.target.value }))}
                      placeholder="184 KB"
                      className="w-full border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                    />
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
                {saving ? "Saving..." : editingId ? "Update Download" : "Publish Download"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
