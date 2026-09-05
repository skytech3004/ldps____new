"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout, { PageSectionHeader } from "@/components/ui/PageLayout";
import { CreditCard, Copy, Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function FeeStructure() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dbContent, setDbContent] = useState<any>(null);

  useEffect(() => {
    async function fetchDbPage() {
      try {
        const res = await fetch("/api/admin/pages?slug=fee-structure");
        if (res.ok) {
          const data = await res.json();
          if (data && data.sections) {
            setDbContent(data);
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic page content:", err);
      }
    }
    fetchDbPage();
  }, []);

  const feeList = [
    { class: "Nursery", annualFee: "₹17,700", installment: "₹8,850" },
    { class: "KG-Prep", annualFee: "₹18,400", installment: "₹9,200" },
    { class: "Class I – II", annualFee: "₹21,300", installment: "₹10,650" },
    { class: "Class III – IV", annualFee: "₹21,300", installment: "₹10,650" },
    { class: "Class V", annualFee: "₹29,300", installment: "₹14,650" },
    { class: "Class VI", annualFee: "₹30,800", installment: "₹15,400" },
    { class: "Class VII – VIII", annualFee: "₹34,900", installment: "₹17,450" },
    { class: "Class IX – X", annualFee: "₹36,000", installment: "₹18,000" },
    { class: "Class XI – XII (Science - PCM)", annualFee: "₹49,600", installment: "₹24,800" },
    { class: "Class XI – XII (Science - PCB)", annualFee: "₹52,200", installment: "₹26,100" },
    { class: "Class XI – XII (Science - General)", annualFee: "₹41,200", installment: "₹20,600" },
    { class: "Class XI – XII (Commerce - Comp. Sc.)", annualFee: "₹42,400", installment: "₹21,200" },
    { class: "Class XI – XII (Commerce - General)", annualFee: "₹41,500", installment: "₹20,750" },
    { class: "Class XI – XII (Arts)", annualFee: "₹43,600", installment: "₹21,800" }
  ];

  const bankDetails = [
    { label: "Account Name", value: "Leeladevi Parasmal Sancheti English Medium Sr. Sec. School Vidyawadi", key: "name" },
    { label: "Account Number", value: "684601424110", key: "number" },
    { label: "Bank & Branch", value: "ICICI Bank (Branch Code 6846)", key: "bank" },
    { label: "IFSC Code", value: "ICIC0006846", key: "ifsc" }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exclusions = [
    "CBSE Board Registration Fees",
    "CBSE Board Examination Fees",
    "Olympiad & Special Aptitude Tests",
    "Picnics, Educational Tours & Outings",
    "Special camps & outdoor workshops"
  ];

  return (
    <PageLayout
      groupName="Academics"
      pageTitle={dbContent?.title || "Fee Structure"}
      subtitle={dbContent?.subtitle || "Transparent fee details and fee schedule for the current academic session."}
    >

      {/* Content Details Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        
        {/* Section 1: Fee Structure Table (Full Width) */}
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Fee Structure</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
              Academic Session Annual Fee Details
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full mx-auto" />
            <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
              Below is the structured annual fee schedule for the current academic session. Tuition fees are payable in two equal installments.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-primary/10 rounded-[2.5rem] p-6 md:p-8 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black text-primary uppercase tracking-wider">
                    <th className="py-4 px-4">Class</th>
                    <th className="py-4 px-4 text-right">Total Annual Fee</th>
                    <th className="py-4 px-4 text-right">Installment (2x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                  {feeList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-primary/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-primary">{item.class}</td>
                      <td className="py-4 px-4 text-right text-primary font-black">{item.annualFee}</td>
                      <td className="py-4 px-4 text-right text-gray-500">{item.installment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* One-time Admission Fee Note Card */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-6">
              <div className="space-y-1">
                <span className="text-accent font-black uppercase tracking-wider text-[10px] block">New Admissions Only</span>
                <h4 className="text-sm font-black text-primary uppercase">Admission Fee (One-Time)</h4>
                <p className="text-xs text-gray-500">
                  Charged only once at the time of new admission into the school.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200/50">
                <div className="pl-0 md:pl-4 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Nursery to Class V</span>
                  <p className="text-lg font-black text-primary">₹2,000</p>
                </div>
                <div className="pl-4 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Class VI to XII</span>
                  <p className="text-lg font-black text-primary">₹4,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Bank details and guidelines (Grid layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Deposit Bank Details (The Bank Card) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Bank Transfer</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Direct Bank Deposit
              </h2>
              <div className="h-1.5 w-24 bg-accent rounded-full" />
            </div>

            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              School fee deposits can be paid safely and directly into the school&apos;s bank account at ICICI Bank 
              using internet banking, NEFT/RTGS, or by visiting your nearest branch.
            </p>

            {/* Premium Bank Card Widget */}
            <div className="relative bg-white border border-primary/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-bl-[10rem] -z-10 group-hover:scale-105 transition-transform" />
              <div className="absolute left-10 -bottom-10 w-32 h-32 bg-accent/5 rounded-full -z-10 blur-xl" />

              <div className="flex gap-4 items-center mb-8 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-primary uppercase font-montserrat">ICICI Deposit Registry</h4>
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Official School Account</p>
                </div>
              </div>

              <div className="space-y-6">
                {bankDetails.map((detail, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 sm:w-1/3">
                      {detail.label}
                    </span>
                    
                    <div className="flex items-center justify-between gap-3 bg-[#F8F9FC] border border-primary/5 rounded-xl px-4 py-3 sm:w-2/3 select-all">
                      <span className="text-xs md:text-sm font-bold text-primary break-all leading-tight">
                        {detail.value}
                      </span>
                      <button
                        onClick={() => handleCopy(detail.value, detail.key)}
                        className="text-primary hover:text-accent-hover shrink-0 transition-colors"
                        aria-label={`Copy ${detail.label}`}
                      >
                        {copiedField === detail.key ? (
                          <Check size={16} className="text-accent" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure tag */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 justify-center">
                <ShieldCheck className="text-accent" size={16} />
                <span className="uppercase tracking-wider">Verfied official banking channel</span>
              </div>
            </div>
          </div>

          {/* Right Column: Fee Details, Caution Money & Post-Payment terms */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            
            {/* Caution Money Widget */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block">Caution Deposit</span>
              <h3 className="text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                Caution Money
              </h3>
              <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed">
                A refundable Caution Money deposit of <strong className="text-primary font-bold">Rs. 1,000/-</strong> is 
                charged to new entrants upon joining. This deposit is fully refunded at the time of student withdrawal 
                subject to clearing institutional dues.
              </p>
            </div>

            {/* Fee Exclusions list */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
              <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] block">Fee Guidelines</span>
              <h3 className="text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                Total Fee Excludes:
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed -mt-3">
                The standard school tuition fee does not encompass the following supplementary components:
              </p>
              
              <div className="space-y-3">
                {exclusions.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-gray-600 font-semibold text-xs md:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slip Instructions Alert Card */}
            <div className="bg-gradient-to-br from-primary to-[#251f59] text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <h4 className="text-accent font-black uppercase text-xs tracking-wider">Post-Payment Instructions</h4>
              
              <div className="space-y-3 font-semibold text-xs leading-relaxed text-white/80">
                <p>
                  • Upon depositing the fee in the bank, the physical bank payment slip or transaction confirmation print-out 
                  must reach the school office by post before the declared last date.
                </p>
                <p>
                  • Parents must always carry a photocopy (Xerox) of the payment slip/receipt on their next visit to the school campus.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: "Admission Guideline", slug: "/eligibility-criteria", desc: "View the required documents checklist and timeline policies." },
            { title: "Fee Policy", slug: "/fee-policy", desc: "Understand withdrawals, calendar deadlines, and refund policies." },
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
    </PageLayout>
  );
}
