"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, Shield, Tv, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

export default function HostelPage() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=hostel");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic hostel content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const hostelStats = [
    { label: "Total Hostels", value: "7" },
    { label: "Student Capacity", value: "660" },
    { label: "Wardens per Hostel", value: "2" },
    { label: "Power & Hot Water", value: "Solar" }
  ];

  const abodes = [
    {
      title: "Spacious Abodes",
      desc: "Rooms are double-storeyed, well-ventilated, and designed to ensure abundant natural light. Custom metal-framed beds, cabinets, and storage lockers are provided.",
      icon: Home,
      color: "bg-[#7678ED]/10 text-[#7678ED]"
    },
    {
      title: "24/7 Shield Protection",
      desc: "Comprehensive campus security guards, restricted access control, CCTV perimeter checks, and dedicated night warden watches to ensure girls' safety.",
      icon: Shield,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Recreation & Leisure",
      desc: "Leisure lounge rooms equipped with television screens, board games, indoor sports tables, and daily/weekly national newspapers to stay updated.",
      icon: Tv,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "R.O. Water & Solar Systems",
      desc: "Integrated water filtration systems, overhead and underground backup reservoirs, and solar water heating grids in mess blocks and hostels.",
      icon: Sparkles,
      color: "bg-amber-100 text-amber-700"
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Schooling</span>
            <span>/</span>
            <span className="text-white/80">Hostel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Hostels & Abodes
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            A home away from home. Discover comfortable, safe, and nurturing residential life details inside Vidyawadi campus.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Residential Hub...</div>
        </div>
      ) : dbContent ? (
        // DB Dynamic Override
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
          <div className="bg-white border border-primary/10 rounded-[2rem] p-8 md:p-12 shadow-md">
            <div className="border-l-4 border-accent pl-6 mb-8">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight">{dbContent.title}</h2>
              {dbContent.status && <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{dbContent.status}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dbContent.sections.map((section, sIdx) => (
                <article key={sIdx} className="bg-gray-50/50 border border-primary/5 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-primary mb-4 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((line, lIdx) => (
                      <li key={lIdx} className="text-gray-600 font-medium text-sm leading-relaxed flex gap-3">
                        <span className="text-accent mt-1.5 shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Curated High-Fidelity Interactive Page
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
          
          {/* Stats Section */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {hostelStats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-1">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-wider text-accent">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Abodes Showcase Grid */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Living Standards</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Vidyawadi Hostel Features</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {abodes.map((abode, idx) => {
                const Icon = abode.icon;
                return (
                  <div key={idx} className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all flex gap-6 items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${abode.color}`}>
                      <Icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-primary uppercase tracking-tight">{abode.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">{abode.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Guidelines Table */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Daily Routine</span>
                <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Structured Abode Timings</h2>
                <div className="h-1.5 w-24 bg-accent rounded-full" />
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                Hostel life is strictly regulated to establish self-discipline, balance, and focus. Daily prep hours are structured under the personal supervision of academic wardens.
              </p>
              <div className="space-y-3 font-semibold text-primary/80">
                <div className="flex gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                  <span>Morning rising prayers at 06:00 AM.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                  <span>Supervised evening self-prep study from 06:30 PM to 08:30 PM.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                  <span>Curfew bedtime check-in and lights-out by 09:30 PM.</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#0f234f]/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <HelpCircle size={22} className="text-accent" />
                <h3 className="text-lg font-black text-primary uppercase font-montserrat">Frequently Noted Rules</h3>
              </div>
              <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed">
                <div className="border-b border-primary/10 pb-3">
                  <p className="font-black text-primary uppercase">Electronic Gadgets</p>
                  <p className="mt-1">Students are strictly prohibited from keeping mobile phones, MP3 players, or tablets. A fine of Rs. 1000 and confiscation applies if found.</p>
                </div>
                <div className="border-b border-primary/10 pb-3">
                  <p className="font-black text-primary uppercase">Visiting Hours</p>
                  <p className="mt-1">Parents/guardians are allowed to visit on second Saturdays and holidays only. Permission check required at gates.</p>
                </div>
                <div>
                  <p className="font-black text-primary uppercase">Absenteeism Delay</p>
                  <p className="mt-1">Reporting on the school reopening day is compulsory. Delay transit costs Rs. 200 per day fine unless leaves are officially pre-sanctioned.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </main>
  );
}
