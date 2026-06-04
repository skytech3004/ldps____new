"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Users, Award, BookOpen, Heart, Activity, Check, MapPin, Building, Globe } from "lucide-react";

export default function ManagingCommittee() {
  const leadership = [
    {
      name: "Mrs. Jyoti Nath",
      role: "Principal",
      icon: Award,
      desc: "Directs academic strategies, policy framing, and external CBSE administration."
    },
    {
      name: "Ms. Deepshikha Khangarot",
      role: "Vice Principal",
      icon: Shield,
      desc: "Supervises senior secondary divisions, stream scheduling, and institutional discipline."
    },
    {
      name: "Ms. Honey Agrawat",
      role: "Headmistress",
      icon: BookOpen,
      desc: "Coordinates primary curriculum, junior wing activities, and early learning modules."
    }
  ];

  const supportStaff = [
    {
      name: "Mr. Andrew Daimari",
      role: "Special Educator",
      icon: Users,
      desc: "Specialized in customized parallel remedial strategies for gifted and special needs students."
    },
    {
      name: "Ms. Neelam Parihar",
      role: "Counsellor & Wellness",
      icon: Heart,
      desc: "Focuses on child psychological wellness, career counseling, and psycho-social health."
    }
  ];

  const facultyBreakdown = [
    { label: "Post Graduate Teachers (PGT)", count: 17, color: "bg-primary text-white" },
    { label: "Trained Graduate Teachers (TGT)", count: 15, color: "bg-secondary text-white" },
    { label: "Primary & Physical Ed (PRT & PET)", count: 15, color: "bg-accent text-primary" }
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
            <span>About</span>
            <span>/</span>
            <span className="text-white/80">Managing Committee</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Managing Committee & Staff
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            A registry of our dedicated academic leaders, governing body, and faculty.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        
        {/* Section 1: Academic Leadership Registry */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">School Leadership</span>
            <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
              Academic Administration
            </h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto text-xs md:text-sm">
              Directing academic policies, student wellness, and progressive standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -z-10 group-hover:scale-110 transition-transform duration-300" />
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <member.icon size={24} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-accent-hover font-bold uppercase tracking-widest text-xs mb-4">
                  {member.role}
                </p>
                <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Special Support & Wellness */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-[3rem] border border-primary/10 p-8 md:p-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-secondary font-black uppercase tracking-[0.35em] text-xs block">Inclusive Development</span>
            <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
              Specialized Support
            </h2>
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              We identify each girl child&apos;s potential and provide dedicated support for gifted students 
              and those with special academic needs. Our wellness desk facilitates physical, emotional, and social wellness.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportStaff.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <member.icon size={20} className="text-accent-hover" />
                </div>
                <h4 className="text-lg font-black text-primary uppercase font-montserrat tracking-tight mb-1">
                  {member.name}
                </h4>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Statistical faculty details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column A: Faculty Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Experienced Faculty</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat">
                Teaching Faculty Stats
              </h2>
            </div>
            
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              A team of 47 well-qualified, experienced, young, and vibrant teaching staff aims to strengthen 
              our students&apos; skills, cultivate creative talents, and align learning with dynamic academic trends.
            </p>

            <div className="space-y-4 pt-2">
              {facultyBreakdown.map((item, idx) => (
                <div key={idx} className="bg-white border border-primary/5 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm md:text-base font-bold text-primary">{item.label}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Instructors</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${item.color}`}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Corporate Credentials Details */}
          <div className="lg:col-span-6 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-10 shadow-lg space-y-8">
            <div className="space-y-2">
              <span className="text-secondary font-black uppercase tracking-[0.35em] text-xs block">Institution Profile</span>
              <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                CBSE Mandatory Disclosures
              </h3>
            </div>

            <div className="space-y-4 font-medium text-xs md:text-sm">
              {[
                { icon: Building, title: "Managing Body", val: "Marudhar Mahila Shikshan Sangh" },
                { icon: Globe, title: "Affiliated to", val: "CBSE, New Delhi (Affiliation No: 1730491)" },
                { icon: Shield, title: "School Code", val: "10835" },
                { icon: Activity, title: "Teacher-Section Ratio", val: "1.38 (Optimal classroom interaction)" },
                { icon: MapPin, title: "Campus Location", val: "Vidyawadi, Khimel, St. Rani, Dist. Pali (Rajasthan)" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 hover:bg-primary/5 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{item.title}</p>
                    <p className="text-primary font-bold text-sm leading-snug">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Corporate Philosophy */}
      <section className="bg-gradient-to-r from-primary to-[#282163] py-16 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h3 className="text-2xl md:text-3xl font-black font-montserrat uppercase">
            &quot;Democratic Management • Visionary Leadership • Holistic Care&quot;
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
