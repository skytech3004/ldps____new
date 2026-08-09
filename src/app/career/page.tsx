"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RichHtmlContent from "@/components/RichHtmlContent";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";
import { 
  Briefcase, Heart, Shield, ArrowRight, X, Upload, 
  CheckCircle2, DollarSign, Award, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type JobOpening = {
  _id: string;
  title: string;
  department: string;
  experience: string;
  qualification: string;
  description: string;
  requirements: string[];
  salary: string;
};

export default function CareerPage() {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  
  // Application Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function fetchOpenings() {
      try {
        const res = await fetch("/api/career");
        if (res.ok) {
          const data = await res.json();
          setOpenings(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpenings();
  }, []);

  const perks = [
    { icon: Heart, title: "Nurturing Environment", desc: "Collaborative and supportive workspace where dedication is appreciated." },
    { icon: DollarSign, title: "Competitive Salary", desc: "Attractive salary packages aligning with standard CBSE guidelines." },
    { icon: Award, title: "Professional Growth", desc: "Access to teacher training modules, academic seminars, and workshops." },
    { icon: Shield, title: "Accommodation & Meals", desc: "Comfortable on-campus housing and meals provided for boarding staff." }
  ];

  async function handleApplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedJob) return;
    if (!resumeFile) {
      setFormError("Please upload your resume (PDF format).");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const uploadData = new FormData();
      uploadData.append("file", resumeFile);
      uploadData.append("page", "career");
      uploadData.append("section", "career");
      uploadData.append("title", `Resume - ${name}`);
      uploadData.append("description", `Resume for position: ${selectedJob.title}`);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        throw new Error(uploadJson.error || "Failed to upload resume file.");
      }

      const uploadJson = await uploadRes.json();
      const resumeUrl = uploadJson.upload.src;

      const applicationPayload = {
        jobTitle: selectedJob.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        resume: resumeUrl,
        message: message.trim(),
      };

      const appRes = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationPayload),
      });

      if (!appRes.ok) {
        const appJson = await appRes.json();
        throw new Error(appJson.error || "Failed to submit job application.");
      }

      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setResumeFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased selection:bg-accent selection:text-primary">
      <Navbar />

      {/* Hero Section - Apple Editorial Compositions */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 bg-gradient-to-br from-[#3D348B] to-[#7678ED] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span className="text-white/80">Careers</span>
          </div>
          
          <Reveal width="100%">
            <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent leading-none">
              Careers at Vidyawadi
            </h1>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <p className="text-white/80 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
              Join a legacy of empowerment. Shape the leaders of tomorrow in a nurturing, creative, and safe environment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Work With Us intro - 120-160px Vertical Spacing */}
      <section className="py-32 md:py-40 px-6 max-w-7xl mx-auto space-y-24">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <Reveal>
              <span className="block text-xs font-black uppercase tracking-[0.3em] text-accent">Join our community</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-4xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat leading-tight">
                Why build your career <br className="hidden md:block"/>
                with Vidyawadi?
              </h2>
            </Reveal>
            <div className="w-16 h-1 bg-[#7678ED] rounded-full"></div>
            
            <Reveal width="100%">
              <p className="text-gray-500 font-medium leading-relaxed">
                Marudhar Mahila Shikshan Sangh Vidyawadi is committed to empowering girl students through excellence in schooling. 
                Our campus provides residential and academic care that blends high traditional values with cutting-edge academic pedagogy. 
                We offer teachers and staff an inspiring workspace, opportunities to innovate, and professional career benefits.
              </p>
            </Reveal>
          </div>
          
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-premium-md">
            <h3 className="text-lg font-black text-[#3D348B] mb-2 uppercase tracking-tight font-montserrat">Candidate Requirements</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Core Attributes We Seek</p>
            <div className="space-y-4">
              {[
                "Excellent proficiency in verbal and written English",
                "Deep dedication towards students' holistic progress",
                "Proficiency in digital learning tools and smart boards",
                "Strong values, patience, and empathetic caretaking"
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3.5 text-xs text-gray-500 font-bold leading-relaxed">
                  <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perks Grid - Bento-style design composite */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div 
                  className="bg-white border border-slate-100 p-8 rounded-[2.2rem] shadow-premium-sm hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 space-y-4 h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-[#3D348B] shadow-premium-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-[#3D348B] uppercase tracking-tight">{perk.title}</h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">{perk.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Openings list - Asymmetric Editorial Grid */}
      <section className="py-32 md:py-40 px-6 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Reveal>
              <span className="block text-xs font-black uppercase tracking-[0.3em] text-accent">Current Openings</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">
                Explore Open Positions
              </h2>
            </Reveal>
            <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Searching vacancies...</p>
            </div>
          ) : openings.length === 0 ? (
            <FadeIn>
              <div className="bg-[#F8F9FC] border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto">
                <Briefcase size={36} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Vacancies Available</h3>
                <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                  We currently do not have open slots. However, we are always searching for great talents. You can drop us your resume at lpsvidhyawadi@gmail.com.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
              {openings.map((job, idx) => (
                <FadeIn key={job._id} delay={idx * 0.05}>
                  <div 
                    className="bg-white border border-slate-100 rounded-[2.2rem] p-6 md:p-8 shadow-premium-sm hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-0.5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 text-left">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-block px-3 py-1 bg-accent/15 text-[#3D348B] text-[10px] font-black uppercase tracking-wider rounded-lg">
                          {job.department}
                        </span>
                        {job.experience && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400">
                            <Clock size={10} />
                            {job.experience} Exp
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">
                        {job.title}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed max-w-2xl">
                        <RichHtmlContent html={job.description} />
                      </div>
                      {job.qualification && (
                        <p className="text-xs text-gray-400 font-bold">
                          <span className="text-[#3D348B] font-black uppercase tracking-wider text-[10px]">Required Qualification:</span> {job.qualification}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setSubmitSuccess(false);
                        setFormError("");
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-[#3D348B] hover:bg-secondary text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 hover:shadow-premium-md shrink-0 active:scale-95"
                    >
                      Apply Now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Application Popup Form - Notion inspired Glassmorphism overlay */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-premium-lg border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Apply for Opening</p>
                  <h3 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">{selectedJob.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-premium-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-[#3D348B] uppercase tracking-tight">Application Submitted!</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed max-w-md mx-auto">
                    Thank you, {name || "Candidate"}. Your job application and resume have been successfully registered in our database. Our HR committee will review your profile shortly.
                  </p>
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="mt-6 bg-[#3D348B] hover:bg-secondary text-white px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-colors shadow-premium-sm"
                  >
                    Close Panel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="p-8 space-y-5 text-left">
                  {formError && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full glass-input rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 font-bold focus:outline-none focus:border-secondary bg-[#F8F9FC]/70"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full glass-input rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 font-bold focus:outline-none focus:border-secondary bg-[#F8F9FC]/70"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Contact Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full glass-input rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 font-bold focus:outline-none focus:border-secondary bg-[#F8F9FC]/70"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Resume PDF *</label>
                      <div className="relative w-full">
                        <input 
                          type="file" 
                          required 
                          accept=".pdf"
                          onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full glass-input rounded-xl px-4 py-3 text-xs text-gray-500 font-bold flex items-center gap-2 bg-[#F8F9FC]/70">
                          <Upload size={14} className="text-[#3D348B]" />
                          <span className="truncate">
                            {resumeFile ? resumeFile.name : "Choose PDF Resume"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Cover Message</label>
                    <textarea 
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us why you are a great fit for Vidyawadi..."
                      className="w-full glass-input rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 font-bold focus:outline-none focus:border-secondary bg-[#F8F9FC]/70 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-3 border border-slate-100 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="px-6 py-3 bg-[#3D348B] text-white hover:bg-secondary rounded-xl font-black text-xs uppercase tracking-widest transition-colors disabled:opacity-75 inline-flex items-center gap-2 shadow-premium-sm"
                    >
                      {submitting ? "Uploading..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
