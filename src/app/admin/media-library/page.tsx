"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Film, ImageIcon, Loader2, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";

type LibraryTab = "photo" | "event-photo" | "video" | "guide-bulbul-photo" | "ncc-photo";

interface MediaItem {
  _id?: string;
  title: string;
  src: string;
  alt: string;
  type: string;
  category?: string;
}

const TABS: { id: LibraryTab; label: string; kind: "photo" | "video" }[] = [
  { id: "photo", label: "Photos", kind: "photo" },
  { id: "event-photo", label: "Event Photos", kind: "photo" },
  { id: "video", label: "Videos", kind: "video" },
  { id: "guide-bulbul-photo", label: "Guide & Bulbul", kind: "photo" },
  { id: "ncc-photo", label: "NCC", kind: "photo" },
];

const FEATURED: Record<string, { type: string; title: string; fallback: string }> = {
  "ncc-photo": { type: "ncc-featured", title: "NCC page banner", fallback: "/uploads/gallery/ncc-img-2.jpg" },
  "guide-bulbul-photo": { type: "guide-bulbul-featured", title: "Guide & Bulbul page banner", fallback: "/uploads/gallery/guide-bulbul-img-5.jpg" },
};

function youtubeThumb(url: string) {
  const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
  const id = match && match[7].length === 11 ? match[7] : null;
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function isYouTube(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [featured, setFeatured] = useState<Record<string, MediaItem | null>>({});
  const [categories, setCategories] = useState<string[]>(["Others"]);
  const [tab, setTab] = useState<LibraryTab>("photo");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [draft, setDraft] = useState({ title: "", src: "", category: "Others" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const currentTab = TABS.find((item) => item.id === tab)!;
  const featuredConfig = FEATURED[tab];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (item.type !== tab) return false;
      if (filter !== "All" && (item.category || "Others") !== filter) return false;
      if (needle && !`${item.title} ${item.category || ""}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [items, tab, filter, query]);

  const preview = visible.find((item) => item._id === previewId) || null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [mediaRes, filterRes, nccRes, guideRes] = await Promise.all([
          fetch("/api/admin/media-items"),
          fetch("/api/admin/filters?type=gallery"),
          fetch("/api/admin/media-items?type=ncc-featured"),
          fetch("/api/admin/media-items?type=guide-bulbul-featured"),
        ]);
        if (cancelled) return;
        if (mediaRes.ok) {
          const data: MediaItem[] = await mediaRes.json();
          setItems(Array.isArray(data) ? data : []);
        }
        if (filterRes.ok) {
          const data = await filterRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const names = data.map((entry: { name: string }) => entry.name);
            setCategories(names.includes("Others") ? names : ["Others", ...names]);
          }
        }
        const featuredMap: Record<string, MediaItem | null> = {};
        if (nccRes.ok) {
          const data = await nccRes.json();
          featuredMap["ncc-featured"] = Array.isArray(data) && data[0] ? data[0] : null;
        }
        if (guideRes.ok) {
          const data = await guideRes.json();
          featuredMap["guide-bulbul-featured"] = Array.isArray(data) && data[0] ? data[0] : null;
        }
        setFeatured(featuredMap);
      } catch (error) {
        console.error(error);
        setNotice("Could not load the media library.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) map[item.type] = (map[item.type] || 0) + 1;
    return map;
  }, [items]);

  const resetComposer = () => {
    setComposerOpen(false);
    setEditingId(null);
    setMode("upload");
    setDraft({ title: "", src: "", category: tab === "event-photo" ? "Events" : categories[0] || "Others" });
  };

  const uploadFile = async (file: File) => {
    setBusy(true);
    setNotice("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("section", "media-items");
      body.append("page", "gallery");
      body.append("title", draft.title || file.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setDraft((prev) => ({ ...prev, src: data.upload.src, title: prev.title || file.name.replace(/\.[^.]+$/, "") }));
      setNotice("File uploaded. Add a title, then save.");
    } catch (error) {
      console.error(error);
      setNotice("Upload failed. Try a smaller file or paste a URL.");
    } finally {
      setBusy(false);
    }
  };

  const saveItem = async () => {
    if (!draft.title.trim() || !draft.src.trim()) {
      setNotice("Title and a file or URL are both required.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const payload = {
        title: draft.title.trim(),
        src: draft.src.trim(),
        alt: draft.title.trim(),
        type: tab,
        category: tab === "event-photo" ? "Events" : draft.category || "Others",
      };
      const res = await fetch("/api/admin/media-items", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { _id: editingId, ...payload } : payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved: MediaItem = await res.json();
      setItems((prev) => editingId ? prev.map((item) => item._id === editingId ? saved : item) : [saved, ...prev]);
      setNotice(editingId ? "Item updated." : "Item added to this collection.");
      resetComposer();
    } catch (error) {
      console.error(error);
      setNotice("Could not save this item.");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this item from the website gallery?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/media-items?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (previewId === id) setPreviewId(null);
      setNotice("Item deleted.");
    } catch (error) {
      console.error(error);
      setNotice("Could not delete this item.");
    } finally {
      setBusy(false);
    }
  };

  const saveFeatured = async (file: File) => {
    if (!featuredConfig) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("section", "media-items");
      body.append("page", tab === "ncc-photo" ? "ncc" : "guide-bulbul");
      body.append("title", featuredConfig.title);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploaded = await uploadRes.json();
      const existing = featured[featuredConfig.type];
      const payload = {
        title: featuredConfig.title,
        src: uploaded.upload.src,
        alt: featuredConfig.title,
        type: featuredConfig.type,
        category: "Others",
      };
      const saveRes = await fetch("/api/admin/media-items", {
        method: existing?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existing?._id ? { _id: existing._id, ...payload } : payload),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      const saved = await saveRes.json();
      setFeatured((prev) => ({ ...prev, [featuredConfig.type]: saved }));
      setNotice("Banner photo updated.");
    } catch (error) {
      console.error(error);
      setNotice("Could not update the banner.");
    } finally {
      setBusy(false);
    }
  };

  const resetFeatured = async () => {
    if (!featuredConfig) return;
    const existing = featured[featuredConfig.type];
    if (!existing?._id) return;
    if (!window.confirm("Reset this banner to the default photo?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/media-items?id=${existing._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      setFeatured((prev) => ({ ...prev, [featuredConfig.type]: null }));
      setNotice("Banner reset to the default photo.");
    } catch (error) {
      console.error(error);
      setNotice("Could not reset the banner.");
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async () => {
    const name = window.prompt("New gallery category name");
    if (!name?.trim()) return;
    const res = await fetch("/api/admin/filters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type: "gallery" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error || "Could not create that category.");
      return;
    }
    setCategories((prev) => prev.includes(data.name) ? prev : [...prev, data.name]);
    setDraft((prev) => ({ ...prev, category: data.name }));
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8">
        <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Website Content</p>
        <h1 className="text-3xl md:text-4xl font-black mt-2">Media Library</h1>
        <p className="text-white/70 mt-2 max-w-3xl text-sm leading-relaxed">
          A separate gallery desk for photos, event photos, videos, Guide & Bulbul, and NCC. Each collection stays in its own tab, photos stay photos, and you can edit a title or category without uploading the file again.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setFilter("All");
              setPreviewId(null);
              resetComposer();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${tab === item.id ? "bg-[#F7B801] text-[#3D348B]" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
          >
            {item.kind === "video" ? <Film size={14} /> : <ImageIcon size={14} />}
            {item.label}
            <span className="opacity-70">{counts[item.id] || 0}</span>
          </button>
        ))}
      </div>

      {notice && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-[#F7B801]">{notice}</p>
      )}

      {featuredConfig && !loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0f234f]/70 p-5 flex flex-col md:flex-row gap-5 items-center">
          <img
            src={featured[featuredConfig.type]?.src || featuredConfig.fallback}
            alt=""
            className="w-full md:w-48 h-28 object-cover rounded-xl border border-white/10"
          />
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Page banner</p>
            <h2 className="text-lg font-black">{featuredConfig.title}</h2>
            <p className="text-xs text-white/50">Shown at the top of the public page. A wide photo works best.</p>
          </div>
          <div className="flex gap-2">
            <label className="relative px-4 py-3 rounded-xl bg-[#F7B801] text-[#3D348B] text-xs font-black uppercase cursor-pointer">
              {busy ? "Working..." : "Change banner"}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" disabled={busy} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void saveFeatured(file);
                e.target.value = "";
              }} />
            </label>
            {featured[featuredConfig.type] && (
              <button type="button" onClick={() => void resetFeatured()} className="px-4 py-3 rounded-xl border border-red-400/30 text-red-300 text-xs font-black uppercase">
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <label className="flex-1 flex items-center gap-2 bg-[#081736] border border-white/10 rounded-xl px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${currentTab.label.toLowerCase()}`}
            className="bg-transparent flex-1 text-sm outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setComposerOpen(true);
            setEditingId(null);
            setDraft({ title: "", src: "", category: tab === "event-photo" ? "Events" : categories[0] || "Others" });
          }}
          className="px-5 py-3 rounded-xl bg-white text-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          Add {currentTab.kind === "video" ? "video" : "photo"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${filter === name ? "bg-white text-primary" : "bg-white/5 text-white/60"}`}
          >
            {name}
          </button>
        ))}
      </div>

      {composerOpen && (
        <div className="rounded-2xl border border-white/10 bg-[#0f234f]/80 p-5 space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode("upload")} className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === "upload" ? "bg-[#F7B801] text-[#3D348B]" : "bg-white/5"}`}>Upload</button>
            <button type="button" onClick={() => setMode("url")} className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === "url" ? "bg-[#F7B801] text-[#3D348B]" : "bg-white/5"}`}>URL</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Title"
              className="bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent"
            />
            {tab === "event-photo" ? (
              <p className="bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60">Category: Events</p>
            ) : (
              <div className="flex gap-2">
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="flex-1 bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                >
                  {categories.filter((name) => name !== "Events").map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
                <button type="button" onClick={() => void addCategory()} className="px-3 rounded-xl bg-[#F7B801] text-[#3D348B] font-black" aria-label="Add category"><Plus size={16} /></button>
              </div>
            )}
            {mode === "url" ? (
              <input
                value={draft.src}
                onChange={(e) => setDraft({ ...draft, src: e.target.value })}
                placeholder={currentTab.kind === "video" ? "YouTube or video URL" : "Image URL"}
                className="md:col-span-2 bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent"
              />
            ) : (
              <label className="md:col-span-2 border border-dashed border-white/20 rounded-xl px-4 py-6 text-center text-sm text-white/60 cursor-pointer">
                <Upload size={16} className="inline mr-2" />
                {busy ? "Uploading..." : draft.src ? "File ready. You can replace it." : `Choose a ${currentTab.kind}`}
                <input
                  type="file"
                  accept={currentTab.kind === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadFile(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
          {draft.src && currentTab.kind === "photo" && (
            <img src={draft.src} alt="" className="h-36 w-full max-w-sm object-cover rounded-xl border border-white/10" />
          )}
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => void saveItem()} className="px-5 py-3 rounded-xl bg-white text-primary text-xs font-black uppercase disabled:opacity-50">
              {busy ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={resetComposer} className="px-5 py-3 rounded-xl bg-white/10 text-xs font-black uppercase">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-white/50"><Loader2 className="animate-spin mx-auto mb-3" /> Loading library...</div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40 text-sm">Nothing in this view yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((item) => {
            const thumb = currentTab.kind === "video" && isYouTube(item.src) ? youtubeThumb(item.src) : null;
            return (
              <article key={item._id} className="rounded-2xl border border-white/10 bg-[#0f234f]/60 overflow-hidden">
                <button type="button" onClick={() => item._id && setPreviewId(item._id)} className="block w-full aspect-video bg-[#081736]">
                  {currentTab.kind === "photo" || thumb ? (
                    <img src={thumb || item.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.src} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  )}
                </button>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
                    <span className="text-[10px] font-black uppercase text-accent shrink-0">{item.category || "Others"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setComposerOpen(true);
                        setEditingId(item._id || null);
                        setMode("url");
                        setDraft({ title: item.title, src: item.src, category: item.category || "Others" });
                      }}
                      className="flex-1 py-2 rounded-lg bg-white/10 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button type="button" onClick={() => item._id && void removeItem(item._id)} className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-300 text-xs font-bold flex items-center justify-center gap-1">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-4" onClick={() => setPreviewId(null)}>
          <div className="flex justify-end">
            <button type="button" className="p-2 rounded-full bg-white/10" aria-label="Close preview"><X /></button>
          </div>
          <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {currentTab.kind === "photo" ? (
              <img src={preview.src} alt={preview.title} className="max-h-[80vh] max-w-full object-contain rounded-xl" />
            ) : isYouTube(preview.src) ? (
              <iframe src={preview.src} title={preview.title} className="w-full max-w-4xl aspect-video rounded-xl" allowFullScreen />
            ) : (
              <video src={preview.src} controls autoPlay className="max-h-[80vh] max-w-full rounded-xl" />
            )}
          </div>
          <p className="text-center text-sm font-bold pt-3">{preview.title}</p>
        </div>
      )}
    </section>
  );
}
