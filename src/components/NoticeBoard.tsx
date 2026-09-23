"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Calendar, GraduationCap, Newspaper, FileText } from "lucide-react";
import { noticeColumns as staticNoticeColumns } from "@/data/lpsVidhyawadiDatabase";
import { getNoticeSlug } from "@/data/noticeData";
import { motion } from "framer-motion";

type Notice = {
  _id: string;
  title: string;
  category: string;
  isNew: boolean;
  link?: string;
  slug?: string;
};

export default function NoticeBoard() {
  const [dbNotices, setDbNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/admin/notices");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDbNotices(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const icons = [Newspaper, Bell, GraduationCap, Calendar];
  
  const borderColors = [
    "border-[#7678ED]/30 hover:border-[#7678ED]/60",
    "border-[#3D348B]/30 hover:border-[#3D348B]/60",
    "border-[#F7B801]/30 hover:border-[#F7B801]/60",
    "border-[#F18701]/30 hover:border-[#F18701]/60",
  ];
  
  const textColors = [
    "text-[#7678ED]",
    "text-[#3D348B]",
    "text-[#F7B801]",
    "text-[#F18701]",
  ];

  // Group DB notices by category
  const groupedDbNotices = dbNotices.reduce((acc, notice) => {
    if (!acc[notice.category]) acc[notice.category] = [];
    acc[notice.category].push(notice);
    return acc;
  }, {} as Record<string, Notice[]>);

  const categories = ["News & Circulars", "Announcements", "Admission", "School Rules"];
  
  const displayColumns = categories.map((cat, i) => {
    const dbItems = groupedDbNotices[cat] || [];
    const staticCol = staticNoticeColumns.find(col => col.title === cat || (cat === "Admission" && col.title === "Admission"));
    
    return {
      title: cat,
      items: dbItems.length > 0 
        ? dbItems.map(n => {
            const fallbackSlug = `${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
            return {
              title: n.title,
              isNew: n.isNew,
              link: n.link,
              slug: n.slug || getNoticeSlug(n.title, cat) || fallbackSlug
            };
          })
        : (staticCol?.items.map(title => ({
            title,
            isNew: true,
            link: "",
            slug: getNoticeSlug(title, cat)
          })) || [])
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 relative z-20 -mt-10 lg:mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayColumns.map((col, i) => {
          const Icon = icons[i] ?? Newspaper;
          const borderColor = borderColors[i] ?? "border-slate-200";
          const textColor = textColors[i] ?? "text-primary";
          
          // Duplicate items to ensure a seamless looping marquee
          const duplicatedItems = col.items.length > 0 ? [...col.items, ...col.items] : [];

          return (
            <motion.div 
              key={col.title} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white flex flex-col h-[380px] shadow-[0_8px_30px_rgb(61,52,139,0.06)] border-2 ${borderColor} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgb(61,52,139,0.12)] hover:-translate-y-1.5 group`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 font-bold text-lg bg-slate-50/50 text-[#3D348B] group-hover:bg-white transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <Icon size={20} className={textColor} />
                  <span>{col.title}</span>
                </div>
                {col.items.length > 0 && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 overflow-hidden flex-1 relative flex flex-col justify-between">
                {loading ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <p className="animate-pulse">Loading...</p>
                   </div>
                ) : col.items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <FileText size={24} className="opacity-40" />
                    <p>No active records found</p>
                  </div>
                ) : (
                  <div className="h-[280px] overflow-hidden relative no-scrollbar">
                    {/* Continuous looping scroll container */}
                    <div className="flex flex-col gap-3 animate-marquee-vertical hover:[animation-play-state:paused] py-2">
                      {duplicatedItems.map((item, idx) => {
                        const isNew = item.isNew;
                        const href = item.link || `/notice/${item.slug}`;

                        return (
                          <Link 
                            key={`${col.title}-item-${idx}`}
                            href={href}
                            target={item.link ? "_blank" : undefined}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group/item text-left block"
                          >
                            <span className="text-[#F7B801] font-black text-lg leading-none mt-0.5 group-hover/item:translate-x-0.5 transition-transform select-none">
                              ›
                            </span>
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {isNew && (
                                  <span className="inline-flex items-center bg-[#F7B801] text-[#3D348B] text-[9px] uppercase font-black px-1.5 py-0.5 rounded leading-none shadow-[0_0_8px_rgba(247,184,1,0.4)] animate-pulse shrink-0">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] font-semibold text-slate-600 group-hover/item:text-[#3D348B] transition-colors leading-relaxed">
                                {item.title}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Subtle indicator fade at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
