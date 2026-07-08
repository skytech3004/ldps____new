"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, X, Save, Eye, Mail, 
  Phone, Calendar, Briefcase, FileText, ArrowUpRight, ClipboardList 
} from "lucide-react";

type JobOpening = {
  _id: string;
  title: string;
  department: string;
  experience: string;
  qualification: string;
  description: string;
  requirements: string[];
  salary: string;
  isActive: boolean;
  sortOrder: number;
};

type JobApplication = {
  _id: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  message: string;
  appliedAt: string;
};

export default function AdminCareerPage() {
  const [activeTab, setActiveTab] = useState<"openings" | "applications">("openings");
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Opening form fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Teaching");
  const [jobExp, setJobExp] = useState("");
  const [jobQual, setJobQual] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobReqsText, setJobReqsText] = useState("");
  const [jobSalary, setJobSalary] = useState("As per school norms");
  const [jobActive, setJobActive] = useState(true);
  const [jobSort, setJobSort] = useState(0);

  // Application details popup
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  async function loadOpenings() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/career?view=openings");
      if (!res.ok) throw new Error("Failed to fetch openings.");
      const data = await res.json();
      setOpenings(data || []);
    } catch (err) {
      setError("Load error: " + (err instanceof Error ? err.message : ""));
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/career?view=applications");
      if (!res.ok) throw new Error("Failed to fetch applications.");
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      setError("Load error: " + (err instanceof Error ? err.message : ""));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "openings") {
      loadOpenings();
    } else {
      loadApplications();
    }
  }, [activeTab]);

  function openCreateModal() {
    setEditingId(null);
    setJobTitle("");
    setJobDept("Teaching");
    setJobExp("");
    setJobQual("");
    setJobDesc("");
    setJobReqsText("");
    setJobSalary("As per school norms");
    setJobActive(true);
    setJobSort(openings.length + 1);

    setModalOpen(true);
  }

  function openEditModal(job: JobOpening) {
    setEditingId(job._id);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobExp(job.experience || "");
    setJobQual(job.qualification || "");
    setJobDesc(job.description || "");
    setJobReqsText(job.requirements ? job.requirements.join("\n") : "");
    setJobSalary(job.salary || "As per school norms");
    setJobActive(job.isActive);
    setJobSort(job.sortOrder);

    setModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        title: jobTitle.trim(),
        department: jobDept.trim(),
        experience: jobExp.trim(),
        qualification: jobQual.trim(),
        description: jobDesc.trim(),
        requirements: jobReqsText.split("\n").map(l => l.trim()).filter(Boolean),
        salary: jobSalary.trim() || "As per school norms",
        isActive: jobActive,
        sortOrder: jobSort,
      };

      const res = await fetch("/api/admin/career", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");

      setModalOpen(false);
      loadOpenings();
    } catch (err) {
      setError("Save error: " + (err instanceof Error ? err.message : ""));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteOpening(id: string) {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      setError("");
      const res = await fetch("/api/admin/career", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      loadOpenings();
    } catch (err) {
      setError("Delete failed: " + (err instanceof Error ? err.message : ""));
    }
  }

  async function handleDeleteApplication(id: string) {
    if (!window.confirm("Are you sure you want to delete this applicant record?")) return;
    try {
      setError("");
      const res = await fetch("/api/admin/career?view=applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      loadApplications();
    } catch (err) {
      setError("Delete failed: " + (err instanceof Error ? err.message : ""));
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2">Career Portal Workspace</h1>
          <p className="text-white/70 mt-2">Post vacancies, review applications, and access submitted CV portfolios.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/career" target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-white">
            <ArrowUpRight size={14} />
            View Careers Page
          </Link>
          {activeTab === "openings" && (
            <button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors">
              <Plus size={16} />
              Add Vacancy
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("openings")}
          className={`px-6 py-4 font-black uppercase text-xs tracking-widest border-b-2 transition-all ${
            activeTab === "openings" ? "border-[#F7B801] text-[#F7B801]" : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          Job Listings ({openings.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-4 font-black uppercase text-xs tracking-widest border-b-2 transition-all ${
            activeTab === "applications" ? "border-[#F7B801] text-[#F7B801]" : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-white/60 font-bold">Loading careers workspace...</div>
      ) : activeTab === "openings" ? (
        openings.length === 0 ? (
          <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
            <Briefcase size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
            <p className="font-bold text-lg">No active vacancies listed.</p>
            <p className="text-sm text-white/50 mt-1">Click "Add Vacancy" to post a new job opening!</p>
          </div>
        ) : (
          <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-white/60 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-6">Dept & Title</th>
                    <th className="py-4 px-6">Requirements</th>
                    <th className="py-4 px-6">Salary & Order</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {openings.map((job) => (
                    <tr key={job._id} className="hover:bg-white/5">
                      <td className="py-4 px-6 space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-white/10 text-white/80 rounded text-[9px] font-black uppercase tracking-wider">
                          {job.department}
                        </span>
                        <h3 className="font-bold text-white leading-snug">{job.title}</h3>
                        <p className="text-xs text-white/60">Exp: {job.experience || "Freshers okay"}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-white/70 max-w-xs truncate">
                        {job.qualification && <p className="font-bold text-[#F7B801]">Qual: {job.qualification}</p>}
                        <p className="truncate">{job.description}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-white/70 space-y-1">
                        <p className="font-semibold">{job.salary}</p>
                        <p className="text-[10px]">Order: {job.sortOrder}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          job.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                        }`}>
                          {job.isActive ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right flex justify-end gap-2">
                        <button onClick={() => openEditModal(job)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteOpening(job._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : applications.length === 0 ? (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl p-16 text-center text-white/60">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-40 text-[#F7B801]" />
          <p className="font-bold text-lg">No applicant submissions registered yet.</p>
          <p className="text-sm text-white/50 mt-1">Applications submitted on Career portal will show up here.</p>
        </div>
      ) : (
        <div className="bg-[#0f234f]/80 border border-white/15 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-white/60 text-xs font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Candidate Details</th>
                  <th className="py-4 px-6">Applied For</th>
                  <th className="py-4 px-6">Message Excerpt</th>
                  <th className="py-4 px-6">Date Applied</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5">
                    <td className="py-4 px-6 space-y-1">
                      <h3 className="font-bold text-white">{app.name}</h3>
                      <p className="text-xs text-white/60 flex items-center gap-1.5"><Mail size={10} /> {app.email}</p>
                      <p className="text-xs text-white/60 flex items-center gap-1.5"><Phone size={10} /> {app.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-[#F7B801]">{app.jobTitle}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-white/70 max-w-xs truncate">
                      {app.message || "(No message provided)"}
                    </td>
                    <td className="py-4 px-6 text-xs text-white/60">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      <button onClick={() => setSelectedApp(app)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                        <Eye size={14} />
                      </button>
                      <a href={app.resume} target="_blank" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Download CV">
                        <FileText size={14} />
                      </a>
                      <button onClick={() => handleDeleteApplication(app._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Opening Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingId ? "Edit Job Opening" : "Create Job Opening"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Job Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="PRT English Teacher" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Department *</label>
                  <select 
                    value={jobDept} 
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  >
                    <option value="Teaching">Teaching Wing</option>
                    <option value="Administration">Administration</option>
                    <option value="Residential Hostel">Residential Hostel</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Experience Required</label>
                  <input 
                    type="text" 
                    value={jobExp} 
                    onChange={(e) => setJobExp(e.target.value)}
                    placeholder="2-3 Years" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Required Qualification</label>
                  <input 
                    type="text" 
                    value={jobQual} 
                    onChange={(e) => setJobQual(e.target.value)}
                    placeholder="B.Ed, MA in English" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Job Description *</label>
                <textarea 
                  rows={3} 
                  required
                  value={jobDesc} 
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Summarize the key role responsibilities..." 
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Key Requirements & Skills (One point per line)</label>
                <textarea 
                  rows={4} 
                  value={jobReqsText} 
                  onChange={(e) => setJobReqsText(e.target.value)}
                  placeholder="Proficient in computer operations.&#10;Excellent communication skills." 
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Salary Offered</label>
                  <input 
                    type="text" 
                    value={jobSalary} 
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="As per school norms" 
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Sort Position</label>
                  <input 
                    type="number" 
                    value={jobSort} 
                    onChange={(e) => setJobSort(Number(e.target.value))}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Listing Active</label>
                  <select 
                    value={jobActive ? "true" : "false"} 
                    onChange={(e) => setJobActive(e.target.value === "true")}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold bg-[#081a3a] focus:outline-none focus:border-[#F7B801]"
                  >
                    <option value="true">Active (Published)</option>
                    <option value="false">Closed (Archived)</option>
                  </select>
                </div>
              </div>

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
                  disabled={saving} 
                  className="px-6 py-3 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] rounded-xl font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : editingId ? "Update Vacancy" : "Post Vacancy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Profile Details Popup */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c1f46] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#F7B801]">Candidate File</p>
                <h2 className="text-xl font-black">{selectedApp.name}</h2>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1">Applied For</p>
                  <p className="font-bold text-white text-sm">{selectedApp.jobTitle}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1">Date Submitted</p>
                  <p className="font-bold text-white text-sm">{new Date(selectedApp.appliedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1">Email Address</p>
                  <a href={`mailto:${selectedApp.email}`} className="font-bold text-[#F7B801] hover:underline flex items-center gap-1.5"><Mail size={12} /> {selectedApp.email}</a>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1">Phone Number</p>
                  <a href={`tel:${selectedApp.phone}`} className="font-bold text-[#F7B801] hover:underline flex items-center gap-1.5"><Phone size={12} /> {selectedApp.phone}</a>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1.5">Candidate Cover Message</p>
                <div className="p-4 rounded-2xl bg-black/25 text-xs text-white/85 leading-relaxed font-semibold max-h-40 overflow-y-auto">
                  {selectedApp.message || "(No cover letter/message submitted)"}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center bg-black/10 -mx-6 -mb-6 p-4">
                <a 
                  href={selectedApp.resume} 
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-[#F7B801] hover:bg-[#F18701] text-[#3D348B] px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors"
                >
                  <FileText size={14} />
                  Download Candidate CV
                </a>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
