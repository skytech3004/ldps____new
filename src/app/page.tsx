import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoticeBoard from "@/components/NoticeBoard";
import IntroSection from "@/components/IntroSection";
import CategoryGrid from "@/components/CategoryGrid";
import HostelSection from "@/components/HostelSection";
import StaggeredStats from "@/components/StaggeredStats";
import LifeAtVidyawadi from "@/components/LifeAtVidyawadi";
import UpcomingEventsAndBlogs from "@/components/UpcomingEventsAndBlogs";
import TestimonialSlider from "@/components/TestimonialSlider";
import Footer from "@/components/Footer";
import AdmissionQueryModal from "@/components/AdmissionQueryModal";
import FloatingAdmissionButton from "@/components/FloatingAdmissionButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FC]">
      <Navbar />
      <Hero />

      {/* Notice Board Section */}
      <NoticeBoard />

      {/* Intro Description & Banner Carousel */}
      <IntroSection />

      {/* 8 Residential Hostels Section */}
      <HostelSection />

      {/* Category Grid Section */}
      {/* <CategoryGrid /> */}

      {/* Staggered Stats Section */}
      <StaggeredStats />

      {/* Life @ Vidyawadi Section */}
      <LifeAtVidyawadi />

      {/* Journal & Upcoming Events Section */}
      <UpcomingEventsAndBlogs />

      {/* Parent & Alumni Testimonial Slider */}
      <TestimonialSlider />

      <Footer />

      {/* Modern Admissions Overlays */}
      <AdmissionQueryModal />
      <FloatingAdmissionButton />
    </main>
  );
}
