"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, ClipboardList, CheckCircle, FileText, ArrowRight, HelpCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function EligibilityCriteria() {
  const documents = [
    "Date of birth certificate (Authorized Corporation / Panchayat record)",
    "Original Transfer Certificate (T.C.) (Migration certificate if from another board)",
    "Attested copy of School Report Card of the preceding academic year",
    "Medical Fitness Certificate from a registered medical practitioner",
    "8 Passport-size photographs of the student",
    "1 Passport-size photograph of the Father, Mother, and Guardian",
    "Address Proof (Aadhar Card, Electricity Bill, or Registry documents)",
    "Income Certificate / BPL Card / Disability Certificate (as applicable)",
    "Aadhar Card of the student and both parents",
    "Caste Certificate (if applying under SC/ST/OBC category)"
  ];

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
            <span className="text-white/80">Eligibility Criteria</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Admission & Eligibility
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Complete details on guidelines, requirements, and required documents.
          </p>
        </div>
      </section>

      {/* Content Details Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Guidelines & Contact */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Admission Process</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Admission Guidelines
              </h2>
              <div className="h-1.5 w-24 bg-accent rounded-full" />
            </div>

            <div className="text-gray-600 font-medium text-sm md:text-base space-y-6 leading-relaxed">
              <p>
                Subject to the availability of seats and irrespective of caste, creed, or religion, the school admits 
                girls from <strong className="text-primary font-bold">Nursery to Class XI</strong>. Underage or overage 
                candidates beyond reasonable limits may not be considered for admission to preserve standard learning tracks.
              </p>
              <p>
                The official admission form and school prospectus can be collected directly from the school reception 
                office during working hours.
              </p>
              
              {/* RTE Notice Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-6 space-y-3">
                <h4 className="text-primary font-black uppercase text-sm flex items-center gap-2">
                  <CheckCircle size={18} className="text-accent" />
                  <span>Right to Education (RTE) Admissions</span>
                </h4>
                <p className="text-xs md:text-sm text-gray-500">
                  Admissions are proudly provided under the Right to Education (RTE) Act for BPL families, 
                  disadvantaged groups, weaker sections, and disabled students as per state regulatory mandates.
                </p>
              </div>
            </div>

            {/* Hotline Desk Card */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[4rem] group-hover:scale-105 transition-transform" />
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admission Query Hotline</p>
                  <h4 className="text-lg font-black text-primary uppercase font-montserrat">Have Questions? Reach Out!</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a href="tel:6377203204" className="block bg-[#F8F9FC] border border-primary/5 rounded-xl p-4 text-center hover:bg-primary/5 transition-all">
                  <p className="text-xs font-semibold text-gray-400">Desk Line 1</p>
                  <p className="text-primary font-black text-lg mt-0.5">6377203204</p>
                </a>
                <a href="tel:6377204209" className="block bg-[#F8F9FC] border border-primary/5 rounded-xl p-4 text-center hover:bg-primary/5 transition-all">
                  <p className="text-xs font-semibold text-gray-400">Desk Line 2</p>
                  <p className="text-primary font-black text-lg mt-0.5">6377204209</p>
                </a>
              </div>
              
              <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                Support available between 10:00 AM and 4:00 PM.
              </p>
            </div>
          </div>

          {/* Right Column: Required Documents Checklist */}
          <div className="lg:col-span-6 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[8rem] -z-10" />
            
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-accent-hover" />
              </div>
              <div className="space-y-0.5">
                <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block">Checklist Registry</span>
                <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                  Required Documents
                </h3>
              </div>
            </div>

            {/* List of Documents */}
            <div className="space-y-4">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex gap-3.5 items-start border-b border-gray-50 pb-3 last:border-0">
                  <div className="mt-1">
                    <CheckCircle className="text-accent shrink-0" size={16} />
                  </div>
                  <span className="text-gray-600 font-medium text-xs md:text-sm leading-relaxed">{doc}</span>
                </div>
              ))}
            </div>

            {/* Alert block */}
            <div className="bg-red-50 border border-red-200/50 rounded-2xl p-5 flex gap-4 items-start">
              <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-red-800 font-black uppercase text-xs">Submission Deadline</p>
                <p className="text-red-700/80 font-semibold text-xs leading-relaxed">
                  All documents must be submitted within one month after the date of admission. 
                  Failure to submit documents within the timeline may lead to the automatic cancellation of the seat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: "Fee Structure", slug: "/fee-structure", desc: "View ICICI direct bank account details and deposits." },
            { title: "Fee Policy", slug: "/fee-policy", desc: "Understand withdrawals, caution money refunds, and calendar schedules." },
            { title: "Apply For Admission", slug: "/apply-for-admission", desc: "Begin the interactive inquiry application." }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.slug} 
              className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <h4 className="text-base font-black text-primary uppercase font-montserrat flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-gray-500 text-xs font-semibold mt-2">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
