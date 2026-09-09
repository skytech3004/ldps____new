"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pencil, Plus, Save, Trash2, X } from "lucide-react";

type SchoolFee = {
  _id: string;
  classLevel: string;
  annualFee: string;
  installment: string;
  sortOrder: number;
};

const emptyFee = { classLevel: "", annualFee: "", installment: "", sortOrder: 0 };

export default function AdminSchoolFeesPage() {
  const [fees, setFees] = useState<SchoolFee[]>([]);
  const [form, setForm] = useState(emptyFee);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFees() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/school-fees", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load school fees.");
      setFees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load school fees.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyFee, sortOrder: fees.length + 1 });
    setIsModalOpen(true);
  }

  function openEdit(fee: SchoolFee) {
    setEditingId(fee._id);
    setForm({
      classLevel: fee.classLevel,
      annualFee: fee.annualFee,
      installment: fee.installment,
      sortOrder: fee.sortOrder,
    });
    setIsModalOpen(true);
  }

  async function saveFee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/school-fees", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save school fee.");
      setIsModalOpen(false);
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save school fee.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFee(id: string) {
    if (!window.confirm("Delete this school fee row?")) return;
    try {
      setError("");
      const response = await fetch("/api/school-fees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete school fee.");
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete school fee.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Academics</p>
          <h1 className="text-4xl font-black mt-2">School Fee Structure</h1>
          <p className="text-white/70 mt-2">Manage the academic-session annual fee and two-installment amounts shown to parents.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/fee-structure" target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white">
            <ArrowUpRight size={14} />
            View Public Page
          </Link>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
            <Plus size={16} />
            Add Fee Row
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">{error}</div>}

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f234f]/80">
        {loading ? (
          <div className="py-16 text-center text-white/60 font-bold">Loading school fee structure...</div>
        ) : (
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/60">
              <tr>
                <th className="px-6 py-4">Class / Level</th>
                <th className="px-6 py-4">Annual Fee</th>
                <th className="px-6 py-4">Installment (2x)</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {fees.map((fee) => (
                <tr key={fee._id} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-bold text-white">{fee.classLevel}</td>
                  <td className="px-6 py-4 text-white/80">{fee.annualFee}</td>
                  <td className="px-6 py-4 text-[#F7B801] font-bold">{fee.installment}</td>
                  <td className="px-6 py-4 text-white/60">{fee.sortOrder}</td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(fee)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" aria-label={`Edit ${fee.classLevel}`}><Pencil size={14} /></button>
                    <button onClick={() => deleteFee(fee._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300" aria-label={`Delete ${fee.classLevel}`}><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{editingId ? "Edit School Fee" : "Add School Fee"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80" aria-label="Close"><X size={16} /></button>
            </div>
            <form onSubmit={saveFee} className="p-6 space-y-5 text-white">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">Class / Academic Level *
                <input required value={form.classLevel} onChange={(event) => setForm({ ...form, classLevel: event.target.value })} placeholder="Class VI" className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]" />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">Annual Fee *
                  <input required value={form.annualFee} onChange={(event) => setForm({ ...form, annualFee: event.target.value })} placeholder="₹30,800" className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]" />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">Installment (2x) *
                  <input required value={form.installment} onChange={(event) => setForm({ ...form, installment: event.target.value })} placeholder="₹15,400" className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]" />
                </label>
              </div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">Sort Position
                <input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]" />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 border border-white/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"><Save size={14} />{saving ? "Saving..." : "Save Fee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
