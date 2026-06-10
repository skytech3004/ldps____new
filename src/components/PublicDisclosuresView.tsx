"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, ShieldAlert, Award, School, Users } from "lucide-react";

interface DocumentLink {
  _id?: string;
  title: string;
  pdfUrl: string;
}

const STATIC_DOCUMENTS: DocumentLink[] = [
  { title: "Extension of Affiliation Letter (CBSE)", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "Society/Trust Registration Certificate", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "No Objection Certificate (NOC)", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "Recognition Certificate under RTE Act, 2009", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "Building Safety Certificate (National Building Code)", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "Fire Safety Certificate (State Fire Service)", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "DEO Certificate for Affiliation Self-Declaration", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
  { title: "Water, Health and Sanitation Certificates", pdfUrl: "/uploads/documents/sample-magazine.pdf" },
];

export default function PublicDisclosuresView() {
  const [activeSection, setActiveSection] = useState<"general" | "documents" | "staff">("general");
  const [documents, setDocuments] = useState<DocumentLink[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/admin/disclosures", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setDocuments(data);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch disclosures:", error);
      }
      setDocuments(STATIC_DOCUMENTS);
    }
    fetchDocuments();
  }, []);

  return (
    <div className="space-y-8">
      {/* Sections Tab Navigation */}
      <div className="flex flex-wrap border-b border-slate-100 pb-px gap-2">
        <button
          onClick={() => setActiveSection("general")}
          className={`pb-4 px-6 font-black text-sm uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSection === "general"
              ? "border-[#3D348B] text-[#3D348B]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <School size={16} />
            General Information
          </span>
        </button>
        <button
          onClick={() => setActiveSection("documents")}
          className={`pb-4 px-6 font-black text-sm uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSection === "documents"
              ? "border-[#3D348B] text-[#3D348B]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={16} />
            Documents & Certificates
          </span>
        </button>
        <button
          onClick={() => setActiveSection("staff")}
          className={`pb-4 px-6 font-black text-sm uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSection === "staff"
              ? "border-[#3D348B] text-[#3D348B]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users size={16} />
            Staffing details
          </span>
        </button>
      </div>

      {/* Section Content */}
      {activeSection === "general" ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award size={20} className="text-accent" />
            CBSE Mandated School Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Affiliation Number</p>
                <p className="text-sm font-extrabold text-primary">1730076 (Official CBSE record)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">School Code</p>
                <p className="text-sm font-extrabold text-primary">10423</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Principal Qualification</p>
                <p className="text-sm font-extrabold text-primary">M.A., B.Ed, M.Phil</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complete Address</p>
                <p className="text-sm font-extrabold text-primary">MMSS Vidyawadi Campus, Rani Station (Pali), Rajasthan</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Contact</p>
                <p className="text-sm font-extrabold text-primary">lpsvidhyawadi@gmail.com</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Number</p>
                <p className="text-sm font-extrabold text-primary">02933-240005, 94141 48005</p>
              </div>
            </div>
          </div>
        </div>
      ) : activeSection === "documents" ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert size={20} className="text-accent" />
            Compliance Documents and Certificates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#7678ED]/30 rounded-2xl transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 truncate">{doc.title}</p>
                </div>
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 bg-white border border-slate-200 text-slate-500 hover:text-primary rounded-lg shadow-sm hover:shadow transition-all group-hover:border-[#7678ED]/30"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users size={20} className="text-accent" />
            Staffing and Academic Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-2xl font-black text-primary">32</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Teachers</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-2xl font-black text-primary">1 : 25</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Teacher Student Ratio</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-2xl font-black text-primary">Yes</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Special Educator Attendant</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
