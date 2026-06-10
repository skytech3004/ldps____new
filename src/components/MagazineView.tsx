"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BookOpen, FileText, ChevronRight, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type MagazineItem = {
  _id: string;
  name: string;
  pdfUrl: string;
  year: number;
  month: string;
};

type GroupedMagazines = {
  [year: number]: MagazineItem[];
};

export default function MagazineView() {
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMagazines() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/magazine", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch magazines.");
        }
        const data = await res.json();
        setMagazines(data as MagazineItem[]);
      } catch (err) {
        console.error("Error loading magazines:", err);
        setError("Unable to load school magazines at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  // Filter magazines by search query (name, month, or year)
  const filteredMagazines = magazines.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.month.toLowerCase().includes(query) ||
      item.year.toString().includes(query)
    );
  });

  // Group magazines by year
  const grouped: GroupedMagazines = {};
  filteredMagazines.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = [];
    }
    grouped[item.year].push(item);
  });

  // Sort year keys in descending order
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-12">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by issue, month or year..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-[#3D348B] focus:border-[#7678ED] focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-[#3D348B]/60 uppercase tracking-widest">
          <Sparkles size={16} className="text-[#F7B801]" />
          <span>Click any issue card to read PDF</span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border border-slate-100 rounded-[2rem] shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest text-[#3D348B]/70">
              Loading Akashganga Issues...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center max-w-xl mx-auto shadow-sm">
          <p className="text-red-700 font-bold leading-relaxed">{error}</p>
        </div>
      ) : years.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm">
          <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Magazines Found</h3>
          <p className="text-slate-500 font-medium mt-2">
            {searchQuery ? "Try refining your search terms." : "Content is currently being uploaded."}
          </p>
        </div>
      ) : (
        /* Academic Year Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
          {years.map((year, yearIdx) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: yearIdx * 0.05 }}
              className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgba(61,52,139,0.02)] hover:shadow-[0_8px_30px_rgba(61,52,139,0.06)] transition-all flex flex-col gap-4 self-start"
            >
              {/* Year Column Header */}
              <div className="border-b-2 border-slate-50 pb-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black tracking-widest text-[#7678ED] uppercase">Academics</p>
                  <h3 className="text-base font-black text-[#3D348B] uppercase tracking-tight mt-0.5">
                    Year - {year}
                  </h3>
                </div>
                <span className="text-xs font-black px-2.5 py-1 bg-[#F7B801]/10 text-[#F18701] rounded-full uppercase tracking-wider">
                  {grouped[year].length} {grouped[year].length === 1 ? "Issue" : "Issues"}
                </span>
              </div>

              {/* Cards List for the Year */}
              <div className="space-y-3">
                {grouped[year].map((item) => (
                  <a
                    key={item._id}
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="border border-slate-100 hover:border-[#7678ED]/30 rounded-2xl p-4 bg-slate-50/50 hover:bg-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(118,120,237,0.08)] flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-red-50 group-hover:bg-[#3D348B]/5 flex items-center justify-center text-red-500 group-hover:text-[#3D348B] transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-xs font-black text-[#3D348B] group-hover:text-[#7678ED] transition-colors truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                          {item.month} {item.year}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-slate-400 group-hover:text-[#7678ED] transition-all transform group-hover:translate-x-1"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
