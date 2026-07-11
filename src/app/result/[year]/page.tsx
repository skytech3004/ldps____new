"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Loader2 } from "lucide-react";

interface ResultImage {
  url: string;
  title: string;
}

interface BoardResultData {
  _id: string;
  year: string;
  title?: string;
  images?: (string | ResultImage)[];
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

      {/* Main Content Area */}
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto space-y-12 text-center">

        {data.images && data.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-7xl mx-auto pt-6">
            {data.images.map((img: any, i: number) => {
              // Extract URL and Title (handle backward compatibility cleanly)
              const imgUrl = typeof img === "string" ? img : (img.url || "");
              const cardTitle = typeof img === "string" ? "" : (img.title || "");

              // Dynamic heading block for each individual card
              const headingText = cardTitle
                ? cardTitle.toUpperCase()
                : (data.title ? data.title.toUpperCase() : `BOARD RESULTS ${data.year}`);

              let label = "BOARD RESULT";
              if (headingText) {
                const titleLower = headingText.toLowerCase();
                if (titleLower.includes("xii") || titleLower.includes("class 12") || titleLower.includes("12th")) {
                  label = "XII RESULT";
                } else if (titleLower.includes("x ") || titleLower.includes("class 10") || titleLower.includes("10th")) {
                  label = "X RESULT";
                } else {
                  label = headingText;
                }
              }

              return (
                <div key={i} className="flex flex-col">
                  {/* Dynamic Heading Rendered Above This Specific Result Card */}
                  <div className="space-y-3 mb-6 text-center shrink-0">
                    <h2 className="text-xl md:text-2xl font-black uppercase font-montserrat text-primary tracking-tight line-clamp-2 min-h-[3rem] flex items-center justify-center">
                      {headingText}
                    </h2>
                    <div className="h-1 bg-[#F7B801] mx-auto w-16 rounded-full" />
                  </div>

                  {/* Dark blue card for the image */}
                  <div className="bg-[#0b1736] rounded-3xl p-5 shadow-2xl flex flex-col group transition-all duration-300 hover:scale-[1.01] flex-1">
                    {/* Image Container with White Background for Results Charts */}
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3">
                      <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                        <img
                          src={imgUrl}
                          alt={`${label} Page ${i + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </a>
                    </div>

                    {/* Caption & Download Footer */}
                    <div className="pt-5 pb-2 text-left flex justify-between items-center px-2">
                      <span className="text-white text-base font-black uppercase tracking-wider font-montserrat">
                        {label}
                      </span>
                      <a
                        href={imgUrl}
                        download
                        className="text-accent hover:text-white font-black text-xs uppercase tracking-wider transition-colors"
                      >
                        Download Image
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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
