"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, Bus, Save, AlertTriangle, CheckCircle2 } from "lucide-react";

type RouteItem = {
  _id: string;
  routeNo: string;
  driver: string;
  phone: string;
  stops: string[];
  timing: string;
};

type RouteForm = {
  routeNo: string;
  driver: string;
  phone: string;
  stopsText: string;
  timing: string;
};

const initialForm: RouteForm = {
  routeNo: "",
  driver: "",
  phone: "",
  stopsText: "",
  timing: "",
};

export default function AdminTransportPage() {
  const [items, setItems] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RouteForm>(initialForm);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/transport", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch routes.");
      }
      setItems(data as RouteItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch routes.";
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

  function openEditModal(item: RouteItem) {
    setEditingId(item._id);
    setForm({
      routeNo: item.routeNo ?? "",
      driver: item.driver ?? "",
      phone: item.phone ?? "",
      stopsText: item.stops ? item.stops.join(", ") : "",
      timing: item.timing ?? "",
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const stopsList = form.stopsText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        id: editingId,
        routeNo: form.routeNo,
        driver: form.driver,
        phone: form.phone,
        timing: form.timing,
        stops: stopsList,
      };

      const response = await fetch("/api/admin/transport", {
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
    const confirmed = window.confirm("Delete this transport route?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/transport", {
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
              <Bus className="text-accent" />
              Transport Routes
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            <Plus size={16} />
            Add New Route
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pr-4">Route No.</th>
                <th className="py-3 pr-4">Driver Details</th>
                <th className="py-3 pr-4">Timing</th>
                <th className="py-3 pr-4">Stops</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    Loading routes...
                  </td>
                </tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-5 text-gray-400" colSpan={5}>
                    No routes found. Click &quot;Add New Route&quot; to begin.
                  </td>
                </tr>
              ) : null}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 align-top hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4 font-bold text-primary">
                    {item.routeNo}
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-800">{item.driver}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.phone}</p>
                  </td>
                  <td className="py-4 pr-4 text-sm font-bold text-slate-600">
                    {item.timing}
                  </td>
                  <td className="py-4 pr-4 max-w-xs">
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                      {item.stops ? item.stops.join(", ") : ""}
                    </p>
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
                  {editingId ? "Edit Transport Route" : "Add New Transport Route"}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Enter route path and driver information
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
                    Route No. *
                  </label>
                  <input
                    value={form.routeNo}
                    onChange={(event) => setForm((prev) => ({ ...prev, routeNo: event.target.value }))}
                    required
                    placeholder="e.g. Route 01"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Operating Timings *
                  </label>
                  <input
                    value={form.timing}
                    onChange={(event) => setForm((prev) => ({ ...prev, timing: event.target.value }))}
                    required
                    placeholder="e.g. 07:15 AM - 02:30 PM"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Driver Name *
                  </label>
                  <input
                    value={form.driver}
                    onChange={(event) => setForm((prev) => ({ ...prev, driver: event.target.value }))}
                    required
                    placeholder="e.g. Rajesh Singh"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                    Driver Mobile No. *
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                    placeholder="e.g. +91 94141 48001"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary/60 ml-2">
                  Stops List (comma-separated)
                </label>
                <textarea
                  value={form.stopsText}
                  onChange={(event) => setForm((prev) => ({ ...prev, stopsText: event.target.value }))}
                  rows={4}
                  placeholder="e.g. Sojat Road, Sojat City, Bilara"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-accent focus:outline-none transition-all resize-none"
                />
                <span className="text-[10px] text-gray-400 font-semibold ml-2">
                  Separate each stop with a comma (,)
                </span>
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
                {saving ? "Saving..." : editingId ? "Update Route" : "Publish Route"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
