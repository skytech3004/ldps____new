"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Calendar, ChevronRight, FileText, Sparkles, Search, Newspaper, GraduationCap, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";

interface Notice {
  _id: string;
  title: string;
  subject?: string;
  body?: string;
  refNo?: string;
  category: string;
  date: string;
  isNew: boolean;
  link?: string;
}

const CATEGORIES = ["All", "News & Circulars", "Announcements", "Admission", "School Rules"];

export default function NoticeIndexPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/notices", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setNotices(data as Notice[]);
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = activeCategory === "All" || notice.category === activeCategory;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.subject && notice.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.body && notice.body.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "News & Circulars":
        return <Newspaper size={16} className="text-[#7678ED]" />;
      case "Announcements":
        return <Bell size={16} className="text-[#3D348B]" />;
      case "Admission":
        return <GraduationCap size={16} className="text-[#F7B801]" />;
      case "School Rules":
        return <ClipboardList size={16} className="text-[#F18701]" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased selection:bg-accent selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 bg-gradient-to-br from-[#3D348B] to-[#7678ED] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span className="text-white/80">Notice Board</span>
          </div>
          
          <Reveal width="100%">
            <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent leading-none">
              Official Notices & Circulars
            </h1>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <p className="text-white/80 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
              Access news, circulars, admission instructions, announcements, and school rule books in real-time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Control Area: Tabs & Search */}
      <section className="pt-16 pb-6 px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#3D348B] text-white shadow-premium-sm"
                    : "bg-white text-[#3D348B] border border-slate-100 hover:bg-[#F1F2F6]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-full text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/10 transition-all shadow-premium-xs"
            />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Notice List */}
      <section className="py-12 pb-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] shadow-premium-sm">
            <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Loading notice board...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto shadow-premium-sm">
            <FileText size={36} className="text-[#7678ED] mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Notices Found</h3>
            <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
              No circulars or notice documents found matching your filter criteria. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((item) => {
              const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
              const href = item.link || `/notice/${slug}`;
              const isExternal = !!item.link;

              return (
                <div
                  key={item._id}
                  className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium-xs hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  {item.isNew && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 text-white flex items-center justify-center text-[8px] font-black uppercase tracking-wider rotate-45 translate-x-5 -translate-y-5 shadow-sm">
                      New
                    </div>
                  )}

                  <div className="space-y-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black px-2.5 py-1 bg-slate-50 border border-slate-100 text-gray-600 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {item.refNo && (
                        <span className="text-[9px] text-[#7678ED] font-bold tracking-wider bg-[#7678ED]/5 px-2 py-0.5 rounded">
                          REF: {item.refNo}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base md:text-lg font-black text-[#3D348B] uppercase tracking-tight leading-snug">
                      {item.title}
                    </h4>

                    {item.subject && (
                      <p className="text-xs text-gray-500 font-semibold italic border-l-2 border-[#F7B801] pl-2">
                        Sub: {item.subject}
                      </p>
                    )}

                    {item.body && (
                      <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-3xl line-clamp-3">
                        {item.body}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {isExternal ? "Attached File" : "Official Notice"}
                    </span>
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#7678ED] hover:text-[#3D348B] uppercase tracking-wider whitespace-nowrap"
                    >
                      <span>{isExternal ? "Download Document" : "Open Details"}</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
