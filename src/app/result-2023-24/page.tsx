"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Trophy, Star, Search, ShieldCheck, CheckCircle2, ChevronRight, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

const class12Toppers2024 = [
  { name: "Ms. Nikita Rathore", stream: "Science", score: "97.8%", rank: 1, medal: "gold", description: "School Topper - Outstanding achievement in Physics, Chemistry & Biology." },
  { name: "Ms. Riddhi Soni", stream: "Commerce", score: "96.5%", rank: 2, medal: "silver", description: "Commerce Stream Topper - Distinction in Economics & Business Studies." },
  { name: "Ms. Divya Choudhary", stream: "Humanities", score: "95.8%", rank: 3, medal: "bronze", description: "Humanities Topper - Perfect grades in Geography & Political Science." },
  { name: "Ms. Khyati Soni", stream: "Science", score: "94.6%", rank: 4, medal: "star", description: "Excellence in Computer Science and Math." },
  { name: "Ms. Yashvi Jain", stream: "Commerce", score: "94.0%", rank: 5, medal: "star", description: "Distinction in Accountancy and Statistics." },
  { name: "Ms. Sakshi Soni", stream: "Science", score: "93.2%", rank: 6, medal: "star", description: "High achiever in English Core." }
];

const class10Toppers2024 = [
  { name: "Ms. Sakshi Jhala", stream: "General", score: "97.2%", rank: 1, medal: "gold", description: "Class Topper - Honored with academic merit shield during annual day." },
  { name: "Ms. Varsha Kanwar", stream: "General", score: "95.4%", rank: 2, medal: "silver", description: "Outstanding performance in Mathematics & Social Studies." },
  { name: "Ms. Panchan Kanwar", stream: "General", score: "94.8%", rank: 3, medal: "bronze", description: "Outstanding performance in Sanskrit & English Language." },
  { name: "Ms. Kumkum Saini", stream: "General", score: "93.6%", rank: 4, medal: "star", description: "First Class Distinction in all boards science courses." },
  { name: "Ms. Rajbala", stream: "General", score: "92.4%", rank: 5, medal: "star", description: "High performer in Secondary social science labs." },
  { name: "Ms. Krishna Rathore", stream: "General", score: "91.8%", rank: 6, medal: "star", description: "Excellence in boards arts and music credits." }
];

const class12Registry2024 = [
  { name: "Ms. Nikita Rathore", stream: "Science", percent: 97.8, status: "Merit with Gold Medal" },
  { name: "Ms. Riddhi Soni", stream: "Commerce", percent: 96.5, status: "Merit with Silver Medal" },
  { name: "Ms. Divya Choudhary", stream: "Humanities", percent: 95.8, status: "Merit with Bronze Medal" },
  { name: "Ms. Khyati Soni", stream: "Science", percent: 94.6, status: "Distinction" },
  { name: "Ms. Yashvi Jain", stream: "Commerce", percent: 94.0, status: "Distinction" },
  { name: "Ms. Sakshi Soni", stream: "Science", percent: 93.2, status: "Distinction" },
  { name: "Ms. Kamini Malviya", stream: "Science", percent: 92.4, status: "Distinction" },
  { name: "Ms. Megha Goswami", stream: "Science", percent: 91.8, status: "Distinction" },
  { name: "Ms. Sonali Suthar", stream: "Commerce", percent: 91.2, status: "Distinction" },
  { name: "Ms. Kailash Vaishnav", stream: "Humanities", percent: 90.6, status: "Distinction" },
  { name: "Ms. Ragini Vaishnav", stream: "Humanities", percent: 90.2, status: "Distinction" },
  { name: "Ms. Siddhi Sharma", stream: "Humanities", percent: 89.8, status: "First Class" },
  { name: "Ms. Pradhuman Jodha", stream: "Science", percent: 88.5, status: "First Class" },
  { name: "Ms. Manali Soni", stream: "Science", percent: 87.4, status: "First Class" }
];

const class10Registry2024 = [
  { name: "Ms. Sakshi Jhala", stream: "General", percent: 97.2, status: "Merit with Gold Medal" },
  { name: "Ms. Varsha Kanwar", stream: "General", percent: 95.4, status: "Merit with Silver Medal" },
  { name: "Ms. Panchan Kanwar", stream: "General", percent: 94.8, status: "Merit with Bronze Medal" },
  { name: "Ms. Kumkum Saini", stream: "General", percent: 93.6, status: "Distinction" },
  { name: "Ms. Rajbala", stream: "General", percent: 92.4, status: "Distinction" },
  { name: "Ms. Krishna Rathore", stream: "General", percent: 91.8, status: "Distinction" },
  { name: "Ms. Anita Sirvi", stream: "General", percent: 91.2, status: "Distinction" },
  { name: "Ms. Sonu Dewasi", stream: "General", percent: 90.8, status: "Distinction" },
  { name: "Ms. Cheshta Shandilya", stream: "General", percent: 90.5, status: "Distinction" },
  { name: "Ms. Harshita Singh Bhati", stream: "General", percent: 90.2, status: "Distinction" },
  { name: "Ms. Sakshi Dangi", stream: "General", percent: 89.6, status: "First Class" },
  { name: "Ms. Bhumika Rathore", stream: "General", percent: 88.2, status: "First Class" }
];

export default function Result2023_24Page() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"class12" | "class10">("class12");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=result-2023-24");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic result content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const activeToppers = activeTab === "class12" ? class12Toppers2024 : class10Toppers2024;
  const activeRegistry = activeTab === "class12" ? class12Registry2024 : class10Registry2024;

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
            <span className="text-white/80">Result 2023-24</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Board Exam Results <span className="text-white">2023-24</span>
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            Celebrating the academic milestones and board distinctions achieved by Leeladevi Parasmal Sancheti School boarders.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest text-lg">Loading Results Hub...</div>
        </div>
      ) : dbContent ? (
        // Render DB Overridden Content
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
          <div className="bg-white border border-primary/10 rounded-[2rem] p-8 md:p-12 shadow-md">
            <div className="border-l-4 border-accent pl-6 mb-8">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight">{dbContent.title}</h2>
              {dbContent.status && <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{dbContent.status}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dbContent.sections.map((section, sIdx) => (
                <article key={sIdx} className="bg-gray-50/50 border border-primary/5 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-primary mb-4 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((line, lIdx) => (
                      <li key={lIdx} className="text-gray-600 font-medium text-sm leading-relaxed flex gap-3">
                        <span className="text-accent mt-1.5 shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="text-center pt-8">
            <button
              onClick={() => setDbContent(null)}
              className="inline-flex items-center gap-2 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
            >
              View Curated Boards Performance Dashboard
            </button>
          </div>
        </section>
      ) : (
        // Render Curated High-Fidelity Interactive Dashboard
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
          
          {/* Key Statistics Grid */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[3rem]" />
              <p className="text-5xl font-black text-primary">100%</p>
              <p className="text-xs font-black uppercase tracking-wider text-accent">Pass Percentage</p>
              <p className="text-[10px] font-bold text-gray-400">Class X & Class XII</p>
            </div>
            <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-[3rem]" />
              <p className="text-5xl font-black text-primary">97.8%</p>
              <p className="text-xs font-black uppercase tracking-wider text-accent">School Highest Score</p>
              <p className="text-[10px] font-bold text-gray-400">Ms. Nikita Rathore (Class XII)</p>
            </div>
            <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[3rem]" />
              <p className="text-5xl font-black text-primary">32+</p>
              <p className="text-xs font-black uppercase tracking-wider text-accent">Distinctions (&gt;90%)</p>
              <p className="text-[10px] font-bold text-gray-400">Outstanding Academic Records</p>
            </div>
            <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-[3rem]" />
              <p className="text-5xl font-black text-primary">91.3%</p>
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
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Top Achievers</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Toppers Showcase</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {activeToppers.slice(0, 3).map((topper) => {
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
                    {/* Medal Graphic Background */}
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
                        <p className="text-xs text-accent font-bold uppercase tracking-wider">{activeTab === "class12" ? `${topper.stream} Stream` : "Secondary Board"}</p>
                      </div>

                      <p className="text-xs text-gray-400 font-medium leading-relaxed italic">&quot;{topper.description}&quot;</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Aggregate</span>
                      <span className="text-3xl font-black text-primary">{topper.score}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Runner Ups Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {activeToppers.slice(3).map((topper) => (
                <div key={topper.name} className="bg-white border border-primary/5 rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-accent flex items-center justify-center shrink-0">
                      <Star size={18} className="fill-accent text-accent" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-primary uppercase truncate max-w-[150px]">{topper.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{activeTab === "class12" ? topper.stream : "General"}</p>
                    </div>
                  </div>
                  <span className="font-black text-base text-primary">{topper.score}</span>
                </div>
              ))}
            </div>
          </section>

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
                        <td colSpan={5} className="py-8 text-center text-gray-400 font-bold">No students found matching &quot;{searchTerm}&quot;</td>
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
                                ? "bg-accent/15 text-accent-hover border border-accent/20"
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

          {/* Academic Honors notice */}
          <section className="bg-primary text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Royal Awards</span>
                <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Academic Topper Awards</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed max-w-xl">
                  Board toppers are awarded school gold medals, cash shields, and citation certificates during our grand Annual Convocation ceremony. Special recognition plaques are presented to parents of high-performing boarders.
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
      )}

      <Footer />
    </main>
  );
}
