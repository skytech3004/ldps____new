import { Award, BookOpen, GraduationCap, Heart, Home, Sparkles, Trophy, Users, type LucideIcon } from "lucide-react";
import CmsImage from "@/components/sections/CmsImage";
import { mergeSectionContent } from "@/lib/ui-kit";

const ICONS: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Home,
  Sparkles,
  Trophy,
  Users,
};

type Card = { title: string; desc: string; icon: string; image: string };

export default function CardGridSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("card-grid", content) as { title: string; cards: Card[] };
  const cards = Array.isArray(data.cards) ? data.cards : [];

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {data.title ? <h2 className="mb-10 text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2> : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = ICONS[card.icon] ?? Sparkles;
            return (
              <article key={`${card.title}-${index}`} className="overflow-hidden rounded-3xl border border-primary/10 bg-[#F8F9FC] shadow-sm">
                {card.image ? (
                  <div className="relative h-44 w-full">
                    <CmsImage src={card.image} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="space-y-3 p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-black text-primary">{card.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">{card.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
