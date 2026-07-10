"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Loader2 } from "lucide-react";

interface BoardResultData {
  _id: string;
  year: string;
  images?: string[];
}

export default function ResultYearPage({ params }: { params: Promise<{ year: string }> }) {
  const resolvedParams = use(params);
  const year = resolvedParams.year;

  const [data, setData] = useState<BoardResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        {data.images && data.images.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Official Record</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Board Results Charts</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {data.images.map((imgUrl: string, i: number) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium-lg group hover:scale-[1.01] transition-all duration-300">
                  <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[4/3] w-full">
                    <img src={imgUrl} alt={`Result chart ${i + 1}`} className="w-full h-full object-contain p-4 bg-slate-50" />
                  </a>
                  <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
                    <span className="text-xs font-black text-primary uppercase tracking-wider">Page {i + 1}</span>
                    <a href={imgUrl} download className="text-xs font-black text-[#7678ED] hover:text-[#3D348B] uppercase tracking-wider">Download Image</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] p-16 max-w-2xl mx-auto shadow-premium-sm">
            <Trophy size={40} className="text-[#F7B801] mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Result Charts Uploaded</h3>
            <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
              Official board results charts and toppers sheets have not been uploaded for the academic session {data.year} yet. Please check back later.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
