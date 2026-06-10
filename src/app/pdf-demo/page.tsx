import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfViewerButton from "@/components/PdfViewerButton";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function PdfDemoPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-gray-800">
      <Navbar />

      <section className="pt-32 lg:pt-40 pb-20 px-6 max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
          <p className="text-accent uppercase text-xs font-black tracking-[0.35em] mb-2">
            Component Demo
          </p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-accent">
            PdfViewerButton Demonstration
          </h1>
          <p className="text-white/80 mt-2 text-sm font-semibold">
            Below are live examples showing how the component handles local files, external APIs, and validation errors.
          </p>
        </div>

        {/* Examples Card */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-accent" />
              1. Local Next.js Public Folder PDF
            </h2>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Accesses a static PDF located inside the `/public` folder of your Next.js project.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
              <PdfViewerButton
                pdfUrl="/uploads/documents/sample-magazine.pdf"
                buttonText="Open School Magazine PDF"
              />
              <code className="text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[#7678ED] font-mono">
                pdfUrl=&quot;/uploads/documents/sample-magazine.pdf&quot;
              </code>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} className="text-green-500" />
              2. Remote API / External URL PDF
            </h2>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Accesses a PDF served directly by a remote absolute URL/API.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
              <PdfViewerButton
                pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                buttonText="Open External Standard Dummy PDF"
              />
              <code className="text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[#7678ED] font-mono">
                pdfUrl=&quot;https://www.w3.org/WAI/.../dummy.pdf&quot;
              </code>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2 mb-2">
              ⚠️ 3. Validation and Error Handling
            </h2>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Demonstrates built-in validation messages when URLs are missing or configured incorrectly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-gray-700">Empty URL Parameter:</p>
                <PdfViewerButton
                  pdfUrl=""
                  buttonText="Click to Trigger Error"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-gray-700">Malformed Absolute URL:</p>
                <PdfViewerButton
                  pdfUrl="invalid-protocol-url.com/file.pdf"
                  buttonText="Click to Trigger Error"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
