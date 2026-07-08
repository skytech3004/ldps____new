"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";
import { BookOpen, Shield, Award, Users } from "lucide-react";

export default function CorePillars() {
  const pillars = [
    {
      icon: Award,
      title: "Academic Distinction",
      description: "Rigorous CBSE-affiliated curriculum led by outstanding faculty, state-of-the-art computer and science labs, and consistent 100% board results."
    },
    {
      icon: Shield,
      title: "Safe Boarding Care",
      description: "Comfortable double-story hostels, 24/7 warden support, healthy dining halls, and a complete campus perimeter security system."
    },
    {
      icon: Users,
      title: "Girls Empowerment",
      description: "A 65-acre private campus designed to cultivate leadership, independence, confidence, and values in every girl student."
    },
    {
      icon: BookOpen,
      title: "Co-Scholastic Growth",
      description: "Encompassing outdoor sports, music hubs, debating circles, cultural programs, and creative arts to build wholesome personality."
    }
  ];

  return (
    <section className="py-32 md:py-40 px-6 bg-white border-t border-[#1F2937]/5">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Editorial Title */}
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 text-left space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7678ED]">LPS Foundation</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight leading-none">
                Why Leeladevi Parasmal Sancheti School?
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 text-left">
            <Reveal width="100%">
              <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed">
                Discover the foundational pillars that make LPS Vidyawadi the first choice for residential girls education in Rajasthan.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 4-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="bg-[#F8F9FC] border border-slate-100 p-8 rounded-[2.2rem] hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 h-full space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shadow-premium-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-[#3D348B] uppercase tracking-tight font-montserrat">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
