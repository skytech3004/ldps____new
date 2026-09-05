"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database, FileText, LogOut, Plus } from "lucide-react";
import { allCollections } from "@/lib/collections-kit";
import { SITE_PAGES } from "@/lib/site-registry";

type PageRow = {
  slug: string;
  title: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/pages", { cache: "no-store" });
    const data = await response.json();
    if (response.ok && Array.isArray(data)) setPages(data);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createPage(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not create page.");
      return;
    }
    router.push(`/admin/pages/${data.slug}`);
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const groups = [...new Set(SITE_PAGES.map((page) => page.group))];
  const collections = allCollections();

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Visual CMS</p>
          <h1 className="text-3xl font-black text-white">Website pages & tables</h1>
          <p className="mt-2 text-sm text-slate-400">Each page opens a live public preview. Tables on that page can be added and saved from the right drawer.</p>
        </div>
        <button type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold uppercase text-slate-300">
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <form onSubmit={createPage} className="grid gap-3 rounded-2xl border border-white/10 bg-[#0A0E17] p-5 md:grid-cols-[1fr_1fr_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New page title"
          className="rounded-lg border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white"
        />
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="slug-for-url"
          className="rounded-lg border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white"
        />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-black uppercase text-primary">
          <Plus size={14} />
          Create
        </button>
        {error ? <p className="text-sm font-semibold text-red-400 md:col-span-3">{error}</p> : null}
      </form>

      {groups.map((group) => (
        <div key={group} className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{group}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SITE_PAGES.filter((page) => page.group === group).map((page) => (
              <Link
                key={page.slug}
                href={`/admin/pages/${page.slug}`}
                className="rounded-2xl border border-white/10 bg-[#0A0E17] p-5 hover:border-accent/40"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">{page.title}</span>
                  <FileText size={16} className="text-accent" />
                </span>
                <span className="mt-1 block font-mono text-[11px] text-slate-500">{page.path}</span>
                {page.collections.length > 0 ? (
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {page.collections.length} table{page.collections.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {loading || pages.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Saved CMS pages</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pages
              .filter((page) => !SITE_PAGES.some((site) => site.slug === page.slug))
              .map((page) => (
                <Link
                  key={page.slug}
                  href={`/admin/pages/${page.slug}`}
                  className="rounded-2xl border border-white/10 bg-[#0A0E17] p-5 hover:border-accent/40"
                >
                  <span className="block font-black text-white">{page.title}</span>
                  <span className="text-xs font-mono text-slate-500">/{page.slug}</span>
                </Link>
              ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">All tables</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.key}
              href={`/admin/data/${collection.key}`}
              className="rounded-2xl border border-white/10 bg-[#0A0E17] p-5 hover:border-accent/40"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-black text-white">{collection.label}</span>
                <Database size={16} className="text-accent" />
              </span>
              <span className="mt-2 block text-xs text-slate-400">{collection.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
