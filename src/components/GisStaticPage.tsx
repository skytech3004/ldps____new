"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { gisMenuItems } from "@/data/gisMenu";
import { schoolDatabase, schoolImages, type SchoolPage } from "@/data/lpsVidhyawadiDatabase";
import Image from "next/image";

type DBPageContent = {
  title: string;
  status?: string;
  sections: { title: string; content: string[] }[];
};

function getMappedContent(slug: string) {
  const pages = schoolDatabase.pages;
  const mapByTitle = new Map(pages.map((p) => [p.title, p]));
  const slugToTitles: Record<string, string[]> = {
    home: ["Home"],
    "about-gis": ["Introduction"],
    "about-lps": ["Introduction"],
    "chairmans-desk": ["Introduction"],
    "directors-desk": ["Introduction"],
    "principals-desk": ["Introduction"],
    "managing-committee": ["CBSE Mandatory Disclosure - School Information"],
    scholastic: ["Academic Curriculum"],
    "co-scholastic": ["Beyond Academics"],
    sports: ["Achievements - Sports", "Beyond Academics"],
    "result-2024-25": ["Achievements - Academic"],
    "result-2023-24": ["Achievements - Academic"],
    "school-planner": ["Academic Schedule"],
    "e-brochure": ["E-Prospectus"],
    "eligibility-criteria": ["Admission Procedure"],
    "fee-structure": ["Admission Procedure"],
    "fee-policy": ["Admission Procedure"],
    "apply-for-admission": ["Admission Procedure"],
    downloads: ["Leave Application", "Admission Procedure"],
    "download-tc": ["TC"],
    "pre-primary": ["Academic Curriculum"],
    "day-schooling": ["Academic Curriculum"],
    hostel: ["Vidyawadi Support System"],
    "hostel-care": ["Vidyawadi Support System"],
    meals: ["Vidyawadi Support System"],
    "a-day-at-gis": ["Home", "Vidyawadi Support System"],
    "a-day-at-school": ["Home", "Vidyawadi Support System"],
    "items-required-by-boarders": ["Vidyawadi Support System"],
    "photo-gallery": ["Gallery"],
    "video-gallery": ["Gallery"],
    magazine: ["Achievements - Academic"],
    news: ["Home"],
    transport: ["Vidyawadi Support System", "Contact Us"],
    "public-disclosures-cbse": ["CBSE Mandatory Disclosure - School Information"],
    "g-r-mechanism": ["Contact Us"],
    "holiday-list": ["Academic Schedule"],
    announcements: ["Home"],
    blog: ["Beyond Academics"],
    contact: ["Contact Us"],
  };

  const selectedTitles = slugToTitles[slug] ?? ["Home"];
  const selectedPages = selectedTitles
    .map((title) => mapByTitle.get(title))
    .filter((page): page is SchoolPage => Boolean(page));
  
  // Transform SchoolPage format to DBPageContent format for uniform rendering
  return selectedPages.map(p => ({
    title: p.title,
    status: p.status,
    sections: p.sections.map(([title, content]) => ({ title, content }))
  }));
}

export default function GisStaticPage({ slug }: { slug: string }) {
  const [dbContent, setDbContent] = useState<DBPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  const menu = gisMenuItems.find((item) => item.slug === slug);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/admin/pages?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections && data.sections.length > 0) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [slug]);

  if (!menu) {
    return null;
  }

  const staticContent = getMappedContent(slug);
  const displayPages = dbContent ? [dbContent] : staticContent;
  const gallery = schoolImages.filter((image) => image.category === "gallery").slice(0, 6);

  return (
    <main className="min-h-screen pt-32 lg:pt-40 bg-[#f7fbf8] text-gray-800">
      <Navbar />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
            <p className="text-accent uppercase text-xs font-black tracking-[0.35em] mb-2">{menu.group}</p>
            <h1 className="text-4xl font-black uppercase tracking-tight">{menu.title}</h1>
            {menu.sourceUrl ? (
              <p className="mt-3 text-white/60 text-[10px] uppercase font-bold tracking-widest">
                Source Reference:{" "}
                <a href={menu.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">
                  {menu.sourceUrl}
                </a>
              </p>
            ) : null}
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-primary/5">
              <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Content...</div>
            </div>
          ) : displayPages.length === 0 ? (
            <section className="bg-white border border-primary/10 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-black text-primary mb-4">{menu.title}</h2>
              <p className="text-gray-500 font-medium">Content will be updated from LPS data for this menu section.</p>
            </section>
          ) : (
            displayPages.map((page, pIdx) => (
              <section key={pIdx} className="bg-white border border-primary/10 rounded-[2rem] p-8 md:p-10 shadow-sm space-y-10">
                <div className="border-l-4 border-accent pl-6">
                  <h2 className="text-3xl font-black text-primary uppercase tracking-tight">{page.title}</h2>
                  {page.status ? <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">{page.status}</p> : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {page.sections.map((section, sIdx) => (
                    <article key={sIdx} className="bg-gray-50/50 border border-primary/5 rounded-2xl p-6 hover:shadow-md transition-shadow">
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
              </section>
            ))
          )}

          <section className="bg-white border border-primary/10 rounded-[2rem] p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-black text-primary mb-8 uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Campus Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {gallery.map((image) => (
                <div key={image.file} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 16vw" 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/10"
          >
            Back to Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
