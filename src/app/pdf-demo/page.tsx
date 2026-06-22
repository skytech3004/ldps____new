"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfViewerButton from "@/components/PdfViewerButton";
import { Sparkles, FileWarning, FolderTree, CheckCircle } from "lucide-react";

export default function PdfDemoPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-gray-800 font-sans">
      <Navbar />

      <section className="pt-32 lg:pt-40 pb-24 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
        
        {/* Main Header Banner */}
        <div className="bg-gradient-to-r from-[#112759] to-[#3D348B] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,184,1,0.1),transparent)] z-0" />
          <div className="relative z-10 space-y-3">
            <span className="text-accent text-xs font-black uppercase tracking-[0.4em] block">
              Component Showcase
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Reusable <span className="text-accent">PDF Viewer Button</span>
            </h1>
            <p className="text-white/80 max-w-3xl text-sm md:text-base font-medium leading-relaxed">
              This component handles local Next.js asset paths and absolute remote URLs, validates the file's presence on the server before opening, and opens the document directly in a new tab without trigger-downloads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Examples - Column 7 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Demos */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-8">
              
              {/* Demo 1: Local PDF in public/pdfs */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base md:text-lg font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle size={18} className="text-[#3D348B]" />
                    1. Local PDF (/public/pdfs/sample.pdf)
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Opens a static PDF located inside the <code className="bg-slate-50 px-1 py-0.5 rounded text-[#3D348B] font-mono">public/pdfs/</code> folder.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <PdfViewerButton
                    pdfUrl="/pdfs/sample.pdf"
                    buttonText="View PDF Document"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3D348B] bg-[#3D348B]/5 px-3 py-1.5 rounded-lg border border-[#3D348B]/10 self-start sm:self-auto font-mono">
                    /pdfs/sample.pdf
                  </span>
                </div>
              </div>

              {/* Demo 2: Missing PDF handling */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base md:text-lg font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                    <FileWarning size={18} className="text-amber-500" />
                    2. Dynamic Error Checking (Missing File)
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Triggers a status check on a non-existent PDF file, catching the failure and rendering an inline error.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <PdfViewerButton
                    pdfUrl="/pdfs/non-existent-file.pdf"
                    buttonText="View Missing PDF"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 self-start sm:self-auto font-mono">
                    File does not exist
                  </span>
                </div>
              </div>

              {/* Demo 3: External PDF URL */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base md:text-lg font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2">
                    <Sparkles size={18} className="text-[#3D348B]" />
                    3. External PDF URL Verification
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Works identically with remote URLs, checking remote headers prior to navigation.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <PdfViewerButton
                    pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    buttonText="View External PDF"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3D348B] bg-[#3D348B]/5 px-3 py-1.5 rounded-lg border border-[#3D348B]/10 self-start sm:self-auto font-mono">
                    Absolute remote URL
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Folder & Documentation Details - Column 5 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Folder Structure */}
            <div className="bg-[#112759] text-white rounded-[2rem] p-6 md:p-8 shadow-md border border-white/10 space-y-4">
              <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-accent flex items-center gap-2">
                <FolderTree size={18} />
                Project Directory Structure
              </h2>
              <p className="text-xs text-white/70 leading-relaxed font-semibold">
                Store PDF assets under the Next.js standard public directory to serve them cleanly:
              </p>
              
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 font-mono text-xs leading-relaxed text-emerald-400 overflow-x-auto select-all">
                {`my-nextjs-app/
├── public/
│   └── pdfs/
│       ├── sample.pdf           <-- Static PDF
│       └── document.pdf
├── src/
│   ├── app/
│   │   ├── pdf-demo/
│   │   │   └── page.tsx         <-- This Demo Page
│   │   └── layout.tsx
│   └── components/
│       └── PdfViewerButton.tsx  <-- Reusable Component`}
              </div>
            </div>

            {/* Implementation Details */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#3D348B]">
                Key Best Practices Used
              </h2>
              <ul className="text-xs text-slate-500 font-semibold space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-accent font-black">✔</span>
                  <span><strong>Safe Fetch Verification:</strong> Makes a lightweight `HEAD` request (with `GET` fallback) to verify file existence on-server before attempting tab openings.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-black">✔</span>
                  <span><strong>UX Feedback:</strong> Displays an animated spinner and "Verifying..." text during loading states, along with styled alert cards on failure.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-black">✔</span>
                  <span><strong>Responsive Design:</strong> CSS styled using premium Tailwind color palettes (HSL tailors), fully adaptive for mobile tap targets and desktop layouts.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-black">✔</span>
                  <span><strong>SEO & Security:</strong> Embedded `noopener,noreferrer` attributes protect against tab-nabbing vulnerabilities.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </section>

      <Footer />
    </main>
  );
}
