"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, X, Save, Image, Shield, 
  HelpCircle, CalendarRange, Ban, Upload, ArrowUpRight 
} from "lucide-react";

type Facility = {
  _id: string;
  name: string;
  description: string;
  src: string;
  sortOrder: number;
};

type Fee = {
  _id: string;
  classLevel: string;
  nonAcFee: string;
  acFee: string;
  sortOrder: number;
};

type Rule = {
  _id: string;
  category: string;
  title: string;
  bullets: string[];
  sortOrder: number;
};

type HostelPhoto = {
  _id: string;
  title: string;
  src: string;
  category: string;
};

export default function AdminHostelPage() {
  const [activeTab, setActiveTab] = useState<"facilities" | "fees" | "rules" | "gallery">("facilities");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [hostelPhotos, setHostelPhotos] = useState<HostelPhoto[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Forms state
  // Facility Form
  const [facName, setFacName] = useState("");
  const [facDesc, setFacDesc] = useState("");
  const [facSrc, setFacSrc] = useState("");
  const [facSort, setFacSort] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fee Form
  const [feeClass, setFeeClass] = useState("");
  const [feeNonAc, setFeeNonAc] = useState("");
  const [feeAc, setFeeAc] = useState("");
  const [feeSort, setFeeSort] = useState(0);

  // Rule Form
  const [ruleCategory, setRuleCategory] = useState("");
  const [ruleTitle, setRuleTitle] = useState("");
  const [ruleBulletsText, setRuleBulletsText] = useState("");
  const [ruleSort, setRuleSort] = useState(0);

  // Gallery Form
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoSrc, setPhotoSrc] = useState("");
  const [photoCategory, setPhotoCategory] = useState("Rooms");
  const [hostelCategories, setHostelCategories] = useState<string[]>(["Rooms", "Mess", "Campus"]);
  const [hostelFilter, setHostelFilter] = useState<string>("All");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/hostel");
      if (!res.ok) throw new Error("Failed to load hostel database.");
      const json = await res.json();
      setFacilities(json.facilities || []);
      setFees(json.fees || []);
      setRules(json.rules || []);

      const photosRes = await fetch("/api/admin/media-items?type=hostel-photo");
      if (photosRes.ok) {
        const photosJson = await photosRes.json();
        setHostelPhotos(photosJson || []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilters() {
    try {
      const res = await fetch("/api/admin/filters?type=hostel");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setHostelCategories(data.map((f: any) => f.name));
        }
      }
    } catch (e) {
      console.error("Failed to fetch hostel filters:", e);
    }
  }

  async function handleCreateHostelCategory() {
    const newCat = window.prompt("Enter new hostel category name:");
    if (!newCat || !newCat.trim()) return;
    const trimmed = newCat.trim();
    try {
      const res = await fetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, type: "hostel" })
      });
      if (res.ok) {
        const data = await res.json();
        if (!hostelCategories.includes(data.name)) {
          setHostelCategories([...hostelCategories, data.name]);
        }
        setPhotoCategory(data.name);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Error creating category.");
    }
  }

  useEffect(() => {
    fetchData();
    fetchFilters();
  }, []);

  // Handle facility / photo image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", "hostel");
      formData.append("section", "hostel");
      formData.append("title", activeTab === "gallery" ? `Hostel Photo - ${photoTitle || "New Photo"}` : `Facility - ${facName || "New Item"}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed.");
      const json = await res.json();
      if (activeTab === "gallery") {
        setPhotoSrc(json.upload.src);
      } else {
        setFacSrc(json.upload.src);
      }
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFacName("");
    setFacDesc("");
    setFacSrc("");
    setFacSort(facilities.length + 1);

    setFeeClass("");
    setFeeNonAc("");
    setFeeAc("");
    setFeeSort(fees.length + 1);

    setRuleCategory("Entry Policy");
    setRuleTitle("");
    setRuleBulletsText("");
    setRuleSort(rules.length + 1);

    setPhotoTitle("");
    setPhotoSrc("");
    setPhotoCategory("Rooms");

    setModalOpen(true);
  }

  function openEditModal(item: any) {
    setEditingId(item._id);
    if (activeTab === "facilities") {
      setFacName(item.name);
      setFacDesc(item.description);
      setFacSrc(item.src);
      setFacSort(item.sortOrder);
    } else if (activeTab === "fees") {
      setFeeClass(item.classLevel);
      setFeeNonAc(item.nonAcFee);
      setFeeAc(item.acFee);
      setFeeSort(item.sortOrder);
    } else if (activeTab === "rules") {
      setRuleCategory(item.category);
      setRuleTitle(item.title);
      setRuleBulletsText(item.bullets.join("\n"));
      setRuleSort(item.sortOrder);
    } else if (activeTab === "gallery") {
      setPhotoTitle(item.title);
      setPhotoSrc(item.src);
      setPhotoCategory(item.category);
    }
    setModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      let payload: any = { id: editingId };
      if (activeTab === "facilities") {
        payload.name = facName.trim();
        payload.description = facDesc.trim();
        payload.src = facSrc.trim();
        payload.sortOrder = facSort;
      } else if (activeTab === "fees") {
        payload.classLevel = feeClass.trim();
        payload.nonAcFee = feeNonAc.trim();
        payload.acFee = feeAc.trim();
        payload.sortOrder = feeSort;
      } else if (activeTab === "rules") {
        payload.category = ruleCategory.trim();
        payload.title = ruleTitle.trim();
        payload.bullets = ruleBulletsText.split("\n").map(l => l.trim()).filter(Boolean);
        payload.sortOrder = ruleSort;
      } else if (activeTab === "gallery") {
        payload = {
          title: photoTitle.trim(),
          src: photoSrc.trim(),
          alt: photoTitle.trim(),
          type: "hostel-photo",
          category: photoCategory
        };
        if (editingId) {
          payload._id = editingId;
        }
      }

      const url = activeTab === "gallery"
        ? "/api/admin/media-items"
        : `/api/hostel?type=${activeTab}`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save operation failed.");
      
      setModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      setError("");
      const url = activeTab === "gallery"
        ? `/api/admin/media-items?id=${id}`
        : `/api/hostel?type=${activeTab}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: activeTab === "gallery" ? undefined : JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setError(msg);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2">Hostel & Residences Manager</h1>
          <p className="text-white/70 mt-2">Manage live facilities grid, session fees list, and rules/guidelines accordions.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/hostel" target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white">
            <ArrowUpRight size={14} />
            View Hostel Page
          </Link>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
            <Plus size={16} />
            Add item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 flex-wrap">
        {(["facilities", "fees", "rules", "gallery"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setHostelFilter("All");
            }}
            className={`px-6 py-4 font-black uppercase text-xs tracking-widest border-b-2 transition-all ${
              activeTab === tab ? "border-[#F7B801] text-[#F7B801]" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            {tab === "facilities" ? "Facilities Grid" : tab === "fees" ? "Fee Structure" : tab === "rules" ? "Rules & Policies" : "Hostel Gallery"}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading database files...</div>
      ) : (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-6">
          {activeTab === "facilities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {facilities.map((fac) => (
                <div key={fac._id} className="bg-[#0b1738] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-950">
                    <img src={fac.src} alt={fac.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-white text-lg uppercase tracking-tight">{fac.name}</h3>
                      <span className="text-[10px] text-[#F7B801] font-bold">Order: {fac.sortOrder}</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{fac.description}</p>
                  </div>
                  <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-black/10">
                    <button onClick={() => openEditModal(fac)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(fac._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "fees" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-white/60 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-6">Class / Level</th>
                    <th className="py-4 px-6">Non-AC Fee</th>
                    <th className="py-4 px-6">AC Fee</th>
                    <th className="py-4 px-6">Sort Order</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {fees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-white/5">
                      <td className="py-4 px-6 font-bold text-white">{fee.classLevel}</td>
                      <td className="py-4 px-6 text-white/80">{fee.nonAcFee}</td>
                      <td className="py-4 px-6 text-[#F7B801] font-bold">{fee.acFee}</td>
                      <td className="py-4 px-6 text-white/60">{fee.sortOrder}</td>
                      <td className="py-4 px-6 text-right flex justify-end gap-2">
                        <button onClick={() => openEditModal(fee)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(fee._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule._id} className="bg-[#0b1738] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-white/10 text-white/80 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {rule.category}
                      </span>
                      <span className="text-[10px] text-[#F7B801] font-bold">Order: {rule.sortOrder}</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{rule.title}</h3>
                    <ul className="space-y-2 list-disc pl-5 text-xs text-white/70 leading-relaxed font-semibold">
                      {rule.bullets.map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditModal(rule)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(rule._id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Category Filter Bar */}
              <div className="flex flex-wrap gap-2 mb-2 bg-[#0b1738]/60 p-4 rounded-2xl border border-white/5 items-center">
                <span className="text-white/40 text-xs font-bold mr-2 uppercase tracking-wider">Filter Category:</span>
                {["All", ...hostelCategories].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setHostelFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      hostelFilter === filter
                        ? "bg-[#F7B801] text-[#3D348B]"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hostelPhotos
                  .filter((p) => hostelFilter === "All" || p.category === hostelFilter)
                  .map((photo) => (
                <div key={photo._id} className="bg-[#0b1738] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-950">
                    <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-white text-sm uppercase tracking-tight line-clamp-2">{photo.title}</h3>
                      <span className="px-2 py-0.5 bg-[#7678ED]/10 text-[#F7B801] text-[9px] font-black uppercase tracking-wider rounded shrink-0">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-black/10">
                    <button onClick={() => openEditModal(photo)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(photo._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {hostelPhotos.filter((p) => hostelFilter === "All" || p.category === hostelFilter).length === 0 && (
                <div className="col-span-full text-center py-12 text-white/50 font-bold text-xs uppercase tracking-widest">No gallery photos found for this filter.</div>
              )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Item" : "Create New Item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-white">
              {activeTab === "facilities" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Facility Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={facName} 
                      onChange={(e) => setFacName(e.target.value)}
                      placeholder="Safety & CCTV" 
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Description</label>
                    <textarea 
                      rows={3} 
                      value={facDesc} 
                      onChange={(e) => setFacDesc(e.target.value)}
                      placeholder="Brief detail of the facility..." 
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image File Upload</label>
                      <div className="relative w-full">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full border border-white/10 border-dashed rounded-xl px-4 py-3 text-xs text-white/60 font-bold flex items-center gap-2 bg-[#081a3a]">
                          <Upload size={14} className="text-[#F7B801]" />
                          <span>{uploadingImage ? "Uploading..." : "Upload Facility Image"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image URL *</label>
                      <input 
                        type="text" 
                        required 
                        value={facSrc} 
                        onChange={(e) => setFacSrc(e.target.value)}
                        placeholder="/uploads/hostel/filename.jpg" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Sort Position</label>
                    <input 
                      type="number" 
                      value={facSort} 
                      onChange={(e) => setFacSort(Number(e.target.value))}
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "fees" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Class / Academic Level *</label>
                    <input 
                      type="text" 
                      required 
                      value={feeClass} 
                      onChange={(e) => setFeeClass(e.target.value)}
                      placeholder="Class 6" 
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Standard Fee (Non-AC) *</label>
                      <input 
                        type="text" 
                        required 
                        value={feeNonAc} 
                        onChange={(e) => setFeeNonAc(e.target.value)}
                        placeholder="₹87,500 / Year" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Premium Fee (AC) *</label>
                      <input 
                        type="text" 
                        required 
                        value={feeAc} 
                        onChange={(e) => setFeeAc(e.target.value)}
                        placeholder="₹1,22,500 / Year or N/A" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Sort Position</label>
                    <input 
                      type="number" 
                      value={feeSort} 
                      onChange={(e) => setFeeSort(Number(e.target.value))}
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "rules" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Category *</label>
                      <select 
                        value={ruleCategory} 
                        onChange={(e) => setRuleCategory(e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      >
                        <option value="Entry Policy">Entry Policy</option>
                        <option value="Clothing and Uniform">Clothing & Uniform</option>
                        <option value="Prohibited Items">Prohibited Items</option>
                        <option value="Leave Policy">Leave Policy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Display Title *</label>
                      <input 
                        type="text" 
                        required 
                        value={ruleTitle} 
                        onChange={(e) => setRuleTitle(e.target.value)}
                        placeholder="Prohibited Electronic items" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Policy Guidelines (One bullet point per line) *</label>
                    <textarea 
                      rows={6} 
                      required
                      value={ruleBulletsText} 
                      onChange={(e) => setRuleBulletsText(e.target.value)}
                      placeholder="Electronic gadgets are strictly banned.&#10;Fine of Rs. 1000 and confiscation applies if found." 
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Sort Position</label>
                    <input 
                      type="number" 
                      value={ruleSort} 
                      onChange={(e) => setRuleSort(Number(e.target.value))}
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Photo Title *</label>
                      <input 
                        type="text" 
                        required 
                        value={photoTitle} 
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="Modern Residence Rooms" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Category *</label>
                      <div className="flex gap-2">
                        <select 
                          value={photoCategory} 
                          onChange={(e) => setPhotoCategory(e.target.value)}
                          className="flex-1 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] font-semibold"
                        >
                          {hostelCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleCreateHostelCategory}
                          className="px-4 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black transition-colors"
                          title="Add new category"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image File Upload</label>
                      <div className="relative w-full">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full border border-white/10 border-dashed rounded-xl px-4 py-3 text-xs text-white/60 font-bold flex items-center gap-2 bg-[#081a3a]">
                          <Upload size={14} className="text-[#F7B801]" />
                          <span>{uploadingImage ? "Uploading..." : "Upload Photo File"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Image URL *</label>
                      <input 
                        type="text" 
                        required 
                        value={photoSrc} 
                        onChange={(e) => setPhotoSrc(e.target.value)}
                        placeholder="/uploads/hostel/filename.jpg" 
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 border border-white/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving || uploadingImage} 
                  className="px-6 py-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
