"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Tag, ArrowRight, Bell, Sparkles, FileText } from "lucide-react";
import Image from "next/image";

interface NewsItem {
  _id: string;
  title: string;
  subject?: string;
  body?: string;
  category: string;
  date: string;
  link?: string;
}

interface StaticArticle {
  title: string;
  date: string;
  category: string;
  image: string;
  desc: string;
}

const FEATURED_ARTICLES: StaticArticle[] = [
  {
    title: "LPS Vidyawadi Triumphs in Zonal Athletics Meet",
    date: "2026-05-18",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1576400882231-15c0e4952921?auto=format&fit=crop&q=80&w=800",
    desc: "Our student athletes put on an exceptional performance at the Inter-School Athletics Championship, securing 12 gold medals and lifting the overall zonal trophy.",
  },
  {
    title: "Annual Science Exhibition 'Anveshan 2026' Inspires Innovation",
    date: "2026-04-22",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    desc: "Students showcased groundbreaking science models, working robots, and sustainability projects during our annual science fair, attended by educators across the region.",
  },
  {
    title: "Vidyawadi Celebrates 26th Cultural Fest with Pride & Joy",
    date: "2026-03-08",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    desc: "A stunning showcase of traditional folk dances, drama, music ensembles, and visual arts was organized by students, marking a spectacular milestone celebration.",
  },
];

export default function NewsView() {
  const [dbNotices, setDbNotices] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"featured" | "circulars">("featured");

  useEffect(() => {
    async function fetchCirculars() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/notices", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // Filter only News & Circulars
          const filtered = (data as NewsItem[]).filter(
            (item) => item.category === "News & Circulars" || item.category === "Announcements"
          );
          setDbNotices(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic news circulars:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCirculars();
  }, []);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 pb-px">
        <button
          onClick={() => setActiveTab("featured")}
          className={`pb-4 px-6 font-black text-sm uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "featured"
              ? "border-[#3D348B] text-[#3D348B]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles size={16} />
            Featured Stories
          </span>
        </button>
        <button
          onClick={() => setActiveTab("circulars")}
          className={`pb-4 px-6 font-black text-sm uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "circulars"
              ? "border-[#3D348B] text-[#3D348B]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <Bell size={16} />
            Official Circulars ({loading ? "..." : dbNotices.length})
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "featured" ? (
        /* Grid of News Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_ARTICLES.map((article, idx) => (
            <article
              key={idx}
              className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(61,52,139,0.02)] hover:shadow-[0_8px_30px_rgba(61,52,139,0.06)] hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Block */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                  <Tag size={10} className="text-accent" />
                  {article.category}
                </span>
              </div>

              {/* Text Block */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                    <Calendar size={12} />
                    {new Date(article.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-base font-black text-primary leading-snug uppercase tracking-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {article.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#7678ED] uppercase tracking-wider">
                    School Press Office
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-[#3D348B] group-hover:text-white transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Live Circulars / Alerts Board */
        <div className="space-y-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white border border-slate-100 rounded-[2rem]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : dbNotices.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm">
              <Bell className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-bold">No active notice board circulars found.</p>
            </div>
          ) : (
            dbNotices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex gap-4 items-start min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-primary/5 text-primary rounded uppercase tracking-wider">
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(notice.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-primary uppercase mt-1 tracking-tight truncate max-w-xl">
                      {notice.title}
                    </h4>
                    {notice.subject && (
                      <p className="text-xs text-slate-500 font-semibold italic mt-0.5 line-clamp-1">
                        Sub: {notice.subject}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={`/notice/${notice.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "")}`}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#7678ED] hover:text-[#3D348B] uppercase tracking-wider whitespace-nowrap self-end md:self-center"
                >
                  <span>Read Notice</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
