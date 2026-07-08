"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Home, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";

export default function ResidentialHostels() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { src: "/uploads/hostel/hostel.jpg", alt: "Vidyawadi Hostel Front Entrance" },
    { src: "/uploads/hostel/Hostels.png", alt: "Premium Residence Inside View" },
    { src: "/uploads/hostel/Hostels_1.png", alt: "Comfortable Boarders Living Space" },
    { src: "/uploads/hostel/Hostels_2.png", alt: "Modern Bathroom & Amenities" },
    { src: "/uploads/hostel/Hostels_3.png", alt: "Nurturing Study Environment" },
    { src: "/uploads/hostel/Hostels_4.png", alt: "Safe Play & CCTV Monitored Lawns" }
  ];

  const features = [
    {
      icon: Home,
      title: "8 Double-Storied Hostels",
      desc: "Providing class-wise structured accommodation from Nursery up to Graduation."
    },
    {
      icon: Shield,
      title: "65-Acre Perimeter Guard",
      desc: "Round-the-clock professional security, CCTV surveillance, and secure boundary."
    },
    {
      icon: Users,
      title: "Professional Caretaking",
      desc: "Managed by 2 dedicated wardens, 2 maids, and sweepers to ensure full support."
    },
    {
      icon: Sparkles,
      title: "Pure Jain Food",
      desc: "Nutritious and hygiene-certified Satvik meals served 5 times daily in modern mess."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-32 md:py-40 px-6 bg-white border-t border-[#1F2937]/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Images Carousel (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-premium-lg border border-slate-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={images[currentSlide].src}
                    alt={images[currentSlide].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrows */}
              <button 
                onClick={prevSlide} 
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/80 text-white hover:text-[#3D348B] flex items-center justify-center backdrop-blur-md transition-all active:scale-95 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide} 
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/80 text-white hover:text-[#3D348B] flex items-center justify-center backdrop-blur-md transition-all active:scale-95 z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Slide Counter Info */}
              <div className="absolute bottom-6 left-6 text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-premium-sm">
                {images[currentSlide].alt}
              </div>
            </div>

            {/* Carousel Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === currentSlide ? "border-[#3D348B] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Text & Features (5 Columns) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <Reveal>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7678ED]">Home Away From Home</span>
              </Reveal>
              <Reveal width="100%">
                <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight leading-none">
                  8 Residential Hostels
                </h2>
              </Reveal>
              <Reveal width="100%">
                <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed pt-2">
                  Spread across a lush 65-acre campus, LPS Vidyawadi offers a secure, disciplined, and nurturing residential environment. We provide home-like care where traditional values seamlessly integrate with modern education.
                </p>
              </Reveal>
            </div>

            {/* Features list */}
            <div className="space-y-6">
              {features.map((f, idx) => (
                <FadeIn key={idx} delay={idx * 0.05}>
                  <div className="flex gap-4 items-start bg-[#F8F9FC] border border-slate-100 p-5 rounded-3xl hover:shadow-premium-md transition-shadow">
                    <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shrink-0 shadow-premium-sm">
                      <f.icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-[#3D348B] uppercase text-xs sm:text-sm tracking-wider">
                        {f.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
