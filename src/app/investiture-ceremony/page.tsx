"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, ChevronLeft, ChevronRight, ImageIcon, Award, Calendar, CheckSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  defaultInvestitureCeremonyPhotos,
  type InvestitureCeremonyGalleryRecord,
} from "@/data/investitureCeremony";

interface CabinetMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  sortOrder: number;
}

interface GalleryPhoto {
  src: string;
  alt: string;
  title: string;
}

export default function InvestitureCeremonyPage() {
  const [cabinet, setCabinet] = useState<CabinetMember[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(defaultInvestitureCeremonyPhotos);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [loadingCabinet, setLoadingCabinet] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const galleryCount = useMemo(() => gallery.length, [gallery]);

  useEffect(() => {
    async function fetchCabinet() {
      try {
        setLoadingCabinet(true);
        const res = await fetch("/api/admin/cabinet");
        if (res.ok) {
          const data = await res.json();
          setCabinet(data);
        }
      } catch (err) {
        console.error("Failed to fetch cabinet members:", err);
      } finally {
        setLoadingCabinet(false);
      }
    }
    fetchCabinet();
  }, []);

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoadingGallery(true);
        const res = await fetch("/api/admin/galleries", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as InvestitureCeremonyGalleryRecord[];
        const ceremony = data.find((item) => item.page === "investiture-ceremony")
          ?? data.find((item) => item.title?.toLowerCase().includes("investiture ceremony"))
          ?? null;

        if (ceremony && ceremony.photos.length > 0) {
          setGallery(
            ceremony.photos.map((src, index) => ({
              src,
              alt: `${ceremony.title || "Investiture Ceremony"} photo ${index + 1}`,
              title: `Photo ${index + 1}`,
            }))
          );
        } else {
          setGallery(defaultInvestitureCeremonyPhotos);
        }
      } catch (err) {
        console.error("Failed to fetch ceremony gallery:", err);
        setGallery(defaultInvestitureCeremonyPhotos);
      } finally {
        setLoadingGallery(false);
      }
    }
    fetchGallery();
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === 0 ? gallery.length - 1 : (prev ?? 0) - 1));
  }, [activePhoto, gallery.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === gallery.length - 1 ? 0 : (prev ?? 0) + 1));
  }, [activePhoto, gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setActivePhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, handleNext, handlePrev]);

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

  // Helper to generate initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .replace(/Ms\.|Mr\./gi, "")
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-white to-[#7678ED]/5 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="relative inline-block text-left">
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] tracking-tight uppercase">
              Investiture Ceremony
            </h1>
            <div className="w-16 h-1.5 bg-[#F7B801] mt-3 rounded-full shadow-sm" />
          </div>

          {/* Intro Section */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_15px_40px_rgba(61,52,139,0.03)] grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7678ED]/10 text-[#3D348B] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                Student Leadership
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#3D348B] leading-tight">
                Oath of the Student Cabinet & Formal Induction
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                The school is proud to introduce our newly elected Student Cabinet. These student leaders officially took their oath of office during our formal Investiture Ceremony, pledging to uphold the school values of truth, responsibility, and discipline.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                The cabinet members spearhead student activities, coordinate house events, and serve as the official bridge between the student body and the administration. Their exemplary conduct serves as a beacon of inspiration for every student in our institution.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-50 px-3.5 py-2 rounded-xl">
                  <Calendar size={14} className="text-[#F7B801]" />
                  Annual Session 2026-27
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-50 px-3.5 py-2 rounded-xl">
                  <CheckSquare size={14} className="text-[#F7B801]" />
                  Democratic Elections
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-[#3D348B] flex items-center justify-center">
              <Image
                src="https://www.lpsvidhyawadi.com/Images/aboutBanner.jpg"
                alt="Investiture Ceremony Banner"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-xs font-black uppercase tracking-widest drop-shadow-md">
                  Vidyawadi Campus Pride
                </p>
              </div>
            </div>
          </div>

          {/* Cabinet Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Award className="text-[#F7B801]" size={24} />
              <h3 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-wide">
                The Student Cabinet Portfolio
              </h3>
            </div>

            {loadingCabinet ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-10 h-10 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#3D348B] text-sm font-bold animate-pulse">Loading cabinet portfolios...</p>
              </div>
            ) : cabinet.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <p className="text-slate-500">No cabinet portfolios defined. Seed data is loading.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cabinet.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(61,52,139,0.03)] p-5 flex flex-col items-center text-center hover:shadow-[0_15px_40px_rgba(61,52,139,0.07)] hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Role Tag */}
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7678ED] bg-[#7678ED]/10 px-3 py-1 rounded-full mb-5">
                      {member.role}
                    </span>

                    {/* Image / Avatar Placeholder */}
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-[#F7B801] bg-gradient-to-br from-[#7678ED]/10 to-[#3D348B]/10 flex items-center justify-center transition-all duration-300 relative">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-[#3D348B]">
                          {getInitials(member.name)}
                        </span>
                      )}
                    </div>

                    <h4 className="text-[#3D348B] font-black text-base line-clamp-1">
                      {member.name}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">
                      LPS Student Leader
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-[#F7B801]" size={24} />
              <h3 className="text-xl md:text-2xl font-black text-[#3D348B] uppercase tracking-wide">
                Ceremony Gallery
              </h3>
            </div>

            {loadingGallery ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <p className="text-slate-500">Loading ceremony gallery...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {gallery.map((image, idx) => (
                  <motion.div
                    key={`${image.src}-${idx}`}
                    onClick={() => setActivePhoto(idx)}
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 cursor-pointer shadow-sm group"
                  >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider bg-[#3D348B]/80 px-2 py-1 rounded">
                        Zoom
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox Viewer */}
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
              <span className="text-xs md:text-sm font-black tracking-widest text-[#F7B801] uppercase">
                LPS Investiture Gallery
              </span>
              <button
                onClick={() => setActivePhoto(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Carousel Area */}
            <div className="w-full max-w-5xl flex items-center justify-between gap-4">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white shrink-0 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Image View */}
              <div className="relative flex-1 aspect-[4/3] max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
                <Image
                  src={gallery[activePhoto].src}
                  alt={gallery[activePhoto].alt}
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white shrink-0 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Bar Details */}
            <div className="w-full max-w-3xl text-center px-4">
              <h4 className="text-white font-extrabold text-base md:text-lg">
                {gallery[activePhoto].title}
              </h4>
              <p className="text-white/60 text-xs md:text-sm mt-1">
                Image {activePhoto + 1} of {galleryCount}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
