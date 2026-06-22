"use client";

import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Loader2 } from "lucide-react";

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
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function checkPdfExistence() {
      if (!pdfUrl || pdfUrl.trim() === "") {
        if (isMounted) {
          setError("PDF URL is missing.");
          setIsValid(false);
          setIsVerifying(false);
        }
        return;
      }

      // Basic client-side URL validation
      try {
        const isRelative = pdfUrl.startsWith("/") || pdfUrl.startsWith("./") || pdfUrl.startsWith("../");
        if (!isRelative) {
          new URL(pdfUrl); // Will throw if invalid absolute URL
        }
      } catch {
        if (isMounted) {
          setError("Invalid PDF URL configuration.");
          setIsValid(false);
          setIsVerifying(false);
        }
        return;
      }

      // Check if the file is actually available on the server
      try {
        let response = await fetch(pdfUrl, { method: "HEAD" });
        if (response.status === 405) {
          // Fallback to GET if HEAD is not allowed
          response = await fetch(pdfUrl, { method: "GET" });
        }
        
        if (response.ok) {
          if (isMounted) {
            setIsValid(true);
            setError(null);
          }
        } else {
          throw new Error("File not found");
        }
      } catch (err) {
        if (isMounted) {
          setError("The PDF file is missing or unavailable on the server.");
          setIsValid(false);
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    setIsVerifying(true);
    setError(null);
    checkPdfExistence();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  if (isVerifying) {
    return (
      <div className="inline-flex flex-col gap-2 w-full sm:w-auto">
        <button
          disabled
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#3D348B]/50 text-white/70 font-black text-xs uppercase tracking-widest rounded-xl shadow-md cursor-not-allowed select-none ${className}`}
        >
          <Loader2 size={16} className="animate-spin shrink-0" />
          <span>Verifying PDF...</span>
        </button>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="inline-flex flex-col gap-2 w-full sm:w-auto">
        <button
          disabled
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-red-100 text-red-500 font-black text-xs uppercase tracking-widest rounded-xl border border-red-200 cursor-not-allowed select-none ${className}`}
        >
          <FileText size={16} className="shrink-0" />
          <span>Unavailable</span>
        </button>
        {error && (
          <div className="text-[11px] text-red-500 font-bold flex items-start gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-100 max-w-sm">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Render native link when valid to ensure native tab viewing without popup blocks
  return (
    <div className="inline-flex flex-col gap-2 w-full sm:w-auto">
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#3D348B] text-white hover:bg-[#7678ED] font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 active:scale-95 select-none hover:scale-[1.02] ${className}`}
      >
        <FileText size={16} className="shrink-0" />
        <span>{buttonText}</span>
      </a>
    </div>
  );
}
