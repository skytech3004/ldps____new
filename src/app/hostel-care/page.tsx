"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ShieldAlert, ShoppingBag, Shirt, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

export default function HostelCarePage() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=hostel-care");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic hostel care content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const careStats = [
    { label: "Full-Time Nurse", value: "1" },
    { label: "Doctor Audits", value: "Weekly" },
    { label: "Laundry Cycles", value: "Daily" },
    { label: "Security Gates", value: "24 Hrs" }
  ];

  const services = [
    {
      title: "Medical Infirmary",
      desc: "Equipped health care center with a resident full-time nurse to monitor minor ailments. A part-time school doctor visits for weekly checkups and emergencies.",
      icon: Activity,
      color: "bg-red-50 text-red-500"
    },
    {
      title: "Bal Dukan (Tuck Shop)",
      desc: "An in-campus utility store that supplies boarders with toiletries, stationery, basic snacks, and everyday personal grooming items at regulated pricing.",
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Laundry & Linen Services",
      desc: "Daily automated laundry facilities to handle school uniforms, casual boarder garments, and weekly linen/bedsheet washes for maximum cleanliness.",
      icon: Shirt,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Counseling & Wellbeing",
      desc: "Personalized emotional guidance led by school wellness warden Ms. Neelam Parihar. Helps girls transition smoothly into residential schedules.",
      icon: Heart,
      color: "bg-pink-50 text-pink-600"
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
            <span className="text-white/80">Hostel Care</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Hostel Care & Health
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            Ensuring physical wellness, emotional counseling support, daily utilities, and safety parameters for boarders.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Care Portal...</div>
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
            {careStats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-1">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-wider text-accent">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Care Services Grid */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Support Systems</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Daily Residential Services</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {services.map((serv, idx) => {
                const Icon = serv.icon;
                return (
                  <div key={idx} className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all flex gap-6 items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${serv.color}`}>
                      <Icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-primary uppercase tracking-tight">{serv.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">{serv.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Emergency support segment */}
          <section className="bg-primary text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <ShieldAlert size={20} />
                  <span className="font-black uppercase tracking-[0.4em] text-xs">Emergency Alert</span>
                </div>
                <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Wellbeing Clearance</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed max-w-xl">
                  In the event of critical sickness, parents are immediately notified by the wardens. A dedicated school ambulance stands by 24/7 to transport students to district hospitals in Rani or Falna if recommended by the resident doctor.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Link
                  href="/contact"
                  className="bg-accent hover:bg-accent-hover text-primary font-black px-6 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
                >
                  Contact Wardens
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </main>
  );
}
