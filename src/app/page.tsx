import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { connectToDatabase } from "@/lib/mongodb";
import { CarouselModel } from "@/models/Carousel";
import NoticeBoard from "@/components/NoticeBoard";
import IntroSection from "@/components/IntroSection";

const HostelSection = dynamic(() => import("@/components/HostelSection"));
const StaggeredStats = dynamic(() => import("@/components/StaggeredStats"));
const LifeAtVidyawadi = dynamic(() => import("@/components/LifeAtVidyawadi"));
const LifeAtGis = dynamic(() => import("@/components/LifeAtGis"));
const TestimonialSlider = dynamic(() => import("@/components/TestimonialSlider"));
const Footer = dynamic(() => import("@/components/Footer"));
const AdmissionQueryModal = dynamic(() => import("@/components/AdmissionQueryModal"));
const FloatingAdmissionButton = dynamic(() => import("@/components/FloatingAdmissionButton"));

export const revalidate = 300;

async function loadHero() {
  try {
    await connectToDatabase();
    const carousel = await CarouselModel.findOne({ key: "hero" }).select("slides transition").lean();
    const slides = Array.isArray(carousel?.slides)
      ? carousel.slides
          .filter((slide: { image?: string; title?: string; description?: string }) => slide?.image)
          .map((slide: { image?: string; title?: string; description?: string }) => ({
            image: slide.image || "",
            title: slide.title || "",
            description: slide.description || "",
          }))
      : [];
    return slides;
  } catch {
    return [];
  }
}

export default async function Home() {
  const hero = await loadHero();
  return (
    <main className="min-h-screen bg-[#F8F9FC]">
      <Navbar />
      <Hero initialSlides={hero} />

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



      {/* Journal & Upcoming Events Section */}
      {/* <UpcomingEventsAndBlogs /> */}

      {/* Parent & Alumni Testimonial Slider */}
      <TestimonialSlider />
      {/* Life @ Vidyawadi Section */}
      <LifeAtVidyawadi />

      {/* Campus Video Highlights Section */}
      <LifeAtGis />
      <Footer />

      {/* Modern Admissions Overlays */}
      <AdmissionQueryModal />
      <FloatingAdmissionButton />
    </main>
  );
}
