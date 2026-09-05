import type { ReactNode } from "react";
import CardGridSection from "@/components/sections/CardGridSection";
import CollectionEmbedSection from "@/components/sections/CollectionEmbedSection";
import CtaSection from "@/components/sections/CtaSection";
import HeroSection from "@/components/sections/HeroSection";
import SideBySideSection from "@/components/sections/SideBySideSection";
import StatCardsSection from "@/components/sections/StatCardsSection";
import TextContentSection from "@/components/sections/TextContentSection";
import VideoSection from "@/components/sections/VideoSection";
import type { CmsSection } from "@/lib/cms-types";
import { mergeSectionContent } from "@/lib/ui-kit";

const SECTION_MAP: Record<string, (props: { content: Record<string, unknown> }) => ReactNode> = {
  hero: HeroSection,
  "text-content": TextContentSection,
  "card-grid": CardGridSection,
  "stat-cards": StatCardsSection,
  "side-by-side": SideBySideSection,
  "cta-section": CtaSection,
  video: VideoSection,
  "collection-embed": CollectionEmbedSection,
};

export function RenderSection({ section }: { section: CmsSection }) {
  if (section.isVisible === false) return null;
  const Component = SECTION_MAP[section.type] ?? TextContentSection;
  const content = mergeSectionContent(section.type, section.content);
  return <Component content={content} />;
}

export default function SectionRenderer({ sections }: { sections: CmsSection[] }) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);
  return (
    <div className="bg-[#F8F9FC]">
      {ordered.map((section) => (
        <RenderSection key={section.id} section={section} />
      ))}
    </div>
  );
}
