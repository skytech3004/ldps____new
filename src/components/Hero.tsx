"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/lpsVidhyawadiDatabase";

const socialSidebar = [
  { 
    name: "Facebook", 
    bg: "bg-[#3b5998]", 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> 
  },
  { 
    name: "X (Twitter)", 
    bg: "bg-black", 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> 
  },
  { 
    name: "Youtube", 
    bg: "bg-[#e52d27]", 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> 
  },
  { 
    name: "Instagram", 
    bg: "bg-[#262626]", 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
  }
];
 
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transitionStyle, setTransitionStyle] = useState("fade");
 
  useEffect(() => {
    async function loadHeroSlides() {
      try {
        const res = await fetch("/api/admin/carousel?key=hero");
        if (res.ok) {
          const data = await res.json();
          if (data.slides) {
            setSlides(data.slides);
          }
          if (data.transition) {
            setTransitionStyle(data.transition);
          }
        }
      } catch (err) {
        console.error("Failed to load hero slides from DB", err);
      } finally {
        setLoading(false);
      }
    }
    loadHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="h-[60vh] lg:h-[85vh] flex items-center justify-center bg-[#081736] text-white">
        <span className="animate-pulse font-bold tracking-widest text-sm uppercase">Loading Campus Showcase...</span>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative pt-32 lg:pt-0">
      {/* Announcement Bar */}
      <div className="bg-yellow-accent py-3 px-6 overflow-hidden border-b border-navy/10 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/30 to-transparent">
            <Star size={20} className="text-navy fill-navy" />
          <span className="text-navy font-black text-sm md:text-base uppercase tracking-wider text-center">
            Recognized & Affiliated to CBSE, New Delhi
          </span>
          <Star size={20} className="text-navy fill-navy" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative h-[60vh] lg:h-[85vh] overflow-hidden group">
        {/* Background Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={
              transitionStyle === "slideLeft" ? { opacity: 0, x: "100%" } :
              transitionStyle === "slideRight" ? { opacity: 0, x: "-100%" } :
              transitionStyle === "zoom" ? { opacity: 0, scale: 1.15 } :
              { opacity: 0 }
            }
            animate={
              transitionStyle === "zoom" ? { opacity: 1, scale: 1 } :
              { opacity: 1, x: 0 }
            }
            exit={
              transitionStyle === "slideLeft" ? { opacity: 0, x: "-100%" } :
              transitionStyle === "slideRight" ? { opacity: 0, x: "100%" } :
              transitionStyle === "zoom" ? { opacity: 0, scale: 0.95 } :
              { opacity: 0 }
            }
            transition={{
              duration: transitionStyle === "zoom" ? 1.2 : 0.8,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image 
              src={slides[currentSlide].image}
              alt={`LPS Vidyawadi campus ${currentSlide + 1}`}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 z-30 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 z-30 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:pr-24">
          <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Pager Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-yellow-accent scale-125" : "bg-white/50 hover:bg-white/80"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Floating Social Icons (Sidebar) */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-[2px]">
          {socialSidebar.map((social) => (
            <a 
              key={social.name}
              href="#"
              aria-label={social.name}
              className={`${social.bg} w-12 h-12 flex items-center justify-center cursor-pointer transition-all hover:-translate-x-2 shadow-lg`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  );
}
