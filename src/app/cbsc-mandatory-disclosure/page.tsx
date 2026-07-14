"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfViewerButton from "@/components/PdfViewerButton";
import {
  School,
  FileText,
  Award,
  Users,
  Building,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  User,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface YoutubeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const YoutubeIcon = ({ size = 24, ...props }: YoutubeIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

// Types
type TabType = "general" | "documents" | "academics" | "staff" | "infrastructure";

const getGeneralIcon = (label: string) => {
  const lbl = label.toLowerCase();
  if (lbl.includes("school") || lbl.includes("name")) return School;
  if (lbl.includes("address")) return MapPin;
  if (lbl.includes("principal")) return User;
  if (lbl.includes("email")) return Mail;
  if (lbl.includes("phone") || lbl.includes("contact") || lbl.includes("detail")) return Phone;
  return Info;
};

const getInfraIcon = (label: string) => {
  const lbl = label.toLowerCase();
  if (lbl.includes("campus") || lbl.includes("area")) return Building;
  return Info;
};

export default function CbscMandatoryDisclosurePage() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [dbDocs, setDbDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadDbDocs() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/disclosures");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDbDocs(data);
          }
        }
      } catch (err) {
        console.error("Failed to load disclosures from DB", err);
      } finally {
        setLoading(false);
      }
    }
    loadDbDocs();
  }, []);

  // Filter & Map generalInfo
  const generalInfo = dbDocs
    .filter((doc) => doc.category === "general")
    .map((doc) => ({
      label: doc.title,
      value: doc.value || "",
      icon: getGeneralIcon(doc.title),
      isEmail: doc.title.toLowerCase().includes("email"),
      isPhone: doc.title.toLowerCase().includes("contact") || doc.title.toLowerCase().includes("phone"),
    }));

  // Filter & Map complianceDocs
  const complianceDocs = dbDocs
    .filter((doc) => doc.category === "documents")
    .map((doc) => ({
      title: doc.title,
      url: doc.pdfUrl || "",
    }));

  // Filter & Map academicDocs
  const academicDocs = dbDocs
    .filter((doc) => doc.category === "academics")
    .map((doc) => ({
      title: doc.title,
      url: doc.pdfUrl || "",
    }));

  // Filter & Map staff details
  const staffRoles = dbDocs
    .filter((doc) => doc.category === "staff_role")
    .map((doc) => ({
      name: doc.title,
      count: doc.count || 0,
      details: doc.details || "",
    }));

  const staffTeachers = dbDocs
    .filter((doc) => doc.category === "staff_teacher")
    .map((doc) => ({
      type: doc.value || "",
      title: doc.title,
      count: doc.count || 0,
      url: doc.pdfUrl || "",
    }));

  const staffStats = dbDocs
    .filter((doc) => doc.category === "staff_stat")
    .map((doc) => ({
      label: doc.title,
      value: doc.count || 0,
    }));

  const staffDetails = {
    roles: staffRoles,
    teachers: staffTeachers,
    stats: staffStats,
  };

  // Filter & Map infrastructure details
  const infraDetails = dbDocs
    .filter((doc) => doc.category === "infrastructure")
    .map((doc) => ({
      label: doc.title,
      value: doc.value || "",
      icon: getInfraIcon(doc.title),
    }));

  const videoDoc = dbDocs.find((doc) => doc.category === "infrastructure_video");
  const youtubeVideoUrl = videoDoc ? videoDoc.value : "https://www.youtube.com/watch?v=f6aSTkhspW0";

  // Tab categorization logic
  const presetCategories = ["general", "documents", "academics", "staff_role", "staff_teacher", "staff_stat", "infrastructure", "infrastructure_video"];

  // Find unique custom categories from DB documents
  const customCategories = Array.from(
    new Set(
      dbDocs
        .filter((doc) => doc.category && !presetCategories.includes(doc.category))
        .map((doc) => doc.category.toLowerCase().trim())
    )
  );

  const defaultTabs = [
    { id: "general", label: "General Info", icon: School },
    { id: "documents", label: "Documents & Compliance", icon: FileText },
    { id: "academics", label: "Results & Academics", icon: Award },
    { id: "staff", label: "Staff Details", icon: Users },
    { id: "infrastructure", label: "Infrastructure", icon: Building },
  ];

  const customTabs = customCategories.map((cat) => {
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    return { id: cat, label, icon: FileText };
  });

  const allTabs = [...defaultTabs, ...customTabs];

  // Helper to query custom documents for a tab
  const isCustomActive = !["general", "documents", "academics", "staff", "infrastructure"].includes(activeTab);
  const customDocs = dbDocs.filter((doc) => doc.category?.toLowerCase().trim() === activeTab);

  return (
    <main className="min-h-screen pt-32 lg:pt-40 bg-[#f7fbf8] text-gray-800 font-sans">
      <Navbar />

      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Main Banner Header */}
          <div className="bg-gradient-to-r from-[#112759] to-[#3D348B] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,184,1,0.1),transparent)] z-0" />
            <div className="relative z-10 space-y-3">
              <span className="text-accent text-xs font-black uppercase tracking-[0.4em] block">
                CBSE Mandatory Public Disclosure
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Mandatory Disclosure <span className="text-accent">(Appendix-IX)</span>
              </h1>
              <p className="text-white/80 max-w-3xl text-sm md:text-base font-medium leading-relaxed">
                In compliance with CBSE directives, Leeladevi Parasmal Sancheti English Medium School Vidyawadi provides public access to institutional documents, compliance certifications, results, staffing numbers, and infrastructure data.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap bg-[#112759]/5 p-2 rounded-2xl gap-2 border border-black/5">
            {allTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeTab === tab.id
                      ? "bg-[#3D348B] text-white shadow-md shadow-[#3D348B]/20"
                      : "text-[#112759]/75 hover:text-[#112759] hover:bg-white/50"
                    }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-10 shadow-sm min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-sm font-semibold text-slate-400">Loading disclosure data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >

                  {/* 1. General Info */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <School className="text-accent" />
                          General Information (Section A)
                        </h2>
                      </div>

                      {generalInfo.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">No general information uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {generalInfo.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                              <div key={idx} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-start gap-4">
                                <div className="p-3 bg-white text-[#3D348B] rounded-xl border border-slate-100 shrink-0 shadow-sm">
                                  <Icon size={18} />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{info.label}</p>
                                  {info.isEmail ? (
                                    <a href={`mailto:${info.value}`} className="text-sm font-extrabold text-[#3D348B] hover:text-accent transition-colors block truncate">
                                      {info.value}
                                    </a>
                                  ) : info.isPhone ? (
                                    <a href={`tel:${info.value.split(" ")[0]}`} className="text-sm font-extrabold text-[#3D348B] hover:text-accent transition-colors block">
                                      {info.value}
                                    </a>
                                  ) : (
                                    <p className="text-sm font-extrabold text-[#112759] leading-relaxed">{info.value}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Documents & Compliance */}
                  {activeTab === "documents" && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <FileText className="text-accent" />
                          Documents & Information (Section B)
                        </h2>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider self-start sm:self-auto">
                          Official Safety Certifications
                        </span>
                      </div>

                      {complianceDocs.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">No compliance documents uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {complianceDocs.map((doc, idx) => (
                            <div key={idx} className="p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#3D348B]/20 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group">
                              <div className="flex items-start gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
                                  <FileText size={18} />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Document {idx + 1}</span>
                                  <p className="text-xs md:text-sm font-extrabold text-slate-700 leading-normal line-clamp-2">{doc.title}</p>
                                </div>
                              </div>
                              <div className="shrink-0 self-end sm:self-auto">
                                <PdfViewerButton pdfUrl={doc.url} buttonText="Open PDF" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Results & Academics */}
                  {activeTab === "academics" && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <Award className="text-accent" />
                          Results & Academics (Section C)
                        </h2>
                      </div>

                      {academicDocs.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">No academic records uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {academicDocs.map((doc, idx) => (
                            <div key={idx} className="p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#3D348B]/20 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group">
                              <div className="flex items-start gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center shrink-0">
                                  <Award size={18} />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Academic Info {idx + 1}</span>
                                  <p className="text-xs md:text-sm font-extrabold text-slate-700 leading-normal line-clamp-2">{doc.title}</p>
                                </div>
                              </div>
                              <div className="shrink-0 self-end sm:self-auto">
                                <PdfViewerButton pdfUrl={doc.url} buttonText="Open PDF" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Staff Details */}
                  {activeTab === "staff" && (
                    <div className="space-y-8">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <Users className="text-accent" />
                          Staffing & Teaching Strength (Section D)
                        </h2>
                      </div>

                      {/* Stats Summary */}
                      {staffDetails.stats.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {staffDetails.stats.map((stat, idx) => (
                            <div key={idx} className="p-6 bg-[#112759]/5 border border-[#112759]/10 rounded-2xl text-center space-y-1.5">
                              <p className="text-3xl md:text-4xl font-black text-[#3D348B]">{stat.value}</p>
                              <p className="text-xs font-black text-[#112759] uppercase tracking-wider">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                        {/* Executive & Support Roles */}
                        <div className="lg:col-span-5 space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-wider text-[#3D348B]">Leadership & Special Roles</h3>
                          
                          {staffDetails.roles.length === 0 ? (
                            <p className="text-xs text-slate-400 font-semibold">No leadership roles defined.</p>
                          ) : (
                            <div className="space-y-3">
                              {staffDetails.roles.map((role, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-4">
                                  <div>
                                    <p className="text-xs font-bold text-gray-500">{role.name}</p>
                                    <p className="text-sm font-black text-[#112759] mt-0.5">{role.details}</p>
                                  </div>
                                  <span className="px-3 py-1 bg-white text-[#3D348B] text-xs font-black rounded-lg border border-slate-100 shadow-sm shrink-0 font-mono">
                                    Count: {role.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Teaching Divisions and Lists */}
                        <div className="lg:col-span-7 space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-wider text-[#3D348B]">Teachers List by Department</h3>
                          
                          {staffDetails.teachers.length === 0 ? (
                            <p className="text-xs text-slate-400 font-semibold">No departments defined.</p>
                          ) : (
                            <div className="space-y-3">
                              {staffDetails.teachers.map((teacher, idx) => (
                                <div key={idx} className="p-4 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#3D348B]/20 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 group">
                                  <div>
                                    <p className="text-xs font-bold text-gray-400">Section {idx + 1}</p>
                                    <p className="text-sm font-black text-slate-700 mt-0.5">{teacher.type}</p>
                                    <span className="inline-block mt-1 text-[11px] font-extrabold text-[#3D348B] bg-[#3D348B]/5 px-2.5 py-0.5 rounded-md font-mono">
                                      Strength: {teacher.count}
                                    </span>
                                  </div>
                                  <div className="shrink-0 self-end sm:self-auto">
                                    <PdfViewerButton pdfUrl={teacher.url} buttonText="Staff PDF" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 5. Infrastructure */}
                  {activeTab === "infrastructure" && (
                    <div className="space-y-8">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <Building className="text-accent" />
                          School Infrastructure & Facilities (Section E)
                        </h2>
                      </div>

                      {infraDetails.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">No infrastructure metrics defined.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {infraDetails.map((infra, idx) => {
                            const Icon = infra.icon;
                            return (
                              <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-sm">
                                  <Icon size={18} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-relaxed">{infra.label}</p>
                                  <p className="text-base font-black text-[#112759]">{infra.value}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Youtube Inspection Video Section */}
                      {youtubeVideoUrl && (
                        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-red-200">
                              <YoutubeIcon size={24} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-amber-800 uppercase tracking-widest">Inspection Video Link</p>
                              <h4 className="text-base md:text-lg font-black text-[#112759] uppercase tracking-tight">YouTube Infrastructure Inspection</h4>
                              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                Official video recording of the inspection covering school premises, classrooms, safety standards, and overall facilities.
                              </p>
                            </div>
                          </div>
                          <a
                            href={youtubeVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-95 shrink-0"
                          >
                            <ExternalLink size={14} />
                            Watch on YouTube
                          </a>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Custom Categories dynamically rendered */}
                  {isCustomActive && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                          <FileText className="text-accent" />
                          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Disclosures
                        </h2>
                      </div>

                      {customDocs.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">No documents uploaded under this category yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {customDocs.map((doc, idx) => (
                            <div key={idx} className="p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#3D348B]/20 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group">
                              <div className="flex items-start gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center shrink-0">
                                  <FileText size={18} />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Doc {idx + 1}</span>
                                  <p className="text-xs md:text-sm font-extrabold text-slate-700 leading-normal line-clamp-2">{doc.title}</p>
                                </div>
                              </div>
                              <div className="shrink-0 self-end sm:self-auto">
                                <PdfViewerButton pdfUrl={doc.pdfUrl} buttonText="View PDF" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Bottom Back Navigation */}
          <div className="flex justify-start">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#112759] text-white font-black uppercase text-xs tracking-widest hover:bg-[#3D348B] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md shadow-[#112759]/10"
            >
              Back to Home
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
