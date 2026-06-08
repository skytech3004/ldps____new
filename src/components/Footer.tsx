"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { schoolDatabase } from "@/data/lpsVidhyawadiDatabase";

const socialLinks = [
  { name: "Facebook", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
  { name: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
  { name: "Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> },
  { name: "Youtube", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
];

export default function Footer() {
  const [logo, setLogo] = useState("/uploads/logo/white-logo.png");

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
  }, []);

  return (
    <footer className="bg-navy text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
              <div className="w-16 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-4 border-mint/20 overflow-hidden">
                <img src={logo} alt="LPS Logo" className="object-contain w-full h-full p-2" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-black text-xl xs:text-2xl leading-[1.1] text-white uppercase max-w-[280px]">
                  LEELADEVI PARASMAL SANCHETI ENGLISH MEDIUM SR. SEC. SCHOOL
                </h3>
                <p className="text-[11px] text-mint font-bold tracking-widest uppercase mt-4 border-l-2 border-mint/50 pl-3">
                  Managed by Marudhar Mahila Shikshan Sangh Vidyawadi
                </p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, i) => (
                <Link key={i} href="#" aria-label={social.name} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mint hover:text-navy transition-all border border-white/10">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-8 text-mint uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about" },
                { label: "Academics", href: "/academics" },
                { label: "Admissions", href: "/pages/admission-procedure" },
                { label: "Facilities", href: "/facilities" },
                { label: "Student Life", href: "/gallery" },
                { label: "Admin", href: "/admin" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-white hover:translate-x-2 transition-all inline-block font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black mb-8 text-mint uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-mint shrink-0" size={20} />
                <span className="text-white/60 font-medium">{schoolDatabase.site.address.join(" ")}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-mint shrink-0" size={20} />
                <span className="text-white/60 font-medium">94141 48005</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-mint shrink-0" size={20} />
                <span className="text-white/60 font-medium">lpsvidhyawadi@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black mb-8 text-mint uppercase tracking-widest">Newsletter</h4>
            <p className="text-white/60 mb-6 font-medium">Subscribe to get the latest updates and news.</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint transition-colors"
              />
              <button className="bg-mint text-navy py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:shadow-lg transition-all">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © 2026 LPS Vidyawadi. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold text-white/40 uppercase tracking-widest">
            <Link href="#" className="hover:text-mint transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-mint transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
