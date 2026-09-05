"use client";

import { useEffect, useState } from "react";
import { mergeSectionContent } from "@/lib/ui-kit";

type EmbedContent = {
  title: string;
  collection: string;
  year: string;
  limit: number;
};

type ResultRow = { name?: string; class?: string; stream?: string; score?: string; percent?: number };
type MemberRow = { name?: string; designation?: string };

export default function CollectionEmbedSection({ content }: { content: Record<string, unknown> }) {
  const data = mergeSectionContent("collection-embed", content) as EmbedContent;
  const [rows, setRows] = useState<Array<ResultRow & MemberRow>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      try {
        const limit = Number(data.limit) > 0 ? Number(data.limit) : 12;
        if (data.collection === "faculty") {
          const response = await fetch("/api/admin/leadership", { cache: "no-store" });
          const json = await response.json();
          if (!response.ok) throw new Error(json.error ?? "Failed to load faculty.");
          if (!cancelled) setRows((Array.isArray(json) ? json : []).slice(0, limit));
          return;
        }
        if (data.collection === "teachers") {
          const response = await fetch("/api/admin/teachers", { cache: "no-store" });
          const json = await response.json();
          if (!response.ok) throw new Error(json.error ?? "Failed to load teachers.");
          if (!cancelled) setRows((Array.isArray(json) ? json : []).slice(0, limit));
          return;
        }

        const yearQuery = data.year ? `?year=${encodeURIComponent(String(data.year))}` : "";
        const response = await fetch(`/api/admin/results${yearQuery}`, { cache: "no-store" });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error ?? "Failed to load results.");
        const toppers = Array.isArray(json?.toppers)
          ? json.toppers
          : Array.isArray(json)
            ? json.flatMap((item: { toppers?: ResultRow[] }) => item.toppers ?? [])
            : [];
        if (!cancelled) setRows(toppers.slice(0, limit));
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Collection unavailable.");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [data.collection, data.year, data.limit]);

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {data.title ? <h2 className="mb-6 text-3xl font-black uppercase tracking-tight text-primary">{data.title}</h2> : null}
        {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">{data.collection === "board-results" ? "Class / Stream" : "Role"}</th>
                <th className="px-4 py-3 font-bold">{data.collection === "board-results" ? "Score" : ""}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center font-medium text-slate-500">
                    No rows yet. Collection data lives in its own model.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={`${row.name}-${index}`} className="border-t border-primary/5 odd:bg-[#F8F9FC]">
                    <td className="px-4 py-3 font-bold text-primary">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.designation || [row.class, row.stream].filter(Boolean).join(" · ")}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.score || (row.percent != null ? `${row.percent}%` : "")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
