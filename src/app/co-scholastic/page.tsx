"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Palette, Music, Sparkles, Trophy, CheckCircle, ArrowRight, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function CoScholasticPage() {
  const artsList = [
    { name: "Creative Art & Craft", desc: "Best out of Waste, card & bookmark making, face painting, card folding, fabric painting, acrylic/glass designs, and soft toy making." },
    { name: "Acoustics Music Wing", desc: "Indian Classical and Folk music training conducted in an acoustically refined sound room equipped with keyboards, guitars, tablas, and violins." },
    { name: "Performing Dance & Aerobics", desc: "Traditional Indian classical dance forms, regional folk steps, and structured aerobics to encourage posture, sync, and body rhythm." }
  ];

  const houses = [
    { name: "Rani Lakshmi Bai House", color: "border-red-500 bg-red-500/5 text-red-500 text-red-400", motto: "Valor & Strength" },
    { name: "Padmavati House", color: "border-amber-500 bg-amber-500/5 text-amber-500 text-amber-400", motto: "Wisdom & Honor" },
    { name: "Sarojini Naidu House", color: "border-indigo-500 bg-indigo-500/5 text-indigo-500 text-indigo-400", motto: "Grace & Expression" },
    { name: "Vijaya Lakshmi House", color: "border-emerald-500 bg-emerald-500/5 text-emerald-500 text-emerald-400", motto: "Peace & Harmony" }
  ];

  const clubs = [
    "Eco Club", "Literary Club", "Eco-System Trails", "Music & Oratory", 
    "Drama & Pantomime", "Hindi Sahitya", "SUPW Skills", "Heritage Club",
    "Eco-Awareness Projects", "IT & Robotics", "Reader's Integrity", "Eco walks"
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
            <span className="text-white/80">Co-Scholastic</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Co-Scholastic & Clubs
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Unleashing creativity, rhythm, and leadership outside the textbook.
          </p>
        </div>
      </section>

      {/* Creative Arts Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Vibrant Expression</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Creative & Performing Arts
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artsList.map((item, idx) => {
            const Icon = idx === 0 ? Palette : idx === 1 ? Music : Sparkles;
            return (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -z-10 group-hover:scale-105 transition-transform" />
                
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                
                <h3 className="text-xl font-black text-primary uppercase font-montserrat tracking-tight mb-3">
                  {item.name}
                </h3>
                <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* House System Championship Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-[#251f59] text-white overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Teamwork & Leadership</span>
            <h2 className="text-2xl md:text-4xl font-black font-montserrat uppercase">
              The School House System
            </h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto pt-2">
              Building mutual cooperation, healthy competition, tolerance, and deep bonds through weekly inter-house challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {houses.map((house, idx) => (
              <div 
                key={idx} 
                className={`border rounded-2xl p-6 shadow-lg flex flex-col justify-between h-48 hover:scale-[1.03] transition-all duration-300 ${house.color}`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Trophy size={20} className="text-accent" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-base md:text-lg uppercase tracking-tight">{house.name}</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mt-1">Motto: {house.motto}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Student Clubs & Societies Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Nurturing Hobbies</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Clubs & Societies
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4">
          {clubs.map((club, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-primary/5 rounded-xl p-4 shadow-sm hover:border-accent transition-all flex items-center gap-3 group"
            >
              <CheckCircle size={16} className="text-accent shrink-0" />
              <span className="text-xs md:text-sm font-bold text-primary/80 group-hover:text-primary transition-colors">{club}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <Palette className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Discover Her Creative Side
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            At Leeladevi Parasmal Sancheti School, we provide the canvas, the stage, and the instruments 
            for your daughter to discover and refine her inner talents.
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
