"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Copy, Check, ArrowRight, ShieldCheck, Bus, Search, Info } from "lucide-react";

type FeeListItem = {
  class: string;
  annualFee: string;
  installment: string;
};

type SchoolFeeResponse = {
  classLevel: string;
  annualFee: string;
  installment: string;
};

type BusFeeItem = {
  _id?: string;
  sNo: number;
  place: string;
  fee: string;
};

export default function FeeStructure() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const defaultFeeList: FeeListItem[] = [
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

  const [feeList, setFeeList] = useState<FeeListItem[]>(defaultFeeList);
  const [busFees, setBusFees] = useState<BusFeeItem[]>([]);
  const [busSearch, setBusSearch] = useState("");
  const [loadingBusFees, setLoadingBusFees] = useState(true);

  useEffect(() => {
    async function loadFeeList() {
      try {
        const response = await fetch("/api/school-fees", { cache: "no-store" });
        const fees = (await response.json()) as SchoolFeeResponse[];
        if (response.ok && Array.isArray(fees) && fees.length > 0) {
          setFeeList(fees.map((fee) => ({
            class: fee.classLevel,
            annualFee: fee.annualFee,
            installment: fee.installment,
          })));
        }
      } catch (error) {
        console.error("Failed to load school fees:", error);
      }
    }

    async function loadBusFees() {
      try {
        setLoadingBusFees(true);
        const response = await fetch("/api/bus-fees", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && Array.isArray(data) && data.length > 0) {
          setBusFees(data);
        }
      } catch (error) {
        console.error("Failed to load bus fees:", error);
      } finally {
        setLoadingBusFees(false);
      }
    }

    loadFeeList();
    loadBusFees();
  }, []);

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

  const filteredBusFees = busFees.filter((item) =>
    item.place.toLowerCase().includes(busSearch.toLowerCase()) ||
    item.fee.toLowerCase().includes(busSearch.toLowerCase()) ||
    String(item.sNo).includes(busSearch)
  );

  // Divide bus fees into two balanced columns for desktop dual-table view
  const midpoint = Math.ceil(filteredBusFees.length / 2);
  const leftBusFees = filteredBusFees.slice(0, midpoint);
  const rightBusFees = filteredBusFees.slice(midpoint);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 antialiased">
      <Navbar />

      {/* Decorative Breadcrumb Banner */}
      <section className="relative pt-32 pb-12 sm:pt-36 sm:pb-14 md:pt-44 md:pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>Academics</span>
            <span>/</span>
            <span className="text-white/80">Fee Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Fee Portal & Transport Schedule
          </h1>
          <p className="text-white/70 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
            Official academic tuition fees, bus transport schedules, bank account details, and payment guidelines.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-14 sm:space-y-16 md:space-y-20">
        
        {/* Section 1: School Fee Structure Table */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center">
            <span className="text-accent font-black uppercase tracking-[0.3em] text-xs block">Fee Structure</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
              Academic Session Annual Fee Details
            </h2>
            <div className="h-1.5 w-20 sm:w-24 bg-accent rounded-full mx-auto" />
            <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Below is the structured annual fee schedule for the current academic session. Tuition fees are payable in two equal installments.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-primary/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-xl overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider bg-gray-50/50 sm:bg-transparent">
                      <th className="py-3 sm:py-4 px-3 sm:px-4">Class / Level</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 text-right">Total Annual Fee</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 text-right">Installment (2x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-semibold text-gray-600">
                    {feeList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors">
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-primary">{item.class}</td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-right text-primary font-black">{item.annualFee}</td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-right text-gray-500">{item.installment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* One-time Admission Fee Note Card */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="space-y-1">
                <span className="text-accent font-black uppercase tracking-wider text-[10px] block">New Admissions Only</span>
                <h4 className="text-xs sm:text-sm font-black text-primary uppercase">Admission Fee (One-Time)</h4>
                <p className="text-xs text-gray-500">
                  Charged only once at the time of new admission into the school.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 divide-x divide-gray-200/60 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="pl-0 md:pl-4 space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Nursery to Class V</span>
                  <p className="text-base sm:text-lg font-black text-primary">₹2,000</p>
                </div>
                <div className="pl-3 sm:pl-4 space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Class VI to XII</span>
                  <p className="text-base sm:text-lg font-black text-primary">₹4,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Bus Fee Transport Schedule */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center">
            <span className="text-accent font-black uppercase tracking-[0.3em] text-xs block">Transportation</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight flex items-center justify-center gap-3">
              <Bus className="text-accent shrink-0" size={32} />
              Bus Transport Fee Schedule
            </h2>
            <div className="h-1.5 w-20 sm:w-24 bg-accent rounded-full mx-auto" />
            <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Official bus transport charges covering over 90 destination points across the region.
            </p>
          </div>

          {/* Bus Fee Search & Table Container */}
          <div className="bg-white border border-primary/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-xl space-y-6">
            
            {/* Search Input Box */}
            <div className="relative max-w-md mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busSearch}
                onChange={(e) => setBusSearch(e.target.value)}
                placeholder="Search destination, village, or fee..."
                className="w-full pl-11 pr-10 py-3 bg-[#F8F9FC] border border-primary/15 rounded-xl text-xs sm:text-sm text-primary font-semibold placeholder-gray-400 focus:outline-none focus:border-accent transition-all shadow-inner"
              />
              {busSearch && (
                <button
                  onClick={() => setBusSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {loadingBusFees ? (
              <div className="py-12 text-center text-gray-400 font-semibold text-sm">
                Loading transport fee schedule...
              </div>
            ) : filteredBusFees.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-semibold text-sm">
                No matching destination found for &quot;{busSearch}&quot;.
              </div>
            ) : (
              <div>
                {/* Desktop Dual-Table View (lg screen: 2 tables side-by-side) */}
                <div className="hidden lg:grid grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column Table */}
                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary/5 text-[10px] font-black text-primary uppercase tracking-wider border-b border-gray-100">
                          <th className="py-3 px-4 w-16">S.No</th>
                          <th className="py-3 px-4">Place / Destination</th>
                          <th className="py-3 px-4 text-right">Bus Fee (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                        {leftBusFees.map((item) => (
                          <tr key={item.sNo} className="hover:bg-primary/5 transition-colors">
                            <td className="py-3 px-4 font-mono text-gray-400">{item.sNo}</td>
                            <td className="py-3 px-4 font-bold text-primary">{item.place}</td>
                            <td className="py-3 px-4 text-right font-black text-accent">{item.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Right Column Table */}
                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary/5 text-[10px] font-black text-primary uppercase tracking-wider border-b border-gray-100">
                          <th className="py-3 px-4 w-16">S.No</th>
                          <th className="py-3 px-4">Place / Destination</th>
                          <th className="py-3 px-4 text-right">Bus Fee (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                        {rightBusFees.map((item) => (
                          <tr key={item.sNo} className="hover:bg-primary/5 transition-colors">
                            <td className="py-3 px-4 font-mono text-gray-400">{item.sNo}</td>
                            <td className="py-3 px-4 font-bold text-primary">{item.place}</td>
                            <td className="py-3 px-4 text-right font-black text-accent">{item.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Mobile & Tablet View (Single responsive table) */}
                <div className="lg:hidden overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary/5 text-[10px] font-black text-primary uppercase tracking-wider border-b border-gray-100">
                          <th className="py-3 px-3 sm:px-4 w-12 sm:w-16">S.No</th>
                          <th className="py-3 px-3 sm:px-4">Place / Destination</th>
                          <th className="py-3 px-3 sm:px-4 text-right">Bus Fee (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-semibold text-gray-600">
                        {filteredBusFees.map((item) => (
                          <tr key={item.sNo} className="hover:bg-primary/5 transition-colors">
                            <td className="py-3 px-3 sm:px-4 font-mono text-gray-400">{item.sNo}</td>
                            <td className="py-3 px-3 sm:px-4 font-bold text-primary">{item.place}</td>
                            <td className="py-3 px-3 sm:px-4 text-right font-black text-accent">{item.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Note badge */}
            <div className="flex items-start gap-2.5 bg-accent/10 border border-accent/20 rounded-xl p-4 text-xs font-semibold text-gray-600">
              <Info size={18} className="text-accent shrink-0 mt-0.5" />
              <span>
                Bus charges are subject to operational route validation. For special pickup points or route queries, contact the school office.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Bank Details & Guidelines (Grid layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Deposit Bank Details (The Bank Card) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">Bank Transfer</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary uppercase font-montserrat tracking-tight">
                Direct Bank Deposit
              </h2>
              <div className="h-1.5 w-20 sm:w-24 bg-accent rounded-full" />
            </div>

            <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
              School fee deposits can be paid safely and directly into the school&apos;s bank account at ICICI Bank 
              using internet banking, NEFT/RTGS, or by visiting your nearest branch.
            </p>

            {/* Premium Bank Card Widget */}
            <div className="relative bg-white border border-primary/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-bl-[10rem] -z-10 group-hover:scale-105 transition-transform" />
              <div className="absolute left-10 -bottom-10 w-32 h-32 bg-accent/5 rounded-full -z-10 blur-xl" />

              <div className="flex gap-4 items-center mb-6 sm:mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-primary uppercase font-montserrat">ICICI Deposit Registry</h4>
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Official School Account</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {bankDetails.map((detail, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 sm:w-1/3">
                      {detail.label}
                    </span>
                    
                    <div className="flex items-center justify-between gap-3 bg-[#F8F9FC] border border-primary/5 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 sm:w-2/3 select-all">
                      <span className="text-xs sm:text-sm font-bold text-primary break-all leading-tight">
                        {detail.value}
                      </span>
                      <button
                        onClick={() => handleCopy(detail.value, detail.key)}
                        className="text-primary hover:text-accent shrink-0 transition-colors p-1"
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
              <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 justify-center">
                <ShieldCheck className="text-accent shrink-0" size={16} />
                <span className="uppercase tracking-wider text-[10px] sm:text-xs">Verified official banking channel</span>
              </div>
            </div>
          </div>

          {/* Right Column: Fee Details, Caution Money & Post-Payment terms */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:sticky lg:top-32">
            
            {/* Caution Money Widget */}
            <div className="bg-white border border-primary/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-3 sm:space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block">Caution Deposit</span>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                Caution Money
              </h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                A refundable Caution Money deposit of <strong className="text-primary font-bold">Rs. 1,000/-</strong> is 
                charged to new entrants upon joining. This deposit is fully refunded at the time of student withdrawal 
                subject to clearing institutional dues.
              </p>
            </div>

            {/* Fee Exclusions list */}
            <div className="bg-white border border-primary/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-4 sm:space-y-5">
              <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] block">Fee Guidelines</span>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                Total Fee Excludes:
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed -mt-2">
                The standard school tuition fee does not encompass the following supplementary components:
              </p>
              
              <div className="space-y-2.5 sm:space-y-3">
                {exclusions.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-gray-600 font-semibold text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slip Instructions Alert Card */}
            <div className="bg-gradient-to-br from-primary to-[#251f59] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-3 sm:space-y-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-10">
          {[
            { title: "Admission Guideline", slug: "/eligibility-criteria", desc: "View the required documents checklist and timeline policies." },
            { title: "Fee Policy", slug: "/fee-policy", desc: "Understand withdrawals, calendar deadlines, and refund policies." },
            { title: "Apply For Admission", slug: "/apply-for-admission", desc: "Access the interactive inquiry form for online registration." }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.slug} 
              className="bg-white border border-primary/10 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <h4 className="text-sm sm:text-base font-black text-primary uppercase font-montserrat flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform shrink-0" />
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
