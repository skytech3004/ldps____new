"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { schoolImages } from "@/data/lpsVidhyawadiDatabase";

interface CategoryItem {
  image: string;
  title: string;
  link: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setCategories(data.items);
          } else {
            // Fallback to initial logic if no items in DB
            const gallery = schoolImages.filter((image) => image.category === "gallery");
            setCategories([
              { title: "BOARDING", image: gallery[0]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "SMART CLASSES", image: gallery[1]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "SCIENCE LABS", image: gallery[2]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "LIBRARY", image: gallery[3]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "CULTURAL ACTIVITIES", image: gallery[4]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "GAMES & SPORTS", image: gallery[5]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "HOSTEL LIFE", image: gallery[6]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "ACHIEVEMENTS", image: gallery[7]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
              { title: "CAMPUS", image: gallery[8]?.src || "/lps-vidhyawadi/about-banner.jpg", link: "#" },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.link || "#"} className="relative aspect-[4/3] group overflow-hidden block">
              <Image 
                src={cat.image} 
                alt={cat.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-navy/60 group-hover:bg-navy/40 transition-colors duration-300 flex items-center justify-center p-4">
                <h3 className="text-white font-black text-xl lg:text-2xl text-center uppercase tracking-widest drop-shadow-lg">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
