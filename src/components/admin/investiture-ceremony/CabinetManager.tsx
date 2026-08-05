"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, ChevronRight, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

type CabinetMember = {
  _id: string;
  name: string;
  role: string;
  image: string;
  sortOrder: number;
};

type CabinetForm = {
  name: string;
  role: string;
  image: string;
  sortOrder: string;
};

const initialForm: CabinetForm = {
  name: "",
  role: "",
  image: "",
  sortOrder: "0",
};

export default function CabinetManager() {
  const [items, setItems] = useState<CabinetMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CabinetForm>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/cabinet", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load cabinet members.");
        }
        if (!cancelled) {
          setItems(data as CabinetMember[]);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load cabinet members.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItems();
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

  function openEditModal(item: CabinetMember) {
    setEditingId(item._id);
    setForm({
      name: item.name ?? "",
      role: item.role ?? "",
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
      reader.onload = () => setPreviewSrc(String(reader.result ?? ""));
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
      formData.set("page", "investiture-ceremony");
      formData.set("section", "cabinet");
      formData.set("title", name || "Cabinet Member");

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
        role: form.role.trim(),
        image,
        sortOrder: Number(form.sortOrder || "0"),
      };

      const response = await fetch("/api/admin/cabinet", {
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

      const refresh = await fetch("/api/admin/cabinet", { cache: "no-store" });
      const refreshed = await refresh.json();
      if (refresh.ok) {
        setItems(refreshed as CabinetMember[]);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Save failed.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this cabinet member?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/cabinet", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Delete failed.");
      }

      setItems((previous) => previous.filter((item) => item._id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  }

  return (
    <section className="space-y-8 text-[#0b1738]">
      <div className="rounded-3xl border border-teal/10 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#7678ED]">Student Leadership</p>
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B]">Cabinet Manager</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              Upload member photos, edit roles, and keep the student cabinet list in sync with the Investiture Ceremony page.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#3D348B] text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#7678ED] transition-colors"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-7 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#3D348B]">Cabinet List</h2>
              <p className="text-sm text-slate-500 mt-1">Add, edit, or delete the members shown publicly.</p>
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              {items.length} records
            </div>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-red-500">{error}</p> : null}
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500/70 border-b border-slate-100">
                <th className="py-3 pr-4 font-black">Image</th>
                <th className="py-3 pr-4 font-black">Name</th>
                <th className="py-3 pr-4 font-black">Role</th>
                <th className="py-3 pr-4 font-black">Sort</th>
                <th className="py-3 pr-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin inline mr-2 text-[#3D348B]" />
                    Loading cabinet members...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No cabinet members found. Click Add Member to begin.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 pr-4">
                      {item.image ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Award size={20} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4 font-bold text-slate-700">{item.name}</td>
                    <td className="py-4 pr-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#7678ED]/10 text-[#3D348B]">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 font-semibold">{item.sortOrder}</td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-9 h-9 rounded-lg hover:bg-[#3D348B]/10 text-slate-600 hover:text-[#3D348B] flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(item._id)}
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7678ED]">Cabinet Member</p>
                <h3 className="text-2xl font-black text-[#3D348B] mt-1">
                  {editingId ? "Edit Member" : "Add Member"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center"
                aria-label="Close cabinet modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    placeholder="Ms. Example Name"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Role</span>
                  <input
                    value={form.role}
                    onChange={(event) => setForm((previous) => ({ ...previous, role: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    placeholder="Head Girl"
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Upload Photo</span>
                  <label className="inline-flex w-full items-center justify-between gap-3 cursor-pointer bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-black text-sm border border-slate-200 hover:border-[#3D348B] transition-colors">
                    <span className="inline-flex items-center gap-2">
                      <Upload size={16} />
                      {selectedFile ? selectedFile.name : "Choose image file"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Sort Order</span>
                  <input
                    value={form.sortOrder}
                    onChange={(event) => setForm((previous) => ({ ...previous, sortOrder: event.target.value }))}
                    className="w-24 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    placeholder="0"
                    inputMode="numeric"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  {previewSrc ? (
                    <Image src={previewSrc} alt="Cabinet preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Award size={22} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{form.name || "Cabinet member"}</p>
                  <p className="text-xs text-slate-500">Upload a photo to replace the current image.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-black uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 bg-[#3D348B] text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#7678ED] transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
