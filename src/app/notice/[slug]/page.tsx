import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, FileText, BadgeInfo } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintButton from "@/components/PrintButton";
import { allNotices, getNoticeBySlug as getStaticNoticeBySlug } from "@/data/noticeData";
import { connectToDatabase } from "@/lib/mongodb";
import { NoticeModel } from "@/models/Notice";

// Define TypeScript structures for Next.js 16 dynamic routing
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNotice(slug: string) {
  // Try static first
  const staticNotice = getStaticNoticeBySlug(slug);
  if (staticNotice) return staticNotice;

  // Try database
  try {
    await connectToDatabase();
    const notices = await NoticeModel.find().lean();
    const dbNotice = notices.find(n => {
      const generatedSlug = n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return generatedSlug === slug;
    });

    if (dbNotice) {
      return {
        slug,
        category: dbNotice.category,
        date: new Date(dbNotice.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' }),
        refNo: dbNotice.refNo || "N/A",
        subject: dbNotice.subject || dbNotice.title,
        body: dbNotice.body || "No details provided.",
        signatory: dbNotice.signatory || "Principal,\nLPS English Medium School"
      };
    }
  } catch (error) {
    console.error("Failed to fetch notice from DB:", error);
  }

  return null;
}

// Generate static routes at build-time
export async function generateStaticParams() {
  return allNotices.map((notice) => ({
    slug: notice.slug,
  }));
}

// Dynamic SEO Metadata generation
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const notice = await getNotice(slug);

  if (!notice) {
    return {
      title: "Notice Not Found | LPS Vidyawadi",
    };
  }

  const cleanSubject = notice.subject.replace(/[^a-zA-Z0-9\s-]/g, "");

  return {
    title: `${cleanSubject} | Official Notice Board - LPS Vidyawadi`,
    description: `${notice.body.slice(0, 150)}... Official school announcement from Leeladevi Parasmal Sancheti Sr. Sec. School.`,
    keywords: [
      "LPS Vidyawadi",
      "Vidyawadi notice",
      "Sancheti school",
      notice.category,
      notice.subject.toLowerCase(),
      "school circular",
      "admission notice",
      "announcements",
    ],
    openGraph: {
      title: `${cleanSubject} | LPS Vidyawadi`,
      description: notice.body.slice(0, 160) + "...",
      type: "article",
      locale: "en_US",
      siteName: "LPS Vidyawadi",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanSubject} | LPS Vidyawadi`,
      description: notice.body.slice(0, 160) + "...",
    },
  };
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const notice = await getNotice(slug);

  if (!notice) {
    notFound();
  }

  // Segment paragraphs from body text
  const paragraphs = notice.body.split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-white to-[#7678ED]/5 flex flex-col">
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Top Control Bar (Responsive) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-[#3D348B] rounded-xl shadow-sm transition-all duration-300 hover:-translate-x-1 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7678ED]/10 text-[#3D348B] text-xs font-extrabold uppercase rounded-lg">
                <FileText size={12} />
                {notice.category}
              </span>
            </div>
          </div>

          {/* Premium School Letterhead Circular Card */}
          <article className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(61,52,139,0.06)] overflow-hidden relative flex flex-col p-6 md:p-12 print:shadow-none print:border-none print:p-0">
            {/* Top Branding Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#3D348B] via-[#7678ED] to-[#F7B801] absolute top-0 left-0 print:hidden" />

            {/* Official Letterhead Header */}
            <header className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pb-6 border-b-2 border-slate-100 text-center md:text-left">
              <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                <img
                  src="/lps-vidhyawadi/logo.jpg"
                  alt="School Logo"
                  className="w-full h-full object-contain rounded-xl border border-slate-50 shadow-sm"
                />
              </div>

              <div className="flex-grow">
                <h1 className="text-xl md:text-2xl font-black text-[#3D348B] tracking-tight leading-tight uppercase">
                  LEELADEVI PARASMAL SANCHETI
                </h1>
                <h2 className="text-xs md:text-sm font-black text-[#7678ED] uppercase tracking-wider mt-0.5">
                  ENGLISH MEDIUM SENIOR SECONDARY SCHOOL
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 mt-1.5 text-[10px] md:text-xs text-slate-400 font-semibold">
                  <span>Affiliated to CBSE, New Delhi</span>
                  <span className="hidden md:inline">•</span>
                  <span>Managed by Marudhar Mahila Shikshan Sangh</span>
                </div>
              </div>
            </header>

            {/* Document Metadata block */}
            <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs font-bold text-slate-500 py-3 px-4 bg-slate-50 rounded-xl mt-6 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="text-slate-400">REF NO:</span>
                <span className="text-[#3D348B]">{notice.refNo}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span className="text-slate-400">DATE:</span>
                <span className="text-[#3D348B]">{notice.date}</span>
              </span>
            </section>

            {/* Document Subject block */}
            <section className="mt-8 text-center px-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F7B801]/10 text-[#F18701] text-[10px] font-black uppercase tracking-widest rounded-full">
                <BadgeInfo size={11} />
                Official Circular
              </span>
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[#3D348B] mt-4 leading-snug uppercase max-w-2xl mx-auto">
                SUBJECT: {notice.subject}
              </h3>
            </section>

            {/* Document Body text paragraphs */}
            <section className="mt-8 text-sm md:text-base text-slate-600 font-medium leading-relaxed space-y-5 px-1 text-justify">
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx} className="indent-0 md:indent-8">
                  {p}
                </p>
              ))}
            </section>

            {/* Official Signature block */}
            <footer className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <div className="text-right max-w-xs">
                {/* Mock Handwritten signature style */}
                <p className="font-serif italic text-lg md:text-xl font-black text-slate-700 leading-none pr-3 select-none">
                  {notice.signatory.split('\n')[0]}
                </p>
                <div className="w-28 h-[1px] bg-slate-200 my-1.5 ml-auto" />
                <p className="text-xs font-bold text-slate-500 whitespace-pre-line leading-snug uppercase tracking-wide">
                  {notice.signatory}
                </p>
              </div>
            </footer>
          </article>

          {/* Action buttons (Print and Back to top) */}
          <div className="flex items-center justify-between mt-8 px-2 print:hidden">
            <span className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} LPS Vidyawadi. Official Notice Document.
            </span>

            <PrintButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
