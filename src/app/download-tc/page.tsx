"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, FileText, CheckCircle2, ArrowRight, ShieldAlert, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

const tcRecords = [
  { name: "Namrata Kanwar", admissionNo: "1724", tcNo: "TC/2024/048", status: "Issued", issueDate: "2024-04-12" },
  { name: "Ritika Champawat", admissionNo: "1725", tcNo: "TC/2024/049", status: "Issued", issueDate: "2024-04-14" },
  { name: "Bhagyashree Kanwar", admissionNo: "1726", tcNo: "TC/2024/050", status: "Issued", issueDate: "2024-04-14" },
  { name: "Navya", admissionNo: "1729", tcNo: "TC/2024/051", status: "Issued", issueDate: "2024-04-15" },
  { name: "Neetu Sumersingh Chouhan", admissionNo: "1730", tcNo: "TC/2024/052", status: "Issued", issueDate: "2024-04-18" },
  { name: "Vanshika Choudhary", admissionNo: "1737", tcNo: "TC/2024/053", status: "Issued", issueDate: "2024-04-20" },
  { name: "Akshita Hingarh", admissionNo: "1743", tcNo: "TC/2024/054", status: "Issued", issueDate: "2024-04-22" },
  { name: "Muskan Yakub Khan Mohila", admissionNo: "1748", tcNo: "TC/2024/055", status: "Issued", issueDate: "2024-04-24" },
  { name: "Divyanshi Dangi", admissionNo: "1751", tcNo: "TC/2024/056", status: "Issued", issueDate: "2024-04-25" },
  { name: "Rashi Solanki", admissionNo: "1752", tcNo: "TC/2024/057", status: "Issued", issueDate: "2024-04-28" }
];

export default function DownloadTCPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRecords = tcRecords.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.admissionNo.includes(searchTerm) ||
      record.tcNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="text-white/80">Download TC</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Transfer Certificate Registry
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Verify issued Transfer Certificates (T.C.) online or review withdrawal guidelines.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Search & Registry Table */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">TC Verification</span>
            <h2 className="text-2xl md:text-4xl font-black text-primary uppercase font-montserrat">
              Issued T.C. Verification Portal
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full" />
          </div>

          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
            In compliance with educational transparency, the registry provides an active search portal to verify 
            withdrawn students and issued transfer certificate serials. Enter the student's name or admission ID to verify.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md bg-white border border-primary/10 rounded-2xl p-2 flex items-center shadow-md">
            <Search className="text-gray-400 ml-3 shrink-0" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Student Name or Admission No..."
              className="w-full bg-transparent px-3 py-3 text-primary text-sm font-bold focus:outline-none placeholder-gray-400"
            />
          </div>

          {/* Table Container */}
          <div className="bg-white border border-primary/5 rounded-[2rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Admission No</th>
                    <th className="py-4 px-6">T.C. Serial Number</th>
                    <th className="py-4 px-6">Issue Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 font-bold text-sm">
                        No matching TC records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-primary">{record.name}</td>
                        <td className="py-4 px-6 text-gray-500 font-bold">{record.admissionNo}</td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-black text-accent-hover uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                            {record.tcNo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-xs font-semibold">
                          {new Date(record.issueDate).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="lg:col-span-5 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 sticky top-32">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-accent-hover" />
            </div>
            <div className="space-y-0.5">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block">Application Rules</span>
              <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                How to Apply for T.C.
              </h3>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { title: "Intimation Deadline", desc: "Parents willing to withdraw their ward must intimate the Principal in writing latest by 31st January." },
              { title: "Application Form", desc: "Submit the TC request application at least 7 days in advance in the prescribed form with clear details." },
              { title: "Dues Clearance", desc: "All school fees, hostel dues, tuck shop tabs, and library books must be cleared/returned to receive the certificate." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-lg bg-primary/5 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-primary uppercase tracking-tight">{step.title}</h4>
                  <p className="text-gray-500 font-medium text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alert Callout */}
          <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 flex gap-4 items-start">
            <ShieldAlert className="text-accent-hover shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <p className="text-amber-850 font-black uppercase text-xs">Official Verification</p>
              <p className="text-amber-800/80 font-semibold text-xs leading-relaxed">
                If the student transfer record is not reflecting in this list, or for physical copy stamps, parents must contact the registry office.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Quick Links */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 p-8 md:p-12 text-center space-y-6 shadow-xl">
          <Clock className="text-accent mx-auto animate-pulse" size={40} />
          <h3 className="text-2xl md:text-3xl font-black text-primary font-montserrat uppercase">
            Looking for other resources?
          </h3>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
            You can download digital PDFs of student leave application forms, activity planners, and brochures directly from our downloads page.
          </p>
          <div className="pt-2">
            <Link 
              href="/downloads" 
              className="inline-flex items-center gap-2 bg-primary text-white font-extrabold uppercase text-xs md:text-sm tracking-wider px-8 py-4 rounded-xl hover:bg-secondary hover:shadow-lg transition-all"
            >
              <span>Go to Downloads</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
