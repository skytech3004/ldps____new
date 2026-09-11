"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bus, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";

type BusFee = {
  _id: string;
  sNo: number;
  place: string;
  fee: string;
  sortOrder: number;
};

const emptyBusFee = { sNo: 1, place: "", fee: "", sortOrder: 0 };

export default function AdminBusFeesPage() {
  const [fees, setFees] = useState<BusFee[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyBusFee);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFees() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/bus-fees", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load bus fees.");
      setFees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bus fees.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  function openCreate() {
    setEditingId(null);
    const nextSNo = fees.length > 0 ? Math.max(...fees.map((f) => f.sNo || 0)) + 1 : 1;
    setForm({ ...emptyBusFee, sNo: nextSNo, sortOrder: nextSNo });
    setIsModalOpen(true);
  }

  function openEdit(fee: BusFee) {
    setEditingId(fee._id);
    setForm({
      sNo: fee.sNo,
      place: fee.place,
      fee: fee.fee,
      sortOrder: fee.sortOrder ?? fee.sNo,
    });
    setIsModalOpen(true);
  }

  async function saveFee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/bus-fees", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save bus fee.");
      setIsModalOpen(false);
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save bus fee.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFee(id: string, place: string) {
    if (!window.confirm(`Delete bus fee row for "${place}"?`)) return;
    try {
      setError("");
      const response = await fetch("/api/bus-fees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete bus fee.");
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bus fee.");
    }
  }

  const filteredFees = fees.filter((item) =>
    item.place.toLowerCase().includes(search.toLowerCase()) ||
    item.fee.toLowerCase().includes(search.toLowerCase()) ||
    String(item.sNo).includes(search)
  );

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.4em] text-[#F7B801] font-black uppercase">Transport</span>
            <span className="px-2 py-0.5 bg-[#F7B801]/20 text-[#F7B801] rounded-full text-[10px] font-bold">
              {fees.length} Destinations
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mt-2 flex items-center gap-3 text-white">
            <Bus className="text-[#F7B801]" />
            Bus Fee Schedule
          </h1>
          <p className="text-white/70 mt-2 text-xs md:text-sm">
            Manage destination bus transport fees shown to parents on the public fee structure page.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/fee-structure"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white"
          >
            <ArrowUpRight size={14} />
            View Public Page
          </Link>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Destination Fee
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by destination place or amount..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#0f234f]/80 border border-white/15 rounded-2xl text-sm text-white font-medium placeholder-white/40 focus:outline-none focus:border-[#F7B801] transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f234f]/80">
        {loading ? (
          <div className="py-16 text-center text-white/60 font-bold">Loading bus fee schedule...</div>
        ) : filteredFees.length === 0 ? (
          <div className="py-16 text-center text-white/60 font-bold">
            {search ? "No destinations match your search." : "No bus fee records found. Click 'Add Destination Fee' to create one."}
          </div>
        ) : (
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/60">
              <tr>
                <th className="px-6 py-4">S.No</th>
                <th className="px-6 py-4">Place / Destination</th>
                <th className="px-6 py-4 text-right">Bus Fee (₹)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredFees.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white/60 font-mono text-xs">{item.sNo}</td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{item.place}</td>
                  <td className="px-6 py-4 text-right font-black text-[#F7B801] text-base">{item.fee}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        aria-label={`Edit ${item.place}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteFee(item._id, item.place)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
                        aria-label={`Delete ${item.place}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Bus Fee" : "Add Bus Fee Destination"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveFee} className="p-6 space-y-5 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                  S.No *
                  <input
                    type="number"
                    required
                    value={form.sNo}
                    onChange={(e) => setForm({ ...form, sNo: Number(e.target.value) })}
                    className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60 md:col-span-2">
                  Place / Destination *
                  <input
                    required
                    value={form.place}
                    onChange={(e) => setForm({ ...form, place: e.target.value })}
                    placeholder="e.g. Falna"
                    className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </label>
              </div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Bus Fee (₹) *
                <input
                  required
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  placeholder="e.g. ₹22,700"
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-white/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
