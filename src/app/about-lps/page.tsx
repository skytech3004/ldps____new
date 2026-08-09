"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ArrowRight, Compass, Shield, Target, Award, Heart, Check,
  Sparkles, BookOpen, Home, Users, GraduationCap, CheckCircle2, ShieldCheck
} from "lucide-react";

export default function AboutLpsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.items && data.items.length > 0) {
            setCategories(data.items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const staticCarousel = [
    {
      src: "/lps-vidhyawadi/gallery-09.jpg",
      alt: "LPS Vidyawadi campus life and transport fleet",
      title: "School Transport Fleet",
      desc: "Fleet of buses ferrying students safely from peripheral areas up to 50 km."
    },
    {
      src: "/lps-vidhyawadi/gallery-01.jpg",
      alt: "LPS Vidyawadi student assembly and interactive events",
      title: "Student Leadership & Assembly",
      desc: "Nurturing discipline, public speaking, and community spirit through daily assemblies."
    },
    {
      src: "/lps-vidhyawadi/gallery-02.jpg",
      alt: "LPS Vidyawadi girls extracurricular activities and sports",
      title: "Extracurricular & Outdoor Play",
      desc: "Cultivating wellness, team building, and physical fitness in sprawling outdoor spaces."
    }
  ];

  const showcaseImages = categories.length > 0 
    ? categories.map((cat) => ({
        src: cat.image,
        alt: cat.title,
        title: cat.title,
        desc: `Explore our state-of-the-art facilities, campus layout and ${cat.title.toLowerCase()} moments.`
      }))
    : staticCarousel;

  const highlights = [
    "CBSE Curriculum from LKG to Class XII",
    "Safe & Secure Residential Campus for Girls",
    "Comfortable Hostel with 24×7 Care",
    "Experienced & Qualified Faculty",
    "Smart Classrooms & Digital Learning",
    "Science, Mathematics & Computer Laboratories",
    "Well-Equipped Library",
    "Individual Attention & Mentorship",
    "Sports, Yoga, Physical Fitness & Outdoor Activities",
    "Value-Based Education Rooted in Indian Culture",
    "Hygienic Dining Hall with Nutritious Meals",
    "Safe Transportation Facilities"
  ];

  const academicFocus = [
    { title: "Concept-Based Learning", desc: "Shifting away from rote memorization to build a deep understanding of core concepts." },
    { title: "Critical Thinking", desc: "Developing problem-solving, analytical reasoning, and independent decision making." },
    { title: "Creativity & Innovation", desc: "Encouraging fresh perspectives, originality, and hands-on experiments." },
    { title: "Collaboration", desc: "Fostering teamwork, communication, and mutual respect among students." },
    { title: "Digital Literacy", desc: "Integrating smart technology and computer applications directly into learning." },
    { title: "Leadership Qualities", desc: "Instilling ownership, public speaking confidence, and organization skills." }
  ];

  const hostelFeatures = [
    "Secure residential accommodation with perimeter control",
    "Caring hostel wardens and house mothers for daily mentorship",
    "Round-the-clock supervision and medical support",
    "Healthy, hygienic, and wholesome jain meals",
    "Dedicated study hours with individual academic guidance",
    "Comfortable, clean, and spacious living blocks"
  ];

  const missionPoints = [
    "Deliver excellence in CBSE education.",
    "Foster academic success and intellectual curiosity.",
    "Build confidence, discipline, and integrity.",
    "Encourage creativity, innovation, and critical thinking.",
    "Develop leadership and communication skills.",
    "Promote physical, emotional, and mental well-being.",
    "Inspire compassion, empathy, and social responsibility.",
    "Prepare students for lifelong learning and global opportunities."
  ];

  const objectives = [
    "Providing equal learning opportunities for every child.",
    "Encouraging curiosity, creativity, and innovation.",
    "Building confidence, resilience, and self-esteem.",
    "Developing leadership qualities and teamwork.",
    "Promoting scientific inquiry and lifelong learning.",
    "Strengthening communication and interpersonal skills.",
    "Encouraging participation in sports, arts, and cultural activities.",
    "Preserving Indian values while embracing global perspectives.",
    "Teaching environmental responsibility and sustainable living.",
    "Preparing students for higher education and successful careers.",
    "Inspiring respect, kindness, integrity, and responsible citizenship."
  ];

  const coCurricular = [
    "Sports & Athletics", "Yoga & Meditation", "NCC & Leadership Activities",
    "STEM Learning", "Science Exhibitions", "Robotics & Tech Exposure",
    "Debate & Public Speaking", "Performing Arts", "Music & Dance",
    "Creative Arts", "Cultural Celebrations", "Educational Tours"
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-6 overflow-hidden bg-gradient-to-b from-primary/5 via-white to-transparent">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3D348B_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award size={14} className="text-accent" />
              <span>Best CBSE Girls' Boarding School in Rajasthan</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight uppercase font-montserrat">
              Leeladevi Parasmal <br />
              <span className="text-accent relative inline-block">
                Sancheti
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-accent/20 -z-10" />
              </span>{" "}
              School
            </h1>

            <h2 className="text-lg md:text-xl font-bold text-secondary uppercase tracking-wide">
              Empowering Girls with Quality Education, Strong Values & Future-Ready Skills
            </h2>

            <div className="text-gray-600 text-sm md:text-base font-medium leading-relaxed space-y-4">
              <p>
                Leeladevi Parasmal Sancheti English Medium Sr. Sec. School, a premier institution under
                Marudhar Mahila Shikshan Sangh (Vidyawadi), has been nurturing confident, compassionate,
                and successful young women through quality education and value-based learning.
              </p>
              <p>
                Located on a beautiful, secure, and eco-friendly campus in Rani, Pali, Rajasthan, our school
                provides an ideal environment where girls are encouraged to explore their talents, excel
                academically, develop leadership skills, and become responsible global citizens.
              </p>
              <p>
                As one of the leading CBSE girls' boarding schools in Rajasthan, we combine academic excellence
                with character development, innovation, sports, life skills, and cultural values to prepare
                every student for success in higher education and beyond.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/apply-for-admission"
                className="bg-primary text-white font-extrabold px-6 py-3 rounded-xl hover:bg-secondary hover:shadow-lg hover:shadow-secondary/20 transition-all flex items-center gap-2 group text-sm uppercase tracking-wider"
              >
                <span>Apply For Admission</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="bg-white border-2 border-primary/10 text-primary font-extrabold px-6 py-3 rounded-xl hover:bg-primary/5 transition-all text-sm uppercase tracking-wider"
              >
                Visit Campus
              </Link>
            </div>
          </div>

          {/* Premium Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute -top-10 -right-6 w-36 h-36 opacity-30 pointer-events-none bg-[radial-gradient(#3D348B_2px,transparent_2px)] [background-size:12px_12px]" />
            <div className="absolute -left-8 top-1/3 w-16 h-16 rounded-full bg-accent opacity-85 shadow-[0_8px_24px_rgba(247,184,1,0.4)] animate-pulse" />

            <div className="relative w-full aspect-[4/3] max-w-md rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white group hover:scale-[1.01] transition-transform duration-500">
              <Image
                src="/lps-vidhyawadi/image.jpeg"
                alt="LPS Vidyawadi campus building"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Legacy and Foundation Section (Dark Navy Blue Gradient) */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary to-[#251f59] text-white overflow-hidden shadow-inner">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent opacity-5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">67+ Years of Legacy</span>
            <h2 className="text-3xl md:text-5xl font-black font-montserrat tracking-tight relative inline-block">
              Foundation of LPS Vidyawadi
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 bg-accent rounded-full" />
            </h2>
          </div>

          <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto pt-4">
            About 67 years ago in 1956, a few visionary minds realized the critical importance of girls&apos;
            education in Rajasthan and took the courageous initiative to make Vidyawadi a reality. Managed by
            the eminent <strong className="text-accent font-bold">Marudhar Mahila Shikshan Sangh</strong>, our institution
            has steadily consolidated democratic management, robust administration, and exceptional infrastructural
            advancements. We dedicate every resource to ensuring our girls receive a healthy, values-driven environment
            to flourish.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
            {[
              { val: "65", label: "Acre Campus" },
              { val: "7", label: "Comfortable Hostels" },
              { val: "80+", label: "Academic Staff" },
              { val: "CBSE", label: "Affiliation" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-3xl md:text-4xl font-black text-accent">{stat.val}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Parents Choose Us Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Parent Trust</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight leading-tight">
              Why Parents <br />Choose Us
            </h2>
            <div className="h-1.5 w-20 bg-accent rounded-full" />
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              Choosing the right school shapes your child's future. At Leeladevi Parasmal Sancheti English Medium
              Sr. Sec. School, we offer a complete educational experience that supports academic achievement,
              emotional well-being, and holistic development.
            </p>
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-start gap-4">
              <ShieldCheck size={28} className="text-accent shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-primary text-sm uppercase">Secure Residential Campus</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  24/7 campus security, wardens, support staff, and student-first medical protocols.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
            <span className="text-secondary font-black uppercase tracking-[0.25em] text-[10px] block mb-4">Key Highlights</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Academic Excellence Section */}
      <section className="py-20 px-6 bg-[#F0F2F6] border-y border-gray-150">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Academic Focus</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat">
              Academic Excellence with Holistic Development
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto text-sm md:text-base">
              Education is not limited to textbooks. We believe every child possesses unique talents waiting to be discovered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academicFocus.map((item, idx) => (
              <div key={idx} className="bg-white border border-primary/5 rounded-3xl p-6 shadow-md space-y-3 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h4 className="text-base font-black text-primary uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-xs md:text-sm text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
              Our experienced teachers create engaging classrooms where students become active, confident learners
              rather than passive recipients of knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* A Home Away From Home (Hostels) Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Residential Life</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight leading-tight">
              A Home Away From Home
            </h2>
            <div className="h-1.5 w-20 bg-accent rounded-full" />
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              Parents trust us because we provide a nurturing residential environment where students feel safe,
              happy, motivated, and fully cared for. Every child enjoys an atmosphere that feels truly like
              a second home.
            </p>

            <div className="space-y-4 pt-2">
              {hostelFeatures.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5.5 h-5.5 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Home size={13} />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-600 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Dotted Grid Decoration */}
            <div className="absolute -bottom-6 -left-6 w-36 h-36 opacity-30 pointer-events-none bg-[radial-gradient(#3D348B_2px,transparent_2px)] [background-size:12px_12px]" />

            {/* Main Picture Container */}
            <div className="relative w-full aspect-[4/3] max-w-md rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white group hover:scale-[1.01] transition-transform duration-500">
              <Image
                src="/lps-vidhyawadi/about.jpeg"
                alt="LPS Vidyawadi hostel life and group study"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Objectives Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary to-[#1f1947] text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Our Ideology</span>
            <h2 className="text-3xl md:text-4xl font-black text-accent uppercase font-montserrat">
              Vision, Mission & Values
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Vision Card (Col 4) */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-accent">Our Vision</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed">
                  To become one of India's most respected girls' educational institutions by nurturing confident,
                  ethical, innovative, and socially responsible young women who positively transform society through
                  knowledge, leadership, and compassion.
                </p>
              </div>
              <div className="text-accent text-xs font-black uppercase tracking-[0.2em] pt-4">Nurturing Leaders</div>
            </div>

            {/* Mission Card (Col 8) */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                <Compass size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-accent">Our Mission</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed">
                  Our mission is to provide a healthy, inclusive, and inspiring learning environment where every girl
                  receives quality education, develops strong values, and gains the confidence to lead a meaningful life.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {missionPoints.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-accent/25 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-white/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Objectives Sub-section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm space-y-6">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-accent text-center">Our Aims & Objectives</h3>
            <p className="text-white/70 text-xs md:text-sm font-medium text-center max-w-2xl mx-auto -mt-3">
              We are committed to creating an educational environment where every student can achieve her highest potential.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {objectives.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span className="text-xs font-semibold text-white/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Academics Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Extracurricular</span>
          <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Beyond Academics
          </h2>
          <div className="h-1.5 w-24 bg-accent rounded-full mx-auto" />
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-sm md:text-base">
            At Leeladevi Parasmal Sancheti English Medium Sr. Sec. School, learning extends far beyond the classroom
            to help students become independent, confident, and future-ready.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coCurricular.map((item, idx) => (
            <div key={idx} className="bg-white border border-primary/5 rounded-2xl p-5 shadow-sm text-center font-bold text-primary uppercase text-xs hover:border-accent hover:shadow transition-all">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Existing Campus Showcase */}
      <section className="bg-white border-t border-primary/5 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Experience LPS Life</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat">
              Vidyawadi Campus Showcase
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base">
              Explore snapshots of the lively residential environment, support facilities, and activities.
            </p>
          </div>

          {/* Desktop Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showcaseImages.map((slide, idx) => (
              <div
                key={idx}
                className="bg-[#F8F9FC] border border-primary/5 rounded-3xl overflow-hidden shadow-md group hover:-translate-y-2 transition-all duration-300"
                onMouseEnter={() => setActiveSlide(idx)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Description content */}
                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-black text-primary uppercase tracking-tight">
                    {slide.title}
                  </h4>
                  <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">
                    {slide.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {showcaseImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${activeSlide === idx
                  ? "bg-accent scale-110 shadow-[0_2px_8px_rgba(247,184,1,0.4)]"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section (Building Tomorrow's Women Leaders) */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent/5 rounded-full blur-xl" />
          <Heart className="text-accent mx-auto animate-bounce" size={40} />

          <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block">Admissions Open 2026-27</span>

          <h3 className="text-2xl md:text-3.5xl font-black text-primary font-montserrat uppercase leading-tight">
            Building Tomorrow's Women Leaders
          </h3>

          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            With academic excellence, modern infrastructure, experienced educators, strong moral values, and a secure
            residential campus, Leeladevi Parasmal Sancheti English Medium Sr. Sec. School continues to shape generations
            of young women ready to succeed in an ever-changing world.
          </p>

          <div className="pt-2">
            <Link
              href="/apply-for-admission"
              className="inline-flex items-center gap-2 bg-accent text-primary font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-accent-hover hover:scale-[1.02] hover:shadow-lg transition-all"
            >
              <span>Begin Admission Query</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
