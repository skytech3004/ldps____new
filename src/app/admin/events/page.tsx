"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, Upload } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string | null;
};

type EventForm = {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
};

const initialForm: EventForm = {
  title: "",
  description: "",
  imageUrl: "",
  date: "",
};

function toInputDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(initialForm);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "events");
      formData.append("section", "events");
      formData.append("title", `Event - ${form.title || "New Event"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      setForm((previous) => ({ ...previous, imageUrl: json.upload.src }));
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/events", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch events.");
      }
      setItems(data as EventItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch events.";
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

  function openEditModal(item: EventItem) {
    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      date: toInputDate(item.date),
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
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        date: form.date ? new Date(form.date).toISOString() : null,
      };

      const response = await fetch("/api/admin/events", {
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
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/events", {
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
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-navy mt-2">Events Management</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-colors"
          >
            <Plus size={16} />
            Create New
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-teal/70 border-b border-teal/10">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Description</th>
                <th className="py-3 pr-4">Image URL</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-teal/70" colSpan={5}>
                    Loading events...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-teal/70" colSpan={5}>
                    No events found.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-teal/10 align-top">
                  <td className="py-4 pr-4 font-bold text-navy">{item.title}</td>
                  <td className="py-4 pr-4 text-teal">{item.description || "-"}</td>
                  <td className="py-4 pr-4 text-teal break-all">{item.imageUrl || "-"}</td>
                  <td className="py-4 pr-4 text-teal">{item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-"}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-mint/40 text-navy font-bold hover:bg-mint"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-error/10 text-error font-bold hover:bg-error/20"
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
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-teal/10">
            <div className="px-6 py-4 border-b border-teal/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-navy">{editingId ? "Edit Event" : "Create Event"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-navy">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                  required
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Description</label>
                <TipTapEditor
                  value={form.description}
                  onChange={(value) => setForm((previous) => ({ ...previous, description: value }))}
                  placeholder="Event description..."
                  uploadPage="events"
                  uploadSection="events"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Event Image</label>
                <div className="flex gap-2">
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm((previous) => ({ ...previous, imageUrl: event.target.value }))}
                    placeholder="Image URL or upload a file"
                    className="flex-1 border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold focus:outline-none focus:border-teal"
                  />
                  <div className="relative shrink-0">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button type="button" disabled={uploading} className="h-full px-4 bg-navy hover:bg-teal text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
                      <Upload size={14} />
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-teal/20 text-navy font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-navy text-white font-black hover:bg-teal disabled:opacity-70">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
