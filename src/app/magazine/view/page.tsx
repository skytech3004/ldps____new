"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Download, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MagazineViewContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title") || "School Magazine";

  if (!url) {
    return (
      <div className="text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-md mx-auto my-12">
        <p className="font-bold text-red-500">Invalid PDF URL. Please return to the publication archive.</p>
        <Link 
          href="/magazine" 
          className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Magazines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/magazine"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#3D348B] transition-colors shrink-0"
            title="Back to Magazines"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-[#7678ED] uppercase tracking-wider">Viewing publication</p>
            <h1 className="text-sm font-black text-primary uppercase tracking-tight truncate max-w-xs md:max-w-md lg:max-w-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={url}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F7B801]/10 text-[#F18701] text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            <span>Open Raw</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="flex-grow bg-slate-100 border border-slate-200/50 rounded-[2rem] shadow-inner overflow-hidden min-h-[75vh] relative flex items-center justify-center">
        <iframe
          src={`${url}#toolbar=1`}
          className="w-full h-full border-0 absolute inset-0 bg-white"
          title={title}
        />
      </div>
    </div>
  );
}

export default function MagazineViewPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-gray-800 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-32 lg:pt-40 pb-12 px-6 flex flex-col">
        <Suspense 
          fallback={
            <div className="flex-grow flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-[#3D348B]/70">Loading Document Viewer...</p>
              </div>
            </div>
          }
        >
          <MagazineViewContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
