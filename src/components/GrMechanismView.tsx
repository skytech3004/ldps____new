"use client";

import React, { useState } from "react";
import { MessageSquare, Users, CheckCircle2, ShieldCheck, Mail, Send } from "lucide-react";

export default function GrMechanismView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Academic",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Mimic API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", category: "Academic", message: "" });
    }, 1000);
  };

  return (
    <div className="space-y-12">
      {/* Policy and Committee Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-center space-y-4">
          <span className="text-[#F18701] font-black uppercase tracking-[0.25em] text-xs block">
            Redressal Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#3D348B] uppercase tracking-tight">
            Grievance Redressal Mechanism
          </h2>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            We believe in fostering a transparent, healthy, and communicative academic environment. Our dedicated Grievance Redressal Committee is tasked with resolving any student, parent, or staff concerns with complete impartiality, speed, and discretion.
          </p>
          <div className="border-t border-slate-100 pt-4 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-[#3D348B] uppercase">Committee Convener</p>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Mrs. Kiran Vyas (Vice-Principal)</p>
            </div>
          </div>
        </div>

        {/* Resolution Procedure */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm space-y-4">
          <h3 className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck size={20} className="text-[#7678ED]" />
            Resolution Procedure
          </h3>
          <div className="space-y-4 text-xs font-medium text-slate-600">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7678ED]/10 text-[#7678ED] font-black flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-extrabold text-[#3D348B] uppercase">Step 1: Contact Counselor/Class Teacher</p>
                <p className="mt-0.5 leading-relaxed">Initial concerns should be emailed or submitted in writing to the respective Class Coordinator.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7678ED]/10 text-[#7678ED] font-black flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-extrabold text-[#3D348B] uppercase">Step 2: Grievance Committee Appeal</p>
                <p className="mt-0.5 leading-relaxed">If unresolved, fill out the online submission form or draft an appeal to the Vice-Principal.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7678ED]/10 text-[#7678ED] font-black flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-extrabold text-[#3D348B] uppercase">Step 3: Direct Principal Appeal</p>
                <p className="mt-0.5 leading-relaxed">Escalate directly to the Principal’s office for complex matters via email (lpsvidhyawadi@gmail.com).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grievance Submission Form */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 max-w-2xl mx-auto shadow-sm">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="mx-auto text-green-500" size={56} />
            <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Grievance Submitted</h3>
            <p className="text-slate-500 font-semibold text-sm max-w-md mx-auto leading-relaxed">
              Thank you for sharing your concern. The grievance registration registry has logged your ticket and Mrs. Kiran Vyas will review and contact you within 48 business hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 inline-flex items-center gap-2 bg-[#3D348B] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#7678ED] transition-colors text-xs uppercase tracking-wider"
            >
              Submit Another Grievance
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <MessageSquare className="text-accent" size={24} />
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">Submit Grievance Online</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Please fill out this form to file a formal concern</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Grievance Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:border-[#7678ED] focus:outline-none transition-all appearance-none"
              >
                <option value="Academic">Academic / Classrooms</option>
                <option value="Facilities">Hostel & Campus Facilities</option>
                <option value="Transport">Bus / Fleet Service</option>
                <option value="Fee">Fees & Accounts Office</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">Grievance Description *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Please provide details of your concern..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:border-[#7678ED] focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#3D348B] hover:bg-[#7678ED] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3d348b]/15 transition-all disabled:opacity-70 cursor-pointer"
            >
              <Send size={14} />
              <span>{loading ? "Submitting..." : "Submit Grievance"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
