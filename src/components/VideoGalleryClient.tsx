"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Film, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id: string;
  title: string;
  src: string;
  alt: string;
  type: "photo" | "video";
}

export default function VideoGalleryClient() {
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/admin/media-items?type=video");
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    try {
      // Handle both embed URLs and standard watch URLs
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[7].length === 11) ? match[7] : null;
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } catch (e) {
      console.error("Failed to parse YT URL", e);
    }
    return null;
  };

  // Navigate lightbox videos
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeVideo === null) return;
    setActiveVideo((prev) => (prev === 0 ? galleryItems.length - 1 : (prev ?? 0) - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeVideo === null) return;
    setActiveVideo((prev) => (prev === galleryItems.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideo === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setActiveVideo(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, galleryItems]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (activeVideo !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#3D348B] font-bold animate-pulse">Loading Videos...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && galleryItems.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Film size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-[#3D348B] mb-2">No Videos Available</h3>
          <p className="text-slate-500">We are currently updating our video gallery. Please check back soon!</p>
        </div>
      )}

      {/* 2-Column Grid Layout for Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {galleryItems.map((item, idx) => {
          const thumb = getYouTubeThumbnail(item.src);
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.1 }}
              onClick={() => setActiveVideo(idx)}
              className="bg-white rounded-2xl border border-slate-100 shadow-[0_15px_40px_rgba(61,52,139,0.04)] overflow-hidden p-5 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_25px_50px_rgba(61,52,139,0.08)] hover:-translate-y-1.5 group"
            >
              {/* Top custom gold line */}
              <div className="w-8 h-1 bg-[#F7B801] mb-4 rounded-full group-hover:w-12 transition-all duration-300" />

              <h3 className="text-[#3D348B] text-[15px] sm:text-base font-extrabold line-clamp-2 leading-snug mb-5 group-hover:text-[#7678ED] transition-colors duration-300 min-h-[44px]">
                {item.title}
              </h3>

              {/* Video Thumbnail Frame */}
              <div className="relative aspect-video rounded-xl overflow-hidden mt-auto bg-black flex items-center justify-center shadow-inner border border-slate-100">
                {thumb ? (
                  <img src={thumb} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 border border-white/40">
                    <PlayCircle size={40} className="text-[#F7B801] fill-[#F7B801]" />
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                
                <div className="absolute inset-0 flex items-center justify-center bg-[#3D348B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-white uppercase bg-[#3D348B]/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                     Watch Video
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-6 px-4"
          >
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center text-white px-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-[#F7B801] uppercase">
                LPS Vidyawadi Media Portal
              </span>
              <button
                onClick={() => setActiveVideo(null)}
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
                key={activeVideo}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl aspect-video flex flex-col items-center justify-center"
              >
                <iframe
                  src={galleryItems[activeVideo].src}
                  title={galleryItems[activeVideo].title}
                  allowFullScreen
                  className="w-full h-full rounded-xl border border-white/5 shadow-2xl"
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
                  {galleryItems[activeVideo].title}
                </p>
                <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Video {activeVideo + 1} of {galleryItems.length}
                </p>
              </div>

              {/* Mobile Arrows */}
              <div className="flex sm:hidden items-center gap-6 mt-1">
                <button
                  onClick={handlePrev}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white"
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
