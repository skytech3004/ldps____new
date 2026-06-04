"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit3, 
  FileText, 
  HelpCircle,
  Eye,
  X,
  Loader2,
  Check,
  Save,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Inquiry {
  _id: string;
  parentName: string;
  studentName: string;
  contactNo: string;
  whatsAppNo?: string;
  emailId: string;
  classApplied: string;
  streamSelected?: string;
  address?: string;
  city?: string;
  admissionCategory?: string;
  reason?: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Selection & Edit States
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) throw new Error("Failed to fetch.");
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleOpenDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setEditStatus(inquiry.status);
    setEditNotes(inquiry.notes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry._id,
          status: editStatus,
          notes: editNotes
        })
      });

      if (!res.ok) throw new Error("Failed to update.");
      const updated = await res.json();
      
      // Update local state
      setInquiries((prev) => prev.map((item) => item._id === updated._id ? updated : item));
      setSelectedInquiry(updated);
      alert("Inquiry status updated successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admission inquiry? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Deletion failed.");
      
      setInquiries((prev) => prev.filter((item) => item._id !== id));
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
      alert("Inquiry record deleted successfully.");
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.parentName.toLowerCase().includes(query) || 
      item.studentName.toLowerCase().includes(query) ||
      item.contactNo.includes(query) ||
      item.emailId.toLowerCase().includes(query);

    const matchesClass = filterClass ? item.classApplied === filterClass : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New Inquiry":
        return "bg-cyan-500/25 border-cyan-400 text-cyan-300";
      case "Contacted/Called":
        return "bg-yellow-500/25 border-yellow-400 text-yellow-300";
      case "Campus Visit Scheduled":
        return "bg-purple-500/25 border-purple-400 text-purple-300";
      case "Admitted":
        return "bg-green-500/25 border-green-400 text-green-300";
      case "Archived":
        return "bg-gray-500/25 border-gray-400 text-gray-300";
      default:
        return "bg-white/10 border-white/20 text-white";
    }
  };

  const uniqueClasses = Array.from(new Set(inquiries.map((item) => item.classApplied)));
  const statusOptions = ["New Inquiry", "Contacted/Called", "Campus Visit Scheduled", "Admitted", "Archived"];

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Administration</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <ClipboardList size={36} className="text-accent" />
            <span>Admissions Portal</span>
          </h1>
          <p className="text-white/70 mt-2">Track, filter, and log follow-ups for parent inquiries.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 flex flex-wrap gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parent, child, email, phone..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Filter size={14} className="text-accent" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white/80 focus:outline-none border-none cursor-pointer"
            >
              <option value="" className="bg-[#0f234f] text-white">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls} className="bg-[#0f234f] text-white">{cls}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Filter size={14} className="text-accent" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white/80 focus:outline-none border-none cursor-pointer"
            >
              <option value="" className="bg-[#0f234f] text-white">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status} className="bg-[#0f234f] text-white">{status}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Datatable list */}
      <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading inquiries database...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center text-white/40 space-y-2">
            <HelpCircle size={40} className="mx-auto text-white/20" />
            <h4 className="text-base font-black uppercase tracking-tight">No Inquiries Found</h4>
            <p className="text-xs font-semibold">Try modifying your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] md:text-xs font-black uppercase text-white/60 tracking-wider">
                  <th className="py-4 px-6">Student & Parent</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Target Class</th>
                  <th className="py-4 px-6">Submitted On</th>
                  <th className="py-4 px-6">Follow-up Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4.5 px-6">
                      <p className="font-black text-white">{inquiry.studentName}</p>
                      <p className="text-xs text-white/60 mt-0.5">Parent: {inquiry.parentName}</p>
                      {inquiry.admissionCategory && (
                        <p className="text-[10px] text-accent/80 font-bold mt-0.5">Category: {inquiry.admissionCategory}</p>
                      )}
                    </td>
                    <td className="py-4.5 px-6 font-medium">
                      <p className="text-white/90">Mob: {inquiry.contactNo}</p>
                      {inquiry.whatsAppNo && inquiry.whatsAppNo !== inquiry.contactNo && (
                        <p className="text-xs text-green-400 mt-0.5">WA: {inquiry.whatsAppNo}</p>
                      )}
                      <p className="text-xs text-white/50 mt-0.5">{inquiry.emailId}</p>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="font-extrabold text-accent">
                        {inquiry.classApplied}
                        {inquiry.streamSelected ? ` (${inquiry.streamSelected})` : ""}
                      </span>
                      {(inquiry.city || inquiry.address) && (
                        <p className="text-xs text-white/60 mt-0.5">City: {inquiry.city || inquiry.address}</p>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-white/60 font-medium">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-block px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right space-x-2 shrink-0">
                      <button 
                        onClick={() => handleOpenDetail(inquiry)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-accent hover:text-primary transition-colors"
                        title="View & Edit Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inquiry._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out/Overlay Detail & Edit Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c1f46] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-[#081736] flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-accent tracking-widest">Inquiry Console</p>
                  <h3 className="text-xl font-black text-white font-montserrat uppercase tracking-tight">
                    Inquiry Details
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Left Column Fields */}
                  <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5 font-semibold text-xs md:text-sm">
                    <h4 className="text-xs font-black uppercase tracking-wider text-accent border-b border-white/5 pb-2 mb-3">Applicant Profiles</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-white/50 block uppercase">Student Full Name</span>
                        <span className="text-white font-black">{selectedInquiry.studentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block uppercase">Parent / Guardian Name</span>
                        <span className="font-bold text-white/90">{selectedInquiry.parentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block uppercase">Class Applied For</span>
                        <span className="font-black text-accent">
                          {selectedInquiry.classApplied}
                          {selectedInquiry.streamSelected ? ` (${selectedInquiry.streamSelected} Stream)` : ""}
                        </span>
                      </div>
                      {selectedInquiry.admissionCategory && (
                        <div>
                          <span className="text-[10px] text-white/50 block uppercase">Admission Category</span>
                          <span className="font-bold text-white">{selectedInquiry.admissionCategory}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5 font-semibold text-xs md:text-sm">
                    <h4 className="text-xs font-black uppercase tracking-wider text-accent border-b border-white/5 pb-2 mb-3">Contact details</h4>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2.5 items-center">
                        <Phone size={14} className="text-accent shrink-0" />
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase">Mobile Phone</span>
                          <a href={`tel:${selectedInquiry.contactNo}`} className="text-white hover:underline">{selectedInquiry.contactNo}</a>
                        </div>
                      </div>
                      {selectedInquiry.whatsAppNo && (
                        <div className="flex gap-2.5 items-center">
                          <Phone size={14} className="text-green-400 shrink-0" />
                          <div>
                            <span className="text-[9px] text-white/40 block uppercase">WhatsApp Phone</span>
                            <a href={`https://wa.me/${selectedInquiry.whatsAppNo}`} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{selectedInquiry.whatsAppNo}</a>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2.5 items-center">
                        <Mail size={14} className="text-accent shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] text-white/40 block uppercase">Email Address</span>
                          <a href={`mailto:${selectedInquiry.emailId}`} className="text-white hover:underline truncate block">{selectedInquiry.emailId}</a>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <MessageSquare size={14} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase">City & Address</span>
                          <span className="text-white/80">{selectedInquiry.city || selectedInquiry.address || "Not Provided"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Parent Message Details */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] text-white/50 block font-black uppercase tracking-wider">Parent message & query</span>
                  <p className="text-xs md:text-sm font-medium leading-relaxed text-white/80 italic bg-[#081736]/40 p-4 rounded-xl border border-white/5">
                    &ldquo;{selectedInquiry.reason || "No query message was attached with the inquiry."}&rdquo;
                  </p>
                </div>

                {/* Follow-up Console */}
                <form onSubmit={handleUpdateStatus} className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-accent">Admin Follow-up console</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <label className="text-xs font-bold text-white/70 uppercase">Inquiry Processing Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="sm:col-span-2 bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/70 uppercase">Staff Internal Follow-up Notes</label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add phone call logs, scheduled visit dates, or internal comments..."
                      rows={3}
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white resize-none"
                    />
                  </div>

                  {/* Save Dues Action */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      className="bg-white/5 border border-white/10 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-accent hover:bg-accent-hover text-primary font-black text-xs uppercase px-5 py-3 rounded-xl transition-all flex items-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                      <span>Save Follow-up Details</span>
                    </button>
                  </div>
                </form>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
