"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sun, Moon, Coffee, BookOpen, Utensils, Trophy, BookMarked, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DayAtSchoolPage() {
  const [activeStep, setActiveStep] = useState(0);

  const timelineSteps = [
    {
      time: "06:00 AM",
      label: "Rising & Morning Drills",
      icon: Sun,
      color: "text-amber-500",
      desc: "A fresh start to the day. Boarders wake up for morning prayers, clean up their abodes, and head out for active physical drills, gymnastics, or yoga under physical trainers."
    },
    {
      time: "08:00 AM",
      label: "Morning Assembly",
      icon: Coffee,
      color: "text-yellow-500",
      desc: "After a wholesome breakfast, girls gather in the assembly yard. Daily prayers, Sanskrit shloka recitations, news briefings, and thought presentations build early focus."
    },
    {
      time: "08:30 AM",
      label: "Academic Classes",
      icon: BookOpen,
      color: "text-blue-500",
      desc: "Classroom hours focus on CBSE conceptual curricula. Smart classes integrated with Interactive Flat Panels bring audio-visual modules and scientific queries to life."
    },
    {
      time: "02:00 PM",
      label: "Jain Vegetarian Lunch",
      icon: Utensils,
      color: "text-emerald-500",
      desc: "Students dine at the state-of-the-art dining hall seating 400. Freshly cooked vegetarian meals strictly compliant with Jain dietary rules are served."
    },
    {
      time: "04:00 PM",
      label: "Sports & Skill Clubs",
      icon: Trophy,
      color: "text-accent-hover",
      desc: "After recess, girls head to the sports complex for softball, basketball, table tennis, skating, or attend designated clubs (music, art & craft, ecological awareness)."
    },
    {
      time: "06:30 PM",
      label: "Supervised Prep Study",
      icon: BookMarked,
      color: "text-indigo-500",
      desc: "Structured evening self-study hours. Supervised by resident academic wardens to resolve homework queries and clarify math, science, and language concepts."
    },
    {
      time: "08:30 PM",
      label: "Dinner & Bedtime",
      icon: Moon,
      color: "text-purple-500",
      desc: "Wholesome vegetarian dinner followed by warm milk and biscuits. Girls return to their abodes for bedtime prayers, closing a structured day of holistic growth."
    }
  ];

  const currentStep = timelineSteps[activeStep];
  const StepIcon = currentStep.icon;

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
            <span>Schooling</span>
            <span>/</span>
            <span className="text-white/80">A Day at School</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            A Day at LPS Vidyawadi
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Take a visual scroll through a boarder student&apos;s daily routine and learning milestones.
          </p>
        </div>
      </section>

      {/* Interactive Timeline Slider Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Daily Routine</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Boarder Student&apos;s Timeline
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        {/* Timeline navigation bubbles */}
        <div className="relative max-w-5xl mx-auto">
          {/* horizontal progress line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10 hidden md:block" />
          
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-0 items-center">
            {timelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex flex-col items-center justify-center w-28 md:w-32 py-3 rounded-2xl border transition-all duration-300 shrink-0 ${
                  activeStep === idx 
                    ? "bg-primary border-primary text-white shadow-lg scale-105" 
                    : "bg-white border-primary/10 text-primary/80 hover:bg-primary/5 hover:border-primary/20"
                }`}
              >
                <span className="text-xs font-black tracking-widest">{step.time}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70 truncate max-w-[100px]">
                  {step.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Timeline View Card */}
        <div className="max-w-4xl mx-auto bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[10rem] -z-10 group-hover:scale-105 transition-transform" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left Icon Area */}
              <div className="md:col-span-3 flex justify-center">
                <div className={`w-24 h-24 rounded-3xl bg-[#F8F9FC] border border-primary/5 shadow-inner flex items-center justify-center ${currentStep.color}`}>
                  <StepIcon size={44} />
                </div>
              </div>

              {/* Right Description Area */}
              <div className="md:col-span-9 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-black text-primary">{currentStep.time}</span>
                  <span className="text-white bg-accent font-bold uppercase text-[9px] tracking-widest bg-accent-hover px-2.5 py-1 rounded-full">
                    Schedule Slot {activeStep + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat tracking-tight">
                  {currentStep.label}
                </h3>
                
                <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                  {currentStep.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-[#251f59] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 text-center space-y-6 shadow-xl backdrop-blur-sm relative z-10">
          <Heart className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black font-montserrat uppercase text-accent">
            A Nurturing Boarding Ecosystem
          </h3>
          <p className="text-white/80 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Our daily schedule is designed to establish balance between study, wellness, meals, and play. 
            Give your daughter the holistic care she deserves at Leeladevi Parasmal Sancheti School.
          </p>
          <div className="pt-2">
            <Link 
              href="/apply-for-admission" 
              className="inline-flex items-center gap-2 bg-accent text-primary font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-accent-hover hover:scale-[1.02] transition-all"
            >
              <span>Admission Inquiry</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
