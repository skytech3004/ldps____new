"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Download, Eye, HelpCircle } from "lucide-react";

interface CalendarData {
  title: string;
  pdfUrl: string;
  publishedAt: string;
}

const FALLBACK_CALENDAR: CalendarData = {
  title: "Holiday Calendar 2026",
  pdfUrl: "/uploads/documents/sample-magazine.pdf",
  publishedAt: new Date().toISOString(),
};

export default function HolidayListView() {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const response = await fetch("/api/admin/holidays", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data && data.pdfUrl) {
            setCalendar(data);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load holiday calendar:", error);
      }
      setCalendar(FALLBACK_CALENDAR);
    }
    fetchCalendar();
    setLoading(false);
  }, []);

  if (loading || !calendar) {
    return (
      <div className="h-64 flex items-center justify-center bg-white border border-slate-100 rounded-[2rem]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formattedDate = new Date(calendar.publishedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Calendar Header Card */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgba(61,52,139,0.02)] flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 shadow-sm border border-red-100/50">
            <Calendar size={32} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-primary uppercase tracking-tight">
              {calendar.title}
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Published on: {formattedDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <a
            href={calendar.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow md:flex-grow-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-[#7678ED]/30 text-primary hover:text-[#7678ED] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
          >
            <Eye size={14} />
            <span>View PDF</span>
          </a>
          <a
            href={calendar.pdfUrl}
            download
            className="flex-grow md:flex-grow-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3D348B] hover:bg-[#7678ED] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer Panel */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-[0_8px_30px_rgba(61,52,139,0.02)] overflow-hidden h-[85vh] relative flex items-center justify-center">
        <iframe
          src={`${calendar.pdfUrl}#toolbar=1`}
          className="w-full h-full border-0 rounded-2xl bg-slate-50"
          title={calendar.title}
        />
      </div>
    </div>
  );
}
