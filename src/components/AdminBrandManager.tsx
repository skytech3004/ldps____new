"use client";

import React, { useState, useEffect } from "react";
import { Upload, CheckCircle2, AlertTriangle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AdminBrandManager() {
  const [logo, setLogo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch("/api/admin/brand?key=logo");
        if (res.ok) {
          const data = await res.json();
          if (data.value) setLogo(data.value);
          else setLogo("/uploads/logo/white-logo.png");
        } else {
          setLogo("/uploads/logo/white-logo.png");
        }
      } catch (err) {
        console.error("Failed to fetch logo:", err);
        setLogo("/uploads/logo/white-logo.png");
      }
    }
    fetchBrand();
  }, []);

  async function handleLogoUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload file to server
      const formData = new FormData();
      formData.set("file", file);
      formData.set("section", "logo");
      formData.set("page", "admin");
      formData.set("title", "School Logo");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      const newLogoUrl = uploadData.upload.src;

      // 2. Save logo URL to Brand collection
      const brandRes = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "logo",
          value: newLogoUrl,
          alt: "LPS Vidyawadi School Logo",
        }),
      });

      if (!brandRes.ok) throw new Error("Failed to save brand settings");

      setLogo(newLogoUrl);
      setSuccess("Logo updated successfully!");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white border border-teal/10 rounded-lg shadow-sm overflow-hidden mb-10">
      <div className="p-6 border-b border-teal/10 flex items-center gap-3">
        <ImageIcon className="text-green-primary" size={22} />
        <h2 className="text-2xl font-black text-navy">Brand Identity</h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-teal mb-4">Current Logo</p>
          <div className="bg-[#f7fbf8] border border-dashed border-teal/20 rounded-xl p-8 flex items-center justify-center min-h-[200px] relative overflow-hidden">
            {logo ? (
              <div className="relative w-48 h-48">
                <Image src={logo} alt="Current Logo" fill className="object-contain" />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <ImageIcon size={32} className="text-teal/30" />
                </div>
                <p className="text-sm text-teal font-medium">No logo uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleLogoUpload} className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-teal block mb-3">Upload New Logo</label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-teal/20 group-hover:border-teal/40 rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center bg-[#f7fbf8]/50">
                <Upload className="text-teal/40 mb-3" size={32} />
                <p className="text-sm font-bold text-navy">
                  {file ? file.name : "Click or drag logo file here"}
                </p>
                <p className="text-[10px] text-teal mt-1 font-bold uppercase tracking-widest">PNG, JPG or SVG (Max 2MB)</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 border border-red-100">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 border border-green-100">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-navy text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-teal transition-all disabled:opacity-50 shadow-lg shadow-navy/5"
          >
            {loading ? "Updating Logo..." : "Save New Logo"}
          </button>
        </form>
      </div>
    </section>
  );
}
