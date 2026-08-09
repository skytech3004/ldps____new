"use client";

import Image from "next/image";
import Link from "next/link";
import { Quote, Sparkles, Award, ArrowLeft } from "lucide-react";

type MessageDeskLayoutProps = {
  breadcrumbLabel: string;
  pageTitle: string;
  subtitle: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
  backHref?: string;
  backLabel?: string;
};

export default function MessageDeskLayout({
  breadcrumbLabel,
  pageTitle,
  subtitle,
  portraitImage,
  personName,
  personDesignation,
  content,
  backHref = "/about/management",
  backLabel = "Back to Management",
}: MessageDeskLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">
              Home
            </Link>
            <span>/</span>
            <span>About</span>
            <span>/</span>
            <span className="text-white/80">{breadcrumbLabel}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            {pageTitle}
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-xl">{subtitle}</p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="relative bg-white border border-primary/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-md border-4 border-white bg-gray-100 mb-6">
                {portraitImage ? (
                  <Image
                    src={portraitImage}
                    alt={personName || pageTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
                )}
              </div>

              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 px-4.5 py-1 rounded-full text-accent-hover font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>Leadership Message</span>
                </div>
                {personName ? (
                  <h3 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat tracking-tight mt-2">
                    {personName}
                  </h3>
                ) : null}
                {personDesignation ? (
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] md:text-xs">
                    {personDesignation}
                  </p>
                ) : null}
              </div>
            </div>

            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-extrabold uppercase text-xs tracking-wider transition-colors ml-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>{backLabel}</span>
            </Link>
          </div>

          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-8 leading-relaxed">
            <div className="relative bg-[#F8F9FC] border-l-4 border-secondary rounded-r-2xl p-6 md:p-8">
              <Quote className="text-secondary/20 absolute -top-3 right-6" size={54} />
              <p className="text-primary font-serif italic text-lg md:text-xl font-bold leading-relaxed relative z-10">
                A message from our leadership team.
              </p>
            </div>

            <div
              className="about-message-content text-gray-600 font-medium text-sm md:text-base space-y-6 [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-primary [&_blockquote]:font-bold [&_p]:leading-relaxed [&_strong]:text-primary"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {(personName || personDesignation) && (
              <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
                <div className="space-y-1">
                  {personDesignation ? (
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">{personDesignation}</p>
                  ) : null}
                  {personName ? (
                    <p className="text-xl font-black text-primary font-montserrat uppercase tracking-tight">{personName}</p>
                  ) : null}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/30 rotate-12 hidden xs:flex">
                  <Award size={36} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
