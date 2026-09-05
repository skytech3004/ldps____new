import Link from "next/link";
import { mergeSectionContent } from "@/lib/ui-kit";

type CtaContent = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
};

export default function CtaSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("cta-section", content) as CtaContent;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-primary to-[#2c246b] px-8 py-14 text-center text-white">
        <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">{data.title}</h2>
        {data.subtitle ? <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-white/75 md:text-base">{data.subtitle}</p> : null}
        {data.buttonLabel && data.buttonHref ? (
          <Link
            href={data.buttonHref}
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-primary hover:bg-accent-hover"
          >
            {data.buttonLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
