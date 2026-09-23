"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, MoveUp, MoveDown, Save,
  Search, RefreshCw, AlertCircle, CheckCircle2,
  Users, Eye, EyeOff, Loader2, Sparkles
} from "lucide-react";

type Club = {
  _id?: string;
  name: string;
  sortOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [submitting, setSubmitting] = useState(false);

  async function fetchClubs() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/clubs", { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to fetch clubs.");
      }
      const data = await response.json();
      setClubs(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load clubs.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredClubs(clubs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClubs(
        clubs.filter((c) => c.name.toLowerCase().includes(query))
      );
    }
  }, [clubs, searchQuery]);

  function openAddModal() {
    setEditingClub(null);
    setFormName("");
    const maxOrder = clubs.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);
    setFormOrder(maxOrder + 1);
    setFormStatus("active");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(club: Club) {
    setEditingClub(club);
    setFormName(club.name);
    setFormOrder(club.sortOrder);
    setFormStatus(club.status);
    setError("");
    setModalOpen(true);
  }

  async function handleDelete(club: Club) {
    if (!window.confirm(`Are you sure you want to delete "${club.name}"?`)) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch("/api/admin/clubs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: club._id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete club.");
      }
      setSuccess(`Successfully deleted "${club.name}".`);
      fetchClubs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete club.";
      setError(message);
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === clubs.length - 1) return;

    const swapWithIndex = direction === "up" ? index - 1 : index + 1;
    const newClubs = [...clubs];

    const temp = newClubs[index];
    newClubs[index] = newClubs[swapWithIndex];
    newClubs[swapWithIndex] = temp;

    // Update sortOrder values to match new positions
    newClubs.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });

    setClubs(newClubs);
    setSuccess("Display order changed. Click 'Save Roster Order' to persist changes!");
  }

  async function handleToggleStatus(club: Club) {
    try {
      const newStatus = club.status === "active" ? "inactive" : "active";
      const response = await fetch("/api/admin/clubs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: club._id, status: newStatus }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update status.");
      }
      setSuccess(`Updated status of "${club.name}" to ${newStatus}.`);
      fetchClubs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      setError(message);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Club name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        id: editingClub?._id,
        _id: editingClub?._id,
        name: formName.trim(),
        sortOrder: formOrder,
        status: formStatus,
      };

      const response = await fetch("/api/admin/clubs", {
        method: editingClub ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save club.");
      }

      setSuccess(editingClub ? `Updated "${formName.trim()}"` : `Added "${formName.trim()}"`);
      setModalOpen(false);
      fetchClubs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save club entry.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveOrder() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/clubs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clubs),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save order.");
      }

      setSuccess("Successfully updated display order in MongoDB database!");
      fetchClubs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save order.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 text-[#E2E8F0] text-left">
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1F2937]/50 bg-[#0A0E17] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7B801]/5 via-[#7678ED]/5 to-transparent pointer-events-none"></div>
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-500/10 text-amber-500 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
              Co-Scholastic
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[10px] font-mono text-gray-500">Live Clubs Directory</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-montserrat">
            Clubs & Societies
          </h1>
          <p className="text-xs text-[#94A3B8] font-semibold">
            Manage student clubs, display order, and public visibility on the Co-Scholastic page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={fetchClubs}
            className="p-2.5 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#374151]/50 rounded-xl transition-all text-[#94A3B8] hover:text-white cursor-pointer"
            title="Reload from database"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#E5AA00] text-[#0A0E17] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus size={14} strokeWidth={3} />
            Add Club
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl flex gap-3 items-start">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <p className="text-xs font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
          <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
          <p className="text-xs font-semibold leading-relaxed">{success}</p>
        </div>
      )}

      {/* Main Table Workspace */}
      <div className="bg-[#0A0E17]/60 border border-[#1F2937]/50 rounded-2xl overflow-hidden p-6 space-y-4">
        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by club name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827]/40 border border-[#1F2937]/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
            />
          </div>

          <button
            onClick={handleSaveOrder}
            disabled={saving || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7678ED] hover:bg-[#6365D1] disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <Save size={14} />
            {saving ? "Saving order..." : "Save Roster Order"}
          </button>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F7B801] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-gray-500">Loading clubs directory...</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#1F2937]/50 rounded-xl">
            <Sparkles className="mx-auto text-gray-600 mb-3" size={32} />
            <p className="text-sm font-bold text-white">No clubs found</p>
            <p className="text-xs text-gray-500 mt-1">Click "Add Club" to create your first club entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1F2937]/50 bg-[#07090E]/60">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1F2937]/60 bg-[#0D1321]/80 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  <th className="px-4 py-4 w-16 text-center">S.No.</th>
                  <th className="px-5 py-4">Club Name</th>
                  <th className="px-5 py-4 w-28 text-center">Display Order</th>
                  <th className="px-5 py-4 w-28 text-center">Status</th>
                  <th className="px-5 py-4 w-28 text-center">Reorder</th>
                  <th className="px-5 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/40 text-xs font-medium text-white/90">
                {filteredClubs.map((club, idx) => (
                  <tr key={club._id || idx} className="hover:bg-[#111827]/25 transition-all">
                    <td className="px-4 py-3.5 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold font-montserrat uppercase tracking-tight text-white">{club.name}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-amber-400 font-bold">
                      {club.sortOrder}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(club)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          club.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-gray-500/15 text-gray-400 border border-gray-500/30 hover:bg-gray-500/25"
                        }`}
                      >
                        {club.status === "active" ? <Eye size={12} /> : <EyeOff size={12} />}
                        {club.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0 || searchQuery !== ""}
                          className="p-1.5 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-gray-500 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === filteredClubs.length - 1 || searchQuery !== ""}
                          className="p-1.5 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-gray-500 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(club)}
                          className="p-2 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                          title="Edit Club"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(club)}
                          className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Delete Club"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E17] border border-[#1F2937] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1F2937]/60 bg-[#0B0F19] flex justify-between items-center">
              <h3 className="font-montserrat uppercase font-black text-sm tracking-wide text-white">
                {editingClub ? "Edit Club Entry" : "Add New Club"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-left">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg flex gap-2 items-center text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Club Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. ROBOTICS & I.T. CLUB"
                  className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Display Order</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F7B801] transition-all font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "active" | "inactive")}
                    className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#374151]/50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#F7B801] hover:bg-[#E5AA00] disabled:bg-amber-600 text-[#0A0E17] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingClub ? (
                    "Update Club"
                  ) : (
                    "Create Club"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
