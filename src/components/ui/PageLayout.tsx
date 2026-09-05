"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface PageLayoutProps {
  groupName?: string;
  pageTitle: string;
  subtitle?: string;
  heroImage?: string;
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageSectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={`space-y-3 ${centered ? "text-center" : "text-left"}`}>
      {badge ? (
        <span className="text-accent font-black uppercase tracking-[0.35em] text-xs block">
          {badge}
        </span>
      ) : null}
      <h2 className="text-3xl md:text-5xl font-black text-primary uppercase font-montserrat tracking-tight">
        {title}
      </h2>
      <div className={`h-1.5 w-24 bg-accent rounded-full ${centered ? "mx-auto" : ""}`} />
      {subtitle ? (
        <p className={`text-gray-500 font-medium text-xs md:text-sm max-w-xl ${centered ? "mx-auto" : ""} pt-2 leading-relaxed`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function PageLayout({
  groupName = "Academics",
  pageTitle,
  subtitle,
  children,
  breadcrumbs,
}: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased">
      <Navbar />

      {/* Standardized Hero Banner Section */}
      <section className="relative pt-36 pb-14 md:pt-44 md:pb-20 px-6 bg-gradient-to-br from-primary via-[#2a225e] to-[#3D348B] text-white overflow-hidden shadow-md">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-3 text-left">
          {/* Breadcrumb Trail */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">
              Home
            </Link>
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span>/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:underline hover:text-white transition-all">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/80">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <span>/</span>
                <span>{groupName}</span>
                <span>/</span>
                <span className="text-white/80">{pageTitle}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-montserrat uppercase tracking-tight text-accent">
            {pageTitle}
          </h1>

          {subtitle ? (
            <p className="text-white/75 font-medium text-xs md:text-base max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* Main Page Container */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto space-y-16">
        {children}
      </section>

      <Footer />
    </main>
  );
}
