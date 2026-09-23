"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, MoveUp, MoveDown, Save,
  Search, RefreshCw, AlertCircle, CheckCircle2,
  Upload, Image as ImageIcon, Eye, EyeOff, Loader2, Sparkles
} from "lucide-react";
import OptimizedMemberImage from "@/components/OptimizedMemberImage";

type Skill = {
  _id?: string;
  name: string;
  image?: string;
  sortOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  async function fetchSkills() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/skills", { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to fetch skill courses.");
      }
      const data = await response.json();
      setSkills(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load skill courses.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSkills(skills);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSkills(
        skills.filter((s) => s.name.toLowerCase().includes(query))
      );
    }
  }, [skills, searchQuery]);

  function openAddModal() {
    setEditingSkill(null);
    setFormName("");
    setFormImage("");
    const maxOrder = skills.reduce((max, s) => Math.max(max, s.sortOrder || 0), 0);
    setFormOrder(maxOrder + 1);
    setFormStatus("active");
    setSelectedFile(null);
    setPreviewSrc("");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormImage(skill.image || "");
    setFormOrder(skill.sortOrder);
    setFormStatus(skill.status);
    setSelectedFile(null);
    setPreviewSrc(skill.image || "");
    setError("");
    setModalOpen(true);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    // File validation: Image check & size limit 5MB
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  }

  async function uploadSelectedFile(skillName: string) {
    if (!selectedFile) return formImage;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("page", "scholastic");
      formData.set("section", "skills");
      formData.set("title", skillName || "Skill Image");

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

  async function handleDelete(skill: Skill) {
    if (!window.confirm(`Are you sure you want to delete "${skill.name}"?`)) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch("/api/admin/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skill._id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete skill course.");
      }
      setSuccess(`Successfully deleted "${skill.name}".`);
      fetchSkills();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete skill course.";
      setError(message);
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === skills.length - 1) return;

    const swapWithIndex = direction === "up" ? index - 1 : index + 1;
    const newSkills = [...skills];

    const temp = newSkills[index];
    newSkills[index] = newSkills[swapWithIndex];
    newSkills[swapWithIndex] = temp;

    newSkills.forEach((s, idx) => {
      s.sortOrder = idx + 1;
    });

    setSkills(newSkills);
    setSuccess("Display order modified. Click 'Save Roster Order' to persist changes!");
  }

  async function handleToggleStatus(skill: Skill) {
    try {
      const newStatus = skill.status === "active" ? "inactive" : "active";
      const response = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skill._id, status: newStatus }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update status.");
      }
      setSuccess(`Updated status of "${skill.name}" to ${newStatus}.`);
      fetchSkills();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      setError(message);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Skill course name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let imageUrl = formImage;
      if (selectedFile) {
        imageUrl = await uploadSelectedFile(formName.trim());
      }

      const payload = {
        id: editingSkill?._id,
        _id: editingSkill?._id,
        name: formName.trim(),
        image: imageUrl,
        sortOrder: formOrder,
        status: formStatus,
      };

      const response = await fetch("/api/admin/skills", {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save skill course.");
      }

      setSuccess(editingSkill ? `Updated "${formName.trim()}"` : `Added "${formName.trim()}"`);
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save skill course entry.";
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

      const response = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skills),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save order.");
      }

      setSuccess("Successfully updated display order in MongoDB database!");
      fetchSkills();
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
              Scholastic
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[10px] font-mono text-gray-500">Live Skill Courses</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-montserrat">
            Skill & Vocational Courses
          </h1>
          <p className="text-xs text-[#94A3B8] font-semibold">
            Manage practical skill courses, upload images, set display order, and toggle visibility on the Scholastic page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={fetchSkills}
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
            Add Course
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
              placeholder="Search by skill name..."
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
            <p className="text-xs font-mono text-gray-500">Loading skill courses...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#1F2937]/50 rounded-xl">
            <Sparkles className="mx-auto text-gray-600 mb-3" size={32} />
            <p className="text-sm font-bold text-white">No skill courses found</p>
            <p className="text-xs text-gray-500 mt-1">Click "Add Course" to create your first skill course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1F2937]/50 bg-[#07090E]/60">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1F2937]/60 bg-[#0D1321]/80 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  <th className="px-4 py-4 w-14 text-center">S.No.</th>
                  <th className="px-4 py-4 w-16 text-center">Image</th>
                  <th className="px-5 py-4">Skill Name</th>
                  <th className="px-5 py-4 w-28 text-center">Display Order</th>
                  <th className="px-5 py-4 w-28 text-center">Status</th>
                  <th className="px-5 py-4 w-28 text-center">Reorder</th>
                  <th className="px-5 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]/40 text-xs font-medium text-white/90">
                {filteredSkills.map((skill, idx) => (
                  <tr key={skill._id || idx} className="hover:bg-[#111827]/25 transition-all">
                    <td className="px-4 py-3.5 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#374151] mx-auto bg-[#111827] flex items-center justify-center relative">
                        {skill.image ? (
                          <img src={skill.image} alt={skill.name} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles size={16} className="text-[#F7B801]" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold font-montserrat uppercase tracking-tight text-white">{skill.name}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-amber-400 font-bold">
                      {skill.sortOrder}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(skill)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          skill.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-gray-500/15 text-gray-400 border border-gray-500/30 hover:bg-gray-500/25"
                        }`}
                      >
                        {skill.status === "active" ? <Eye size={12} /> : <EyeOff size={12} />}
                        {skill.status}
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
                          disabled={idx === filteredSkills.length - 1 || searchQuery !== ""}
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
                          onClick={() => openEditModal(skill)}
                          className="p-2 hover:bg-[#1F2937] border border-transparent hover:border-[#374151]/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                          title="Edit Course"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(skill)}
                          className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Delete Course"
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
          <div className="bg-[#0A0E17] border border-[#1F2937] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1F2937]/60 bg-[#0B0F19] flex justify-between items-center">
              <h3 className="font-montserrat uppercase font-black text-sm tracking-wide text-white">
                {editingSkill ? "Edit Skill Course" : "Add New Skill Course"}
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
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-[#111827]/60 border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] transition-all font-semibold"
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Course Image (Optional)
                </label>

                <div className="flex gap-4 items-center bg-[#111827]/40 border border-[#1F2937] p-3.5 rounded-xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0E17] border border-[#374151]/50 flex items-center justify-center shrink-0 relative">
                    {previewSrc || formImage ? (
                      <img src={previewSrc || formImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-600" size={24} />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <label className="inline-flex items-center gap-2 bg-[#1F2937] hover:bg-[#374151] text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-[#374151]/60">
                      <Upload size={14} />
                      <span>{selectedFile ? selectedFile.name : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {(previewSrc || formImage) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewSrc("");
                          setFormImage("");
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 block font-semibold"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 font-mono">Or paste Image URL directly:</span>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => {
                      setFormImage(e.target.value);
                      setPreviewSrc(e.target.value);
                    }}
                    placeholder="https://... or /uploads/..."
                    className="w-full bg-[#111827]/40 border border-[#1F2937]/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F7B801] font-mono"
                  />
                </div>
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
                  disabled={uploading || submitting}
                  className="flex-1 bg-[#F7B801] hover:bg-[#E5AA00] disabled:bg-amber-600 text-[#0A0E17] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {uploading || submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingSkill ? (
                    "Update Course"
                  ) : (
                    "Create Course"
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
