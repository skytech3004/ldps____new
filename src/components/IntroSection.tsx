"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSection, homePage, schoolImages } from "@/data/lpsVidhyawadiDatabase";

const bannerImages = schoolImages
  .filter((image) => image.category === "banner" || image.category === "gallery")
  .slice(0, 3)
  .map((image) => image.src);

export default function IntroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>(bannerImages);

  useEffect(() => {
    async function loadCarousel() {
      try {
        const res = await fetch("/api/admin/carousel");
        if (res.ok) {
          const data = await res.json();
          if (data.slides && data.slides.length > 0) {
            setCarouselImages(data.slides.map((s: { image: string }) => s.image));
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic carousel images", err);
      }
    }
    loadCarousel();
  }, []);

  useEffect(() => {
    if (carouselImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages]);

  const nextSlide = () => {
    if (carouselImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };
  const prevSlide = () => {
    if (carouselImages.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (carouselImages.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 mt-8">
      <div className="text-center max-w-5xl mx-auto mb-12">
        <p className="text-teal font-medium text-base md:text-lg leading-relaxed">
          <strong className="text-navy">Leeladevi Parasmal Sancheti English Medium Sr. Sec. School</strong>{" "}
          {getSection(homePage, "Welcome")[0]}
        </p>
      </div>

      <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden group shadow-2xl border-4 border-white bg-mint/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image 
              src={carouselImages[currentSlide]}
              alt={`School Banner ${currentSlide + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 z-30 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-navy/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-navy transition-all">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 z-30 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-navy/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-navy transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Pager Dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-navy scale-150" : "bg-teal/30 hover:bg-teal"}`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Spacer to account for dots outside image */}
      <div className="h-8"></div>
    </section>
  );
}
