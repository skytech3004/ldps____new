"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrePrimaryClient from "@/components/PrePrimaryClient";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";

export default function PrePrimaryPageClient() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-gray-800 flex flex-col overflow-x-hidden selection:bg-accent selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Modern Vibrant Hero Section - Spacing 120-160px */}
        <div className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 overflow-hidden bg-gradient-to-br from-[#3D348B] to-[#7678ED] text-white">
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="max-w-7xl mx-auto text-left relative z-10 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-xs md:text-sm font-black tracking-[0.2em] uppercase border border-white/10 backdrop-blur-md shadow-premium-sm">
              LPS Junior Wing
            </span>
            
            <Reveal width="100%">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.05] font-montserrat uppercase">
                Nurturing Young Minds <br className="hidden md:block" />
                with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FFE600]">Joy & Creativity</span>
              </h1>
            </Reveal>

            <Reveal width="100%" delay={0.2}>
              <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed font-medium">
                Step into a world of vibrant learning where every corner is designed to spark curiosity, 
                foster social growth, and build a strong foundation for lifelong learning.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Spacing limit 120-160px for section body */}
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          {/* Core Interactive Showcase Grid */}
          <PrePrimaryClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
