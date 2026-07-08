"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";
import GsapCounter from "@/components/ui/GsapCounter";
import { 
  Shield, Tv, Sparkles, CheckCircle2, ChevronRight, HelpCircle, 
  Dumbbell, Users, Star, ChevronDown, Download, ArrowRight, 
  History, Shirt, Ban, CalendarRange 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Facility = {
  _id: string;
  name: string;
  description: string;
  src: string;
};

type Fee = {
  _id: string;
  classLevel: string;
  nonAcFee: string;
  acFee: string;
};

type Rule = {
  _id: string;
  category: string;
  title: string;
  bullets: string[];
};

type HostelData = {
  facilities: Facility[];
  fees: Fee[];
  rules: Rule[];
};

export default function HostelPage() {
  const [data, setData] = useState<HostelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRuleIdx, setActiveRuleIdx] = useState<number | null>(null);

  useEffect(() => {
    async function fetchHostelData() {
      try {
        const res = await fetch("/api/hostel");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch hostel data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHostelData();
  }, []);

  const galleryItems = [
    { src: "/uploads/hostel/hostel.jpg", label: "Premium Residence" },
    { src: "/uploads/hostel/Cafeteria.png", label: "Student Cafeteria" },
    { src: "/uploads/hostel/Hostels.png", label: "Hostel View" },
    { src: "/uploads/hostel/Hostels_1.png", label: "Comfortable Living" },
    { src: "/uploads/hostel/Hostels_2.png", label: "Modern Facilities" },
    { src: "/uploads/hostel/Hostels_3.png", label: "Nurturing Environment" },
    { src: "/uploads/hostel/Hostels_4.png", label: "Safe & Secure" }
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FC]">
        <Navbar />
        <div className="py-44 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#3D348B] font-black uppercase tracking-widest text-xs">Loading Residential Hub...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const facilities = data?.facilities || [];
  const fees = data?.fees || [];
  const rules = data?.rules || [];

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased selection:bg-accent selection:text-primary">
      <Navbar />

      {/* Hero Section - Apple/Stripe Editorial Composition */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <img 
            src="/uploads/hostel/hostel.jpg" 
            alt="Vidyawadi Hostel" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1738]/95 via-[#0b1738]/70 to-[#0b1738]/30"></div>
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-white text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.25em] text-accent border border-white/10 mb-4 shadow-premium-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                Vidyawadi Boarding
              </span>
            </motion.div>
            
            <Reveal width="100%">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-montserrat uppercase leading-[1.05] text-white tracking-tight">
                Your Second Home <br/>
                for <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FFE600]">Holistic Growth</span>
              </h1>
            </Reveal>

            <Reveal width="100%" delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl font-light text-slate-300 max-w-2xl leading-relaxed">
                Experience an elite residential lifestyle where traditional Indian Sanskar seamlessly merges with modern comfort, security, and world-class academic support.
              </p>
            </Reveal>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button className="px-8 py-4 bg-accent hover:bg-accent-hover text-[#3D348B] font-black uppercase tracking-widest rounded-2xl shadow-premium-lg flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5">
                <Download size={18} />
                Download Prospectus
              </button>
              <Link 
                href="/apply-for-admission" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black uppercase tracking-widest rounded-2xl border border-white/20 flex items-center gap-3 transition-all duration-300 hover:border-white/40"
              >
                Apply Now
                <ArrowRight size={18} className="group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About The Hostel Section - Editorial Composites with generous spacing */}
      <section className="py-32 md:py-40 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Col: Asymmetric compositions */}
            <div className="lg:col-span-5 relative">
              <FadeIn direction="left">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium-lg border border-gray-100">
                  <img 
                    src="/uploads/hostel/about_hostel.jpg" 
                    alt="Campus Gardens" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D348B]/30 to-transparent"></div>
                </div>
              </FadeIn>
              {/* Floating Bento Stats Card */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-[#3D348B] text-white p-8 rounded-[2.5rem] shadow-premium-lg flex flex-col items-center border border-white/10 justify-center">
                <span className="text-4xl md:text-5xl font-black text-accent mb-1 tracking-tight">
                  <GsapCounter value={800} suffix="+" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Student Capacity</span>
              </div>
            </div>

            {/* Right Col: Deep spacing and Apple-style values description */}
            <div className="lg:col-span-7 space-y-8 lg:pl-6 text-left">
              <div className="space-y-4">
                <Reveal>
                  <span className="block text-xs font-black uppercase tracking-[0.3em] text-accent mb-1">About The Residences</span>
                </Reveal>
                <Reveal width="100%">
                  <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] leading-[1.1] uppercase font-montserrat tracking-tight">
                    A secure haven <br/>
                    <span className="text-[#7678ED] font-black">built for girl empowerment</span>
                  </h2>
                </Reveal>
              </div>

              <Reveal width="100%">
                <p className="text-base text-gray-500 leading-relaxed font-medium">
                  Spread across a sprawling, lush 65-acre campus, Vidyawadi offers a secure and nurturing residential environment. 
                  With 8 double-storied hostel buildings, we provide class-wise accommodation for students from Nursery to Graduation.
                </p>
              </Reveal>

              {/* Grid of features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: Shield, label: "65-Acre Perimeter Guard" },
                  { icon: Dumbbell, label: "Olympic Sports Infrastructure" },
                  { icon: Users, label: "Class-Wise Group Blocks" },
                  { icon: Star, label: "24/7 Warden & Maid Care" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3.5 text-[#3D348B] font-extrabold text-sm uppercase tracking-wider">
                      <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent-hover shrink-0">
                        <Icon size={16} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <FadeIn delay={0.2}>
                <div className="p-8 bg-[#F8F9FC] rounded-[2rem] border border-slate-100 flex items-start gap-5 shadow-premium-sm">
                  <div className="bg-[#3D348B] text-white p-3.5 rounded-2xl shrink-0">
                    <Users size={22} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#3D348B] mb-2 uppercase tracking-wide text-sm">Professional Caretaking</h4>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                      Each residence is managed by 2 dedicated wardens, 2 maids, and professional support staff, ensuring constant hygiene, emotional support, and security.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Gallery - Asymmetric Slider Compositions */}
      <section className="py-32 md:py-40 px-6 bg-[#F8F9FC] overflow-hidden relative">
        {/* Decorative Blur */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#7678ED]/5 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <Reveal>
              <span className="text-[#3D348B] font-black uppercase tracking-[0.4em] text-xs block">Visual Journey</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">
                Campus & Hostel <span className="text-accent">Gallery</span>
              </h2>
            </Reveal>
            <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
          </div>
          
          {/* Asymmetric composition gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {galleryItems.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div 
                  className={`group relative rounded-[2.2rem] overflow-hidden shadow-premium-md border-4 border-white bg-slate-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium-lg ${
                    idx === 0 ? "lg:aspect-[3/4] lg:row-span-2" : "aspect-square sm:aspect-[4/3] lg:aspect-square"
                  }`}
                >
                  <img 
                    src={item.src} 
                    alt={item.label}
                    className="w-full h-full object-cover p-1.5 rounded-[2rem] transition-transform duration-750 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/lps-vidhyawadi/gallery-01.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D348B]/95 via-[#3D348B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white font-black uppercase tracking-widest text-xs">{item.label}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Facilities - Asymmetric Grid & Spacing */}
      <section className="py-32 md:py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <Reveal>
              <span className="text-accent font-black uppercase tracking-[0.4em] text-xs block">World-Class Amenities</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">Hostel Facilities</h2>
            </Reveal>
            <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facilities.map((fac, idx) => (
              <FadeIn key={fac._id || idx} delay={idx * 0.04}>
                <div 
                  className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={fac.src} 
                      alt={fac.name} 
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/lps-vidhyawadi/gallery-03.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-[#3D348B]/10 group-hover:bg-[#3D348B]/30 transition-colors"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 space-y-2">
                    <h3 className="text-lg text-[#3D348B] font-black uppercase tracking-tight group-hover:text-secondary transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-gray-500 text-xs font-bold leading-relaxed line-clamp-3">
                      {fac.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure - Clean Stripe-inspired table layout */}
      <section className="py-32 md:py-40 px-6 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <Reveal>
              <span className="block text-xs font-black uppercase tracking-[0.4em] text-[#3D348B]">Session Tariffs</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black leading-tight text-[#3D348B] uppercase font-montserrat tracking-tight">Hostel Fee Structure</h2>
            </Reveal>
            <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
          </div>

          <FadeIn>
            <div className="overflow-x-auto rounded-[2.5rem] shadow-premium-md border border-slate-100 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#3D348B] text-white">
                    <th className="p-8 text-xs font-black uppercase tracking-widest">Class / Level</th>
                    <th className="p-8 text-xs font-black uppercase tracking-widest">Standard (Non-AC)</th>
                    <th className="p-8 text-xs font-black uppercase tracking-widest">Premium (AC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fees.map((fee, idx) => (
                    <tr key={fee._id || idx} className="hover:bg-[#7678ED]/5 transition-colors">
                      <td className="p-8 font-black text-gray-800 uppercase tracking-tight text-sm">{fee.classLevel}</td>
                      <td className="p-8 text-gray-500 font-extrabold text-sm">{fee.nonAcFee}</td>
                      <td className="p-8"><span className="text-[#F7B801] font-black text-sm">{fee.acFee}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8 pt-6">
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-premium-sm border border-slate-100 flex gap-6 hover:shadow-premium-md transition-shadow">
                <div className="bg-accent/15 p-4 rounded-2xl text-[#3D348B] shrink-0 h-14 w-14 flex items-center justify-center shadow-premium-sm">
                  <CalendarRange size={24} />
                </div>
                <div className="w-full space-y-4">
                  <h4 className="font-black text-[#3D348B] text-lg uppercase tracking-wider">Short Duration Stay</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    The institution offers short-term accommodation facilities as per the following tariff:
                  </p>
                  <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-black bg-[#F8F9FC] p-5 rounded-[1.8rem] border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-extrabold">Non-AC Room</span>
                      <span className="text-[#3D348B]">₹10,000 / month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-extrabold">AC Room</span>
                      <span className="text-[#3D348B]">₹12,000 / month</span>
                    </div>
                    <div className="pt-3 mt-1.5 border-t border-gray-200/50 text-[10px] text-gray-400 font-black uppercase text-center tracking-widest">
                      Minimum duration of stay: 3 months
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-premium-sm border border-slate-100 flex gap-6 hover:shadow-premium-md transition-shadow">
                <div className="bg-accent/15 p-4 rounded-2xl text-[#3D348B] shrink-0 h-14 w-14 flex items-center justify-center shadow-premium-sm">
                  <Ban size={24} />
                </div>
                <div className="w-full space-y-4">
                  <h4 className="font-black text-[#3D348B] text-lg uppercase tracking-wider">Cancellation Policy</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    In the event of cancellation after payment of the deposit, a deduction of <span className="font-black text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs">₹10,000</span> shall be applicable.
                  </p>
                  <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-black bg-[#F8F9FC] p-5 rounded-[1.8rem] border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-extrabold">School Cancellation Limit</span>
                      <span className="text-[#3D348B]">August 15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-extrabold">College Cancellation Limit</span>
                      <span className="text-[#3D348B]">October 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Rules & Policies - Apple-style Accordions */}
      <section className="py-32 md:py-40 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <Reveal>
              <span className="block text-xs font-black uppercase tracking-[0.4em] text-accent">Nurturing Discipline</span>
            </Reveal>
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-black leading-tight text-[#3D348B] uppercase font-montserrat tracking-tight">Rules & Policies</h2>
            </Reveal>
            <div className="h-1 w-16 bg-accent mx-auto mt-2 rounded-full" />
          </div>

          <div className="space-y-5">
            {rules.map((rule, idx) => {
              const isOpen = activeRuleIdx === idx;
              
              // Pick icon
              let CatIcon = HelpCircle;
              if (rule.category.toLowerCase().includes("entry")) CatIcon = Shield;
              else if (rule.category.toLowerCase().includes("clothing") || rule.category.toLowerCase().includes("uniform")) CatIcon = Shirt;
              else if (rule.category.toLowerCase().includes("prohibited") || rule.category.toLowerCase().includes("ban")) CatIcon = Ban;
              else if (rule.category.toLowerCase().includes("leave") || rule.category.toLowerCase().includes("holiday")) CatIcon = History;

              return (
                <FadeIn key={rule._id || idx} delay={idx * 0.05}>
                  <div 
                    className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-premium-sm hover:shadow-premium-md transition-all duration-300"
                  >
                    <button 
                      onClick={() => setActiveRuleIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-accent/15 text-[#3D348B] shrink-0">
                          <CatIcon size={20} />
                        </div>
                        <span className="text-lg md:text-xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">
                          {rule.title}
                        </span>
                      </div>
                      <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown size={20} className="text-[#3D348B]" />
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#F8F9FC] border-t border-slate-100 overflow-hidden"
                        >
                          <div className="p-8 space-y-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                              Official Guidelines & Directives
                            </p>
                            <ul className="space-y-4">
                              {rule.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex gap-4 text-xs sm:text-sm text-gray-600 font-bold leading-relaxed">
                                  <span className="text-accent shrink-0 mt-1.5">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
