"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, Trophy, BookOpen, AlertCircle, ArrowRight, HelpCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AnnouncementsPage() {
  const alerts = [
    {
      title: "Saturday is a 'No Bag Day' for Classes Nursery to VIII",
      category: "Weekly Campaign",
      badge: "Active Policy",
      icon: BookOpen,
      color: "text-accent",
      desc: "To relieve stress and foster interactive, hobby-centric learning, Saturdays are observed as 'No Bag Days' for Nursery to VIII Std. Students will participate in physical drills, craft workshops, and assemblies."
    },
    {
      title: "Happy Saturday with Happy Faces - Do Visit Our Gallery!",
      category: "Student Life Activity",
      badge: "Campus Alert",
      icon: Trophy,
      color: "text-secondary",
      desc: "Weekly co-curricular arts, sports leagues, and inter-house debates are celebrated with joy. Photos of last week's 'Happy Saturday' have been added to our Photo Gallery!"
    },
    {
      title: "New Student Council Cabinet Assumes Charge (Session 2024-25)",
      category: "Student Council",
      badge: "Leadership Notice",
      icon: Bell,
      color: "text-primary",
      desc: "Congratulations to our Head Girl Ms. Rajbala Chouhan and the cabinet prefects. The investiture ceremony was conducted successfully, and portfolios have been cleared for student self-governance."
    },
    {
      title: "Board Merit Toppers Awarded by Bali SDM",
      category: "Academic Honours",
      badge: "Accolades",
      icon: AlertCircle,
      color: "text-emerald-500",
      desc: "Proud recognition of board toppers Rajbala, Samridhi, and Tanisha, honored with academic shields by the Sub-Divisional Magistrate (SDM) at the Bali Block ceremony."
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
            <span>More</span>
            <span>/</span>
            <span className="text-white/80">Announcements</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Bulletins & Notices
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Live school policy changes, weekly campaigns, and student notifications.
          </p>
        </div>
      </section>

      {/* Active Bulletin Cards Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Active Notices</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Vidyawadi Board Bulletins
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
          {alerts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative min-h-[260px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -z-10 group-hover:scale-105 transition-transform" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-accent-hover uppercase tracking-widest bg-accent/15 px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.badge}</span>
                  </div>

                  <h3 className="text-lg font-black uppercase font-montserrat tracking-tight text-primary leading-tight flex gap-3 items-start">
                    <Icon size={20} className={`${item.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">LPS Board Notice</span>
                  
                  <Link 
                    href="/photo-gallery"
                    className="inline-flex items-center gap-1 text-accent-hover font-extrabold uppercase text-[10px] md:text-xs tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Gallery</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
