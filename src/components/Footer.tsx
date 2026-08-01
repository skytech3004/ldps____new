"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { schoolDatabase } from "@/data/lpsVidhyawadiDatabase";

const schoolMapUrl =
  "https://www.google.com/maps/place/Marudhar+Mahila+Shikshan+Sangh,+Vidyawadi/@25.3203814,73.2889669,982m/data=!3m2!1e3!4b1!4m6!3m5!1s0x394285c38de7bf27:0x6413b20ba55fe11d!8m2!3d25.3203814!4d73.2915418!16s%2Fg%2F11cl_4pk1_?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D";
const schoolDirectionsUrl = "https://maps.app.goo.gl/CVPUXGyTHZCyCry58";
const schoolYoutubeUrl = "https://www.youtube.com/@MMSSVIDYAWADIOFFICIAL";

function YouTubeMark({ className = "", size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.5 6.5a3.07 3.07 0 0 0-2.16-2.17C19.42 4 12 4 12 4s-7.42 0-9.34.33A3.07 3.07 0 0 0 .5 6.5 32.06 32.06 0 0 0 0 12a32.06 32.06 0 0 0 .5 5.5 3.07 3.07 0 0 0 2.16 2.17C4.58 20 12 20 12 20s7.42 0 9.34-.33a3.07 3.07 0 0 0 2.16-2.17A32.06 32.06 0 0 0 24 12a32.06 32.06 0 0 0-.5-5.5ZM9.6 15.2V8.8L15.9 12Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583590541462",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/vidyawadiofficial",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/111560973/admin/page-posts/published/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  { name: "Youtube", href: schoolYoutubeUrl, icon: <YouTubeMark /> },
];

export default function Footer() {
  const [logo, setLogo] = useState("/uploads/logo/2026-06-08T09-49-13-455Z-111rrrdd.avif");

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
          <div className="space-y-8 lg:col-span-1">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
              <div className="w-16 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-4 border-mint/20 overflow-hidden">
                <Image src={logo} alt="LPS Logo" width={64} height={96} className="object-contain w-full h-full p-2" />
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
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-mint hover:text-navy transition-all border border-white/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

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

        <div className="mb-16 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
            <div>
              <h4 className="text-lg font-black text-mint uppercase tracking-widest">Find Us</h4>
              <p className="text-white/60 font-medium mt-2">Open the campus in Google Maps or start navigation directly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={schoolDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mint px-5 py-3 text-sm font-black uppercase tracking-widest text-navy transition-transform hover:-translate-y-0.5"
              >
                Directions
              </a>
              <a
                href={schoolMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                Google Maps
              </a>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-navy/80 shadow-xl">
              <iframe
                title="Marudhar Mahila Shikshan Sangh campus map"
                src="https://www.google.com/maps?q=25.3203814,73.2915418&z=15&output=embed"
                className="h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-navy/60 p-6">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-mint">Campus Address</p>
                <p className="mt-4 text-white/70 font-medium leading-7">
                  Marudhar Mahila Shikshan Sangh, Vidyawadi
                  <br />
                  Khimel, Rani, Pali, Rajasthan
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={schoolYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-widest text-navy transition-transform hover:-translate-y-0.5"
                >
                  <YouTubeMark />
                  YouTube
                </a>
                <a
                  href="mailto:lpsvidhyawadi@gmail.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">(c) 2026 LPS Vidyawadi. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-bold text-white/40 uppercase tracking-widest">
            <Link href="#" className="hover:text-mint transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-mint transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
