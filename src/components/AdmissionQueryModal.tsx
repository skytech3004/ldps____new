"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, User, Mail, Phone, Calendar, MapPin, Building, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdmissionQueryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [useMobileForWhatsApp, setUseMobileForWhatsApp] = useState(true);

  const [formData, setFormData] = useState({
    admissionCategory: "",
    studentName: "",
    classApplied: "",
    streamSelected: "",
    parentName: "",
    contactNo: "",
    whatsAppNo: "",
    emailId: "",
    city: "",
    agreeToTerms: false,
  });

  const classesList = [
    "Nursery", "L.K.G.", "U.K.G.",
    "Class I", "Class II", "Class III", "Class IV", "Class V",
    "Class VI", "Class VII", "Class VIII", "Class IX", "Class X",
    "Class XI", "Class XII"
  ];

  const streamsList = ["Science", "Commerce", "Humanities"];
  const categoriesList = ["Day Scholar", "Boarder / Hostel"];

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };

    window.addEventListener("open-admission-modal", handleOpen);
    return () => {
      window.removeEventListener("open-admission-modal", handleOpen);
    };
  }, []);

  // Update WhatsApp Number if "Use mobile number" is checked
  useEffect(() => {
    if (useMobileForWhatsApp) {
      setFormData(prev => ({ ...prev, whatsAppNo: prev.contactNo }));
    }
  }, [formData.contactNo, useMobileForWhatsApp]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
      ...(name === "classApplied" && !value.includes("XI") && !value.includes("XII") ? { streamSelected: "" } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert("Please agree to receive communications to proceed.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: formData.parentName,
          studentName: formData.studentName,
          contactNo: formData.contactNo,
          emailId: formData.emailId,
          classApplied: formData.classApplied,
          streamSelected: formData.streamSelected,
          address: formData.city, // Storing City in the address field for database compatibility
          city: formData.city,
          admissionCategory: formData.admissionCategory,
          whatsAppNo: formData.whatsAppNo,
          reason: `Category: ${formData.admissionCategory}. WhatsApp: ${formData.whatsAppNo}. City: ${formData.city}`,
        }),
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal / Slider content container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10"
          >
            {/* Header banner */}
            <div className="bg-primary text-white p-6 relative shrink-0">
              <div className="absolute top-0 right-0 w-32 h-full bg-accent/10 rounded-bl-[10rem] pointer-events-none" />
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="bg-accent text-primary text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>Session 2026-27</span>
                </span>
                <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Admissions Open</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black font-montserrat uppercase tracking-tight text-accent">
                Admission Inquiry
              </h2>
              <p className="text-xs text-white/60 font-medium mt-1">
                Take the first step towards a bright, holistic future.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Select Admission Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Building size={13} className="text-accent" />
                      <span>Admission Category *</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categoriesList.map((cat) => (
                        <label
                          key={cat}
                          className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer text-xs font-bold transition-all text-center ${
                            formData.admissionCategory === cat
                              ? "border-accent bg-accent/5 text-primary shadow-sm font-black"
                              : "border-gray-200 hover:border-primary/20 text-gray-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="admissionCategory"
                            required
                            value={cat}
                            checked={formData.admissionCategory === cat}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <User size={13} className="text-accent" />
                      <span>Student Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="Child's Full Name"
                      className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Class */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={13} className="text-accent" />
                        <span>Class Applied *</span>
                      </label>
                      <select
                        name="classApplied"
                        required
                        value={formData.classApplied}
                        onChange={handleInputChange}
                        className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select Class</option>
                        {classesList.map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    {/* Stream dropdown if class XI/XII */}
                    {showStreamDropdown && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Building size={13} className="text-accent" />
                          <span>Stream Offered *</span>
                        </label>
                        <select
                          name="streamSelected"
                          required
                          value={formData.streamSelected}
                          onChange={handleInputChange}
                          className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                        >
                          <option value="">Select Stream</option>
                          {streamsList.map((stream) => (
                            <option key={stream} value={stream}>{stream}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <User size={13} className="text-accent" />
                      <span>Parent / Guardian Name *</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="Father's or Mother's Name"
                      className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Contact Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={13} className="text-accent" />
                        <span>Mobile Number *</span>
                      </label>
                      <input
                        type="tel"
                        name="contactNo"
                        required
                        pattern="[0-9]{10}"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        placeholder="10-Digit Mobile No"
                        className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Phone size={13} className="text-accent" />
                          <span>WhatsApp Number *</span>
                        </label>
                        <label className="flex items-center gap-1 text-[9px] text-gray-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useMobileForWhatsApp}
                            onChange={(e) => setUseMobileForWhatsApp(e.target.checked)}
                            className="rounded text-primary border-gray-300 focus:ring-accent"
                          />
                          <span>Same as Mobile</span>
                        </label>
                      </div>
                      <input
                        type="tel"
                        name="whatsAppNo"
                        required
                        disabled={useMobileForWhatsApp}
                        value={formData.whatsAppNo}
                        onChange={handleInputChange}
                        placeholder="WhatsApp Number"
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                          useMobileForWhatsApp 
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                            : "bg-[#F8F9FC] border-gray-200 hover:border-gray-300 focus:border-accent text-primary"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email ID */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={13} className="text-accent" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        required
                        value={formData.emailId}
                        onChange={handleInputChange}
                        placeholder="parent@example.com"
                        className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={13} className="text-accent" />
                        <span>City *</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter City Name"
                        className="w-full bg-[#F8F9FC] border border-gray-200 hover:border-gray-300 focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Privacy Policy and Communications Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-0.5 rounded text-accent border-gray-300 focus:ring-accent"
                    />
                    <span className="text-[10px] text-gray-500 leading-relaxed font-semibold">
                      I agree to receive admission details and information by signing up on behalf of my child for Leeladevi Parasmal Sancheti English Medium School. *
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-80 active:scale-[0.98]"
                  >
                    <span>{loading ? "Submitting Inquiry..." : "Submit Inquiry"}</span>
                    {!loading && <Send size={14} />}
                  </button>
                </form>
              ) : (
                // Success screen inside the slider
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <CheckCircle className="text-accent mx-auto animate-bounce" size={56} />
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                      Thank You!
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
                      Your inquiry for <strong className="text-primary">{formData.studentName}</strong> (Class {formData.classApplied}) has been received successfully.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600 font-bold space-y-2 max-w-xs mx-auto text-left">
                    <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
                      <span className="text-gray-400 font-medium">Category:</span>
                      <span>{formData.admissionCategory}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
                      <span className="text-gray-400 font-medium">Mobile No:</span>
                      <span>{formData.contactNo}</span>
                    </div>
                    {formData.whatsAppNo && formData.whatsAppNo !== formData.contactNo && (
                      <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
                        <span className="text-gray-400 font-medium">WhatsApp:</span>
                        <span>{formData.whatsAppNo}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">City:</span>
                      <span>{formData.city}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider max-w-xs mx-auto">
                    An admissions counselor will get back to you within 24 hours.
                  </p>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        admissionCategory: "",
                        studentName: "",
                        classApplied: "",
                        streamSelected: "",
                        parentName: "",
                        contactNo: "",
                        whatsAppNo: "",
                        emailId: "",
                        city: "",
                        agreeToTerms: false,
                      });
                      setUseMobileForWhatsApp(true);
                    }}
                    className="inline-flex items-center gap-1 text-primary hover:text-accent font-black uppercase text-xs tracking-wider transition-colors"
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
