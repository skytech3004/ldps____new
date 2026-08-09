"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";
import { aboutPageDefaults, type AboutPageSlug, type ManagementMember } from "@/data/aboutPages";

type AboutPageRecord = {
  slug: AboutPageSlug;
  pageTitle: string;
  bannerImage: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
  members: ManagementMember[];
};

const PAGE_OPTIONS: { slug: AboutPageSlug; label: string }[] = [
  { slug: "management", label: "Management Committee" },
  { slug: "management-message", label: "President's Message" },
  { slug: "ceo-message", label: "CEO's Message" },
];

export default function AdminAboutPagesPage() {
  const [selectedSlug, setSelectedSlug] = useState<AboutPageSlug>("management");
  const [form, setForm] = useState<AboutPageRecord>(aboutPageDefaults.management);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"banner" | "portrait" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/about-pages?slug=${selectedSlug}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch page content.");
        }
        if (!cancelled) {
          setForm({
            slug: selectedSlug,
            pageTitle: data.pageTitle ?? aboutPageDefaults[selectedSlug].pageTitle,
            bannerImage: data.bannerImage ?? aboutPageDefaults[selectedSlug].bannerImage,
            portraitImage: data.portraitImage ?? aboutPageDefaults[selectedSlug].portraitImage,
            personName: data.personName ?? aboutPageDefaults[selectedSlug].personName,
            personDesignation: data.personDesignation ?? aboutPageDefaults[selectedSlug].personDesignation,
            content: data.content ?? aboutPageDefaults[selectedSlug].content,
            members: Array.isArray(data.members) ? data.members : aboutPageDefaults[selectedSlug].members,
          });
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
  }, [selectedSlug]);

  async function uploadImage(file: File, kind: "banner" | "portrait") {
    setUploading(kind);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("page", "about");
      formData.set("section", "about");
      formData.set("title", `${selectedSlug}-${kind}`);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      const src = String(data.upload.src ?? "");
      if (kind === "banner") {
        setForm((previous) => ({ ...previous, bannerImage: src }));
      } else {
        setForm((previous) => ({ ...previous, portraitImage: src }));
      }
    } finally {
      setUploading(null);
    }
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/admin/about-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: selectedSlug }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed.");
      }
      setForm({
        slug: selectedSlug,
        pageTitle: data.pageTitle ?? form.pageTitle,
        bannerImage: data.bannerImage ?? form.bannerImage,
        portraitImage: data.portraitImage ?? form.portraitImage,
        personName: data.personName ?? form.personName,
        personDesignation: data.personDesignation ?? form.personDesignation,
        content: data.content ?? form.content,
        members: Array.isArray(data.members) ? data.members : form.members,
      });
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const isMessagePage = selectedSlug !== "management";

  function updateMember(index: number, field: keyof ManagementMember, value: string | number) {
    setForm((previous) => ({
      ...previous,
      members: previous.members.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      ),
    }));
  }

  function addMember() {
    setForm((previous) => ({
      ...previous,
      members: [
        ...previous.members,
        { name: "", designation: "", sortOrder: previous.members.length + 1 },
      ],
    }));
  }

  function removeMember(index: number) {
    setForm((previous) => ({
      ...previous,
      members: previous.members.filter((_, memberIndex) => memberIndex !== index),
    }));
  }

  return (
    <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">Admin</p>
          <h1 className="text-3xl md:text-4xl font-black text-navy mt-2">About Pages</h1>
          <p className="text-sm text-teal mt-2">Edit management and leadership message pages with images and rich text.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PAGE_OPTIONS.map((option) => (
            <button
              key={option.slug}
              type="button"
              onClick={() => setSelectedSlug(option.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                selectedSlug === option.slug
                  ? "bg-navy text-white"
                  : "bg-mint/30 text-navy hover:bg-mint/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSave} className="p-6 md:p-8 space-y-6">
        {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-teal/70 font-semibold">Loading page content...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Page Title</label>
                <input
                  value={form.pageTitle}
                  onChange={(event) => setForm((previous) => ({ ...previous, pageTitle: event.target.value }))}
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>
              {isMessagePage ? (
                <>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Person Name</label>
                    <input
                      value={form.personName}
                      onChange={(event) => setForm((previous) => ({ ...previous, personName: event.target.value }))}
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Designation</label>
                    <input
                      value={form.personDesignation}
                      onChange={(event) =>
                        setForm((previous) => ({ ...previous, personDesignation: event.target.value }))
                      }
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                  </div>
                </>
              ) : null}
            </div>

            {!isMessagePage ? (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Banner Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-teal/20 rounded-xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center bg-[#f7fbf8]/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, "banner");
                      }}
                    />
                    {uploading === "banner" ? (
                      <Loader2 className="animate-spin text-teal mb-3" size={28} />
                    ) : (
                      <Upload className="text-teal/40 mb-3" size={28} />
                    )}
                    <p className="text-sm font-bold text-navy">Upload banner image</p>
                  </label>
                  <div className="space-y-3">
                    <input
                      value={form.bannerImage}
                      onChange={(event) => setForm((previous) => ({ ...previous, bannerImage: event.target.value }))}
                      placeholder="Or paste banner image URL"
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                    {form.bannerImage ? (
                      <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden border border-teal/10">
                        <Image src={form.bannerImage} alt="Banner preview" fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Portrait Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-teal/20 rounded-xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center bg-[#f7fbf8]/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, "portrait");
                      }}
                    />
                    {uploading === "portrait" ? (
                      <Loader2 className="animate-spin text-teal mb-3" size={28} />
                    ) : (
                      <Upload className="text-teal/40 mb-3" size={28} />
                    )}
                    <p className="text-sm font-bold text-navy">Upload portrait image</p>
                  </label>
                  <div className="space-y-3">
                    <input
                      value={form.portraitImage}
                      onChange={(event) => setForm((previous) => ({ ...previous, portraitImage: event.target.value }))}
                      placeholder="Or paste portrait image URL"
                      className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                    />
                    {form.portraitImage ? (
                      <div className="relative w-full aspect-[4/5] max-w-xs rounded-xl overflow-hidden border border-teal/10">
                        <Image src={form.portraitImage} alt="Portrait preview" fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {!isMessagePage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-black uppercase tracking-wider text-teal">Office Bearers Table</label>
                  <button
                    type="button"
                    onClick={addMember}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-mint/40 text-navy font-bold hover:bg-mint text-xs uppercase tracking-wider"
                  >
                    <Plus size={14} />
                    Add Member
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-teal/10">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-teal/70 border-b border-teal/10">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Sort</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.members.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-5 px-4 text-teal/70">
                            No members added yet.
                          </td>
                        </tr>
                      ) : (
                        form.members.map((member, index) => (
                          <tr key={index} className="border-b border-teal/10 align-top">
                            <td className="py-3 px-4">
                              <input
                                value={member.name}
                                onChange={(event) => updateMember(index, "name", event.target.value)}
                                placeholder="Member name"
                                className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                value={member.designation}
                                onChange={(event) => updateMember(index, "designation", event.target.value)}
                                placeholder="Designation"
                                className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={member.sortOrder}
                                onChange={(event) => updateMember(index, "sortOrder", Number(event.target.value || 0))}
                                className="w-20 border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-error/10 text-error font-bold hover:bg-error/20"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Page Content</label>
              <TipTapEditor
                value={form.content}
                onChange={(value) => setForm((previous) => ({ ...previous, content: value }))}
                enableImages
                uploadPage="about"
                uploadSection="about"
                placeholder="Write page content here..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Page"}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
