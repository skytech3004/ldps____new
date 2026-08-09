"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Loader2, Save, Upload } from "lucide-react";
import Link from "next/link";
import TipTapEditor from "@/components/TipTapEditor";
import { aboutPageDefaults, type AboutPageSlug } from "@/data/aboutPages";

export type MessagePageSlug =
  | "management-message"
  | "ceo-message"
  | "secretary-message"
  | "principals-message";

type MessagePageRecord = {
  slug: MessagePageSlug;
  pageTitle: string;
  pageSubtitle: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
};

const MESSAGE_OPTIONS: {
  slug: MessagePageSlug;
  label: string;
  publicPath: string;
  uploadSection: string;
}[] = [
  {
    slug: "management-message",
    label: "President's Message",
    publicPath: "/about/management-message",
    uploadSection: "about-messages",
  },
  {
    slug: "ceo-message",
    label: "CEO's Message",
    publicPath: "/about/ceo-message",
    uploadSection: "about-messages",
  },
  {
    slug: "secretary-message",
    label: "Secretary's Message",
    publicPath: "/about/secretary-message",
    uploadSection: "about-messages",
  },
  {
    slug: "principals-message",
    label: "Principal's Message",
    publicPath: "/principals-desk",
    uploadSection: "about-messages",
  },
];

function toMessageRecord(slug: MessagePageSlug, data?: Partial<MessagePageRecord>): MessagePageRecord {
  const defaults = aboutPageDefaults[slug];
  return {
    slug,
    pageTitle: data?.pageTitle ?? defaults.pageTitle,
    pageSubtitle: data?.pageSubtitle ?? defaults.pageSubtitle ?? "",
    portraitImage: data?.portraitImage ?? defaults.portraitImage,
    personName: data?.personName ?? defaults.personName,
    personDesignation: data?.personDesignation ?? defaults.personDesignation,
    content: data?.content ?? defaults.content,
  };
}

export default function AboutMessageEditor() {
  const [selectedSlug, setSelectedSlug] = useState<MessagePageSlug>("management-message");
  const [form, setForm] = useState<MessagePageRecord>(toMessageRecord("management-message"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedOption = MESSAGE_OPTIONS.find((option) => option.slug === selectedSlug)!;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/admin/about-pages?slug=${selectedSlug}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch message page.");
        }
        if (!cancelled) {
          setForm(toMessageRecord(selectedSlug, data));
        }
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch message page.";
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

  async function uploadPortrait(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("page", "about-messages");
      formData.set("section", "about-messages");
      formData.set("title", `${selectedSlug}-portrait`);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setForm((previous) => ({ ...previous, portraitImage: String(data.upload.src ?? "") }));
    } finally {
      setUploading(false);
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
        body: JSON.stringify({
          ...aboutPageDefaults[selectedSlug],
          ...form,
          slug: selectedSlug,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed.");
      }
      setForm(toMessageRecord(selectedSlug, data));
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Save failed.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-teal/10 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-teal/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-green-primary">Admin</p>
          <h1 className="text-3xl md:text-4xl font-black text-navy mt-2">About Messages</h1>
          <p className="text-sm text-teal mt-2">
            Edit President, CEO, Secretary, and Principal messages from the About navbar with portrait upload and rich text.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {MESSAGE_OPTIONS.map((option) => (
            <button
              key={option.slug}
              type="button"
              onClick={() => setSelectedSlug(option.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                selectedSlug === option.slug ? "bg-navy text-white" : "bg-mint/30 text-navy hover:bg-mint/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSave} className="p-6 md:p-8 space-y-6">
        {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-teal">
          <span>Public page:</span>
          <Link
            href={selectedOption.publicPath}
            target="_blank"
            className="inline-flex items-center gap-1 text-navy hover:text-teal"
          >
            {selectedOption.publicPath}
            <ExternalLink size={12} />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-teal/70 font-semibold">Loading message page...</p>
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
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Page Subtitle</label>
                <input
                  value={form.pageSubtitle}
                  onChange={(event) => setForm((previous) => ({ ...previous, pageSubtitle: event.target.value }))}
                  placeholder="Short line shown below the page title"
                  className="w-full border border-teal/20 rounded-lg px-3 py-2 text-navy font-semibold"
                />
              </div>
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
            </div>

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
                      if (file) uploadPortrait(file);
                    }}
                  />
                  {uploading ? (
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

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-teal block mb-2">Message Content</label>
              <TipTapEditor
                value={form.content}
                onChange={(value) => setForm((previous) => ({ ...previous, content: value }))}
                uploadPage="about-messages"
                uploadSection="about-messages"
                placeholder="Write the message with text, images, headings, and lists..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Message"}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
