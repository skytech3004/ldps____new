"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, RefreshCw, ArrowLeft,Save, Trash2, Layers, MousePointerClick } from "lucide-react";
import CollectionTableEditor from "@/components/admin/CollectionTableEditor";
import SchemaForm from "@/components/admin/SchemaForm";
import type { CmsPage, CmsSection } from "@/lib/cms-types";
import { collectionsForPage, publicPathFor } from "@/lib/site-registry";
import { createSection, getKitEntry, UI_KIT } from "@/lib/ui-kit";
// const router = useRouter();


type EditorProps = {
  slug: string;
};

export default function PageBuilderEditor({ slug }: EditorProps) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const publicPath = publicPathFor(slug);
  const linkedCollections = collectionsForPage(slug);
  const [page, setPage] = useState<CmsPage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [tab, setTab] = useState<"layout" | "data">(collectionsForPage(slug).length > 0 ? "data" : "layout");
  const [previewTick, setPreviewTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/pages/${slug}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Failed to load page.");
        if (!cancelled) {
          setPage(data as CmsPage);
          setSelectedId(data.sections?.[0]?.id ?? null);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Failed to load page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Listen for click messages originating inside the public preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "CMS_SECTION_CLICKED") {
        const { sectionId, sectionIndex, title } = event.data;
        setTab("layout");
        if (sectionId && page?.sections.some((s) => s.id === sectionId)) {
          setSelectedId(sectionId);
        } else if (typeof sectionIndex === "number" && page?.sections && page.sections[sectionIndex]) {
          setSelectedId(page.sections[sectionIndex].id);
        }
        setStatus(`Selected section "${title || "Page Section"}" from live preview.`);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [page]);

  const selected = useMemo(
    () => page?.sections.find((section) => section.id === selectedId) ?? null,
    [page, selectedId]
  );

  function updateSections(updater: (sections: CmsSection[]) => CmsSection[]) {
    setPage((current) => {
      if (!current) return current;
      return { ...current, sections: updater(current.sections).map((section, index) => ({ ...section, order: index })) };
    });
  }

  function selectAndScrollToSection(id: string, index: number) {
    setSelectedId(id);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "CMS_SELECT_SECTION",
          sectionId: id,
          sectionIndex: index,
        },
        "*"
      );
    }
  }

  function reloadPreview() {
    setPreviewTick((value) => value + 1);
  }

  async function save() {
    if (!page) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed.");
      setPage(data as CmsPage);
      setStatus("Published. Public path revalidated.");
      reloadPreview();
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !page) {
    return <div className="flex h-screen items-center justify-center text-sm font-bold uppercase tracking-widest text-slate-500">Loading editor…</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#F4F5F8] text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <Link href="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:underline">
            All pages
          </Link>
          <input
            value={page.title}
            onChange={(event) => setPage({ ...page, title: event.target.value })}
            className="w-full max-w-md bg-transparent text-lg font-black text-primary outline-none"
          />
          <p className="text-[11px] font-mono text-slate-400">{publicPath}</p>
        </div>
        <div className="flex items-center gap-2">

<button
  type="button"
  onClick={() => router.back()}
  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold uppercase"
>
  <ArrowLeft size={14} />
  Back
</button>
          <button type="button" onClick={reloadPreview} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold uppercase">
            <RefreshCw size={14} />
            Reload
          </button>
          <Link href={publicPath} target="_blank" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold uppercase">
            View public
          </Link>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold uppercase text-primary"
          >
            <Plus size={14} />
            Add section
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase text-white disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save layout"}
          </button>
        </div>
      </header>

      {(error || status) && (
        <div className={`px-4 py-2 text-xs font-semibold ${error ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {error || status}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Public Live Page Preview Panel */}
        <div className="relative min-w-0 flex-1 bg-white">
          <iframe
            ref={iframeRef}
            key={previewTick}
            title="Live public page"
            src={`${publicPath}${publicPath.includes("?") ? "&" : "?"}adminPreview=${previewTick}`}
            className="h-full w-full border-0 bg-white"
          />
        </div>

        {/* Sidebar Controls Panel */}
        <aside className="flex w-full max-w-md flex-col border-l border-slate-200 bg-white">
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setTab("data")}
              className={`flex-1 px-3 py-3 text-xs font-black uppercase ${tab === "data" ? "border-b-2 border-accent text-primary" : "text-slate-400"}`}
            >
              Tables
            </button>
            <button
              type="button"
              onClick={() => setTab("layout")}
              className={`flex-1 px-3 py-3 text-xs font-black uppercase ${tab === "layout" ? "border-b-2 border-accent text-primary" : "text-slate-400"}`}
            >
              Layout ({page.sections.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {tab === "data" ? (
              <div className="space-y-8">
                {linkedCollections.length === 0 ? (
                  <p className="text-sm text-slate-500">This page has no extra tables. Use Layout to add or edit sections, then save.</p>
                ) : (
                  linkedCollections.map((collection) => (
                    <CollectionTableEditor key={collection.key} def={collection} onSaved={reloadPreview} />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Section List Navigator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Layers size={14} className="text-accent" />
                      Page Sections ({page.sections.length})
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <MousePointerClick size={12} />
                      Click section to locate
                    </span>
                  </div>

                  <div className="space-y-2">
                    {page.sections.map((sec, idx) => {
                      const isSelected = sec.id === selectedId;
                      const kit = getKitEntry(sec.type);
                      const titleText =
                        (sec.content as any)?.eyebrow ||
                        (sec.content as any)?.badge ||
                        (sec.content as any)?.title ||
                        (sec.content as any)?.heading ||
                        kit.label;

                      return (
                        <div
                          key={sec.id}
                          onClick={() => selectAndScrollToSection(sec.id, idx)}
                          className={`group cursor-pointer rounded-xl border p-3.5 transition-all ${
                            isSelected
                              ? "border-accent bg-accent/5 ring-2 ring-accent/30 shadow-sm"
                              : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                                isSelected ? "bg-accent text-primary" : "bg-slate-100 text-slate-600"
                              }`}>
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="truncate text-xs font-black text-primary uppercase font-montserrat">{titleText}</h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kit.label}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                title="Move Up"
                                onClick={() => updateSections((sections) => move(sections, idx, -1))}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                title="Move Down"
                                onClick={() => updateSections((sections) => move(sections, idx, 1))}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                type="button"
                                title={sec.isVisible === false ? "Show section" : "Hide section"}
                                onClick={() =>
                                  updateSections((sections) =>
                                    sections.map((item) => (item.id === sec.id ? { ...item, isVisible: !item.isVisible } : item))
                                  )
                                }
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              >
                                {sec.isVisible === false ? <EyeOff size={14} className="text-red-400" /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Section Editor Form */}
                {selected ? (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Editing Section</p>
                        <h2 className="text-base font-black text-primary uppercase font-montserrat">{getKitEntry(selected.type).label}</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateSections((sections) => sections.filter((section) => section.id !== selected.id));
                          setSelectedId(page.sections.find((section) => section.id !== selected.id)?.id ?? null);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase text-red-500 hover:underline"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>

                    <SchemaForm
                      schema={getKitEntry(selected.type).schema}
                      value={selected.content}
                      onChange={(content) =>
                        updateSections((sections) =>
                          sections.map((section) => (section.id === selected.id ? { ...section, content } : section))
                        )
                      }
                    />
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-500 text-center py-4">Click any section card above to edit its content.</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-black text-primary uppercase font-montserrat">Add section</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(UI_KIT).map(([type, kit]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    const section = createSection(type, page.sections.length);
                    updateSections((sections) => [...sections, section]);
                    setSelectedId(section.id);
                    setTab("layout");
                    setPickerOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 p-4 text-left hover:border-primary hover:bg-slate-50/50"
                >
                  <span className="block text-sm font-black text-primary font-montserrat uppercase">{kit.label}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{type}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPickerOpen(false)} className="mt-4 text-xs font-bold uppercase text-slate-500 hover:underline">
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function move(sections: CmsSection[], index: number, delta: number) {
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= sections.length) return sections;
  const next = [...sections];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}
