import { mergeSectionContent } from "@/lib/ui-kit";

type TextContent = {
  title: string;
  body: string;
};

export default function TextContentSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("text-content", content) as TextContent;

  return (
    <section className="bg-[#F8F9FC] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {data.title ? <h2 className="mb-6 text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2> : null}
        <div className="whitespace-pre-wrap text-base font-medium leading-relaxed text-slate-600">{data.body}</div>
      </div>
    </section>
  );
}
