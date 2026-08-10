"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RichHtmlContent from "@/components/RichHtmlContent";
import { aboutPageDefaults } from "@/data/aboutPages";
import { trustInstitutions, trustStats } from "@/data/aboutTrust";
import { Building2, Heart, Sparkles } from "lucide-react";

type AboutTrustData = {
  pageTitle: string;
  pageSubtitle: string;
  bannerImage: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
  inspirationContent: string;
};

export default function AboutTrustPage() {
  const defaults = aboutPageDefaults["about-trust"];
  const [pageData, setPageData] = useState<AboutTrustData>({
    pageTitle: defaults.pageTitle,
    pageSubtitle: defaults.pageSubtitle,
    bannerImage: defaults.bannerImage,
    portraitImage: defaults.portraitImage,
    personName: defaults.personName,
    personDesignation: defaults.personDesignation,
    content: defaults.content,
    inspirationContent: defaults.inspirationContent,
  });

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch("/api/admin/about-pages?slug=about-trust", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPageData({
            pageTitle: data.pageTitle || defaults.pageTitle,
            pageSubtitle: data.pageSubtitle || defaults.pageSubtitle,
            bannerImage: data.bannerImage || defaults.bannerImage,
            portraitImage: data.portraitImage || defaults.portraitImage,
            personName: data.personName || defaults.personName,
            personDesignation: data.personDesignation || defaults.personDesignation,
            content: data.content || defaults.content,
            inspirationContent: data.inspirationContent || defaults.inspirationContent,
          });
        }
      } catch (error) {
        console.error("Failed to load about trust page:", error);
      }
    }

    fetchPage();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      <section className="relative pt-36 pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.35em] text-[10px] md:text-xs">
            <Building2 size={14} />
            <span>Our Journey</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-accent">{pageData.pageTitle}</h1>
          <p className="text-white/65 max-w-2xl text-sm md:text-base leading-relaxed">
            {pageData.pageSubtitle}
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                {pageData.portraitImage ? (
                  <Image
                    src={pageData.portraitImage}
                    alt={pageData.personName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full text-accent font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>{pageData.personDesignation || "Our Inspiration"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                {pageData.personName}
              </h2>
              <div className="flex items-center gap-2 text-secondary">
                <Heart size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Founder &amp; Guiding Light</span>
              </div>
              <RichHtmlContent
                html={pageData.inspirationContent}
                className="text-gray-600 font-medium text-sm md:text-base leading-relaxed"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="about-trust-content text-center space-y-6 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-black [&_h2]:text-[#2f2771] [&_p]:text-[#4a4a4a] [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:max-w-3xl [&_p]:mx-auto">
          <RichHtmlContent html={pageData.content} />
        </div>
      </section>

      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustStats.map((stat) => (
            <article
              key={stat.label}
              className="bg-white border border-primary/10 rounded-[2rem] p-6 text-center shadow-md space-y-2"
            >
              <p className="text-3xl md:text-4xl font-black text-primary">{stat.value}</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat">Our Institutions</h2>
          <p className="text-sm text-gray-500 font-medium">Under Marudhar Mahila Shikshan Sangh, Vidyawadi</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trustInstitutions.map((institution) => (
            <li
              key={institution}
              className="bg-white border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold text-primary shadow-sm flex items-start gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
              <span>{institution}</span>
            </li>
          ))}
        </ul>
      </section>

   

      <Footer />
    </main>
  );
}
