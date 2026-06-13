"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone, Mail, CreditCard, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { schoolDatabase } from "@/data/lpsVidhyawadiDatabase";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about-lps",
    dropdown: [
      { label: "About LPS", href: "/about-lps" },
      { label: "Leadership Team", href: "/leadership" },
      { label: "Principal's Desk", href: "/principals-desk" },
      { label: "Managing Committee", href: "/managing-committee" },
    ],
  },
  {
    name: "Academics",
    href: "/scholastic",
    dropdown: [
      { label: "Scholastic", href: "/scholastic" },
      { label: "Co-Scholastic", href: "/co-scholastic" },
      { label: "Sports", href: "/sports" },
      { label: "Result 2024-25", href: "/result-2024-25" },
      { label: "Result 2023-24", href: "/result-2023-24" },
      { label: "School Planner", href: "/school-planner" },
      { label: "Eligibility Criteria", href: "/eligibility-criteria" },
      { label: "Fee Structure", href: "/fee-structure" },
      { label: "Fee Policy", href: "/fee-policy" },
      { label: "Apply For Admission", href: "/apply-for-admission" },
      { label: "Downloads", href: "/downloads" },
      { label: "Download TC", href: "/download-tc" },
    ],
  },
  {
    name: "Schooling",
    href: "/pre-primary",
    dropdown: [
      { label: "Pre-Primary", href: "/pre-primary" },
      { label: "Day Schooling", href: "/day-schooling" },
      { label: "Hostel", href: "/hostel" },
      { label: "Hostel Care", href: "/hostel-care" },
      { label: "Meals", href: "/meals" },
      { label: "A Day at School", href: "/a-day-at-school" },
      { label: "Items Required By Boarders", href: "/items-required-by-boarders" },
    ],
  },
  {
    name: "Gallery",
    href: "/photo-gallery",
    dropdown: [
      { label: "Photo Gallery", href: "/photo-gallery" },
      { label: "Video Gallery", href: "/video-gallery" },
    ],
  },
  {
    name: "More",
    href: "/",
    dropdown: [
      { label: "Magazine", href: "/magazine" },
      { label: "News", href: "/news" },
      { label: "Transport", href: "/transport" },
      { label: "Public Disclosures", href: "/public-disclosures-cbse" },
      { label: "G.R. Mechanism", href: "/g-r-mechanism" },
      { label: "Holiday List", href: "/holiday-list" },
      { label: "Announcements", href: "/announcements" },
    ],
  },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState("/lps-vidhyawadi/logo.jpg");
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});

  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/admin/brand?key=logo");
        if (res.ok) {
          const data = await res.json();
          if (data.value) setLogo(data.value);
        }
      } catch (err) {
        console.error("Failed to fetch logo:", err);
      }
    }
    fetchLogo();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-t-[3px] border-primary">
      <div className="bg-primary text-white py-2 hidden md:block border-b border-white/10">
        <div className="w-full px-6 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-accent" />
              <span className="font-medium">94141 48005</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-accent" />
              <span className="font-medium">lpsvidhyawadi@gmail.com</span>
            </div>
          </div>
          <div className="font-bold text-accent uppercase tracking-[0.15em] text-[11px]">
            {schoolDatabase.site.affiliation}
          </div>
        </div>
      </div>

      <nav
        className={cn(
          "bg-white transition-all duration-300 flex items-center",
          scrolled
            ? "shadow-lg h-16 md:h-20"
            : "shadow-sm h-20 md:h-24"
        )}
      >
        <div className="w-full flex items-center justify-between px-4 sm:px-6 h-full gap-2 md:gap-4">
          <div className="flex items-center min-w-0 gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative shrink-0 pt-6">
                <Image
                  src={logo}
                  alt="Vidyawadi Logo"
                  width={128}
                  height={160}
                  className="
                    object-contain
                    w-16 h-20 pt-6
                    sm:w-20 sm:h-24
                    md:w-24 md:h-32
                    lg:w-28 lg:h-36
                    xl:w-32 xl:h-40
                    drop-shadow-xl
                  "
                  priority
                />
              </div>

              <div className="flex flex-col min-w-0">
                <h1 className="font-black text-[#3D348B] leading-[1.1] uppercase tracking-tight text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[200px]
                  xs:max-w-[250px] sm:max-w-[300px] md:max-w-[400px]">
                  <span className="block">LEELADEVI PARASMAL SANCHETI ENGLISH MEDIUM SR. SEC. SCHOOL</span>
                </h1>

                <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] text-primary/70 font-bold tracking-wider uppercase mt-0.5">Managed by Marudhar Mahila Shikshan Sangh Vidyawadi</span>
              </div>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6 px-4">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-2">
                <Link
                  href={link.href}
                  className="font-bold text-primary/80 hover:text-primary transition-all flex items-center gap-1.5 uppercase text-[12px] tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full whitespace-nowrap"
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform duration-300 opacity-60"
                    />
                  )}
                </Link>

                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
                    <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-xl p-3 min-w-[220px] border border-gray-100/50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/fee-structure"
                className="bg-accent text-primary font-extrabold text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-accent-hover hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_12px_rgba(247,184,1,0.25)] hover:shadow-[0_6px_16px_rgba(247,184,1,0.35)] whitespace-nowrap"
              >
                Fee Payment
              </Link>

              <button
                onClick={() => window.dispatchEvent(new Event("open-admission-modal"))}
                className="bg-accent text-primary font-extrabold text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-accent-hover hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_12px_rgba(247,184,1,0.25)] hover:shadow-[0_6px_16px_rgba(247,184,1,0.35)] whitespace-nowrap"
              >
                <span className="xs:hidden">Admission</span>
                <span className="hidden xs:inline">Admission Query</span>
              </button>
            </div>

            <button
              className="xl:hidden flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 border border-gray-200 rounded-lg text-primary hover:bg-primary/5 transition-all shrink-0 ml-0.5 xs:ml-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-primary/40 xl:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
              className="ml-auto h-full w-[88%] max-w-sm bg-white pt-6 px-6 pb-8 overflow-y-auto shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Menu</p>
                  <p className="text-xs font-bold text-primary mt-1">Navigation</p>
                </div>
                <button
                  className="p-2.5 rounded-full text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Buttons at the top of Drawer on Mobile */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  href="/fee-structure"
                  className="bg-gradient-to-r from-primary to-[#2c246b] text-white py-3 px-2 rounded-xl font-extrabold text-[10px] uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md shadow-primary/20 text-center flex items-center justify-center gap-1.5 min-h-[46px] border border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard size={12} className="text-accent" />
                  Fee Payment
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event("open-admission-modal"));
                  }}
                  className="bg-gradient-to-r from-accent to-[#e5ab00] text-primary py-3 px-2 rounded-xl font-extrabold text-[10px] uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md shadow-accent/20 text-center flex items-center justify-center gap-1.5 min-h-[46px] border border-accent/20"
                >
                  <UserPlus size={12} />
                  Admission Query
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="group">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      {link.dropdown ? (
                        <button
                          onClick={() => toggleMobileDropdown(link.name)}
                          className="text-lg font-bold text-primary flex-1 text-left flex items-center justify-between w-full focus:outline-none"
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            size={18}
                            className={cn(
                              "text-primary/40 transition-transform duration-300",
                              openMobileDropdowns[link.name] ? "rotate-180" : ""
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-lg font-bold text-primary flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {link.dropdown && openMobileDropdowns[link.name] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="my-2 flex flex-col gap-1 pl-4 border-l-2 border-accent/30 overflow-hidden"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="py-2 text-[14px] font-medium text-gray-500 hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
