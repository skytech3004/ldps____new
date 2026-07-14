"use client";

import { useEffect, useState } from "react";
import { 
  Plus, Pencil, Trash2, X, MoveUp, MoveDown, Save, 
  Search, Users, RefreshCw, AlertCircle, CheckCircle2 
} from "lucide-react";

type Teacher = {
  name: string;
  designation: string;
};

export default function AdminManagingCommitteePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Teacher>({ name: "", designation: "" });

  async function fetchTeachers() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await fetch("/api/admin/teachers", { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to fetch teacher roster.");
      }
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load teachers.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Update filtered list when teachers or search query change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTeachers(teachers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTeachers(
        teachers.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.designation.toLowerCase().includes(query)
        )
      );
    }
  }, [teachers, searchQuery]);

  function openAddModal() {
    setEditingIndex(null);
    setForm({ name: "", designation: "" });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(index: number) {
    // Find index in original teachers array
    const originalIndex = teachers.findIndex(
      (t) => t.name === filteredTeachers[index].name && t.designation === filteredTeachers[index].designation
    );
    setEditingIndex(originalIndex);
    setForm({ ...teachers[originalIndex] });
    setError("");
    setModalOpen(true);
  }

  function handleDelete(index: number) {
    const originalIndex = teachers.findIndex(
      (t) => t.name === filteredTeachers[index].name && t.designation === filteredTeachers[index].designation
    );
    const confirmed = window.confirm(`Are you sure you want to remove ${teachers[originalIndex].name}?`);
    if (!confirmed) return;

    const newTeachers = [...teachers];
    newTeachers.splice(originalIndex, 1);
    setTeachers(newTeachers);
    setSuccess("Roster list updated locally. Don't forget to click 'Save Changes' to apply!");
  }

  function handleMove(index: number, direction: "up" | "down") {
    // Find original index
    const originalIndex = teachers.findIndex(
      (t) => t.name === filteredTeachers[index].name && t.designation === filteredTeachers[index].designation
    );

    if (direction === "up" && originalIndex === 0) return;
    if (direction === "down" && originalIndex === teachers.length - 1) return;

    const swapWithIndex = direction === "up" ? originalIndex - 1 : originalIndex + 1;
    const newTeachers = [...teachers];
    
    // Swap
    const temp = newTeachers[originalIndex];
    newTeachers[originalIndex] = newTeachers[swapWithIndex];
    newTeachers[swapWithIndex] = temp;

    setTeachers(newTeachers);
    setSuccess("Roster order updated locally. Click 'Save Changes' to write it to teacher.txt!");
  }

  function handleSaveModal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim()) {
      setError("Please fill out both Name and Designation fields.");
      return;
    }

    const newTeachers = [...teachers];
    if (editingIndex !== null) {
      newTeachers[editingIndex] = form;
      setSuccess("Modified entry locally. Click 'Save Changes' to update the source file.");
    } else {
      newTeachers.push(form);
      setSuccess("Added new entry locally. Click 'Save Changes' to update the source file.");
    }

    setTeachers(newTeachers);
    setModalOpen(false);
  }

  async function handleSaveChanges() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teachers),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save teacher roster.");
      }

      setSuccess("Successfully updated teacher.txt and synced with the live website!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes.";
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
              File Integration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[10px] font-mono text-gray-500">teacher.txt synced</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-montserrat">
            Managing Committee Roster
          </h1>
          <p className="text-xs text-[#94A3B8] font-semibold">
            Manage names and designations rendered on the Academic Excellence page. Updates are written directly to `teacher.txt`.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button 
            onClick={fetchTeachers}
            className="p-2.5 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#374151]/50 rounded-xl transition-all text-[#94A3B8] hover:text-white"
            title="Reload from source file"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#E5AA00] text-[#0A0E17] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            Add Member
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

      {/* Main Board Workspace */}
      <div className="bg-[#0A0E17]/60 border border-[#1F2937]/50 rounded-2xl overflow-hidden p-6 space-y-4">
        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by name or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827]/40 border border-[#1F2937]/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
            />
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={saving || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7678ED] hover:bg-[#6365D1] disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <Save size={14} />
            {saving ? "Saving changes..." : "Save Changes to File"}
          </button>
        </div>

        {/* Table/List Roster */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F7B801] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-gray-500">Parsing teacher.txt file...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#1F2937]/50 rounded-xl">
            <Users className="mx-auto text-gray-600 mb-3" size={32} />
            <p className="text-sm font-bold text-white">No members found</p>
            <p className="text-xs text-gray-500 mt-1">Try resetting the filter or adding a new teacher entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1F2937]/50 bg-[#07090E]/60">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1F2937]/60 bg-[#0D1321]/80 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  <th className="px-5 py-4 w-12 text-center">#</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Designation</th>
                  <th className="px-5 py-4 w-28 text-center">Ordering</th>
                  <th className="px-5 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/40 text-xs font-medium text-white/90">
                {filteredTeachers.map((teacher, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-[#111827]/25 transition-all">
                      <td className="px-5 py-3.5 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                      <td className="px-5 py-3.5 font-bold font-montserrat uppercase tracking-tight text-white">{teacher.name}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 bg-[#1F2937]/35 border border-[#374151]/40 rounded-lg text-[10px] font-bold text-amber-400 font-mono">
                          {teacher.designation}
                        </span>
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
                            disabled={idx === filteredTeachers.length - 1 || searchQuery !== ""}
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
                            onClick={() => openEditModal(idx)}
                            className="p-2 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                            title="Edit Member"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E17] border border-[#1F2937] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-[#1F2937]/60 bg-[#0B0F19] flex justify-between items-center">
              <h3 className="font-montserrat uppercase font-black text-sm tracking-wide text-white">
                {editingIndex !== null ? "Edit Roster Entry" : "Add Roster Entry"}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-left">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg flex gap-2 items-center text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Teacher Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ms. Jyoti Nath"
                  className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => setForm(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="e.g. PGT (Biology) & V.P."
                  className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#374151]/50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#F7B801] hover:bg-[#E5AA00] text-[#0A0E17] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                >
                  {editingIndex !== null ? "Apply Changes" : "Add to List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
