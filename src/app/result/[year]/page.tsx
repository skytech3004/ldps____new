"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Trophy, Star, Search, CheckCircle2, ChevronRight, FileSpreadsheet, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Topper {
  name: string;
  class: "Class X" | "Class XII";
  stream: string;
  score: string;
  rank: number;
  medal: string;
  description: string;
}

interface Student {
  name: string;
  class: "Class X" | "Class XII";
  stream: string;
  percent: number;
  status: string;
}

interface BoardResultData {
  _id: string;
  year: string;
  passPercentage: string;
  highestScore: string;
  highestScoreScorer: string;
  distinctionsCount: number;
  batchAverage: string;
  toppers: Topper[];
  students: Student[];
}

export default function ResultYearPage({ params }: { params: Promise<{ year: string }> }) {
  const resolvedParams = use(params);
  const year = resolvedParams.year;

  const [data, setData] = useState<BoardResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"class12" | "class10">("class12");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/admin/results?year=${year}`);
        if (!res.ok) {
          throw new Error("Academic year results not found.");
        }
        const resData = await res.json();
        setData(resData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results.");
      } finally {
        setLoading(false);
      }
    }
    if (year) {
      fetchResults();
    }
  }, [year]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
        <Navbar />
        <div className="pt-48 pb-24 text-center max-w-7xl mx-auto px-6">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="animate-pulse text-primary font-black uppercase tracking-widest text-sm">
            Loading Results Hub for {year}...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
        <Navbar />
        <div className="pt-48 pb-24 text-center max-w-lg mx-auto px-6 space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border-4 border-red-100">
            <Trophy size={28} />
          </div>
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Results Not Found</h1>
          <p className="text-gray-500 text-sm">
            The board examination results for the academic year <strong className="text-primary">{year}</strong> have not been published or created yet in the database.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#3D348B] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-[#7678ED] transition-colors"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const activeToppers = data.toppers.filter((t) => (activeTab === "class12" ? t.class === "Class XII" : t.class === "Class X"));
  const activeRegistry = data.students.filter((s) => (activeTab === "class12" ? s.class === "Class XII" : s.class === "Class X"));

  const filteredRegistry = activeRegistry.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.stream.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">Result {data.year}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Board Exam Results <span className="text-white">{data.year}</span>
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            Celebrating the academic milestones and board distinctions achieved by Leeladevi Parasmal Sancheti School boarders.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* Key Statistics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[3rem]" />
            <p className="text-5xl font-black text-primary">{data.passPercentage}</p>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Pass Percentage</p>
            <p className="text-[10px] font-bold text-gray-400">Class X & Class XII</p>
          </div>
          <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-[3rem]" />
            <p className="text-5xl font-black text-primary">{data.highestScore}</p>
            <p className="text-xs font-black uppercase tracking-wider text-accent">School Highest Score</p>
            <p className="text-[10px] font-bold text-gray-400 truncate px-2">{data.highestScoreScorer || "Board Topper"}</p>
          </div>
          <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[3rem]" />
            <p className="text-5xl font-black text-primary">{data.distinctionsCount}+</p>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Distinctions (&gt;90%)</p>
            <p className="text-[10px] font-bold text-gray-400">Outstanding Academic Records</p>
          </div>
          <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-[3rem]" />
            <p className="text-5xl font-black text-primary">{data.batchAverage}</p>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Batch Average Score</p>
            <p className="text-[10px] font-bold text-gray-400">Standard Class Average</p>
          </div>
        </section>

        {/* Interactive Class Toggles */}
        <section className="flex justify-center">
          <div className="bg-white border border-primary/10 p-2 rounded-2xl flex gap-2 shadow-md max-w-md w-full">
            <button
              onClick={() => { setActiveTab("class12"); setSearchTerm(""); }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all ${
                activeTab === "class12" ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-primary/5"
              }`}
            >
              Class XII (Senior Secondary)
            </button>
            <button
              onClick={() => { setActiveTab("class10"); setSearchTerm(""); }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all ${
                activeTab === "class10" ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-primary/5"
              }`}
            >
              Class X (Secondary)
            </button>
          </div>
        </section>

        {/* Topper Podium Layout */}
        {activeToppers.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Top Achievers</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Toppers Showcase</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            {/* Top 3 Toppers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {activeToppers
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 3)
                .map((topper) => {
                  const isGold = topper.rank === 1;
                  const isSilver = topper.rank === 2;
                  return (
                    <motion.div
                      key={topper.name}
                      whileHover={{ y: -6 }}
                      className={`bg-white border rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between h-80 ${
                        isGold ? "border-[#FFD700] ring-2 ring-[#FFD700]/10" : isSilver ? "border-slate-300" : "border-amber-600/30"
                      }`}
                    >
                      <div className="absolute top-4 right-4 text-gray-200">
                        <Trophy size={48} className={isGold ? "text-[#FFD700]/25" : isSilver ? "text-slate-300/35" : "text-amber-600/15"} />
                      </div>

                      <div className="space-y-4 relative z-10">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          isGold ? "bg-[#FFD700]/15 text-[#bfa000]" : isSilver ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"
                        }`}>
                          <Award size={12} />
                          Rank {topper.rank}
                        </span>

                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-primary uppercase leading-tight">{topper.name}</h3>
                          <p className="text-xs text-accent font-bold uppercase tracking-wider">
                            {topper.class === "Class XII" ? `${topper.stream} Stream` : "Secondary Board"}
                          </p>
                        </div>

                        {topper.description && (
                          <p className="text-xs text-gray-400 font-medium leading-relaxed italic">&quot;{topper.description}&quot;</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Aggregate</span>
                        <span className="text-3xl font-black text-primary">{topper.score}</span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Runner Ups (Rank 4+) */}
            {activeToppers.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {activeToppers.slice(3).map((topper) => (
                  <div key={topper.name} className="bg-white border border-primary/5 rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-accent flex items-center justify-center shrink-0">
                        <Star size={18} className="fill-accent text-accent" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-primary uppercase truncate max-w-[150px]">{topper.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{topper.class === "Class XII" ? topper.stream : "General"}</p>
                      </div>
                    </div>
                    <span className="font-black text-base text-primary">{topper.score}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Searchable Student Registry Table */}
        <section className="space-y-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-primary uppercase font-montserrat tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="text-accent" size={24} />
                Student Marks Directory
              </h3>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Search and inspect distinction percentages of class boards</p>
            </div>

            {/* Search Box */}
            <div className="relative w-full max-w-sm bg-white border border-primary/10 rounded-xl p-2 flex items-center shadow-md">
              <Search className="text-gray-400 ml-2 shrink-0" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or distinction grade..."
                className="w-full bg-transparent px-3 py-2 text-primary text-xs font-bold focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Registry Table */}
          <div className="bg-white border border-primary/10 rounded-[2rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6">Rank Index</th>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Division/Stream</th>
                    <th className="py-4 px-6">Score Aggregate</th>
                    <th className="py-4 px-6">Board Merit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs md:text-sm font-semibold text-primary/80">
                  {filteredRegistry.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 font-bold">
                        No students found matching &quot;{searchTerm}&quot;
                      </td>
                    </tr>
                  ) : (
                    filteredRegistry.map((student, idx) => (
                      <tr key={student.name} className="hover:bg-primary/5 transition-all">
                        <td className="py-4 px-6 font-bold text-gray-400">#{idx + 1}</td>
                        <td className="py-4 px-6 font-black text-primary">{student.name}</td>
                        <td className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-gray-400">{student.stream}</td>
                        <td className="py-4 px-6 font-black text-primary text-base">{student.percent}%</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            student.status.includes("Merit")
                              ? "bg-accent/15 text-accent border border-accent/20"
                              : student.status.includes("Distinction")
                              ? "bg-primary/15 text-primary border border-primary/20"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            <CheckCircle2 size={10} />
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SDM / Chief Minister Laptop Awards Notice */}
        <section className="bg-primary text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Royal Awards</span>
              <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Meritorious Laptop Scheme</h3>
              <p className="text-white/80 font-medium text-sm leading-relaxed max-w-xl">
                We are extremely proud to highlight our toppers who were honored at Jaipur by the Chief Minister of Rajasthan with laptop rewards under the state meritorious scheme. Additional board distinction stars have also been felicitated by the Block SDM.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Link
                href="/downloads"
                className="bg-accent hover:bg-accent-hover text-primary font-black px-6 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
              >
                Download Merit Lists
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
