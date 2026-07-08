import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoticeBoard from "@/components/NoticeBoard";
import IntroSection from "@/components/IntroSection";
import CorePillars from "@/components/CorePillars";
import CategoryGrid from "@/components/CategoryGrid";
import VideoBento from "@/components/VideoBento";
import TestimonialSlider from "@/components/TestimonialSlider";
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

      {/* Core Pillars Details Section */}
      <CorePillars />

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* 360 Video Bento Tour Section */}
      <VideoBento />

      {/* Staggered Stats Section */}
      <StaggeredStats />

      {/* Life at GIS Section */}
      <LifeAtGis />

      {/* Parent & Alumni Testimonial Slider */}
      <TestimonialSlider />

      <Footer />

      {/* Modern Admissions Overlays */}
      <AdmissionQueryModal />
      <FloatingAdmissionButton />
    </main>
  );
}
