import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagazineView from "@/components/MagazineView";

export default function GisMagazinePage() {
  return (
    <main className="min-h-screen pt-32 lg:pt-40 bg-[#f7fbf8] text-gray-800">
      <Navbar />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
            <p className="text-accent uppercase text-xs font-black tracking-[0.35em] mb-2">
              School Publications
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-accent">
              Magazine
            </h1>
            <p className="text-white/80 mt-2 max-w-2xl text-sm font-semibold leading-relaxed">
              Explore past and present issues of our official school magazine, celebrating the creativity, academic achievements, and scholastic talents of our students.
            </p>
          </div>

          {/* Dynamic Card Grid Component */}
          <MagazineView />

          {/* Footer Back Button */}
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#3D348B] text-white font-black uppercase text-xs tracking-widest hover:bg-[#7678ED] transition-all shadow-lg shadow-[#3D348B]/10"
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
