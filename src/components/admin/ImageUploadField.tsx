"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.set("page", "cms");
      body.set("section", "pages");
      body.set("title", file.name);
      body.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Upload failed.");
      onChange(result.upload.src as string);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/pages/..."
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
      />
      <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-primary">
        <Upload size={12} />
        {uploading ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 w-full rounded-lg object-cover" />
      ) : null}
      {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
    </div>
  );
}
