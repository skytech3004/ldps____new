"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, BookOpen, Calendar, ArrowRight, ShieldCheck, Heart, Award, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id: string;
  title: string;
  src: string;
  alt: string;
  type: string;
  category?: string;
}

export default function NSSPage() {
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/admin/media-items?type=nss-photo");
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch NSS photos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === 0 ? galleryItems.length - 1 : (prev ?? 0) - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === galleryItems.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setActivePhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, galleryItems]);

  // Lock scroll
  useEffect(() => {
    if (activePhoto !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePhoto]);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-6 bg-gradient-to-br from-[#1E293B] to-[#3D348B] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#F7B801] font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">NSS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-white">
            National Service Scheme <span className="text-[#F7B801]">(NSS)</span>
          </h1>
          <p className="text-white/70 font-medium text-xs md:text-base max-w-2xl leading-relaxed">
            Developing personality and character of students through voluntary community service. "Not Me But You".
          </p>
        </div>
      </section>

      {/* Introduction Philosophy */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-4">
            <span className="text-[#F7B801] font-black uppercase tracking-[0.35em] text-xs block">Community Service</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">
              Philosophy & NSS Mission
            </h2>
            <div className="h-1.5 w-24 bg-[#F7B801] rounded-full" />
          </div>

          <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            The National Service Scheme (NSS) at Leeladevi Parasmal Sancheti English Medium School is a flagship student program designed to cultivate civic responsibility, social empathy, and democratic values. Guided by the motto <strong>"Not Me But You"</strong>, our volunteers participate in various community engagement activities including health camps, environment drives, educational workshops, and sanitation campaigns.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Heart, text: "Selfless Social Service" },
              { icon: Users, text: "Teamwork & Co-operation" },
              { icon: BookOpen, text: "Community Awareness" },
              { icon: ShieldCheck, text: "Character Building" }
            ].map((feature, fIdx) => (
              <div key={fIdx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B]">
                  <feature.icon size={16} />
                </div>
                <span className="text-sm font-black text-[#3D348B] uppercase tracking-wide">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Showcase Feature Card */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -top-10 -right-10 w-42 h-42 bg-[#7678ED]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-42 h-42 bg-[#F7B801]/10 rounded-full blur-3xl" />
          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl">
            <Image
              src="/uploads/gallery/nss-img-5.jpg"
              alt="NSS Social Service Activities"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* NSS Gallery Section */}
      <section className="py-20 px-6 bg-white border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="space-y-4">
            <span className="text-[#3D348B] font-black uppercase tracking-[0.4em] text-xs block">Activity Logs</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">
              NSS Gallery
            </h2>
            <div className="h-1.5 w-24 bg-[#F7B801] mx-auto rounded-full" />
            <p className="text-gray-500 font-medium text-xs md:text-sm max-w-xl mx-auto pt-2">
              Explore the visual catalog of our NSS volunteers contributing to social, medical, and environmental causes.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#3D348B] font-bold animate-pulse">Loading Gallery...</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center max-w-md mx-auto">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-40 text-[#3D348B]" />
              <p className="font-bold text-lg text-[#3D348B]">No Photos Yet</p>
              <p className="text-sm text-slate-500 mt-1">Photos of NSS activities will appear here once uploaded in the Admin portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {galleryItems.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  onClick={() => setActivePhoto(idx)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-[0_12px_30px_rgba(61,52,139,0.03)] overflow-hidden p-4 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_20px_45px_rgba(61,52,139,0.06)] hover:-translate-y-1.5 group"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img
                      src={item.src}
                      alt={item.alt || item.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-white uppercase bg-[#3D348B]/95 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        <ImageIcon size={10} />
                        View Full Screen
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[#3D348B] text-sm md:text-base font-extrabold line-clamp-1 text-left mt-4 group-hover:text-[#7678ED] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto !== null && galleryItems[activePhoto] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-6 px-4"
          >
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center text-white px-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-[#F7B801] uppercase">
                LPS NSS Service Portal
              </span>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-2.5 bg-white/5 hover:bg-white/15 hover:scale-105 border border-white/10 rounded-full text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Area */}
            <div className="flex-1 w-full flex items-center justify-center relative my-4 max-h-[75vh]">
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div
                key={activePhoto}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full md:max-w-4xl flex flex-col items-center justify-center"
              >
                <img
                  src={galleryItems[activePhoto].src}
                  alt={galleryItems[activePhoto].title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl border border-white/5 shadow-2xl"
                />
              </motion.div>

              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl text-center flex flex-col items-center gap-4 text-white px-4"
            >
              <div className="space-y-1">
                <p className="text-sm md:text-lg font-black text-white tracking-wide max-w-2xl leading-snug">
                  {galleryItems[activePhoto].title}
                </p>
                <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Photo {activePhoto + 1} of {galleryItems.length}
                </p>
              </div>

              {/* Mobile Controls */}
              <div className="flex sm:hidden items-center gap-6 mt-1">
                <button onClick={handlePrev} className="p-2.5 bg-white/5 rounded-full text-white"><ChevronLeft size={20} /></button>
                <button onClick={handleNext} className="p-2.5 bg-white/5 rounded-full text-white"><ChevronRight size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
