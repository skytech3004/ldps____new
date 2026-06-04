"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, CheckCircle, User, Mail, Phone, Calendar, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplyForAdmission() {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    contactNo: "",
    emailId: "",
    classApplied: "",
    streamSelected: "",
    address: "",
    reason: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const classesList = [
    "Nursery", "L.K.G.", "U.K.G.",
    "Class I", "Class II", "Class III", "Class IV", "Class V",
    "Class VI", "Class VII", "Class VIII", "Class IX", "Class X",
    "Class XI", "Class XII"
  ];

  const streamsList = ["Science", "Commerce", "Humanities"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Clear stream if class is not XI/XII
      ...(name === "classApplied" && !value.includes("XI") && !value.includes("XII") ? { streamSelected: "" } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry.");
      }

      setIsSubmitted(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showStreamDropdown = formData.classApplied.includes("XI") || formData.classApplied.includes("XII");

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Decorative Breadcrumb Banner */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">Apply For Admission</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Admission Inquiry
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Begin your daughter&apos;s educational adventure. Submit an online inquiry form.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form Info & Contact */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Start Admission</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Online Inquiry Portal
              </h2>
              <div className="h-1.5 w-24 bg-accent rounded-full" />
            </div>

            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              We welcome applications for girls from Nursery up to Class XI. Fill out this inquiry form, 
              and our admissions counselor will review your submission and contact you within one business day 
              to guide you through the registration process.
            </p>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-6 md:p-8 space-y-4">
              <h4 className="text-primary font-black uppercase text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent" />
                <span>Admission Desk Assistance</span>
              </h4>
              <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                If you prefer to consult our counsellors directly over a call, feel free to reach out to:
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-primary">Office Helpline 1: <a href="tel:6377203204" className="text-accent-hover font-black hover:underline">6377203204</a></p>
                <p className="text-sm font-bold text-primary">Office Helpline 2: <a href="tel:6377204209" className="text-accent-hover font-black hover:underline">6377204209</a></p>
              </div>
            </div>
          </div>

          {/* Right Column: The Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[8rem] -z-10" />

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Parent Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <User size={14} className="text-accent" />
                        <span>Parent / Guardian Name *</span>
                      </label>
                      <input 
                        type="text" 
                        name="parentName" 
                        required 
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="Father's or Mother's Name" 
                        className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    {/* Student Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <User size={14} className="text-accent" />
                        <span>Student Name *</span>
                      </label>
                      <input 
                        type="text" 
                        name="studentName" 
                        required 
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Child's Full Name" 
                        className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Phone size={14} className="text-accent" />
                        <span>Contact Number *</span>
                      </label>
                      <input 
                        type="tel" 
                        name="contactNo" 
                        required 
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        placeholder="10-Digit Mobile No" 
                        className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    {/* Email ID */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Mail size={14} className="text-accent" />
                        <span>Email ID *</span>
                      </label>
                      <input 
                        type="email" 
                        name="emailId" 
                        required 
                        value={formData.emailId}
                        onChange={handleInputChange}
                        placeholder="parent@example.com" 
                        className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Class Applied */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14} className="text-accent" />
                        <span>Class Applied For *</span>
                      </label>
                      <select 
                        name="classApplied" 
                        required 
                        value={formData.classApplied}
                        onChange={handleInputChange}
                        className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select Target Class</option>
                        {classesList.map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic Stream Dropdown */}
                    {showStreamDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck size={14} className="text-accent" />
                          <span>Stream Offered *</span>
                        </label>
                        <select 
                          name="streamSelected" 
                          required 
                          value={formData.streamSelected}
                          onChange={handleInputChange}
                          className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="">Select Stream</option>
                          {streamsList.map((stream) => (
                            <option key={stream} value={stream}>{stream}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </div>

                  {/* Postal Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">
                      Postal Address
                    </label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Current residence address" 
                      className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Message / Reason */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">
                      Additional Message / Queries
                    </label>
                    <textarea 
                      name="reason" 
                      rows={4}
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Mention any queries, specific interests, or special needs." 
                      className="w-full bg-[#F8F9FC] border border-primary/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-secondary text-white font-extrabold uppercase text-xs md:text-sm tracking-widest py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-75"
                  >
                    <span>{loading ? "Submitting Inquiry..." : "Submit Admission Inquiry"}</span>
                    {!loading && <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                  </button>
                </motion.form>
              ) : (
                // Success overlay state
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <CheckCircle className="text-accent mx-auto animate-bounce" size={64} />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                      Inquiry Submitted!
                    </h3>
                    <p className="text-gray-500 font-medium text-xs md:text-sm max-w-md mx-auto">
                      Thank you for submitting an inquiry for **{formData.studentName}** to Class **{formData.classApplied}** 
                      {formData.streamSelected ? ` (${formData.streamSelected} Stream)` : ""}.
                    </p>
                  </div>
                  
                  <div className="bg-[#F8F9FC] border border-primary/5 rounded-2xl p-6 max-w-sm mx-auto text-xs md:text-sm text-gray-600 font-semibold space-y-1.5 shadow-inner">
                    <p>📞 Confirmed Contact: **{formData.contactNo}**</p>
                    <p>✉️ Confirmation Email: **{formData.emailId}**</p>
                  </div>

                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider max-w-xs mx-auto">
                    Our Admissions desk counselor will review your inquiry and reach out within 24 hours.
                  </p>

                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        parentName: "",
                        studentName: "",
                        contactNo: "",
                        emailId: "",
                        classApplied: "",
                        streamSelected: "",
                        address: "",
                        reason: ""
                      });
                    }}
                    className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-extrabold uppercase text-xs tracking-wider transition-all"
                  >
                    <span>Submit another inquiry</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: "Eligibility Criteria", slug: "/eligibility-criteria", desc: "View the required documents checklist and timeline policies." },
            { title: "Fee Structure", slug: "/fee-structure", desc: "View ICICI direct bank account details and deposits." },
            { title: "Fee Policy", slug: "/fee-policy", desc: "Understand withdrawals, calendar deadlines, and refund policies." }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.slug} 
              className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <h4 className="text-base font-black text-primary uppercase font-montserrat flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-gray-500 text-xs font-semibold mt-2">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
