"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Quote, Sparkles, Award, ArrowLeft, Heart, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ChairmansDesk() {
  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Decorative Breadcrumb Banner */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>About</span>
            <span>/</span>
            <span className="text-white/80">Chairman&apos;s Desk</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Chairman&apos;s Desk
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            A vision of excellence, child empowerment, and holistic education.
          </p>
        </div>
      </section>

      {/* Main Content Details */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            
            {/* The Professional Card */}
            <div className="relative bg-white border border-primary/10 rounded-[2.5rem] p-6 shadow-2xl hover:shadow-[0_20px_50px_rgba(61,52,139,0.15)] transition-all duration-500 overflow-hidden group">
              {/* Card Accent Gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[8rem] -z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full -z-10 blur-xl" />
              
              {/* Border accents */}
              <div className="absolute top-4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

              {/* Portrait Wrapper */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-md border-4 border-white bg-gray-100 mb-6">
                <Image 
                  src="/lps-vidhyawadi/chairman_portrait.png" 
                  alt="Dr. Sushil Gupta - Chairman" 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 420px" 
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Title & Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 px-4.5 py-1 rounded-full text-accent-hover font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>Visionary Leadership</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat tracking-tight mt-2">
                  Dr. Sushil Gupta
                </h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] md:text-xs">
                  Chairman&apos;s Desk
                </p>
              </div>

              {/* Core Credentials list */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3.5">
                {[
                  "Committed to quality education since inception",
                  "Pioneering holistic development for the girl child",
                  "Encouraging self-reliance and global citizenship",
                  "Supportive of academic & co-scholastic excellence"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-accent shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-600 font-medium text-xs md:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Link */}
            <Link 
              href="/about-lps" 
              className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-extrabold uppercase text-xs tracking-wider transition-colors ml-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to About LPS</span>
            </Link>
          </div>

          {/* Right Column: Message Letter */}
          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-8 leading-relaxed">
            
            {/* The Stylized Aristotle Quote */}
            <div className="relative bg-[#F8F9FC] border-l-4 border-secondary rounded-r-2xl p-6 md:p-8 space-y-4">
              <Quote className="text-secondary/20 absolute -top-3 right-6" size={54} />
              <p className="text-primary font-serif italic text-lg md:text-xl font-bold leading-relaxed relative z-10">
                &ldquo;All those who have meditated on the art of governing mankind have been convinced that the fate of empires depends on the education of youth.&rdquo;
              </p>
              <p className="text-secondary font-black text-xs uppercase tracking-wider text-right">
                — Aristotle
              </p>
            </div>

            {/* Greeting */}
            <div>
              <p className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">A Message to our Community</p>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">
                Dear Friends,
              </h2>
            </div>

            {/* Body Text */}
            <div className="text-gray-600 font-medium text-sm md:text-base space-y-6">
              <p>
                Education cannot be confined merely to school buildings, classrooms, and term examinations. It is a lifelong, 
                dynamic process. What we know, what we do, and what we constantly need to learn and achieve cannot all be taught by any 
                single school. However, a great school performs a vital and transformative service. It equips the learner with 
                the basic tools of self-education and provides her with the strong fundamentals of knowledge. 
                This ensures she reaches a stage where she is fully capable of learning and growing on her own. 
                In this light, the teacher ceases to be a mere giver of knowledge and turns into an inspiring facilitator.
              </p>
              
              <p>
                At Leeladevi Parasmal Sancheti English Medium School, we transform our institution from a simple place of learning the 
                basic curriculum into a core center of human resource development. Here, in addition to the standard academic syllabus, 
                the innate talents and individual abilities of the girl child are unearthed, encouraged, and brought to fruition. 
                Our girls learn how to learn, how to act beyond the boundaries of a prescribed curriculum, and how to apply their 
                insights to innovative, creative activities.
              </p>
              
              <p>
                Under our philosophy, education no longer remains a mere preparation for a three-hour examination. 
                Instead, it is transformed into a lifetime process of character refinement, critical thinking, and progressive 
                modification of thought processes and behavioral values. It is this depth of excellence and quality that produces 
                leaders who will move our nation forward. 
              </p>
              
              <p>
                Inspired by these noble ideals, the managing body, <strong className="text-primary font-bold">Marudhar Mahila Shikshan Sangh</strong>, 
                and our dedicated faculty ceaselessly strive for educational excellence. We provide a sylvan residential home, a modern 
                infrastructure, and a caring atmosphere where girls from diverse backgrounds learn to live as a unified family, creating 
                lifelong bonds.
              </p>
            </div>

            {/* Closing and Signature */}
            <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Warm Regards,</p>
                <p className="text-xl font-black text-primary font-montserrat uppercase tracking-tight">
                  Dr. Sushil Gupta
                </p>
                <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider">
                  Chairman, Managing Body
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Marudhar Mahila Shikshan Sangh, Vidyawadi
                </p>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/30 rotate-12 hidden xs:flex">
                <Award size={36} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="bg-gradient-to-r from-primary to-[#282163] py-16 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <Heart className="text-accent mx-auto animate-pulse" size={32} />
          <h3 className="text-2xl md:text-3xl font-black font-montserrat uppercase">
            &quot;A society that educates its daughters rewrites its destiny.&quot;
          </h3>
          <p className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
            Leeladevi Parasmal Sancheti School • Vidyawadi, Khimel
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
