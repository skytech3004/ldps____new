"use client";

import React, { useEffect, useState } from "react";
import { Download, FileText, Image as ImageIcon, Layers, Sparkles } from "lucide-react";

interface NonBoardItem {
  _id: string;
  title: string;
  year?: string;
  classLevel?: string;
  imageUrl?: string;
  pdfUrl?: string;
  description?: string;
}

interface NonBoardResultsSectionProps {
  year?: string;
  title?: string;
}

export default function NonBoardResultsSection({ year, title }: NonBoardResultsSectionProps) {
  const [items, setItems] = useState<NonBoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNonBoardData() {
      try {
        setLoading(true);
        const url = year ? `/api/admin/non-board-results?year=${year}` : `/api/admin/non-board-results`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setItems(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch non-board results:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNonBoardData();
  }, [year]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Non-Board Results...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Don't show empty block if no non-board results uploaded
  }

  return (
    <section className="py-12 border-t border-slate-200 mt-12 text-left">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 bg-[#3D348B]/10 text-[#3D348B] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
          <Layers size={14} />
          <span>Non-Board Examination Results</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black uppercase font-montserrat text-primary tracking-tight">
          {title || `Non-Board Results ${year ? `(${year})` : ""}`}
        </h2>
        <div className="h-1.5 bg-[#F7B801] mx-auto w-20 rounded-full" />
        <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto font-medium">
          Official session result sheets and academic progress charts for non-board classes. Click to view or download.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => {
          const hasImage = !!item.imageUrl;
          const hasPdf = !!item.pdfUrl;

          return (
            <div
              key={item._id}
              className="bg-[#0b1736] rounded-3xl p-6 shadow-2xl flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01] border border-white/10"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-accent/20 text-accent px-3 py-1 rounded-full">
                    {item.classLevel || "Non-Board"}
                  </span>
                  {item.year && (
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Session {item.year}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-tight leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* Preview Box */}
              <div className="my-4">
                {hasImage ? (
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2 group-hover:shadow-xl transition-shadow">
                    <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </a>
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center text-white/70">
                    <FileText size={40} className="text-accent mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">PDF Document Ready</p>
                  </div>
                )}
              </div>

              {/* Download Buttons Area */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
                {hasImage && (
                  <a
                    href={item.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ImageIcon size={14} />
                    <span>Download Image</span>
                  </a>
                )}

                {hasPdf && (
                  <a
                    href={item.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex-1 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                )}

                {!hasImage && !hasPdf && (
                  <span className="text-xs text-white/40 italic py-2">No download file attached</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
