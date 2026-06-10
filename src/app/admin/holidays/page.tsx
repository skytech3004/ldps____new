"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Save, Upload, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

type CalendarForm = {
  title: string;
  pdfUrl: string;
  publishedAt: string;
};

const initialForm: CalendarForm = {
  title: "Holiday Calendar 2026",
  pdfUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function AdminHolidaysPage() {
  const [form, setForm] = useState<CalendarForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchCalendar() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/holidays", { cache: "no-store" });
      const data = await response.json();
      if (response.ok && data) {
        setForm({
          title: data.title ?? "Holiday Calendar 2026",
          pdfUrl: data.pdfUrl ?? "",
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        });
      }
    } catch (fetchError) {
      console.error("Failed to load holiday calendar details:", fetchError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendar();
  }, []);

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
      body.set("page", "holidays");
      body.set("section", "documents");
      body.set("title", form.title || file.name);
      body.set("description", `Holiday Calendar PDF: ${form.title}`);
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
      setSuccess("");

      if (!form.pdfUrl) {
        throw new Error("Please upload a PDF or enter a PDF URL first.");
      }

      const payload = {
        title: form.title,
        pdfUrl: form.pdfUrl,
        publishedAt: new Date(form.publishedAt).toISOString(),
      };

      const response = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed.");
      }

      setSuccess("Holiday Calendar settings updated successfully!");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-gray-800 max-w-3xl mx-auto">
      <div className="p-6 md:p-8 border-b border-teal/10 flex items-center gap-3">
        <Calendar className="text-accent" size={24} />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Admin</p>
          <h1 className="text-3xl font-black text-primary mt-1">Manage Holiday PDF</h1>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 font-bold">Loading calendar details...</div>
      ) : (
        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
              Calendar Title *
            </label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              placeholder="e.g. Holiday Calendar 2026"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
              Published Date *
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
              required
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2 block">
                Upload Holiday PDF File
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
              <div className="flex gap-2">
                <input
                  value={form.pdfUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, pdfUrl: event.target.value }))}
                  placeholder="/uploads/documents/filename.pdf"
                  className="flex-grow border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
                {form.pdfUrl && (
                  <a
                    href={form.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-3 bg-white border border-gray-200 text-xs font-bold text-accent rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink size={14} />
                    View
                  </a>
                )}
              </div>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 disabled:opacity-70 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Calendar"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
