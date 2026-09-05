import { mergeSectionContent } from "@/lib/ui-kit";

type Stat = { label: string; value: string };

export default function StatCardsSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("stat-cards", content) as { title: string; stats: Stat[] };
  const stats = Array.isArray(data.stats) ? data.stats : [];

  return (
    <section className="bg-gradient-to-b from-white to-[#F8F9FC] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {data.title ? <h2 className="mb-10 text-center text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <article
              key={`${stat.label}-${index}`}
              className="rounded-[1.75rem] bg-primary p-8 text-center text-white shadow-[0_12px_40px_rgba(61,52,139,0.15)]"
            >
              <p className="text-4xl font-black text-accent">{stat.value}</p>
              <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-white/80">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
