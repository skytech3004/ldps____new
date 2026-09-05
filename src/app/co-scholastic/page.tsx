"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout, { PageSectionHeader } from "@/components/ui/PageLayout";
import { Palette, Music, Sparkles, Trophy, CheckCircle, ArrowRight } from "lucide-react";

export default function CoScholasticPage() {
  const [dbContent, setDbContent] = useState<any>(null);

  useEffect(() => {
    async function fetchDbPage() {
      try {
        const res = await fetch("/api/admin/pages?slug=co-scholastic");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic page content:", err);
      }
    }
    fetchDbPage();
  }, []);

  const artsList = [
    { name: "Creative Art & Craft", desc: "Best out of Waste, card & bookmark making, face painting, card folding, fabric painting, acrylic/glass designs, and soft toy making." },
    { name: "Acoustics Music Wing", desc: "Indian Classical and Folk music training conducted in an acoustically refined sound room equipped with keyboards, guitars, tablas, and violins." },
    { name: "Performing Dance & Aerobics", desc: "Traditional Indian classical dance forms, regional folk steps, and structured aerobics to encourage posture, sync, and body rhythm." }
  ];

  const houses = [
    { name: "Rani Lakshmi Bai House", color: "border-red-500 bg-red-500/5 text-red-500", motto: "Valor & Strength" },
    { name: "Padmavati House", color: "border-amber-500 bg-amber-500/5 text-amber-500", motto: "Wisdom & Honor" },
    { name: "Sarojini Naidu House", color: "border-indigo-500 bg-indigo-500/5 text-indigo-500", motto: "Grace & Expression" },
    { name: "Vijaya Lakshmi House", color: "border-emerald-500 bg-emerald-500/5 text-emerald-500", motto: "Peace & Harmony" }
  ];

  const clubs = [
    "Eco Club", "Literary Club", "Eco-System Trails", "Music & Oratory", 
    "Drama & Pantomime", "Hindi Sahitya", "SUPW Skills", "Heritage Club",
    "Eco-Awareness Projects", "IT & Robotics", "Reader's Integrity", "Eco walks"
  ];

  return (
    <PageLayout
      groupName="Academics"
      pageTitle={dbContent?.title || "Co-Scholastic & Clubs"}
      subtitle={dbContent?.subtitle || "Unleashing creativity, rhythm, and leadership outside the textbook."}
    >
      {/* Creative Arts Section */}
      <section className="space-y-12">
        <PageSectionHeader
          badge="Vibrant Expression"
          title="Creative & Performing Arts"
          subtitle="Nurturing aesthetic appreciation, musical talent, and body sync."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artsList.map((item, idx) => {
            const Icon = idx === 0 ? Palette : idx === 1 ? Music : Sparkles;
            return (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-[2.5rem] p-8 shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
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
      <section className="bg-gradient-to-br from-primary to-[#251f59] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-10">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Teamwork & Leadership</span>
          <h2 className="text-2xl md:text-4xl font-black font-montserrat uppercase text-accent">
            The School House System
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
          <p className="text-white/70 text-xs md:text-sm max-w-xl mx-auto pt-2">
            Building mutual cooperation, healthy competition, tolerance, and deep bonds through weekly inter-house challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {houses.map((house, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between h-48 hover:scale-[1.03] transition-all duration-300 ${house.color}`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Trophy size={20} className="text-accent" />
                </div>
              </div>
              <div>
                <h4 className="font-black text-base md:text-lg uppercase tracking-tight text-white">{house.name}</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-accent mt-1">Motto: {house.motto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Clubs & Societies Grid */}
      <section className="space-y-10">
        <PageSectionHeader
          badge="Nurturing Hobbies"
          title="Clubs & Societies"
          subtitle="Diverse student societies for every interest and passion."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {clubs.map((club, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-primary/10 rounded-2xl p-5 shadow-md hover:border-accent transition-all flex items-center gap-3 group"
            >
              <CheckCircle size={18} className="text-accent shrink-0" />
              <span className="text-xs md:text-sm font-bold text-primary group-hover:text-accent transition-colors">{club}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-[2.5rem] bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
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
            className="inline-flex items-center gap-2 bg-primary text-white font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-2xl hover:bg-secondary hover:shadow-lg transition-all"
          >
            <span>Admission Inquiry</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
