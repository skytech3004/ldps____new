"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users2, ArrowRight, UserRound } from "lucide-react";

type LeadershipMember = {
  _id: string;
  name: string;
  designation: string;
  image: string;
  sortOrder: number;
};

export default function LeadershipPage() {
  const [items, setItems] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeadership() {
      try {
        const response = await fetch("/api/admin/leadership", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch leadership members.");
        }
        const data = await response.json();
        setItems(data as LeadershipMember[]);
      } catch (error) {
        console.error("Failed to load leadership:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeadership();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      <section className="relative pt-36 pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.35em] text-[10px] md:text-xs">
            <Users2 size={14} />
            <span>Leadership & Trustees</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-accent">
            Leadership Team
          </h1>
          <p className="text-white/65 max-w-2xl text-sm md:text-base leading-relaxed">
            One page for the CEO, chairman, president, vice presidents, secretary, and treasurer with names,
            designations, and image support.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white border border-primary/10 rounded-[2rem] p-10 text-center text-primary font-black uppercase tracking-wider">
            Loading leadership...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((member) => {
              const hasImage = Boolean(member.image);

              return (
                <article
                  key={member._id}
                  className="bg-white border border-primary/10 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/5]">
                    {hasImage ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <UserRound size={64} className="text-white/90" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <h2 className="text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                      {member.name}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">
                      {member.designation}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/managing-committee"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 font-black uppercase tracking-wider text-xs hover:bg-secondary transition-colors"
          >
            View Managing Committee
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
