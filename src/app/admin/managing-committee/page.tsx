"use client";

import { useEffect, useState } from "react";
import { 
  Plus, Pencil, Trash2, X, MoveUp, MoveDown, Save, 
  Search, Users, RefreshCw, AlertCircle, CheckCircle2,
  Upload, Image as ImageIcon, User, Loader2
} from "lucide-react";

type Teacher = {
  _id?: string;
  name: string;
  designation: string;
  image?: string;
  sortOrder?: number;
};

export default function AdminManagingCommitteePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState<{ name: string; designation: string; image: string }>({
    name: "",
    designation: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

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
    setEditingTeacher(null);
    setForm({ name: "", designation: "", image: "" });
    setSelectedFile(null);
    setPreviewSrc("");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(teacher: Teacher) {
    setEditingTeacher(teacher);
    setForm({ name: teacher.name, designation: teacher.designation, image: teacher.image || "" });
    setSelectedFile(null);
    setPreviewSrc(teacher.image || "");
    setError("");
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
    }
  }

  async function uploadSelectedFile(teacherName: string) {
    if (!selectedFile) return "";
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("page", "managing-committee");
      formData.set("section", "managing-committee");
      formData.set("title", teacherName || "Staff Member");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Image upload failed.");
      }
      return String(data.upload?.src ?? "");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(teacher: Teacher) {
    const confirmed = window.confirm(`Are you sure you want to delete ${teacher.name}?`);
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch("/api/admin/teachers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teacher._id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete teacher.");
      }
      setSuccess(`Successfully deleted ${teacher.name}`);
      fetchTeachers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete member.";
      setError(message);
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === teachers.length - 1) return;

    const swapWithIndex = direction === "up" ? index - 1 : index + 1;
    const newTeachers = [...teachers];
    
    const temp = newTeachers[index];
    newTeachers[index] = newTeachers[swapWithIndex];
    newTeachers[swapWithIndex] = temp;

    setTeachers(newTeachers);
    setSuccess("Roster order modified. Click 'Save Roster Order' to persist!");
  }

  async function handleSaveModal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim()) {
      setError("Please fill out both Name and Designation fields.");
      return;
    }

    try {
      setError("");
      let imageUrl = form.image || "";
      if (selectedFile) {
        imageUrl = await uploadSelectedFile(form.name.trim());
      }

      const payload = {
        id: editingTeacher?._id,
        _id: editingTeacher?._id,
        name: form.name.trim(),
        designation: form.designation.trim(),
        image: imageUrl,
      };

      const response = await fetch("/api/admin/teachers", {
        method: editingTeacher ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save teacher.");
      }

      setSuccess(editingTeacher ? `Updated ${form.name.trim()}` : `Added ${form.name.trim()}`);
      setModalOpen(false);
      fetchTeachers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save member entry.";
      setError(message);
    }
  }

  async function handleSaveOrder() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/teachers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teachers),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save teacher order.");
      }

      setSuccess("Successfully updated teacher roster order in MongoDB!");
      fetchTeachers();
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
              MongoDB Database
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[10px] font-mono text-gray-500">Live MongoDB Roster</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-montserrat">
            Managing Committee Roster
          </h1>
          <p className="text-xs text-[#94A3B8] font-semibold">
            Add staff members and upload profile photos directly to MongoDB database.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button 
            onClick={fetchTeachers}
            className="p-2.5 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#374151]/50 rounded-xl transition-all text-[#94A3B8] hover:text-white"
            title="Reload from database"
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
            onClick={handleSaveOrder}
            disabled={saving || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7678ED] hover:bg-[#6365D1] disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <Save size={14} />
            {saving ? "Saving order..." : "Save Roster Order"}
          </button>
        </div>

        {/* Table/List Roster */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F7B801] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-gray-500">Loading roster from database...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#1F2937]/50 rounded-xl">
            <Users className="mx-auto text-gray-600 mb-3" size={32} />
            <p className="text-sm font-bold text-white">No members in database</p>
            <p className="text-xs text-gray-500 mt-1">Click "Add Member" to create your first teacher entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1F2937]/50 bg-[#07090E]/60">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1F2937]/60 bg-[#0D1321]/80 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  <th className="px-4 py-4 w-10 text-center">#</th>
                  <th className="px-4 py-4 w-14 text-center">Photo</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Designation</th>
                  <th className="px-5 py-4 w-28 text-center">Ordering</th>
                  <th className="px-5 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/40 text-xs font-medium text-white/90">
                {filteredTeachers.map((teacher, idx) => {
                  return (
                    <tr key={teacher._id || idx} className="hover:bg-[#111827]/25 transition-all">
                      <td className="px-4 py-3.5 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                      <td className="px-4 py-3.5 text-center">
                        {teacher.image ? (
                          <img 
                            src={teacher.image} 
                            alt={teacher.name} 
                            className="w-10 h-10 rounded-full object-cover object-top border border-[#374151] mx-auto shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1F2937]/80 border border-[#374151]/50 flex items-center justify-center text-gray-500 mx-auto">
                            <User size={18} />
                          </div>
                        )}
                      </td>
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
                            onClick={() => openEditModal(teacher)}
                            className="p-2 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                            title="Edit Member"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher)}
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
          <div className="bg-[#0A0E17] border border-[#1F2937] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-[#1F2937]/60 bg-[#0B0F19] flex justify-between items-center">
              <h3 className="font-montserrat uppercase font-black text-sm tracking-wide text-white">
                {editingTeacher ? "Edit Roster Entry" : "Add Roster Entry"}
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

              {/* Staff Image Upload Section */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Staff Photo
                </label>
                
                <div className="flex gap-4 items-center bg-[#111827]/40 border border-[#1F2937] p-3.5 rounded-xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0E17] border border-[#374151]/50 flex items-center justify-center shrink-0">
                    {previewSrc ? (
                      <img src={previewSrc} alt="Preview" className="w-full h-full object-cover object-top" />
                    ) : form.image ? (
                      <img src={form.image} alt="Current" className="w-full h-full object-cover object-top" />
                    ) : (
                      <ImageIcon className="text-gray-600" size={24} />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <label className="inline-flex items-center gap-2 bg-[#1F2937] hover:bg-[#374151] text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-[#374151]/60">
                      <Upload size={14} />
                      <span>{selectedFile ? selectedFile.name : "Upload Photo"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>

                    {(previewSrc || form.image) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewSrc("");
                          setForm(prev => ({ ...prev, image: "" }));
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 block font-semibold"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 font-mono">Or paste Image URL directly:</span>
                  <input
                    type="text"
                    value={form.image || ""}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, image: e.target.value }));
                      setPreviewSrc(e.target.value);
                    }}
                    placeholder="https://... or /uploads/..."
                    className="w-full bg-[#111827]/40 border border-[#1F2937]/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] font-mono"
                  />
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
                  disabled={uploading}
                  className="flex-1 bg-[#F7B801] hover:bg-[#E5AA00] disabled:bg-amber-600 text-[#0A0E17] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : editingTeacher ? (
                    "Save Member"
                  ) : (
                    "Create Member"
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
