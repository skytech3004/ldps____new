"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlumniPage() {
  const [form, setForm] = useState({
    fullName: "",
    parentsName: "",
    dateOfBirth: "",
    mobileNumber: "",
    alternateMobile: "",
    emailId: "",
    permanentAddress: "",
    classCompleted: "Class XII",
    passingYear: "",
    admissionYear: "",
    rollNumber: "",
    occupation: "",
    organization: "",
    officeAddress: "",
    workEmail: "",
    higherEducation: "",
    institutionName: "",
    completionYear: "",
    achievements: "",
    skills: "",
    willingToMentor: false,
    interestedInEvents: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to submit registration.");
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-white to-[#7678ED]/5 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#7678ED]/10 text-[#3D348B] mb-2 shadow-inner">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] tracking-tight uppercase">
              Alumni Registration
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto">
              Welcome back, alumni! Stay connected with your alma mater, share your accomplishments, and inspire the next generation of LPS leaders.
            </p>
            <div className="w-16 h-1.5 bg-[#F7B801] mx-auto rounded-full shadow-sm" />
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 md:p-12 text-center border border-slate-100 shadow-[0_20px_50px_rgba(61,52,139,0.06)] space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border-4 border-green-100">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-[#3D348B]">Registration Submitted!</h2>
                  <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                    Thank you for registering with the LPS Vidyawadi Alumni Network. Your form has been received and is currently under review by our administration.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left max-w-md mx-auto text-xs space-y-2 text-slate-600">
                  <p><strong>Name:</strong> {form.fullName}</p>
                  <p><strong>Class Completed:</strong> {form.classCompleted}</p>
                  <p><strong>Passing Year:</strong> {form.passingYear}</p>
                  <p><strong>Email ID:</strong> {form.emailId}</p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({
                      fullName: "",
                      parentsName: "",
                      dateOfBirth: "",
                      mobileNumber: "",
                      alternateMobile: "",
                      emailId: "",
                      permanentAddress: "",
                      classCompleted: "Class XII",
                      passingYear: "",
                      admissionYear: "",
                      rollNumber: "",
                      occupation: "",
                      organization: "",
                      officeAddress: "",
                      workEmail: "",
                      higherEducation: "",
                      institutionName: "",
                      completionYear: "",
                      achievements: "",
                      skills: "",
                      willingToMentor: false,
                      interestedInEvents: false,
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-[#3D348B] text-white font-black text-xs uppercase tracking-wider hover:bg-[#7678ED] transition-colors"
                >
                  Register Another Member
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(61,52,139,0.04)] space-y-8"
              >
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Section 1: Personal Details */}
                <div className="space-y-6">
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3D348B] text-white text-[11px] flex items-center justify-center">1</span>
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Ms. Jane Doe"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Father's/Mother's Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentsName"
                        value={form.parentsName}
                        onChange={handleChange}
                        required
                        placeholder="Parent name"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +91 9414000000"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Alternate Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="alternateMobile"
                        value={form.alternateMobile}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Email ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        value={form.emailId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. jane@example.com"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Permanent Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="permanentAddress"
                        value={form.permanentAddress}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Street, City, State, ZIP code"
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Details */}
                <div className="space-y-6">
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3D348B] text-white text-[11px] flex items-center justify-center">2</span>
                    Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Class Completed <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="classCompleted"
                        value={form.classCompleted}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold bg-white"
                      >
                        <option value="Class X">Class X</option>
                        <option value="Class XII">Class XII</option>
                        <option value="Both X & XII">Both Class X & XII</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Year of Passing (Out of School) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="passingYear"
                        value={form.passingYear}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 2020"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Year of Admission (Approximate)
                      </label>
                      <input
                        type="text"
                        name="admissionYear"
                        value={form.admissionYear}
                        onChange={handleChange}
                        placeholder="e.g. 2012"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Roll Number / Board Roll No
                      </label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={form.rollNumber}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Professional Details (Optional) */}
                <div className="space-y-6">
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3D348B] text-white text-[11px] flex items-center justify-center">3</span>
                    Professional details (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Occupation / Designation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer, Doctor"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Organization / Company Name
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="e.g. Tech Corp"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Office Address
                      </label>
                      <textarea
                        name="officeAddress"
                        value={form.officeAddress}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Office address"
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        name="workEmail"
                        value={form.workEmail}
                        onChange={handleChange}
                        placeholder="e.g. work@example.com"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Higher Education (Optional) */}
                <div className="space-y-6">
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3D348B] text-white text-[11px] flex items-center justify-center">4</span>
                    Higher Education (If Applicable)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Course / Program Pursued
                      </label>
                      <input
                        type="text"
                        name="higherEducation"
                        value={form.higherEducation}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech Computer Science, MBBS, MBA"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        University / Institution Name
                      </label>
                      <input
                        type="text"
                        name="institutionName"
                        value={form.institutionName}
                        onChange={handleChange}
                        placeholder="e.g. IIT, AIIMS, JNVU"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Year of Completion
                      </label>
                      <input
                        type="text"
                        name="completionYear"
                        value={form.completionYear}
                        onChange={handleChange}
                        placeholder="e.g. 2024"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3D348B] text-white text-[11px] flex items-center justify-center">5</span>
                    Additional Information (Optional)
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Key Achievements (Academic or Professional)
                      </label>
                      <textarea
                        name="achievements"
                        value={form.achievements}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Describe any major milestones or awards..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Skills / Area of Expertise
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="e.g. Programming, Public Speaking, Management"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7678ED] transition-colors text-sm font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <label className="relative flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <input
                          type="checkbox"
                          name="willingToMentor"
                          checked={form.willingToMentor}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-slate-300 text-[#3D348B] focus:ring-[#7678ED]"
                        />
                        <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                          Willing to Mentor Students?
                        </span>
                      </label>

                      <label className="relative flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <input
                          type="checkbox"
                          name="interestedInEvents"
                          checked={form.interestedInEvents}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-slate-300 text-[#3D348B] focus:ring-[#7678ED]"
                        />
                        <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                          Interested in Alumni Events?
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Declaration Block */}
                <div className="bg-[#3D348B]/5 p-5 rounded-2xl border border-[#3D348B]/10 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#3D348B] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#F7B801]" />
                    Declaration & Verification
                  </h4>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 w-5 h-5 rounded border-slate-300 text-[#3D348B] focus:ring-[#7678ED]"
                    />
                    <span className="text-xs font-bold text-slate-600 leading-normal">
                      I hereby confirm that all information provided in this registration form is accurate, true, and complete to the best of my knowledge.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#3D348B] hover:bg-[#7678ED] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#3D348B]/20 hover:shadow-xl hover:shadow-[#7678ED]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Alumni Form
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
