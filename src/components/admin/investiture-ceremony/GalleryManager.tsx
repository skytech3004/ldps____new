"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  buildDefaultInvestitureCeremonyGallery,
  defaultInvestitureCeremonyPhotos,
  type InvestitureCeremonyGalleryRecord,
} from "@/data/investitureCeremony";
import { ChevronRight, ImageIcon, Loader2, Plus, Star, Trash2, Upload } from "lucide-react";

export default function GalleryManager() {
  const [galleryRecord, setGalleryRecord] = useState<InvestitureCeremonyGalleryRecord>(buildDefaultInvestitureCeremonyGallery());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecord() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/galleries", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch gallery data.");
        }

        const records = Array.isArray(data) ? (data as InvestitureCeremonyGalleryRecord[]) : [];
        const existing =
          records.find((item) => item.page === "investiture-ceremony") ??
          records.find((item) => item.title?.toLowerCase().includes("investiture ceremony")) ??
          null;

        if (!cancelled) {
          setGalleryRecord(existing ?? buildDefaultInvestitureCeremonyGallery());
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to fetch gallery data.");
          setGalleryRecord(buildDefaultInvestitureCeremonyGallery());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecord();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(String(reader.result ?? ""));
      reader.readAsDataURL(file);
    }
  }

  async function uploadSelectedFile(title: string) {
    if (!selectedFile) return "";

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("page", "investiture-ceremony");
      formData.set("section", "gallery");
      formData.set("title", title || "Investiture Ceremony Photo");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      return String(data.upload.src ?? "");
    } finally {
      setUploading(false);
    }
  }

  async function persistGallery(nextRecord: InvestitureCeremonyGalleryRecord) {
    setSaving(true);
    try {
      setError("");
      const method = nextRecord._id ? "PUT" : "POST";
      const response = await fetch("/api/admin/galleries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextRecord),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save gallery.");
      }

      setGalleryRecord(data as InvestitureCeremonyGalleryRecord);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save gallery.");
    } finally {
      setSaving(false);
    }
  }

  async function addPhoto() {
    const uploaded = await uploadSelectedFile(galleryRecord.title);
    if (!uploaded) return;

    const nextPhotos = galleryRecord.photos.includes(uploaded)
      ? galleryRecord.photos
      : [...galleryRecord.photos, uploaded];

    const nextRecord = {
      ...galleryRecord,
      page: "investiture-ceremony",
      photos: nextPhotos,
      cover: galleryRecord.cover || uploaded,
    };

    setGalleryRecord(nextRecord);
    setSelectedFile(null);
    setPreviewSrc("");
    await persistGallery(nextRecord);
  }

  async function removePhoto(photoUrl: string) {
    const confirmed = window.confirm("Remove this photo?");
    if (!confirmed) return;

    const nextPhotos = galleryRecord.photos.filter((photo) => photo !== photoUrl);
    const nextRecord = {
      ...galleryRecord,
      photos: nextPhotos,
      cover: galleryRecord.cover === photoUrl ? nextPhotos[0] ?? "" : galleryRecord.cover,
    };

    setGalleryRecord(nextRecord);
    await persistGallery(nextRecord);
  }

  async function setCover(photoUrl: string) {
    const nextRecord = { ...galleryRecord, cover: photoUrl };
    setGalleryRecord(nextRecord);
    await persistGallery(nextRecord);
  }

  async function saveDetails(event: React.FormEvent) {
    event.preventDefault();
    await persistGallery({
      ...galleryRecord,
      page: "investiture-ceremony",
    });
  }

  const photos = galleryRecord.photos.length > 0 ? galleryRecord.photos : defaultInvestitureCeremonyPhotos.map((photo) => photo.src);

  return (
    <section className="space-y-8 text-[#0b1738]">
      <div className="rounded-3xl border border-teal/10 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#F7B801]">Ceremony Gallery</p>
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B]">Gallery Manager</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              Upload ceremony images, set the cover photo, and maintain a clean album for the public Investiture Ceremony page.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-[0.3em]">
            <ImageIcon size={14} className="text-[#F7B801]" />
            Photo CRUD
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-6 items-start">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-7 border-b border-slate-100">
            <h2 className="text-2xl font-black text-[#3D348B]">Album Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Edit the details that describe this ceremony album.</p>
          </div>

          <div className="p-6 space-y-5">
            {error ? <p className="text-sm font-semibold text-red-500">{error}</p> : null}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-[#3D348B]" size={32} />
                <p className="text-xs font-bold uppercase tracking-wider">Loading gallery album...</p>
              </div>
            ) : (
              <form onSubmit={saveDetails} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Title</span>
                    <input
                      value={galleryRecord.title}
                      onChange={(event) => setGalleryRecord((previous) => ({ ...previous, title: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Date</span>
                    <input
                      value={galleryRecord.date}
                      onChange={(event) => setGalleryRecord((previous) => ({ ...previous, date: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                      placeholder="2026-07-12"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Description</span>
                  <textarea
                    value={galleryRecord.description}
                    onChange={(event) => setGalleryRecord((previous) => ({ ...previous, description: event.target.value }))}
                    className="w-full min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    placeholder="Short description for the ceremony gallery"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Page</span>
                    <input
                      value={galleryRecord.page}
                      onChange={(event) => setGalleryRecord((previous) => ({ ...previous, page: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Category</span>
                    <input
                      value={galleryRecord.category}
                      onChange={(event) => setGalleryRecord((previous) => ({ ...previous, category: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3D348B]"
                    />
                  </label>
                  <label className="space-y-2 flex flex-col justify-end">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Featured</span>
                    <button
                      type="button"
                      onClick={() => setGalleryRecord((previous) => ({ ...previous, featured: !previous.featured }))}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider border transition-colors ${
                        galleryRecord.featured
                          ? "bg-[#3D348B] text-white border-[#3D348B]"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {galleryRecord.featured ? "Featured On" : "Featured Off"}
                    </button>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-[#3D348B] text-white px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#7678ED] transition-colors disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
                    Save Details
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-7 border-b border-slate-100">
              <h2 className="text-2xl font-black text-[#3D348B]">Upload New Photo</h2>
              <p className="text-sm text-slate-500 mt-1">Upload-only workflow. No URL fields, just select a file and add it.</p>
            </div>

            <div className="p-6 space-y-4">
              <label className="inline-flex w-full items-center justify-between gap-3 cursor-pointer bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-black text-sm border border-slate-200 hover:border-[#3D348B] transition-colors">
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Upload size={16} />
                  <span className="truncate">{selectedFile ? selectedFile.name : "Choose image file"}</span>
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                type="button"
                onClick={addPhoto}
                disabled={!selectedFile || uploading}
                className="inline-flex items-center gap-2 bg-[#F7B801] text-[#3D348B] px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:opacity-90 transition-colors disabled:opacity-60"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                Add Photo
              </button>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  {previewSrc ? (
                    <Image src={previewSrc} alt="Upload preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={22} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {selectedFile ? selectedFile.name : "No photo selected"}
                  </p>
                  <p className="text-xs text-slate-500">Preview appears here before upload.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-7 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#3D348B]">Gallery Photos</h2>
                <p className="text-sm text-slate-500 mt-1">Set the cover photo or remove images from the album.</p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <ImageIcon size={14} />
                {photos.length} photos
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4">
                {photos.map((photo, index) => {
                  const isCover = galleryRecord.cover === photo;
                  return (
                    <div
                      key={`${photo}-${index}`}
                      className={`rounded-2xl overflow-hidden border bg-white shadow-sm ${
                        isCover ? "border-[#F7B801]" : "border-slate-200"
                      }`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={photo}
                          alt={`Investiture photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {isCover ? (
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F7B801] text-[#3D348B] text-[10px] font-black uppercase tracking-wider">
                            <Star size={10} />
                            Cover
                          </div>
                        ) : null}
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setCover(photo)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-[#3D348B] hover:text-white transition-colors"
                          >
                            <Star size={12} />
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(photo)}
                            className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
