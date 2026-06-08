"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id: string;
  title: string;
  src: string;
  alt: string;
  type: "photo" | "video";
}

export default function PhotoGalleryClient() {
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/admin/media-items?type=photo");
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Navigate lightbox photos
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
  }, [activePhoto]);

  // Lock scroll when lightbox is open
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
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#3D348B] font-bold animate-pulse">Loading Gallery...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && galleryItems.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-[#3D348B] mb-2">No Photos Available</h3>
          <p className="text-slate-500">We are currently updating our gallery. Please check back soon!</p>
        </div>
      )}

      {/* 3-Column Polaroid-Inspired Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            onClick={() => setActivePhoto(idx)}
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_15px_40px_rgba(61,52,139,0.04)] overflow-hidden p-5 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_25px_50px_rgba(61,52,139,0.08)] hover:-translate-y-1.5 group"
          >
            {/* Top custom gold line */}
            <div className="w-8 h-1 bg-[#F7B801] mb-4 rounded-full group-hover:w-12 transition-all duration-300" />

            {/* Custom title placed ABOVE the image */}
            <h3 className="text-[#3D348B] text-[15px] sm:text-base font-extrabold line-clamp-2 leading-snug mb-5 group-hover:text-[#7678ED] transition-colors duration-300 min-h-[44px]">
              {item.title}
            </h3>

            {/* Polaroid Padded Image Frame */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mt-auto bg-slate-50 border border-slate-100/50 shadow-inner flex items-center justify-center">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Overlay visual badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-white uppercase bg-[#3D348B]/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <ImageIcon size={10} />
                  View Full Image
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Premium Lightbox Modal Viewer */}
      <AnimatePresence>
        {activePhoto !== null && (
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
                LPS Vidyawadi Media Portal
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
              {/* Left Navigation Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Active Image with organic zoom */}
              <motion.div
                key={activePhoto}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full md:max-w-4xl flex flex-col items-center justify-center"
              >
                <img
                  src={galleryItems[activePhoto].src}
                  alt={galleryItems[activePhoto].alt}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl border border-white/5 shadow-2xl"
                />
              </motion.div>

              {/* Right Navigation Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Info Bar & Mobile Swiper Controls */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-3xl text-center flex flex-col items-center gap-4 text-white px-4"
            >
              {/* Title display */}
              <div className="space-y-1">
                <p className="text-sm md:text-lg font-black text-white tracking-wide max-w-2xl leading-snug">
                  {galleryItems[activePhoto].title}
                </p>
                <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Photo {activePhoto + 1} of {galleryItems.length}
                </p>
              </div>

              {/* Mobile Arrows (Visible only on small screens) */}
              <div className="flex sm:hidden items-center gap-6 mt-1">
                <button
                  onClick={handlePrev}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full cursor-pointer text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full cursor-pointer text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
