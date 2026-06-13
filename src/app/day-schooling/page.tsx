"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Bus, Clock, CalendarDays, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

export default function DaySchoolingPage() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=day-schooling");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic day schooling content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const dayScholarStats = [
    { label: "Transport Radius", value: "50 KM" },
    { label: "Teacher Ratio", value: "1:15" },
    { label: "Daily Shift Hours", value: "6.5 Hrs" },
    { label: "Remedial Coaching", value: "Included" }
  ];

  const scheduler = [
    { time: "08:00 AM", label: "Arrival & Assembly", desc: "Coaches/buses arrive. Morning prayers, news reviews, and guidelines." },
    { time: "08:30 AM", label: "Academic Blocks", desc: "CBSE core subjects, interactive science laboratories, digital projectors." },
    { time: "11:30 AM", label: "Recess & Lunch", desc: "Wholesome vegetarian snacks/lunch provided in a neat dining area." },
    { time: "12:00 PM", label: "Advanced Learning", desc: "Mathematics, languages, arts, and creative workshops." },
    { time: "02:00 PM", label: "Remedial & Guidance", desc: "Special attention class slots for clearing queries in weak subject areas." },
    { time: "02:30 PM", label: "Departure Transit", desc: "Buses depart back on designated local peripheral routes." }
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
            <span className="text-white/80">Day Schooling</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Day Schooling <span className="text-white">Program</span>
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            Providing peripheral transport, rigorous academics, and structured remedial support under one roof for day boarding girls.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Day Boarding Hub...</div>
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
            {dayScholarStats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-1">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-wider text-accent">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Grid Layout: Transport & Support */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Safe Commutes</span>
                <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Dedicated Transport Network</h2>
                <div className="h-1.5 w-24 bg-accent rounded-full" />
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                We operate a fleet of modern, GPS-enabled buses that cover peripheral areas up to a 50 km radius. Our routes are carefully designed to ensure safety and comfort for all day scholars, with designated pickup points, professional drivers, and helper staff.
              </p>
              <div className="space-y-3">
                {[
                  "Covers Rani, Falna, Bali, Khimel, and adjacent areas",
                  "Strict safety checks and speed governors",
                  "First-aid kits and emergency contacts inside every bus"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-bold text-primary/80">
                    <CheckCircle2 size={16} className="text-accent shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-[5rem]" />
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase font-montserrat tracking-tight">Remedial Learning</h3>
                <p className="text-white/80 font-medium text-xs leading-relaxed">
                  We schedule designated remedial class slots daily from 02:00 PM to 02:30 PM. This provides day boarders with 1-on-1 support to clear queries, reinforce difficult concepts, and excel in board preparations.
                </p>
              </div>
            </div>
          </section>

          {/* Schedule slots timeline */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Daily Routine</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Day Boarder's Schedule</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheduler.map((slot, idx) => (
                <div key={idx} className="bg-white border border-primary/5 rounded-2xl p-6 shadow-md flex gap-4 items-start group hover:border-accent transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary text-xs font-black flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-primary transition-colors">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-md">{slot.time}</span>
                      <h4 className="font-black text-sm text-primary uppercase truncate max-w-[180px]">{slot.label}</h4>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{slot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Admission inquiry */}
          <section className="bg-gradient-to-r from-primary to-[#251f59] text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Join LPS</span>
                <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Enroll as a Day Boarder</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed max-w-xl">
                  We accept registrations for day scholars across primary and higher secondary levels. Apply today or contact school office to map local bus transport convenience.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-admission-modal"))}
                  className="bg-accent hover:bg-accent-hover text-primary font-black px-6 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
                >
                  Admission Inquiry
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </main>
  );
}
