"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import CollectionTableEditor from "@/components/admin/CollectionTableEditor";
import { getCollection } from "@/lib/collections-kit";

export default function AdminCollectionPage() {
  const params = useParams<{ collection: string }>();
  const def = getCollection(String(params.collection ?? ""));

  if (!def) {
    return (
      <section className="px-6 py-10 text-white">
        <p>Unknown table.</p>
        <Link href="/admin" className="text-accent">Back</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-10 text-slate-900">
      <div className="rounded-2xl bg-white p-6">
        <Link href="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          All pages
        </Link>
        <h1 className="mt-2 text-2xl font-black text-primary">{def.label}</h1>
        <p className="mb-6 text-sm text-slate-500">{def.description}</p>
        <CollectionTableEditor def={def} />
      </div>
    </section>
  );
}
