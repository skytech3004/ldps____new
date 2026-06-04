"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Trophy, Award, Calendar, ArrowRight, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsPage() {
  const newsItems = [
    {
      title: "Bhavya Sharma Awarded Laptop at Jaipur by Chief Minister",
      category: "Proud Moment",
      date: "May 2024",
      icon: Trophy,
      desc: "Our meritorious student Bhavya Sharma was honored at a state-level ceremony in Jaipur, receiving a laptop award directly from the honorable Chief Minister of Rajasthan for academic excellence."
    },
    {
      title: "Three Board Merit Toppers Awarded by Bali SDM",
      category: "Academic Excellence",
      date: "April 2024",
      icon: Award,
      desc: "Board merit list toppers Ms. Rajbala Chouhan, Ms. Samridhi, and Ms. Tanisha were recognized and awarded by the Sub-Divisional Magistrate (SDM) at the Bali Block ceremony for their outstanding achievements in the board exams."
    },
    {
      title: "Student Cabinet Elections & Zeal for Session 2024-25",
      category: "Leadership",
      date: "April 2024",
      icon: Star,
      desc: "The new school cabinet has assumed charge with deep zeal and dedication. Under Head Girl Ms. Rajbala and Prefects, the student governance body pledges to facilitate a positive, self-reliant school environment."
    },
    {
      title: "Step into the Adventures of Academic Session 2024-25",
      category: "Academic Launch",
      date: "April 1, 2024",
      icon: Newspaper,
      desc: "Welcome bells ring as LPS Vidyawadi launches its new academic year! Activity-based classroom orientations, remedial schedules, and sports camps start across junior and senior wings."
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
            <span className="text-white/80">News</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            School News & Press
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Keep track of student accomplishments, government accolades, and campus launch logs.
          </p>
        </div>
      </section>

      {/* News timeline Cards Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Vidyawadi Buzz</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Latest Achievements & Stories
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
          {newsItems.map((article, idx) => {
            const Icon = article.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative min-h-[300px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -z-10 group-hover:scale-105 transition-transform" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-accent-hover uppercase tracking-widest bg-accent/15 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Icon size={10} />
                      <span>{article.category}</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{article.date}</span>
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black uppercase font-montserrat tracking-tight text-primary leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">{article.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Leeladevi Parasmal Sancheti School</span>
                  
                  <Link 
                    href="/gallery"
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

      {/* Corporate Philosophy */}
      <section className="bg-gradient-to-r from-primary to-[#282163] py-16 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <Heart className="text-accent mx-auto animate-pulse" size={32} />
          <h3 className="text-2xl md:text-3xl font-black font-montserrat uppercase">
            &quot;Celebrating girl child empowerment and scholastic excellence.&quot;
          </h3>
          <p className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
            Leeladevi Parasmal Sancheti School • Vidyawadi, Khimel
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
