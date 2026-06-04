"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingAdmissionButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after 1.5 seconds or small scrolling
    const timer = setTimeout(() => setIsVisible(true), 1500);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new Event("open-admission-modal"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Subtle glowing ring effect around the button */}
          <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-45 animate-ping pointer-events-none" />

          <button
            onClick={handleClick}
            className="relative flex items-center gap-2 bg-primary hover:bg-secondary text-white font-extrabold uppercase text-[11px] sm:text-xs tracking-wider px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-accent/20"
          >
            {/* Blinking alert circle */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>

            <Sparkles size={13} className="text-accent group-hover:rotate-12 transition-transform" />
            <span>Admissions 2026-27</span>
            <span className="hidden sm:inline bg-accent/20 text-accent text-[9px] font-black px-1.5 py-0.5 rounded-md ml-1 border border-accent/20">
              Open
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
