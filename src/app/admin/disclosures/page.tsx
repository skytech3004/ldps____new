"use client";

import React, { useEffect, useState } from "react";
import { 
  Pencil, Plus, Trash2, X, FileText, Save, Upload, 
  CheckCircle2, AlertTriangle, ExternalLink, School, 
  Award, Users, Building, Video 
} from "lucide-react";

type DisclosureItem = {
  _id: string;
  title: string;
  pdfUrl?: string;
  category: string;
  value?: string;
  details?: string;
  count?: number;
  createdAt: string;
};

type DisclosureForm = {
  title: string;
  pdfUrl: string;
  category: string;
  value: string;
  details: string;
  count: number | "";
};

const initialForm: DisclosureForm = {
  title: "",
  pdfUrl: "",
  category: "documents",
  value: "",
  details: "",
  count: "",
};

type ActiveAdminTab = "general" | "documents" | "academics" | "staff" | "infrastructure" | "custom";

export default function AdminDisclosuresPage() {
  const [items, setItems] = useState<DisclosureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DisclosureForm>(initialForm);
  const [activeAdminTab, setActiveAdminTab] = useState<ActiveAdminTab>("general");
  
  // Custom category fields (when adding custom category)
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/disclosures", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch disclosures.");
      }
      setItems(data as DisclosureItem[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch disclosures.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function openCreateModal(defaultCategory: string) {
    setEditingId(null);
    setForm({
      ...initialForm,
      category: defaultCategory,
    });
    setIsCustomCategory(defaultCategory === "custom");
    setCustomCategoryName("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(item: DisclosureItem) {
    const isPreset = [
      "general", "documents", "academics", "staff_role", 
      "staff_teacher", "staff_stat", "infrastructure", "infrastructure_video"
    ].includes(item.category);

    setEditingId(item._id);
    setForm({
      title: item.title ?? "",
      pdfUrl: item.pdfUrl ?? "",
      category: isPreset ? item.category : "custom",
      value: item.value ?? "",
      details: item.details ?? "",
      count: typeof item.count === "number" ? item.count : "",
    });
    setIsCustomCategory(!isPreset);
    setCustomCategoryName(isPreset ? "" : item.category);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file only.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const body = new FormData();
      body.set("page", "disclosures");
      body.set("section", "documents");
      body.set("title", form.title || file.name);
      body.set("description", `CBSE Disclosure PDF: ${form.title}`);
      body.set("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "File upload failed.");
      }

      setForm((prev) => ({ ...prev, pdfUrl: result.upload.src }));
      setSuccess("PDF uploaded successfully!");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const finalCategory = form.category === "custom" ? customCategoryName.trim().toLowerCase() : form.category;
      if (form.category === "custom" && !customCategoryName.trim()) {
        throw new Error("Please enter a custom category / tab name.");
      }

      // Context-aware validation
      const requiresPdf = ["documents", "academics", "staff_teacher", "custom"].includes(form.category);
      if (requiresPdf && !form.pdfUrl) {
        throw new Error("Please upload a PDF or enter a PDF URL first.");
      }

      const payload = {
        id: editingId,
        title: form.title,
        pdfUrl: form.pdfUrl,
        category: finalCategory || "documents",
        value: form.value,
        details: form.details,
        count: form.count === "" ? undefined : Number(form.count),
      };

      const response = await fetch("/api/admin/disclosures", {
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
    const confirmed = window.confirm("Delete this disclosure item?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/disclosures", {
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

  // Filter lists for active tabs
  const generalItems = items.filter(item => item.category === "general");
  const documentItems = items.filter(item => item.category === "documents");
  const academicItems = items.filter(item => item.category === "academics");
  
  // Staff groupings
  const staffRoles = items.filter(item => item.category === "staff_role");
  const staffTeachers = items.filter(item => item.category === "staff_teacher");
  const staffStats = items.filter(item => item.category === "staff_stat");

  // Infrastructure groupings
  const infraItems = items.filter(item => item.category === "infrastructure");
  const infraVideoItems = items.filter(item => item.category === "infrastructure_video");

  // Custom categories
  const presetCategories = [
    "general", "documents", "academics", "staff_role", 
    "staff_teacher", "staff_stat", "infrastructure", "infrastructure_video"
  ];
  const customItems = items.filter(item => !presetCategories.includes(item.category));

  return (
    <div className="space-y-8 text-gray-200">
      
      {/* Title Header */}
      <div className="p-6 md:p-8 rounded-2xl border border-teal/10 bg-[#0A0E17]/60 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-none">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7678ED]">CMS Workspace</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2 flex items-center gap-3 font-montserrat">
            <FileText className="text-[#F7B801]" />
            CBSE Mandatory Disclosures
          </h1>
          <p className="text-xs text-[#94A3B8] font-semibold mt-1">
            Manage General Info, Safety Compliance PDFs, Academic calendars, Staffing rosters, and Infrastructure specs.
          </p>
        </div>
      </div>

      {/* Operation Tabs */}
      <div className="flex flex-wrap bg-[#0A0E17]/80 p-2 rounded-2xl gap-2 border border-[#1F2937]/50">
        {[
          { id: "general", label: "General Info", icon: School },
          { id: "documents", label: "Compliance Docs", icon: FileText },
          { id: "academics", label: "Academics", icon: Award },
          { id: "staff", label: "Staff Details", icon: Users },
          { id: "infrastructure", label: "Infrastructure", icon: Building },
          { id: "custom", label: "Custom Tabs", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveAdminTab(tab.id as ActiveAdminTab);
                setError("");
                setSuccess("");
              }}
              type="button"
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeAdminTab === tab.id
                  ? "bg-[#7678ED] text-white shadow-md shadow-[#7678ED]/20"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#1F2937]/40"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#0A0E17]/60 border border-[#1F2937]/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
        {error ? <p className="mb-4 text-sm font-semibold text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-900/30 flex items-center gap-2"><AlertTriangle size={16} />{error}</p> : null}

        {/* LOADING INDICATOR */}
        {loading && <p className="text-gray-400 py-6">Loading disclosures database...</p>}

        {/* 1. GENERAL INFO TAB */}
        {!loading && activeAdminTab === "general" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <School className="text-[#F7B801]" size={18} /> General Info Key-Value Store
              </h2>
              <button
                onClick={() => openCreateModal("general")}
                className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Property
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/60">
                    <th className="py-3 px-4">Property / Label</th>
                    <th className="py-3 px-4">Value</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generalItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-gray-500 text-center font-medium">No General Info entries found.</td>
                    </tr>
                  ) : (
                    generalItems.map((item) => (
                      <tr key={item._id} className="border-b border-[#1F2937]/20 hover:bg-[#111827]/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{item.title}</td>
                        <td className="py-4 px-4 text-gray-300 max-w-md truncate">{item.value}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(item._id)} className="p-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. COMPLIANCE DOCUMENTS TAB */}
        {!loading && activeAdminTab === "documents" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <FileText className="text-[#F7B801]" size={18} /> Documents & Compliance PDFs (Section B)
              </h2>
              <button
                onClick={() => openCreateModal("documents")}
                className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Document
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/60">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">PDF Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documentItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-gray-500 text-center font-medium">No compliance documents found.</td>
                    </tr>
                  ) : (
                    documentItems.map((item) => (
                      <tr key={item._id} className="border-b border-[#1F2937]/20 hover:bg-[#111827]/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{item.title}</td>
                        <td className="py-4 px-4">
                          {item.pdfUrl ? (
                            <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[#7678ED] hover:underline inline-flex items-center gap-1">
                              <ExternalLink size={12} /> View PDF
                            </a>
                          ) : (
                            <span className="text-gray-500 font-medium">No PDF Uploaded</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(item._id)} className="p-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ACADEMICS TAB */}
        {!loading && activeAdminTab === "academics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Award className="text-[#F7B801]" size={18} /> Results & Academics PDFs (Section C)
              </h2>
              <button
                onClick={() => openCreateModal("academics")}
                className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Academic Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/60">
                    <th className="py-3 px-4">Info Title</th>
                    <th className="py-3 px-4">PDF Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {academicItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-gray-500 text-center font-medium">No academic records found.</td>
                    </tr>
                  ) : (
                    academicItems.map((item) => (
                      <tr key={item._id} className="border-b border-[#1F2937]/20 hover:bg-[#111827]/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{item.title}</td>
                        <td className="py-4 px-4">
                          {item.pdfUrl ? (
                            <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[#7678ED] hover:underline inline-flex items-center gap-1">
                              <ExternalLink size={12} /> View PDF
                            </a>
                          ) : (
                            <span className="text-gray-500 font-medium">No PDF Uploaded</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(item._id)} className="p-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. STAFF DETAILS TAB */}
        {!loading && activeAdminTab === "staff" && (
          <div className="space-y-12">
            
            {/* Section A: Leadership & Special Roles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Users className="text-[#F7B801]" size={16} /> 1. Leadership & Special Roles
                </h3>
                <button
                  onClick={() => openCreateModal("staff_role")}
                  className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Role
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/40">
                      <th className="py-2 px-3">Role / Designation</th>
                      <th className="py-2 px-3">Staff Name(s)</th>
                      <th className="py-2 px-3">Count</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffRoles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-3 text-gray-500 text-center font-medium">No roles defined.</td>
                      </tr>
                    ) : (
                      staffRoles.map((item) => (
                        <tr key={item._id} className="border-b border-[#1F2937]/10 hover:bg-[#111827]/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{item.title}</td>
                          <td className="py-3 px-3 text-gray-300">{item.details}</td>
                          <td className="py-3 px-3 text-gray-300 font-mono">{item.count}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={12} /></button>
                              <button onClick={() => onDelete(item._id)} className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section B: Department Strength & Lists */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <FileText className="text-[#F7B801]" size={16} /> 2. Departments & Staff PDF Rosters
                </h3>
                <button
                  onClick={() => openCreateModal("staff_teacher")}
                  className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Department
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/40">
                      <th className="py-2 px-3">Department Name</th>
                      <th className="py-2 px-3">PDF Title</th>
                      <th className="py-2 px-3">Strength / Count</th>
                      <th className="py-2 px-3">PDF Link</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-3 text-gray-500 text-center font-medium">No departments rostered.</td>
                      </tr>
                    ) : (
                      staffTeachers.map((item) => (
                        <tr key={item._id} className="border-b border-[#1F2937]/10 hover:bg-[#111827]/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{item.value}</td>
                          <td className="py-3 px-3 text-gray-300">{item.title}</td>
                          <td className="py-3 px-3 text-gray-300 font-mono">{item.count}</td>
                          <td className="py-3 px-3">
                            {item.pdfUrl ? (
                              <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[#7678ED] hover:underline inline-flex items-center gap-1">
                                <ExternalLink size={12} /> View PDF
                              </a>
                            ) : (
                              <span className="text-gray-500 font-medium">None</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={12} /></button>
                              <button onClick={() => onDelete(item._id)} className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Staff Overall Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Award className="text-[#F7B801]" size={16} /> 3. Staffing Overall Statistics
                </h3>
                <button
                  onClick={() => openCreateModal("staff_stat")}
                  className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Metric
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/40">
                      <th className="py-2 px-3">Stat Label</th>
                      <th className="py-2 px-3">Numeric Value</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffStats.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-3 text-gray-500 text-center font-medium">No staffing stats defined.</td>
                      </tr>
                    ) : (
                      staffStats.map((item) => (
                        <tr key={item._id} className="border-b border-[#1F2937]/10 hover:bg-[#111827]/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{item.title}</td>
                          <td className="py-3 px-3 text-gray-300 font-mono font-bold">{item.count}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={12} /></button>
                              <button onClick={() => onDelete(item._id)} className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. INFRASTRUCTURE & INSPECTION TAB */}
        {!loading && activeAdminTab === "infrastructure" && (
          <div className="space-y-12">
            
            {/* Section A: Infrastructure Properties */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Building className="text-[#F7B801]" size={16} /> 1. Campus Metrics & Rooms Grid
                </h3>
                <button
                  onClick={() => openCreateModal("infrastructure")}
                  className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Metric
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/40">
                      <th className="py-2 px-3">Infrastructure Spec</th>
                      <th className="py-2 px-3">Size / Value Details</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infraItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-3 text-gray-500 text-center font-medium">No infrastructure metrics defined.</td>
                      </tr>
                    ) : (
                      infraItems.map((item) => (
                        <tr key={item._id} className="border-b border-[#1F2937]/10 hover:bg-[#111827]/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{item.title}</td>
                          <td className="py-3 px-3 text-gray-300 font-medium">{item.value}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={12} /></button>
                              <button onClick={() => onDelete(item._id)} className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section B: Inspection Video */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-[#1F2937]/60 border-b pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Video className="text-[#F7B801]" size={16} /> 2. YouTube Inspection Video Link
                </h3>
                {infraVideoItems.length === 0 && (
                  <button
                    onClick={() => openCreateModal("infrastructure_video")}
                    className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Set Video Link
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/40">
                      <th className="py-2 px-3">Title</th>
                      <th className="py-2 px-3">YouTube URL</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infraVideoItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-3 text-gray-500 text-center font-medium">No inspection video registered.</td>
                      </tr>
                    ) : (
                      infraVideoItems.map((item) => (
                        <tr key={item._id} className="border-b border-[#1F2937]/10 hover:bg-[#111827]/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{item.title}</td>
                          <td className="py-3 px-3 font-mono text-[#7678ED] hover:underline truncate max-w-sm">
                            <a href={item.value} target="_blank" rel="noreferrer">{item.value}</a>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={12} /></button>
                              <button onClick={() => onDelete(item._id)} className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. CUSTOM CATEGORIES/TABS TAB */}
        {!loading && activeAdminTab === "custom" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1F2937]/60 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <FileText className="text-[#F7B801]" size={18} /> Custom Tabs & compliance files
              </h2>
              <button
                onClick={() => openCreateModal("custom")}
                className="bg-[#7678ED] hover:bg-[#5856D6] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Custom tab item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#1F2937]/60">
                    <th className="py-3 px-4">Custom Tab</th>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">PDF Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-gray-500 text-center font-medium">No custom tab disclosures found.</td>
                    </tr>
                  ) : (
                    customItems.map((item) => (
                      <tr key={item._id} className="border-b border-[#1F2937]/20 hover:bg-[#111827]/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">{item.category}</td>
                        <td className="py-4 px-4 font-bold text-white">{item.title}</td>
                        <td className="py-4 px-4">
                          {item.pdfUrl ? (
                            <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[#7678ED] hover:underline inline-flex items-center gap-1">
                              <ExternalLink size={12} /> View PDF
                            </a>
                          ) : (
                            <span className="text-gray-500 font-medium">No PDF Uploaded</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 bg-[#1F2937]/40 hover:bg-[#1F2937] text-white rounded-lg transition-colors cursor-pointer"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(item._id)} className="p-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* DYNAMIC FORM MODAL */}
      {modalOpen ? (
        <div className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden text-gray-800 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight font-montserrat">
                  {editingId ? "Edit Disclosure Item" : "Add Disclosure Item"}
                </h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                  Type: {form.category.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2.5 rounded-full hover:bg-gray-200 text-primary transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                  Category / Group *
                </label>
                <select
                  value={form.category}
                  onChange={(event) => {
                    const val = event.target.value;
                    setForm((prev) => ({ ...prev, category: val }));
                    setIsCustomCategory(val === "custom");
                  }}
                  className="w-full border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                >
                  <option value="general">General Info</option>
                  <option value="documents">Compliance Documents</option>
                  <option value="academics">Results & Academics</option>
                  <option value="staff_role">Staff Leadership/Role</option>
                  <option value="staff_teacher">Staff Department strength</option>
                  <option value="staff_stat">Staff overall statistics</option>
                  <option value="infrastructure">Infrastructure details</option>
                  <option value="infrastructure_video">Infrastructure YouTube inspection</option>
                  <option value="custom">+ Custom category Tab</option>
                </select>
              </div>

              {/* Custom Category Input */}
              {isCustomCategory && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                    Custom Category/Tab Name (lowercase, singular, e.g., &apos;audits&apos;) *
                  </label>
                  <input
                    value={customCategoryName}
                    onChange={(event) => setCustomCategoryName(event.target.value)}
                    required
                    placeholder="e.g. audits"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                  />
                </div>
              )}

              {/* DYNAMIC FIELD RENDERINGS */}

              {/* A. TITLE FIELD: Used in all categories, label changes depending on content */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                  {form.category === "general" && "Property Name / Label (e.g. School Code) *"}
                  {form.category === "staff_role" && "Designation / Role (e.g. Principal) *"}
                  {form.category === "staff_teacher" && "Staff list PDF Title (e.g. Staff List OASIS PGT) *"}
                  {form.category === "staff_stat" && "Stat Label (e.g. Total Teachers Count) *"}
                  {form.category === "infrastructure" && "Infrastructure Field Name (e.g. Girls Toilets) *"}
                  {form.category === "infrastructure_video" && "Video Title *"}
                  {["documents", "academics", "custom"].includes(form.category) && "Document Title *"}
                </label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                  placeholder={
                    form.category === "general" ? "e.g. School Code" :
                    form.category === "staff_role" ? "e.g. Vice Principal" :
                    form.category === "staff_teacher" ? "e.g. Staff List OASIS PGT" :
                    form.category === "staff_stat" ? "e.g. Total Teachers Count" :
                    form.category === "infrastructure" ? "e.g. Total Campus Area" :
                    "e.g. Building Safety Certificate"
                  }
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                />
              </div>

              {/* B. VALUE FIELD: Used in general, infrastructure, staff_teacher */}
              {(form.category === "general" || form.category === "infrastructure" || form.category === "infrastructure_video" || form.category === "staff_teacher") && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                    {form.category === "general" && "Property Value / Text *"}
                    {form.category === "infrastructure" && "Metric Value / Size (e.g. 15,000 SqMt) *"}
                    {form.category === "infrastructure_video" && "YouTube URL (e.g. https://www.youtube.com/...) *"}
                    {form.category === "staff_teacher" && "Department Name / Department Label (e.g. Post Graduate Teacher (PGT)) *"}
                  </label>
                  <input
                    value={form.value}
                    onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
                    required
                    placeholder={
                      form.category === "general" ? "e.g. 1730491" :
                      form.category === "infrastructure" ? "e.g. 62 Toilets" :
                      form.category === "infrastructure_video" ? "e.g. https://www.youtube.com/..." :
                      "e.g. Post Graduate Teacher (PGT)"
                    }
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                  />
                </div>
              )}

              {/* C. DETAILS FIELD: Used in staff_role */}
              {form.category === "staff_role" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                    Staff Name / Holder Details (e.g. Ms. Jyoti Nath) *
                  </label>
                  <input
                    value={form.details}
                    onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                    required
                    placeholder="e.g. Ms. Jyoti Nath"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                  />
                </div>
              )}

              {/* D. COUNT FIELD: Used in staff_role, staff_teacher, staff_stat */}
              {(form.category === "staff_role" || form.category === "staff_teacher" || form.category === "staff_stat") && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2">
                    {form.category === "staff_role" && "Role Count (Number) *"}
                    {form.category === "staff_teacher" && "Department Strength (Number) *"}
                    {form.category === "staff_stat" && "Overall Statistic Count (Number) *"}
                  </label>
                  <input
                    type="number"
                    value={form.count}
                    onChange={(event) => setForm((prev) => ({ ...prev, count: event.target.value === "" ? "" : Number(event.target.value) }))}
                    required
                    placeholder="e.g. 15"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all font-mono"
                  />
                </div>
              )}

              {/* E. PDF UPLOAD AND LINK: Used in documents, academics, staff_teacher, custom */}
              {["documents", "academics", "staff_teacher", "custom"].includes(form.category) && (
                <div className="space-y-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2 block">
                      Upload PDF File
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-xs font-bold text-primary rounded-xl shadow-sm transition-all cursor-pointer">
                        <Upload size={14} />
                        {uploading ? "Uploading..." : "Choose PDF"}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {form.pdfUrl && (
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          PDF Loaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 ml-2 block">
                      Or enter relative/absolute PDF URL path
                    </label>
                    <input
                      value={form.pdfUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, pdfUrl: event.target.value }))}
                      placeholder="/uploads/disclosures/filename.pdf"
                      className="w-full border-2 border-gray-100 bg-white rounded-xl px-4 py-3 text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              {error ? (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertTriangle size={14} className="shrink-0" />
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="text-xs font-semibold text-green-700 flex items-center gap-2 bg-green-50 p-3 rounded-xl border border-green-200">
                  <CheckCircle2 size={14} className="shrink-0" />
                  {success}
                </p>
              ) : null}
            </form>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={saving || uploading}
                className="px-8 py-3 rounded-xl bg-primary hover:bg-[#7678ED] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 disabled:opacity-70 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save size={14} />
                {saving ? "Saving..." : editingId ? "Update Item" : "Publish Item"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
