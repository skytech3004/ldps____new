"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Map, Download, Award, Compass, School, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EBrochurePage() {
  const brochureChapters = [
    {
      title: "Academic Wings & Stream Structure",
      desc: "Comprehensive curriculum guidelines from Pre-Primary to Class XII, detailing Science, Commerce, and Humanities options.",
      icon: Compass,
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600"
    },
    {
      title: "65-Acre Residential Facilities",
      desc: "Insights into our 7 secure two-storeyed hostels, Jain-compliant kitchen serving wholesome meals, and Bal Dukan tuck shop.",
      icon: School,
      color: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-accent"
    },
    {
      title: "Advanced Laboratories & Extracurriculars",
      desc: "Showcase of our state-of-the-art AI, Robotics, and Aeronautics labs, acoustic music wing, and 65-acre sports complex.",
      icon: BookOpen,
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600"
    }
  ];

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
            <span className="text-white/80">E-Brochure</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Digital Prospectus & Brochure
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Explore our heritage, academic framework, and residential campus facilities in detail.
          </p>
        </div>
      </section>

      {/* Core Chapters */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: General Introduction & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">LPS Prospectus</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Digital Brochure Overview
              </h2>
              <div className="h-1.5 w-24 bg-accent rounded-full" />
            </div>

            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              Our e-prospectus is designed to give parents and guardians a transparent window into life at 
              LPS Vidyawadi. Spanning 65 sylvan acres, our secure residential campus nurtures 1000+ girls 
              with CBSE-aligned academics, character-building physical drills, and specialized modern sciences.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                "CBSE Affiliated Wings",
                "Jain Vegetarian Mess",
                "Qualified Faculty & Warden Desk",
                "Modern Robotics/Aero Labs"
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="text-accent shrink-0" size={16} />
                  <span className="text-xs md:text-sm font-bold text-primary">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/downloads" 
                className="bg-primary text-white font-black px-6 py-4 rounded-xl hover:bg-secondary hover:shadow-lg transition-all flex items-center gap-2 group text-xs uppercase tracking-wider"
              >
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Go to Downloads Page</span>
              </Link>
              <Link 
                href="/apply-for-admission" 
                className="bg-white border-2 border-primary/10 text-primary font-black px-6 py-4 rounded-xl hover:bg-primary/5 transition-all text-xs uppercase tracking-wider"
              >
                Apply for Admission
              </Link>
            </div>
          </div>

          {/* Right: Brochure Chapters List */}
          <div className="lg:col-span-6 space-y-6">
            {brochureChapters.map((chapter, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-3xl p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-5 items-start group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chapter.color} ${chapter.iconColor} flex items-center justify-center shrink-0`}>
                  <chapter.icon size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-primary uppercase font-montserrat tracking-tight">{chapter.title}</h4>
                  <p className="text-gray-500 font-medium text-xs leading-relaxed">{chapter.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Brochure CTA Section */}
      <section className="bg-gradient-to-r from-primary to-[#2c246b] py-20 px-6 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <Award className="text-accent mx-auto animate-pulse" size={44} />
          <h3 className="text-2xl md:text-4xl font-black font-montserrat uppercase tracking-tight text-accent">
            Get Your Digital Prospectus Copy
          </h3>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Download the official Leeladevi Parasmal Sancheti English Medium School handbook containing detailed fee schedules, 
            hostel items, admission forms, and academic rules.
          </p>
          <div className="pt-4">
            <Link 
              href="/downloads" 
              className="inline-flex items-center gap-2 bg-accent text-primary font-black uppercase text-xs md:text-sm tracking-widest px-8 py-4.5 rounded-xl hover:bg-accent-hover hover:scale-105 transition-all shadow-xl shadow-accent/10"
            >
              <span>Download PDF Handbook</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
