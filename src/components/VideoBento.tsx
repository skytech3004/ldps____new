"use client";

import React, { useState, useEffect } from "react";
import { Play, X, Shield, Star, Award, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";

export default function VideoBento() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [thumbnail, setThumbnail] = useState("/uploads/hostel/hostel.jpg");

  useEffect(() => {
    async function fetchVideoSettings() {
      try {
        const res = await fetch("/api/admin/brand");
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items)) {
            const urlItem = items.find(i => i.key === "video_url");
            const thumbItem = items.find(i => i.key === "video_thumbnail");
            if (urlItem && urlItem.value) setVideoUrl(urlItem.value);
            if (thumbItem && thumbItem.value) setThumbnail(thumbItem.value);
          }
        }
      } catch (err) {
        console.error("Failed to load bento video settings:", err);
      }
    }
    fetchVideoSettings();
  }, []);

  return (
    <section className="py-32 md:py-40 px-6 bg-white border-t border-[#1F2937]/5">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Title */}
        <div className="grid lg:grid-cols-12 gap-8 items-end text-left">
          <div className="lg:col-span-8 space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7678ED]">Campus Overview</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight leading-none">
                Experience Vidyawadi in 360°
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal width="100%">
              <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed">
                Take a virtual tour through our 65-acre lush green campus, modern residential halls, digital libraries, and smart facilities.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Large Video Box - 7 Cols */}
          <div className="lg:col-span-8 group relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-premium-lg border border-slate-100 bg-slate-900">
            <img 
              src={thumbnail} 
              alt="LPS Vidyawadi Campus Video Thumbnail" 
              className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/uploads/hostel/hostel.jpg";
              }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#0b1738]/40 group-hover:bg-[#0b1738]/50 transition-colors flex items-center justify-center">
              {/* Play Button */}
              <button 
                onClick={() => setIsOpen(true)}
                className="w-20 h-20 rounded-full bg-accent hover:bg-accent-hover text-[#3D348B] flex items-center justify-center shadow-premium-lg hover:scale-110 active:scale-95 transition-all duration-300 relative cursor-pointer"
              >
                <Play size={28} className="fill-current ml-1" />
                <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-60"></span>
              </button>
            </div>
            
            {/* Details floating tag */}
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/10 shadow-premium-sm">
              <MapPin size={10} className="text-accent" />
              Khimel, Rajasthan
            </div>
          </div>

          {/* Right Bento Cards Column - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            {/* Card 1: Security parameters */}
            <FadeIn delay={0.1}>
              <div className="bg-[#F8F9FC] border border-slate-100 p-8 rounded-[2.2rem] flex gap-5 text-left items-start shadow-premium-sm hover:shadow-premium-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shrink-0 shadow-premium-sm">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-black text-[#3D348B] uppercase text-sm tracking-wider mb-1">Perimeter Guard</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    24/7 continuous CCTV coverage, gated access, and perimeter security guards keeping a secure boarding habitat.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Card 2: Environment */}
            <FadeIn delay={0.2}>
              <div className="bg-[#F8F9FC] border border-slate-100 p-8 rounded-[2.2rem] flex gap-5 text-left items-start shadow-premium-sm hover:shadow-premium-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shrink-0 shadow-premium-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-black text-[#3D348B] uppercase text-sm tracking-wider mb-1">65 Sprawling Acres</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    Eco-friendly botanical pathways, clean playing fields, and abundant organic gardens offering a healthy lifestyle.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Card 3: Board results */}
            <FadeIn delay={0.3}>
              <div className="bg-[#F8F9FC] border border-slate-100 p-8 rounded-[2.2rem] flex gap-5 text-left items-start shadow-premium-sm hover:shadow-premium-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shrink-0 shadow-premium-sm">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-black text-[#3D348B] uppercase text-sm tracking-wider mb-1">CBSE Affiliation</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    Holistic curriculum matching state-of-the-art standards in technology, analytics, sports, and science labs.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>

      {/* Video Lightbox Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer border border-white/10"
              >
                <X size={20} />
              </button>

              {/* Campus Video (or fallback intro slides/placeholder video) */}
              <iframe
                className="w-full h-full border-0"
                src={videoUrl.includes("?") ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`}
                title="LPS Vidyawadi Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
