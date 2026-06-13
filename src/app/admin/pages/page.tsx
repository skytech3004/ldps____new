"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, X, Save, ArrowUpRight } from "lucide-react";
import { gisMenuItems } from "@/data/gisMenu";

type SectionForm = {
  title: string;
  contentText: string;
};

type PageContentRecord = {
  _id: string;
  slug: string;
  title: string;
  group?: string;
  sections: { title: string; content: string[] }[];
};

const EXCLUDED_SLUGS = [
  "leadership",
  "transport",
  "public-disclosures-cbse",
  "holiday-list",
  "downloads",
  "download-tc",
  "e-brochure",
  "magazine"
];

const moreMenuItems = gisMenuItems.filter(
  (item) =>
    (item.group === "About" || item.group === "Academics" || item.group === "Schooling" || item.group === "More") &&
    !EXCLUDED_SLUGS.includes(item.slug)
);

const initialSection: SectionForm = { title: "", contentText: "" };

function emptyRecord(slug: string, title: string) {
  const matchedMenuItem = moreMenuItems.find(m => m.slug === slug);
  return {
    slug,
    title,
    group: matchedMenuItem?.group ?? "More",
    sections: [initialSection],
  };
}

export default function AdminPagesPage() {
  const [items, setItems] = useState<PageContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(moreMenuItems[0]?.slug ?? "about-lps");
  const [formTitle, setFormTitle] = useState(moreMenuItems[0]?.title ?? "About LPS");
  const [formGroup, setFormGroup] = useState<string>(moreMenuItems[0]?.group ?? "About");
  const [formSections, setFormSections] = useState<SectionForm[]>([initialSection]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/pages", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch page content.");
      }
      setItems(data as PageContentRecord[]);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch page content.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/pages", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch page content.");
        }
        if (!cancelled) {
          setItems(data as PageContentRecord[]);
        }
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch page content.";
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedRecord = useMemo(
    () => items.find((item) => item.slug === selectedSlug),
    [items, selectedSlug]
  );

  function openCreateModal() {
    const selectedMenuItem = moreMenuItems.find((item) => item.slug === selectedSlug) ?? moreMenuItems[0];
    setEditingId(null);
    setFormTitle(selectedMenuItem?.title ?? "Page");
    setFormGroup("More");
    setFormSections([initialSection]);
    setModalOpen(true);
  }

  function openEditModal(record: PageContentRecord) {
    setEditingId(record._id);
    setSelectedSlug(record.slug);
    setFormTitle(record.title);
    setFormGroup(record.group ?? "More");
    setFormSections(
      record.sections.length > 0
        ? record.sections.map((section) => ({
            title: section.title,
            contentText: section.content.join("\n"),
          }))
        : [initialSection]
    );
    setModalOpen(true);
  }

  function updateSection(index: number, next: Partial<SectionForm>) {
    setFormSections((previous) =>
      previous.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...next } : section))
    );
  }

  function addSection() {
    setFormSections((previous) => [...previous, initialSection]);
  }

  function removeSection(index: number) {
    setFormSections((previous) => previous.filter((_, sectionIndex) => sectionIndex !== index));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        id: editingId,
        slug: selectedSlug,
        title: formTitle.trim(),
        group: formGroup.trim() || "More",
        sections: formSections
          .filter((section) => section.title.trim() || section.contentText.trim())
          .map((section) => ({
            title: section.title.trim(),
            content: section.contentText
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          })),
      };

      const response = await fetch("/api/admin/pages", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed.");
      }

      setModalOpen(false);
      setEditingId(null);
      await fetchItems();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this page content?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch("/api/admin/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Delete failed.");
      }
      await fetchItems();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Delete failed.";
      setError(message);
    }
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-navy mt-2">More Pages Manager</h1>
            <p className="text-sm text-teal mt-2">Edit the More menu pages and publish content without touching code.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-colors"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {Object.entries(
                moreMenuItems.reduce<Record<string, typeof moreMenuItems>>((groups, item) => {
                  const g = item.group + " Wing";
                  if (!groups[g]) groups[g] = [];
                  groups[g].push(item);
                  return groups;
                }, {})
              ).map(([groupName, groupItems]) => (
                <div key={groupName} className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mt-4 first:mt-0">{groupName}</p>
                  {groupItems.map((item) => {
                    const record = items.find((entry) => entry.slug === item.slug);

                    return (
                      <button
                        key={item.slug}
                        onClick={() => {
                          setSelectedSlug(item.slug);
                          setFormTitle(item.title);
                          setFormGroup(item.group);
                        }}
                        className={`w-full text-left rounded-2xl border p-4 transition-all ${
                          selectedSlug === item.slug
                            ? "border-navy bg-navy text-white shadow-lg"
                            : "border-teal/10 bg-[#f7fbf8] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-black uppercase tracking-tight text-xs md:text-sm">{item.title}</p>
                            <p className={`text-[10px] font-bold mt-1 ${selectedSlug === item.slug ? "text-white/70" : "text-teal"}`}>
                              /{item.slug}
                            </p>
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-wider ${selectedSlug === item.slug ? "text-accent" : "text-green-primary"}`}>
                            {record ? "Saved" : "New"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

          <div className="lg:col-span-8">
            {error ? <p className="mb-4 text-sm font-semibold text-error">{error}</p> : null}
            {loading ? (
              <div className="rounded-2xl border border-teal/10 bg-[#f7fbf8] p-8 text-teal font-bold">Loading page records...</div>
            ) : (
              <div className="rounded-2xl border border-teal/10 bg-[#f7fbf8] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-teal">Selected Page</p>
                    <h2 className="text-2xl font-black text-navy mt-1">{selectedRecord?.title ?? formTitle}</h2>
                    <p className="text-sm text-teal mt-1">Slug: /{selectedSlug}</p>
                  </div>
                  {selectedRecord ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(selectedRecord)}
                        className="inline-flex items-center gap-2 bg-mint/60 text-navy px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(selectedRecord._id)}
                        className="inline-flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>

                {selectedRecord ? (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecord.sections.map((section) => (
                      <article key={section.title} className="bg-white border border-teal/10 rounded-2xl p-4">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">{section.title}</p>
                        <ul className="mt-3 space-y-2 text-sm text-teal">
                          {section.content.slice(0, 3).map((line) => (
                            <li key={line} className="leading-relaxed">
                              • {line}
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-teal/20 bg-white p-8 text-center">
                    <p className="font-bold text-navy">No content saved yet for this page.</p>
                    <p className="text-sm text-teal mt-2">Create a page to start managing its sections.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <Link
            href="/more"
            className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider hover:text-teal"
          >
            <ArrowUpRight size={14} />
            Open public More page
          </Link>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-teal/10 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-teal/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-navy">{editingId ? "Edit Page Content" : "Create Page Content"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-navy">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Slug *</label>
                  <select
                    value={selectedSlug}
                    onChange={(event) => {
                      const val = event.target.value;
                      setSelectedSlug(val);
                      const matched = moreMenuItems.find(m => m.slug === val);
                      if (matched) {
                        setFormTitle(matched.title);
                        setFormGroup(matched.group);
                      }
                    }}
                    className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                  >
                    {moreMenuItems.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Title *</label>
                  <input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    required
                    className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Group</label>
                  <input
                    value={formGroup}
                    onChange={(event) => setFormGroup(event.target.value)}
                    className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-teal">Sections</label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-teal"
                  >
                    <Plus size={14} />
                    Add Section
                  </button>
                </div>

                {formSections.map((section, index) => (
                  <div key={index} className="rounded-2xl border border-teal/10 bg-[#f7fbf8] p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">Section {index + 1}</p>
                      {formSections.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="text-xs font-black uppercase tracking-wider text-error hover:text-red-700"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <input
                      value={section.title}
                      onChange={(event) => updateSection(index, { title: event.target.value })}
                      placeholder="Section title"
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                    <textarea
                      value={section.contentText}
                      onChange={(event) => updateSection(index, { contentText: event.target.value })}
                      placeholder="One line per bullet"
                      rows={5}
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold resize-y"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-teal/20 text-navy font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-navy text-white font-black hover:bg-teal disabled:opacity-70 inline-flex items-center gap-2">
                  <Save size={14} />
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
