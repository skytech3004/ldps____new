"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users2, ArrowRight, UserRound } from "lucide-react";
import { defaultLeadershipIntroContent } from "@/data/leadershipPageIntro";

type LeadershipMember = {
  _id: string;
  name: string;
  designation: string;
  image: string;
  sortOrder: number;
};

export default function LeadershipPage() {
  const [items, setItems] = useState<LeadershipMember[]>([]);
  const [introContent, setIntroContent] = useState(defaultLeadershipIntroContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const [membersResponse, settingsResponse] = await Promise.all([
          fetch("/api/admin/leadership", { cache: "no-store" }),
          fetch("/api/admin/leadership-settings", { cache: "no-store" }),
        ]);

        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setItems(membersData as LeadershipMember[]);
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setIntroContent(settingsData.introContent || defaultLeadershipIntroContent);
        }
      } catch (error) {
        console.error("Failed to load leadership page:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      <section className="relative pt-36 pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.35em] text-[10px] md:text-xs">
            <Users2 size={14} />
            <span>Management Committee & Trustees</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-accent">
            Management Committee
          </h1>
          <p className="text-white/65 max-w-2xl text-sm md:text-base leading-relaxed">
            Meet the dedicated members of our governing board, trustees, and administrative officers.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div
          className="leadership-intro text-center space-y-6 [&_img]:mx-auto [&_img]:w-full [&_img]:max-w-4xl [&_img]:rounded-xl [&_img]:shadow-lg [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-black [&_h1]:text-[#b34454] [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-black [&_h2]:text-[#b34454] [&_p]:text-[#4a4a4a] [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:max-w-3xl [&_p]:mx-auto"
          dangerouslySetInnerHTML={{ __html: introContent }}
        />
      </section>

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white border border-primary/10 rounded-[2rem] p-10 text-center text-primary font-black uppercase tracking-wider">
            Loading Management Committee...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] shadow-lg border border-primary/10 bg-white">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-5 md:p-6 text-xs font-black uppercase tracking-widest">Photo</th>
                  <th className="p-5 md:p-6 text-xs font-black uppercase tracking-widest">Name</th>
                  <th className="p-5 md:p-6 text-xs font-black uppercase tracking-widest">Designation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {items.map((member) => {
                  const hasImage = Boolean(member.image);

                  return (
                    <tr key={member._id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-5 md:p-6">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-primary/10 bg-gray-100">
                          {hasImage ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                              <UserRound size={28} className="text-white/90" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5 md:p-6">
                        <h2 className="text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                          {member.name}
                        </h2>
                      </td>
                      <td className="p-5 md:p-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">
                          {member.designation}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/managing-committee"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 font-black uppercase tracking-wider text-xs hover:bg-secondary transition-colors"
          >
            View Academic Excellence Team
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
