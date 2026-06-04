import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoticeBoard from "@/components/NoticeBoard";
import IntroSection from "@/components/IntroSection";
import CategoryGrid from "@/components/CategoryGrid";
import StaggeredStats from "@/components/StaggeredStats";
import LifeAtGis from "@/components/LifeAtGis";
import Footer from "@/components/Footer";
import AdmissionQueryModal from "@/components/AdmissionQueryModal";
import FloatingAdmissionButton from "@/components/FloatingAdmissionButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Notice Board Section */}
      <NoticeBoard />

      {/* Intro Description & Banner Carousel */}
      <IntroSection />

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Staggered Stats Section */}
      <StaggeredStats />

      {/* Life at GIS Section */}
      <LifeAtGis />

      <Footer />

      {/* Modern Admissions Overlays */}
      <AdmissionQueryModal />
      <FloatingAdmissionButton />
    </main>
  );
}
