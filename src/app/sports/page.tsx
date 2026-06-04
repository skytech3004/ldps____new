"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Award, CheckCircle, Shield, ArrowRight, Activity, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function SportsPage() {
  const stars = [
    { name: "Ms. Manisha Kanwar Deora", role: "XII Humanities", achievement: "8 Times National Player (Softball)" },
    { name: "Ms. Monika Kanwar Ranawat", role: "XII Science", achievement: "3 Times National Player (Softball)" },
    { name: "Ms. Renu Bhati", role: "XII Science", achievement: "National Player (Softball)" },
    { name: "Ms. Shivranjani", role: "Class X", achievement: "National Player (Softball)" }
  ];

  const stats = [
    { count: "67", label: "District Selections" },
    { count: "23", label: "State Selections" },
    { count: "4", label: "National Selections" },
    { count: "94", label: "Total Selections" }
  ];

  const games = [
    { title: "Basketball Champions", desc: "District Champions in U-14 & U-19 divisions. State Selections include Ms. Rambala, Ms. Jaisal, and Ms. Durga." },
    { title: "Softball Giants", desc: "Dominant state and national selections, training under professional coaches in expansive softball fields." },
    { title: "Table Tennis & Badminton", desc: "Dual district position II. State selection list includes Ms. Kritika, Ms. Ranjana Dave, and Ms. Divya." },
    { title: "Athletics Complex", desc: "Extensive track & field events. State selection includes champion athlete Ms. Priyanka Sirvi." }
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
            <span className="text-white/80">Sports</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Sports & Achievements
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Empowering team building, physical wellness, and athletic excellence.
          </p>
        </div>
      </section>

      {/* Sports Infrastructure Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Health & Fitness</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
              Our Sports Complex
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full" />
          </div>

          <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            Physical health is the foundation of mental strength. At LPS Vidyawadi, we offer a huge sports complex 
            with professional fields and equipment for cricket, football, athletics, handball, badminton, table tennis, 
            skating, and softball. Led by qualified, professional coaches, our sports syllabus integrates aerobic workouts, 
            gymnasium training, and weekly athletic drills.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              "Professional Coaches",
              "Spacious Track Fields",
              "Equipped Gym Complex",
              "Aerobic Aerodynamics"
            ].map((feature, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <span className="text-sm font-bold text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Dashboard Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-6 bg-[#0f234f]/5 border border-primary/10 rounded-[2.5rem] p-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center">
              <p className="text-4xl md:text-5xl font-black text-primary">{stat.count}</p>
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sports National Champions Grid (Gold Star Cards) */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-[#251f59] text-white overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">National Milestones</span>
            <h2 className="text-2xl md:text-4xl font-black font-montserrat uppercase">
              Our National Players
            </h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto pt-2">
              Proudly recognizing our girls who competed at the CBSE National levels, bringing laurels and medals to Vidyawadi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {stars.map((star, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between h-48 hover:scale-[1.03] hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Star size={20} className="text-accent fill-accent" />
                  </div>
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/15 px-2.5 py-1 rounded-full">CBSE National</span>
                </div>
                <div>
                  <h4 className="font-black text-base md:text-lg uppercase tracking-tight text-white">{star.name}</h4>
                  <p className="text-xs text-white/60 font-semibold mt-0.5">{star.role}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-accent mt-2">{star.achievement}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Game Breakdown list */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Discipline Showcase</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Game Summaries & selections
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-primary/10 rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex gap-5 items-start group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-primary uppercase font-montserrat tracking-tight">{game.title}</h4>
                <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">{game.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <Trophy className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Realize Her Athletic Potential
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Our expansive sports fields, gymnasium facilities, and qualified coaches provide the perfect 
            foundation for girls to excel in school, state, and national athletic championships.
          </p>
          <div className="pt-2">
            <Link 
              href="/apply-for-admission" 
              className="inline-flex items-center gap-2 bg-primary text-white font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-secondary hover:shadow-lg transition-all"
            >
              <span>Admission Inquiry</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
