import { mergeSectionContent } from "@/lib/ui-kit";

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] ?? "";
}

type VideoContent = {
  title: string;
  url: string;
  caption: string;
};

export default function VideoSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("video", content) as VideoContent;
  const id = youtubeId(data.url || "");

  return (
    <section className="bg-[#F8F9FC] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {data.title ? <h2 className="mb-6 text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2> : null}
        <div className="overflow-hidden rounded-[1.75rem] bg-black shadow-lg">
          {id ? (
            <iframe
              title={data.title || "Video"}
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : data.url ? (
            <video src={data.url} controls className="aspect-video w-full" />
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm font-semibold text-white/70">Add a video URL</div>
          )}
        </div>
        {data.caption ? <p className="mt-4 text-sm font-medium text-slate-500">{data.caption}</p> : null}
      </div>
    </section>
  );
}
