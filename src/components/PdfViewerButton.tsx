"use client";

import React, { useState } from "react";
import { AlertCircle, FileText } from "lucide-react";

interface PdfViewerButtonProps {
  pdfUrl: string;
  buttonText: string;
  className?: string;
}

export default function PdfViewerButton({
  pdfUrl,
  buttonText,
  className = "",
}: PdfViewerButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const handleOpenPdf = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError(null);

    if (!pdfUrl || pdfUrl.trim() === "") {
      setError("PDF URL is missing.");
      return;
    }

    // Basic URL validation
    try {
      const isRelative = pdfUrl.startsWith("/") || pdfUrl.startsWith("./") || pdfUrl.startsWith("../");
      if (!isRelative) {
        new URL(pdfUrl); // Will throw if invalid absolute URL
      }
    } catch {
      setError("Invalid PDF URL configuration.");
      return;
    }

    // Attempt to open the PDF in a new tab
    const newWindow = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      setError("Popup blocked! Please allow popups to open the PDF.");
    }
  };

  return (
    <div className="inline-flex flex-col gap-1.5 items-start">
      <button
        onClick={handleOpenPdf}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3D348B] text-white hover:bg-[#7678ED] font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${className}`}
      >
        <FileText size={16} />
        <span>{buttonText}</span>
      </button>
      {error && (
        <span className="text-[11px] text-red-500 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-100">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
}
