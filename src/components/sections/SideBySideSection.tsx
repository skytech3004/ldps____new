import CmsImage from "@/components/sections/CmsImage";
import { mergeSectionContent } from "@/lib/ui-kit";

type SideBySide = {
  title: string;
  body: string;
  image: string;
  imagePosition: string;
};

export default function SideBySideSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("side-by-side", content) as SideBySide;
  const imageOnRight = data.imagePosition === "right";

  return (
    <section className="bg-white px-6 py-16">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 ${imageOnRight ? "lg:[&>div:first-child]:order-2" : ""}`}>
        <div className="relative min-h-[280px] overflow-hidden rounded-[2rem]">
          <CmsImage src={data.image || "/lps-vidhyawadi/gallery-01.jpg"} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="mb-5 text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2>
          <p className="whitespace-pre-wrap text-base font-medium leading-relaxed text-slate-600">{data.body}</p>
        </div>
      </div>
    </section>
  );
}
