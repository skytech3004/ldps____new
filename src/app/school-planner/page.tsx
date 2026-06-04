"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Shirt, CalendarDays, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SchoolPlanner() {
  const uniformCodes = [
    {
      title: "Daily Uniform (Nursery - X)",
      details: "Black & white checks tunic paired with an off-white shirt, school belt, black ankle-length socks with off-white strips, black leather shoes, and black hair bands or pins."
    },
    {
      title: "Daily Uniform (XI - XII)",
      details: "Black & white checks kurta, off-white salwar, off-white dupatta, black ankle-length socks with off-white strips, black leather shoes, and black hair bands or pins."
    },
    {
      title: "Winters Dress Code",
      details: "Nursery to V Std: Black V-neck sweater only. Classes VI to XII: Official black blazer with school badge."
    },
    {
      title: "Sports Dress Code (Nursery - X)",
      details: "Deep green divided skirt paired with a white T-shirt, school belt, white sports shoes, and white socks with green strips, finished with a white hair band or ribbon."
    }
  ];

  const calendarEvents = [
    { label: "New Academic Session", date: "1st April", desc: "Interactive start of classes, cabinet nominations, and academic distribution." },
    { label: "Summer Break", date: "16th May - 30th June", desc: "Homeward transit for students. Campus maintenance and teacher workshops." },
    { label: "Back to School", date: "1st July", desc: "Re-commencement of regular classes and sports coaching drills." },
    { label: "Diwali Autumn Break", date: "Mid October (14 days)", desc: "Festive break and campus closures." },
    { label: "Winter Break", date: "25th Dec - 5th Jan", desc: "Winter vacations and seasonal recess." },
    { label: "Annual Session Concludes", date: "31st March", desc: "Declaration of board grades, final report cards, and T.C. clearances." }
  ];

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
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">School Planner</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Academic Schedule & Planner
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Complete details on school timings, uniform dress codes, and calendars.
          </p>
        </div>
      </section>

      {/* Timings Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">School Timings</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Summer & Winter Hours
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Summer Card */}
          <div className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex gap-6 items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-[4rem] group-hover:scale-105 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Clock size={24} className="text-accent-hover" />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Shift A</h4>
              <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">Summer Shift</h3>
              <p className="text-2xl font-black text-primary/80">08:00 AM - 02:30 PM</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Applicable April through September</p>
            </div>
          </div>

          {/* Winter Card */}
          <div className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex gap-6 items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[4rem] group-hover:scale-105 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Shift B</h4>
              <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">Winter Shift</h3>
              <p className="text-2xl font-black text-primary/80">09:00 AM - 03:30 PM</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Applicable October through March</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Uniform Section (Dark Navy Blue Gradient) */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-[#251f59] text-white overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Dress Code Identity</span>
            <h2 className="text-2xl md:text-4xl font-black font-montserrat uppercase">
              Official School Uniform
            </h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto pt-2">
              Maintaining neatness, identity, and shared discipline across all divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {uniformCodes.map((uniform, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-lg flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-accent flex items-center justify-center shrink-0">
                  <Shirt size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase font-montserrat tracking-tight text-accent">{uniform.title}</h4>
                  <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed">{uniform.details}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Academic Calendar Timeline Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Year Planner</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Academic Calendar Milestones
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
          {calendarEvents.map((event, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-primary/5 rounded-2xl p-6 shadow-md hover:border-accent transition-all space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-accent-hover uppercase tracking-widest bg-accent/15 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <CalendarDays size={10} />
                  <span>{event.date}</span>
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-black text-primary uppercase font-montserrat tracking-tight">{event.label}</h4>
                <p className="text-gray-500 font-medium text-xs leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <CalendarDays className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Admissions Now Open
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Experience the structured schedules, physical wellness routines, and balanced academic curriculum 
            offered inside Leeladevi Parasmal Sancheti English Medium School.
          </p>
          <div className="pt-2">
            <Link 
              href="/apply-for-admission" 
              className="inline-flex items-center gap-2 bg-primary text-white font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-secondary hover:shadow-lg transition-all"
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
