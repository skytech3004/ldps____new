import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementsView from "@/components/AnnouncementsView";

export default function GisAnnouncementsPage() {
  return (
    <main className="min-h-screen pt-32 lg:pt-40 bg-[#f7fbf8] text-gray-800">
      <Navbar />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
            <p className="text-accent uppercase text-xs font-black tracking-[0.35em] mb-2">
              Bulletin Board
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-accent">
              School Announcements
            </h1>
            <p className="text-white/80 mt-2 max-w-2xl text-sm font-semibold leading-relaxed">
              Find urgent alerts, admission notices, board exam timetables, event details, and holiday closures published in real-time.
            </p>
          </div>

          {/* Dynamic Component */}
          <AnnouncementsView />

          {/* Footer Back Button */}
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
