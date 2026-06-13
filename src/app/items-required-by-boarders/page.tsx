"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckSquare, ClipboardList, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

export default function ItemsRequiredByBoardersPage() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=items-required-by-boarders");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic items content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const packingList = [
    {
      category: "Academic & Sports Uniforms",
      items: [
        "Checks Tunic & Off-White Shirts (Classes Nursery - X)",
        "Checks Kurta, Off-White Salwar & Dupatta (Classes XI - XII)",
        "Official Black V-neck Sweater (Classes Nursery - V)",
        "Official Black Blazer with School Badge (Classes VI - XII)",
        "Deep Green Divided Skirt & White T-Shirt (Sports Code)",
        "Black Leather Shoes & White Sports Canvas Shoes",
        "Socks (Black with off-white strips, White with green strips)",
        "Black and White Hair Bands or Pins"
      ]
    },
    {
      category: "Personal Apparel & Casual Wear",
      items: [
        "Casual Cotton Kurtas / Salwar Suits (4 sets)",
        "Nightsuits (2-3 sets)",
        "Undergarments (6-8 sets)",
        "Bath Towels & Hand Towels (2 each)",
        "Slippers & Daily Sandals (1 pair each)",
        "Warm Woolen Shawl / Pullovers (for winters)"
      ]
    },
    {
      category: "Bedding & Linen Essentials",
      items: [
        "Single Bedsheets (4 nos)",
        "Pillow & Pillow Covers (1 pillow, 2 covers)",
        "Woolen Blanket / Quilt (1 no)",
        "Bedsheet protection covers"
      ]
    },
    {
      category: "Grooming & Toiletries",
      items: [
        "Bath Soap & Washing Detergent bar",
        "Toothbrush, Toothpaste & Tongue cleaner",
        "Hair Oil, Comb, Mirror & Hair clips",
        "Body Lotion, Vaseline, & Talcum powder",
        "Nail cutter & sewing kit"
      ]
    },
    {
      category: "Stationery & Daily Utilities",
      items: [
        "School bag & Lunch box",
        "Steel water bottle & Mug",
        "Pens, Pencils, Notebooks & Geometry box",
        "Regulated pocket money (to be deposited with the hostel warden)"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Schooling</span>
            <span>/</span>
            <span className="text-white/80">Items Required</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Required Packing List
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            A comprehensive checklist of uniforms, apparel, bedding, and toiletries boarder students should carry when joining.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Packing Guidelines...</div>
        </div>
      ) : dbContent ? (
        // DB Dynamic Override
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
          <div className="bg-white border border-primary/10 rounded-[2rem] p-8 md:p-12 shadow-md">
            <div className="border-l-4 border-accent pl-6 mb-8">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight">{dbContent.title}</h2>
              {dbContent.status && <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{dbContent.status}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dbContent.sections.map((section, sIdx) => (
                <article key={sIdx} className="bg-gray-50/50 border border-primary/5 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-primary mb-4 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((line, lIdx) => (
                      <li key={lIdx} className="text-gray-600 font-medium text-sm leading-relaxed flex gap-3">
                        <span className="text-accent mt-1.5 shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Curated High-Fidelity Interactive Packing Checklist
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
          
          <section className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <ClipboardList className="text-accent" size={28} />
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Interactive Boarders Packing Checklist</h2>
            </div>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Parents can tap or click items below to cross them off dynamically as they pack bags. This ensures no required uniform, grooming utility, or bedding linen is left behind before transit to Khimel.
            </p>
          </section>

          {/* Packing categories grids */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packingList.map((cat, cIdx) => (
              <div key={cIdx} className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-md space-y-6">
                <h3 className="text-lg font-black text-primary uppercase border-b border-primary/10 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {cat.category}
                </h3>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleItem(item)}
                      className="w-full text-left flex items-start gap-3 py-1 text-xs md:text-sm font-semibold transition-all hover:translate-x-0.5 focus:outline-none"
                    >
                      <CheckSquare
                        size={18}
                        className={`mt-0.5 shrink-0 transition-colors ${
                          checkedItems[item] ? "text-emerald-500 fill-emerald-100" : "text-gray-300"
                        }`}
                      />
                      <span className={checkedItems[item] ? "line-through text-gray-400" : "text-primary/95"}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Guidelines info notice */}
          <section className="bg-primary text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <HelpCircle size={20} />
                  <span className="font-black uppercase tracking-[0.4em] text-xs">Packing Guidelines</span>
                </div>
                <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Marking Clothes</h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed max-w-xl">
                  It is **highly recommended** that parents stamp or embroider the student's admission number or name initials inside every uniform and personal clothing item. This helps laundry wardens sort garments correctly and prevents loss during daily wash cycles.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Link
                  href="/download-tc"
                  className="bg-accent hover:bg-accent-hover text-primary font-black px-6 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
                >
                  Verify T.C. Portal
                  <span className="shrink-0">&rarr;</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </main>
  );
}
