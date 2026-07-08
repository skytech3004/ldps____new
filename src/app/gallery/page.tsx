import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGalleryClient from "@/components/PhotoGalleryClient";

export const metadata = {
  title: "Life at LPS Vidyawadi | Gallery",
  description:
    "Explore the visual journey of Leeladevi Parasmal Sancheti English Medium Sr. Sec. School. View high-quality images of our campus facilities, hostel life, academic events, and school achievements.",
  keywords: [
    "LPS Vidyawadi gallery",
    "photo gallery",
    "Sancheti school photos",
    "Vidyawadi campus images",
  ],
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-white to-[#7678ED]/5 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="relative inline-block mb-10 text-left">
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] tracking-tight uppercase">
              Photo Gallery
            </h1>
            <div className="w-16 h-1.5 bg-[#F7B801] mt-3 rounded-full shadow-sm" />
          </div>

          {/* Render the premium Polaroid card grid and lightbox */}
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#3D348B] font-bold animate-pulse">Loading Gallery...</p>
            </div>
          }>
            <PhotoGalleryClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
