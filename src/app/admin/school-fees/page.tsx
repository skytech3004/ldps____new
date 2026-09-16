"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pencil, Plus, Save, Trash2, X, Sparkles, AlertCircle } from "lucide-react";

type SchoolFee = {
  _id: string;
  classLevel: string;
  annualFee: string;
  installment: string;
  sortOrder: number;
};

type AdmissionFee = {
  _id: string;
  category: string;
  feeAmount: string;
  note: string;
  sortOrder: number;
};

const emptySchoolFee = { classLevel: "", annualFee: "", installment: "", sortOrder: 0 };
const emptyAdmissionFee = {
  category: "",
  feeAmount: "",
  note: "Charged only once at the time of new admission into the school.",
  sortOrder: 0,
};

export default function AdminSchoolFeesPage() {
  const [activeTab, setActiveTab] = useState<"tuition" | "admission">("tuition");

  // School Fees state
  const [fees, setFees] = useState<SchoolFee[]>([]);
  const [schoolForm, setSchoolForm] = useState(emptySchoolFee);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  // Admission Fees state
  const [admissionFees, setAdmissionFees] = useState<AdmissionFee[]>([]);
  const [admissionForm, setAdmissionForm] = useState(emptyAdmissionFee);
  const [editingAdmissionId, setEditingAdmissionId] = useState<string | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);

  // Common UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFees() {
    try {
      setLoading(true);
      setError("");
      const [resSchool, resAdmission] = await Promise.all([
        fetch("/api/school-fees", { cache: "no-store" }),
        fetch("/api/admission-fees", { cache: "no-store" }),
      ]);

      const dataSchool = await resSchool.json();
      const dataAdmission = await resAdmission.json();

      if (!resSchool.ok) throw new Error(dataSchool.error || "Failed to load school fees.");
      if (!resAdmission.ok) throw new Error(dataAdmission.error || "Failed to load admission fees.");

      setFees(dataSchool);
      setAdmissionFees(dataAdmission);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fee structures.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  // --- School Fee Handlers ---
  function openCreateSchool() {
    setEditingSchoolId(null);
    setSchoolForm({ ...emptySchoolFee, sortOrder: fees.length + 1 });
    setIsSchoolModalOpen(true);
  }

  function openEditSchool(fee: SchoolFee) {
    setEditingSchoolId(fee._id);
    setSchoolForm({
      classLevel: fee.classLevel,
      annualFee: fee.annualFee,
      installment: fee.installment,
      sortOrder: fee.sortOrder,
    });
    setIsSchoolModalOpen(true);
  }

  async function saveSchoolFee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/school-fees", {
        method: editingSchoolId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...schoolForm, id: editingSchoolId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save school fee.");
      setIsSchoolModalOpen(false);
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save school fee.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSchoolFee(id: string) {
    if (!window.confirm("Delete this tuition fee entry?")) return;
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

  // --- Admission Fee Handlers ---
  function openCreateAdmission() {
    setEditingAdmissionId(null);
    setAdmissionForm({ ...emptyAdmissionFee, sortOrder: admissionFees.length + 1 });
    setIsAdmissionModalOpen(true);
  }

  function openEditAdmission(fee: AdmissionFee) {
    setEditingAdmissionId(fee._id);
    setAdmissionForm({
      category: fee.category,
      feeAmount: fee.feeAmount,
      note: fee.note || emptyAdmissionFee.note,
      sortOrder: fee.sortOrder,
    });
    setIsAdmissionModalOpen(true);
  }

  async function saveAdmissionFee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/admission-fees", {
        method: editingAdmissionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...admissionForm, id: editingAdmissionId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save admission fee.");
      setIsAdmissionModalOpen(false);
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save admission fee.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAdmissionFee(id: string) {
    if (!window.confirm("Delete this admission fee entry?")) return;
    try {
      setError("");
      const response = await fetch("/api/admission-fees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete admission fee.");
      await loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete admission fee.");
    }
  }

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-[#F7B801] font-black uppercase flex items-center gap-2">
            <Sparkles size={14} /> Academics & Fee Management
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 text-white">Fee Structure & Admissions</h1>
          <p className="text-white/70 mt-2 text-xs sm:text-sm">
            Manage annual session tuition fees, installment amounts, and one-time admission fee categories shown on <code className="text-[#F7B801] font-mono">/fee-structure</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/fee-structure"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white"
          >
            <ArrowUpRight size={14} />
            View Public /fee-structure Page
          </Link>
          {activeTab === "tuition" ? (
            <button
              onClick={openCreateSchool}
              className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              <Plus size={16} />
              Add Tuition Fee Row
            </button>
          ) : (
            <button
              onClick={openCreateAdmission}
              className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              <Plus size={16} />
              Add Admission Fee Entry
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab("tuition")}
          className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "tuition"
              ? "border-[#F7B801] text-[#F7B801] bg-white/5 rounded-t-xl"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          Annual Tuition Fees ({fees.length})
        </button>
        <button
          onClick={() => setActiveTab("admission")}
          className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "admission"
              ? "border-[#F7B801] text-[#F7B801] bg-white/5 rounded-t-xl"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          New Admissions Fee (One-Time) ({admissionFees.length})
        </button>
      </div>

      {/* TAB 1: TUITION FEES */}
      {activeTab === "tuition" && (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f234f]/80">
          {loading ? (
            <div className="py-16 text-center text-white/60 font-bold">Loading school fee structure...</div>
          ) : fees.length === 0 ? (
            <div className="py-16 text-center text-white/60 font-bold">No tuition fee rows found. Click &quot;Add Tuition Fee Row&quot; above.</div>
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
                  <tr key={fee._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{fee.classLevel}</td>
                    <td className="px-6 py-4 text-white/80">{fee.annualFee}</td>
                    <td className="px-6 py-4 text-[#F7B801] font-bold">{fee.installment}</td>
                    <td className="px-6 py-4 text-white/60">{fee.sortOrder}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditSchool(fee)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          aria-label={`Edit ${fee.classLevel}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteSchoolFee(fee._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
                          aria-label={`Delete ${fee.classLevel}`}
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
      )}

      {/* TAB 2: ADMISSION FEES (NEW ADMISSIONS ONLY - ONE-TIME) */}
      {activeTab === "admission" && (
        <div className="space-y-4">
          <div className="bg-[#112759]/40 border border-white/10 rounded-2xl p-4 text-xs text-white/80 font-medium">
            💡 <strong className="text-[#F7B801]">Note:</strong> Admission fees are one-time charges applicable only to new student admissions. They are displayed prominently in the &quot;New Admissions Only&quot; section of the <code className="text-[#F7B801]">/fee-structure</code> page.
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f234f]/80">
            {loading ? (
              <div className="py-16 text-center text-white/60 font-bold">Loading admission fees...</div>
            ) : admissionFees.length === 0 ? (
              <div className="py-16 text-center text-white/60 font-bold">No admission fee categories found. Click &quot;Add Admission Fee Entry&quot; to create one.</div>
            ) : (
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/60">
                  <tr>
                    <th className="px-6 py-4">Class Category / Level</th>
                    <th className="px-6 py-4">Admission Fee (One-Time)</th>
                    <th className="px-6 py-4">Description / Note</th>
                    <th className="px-6 py-4">Sort Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {admissionFees.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{item.category}</td>
                      <td className="px-6 py-4 text-[#F7B801] font-black text-base">{item.feeAmount}</td>
                      <td className="px-6 py-4 text-white/70 text-xs max-w-md truncate">{item.note}</td>
                      <td className="px-6 py-4 text-white/60">{item.sortOrder}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditAdmission(item)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            aria-label={`Edit ${item.category}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteAdmissionFee(item._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
                            aria-label={`Delete ${item.category}`}
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
        </div>
      )}

      {/* MODAL 1: SCHOOL FEE FORM */}
      {isSchoolModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingSchoolId ? "Edit School Fee Row" : "Add School Fee Row"}
              </h2>
              <button
                onClick={() => setIsSchoolModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveSchoolFee} className="p-6 space-y-5 text-white">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Class / Academic Level *
                <input
                  required
                  value={schoolForm.classLevel}
                  onChange={(e) => setSchoolForm({ ...schoolForm, classLevel: e.target.value })}
                  placeholder="Class VI"
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                  Annual Fee *
                  <input
                    required
                    value={schoolForm.annualFee}
                    onChange={(e) => setSchoolForm({ ...schoolForm, annualFee: e.target.value })}
                    placeholder="₹30,800"
                    className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                  Installment (2x) *
                  <input
                    required
                    value={schoolForm.installment}
                    onChange={(e) => setSchoolForm({ ...schoolForm, installment: e.target.value })}
                    placeholder="₹15,400"
                    className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </label>
              </div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Sort Position
                <input
                  type="number"
                  value={schoolForm.sortOrder}
                  onChange={(e) => setSchoolForm({ ...schoolForm, sortOrder: Number(e.target.value) })}
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSchoolModalOpen(false)}
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
                  {saving ? "Saving..." : "Save Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMISSION FEE FORM */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingAdmissionId ? "Edit One-Time Admission Fee" : "Add One-Time Admission Fee"}
              </h2>
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveAdmissionFee} className="p-6 space-y-5 text-white">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Class Category / Level Range *
                <input
                  required
                  value={admissionForm.category}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, category: e.target.value })}
                  placeholder="e.g. Nursery to Class V"
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>

              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Admission Fee Amount (One-Time) *
                <input
                  required
                  value={admissionForm.feeAmount}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, feeAmount: e.target.value })}
                  placeholder="e.g. ₹2,000"
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>

              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Note / Subtext
                <input
                  value={admissionForm.note}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, note: e.target.value })}
                  placeholder="Charged only once at the time of new admission into the school."
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>

              <label className="block text-[10px] font-black uppercase tracking-wider text-white/60">
                Sort Position
                <input
                  type="number"
                  value={admissionForm.sortOrder}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, sortOrder: Number(e.target.value) })}
                  className="mt-2 w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdmissionModalOpen(false)}
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
                  {saving ? "Saving..." : "Save Admission Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
