"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Award } from "lucide-react";

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

export default function AdminInvestiturePage() {
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

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/cabinet", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch cabinet members.");
      }
      setItems(data as CabinetMember[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch cabinet members.";
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
      formData.set("page", "investiture");
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
      await fetchItems();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Delete failed.";
      setError(message);
    }
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-[#0b1738]">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7678ED]">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-[#3D348B] mt-2">Cabinet Management</h1>
            <p className="text-sm text-slate-500 mt-2">Add, edit, and delete Student Cabinet portfolios for the Investiture Ceremony.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#3D348B] text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#7678ED] transition-colors"
          >
            <Plus size={16} />
            Add Cabinet Member
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-red-500">{error}</p> : null}
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500/70 border-b border-slate-100">
                <th className="py-3 pr-4 font-black">Image</th>
                <th className="py-3 pr-4 font-black">Name</th>
                <th className="py-3 pr-4 font-black">Role / Portfolio</th>
                <th className="py-3 pr-4 font-black">Sort Order</th>
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
                    No cabinet members found. Click "Add Cabinet Member" to populate.
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
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors"
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
      </section>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 text-[#0b1738]">
            <div className="px-6 py-5 bg-[#3D348B] text-white flex items-center justify-between">
              <h3 className="text-lg font-black tracking-wide">
                {editingId ? "Edit Cabinet Member" : "Create Cabinet Member"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ms. Rajbala Chouhan"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Role / Portfolio
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head Girl"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Direct Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="/uploads/..."
                    value={form.image}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, image: e.target.value }));
                      setPreviewSrc(e.target.value);
                      setSelectedFile(null);
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Upload Photo (Overrides URL)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 h-24 border-2 border-dashed border-slate-200 hover:border-[#7678ED] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-50/20 transition-all select-none">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {selectedFile ? selectedFile.name : "Choose Image File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {previewSrc && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewSrc("");
                          setSelectedFile(null);
                          setForm((p) => ({ ...p, image: "" }));
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 flex items-center justify-center text-white text-xs hover:bg-black"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 h-11 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 h-11 rounded-xl bg-[#3D348B] hover:bg-[#7678ED] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {(saving || uploading) && <Loader2 size={14} className="animate-spin" />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
