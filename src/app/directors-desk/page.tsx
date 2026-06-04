"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Quote, Sparkles, Award, ArrowLeft, Heart, CheckCircle } from "lucide-react";

export default function DirectorsDesk() {
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
            <span className="text-white/80">Director&apos;s Desk</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Director&apos;s Desk
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            A commitment to progress, empowerment, and academic excellence.
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
                  src="/lps-vidhyawadi/director_portrait.png" 
                  alt="Director - Marudhar Mahila Shikshan Sangh" 
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
                  <span>Educational Leadership</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat tracking-tight mt-2">
                  Director&apos;s Desk
                </h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] md:text-xs">
                  Marudhar Mahila Shikshan Sangh
                </p>
              </div>

              {/* Core Credentials list */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3.5">
                {[
                  "Fostering girls' empowerment since 1956",
                  "Providing masters-level education under one roof",
                  "Dedicated to academic excellence & community values",
                  "Establishing dynamic learning environments"
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
            
            {/* Stylized Quote Block */}
            <div className="relative bg-[#F8F9FC] border-l-4 border-secondary rounded-r-2xl p-6 md:p-8 space-y-4">
              <Quote className="text-secondary/20 absolute -top-3 right-6" size={54} />
              <p className="text-primary font-serif italic text-lg md:text-xl font-bold leading-relaxed relative z-10">
                &ldquo;Quality education is a shared commitment between dedicated teachers, motivated students and enlightened parents.&rdquo;
              </p>
            </div>

            {/* Greeting */}
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">A Shared Commitment</p>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">
                Dear Friends,
              </h2>
            </div>

            {/* Body Text */}
            <div className="text-gray-600 font-medium text-sm md:text-base space-y-6">
              <p>
                Quality education is never an accident. It is always the result of high intention, sincere effort, 
                intelligent direction, and skillful execution. It represents the wise choice of many alternatives. 
                Most importantly, it is a deeply shared commitment between dedicated teachers, motivated students, 
                and enlightened parents.
              </p>
              
              <p>
                Since <strong className="text-primary font-bold">1956</strong>, the managing body, Marudhar Mahila Shikshan Sangh, 
                Vidyawadi has stood as a beacon of hope, progress, and empowerment for girl children in Western Rajasthan. 
                We are proud to offer an exhaustive educational journey from Nursery all the way to Master&apos;s level, 
                all under one roof. We ensure that our girls have every resource, support, and guidance to unlock their 
                individual potential.
              </p>
              
              <p>
                Our 65-acre campus serves as a multicultural melting pot. Girls join our residential community from varied 
                cultural, social, and regional backgrounds. Within Vidyawadi, they learn to live together as a harmonious 
                family, regardless of their roots. In doing so, they create new, deep, and lifelong bonds that remain with them 
                as a guiding force throughout their lives.
              </p>
              
              <p>
                We pledge to continuously advance our infrastructure, incorporate modern digital educational technologies, 
                maintain comfortable hostels, and provide homely, healthy, and wholesome meals, making our campus a 
                premium <strong className="text-primary font-bold">&quot;home away from home.&quot;</strong>
              </p>
            </div>

            {/* Closing and Signature */}
            <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Warm Regards,</p>
                <p className="text-xl font-black text-primary font-montserrat uppercase tracking-tight">
                  CEO / Director Message
                </p>
                <p className="text-xs font-semibold text-accent-hover uppercase tracking-wider">
                  Managing Body Leadership
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
            &quot;Empowering Girls, Nurturing Leaders, Inspiring Excellence.&quot;
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
