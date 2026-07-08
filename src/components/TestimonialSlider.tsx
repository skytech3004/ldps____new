"use client";

import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";

const testimonials = [
  {
    quote: "LPS Vidyawadi has exceeded our expectations. The 65-acre secure campus, professional warden care, and outstanding CBSE curriculum gave our daughter the perfect foundation to grow into an independent leader.",
    name: "Sunita Choudhary",
    role: "Parent of Class XI Student",
    location: "Jodhpur, Rajasthan",
    rating: 5
  },
  {
    quote: "Leaving our daughter at a hostel was a tough choice, but LPS Vidyawadi felt like a second home. The focus on values, sports, horse riding, and individual academic care is truly exceptional.",
    name: "Rajesh Sharma",
    role: "Parent of Class IX Student",
    location: "Mumbai, Maharashtra",
    rating: 5
  },
  {
    quote: "My years at LPS Vidyawadi defined my path. The leadership opportunities, debate circles, and holistic education shaped me. It is more than a school; it is an ecosystem of excellence.",
    name: "Dr. Ananya R.",
    role: "Alumni (Batch 2021)",
    location: "Delhi, India",
    rating: 5
  }
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-32 md:py-40 px-6 bg-[#F8F9FC] border-t border-[#1F2937]/5">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <Reveal>
            <span className="text-[#3D348B] font-black uppercase tracking-[0.4em] text-xs block">
              Voices of Trust
            </span>
          </Reveal>
          <Reveal width="100%">
            <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">
              What Parents & Alumni Say
            </h2>
          </Reveal>
          <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
        </div>

        {/* Carousel Slider Card */}
        <FadeIn>
          <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-premium-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Background Quote Mark */}
            <div className="absolute top-6 right-8 text-slate-100 pointer-events-none -z-10">
              <Quote size={120} className="opacity-40" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-6 text-left flex-1"
              >
                {/* Stars Rating */}
                <div className="flex gap-1 text-accent">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-gray-600 font-medium text-base md:text-lg leading-relaxed italic">
                  "{testimonials[current].quote}"
                </p>

                {/* Profile Details */}
                <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3D348B]/10 text-[#3D348B] flex items-center justify-center font-black text-sm uppercase">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-[#3D348B] text-sm uppercase tracking-wider">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-xs text-gray-400 font-bold">
                      {testimonials[current].role} • {testimonials[current].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-50">
              {/* Pagers */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === idx ? "w-6 bg-[#3D348B]" : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  className="p-2.5 bg-[#F8F9FC] hover:bg-slate-100 rounded-xl text-[#3D348B] transition-colors border border-slate-100 active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-2.5 bg-[#F8F9FC] hover:bg-slate-100 rounded-xl text-[#3D348B] transition-colors border border-slate-100 active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
