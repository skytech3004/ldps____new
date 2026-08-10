"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users2 } from "lucide-react";
import {
  aboutPageDefaults,
  defaultManagementMembers,
  leadershipStructure,
  managementValues,
  type ManagementMember,
} from "@/data/aboutPages";

type AboutPageData = {
  pageTitle: string;
  content: string;
  members: ManagementMember[];
};

export default function AboutManagementPage() {
  const [pageData, setPageData] = useState<AboutPageData>({
    pageTitle: aboutPageDefaults.management.pageTitle,
    content: aboutPageDefaults.management.content,
    members: defaultManagementMembers,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/about-pages?slug=management", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPageData({
            pageTitle: data.pageTitle || aboutPageDefaults.management.pageTitle,
            content: data.content || aboutPageDefaults.management.content,
            members:
              Array.isArray(data.members) && data.members.length > 0
                ? data.members
                : defaultManagementMembers,
          });
        }
      } catch (error) {
        console.error("Failed to load management page:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sortedMembers = [...pageData.members].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      <section className="relative pt-36 pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.35em] text-[10px] md:text-xs">
            <Users2 size={14} />
            <span>Guiding Our Vision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-accent">{pageData.pageTitle}</h1>
          <p className="text-white/65 max-w-2xl text-sm md:text-base leading-relaxed">
            Guided by excellence, ethical management, and a shared commitment to the institution&apos;s values.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div
          className="about-management-intro text-center space-y-6 [&_img]:mx-auto [&_img]:w-full [&_img]:max-w-4xl [&_img]:rounded-xl [&_img]:shadow-lg [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-black [&_h1]:text-[#2f2771] [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-black [&_h2]:text-[#2f2771] [&_p]:text-[#4a4a4a] [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:max-w-3xl [&_p]:mx-auto"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </section>

      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {managementValues.map((item) => (
            <article key={item.title} className="bg-white border border-primary/10 rounded-[2rem] p-6 shadow-md text-center space-y-3">
              <h3 className="text-xl font-black text-primary uppercase font-montserrat">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-black text-primary uppercase font-montserrat">Our Leadership Structure</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {leadershipStructure.map((item) => (
            <article key={item.title} className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-[2rem] p-6 text-center space-y-2">
              <h3 className="text-lg font-black text-primary uppercase">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-primary uppercase font-montserrat">Management Committee</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Marudhar Mahila Shikshan Sangh, Vidyawadi, (Khimel)
            <br />
            Station Rani, Dist-Pali 306115 (Rajasthan)
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-primary/10 rounded-[2rem] p-10 text-center text-primary font-black uppercase tracking-wider">
            Loading office bearers...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] shadow-lg border border-primary/10 bg-white">
            <table className="w-full min-w-[500px] text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-5 md:p-6 text-xs font-black uppercase tracking-widest">Name</th>
                  <th className="p-5 md:p-6 text-xs font-black uppercase tracking-widest">Designation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {sortedMembers.map((member, index) => (
                  <tr key={`${member.name}-${member.designation}-${index}`} className="hover:bg-primary/5 transition-colors">
                    <td className="p-5 md:p-6">
                      <h3 className="text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                        {member.name}
                      </h3>
                    </td>
                    <td className="p-5 md:p-6">
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">{member.designation}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/about/management-message"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 font-black uppercase tracking-wider text-xs hover:bg-secondary transition-colors"
          >
            President&apos;s Message
          </Link>
          <Link
            href="/about/ceo-message"
            className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-6 py-3 font-black uppercase tracking-wider text-xs hover:bg-primary hover:text-white transition-colors"
          >
            CEO&apos;s Message
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
