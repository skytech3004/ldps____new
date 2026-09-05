import Link from "next/link";
import CmsImage from "@/components/sections/CmsImage";
import { mergeSectionContent } from "@/lib/ui-kit";

type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function HeroSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("hero", content) as HeroContent;
  const image = data.image || "/lps-vidhyawadi/gallery-01.jpg";

  return (
    <section className="relative overflow-hidden bg-[#2c246b] text-white">
      <div className="absolute inset-0">
        <CmsImage src={image} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-[#2c246b]/80 to-black/50" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        {data.eyebrow ? (
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">{data.eyebrow}</p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-white md:text-6xl">{data.title}</h1>
        {data.subtitle ? <p className="mt-5 max-w-2xl text-base font-medium text-white/80 md:text-lg">{data.subtitle}</p> : null}
        {data.ctaLabel && data.ctaHref ? (
          <Link
            href={data.ctaHref}
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-primary hover:bg-accent-hover"
          >
            {data.ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
