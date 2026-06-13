"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, FileText, CalendarDays, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const fallbackForms = [
  {
    title: "Student Leave Application Form",
    description: "Prescribed form for submitting student leave requests to the Principal, detailing the duration and reasons.",
    filename: "LPS_Student_Leave_Form.pdf",
    fileSize: "184 KB",
    pdfUrl: "#"
  },
  {
    title: "School E-Prospectus & Brochure",
    description: "Official school prospectus detailing standard guidelines, infrastructure details, streams offered, and values.",
    filename: "LPS_Vidyawadi_Prospectus.pdf",
    fileSize: "2.4 MB",
    pdfUrl: "#"
  },
  {
    title: "T.C. Application Request Form",
    description: "Standard written application form required to initiate student withdrawals and Transfer Certificate clearances.",
    filename: "LPS_TC_Request_Form.pdf",
    fileSize: "142 KB",
    pdfUrl: "#"
  },
  {
    title: "Annual Activity Planner & Calendar",
    description: "Year planner detailing summer and winter breaks, holidays, PTM dates, and exam schedules.",
    filename: "LPS_Academic_Planner_2024.pdf",
    fileSize: "512 KB",
    pdfUrl: "#"
  }
];

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const response = await fetch("/api/admin/downloads");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDownloads(data);
          } else {
            setDownloads(fallbackForms);
          }
        } else {
          setDownloads(fallbackForms);
        }
      } catch (err) {
        console.error("Failed to fetch downloads:", err);
        setDownloads(fallbackForms);
      } finally {
        setLoading(false);
      }
    }
    fetchDownloads();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Decorative Breadcrumb Banner */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">Downloads</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Resource Downloads
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Direct access to official school PDF forms, applications, brochures, and planners.
          </p>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Official Documents</span>
          <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
            Downloadable Forms & PDF files
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center bg-white border border-primary/5 rounded-[2rem] max-w-5xl mx-auto shadow-md">
            <div className="animate-pulse text-primary font-black uppercase tracking-widest text-sm">
              Loading Download Resources...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
            {downloads.map((form, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-primary/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative h-64"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[4rem] group-hover:scale-105 transition-transform" />
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <h4 className="text-base md:text-lg font-black uppercase font-montserrat tracking-tight text-primary">{form.title}</h4>
                  </div>
                  <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed line-clamp-3">{form.description || form.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[150px]" title={form.filename}>{form.filename}</p>
                    <p className="text-[10px] text-accent-hover font-black uppercase tracking-wider">{form.fileSize || form.size}</p>
                  </div>

                  <a 
                    href={form.pdfUrl || "#"}
                    target={form.pdfUrl && form.pdfUrl !== "#" ? "_blank" : undefined}
                    rel={form.pdfUrl && form.pdfUrl !== "#" ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!form.pdfUrl || form.pdfUrl === "#") {
                        e.preventDefault();
                        alert(`Form download initiated for ${form.filename}`);
                      }
                    }}
                    className="bg-primary hover:bg-secondary text-white font-extrabold uppercase text-[10px] md:text-xs tracking-wider px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 group"
                  >
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <ShieldCheck className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Need Personal Assistance?
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            If you cannot find the required forms or need physical printed prospectus documents, 
            feel free to reach out to our campus reception office.
          </p>
          <div className="pt-2">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-primary text-white font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-secondary hover:shadow-lg transition-all"
            >
              <span>Contact Registry</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
