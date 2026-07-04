"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, Check, X, Trash2, Loader2, ArrowUpDown, ClipboardList, Calendar, MapPin, Mail, Phone, BookOpen, GraduationCap, Briefcase } from "lucide-react";

type AlumniRecord = {
  _id: string;
  fullName: string;
  parentsName: string;
  dateOfBirth: string;
  mobileNumber: string;
  alternateMobile?: string;
  emailId: string;
  permanentAddress: string;
  classCompleted: string;
  passingYear: string;
  admissionYear?: string;
  rollNumber?: string;
  occupation?: string;
  organization?: string;
  officeAddress?: string;
  workEmail?: string;
  higherEducation?: string;
  institutionName?: string;
  completionYear?: string;
  achievements?: string;
  skills?: string;
  willingToMentor: boolean;
  interestedInEvents: boolean;
  status: "Pending" | "Approved" | "Rejected";
  notes?: string;
  createdAt: string;
};

export default function AdminAlumniPage() {
  const [items, setItems] = useState<AlumniRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<AlumniRecord | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/alumni", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch alumni records.");
      }
      setItems(data as AlumniRecord[]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load alumni records.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function updateStatus(id: string, newStatus: "Pending" | "Approved" | "Rejected", notesToSave = adminNotes) {
    try {
      setUpdatingId(id);
      const response = await fetch("/api/admin/alumni", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, notes: notesToSave }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update record.");
      }

      // Update local state
      setItems((prev) => prev.map((item) => (item._id === id ? { ...item, status: newStatus, notes: notesToSave } : item)));
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord({ ...selectedRecord, status: newStatus, notes: notesToSave });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteRecord(id: string) {
    if (!window.confirm("Are you sure you want to permanently delete this alumni registration?")) return;

    try {
      const response = await fetch("/api/admin/alumni", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete record.");
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
      if (selectedRecord?._id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  const openDetailsModal = (record: AlumniRecord) => {
    setSelectedRecord(record);
    setAdminNotes(record.notes ?? "");
  };

  const handleNotesSave = async () => {
    if (!selectedRecord) return;
    await updateStatus(selectedRecord._id, selectedRecord.status, adminNotes);
    alert("Admin notes saved successfully.");
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.emailId.toLowerCase().includes(search.toLowerCase()) ||
      item.passingYear.includes(search);

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesClass = classFilter === "All" || item.classCompleted === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <>
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden text-[#0b1738]">
        {/* Header Block */}
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7678ED]">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-[#3D348B] mt-2">Alumni Registrations</h1>
            <p className="text-sm text-slate-500 mt-2">View and manage registration requests submitted by school alumni.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchItems}
              className="inline-flex items-center gap-1.5 px-4 h-11 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or year of passing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7678ED] text-sm font-semibold"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-3.5 h-11 rounded-xl border border-slate-200">
              <Filter size={15} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 h-11 rounded-xl border border-slate-200">
              <Filter size={15} className="text-slate-400" />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="All">All Classes</option>
                <option value="Class X">Class X</option>
                <option value="Class XII">Class XII</option>
                <option value="Both X & XII">Both X & XII</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listing Table */}
        <div className="overflow-x-auto p-6">
          {error ? <p className="mb-4 text-sm font-semibold text-red-500">{error}</p> : null}
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500/70 border-b border-slate-100">
                <th className="py-3 pr-4 font-black">Full Name</th>
                <th className="py-3 pr-4 font-black">Contacts</th>
                <th className="py-3 pr-4 font-black">Class Info</th>
                <th className="py-3 pr-4 font-black">Profession</th>
                <th className="py-3 pr-4 font-black">Status</th>
                <th className="py-3 pr-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin inline mr-2 text-[#3D348B]" />
                    Fetching alumni registrations...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No matching registrations found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{item.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          Submitted on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs space-y-1">
                      <p className="font-semibold text-slate-600 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" />
                        {item.emailId}
                      </p>
                      <p className="font-semibold text-slate-600 flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        {item.mobileNumber}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-xs space-y-1">
                      <p className="font-black text-slate-700">{item.classCompleted}</p>
                      <p className="font-semibold text-slate-500">
                        Batch: {item.passingYear} (Out)
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-xs">
                      {item.occupation ? (
                        <div>
                          <p className="font-black text-slate-700">{item.occupation}</p>
                          <p className="text-slate-500 font-medium">{item.organization || "Independent"}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Not Specified</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === "Approved"
                            ? "bg-green-50 text-green-600"
                            : item.status === "Rejected"
                            ? "bg-red-50 text-red-500"
                            : "bg-[#7678ED]/10 text-[#3D348B]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openDetailsModal(item)}
                          className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-800 flex items-center justify-center transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {item.status !== "Approved" && (
                          <button
                            onClick={() => updateStatus(item._id, "Approved")}
                            disabled={updatingId === item._id}
                            className="w-9 h-9 rounded-lg hover:bg-green-50 text-slate-600 hover:text-green-600 flex items-center justify-center transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {item.status !== "Rejected" && (
                          <button
                            onClick={() => updateStatus(item._id, "Rejected")}
                            disabled={updatingId === item._id}
                            className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteRecord(item._id)}
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* detail modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 text-[#0b1738] flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 bg-[#3D348B] text-white flex items-center justify-between shrink-0">
              <div className="inline-flex items-center gap-2">
                <ClipboardList size={20} className="text-[#F7B801]" />
                <h3 className="text-lg font-black tracking-wide">Alumni Registration Profile</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable container for modal contents */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              {/* Profile Card Header */}
              <div className="flex justify-between items-start bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-lg font-black text-[#3D348B]">{selectedRecord.fullName}</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wide">
                    Batch of {selectedRecord.passingYear} (Out of school)
                  </p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    selectedRecord.status === "Approved"
                      ? "bg-green-50 text-green-600"
                      : selectedRecord.status === "Rejected"
                      ? "bg-red-50 text-red-500"
                      : "bg-[#7678ED]/10 text-[#3D348B]"
                  }`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              {/* Grid sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h5 className="font-black text-[#3D348B] uppercase tracking-wider text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#F7B801]" />
                    Personal details
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Parent's Name:</strong> {selectedRecord.parentsName}</p>
                    <p><strong>Date of Birth:</strong> {new Date(selectedRecord.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Email ID:</strong> {selectedRecord.emailId}</p>
                    <p><strong>Mobile No:</strong> {selectedRecord.mobileNumber}</p>
                    {selectedRecord.alternateMobile && <p><strong>Alt Mobile:</strong> {selectedRecord.alternateMobile}</p>}
                    <p><strong>Permanent Address:</strong> {selectedRecord.permanentAddress}</p>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-3">
                  <h5 className="font-black text-[#3D348B] uppercase tracking-wider text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-[#F7B801]" />
                    Academic history
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Class Completed:</strong> {selectedRecord.classCompleted}</p>
                    <p><strong>Passing Year:</strong> {selectedRecord.passingYear}</p>
                    {selectedRecord.admissionYear && <p><strong>Admission Year:</strong> {selectedRecord.admissionYear}</p>}
                    {selectedRecord.rollNumber && <p><strong>Roll Number:</strong> {selectedRecord.rollNumber}</p>}
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-3">
                  <h5 className="font-black text-[#3D348B] uppercase tracking-wider text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#F7B801]" />
                    Current profession
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600">
                    {selectedRecord.occupation ? (
                      <>
                        <p><strong>Occupation:</strong> {selectedRecord.occupation}</p>
                        <p><strong>Organization:</strong> {selectedRecord.organization}</p>
                        {selectedRecord.officeAddress && <p><strong>Office Address:</strong> {selectedRecord.officeAddress}</p>}
                        {selectedRecord.workEmail && <p><strong>Work Email:</strong> {selectedRecord.workEmail}</p>}
                      </>
                    ) : (
                      <p className="italic text-slate-400">No professional details supplied.</p>
                    )}
                  </div>
                </div>

                {/* Higher Education */}
                <div className="space-y-3">
                  <h5 className="font-black text-[#3D348B] uppercase tracking-wider text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#F7B801]" />
                    Higher Education
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600">
                    {selectedRecord.higherEducation ? (
                      <>
                        <p><strong>Course/Program:</strong> {selectedRecord.higherEducation}</p>
                        <p><strong>Institution:</strong> {selectedRecord.institutionName}</p>
                        {selectedRecord.completionYear && <p><strong>Completion Year:</strong> {selectedRecord.completionYear}</p>}
                      </>
                    ) : (
                      <p className="italic text-slate-400">No higher education details supplied.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements & Skills */}
              <div className="space-y-4 pt-2">
                {selectedRecord.achievements && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h6 className="font-black text-[#3D348B] text-xs uppercase tracking-wide mb-1">Key Achievements</h6>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedRecord.achievements}</p>
                  </div>
                )}
                {selectedRecord.skills && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h6 className="font-black text-[#3D348B] text-xs uppercase tracking-wide mb-1">Skills & Area of Expertise</h6>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedRecord.skills}</p>
                  </div>
                )}
              </div>

              {/* Engagement Willingness */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 text-slate-600">
                  <Check size={14} className={selectedRecord.willingToMentor ? "text-green-500" : "text-slate-300"} />
                  Willing to Mentor: {selectedRecord.willingToMentor ? "Yes" : "No"}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 text-slate-600">
                  <Check size={14} className={selectedRecord.interestedInEvents ? "text-green-500" : "text-slate-300"} />
                  Interested in Events: {selectedRecord.interestedInEvents ? "Yes" : "No"}
                </div>
              </div>

              {/* Internal Administration block */}
              <div className="bg-[#3D348B]/5 p-5 rounded-2xl border border-[#3D348B]/10 space-y-3 pt-4">
                <h6 className="text-xs font-black uppercase tracking-wider text-[#3D348B]">Internal Notes & Review</h6>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add administrative or internal verification notes here..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] text-xs font-semibold resize-none bg-white"
                />
                <div className="flex justify-between items-center gap-3">
                  <button
                    onClick={handleNotesSave}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-extrabold text-[10px] uppercase tracking-wide transition-colors"
                  >
                    Save Notes
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedRecord._id, "Approved")}
                      disabled={selectedRecord.status === "Approved" || updatingId === selectedRecord._id}
                      className="px-4.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedRecord._id, "Rejected")}
                      disabled={selectedRecord.status === "Rejected" || updatingId === selectedRecord._id}
                      className="px-4.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
