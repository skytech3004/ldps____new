"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, FileSignature, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function FeePolicy() {
  const policies = [
    {
      title: "Written Application Request",
      desc: "For any withdrawal or Transfer Certificate (T.C.) request, parents must submit a formal application in the prescribed form at the school reception desk."
    },
    {
      title: "Processing Timeline",
      desc: "T.C. requests must be submitted at least 7 days in advance. Standard administrative processing requires this timeline to verify dues and clear library/hostel ledgers."
    },
    {
      title: "No-Dues Certificate Requirement",
      desc: "No T.C. or official report card will be issued until a complete 'No Dues Certificate' is cleared from the accounts desk, hostels, labs, and library."
    },
    {
      title: "Caution Money Settlement",
      desc: "The refundable caution deposit of Rs. 1,000/- is settled and adjusted against outstanding dues or refunded within a standard 30-day clearance cycle."
    }
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
            <span className="text-white/80">Fee Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Withdrawal & Fee Policy
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">
            Official guidelines on student withdrawals, timelines, T.C. applications, and refunds.
          </p>
        </div>
      </section>

      {/* Content Details Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Withdrawal Policy & Deadlines */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Official Guidelines</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Student Withdrawals
              </h2>
              <div className="h-1.5 w-24 bg-accent rounded-full" />
            </div>

            <div className="text-gray-600 font-medium text-sm md:text-base space-y-6 leading-relaxed">
              <p>
                To maintain standard operational planning, classroom arrangements, and hostel bed allocations for the upcoming academic year, 
                parents must notify the school in advance regarding student withdrawals.
              </p>
              
              {/* Critical Notice Card (31st Jan Deadline) */}
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[6rem] -z-10" />
                
                <div className="flex gap-4 items-start">
                  <AlertTriangle className="text-accent-hover shrink-0 mt-0.5" size={24} />
                  <div className="space-y-2">
                    <h4 className="text-primary font-black uppercase text-sm tracking-tight">
                      Critical Notice: 31st January Deadline
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                      Parents willing to shift or withdraw their ward from Vidyawadi must formally intimate the school authorities 
                      <strong className="text-primary font-bold"> latest by 31st January</strong> of the current academic session. 
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                      Failure to submit the withdrawal notice by this date will imply the student is continuing for the next session, 
                      and standard administrative fees/dues may apply accordingly.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                We appreciate the cooperation of all parents in adhering strictly to these timelines to ensure smooth administration, dues settlement, 
                and allocation of seats to pending admission list applications.
              </p>
            </div>
          </div>

          {/* Right Column: T.C. Guidelines and Dues Clearance */}
          <div className="lg:col-span-5 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[8rem] -z-10" />
            
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileSignature size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] block">T.C. Instructions</span>
                <h3 className="text-xl md:text-2xl font-black text-primary uppercase font-montserrat tracking-tight">
                  Transfer Certificate (T.C)
                </h3>
              </div>
            </div>

            {/* Policies Steps list */}
            <div className="space-y-6">
              {policies.map((policy, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#F8F9FC] border border-primary/5 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-primary uppercase tracking-tight">{policy.title}</h4>
                    <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">{policy.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dues tag */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 justify-center">
              <Clock className="text-accent" size={16} />
              <span className="uppercase tracking-wider">7-Day standard processing period</span>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: "Eligibility Criteria", slug: "/eligibility-criteria", desc: "View the required documents checklist and timeline policies." },
            { title: "Fee Structure", slug: "/fee-structure", desc: "View ICICI direct bank account details and deposits." },
            { title: "Apply For Admission", slug: "/apply-for-admission", desc: "Access the interactive inquiry form for online registration." }
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
