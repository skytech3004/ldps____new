"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function LifeAtVidyawadi() {
  const [activeFilter, setActiveFilter] = useState("Recent");
  const [filters, setFilters] = useState<string[]>(["Recent", "Events", "Fun & Food Fest", "Hostel", "Infrastructure", "Laboratories"]);

  React.useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/admin/filters?type=gallery");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFilters(["Recent", ...data.map((f: any) => f.name)]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch gallery filters:", error);
      }
    };
    fetchFilters();
  }, []);

  const moments = [
    { src: "/lps-vidhyawadi/gallery-01.jpg", title: "Residential Comforts", category: "Hostel" },
    { src: "/lps-vidhyawadi/gallery-02.jpg", title: "Lush Green Pathways", category: "Infrastructure" },
    { src: "/lps-vidhyawadi/gallery-03.jpg", title: "Practical Science Lab", category: "Laboratories" },
    { src: "/lps-vidhyawadi/gallery-04.jpg", title: "Morning School Assembly", category: "Events" },
    { src: "/lps-vidhyawadi/gallery-05.jpg", title: "Annual Fest Food Court", category: "Fun & Food Fest" },
    { src: "/lps-vidhyawadi/gallery-06.jpg", title: "Digital Literacy Hub", category: "Laboratories" },
    { src: "/lps-vidhyawadi/gallery-07.jpg", title: "Vidyawadi Main Block", category: "Infrastructure" },
    { src: "/lps-vidhyawadi/gallery-08.jpg", title: "Safe Boarding Halls", category: "Hostel" },
    { src: "/lps-vidhyawadi/gallery-09.jpg", title: "Sports Day Champions", category: "Events" },
    { src: "/lps-vidhyawadi/gallery-10.jpg", title: "Vibrant Stalls & Fun", category: "Fun & Food Fest" },
    { src: "/lps-vidhyawadi/gallery-11.jpg", title: "Interactive Smart Class", category: "Infrastructure" },
    { src: "/lps-vidhyawadi/gallery-12.jpg", title: "Creative Fine Arts Studio", category: "Laboratories" },
  ];

  const filteredMoments = activeFilter === "Recent" 
    ? moments.slice(0, 8) // Show first 8 for 'Recent'
    : moments.filter(item => item.category === activeFilter);

  return (
    <section className="py-32 md:py-40 px-6 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Row: Flex row on large screens */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 text-left">
          <div className="space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7678ED]">Campus Vibe</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight leading-none">
                Life <span className="text-[#F7B801] font-black">@LPS Vidyawadi</span>
              </h2>
            </Reveal>
          </div>

          {/* Dynamic Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#3D348B] text-white shadow-premium-sm"
                    : "bg-white text-[#3D348B] border border-slate-100 hover:bg-[#F1F2F6]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* View All Button */}
          <div className="shrink-0">
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3D348B] hover:text-[#7678ED] transition-colors group"
            >
              View All Moments
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Gallery Grid - 4 Columns */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMoments.map((moment, idx) => (
              <Link 
                href={`/gallery?category=${moment.category}`}
                key={moment.src}
                className="block"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-premium-sm hover:shadow-premium-lg border border-slate-100 bg-slate-900 cursor-pointer"
                >
                  <Image
                    src={moment.src}
                    alt={moment.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-750 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Info Text Float */}
                  <div className="absolute bottom-6 left-6 right-6 text-left space-y-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-[#F7B801] text-[#3D348B] text-[9px] font-black uppercase tracking-widest rounded-full">
                      {moment.category}
                    </span>
                    <h4 className="text-white font-black text-sm uppercase leading-tight tracking-tight drop-shadow-sm">
                      {moment.title}
                    </h4>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
