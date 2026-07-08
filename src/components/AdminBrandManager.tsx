"use client";

import React, { useState, useEffect } from "react";
import { Upload, CheckCircle2, AlertTriangle, Image as ImageIcon, Video, Play, Save } from "lucide-react";
import Image from "next/image";

export default function AdminBrandManager() {
  // Logo State
  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [logoSuccess, setLogoSuccess] = useState("");

  // Video State
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [videoSuccess, setVideoSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Fetch Logo
        const resLogo = await fetch("/api/admin/brand?key=logo");
        if (resLogo.ok) {
          const data = await resLogo.json();
          if (data.value) setLogo(data.value);
          else setLogo("/uploads/logo/white-logo.png");
        } else {
          setLogo("/uploads/logo/white-logo.png");
        }

        // Fetch Video URL
        const resVideo = await fetch("/api/admin/brand?key=video_url");
        if (resVideo.ok) {
          const data = await resVideo.json();
          if (data.value) setVideoUrl(data.value);
          else setVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
        }

        // Fetch Video Thumbnail
        const resThumb = await fetch("/api/admin/brand?key=video_thumbnail");
        if (resThumb.ok) {
          const data = await resThumb.json();
          if (data.value) setVideoThumbnail(data.value);
          else setVideoThumbnail("/uploads/hostel/hostel.jpg");
        }
      } catch (err) {
        console.error("Failed to fetch brand settings:", err);
      }
    }
    fetchSettings();
  }, []);

  async function handleLogoUpload(e: React.FormEvent) {
    e.preventDefault();
    setLogoError("");
    setLogoSuccess("");

    if (!logoFile) {
      setLogoError("Please choose a logo file first.");
      return;
    }

    setLogoLoading(true);

    try {
      const formData = new FormData();
      formData.set("file", logoFile);
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
      setLogoSuccess("Logo updated successfully!");
      setLogoFile(null);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLogoLoading(false);
    }
  }

  async function handleVideoSettingsSave(e: React.FormEvent) {
    e.preventDefault();
    setVideoError("");
    setVideoSuccess("");
    setVideoLoading(true);

    try {
      let finalThumbUrl = videoThumbnail;

      // 1. Upload Thumbnail file if chosen
      if (thumbFile) {
        const formData = new FormData();
        formData.set("file", thumbFile);
        formData.set("section", "brand");
        formData.set("page", "admin");
        formData.set("title", "Video Bento Thumbnail");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Thumbnail upload failed");
        const uploadData = await uploadRes.json();
        finalThumbUrl = uploadData.upload.src;
        setVideoThumbnail(finalThumbUrl);
      }

      // 2. Save Video URL to Brand settings
      const urlRes = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "video_url",
          value: videoUrl.trim(),
          alt: "LPS Vidyawadi 360 Video Tour URL",
        }),
      });
      if (!urlRes.ok) throw new Error("Failed to save Video URL setting");

      // 3. Save Video Thumbnail URL to Brand settings
      const thumbRes = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "video_thumbnail",
          value: finalThumbUrl.trim(),
          alt: "LPS Vidyawadi 360 Video Tour Thumbnail",
        }),
      });
      if (!thumbRes.ok) throw new Error("Failed to save Video Thumbnail setting");

      setVideoSuccess("Video settings updated successfully!");
      setThumbFile(null);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setVideoLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Brand Identity Card */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] shadow-premium-sm overflow-hidden text-left">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3 bg-[#F8F9FC]">
          <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shadow-premium-sm">
            <ImageIcon size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">Brand Logo Identity</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Website primary logo settings</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#7678ED] mb-3">Current Active Logo</p>
            <div className="bg-[#F8F9FC] border border-dashed border-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[220px] relative overflow-hidden">
              {logo ? (
                <div className="relative w-40 h-40">
                  <Image src={logo} alt="Current Logo" fill className="object-contain" />
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No logo loaded</p>
              )}
            </div>
          </div>

          <form onSubmit={handleLogoUpload} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#7678ED] block mb-3">Upload New Logo</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 group-hover:border-secondary rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center bg-[#F8F9FC]/50">
                  <Upload className="text-[#3D348B]/30 mb-2" size={24} />
                  <p className="text-xs font-bold text-gray-600">
                    {logoFile ? logoFile.name : "Click or drag logo file here"}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 font-black uppercase tracking-widest">PNG, JPG or SVG</p>
                </div>
              </div>
            </div>

            {logoError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                <AlertTriangle size={14} className="shrink-0" />
                {logoError}
              </div>
            )}

            {logoSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-green-100">
                <CheckCircle2 size={14} className="shrink-0" />
                {logoSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={logoLoading || !logoFile}
              className="w-full bg-[#3D348B] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50 shadow-premium-sm inline-flex items-center justify-center gap-2"
            >
              <Save size={12} />
              {logoLoading ? "Saving..." : "Save New Logo"}
            </button>
          </form>
        </div>
      </section>

      {/* 360° Video Configuration Card */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] shadow-premium-sm overflow-hidden text-left">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3 bg-[#F8F9FC]">
          <div className="w-10 h-10 rounded-2xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B] shadow-premium-sm">
            <Video size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">Homepage 360° Video Tour</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Manage YouTube/Vimeo embed URL and custom thumbnail</p>
          </div>
        </div>

        <form onSubmit={handleVideoSettingsSave} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Fields */}
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7678ED] block mb-2">Video Embed URL *</label>
                <input 
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/your-video-id"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-xs md:text-sm text-gray-800 font-bold focus:outline-none focus:border-secondary bg-[#F8F9FC]/50"
                />
                <span className="text-[9px] text-gray-400 font-bold mt-1.5 block">
                  Format: Must use embed format (e.g. `https://www.youtube.com/embed/...` or `https://player.vimeo.com/video/...`)
                </span>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7678ED] block mb-2">Upload Video Thumbnail Image</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border border-dashed border-slate-200 group-hover:border-secondary rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center bg-[#F8F9FC]/50">
                    <Upload className="text-[#3D348B]/30 mb-2" size={20} />
                    <p className="text-xs font-bold text-gray-600">
                      {thumbFile ? thumbFile.name : "Click to upload a custom thumbnail cover"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#7678ED] mb-3">Live Video Cover Preview</p>
              <div className="relative aspect-[16/10] bg-slate-950 border border-slate-100 rounded-2xl overflow-hidden shadow-premium-sm group flex items-center justify-center">
                {videoThumbnail ? (
                  <img src={videoThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No thumbnail</p>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-[#0b1738]/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-[#3D348B] flex items-center justify-center shadow-premium-lg">
                    <Play size={18} className="fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {videoError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
              <AlertTriangle size={14} className="shrink-0" />
              {videoError}
            </div>
          )}

          {videoSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-green-100">
              <CheckCircle2 size={14} className="shrink-0" />
              {videoSuccess}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-50">
            <button
              type="submit"
              disabled={videoLoading}
              className="bg-[#3D348B] text-white hover:bg-secondary px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-premium-sm inline-flex items-center gap-2"
            >
              <Save size={12} />
              {videoLoading ? "Saving Settings..." : "Save Video Settings"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
