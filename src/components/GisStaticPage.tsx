"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { gisMenuItems } from "@/data/gisMenu";
import { schoolDatabase, schoolImages, type SchoolPage } from "@/data/lpsVidhyawadiDatabase";
import Image from "next/image";
import RichHtmlContent, { isHtmlContent } from "@/components/RichHtmlContent";
import PageLayout, { PageSectionHeader } from "@/components/ui/PageLayout";

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
    <PageLayout
      groupName={menu.group || "Schooling"}
      pageTitle={menu.title}
      subtitle={`Detailed information for ${menu.title} at LPS Vidyawadi.`}
    >
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-primary/10">
          <div className="animate-pulse text-primary font-black uppercase tracking-widest">Loading Content...</div>
        </div>
      ) : displayPages.length === 0 ? (
        <section className="bg-white border border-primary/10 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-black text-primary mb-4">{menu.title}</h2>
          <p className="text-gray-500 font-medium">Content will be updated from LPS data for this menu section.</p>
        </section>
      ) : (
        displayPages.map((page, pIdx) => (
          <section key={pIdx} className="bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-10">
            <div className="border-l-4 border-accent pl-6">
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-tight">{page.title}</h2>
              {page.status ? <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">{page.status}</p> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {page.sections.map((section, sIdx) => (
                <article key={sIdx} className="bg-gray-50/50 border border-primary/10 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-black text-primary mb-4 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                    {section.title}
                  </h3>
                  {section.content.length === 1 && isHtmlContent(section.content[0]) ? (
                    <RichHtmlContent html={section.content[0]} className="text-gray-600 font-medium text-sm leading-relaxed" />
                  ) : (
                    <ul className="space-y-3">
                      {section.content.map((line, lIdx) => (
                        <li key={lIdx} className="text-gray-600 font-medium text-sm leading-relaxed flex gap-3">
                          <span className="text-accent font-bold mt-0.5 shrink-0">•</span>
                          {isHtmlContent(line) ? (
                            <RichHtmlContent html={line} className="flex-1" />
                          ) : (
                            <span>{line}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-8">
        <PageSectionHeader title="Campus Gallery" badge="Visual Catalog" centered={false} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.map((image) => (
            <div key={image.file} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border-2 border-white bg-gray-100">
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

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20"
        >
          Back to Home
        </Link>
      </div>
    </PageLayout>
  );
}
