"use client";

import React, { useEffect, useState } from "react";
import { Bell, Calendar, ChevronRight, FileText, Sparkles, Megaphone } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  subject?: string;
  body?: string;
  category: string;
  date: string;
  isNew: boolean;
}

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/notices", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // Filter announcements, circulars, and admission alerts
          const filtered = (data as Announcement[]).filter(
            (item) => item.category === "Announcements" || item.category === "Admission"
          );
          setAnnouncements(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Accent */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Megaphone size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#3D348B] uppercase tracking-tight">Active Bulletin Board</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Live announcements and critical calendar updates</p>
          </div>
        </div>
        <span className="text-xs font-black px-2.5 py-1 bg-[#F7B801]/10 text-[#F18701] rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
          <Sparkles size={12} />
          Live
        </span>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border border-slate-100 rounded-[2rem]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm">
          <Bell className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 font-bold">No announcements found on the bulletin board currently.</p>
        </div>
      ) : (
        /* Announcements list */
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              {item.isNew && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 text-white flex items-center justify-center text-[8px] font-black uppercase tracking-wider rotate-45 translate-x-5 -translate-y-5 shadow-sm">
                  New
                </div>
              )}

              <div className="space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black px-2 py-0.5 bg-[#F18701]/10 text-[#F18701] rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h4 className="text-base font-black text-primary uppercase tracking-tight">
                  {item.title}
                </h4>

                {item.subject && (
                  <p className="text-xs text-slate-500 font-semibold italic">
                    Sub: {item.subject}
                  </p>
                )}

                {item.body && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl line-clamp-3">
                    {item.body}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <a
                  href={`/notice/${item.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "")}`}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#7678ED] hover:text-[#3D348B] uppercase tracking-wider whitespace-nowrap"
                >
                  <span>Open Full Announcement</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
