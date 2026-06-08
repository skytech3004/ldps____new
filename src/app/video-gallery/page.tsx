import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoGalleryClient from "@/components/VideoGalleryClient";

export const metadata = {
  title: "Official Video Gallery | LPS Vidyawadi",
  description:
    "Watch the latest videos from LPS Vidyawadi, including annual functions, sports events, and educational activities.",
  keywords: [
    "LPS Vidyawadi video gallery",
    "school videos",
    "Vidyawadi events videos",
    "educational videos",
  ],
};

export default function VideoGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-white to-[#7678ED]/5 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative inline-block mb-10 text-left">
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] tracking-tight uppercase">
              Video Gallery
            </h1>
            <div className="w-16 h-1.5 bg-[#F7B801] mt-3 rounded-full shadow-sm" />
          </div>

          <VideoGalleryClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
