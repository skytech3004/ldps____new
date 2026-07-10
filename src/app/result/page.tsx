"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import { Trophy, Award, BookOpen, GraduationCap, ChevronRight, School } from "lucide-react";

interface BoardResult {
  _id: string;
  year: string;
}

export default function ResultIndexPage() {
  const [results, setResults] = useState<BoardResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/results", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setResults(data as BoardResult[]);
        }
      } catch (err) {
        console.error("Failed to load results list:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const getGradient = (index: number) => {
    const gradients = [
      "from-[#3D348B]/10 to-[#7678ED]/10 border-[#7678ED]/20",
      "from-[#F7B801]/10 to-[#F18701]/10 border-[#F18701]/20",
      "from-emerald-50 to-teal-50 border-emerald-200",
      "from-pink-50 to-rose-50 border-pink-200",
    ];
    return gradients[index % gradients.length];
  };

  const getIconColor = (index: number) => {
    const colors = [
      "text-[#3D348B] bg-[#3D348B]/10",
      "text-[#F18701] bg-[#F18701]/10",
      "text-emerald-600 bg-emerald-100",
      "text-pink-600 bg-pink-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased selection:bg-accent selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 bg-gradient-to-br from-[#3D348B] to-[#7678ED] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span className="text-white/80">Board Results</span>
          </div>
          
          <Reveal width="100%">
            <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent leading-none">
              Academic Results Hub
            </h1>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <p className="text-white/80 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
              Explore board exam distinctions and toppers lists separated by academic streams and years.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Results Listings Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] shadow-premium-sm">
            <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Loading results dashboard...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto shadow-premium-sm">
            <Trophy size={40} className="text-[#F7B801] mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Results Published</h3>
            <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
              Academic board results are currently not available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {results.map((result) => {
              // Defined cards for each result year representing streams
              const streamsList = [
                { title: "Class XII Science Board Results", tab: "class12", stream: "Science", icon: Trophy },
                { title: "Class XII Commerce Board Results", tab: "class12", stream: "Commerce", icon: Award },
                { title: "Class XII Humanities Board Results", tab: "class12", stream: "Humanities", icon: BookOpen },
                { title: "Class X Board Results", tab: "class10", stream: "", icon: GraduationCap },
              ];

              return (
                <div key={result._id} className="space-y-6">
                  {/* Year Header */}
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="w-3 h-3 rounded-full bg-[#F7B801]" />
                    <h2 className="text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                      Academic Session {result.year}
                    </h2>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {streamsList.map((stream, idx) => {
                      const Icon = stream.icon;
                      const cardHref = `/result/${result.year}?tab=${stream.tab}${stream.stream ? `&stream=${stream.stream}` : ""}`;

                      return (
                        <Link
                          key={stream.title}
                          href={cardHref}
                          className={`group block p-6 bg-gradient-to-br ${getGradient(idx)} border rounded-[2rem] shadow-premium-xs hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
                        >
                          {/* Decorative Background Accent */}
                          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/40 rounded-full blur-xl group-hover:scale-125 transition-transform" />

                          <div className="space-y-4">
                            {/* Icon Wrapper */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-premium-sm ${getIconColor(idx)}`}>
                              <Icon size={18} />
                            </div>

                            {/* Card Content (Only Title & Year as requested) */}
                            <div className="space-y-1">
                              <h3 className="text-sm font-black text-primary uppercase tracking-tight leading-snug group-hover:text-[#7678ED] transition-colors">
                                {stream.title}
                              </h3>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                Year {result.year}
                              </p>
                            </div>

                            {/* Link text indicator */}
                            <div className="pt-2 flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest group-hover:text-[#7678ED] transition-all">
                              <span>View Marks</span>
                              <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
