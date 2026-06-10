"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Upload, Loader2, UserRound } from "lucide-react";

type LeadershipMember = {
  _id: string;
  name: string;
  designation: string;
  image: string;
  sortOrder: number;
};

type LeadershipForm = {
  name: string;
  designation: string;
  image: string;
  sortOrder: string;
};

const initialForm: LeadershipForm = {
  name: "",
  designation: "",
  image: "",
  sortOrder: "0",
};

export default function AdminLeadershipPage() {
  const [items, setItems] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadershipForm>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/leadership", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch leadership members.");
      }
      setItems(data as LeadershipMember[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch leadership members.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/admin/leadership", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch leadership members.");
        }
        if (!cancelled) {
          setItems(data as LeadershipMember[]);
        }
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch leadership members.";
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(initialForm);
    setSelectedFile(null);
    setPreviewSrc("");
    setModalOpen(true);
  }

  function openEditModal(item: LeadershipMember) {
    setEditingId(item._id);
    setForm({
      name: item.name ?? "",
      designation: item.designation ?? "",
      image: item.image ?? "",
      sortOrder: String(item.sortOrder ?? 0),
    });
    setSelectedFile(null);
    setPreviewSrc(item.image ?? "");
    setModalOpen(true);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(String(reader.result ?? ""));
      };
      reader.readAsDataURL(file);
      setForm((previous) => ({ ...previous, image: "" }));
    }
  }

  async function uploadSelectedFile(name: string) {
    if (!selectedFile) return "";

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("page", "leadership");
      formData.set("section", "leadership");
      formData.set("title", name || "Leadership Member");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      return String(data.upload.src ?? "");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const uploadedImage = selectedFile ? await uploadSelectedFile(form.name.trim()) : "";
      const image = uploadedImage || form.image.trim();

      const payload = {
        id: editingId,
        name: form.name.trim(),
        designation: form.designation.trim(),
        image,
        sortOrder: Number(form.sortOrder || "0"),
      };

      const response = await fetch("/api/admin/leadership", {
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
      setSelectedFile(null);
      setPreviewSrc("");
      setEditingId(null);
      await fetchItems();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this leadership member?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/leadership", {
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
            <h1 className="text-3xl md:text-4xl font-black text-navy mt-2">Leadership Management</h1>
            <p className="text-sm text-teal mt-2">Add, edit, and delete the CEO / chairman / trustee cards.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-colors"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-teal/70 border-b border-teal/10">
                <th className="py-3 pr-4">Image</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Designation</th>
                <th className="py-3 pr-4">Sort</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-teal/70" colSpan={5}>
                    Loading leadership members...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-teal/70" colSpan={5}>
                    No leadership members found.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => {
                const hasImage = Boolean(item.image);

                return (
                  <tr key={item._id} className="border-b border-teal/10 align-top">
                    <td className="py-4 pr-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-teal/10 bg-gray-100">
                        {hasImage ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                            <UserRound size={24} className="text-white/90" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-bold text-navy">{item.name}</td>
                    <td className="py-4 pr-4 text-teal">{item.designation}</td>
                    <td className="py-4 pr-4 text-teal">{item.sortOrder}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-teal/10">
            <div className="px-6 py-4 border-b border-teal/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-navy">{editingId ? "Edit Leadership Member" : "Add Leadership Member"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-navy">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Name *</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                  required
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Designation *</label>
                <input
                  value={form.designation}
                  onChange={(event) => setForm((previous) => ({ ...previous, designation: event.target.value }))}
                  required
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-teal/20 rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center bg-[#f7fbf8]/50 min-h-[140px]">
                      <Upload className="text-teal/40 mb-3" size={28} />
                      <p className="text-sm font-bold text-navy">
                        {selectedFile ? selectedFile.name : "Click or drag image file here"}
                      </p>
                      <p className="text-[10px] text-teal mt-1 font-bold uppercase tracking-widest">PNG, JPG or WEBP</p>
                    </div>
                  </div>
                    <div className="space-y-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-teal">Preview</p>
                      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-teal/10 bg-gray-100">
                      {previewSrc || form.image ? (
                        <Image
                          src={previewSrc || form.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                          <UserRound size={64} className="text-white/90" />
                        </div>
                      )}
                    </div>
                    <input
                      value={form.image}
                      onChange={(event) => {
                        setForm((previous) => ({ ...previous, image: event.target.value }));
                        setSelectedFile(null);
                        setPreviewSrc(event.target.value);
                      }}
                      placeholder="Or paste image URL"
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm((previous) => ({ ...previous, sortOrder: event.target.value }))}
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
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-lg bg-navy text-white font-black hover:bg-teal disabled:opacity-70 inline-flex items-center gap-2"
                >
                  {saving || uploading ? <Loader2 size={14} className="animate-spin" /> : null}
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
