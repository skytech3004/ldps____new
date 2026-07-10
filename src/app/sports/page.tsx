"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Award, CheckCircle, Shield, ArrowRight, Activity, Users, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  name: string;
  role: string;
  achievement: string;
  image?: string;
}

interface Game {
  title: string;
  desc: string;
}

interface Stat {
  count: string;
  label: string;
}

interface SportsData {
  complexImages: string[];
  players: Player[];
  games: Game[];
  stats: Stat[];
}

export default function SportsPage() {
  const [data, setData] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sports Complex Carousel State
  const [activeComplexSlide, setActiveComplexSlide] = useState(0);
  
  // Players Carousel State
  const [activePlayerSlide, setActivePlayerSlide] = useState(0);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/admin/sports");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load sports data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  const handlePrevComplexSlide = () => {
    if (!data?.complexImages || data.complexImages.length === 0) return;
    setActiveComplexSlide((prev) => (prev === 0 ? data.complexImages.length - 1 : prev - 1));
  };

  const handleNextComplexSlide = () => {
    if (!data?.complexImages || data.complexImages.length === 0) return;
    setActiveComplexSlide((prev) => (prev === data.complexImages.length - 1 ? 0 : prev + 1));
  };

  // Players Carousel slide actions (showing 4 cards at once on desktop, sliding by 1 card)
  const handlePrevPlayerSlide = () => {
    if (!data?.players || data.players.length === 0) return;
    setActivePlayerSlide((prev) => (prev === 0 ? data.players.length - 1 : prev - 1));
  };

  const handleNextPlayerSlide = () => {
    if (!data?.players || data.players.length === 0) return;
    setActivePlayerSlide((prev) => (prev === data.players.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
        <Navbar />
        <div className="pt-48 pb-24 text-center max-w-7xl mx-auto px-6">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="animate-pulse text-primary font-black uppercase tracking-widest text-sm">
            Loading Sports Showcase...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const complexImages = data?.complexImages || [];
  const players = data?.players || [];
  const games = data?.games || [];
  const stats = data?.stats || [];

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
            <span className="text-white/80">Sports</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Sports & Achievements
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Empowering team building, physical wellness, and athletic excellence.
          </p>
        </div>
      </section>

      {/* Sports Infrastructure Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-4">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Health & Fitness</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
              Our Sports Complex
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full" />
          </div>

          <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
            Physical health is the foundation of mental strength. At LPS Vidyawadi, we offer a huge sports complex 
            with professional fields and equipment for cricket, football, athletics, handball, badminton, table tennis, 
            skating, and softball. Led by qualified, professional coaches, our sports syllabus integrates aerobic workouts, 
            gymnasium training, and weekly athletic drills.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              "Professional Coaches",
              "Spacious Track Fields",
              "Equipped Gym Complex",
              "Aerobic Aerodynamics"
            ].map((feature, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <span className="text-sm font-bold text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Carousel for Complex Images */}
        <div className="lg:col-span-6 space-y-4">
          {complexImages.length > 0 ? (
            <div className="relative aspect-[16/10] w-full bg-slate-900 border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-premium-lg group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeComplexSlide}
                  src={complexImages[activeComplexSlide]}
                  alt={`Sports Complex Frame ${activeComplexSlide + 1}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {complexImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevComplexSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextComplexSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Bullet indicators */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5">
                    {complexImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveComplexSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          activeComplexSlide === i ? "bg-accent w-4" : "bg-white/50 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] w-full bg-gray-100 border border-dashed border-gray-300 rounded-[2.5rem] flex items-center justify-center text-gray-400">
              No complex images uploaded yet.
            </div>
          )}
        </div>
      </section>

      {/* Statistical Dashboard Grid */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#F8F9FC] border border-primary/5 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-4xl md:text-5xl font-black text-primary">{stat.count}</p>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sports National Champions Grid with Large Profile Images */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-[#251f59] text-white overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">National Milestones</span>
            <h2 className="text-2xl md:text-4xl font-black font-montserrat uppercase">
              Our National Players
            </h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto pt-2">
              Proudly recognizing our girls who competed at the CBSE National levels, bringing laurels and medals to Vidyawadi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {players.slice(0, 4).map((star, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-300 flex flex-col h-[380px] text-left group"
              >
                {/* Player image container */}
                <div className="relative h-56 w-full bg-[#081736] overflow-hidden shrink-0 border-b border-white/10 flex items-center justify-center">
                  {star.image ? (
                    <img 
                      src={star.image} 
                      alt={star.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-accent/40 border border-white/5">
                      <Users size={40} />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-[9px] font-black text-accent uppercase tracking-widest bg-[#F7B801]/10 border border-[#F7B801]/20 px-2.5 py-1 rounded-full backdrop-blur-sm">CBSE National</span>
                </div>
                
                {/* Player Details info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-black text-base md:text-lg uppercase tracking-tight text-white leading-tight">{star.name}</h4>
                    <p className="text-xs text-white/50 font-bold">{star.role}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[10px] uppercase font-black tracking-wider text-accent leading-relaxed">{star.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Players Carousel Section for Other Players & Sports Achievers */}
      {players.length > 0 && (
        <section className="py-20 px-6 bg-white border-t border-slate-100 text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left border-b border-gray-100 pb-6">
              <div className="space-y-2">
                <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Vidyawadi Stars</span>
                <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight leading-none">
                  Sports Achievers Carousel
                </h2>
              </div>
              
              {/* Sliding Controls */}
              {players.length > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevPlayerSlide}
                    className="p-3 bg-gray-50 border border-gray-100 hover:bg-[#3D348B] hover:text-white rounded-full transition-all duration-300 text-primary cursor-pointer shadow-premium-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNextPlayerSlide}
                    className="p-3 bg-gray-50 border border-gray-100 hover:bg-[#3D348B] hover:text-white rounded-full transition-all duration-300 text-primary cursor-pointer shadow-premium-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Carousel display frame */}
            <div className="relative w-full overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{ transform: `translateX(-${activePlayerSlide * 300}px)` }}
              >
                {players.map((star, idx) => (
                  <div 
                    key={idx} 
                    className="min-w-[280px] w-[280px] bg-[#F8F9FC] border border-gray-100 rounded-3xl overflow-hidden shadow-premium-sm hover:shadow-premium-md transition-all duration-300 flex flex-col h-[380px] text-left group shrink-0"
                  >
                    {/* Player image */}
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0 border-b border-gray-100 flex items-center justify-center">
                      {star.image ? (
                        <img 
                          src={star.image} 
                          alt={star.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 border border-primary/5">
                          <Users size={32} />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[9px] font-black text-white bg-primary px-2.5 py-1 rounded-full uppercase tracking-wider">Player Profile</span>
                    </div>
                    
                    {/* Player info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-black text-sm md:text-base uppercase tracking-tight text-primary leading-tight">{star.name}</h4>
                        <p className="text-xs text-gray-400 font-bold">{star.role}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase font-black tracking-wider text-accent leading-relaxed">{star.achievement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Game Breakdown list */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Discipline Showcase</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Game Summaries & Selections
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-primary/10 rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex gap-5 items-start group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-primary uppercase font-montserrat tracking-tight">{game.title}</h4>
                <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">{game.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <Trophy className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Realize Her Athletic Potential
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Our expansive sports fields, gymnasium facilities, and qualified coaches provide the perfect 
            foundation for girls to excel in school, state, and national athletic championships.
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
