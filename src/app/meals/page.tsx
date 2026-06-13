"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Utensils, Shield, CheckCircle2, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

export default function MealsPage() {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<"weekday" | "saturday" | "sunday">("weekday");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/pages?slug=meals");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic meals content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const mealStats = [
    { label: "Dining Capacity", value: "400" },
    { label: "Daily Cycles", value: "4 Meals" },
    { label: "Diet Standard", value: "Jain Veg" },
    { label: "Kitchen Audits", value: "Daily" }
  ];

  const weekdayMenu = [
    { meal: "Breakfast", items: "Poha, Veg Upma, or Steamed Idli-Sambar paired with Warm Milk / Ginger Tea" },
    { meal: "Lunch", items: "Steamed Basmati Rice, Yellow Arhar Dal, Fresh Wheat Butter Chapattis, Seasonal Green Vegetable, and Roasted Cumin Raita" },
    { meal: "Evening Snacks", items: "Veg Sandwiches or Baked Methi Mathri served with hot Tea / Milk" },
    { meal: "Dinner", items: "Light Moong Dal Khichdi, Besan Kadhi, or Seasonal Gourd Curry with Chapattis (Strictly before sunset options available)" },
    { meal: "Bedtime Snack", items: "Warm Organic Milk accompanied by high-fiber glucose biscuits" }
  ];

  const saturdayMenu = [
    { meal: "Breakfast", items: "Vikas Puri Sprouts, boiled grams, Milk/Tea" },
    { meal: "Lunch (Special Choice)", items: "Special Dal-Baati Churma or Paneer Butter Masala with Butter Tandoori Roti" },
    { meal: "Evening Snacks", items: "Spiced Corn Chaat or Samosa-Kachori with Milk/Tea" },
    { meal: "Dinner", items: "Aloo Gobhi Adraki, Dal Fry with Tawa Parathas" },
    { meal: "Bedtime Snack", items: "Warm Milk with dry fruits" }
  ];

  const sundayMenu = [
    { meal: "Breakfast", items: "Stuffed Paneer Paratha with fresh butter and curd" },
    { meal: "Lunch", items: "Jeera Rice, Chole Masala, Bhatura, and Sweet Lassi" },
    { meal: "Evening Snacks", items: "Dhokla with Green Chutney and Tea/Milk" },
    { meal: "Dinner", items: "Mix Veg Jhalfrezi, Dal Tadka, and Roti" },
    { meal: "Bedtime Snack", items: "Warm Milk with biscuits" }
  ];

  const activeMenu = activeDay === "weekday" ? weekdayMenu : activeDay === "saturday" ? saturdayMenu : sundayMenu;

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
            <span className="text-white/80">Meals & Mess</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            Dining & Vegetarian Meals
          </h1>
          <p className="text-white/70 font-medium text-sm md:text-base max-w-xl">
            A state-of-the-art clean dining hall serving nutritious, freshly prepared Jain vegetarian food to boarders.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Dining Hub...</div>
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
        // Curated High-Fidelity Interactive Page
        <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
          
          {/* Stats Section */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mealStats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md text-center space-y-1">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-wider text-accent">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Kitchen Details & Guidelines */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Mess Standard</span>
                <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Jain Vegetarian Dietary Guidelines</h2>
                <div className="h-1.5 w-24 bg-accent rounded-full" />
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                In strict compliance with school heritage norms, all meals cooked in our central steam kitchen are 100% vegetarian. Items prohibited under Jain dietary vows (such as root vegetables like onions, garlic, potatoes) are strictly excluded from campus recipes.
              </p>
              <div className="space-y-3">
                {[
                  "No root vegetables or non-vegetarian ingredients allowed on campus",
                  "Automated washing and slicing systems to maintain hygiene",
                  "Daily quality checks by school administrative managers"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-bold text-primary/80">
                    <CheckCircle2 size={16} className="text-accent shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-[5rem]" />
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <Utensils size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase font-montserrat tracking-tight">Central Dining Hall</h3>
                <p className="text-white/80 font-medium text-xs leading-relaxed">
                  Our central dining block accommodates up to 400 boarders at a single time. Meals are served warm and in cycles to foster community bonds, shared conversations, and healthy eating practices.
                </p>
              </div>
            </div>
          </section>

          {/* Interactive Weekly Menu Scheduler */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Weekly Menu</span>
              <h2 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">Boarders Meals Calendar</h2>
              <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            </div>

            {/* Selector tabs */}
            <div className="flex justify-center">
              <div className="bg-white border border-primary/10 p-2 rounded-2xl flex gap-2 shadow-md max-w-md w-full">
                <button
                  onClick={() => setActiveDay("weekday")}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all ${
                    activeDay === "weekday" ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-primary/5"
                  }`}
                >
                  Weekdays (Mon - Fri)
                </button>
                <button
                  onClick={() => setActiveDay("saturday")}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all ${
                    activeDay === "saturday" ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-primary/5"
                  }`}
                >
                  Saturday (Choice Meal)
                </button>
                <button
                  onClick={() => setActiveDay("sunday")}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all ${
                    activeDay === "sunday" ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-primary/5"
                  }`}
                >
                  Sunday Special
                </button>
              </div>
            </div>

            {/* Menu slots */}
            <div className="max-w-4xl mx-auto space-y-4">
              {activeMenu.map((menuItem, idx) => (
                <div key={idx} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-black text-sm text-primary uppercase">{menuItem.meal}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-semibold max-w-xl text-left sm:text-right">{menuItem.items}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <Footer />
    </main>
  );
}
