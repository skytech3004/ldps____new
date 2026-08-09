"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, Phone, Save, AlertTriangle } from "lucide-react";

type ContactItem = {
  _id: string;
  department: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  sortOrder: number;
  isActive: boolean;
};

type ContactForm = {
  department: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  sortOrder: string;
  isActive: boolean;
};

const initialForm: ContactForm = {
  department: "",
  contactName: "",
  designation: "",
  phone: "",
  email: "",
  sortOrder: "0",
  isActive: true,
};

export default function AdminContactPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>(initialForm);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/important-contacts?all=true", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch contacts.");
      }
      setItems(data as ContactItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch contacts.";
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
    setModalOpen(true);
  }

  function openEditModal(item: ContactItem) {
    setEditingId(item._id);
    setForm({
      department: item.department ?? "",
      contactName: item.contactName ?? "",
      designation: item.designation ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
      sortOrder: String(item.sortOrder ?? 0),
      isActive: item.isActive !== false,
    });
    setError("");
    setModalOpen(true);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        department: form.department,
        contactName: form.contactName,
        designation: form.designation,
        phone: form.phone,
        email: form.email,
        sortOrder: Number(form.sortOrder || 0),
        isActive: form.isActive,
      };

      const response = await fetch("/api/admin/important-contacts", {
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
    const confirmed = window.confirm("Delete this important contact?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/important-contacts", {
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
              <Phone className="text-accent" />
              Important Contacts
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage department contacts shown on the Contact page under &quot;Important Contacts&quot;.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add Contact
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error && !modalOpen ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Department</th>
                <th className="py-3 pr-4">Contact Person</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Sort</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={7}>
                    Loading contacts...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={7}>
                    No contacts found. Click &quot;Add Contact&quot; to begin.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-top hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-primary">{item.department}</p>
                    {item.designation ? (
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.designation}</p>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4 text-sm font-bold text-slate-700">{item.contactName || "—"}</td>
                  <td className="py-4 pr-4 text-sm font-semibold text-slate-600">{item.phone || "—"}</td>
                  <td className="py-4 pr-4 text-sm font-semibold text-slate-600">{item.email || "—"}</td>
                  <td className="py-4 pr-4 text-sm font-bold text-slate-500">{item.sortOrder}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
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
                  {editingId ? "Edit Contact" : "Add Important Contact"}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Department lines shown on the public contact page
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Department *
                  </label>
                  <input
                    value={form.department}
                    onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                    required
                    placeholder="e.g. Admissions"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Contact Person
                  </label>
                  <input
                    value={form.contactName}
                    onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))}
                    placeholder="e.g. Admissions Office"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Designation</label>
                <input
                  value={form.designation}
                  onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
                  placeholder="e.g. School Admissions Office"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="e.g. +91 6377204218"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="e.g. admissions@school.com"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">Status</label>
                  <label className="flex items-center gap-3 h-[50px] px-4 border-2 border-gray-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-bold text-primary">Show on contact page</span>
                  </label>
                </div>
              </div>

              {error ? (
                <p className="text-sm font-semibold text-error flex items-center gap-2 bg-error/5 p-3 rounded-xl border border-error/10">
                  <AlertTriangle size={16} className="shrink-0" />
                  {error}
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
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 disabled:opacity-70 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : editingId ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
