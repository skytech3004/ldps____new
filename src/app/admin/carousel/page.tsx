"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Images, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  _id?: string;
  image: string;
  title: string;
  description: string;
}

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // New slide input form
  const [newImage, setNewImage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCarousel = async () => {
    try {
      const res = await fetch("/api/admin/carousel");
      if (!res.ok) throw new Error("Failed to fetch carousel.");
      const data = await res.json();
      setSlides(data.slides || []);
    } catch (err) {
      console.error(err);
      alert("Error loading carousel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, []);

  const saveSlides = async (nextSlides: Slide[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: nextSlides }),
      });
      if (!res.ok) throw new Error("Failed to save.");
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewImage(""); // Clear URL input if file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  // Optimize image client-side before upload
  const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1920;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas to Blob failed"));
            },
            "image/webp",
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const addSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = newImage.trim();

    if (selectedFile) {
      setUploading(true);
      try {
        const optimizedBlob = await optimizeImage(selectedFile);
        const formData = new FormData();
        formData.append("file", optimizedBlob, `carousel-${Date.now()}.webp`);
        formData.append("page", "home");
        formData.append("section", "carousel");
        formData.append("title", newTitle || "Carousel Image");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        imageUrl = data.upload.src;
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    if (!imageUrl) {
      alert("Please provide an image or upload a file.");
      return;
    }

    const nextSlide: Slide = {
      image: imageUrl,
      title: newTitle.trim(),
      description: newDescription.trim(),
    };
    const nextSlides = [...slides, nextSlide];
    setSlides(nextSlides);
    saveSlides(nextSlides);

    setNewImage("");
    setNewTitle("");
    setNewDescription("");
    clearFile();
  };

  const removeSlide = (index: number) => {
    const nextSlides = slides.filter((_, idx) => idx !== index);
    setSlides(nextSlides);
    saveSlides(nextSlides);
    if (currentSlide >= nextSlides.length && nextSlides.length > 0) {
      setCurrentSlide(nextSlides.length - 1);
    }
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const nextSlides = [...slides];
    const temp = nextSlides[index];
    nextSlides[index] = nextSlides[targetIndex];
    nextSlides[targetIndex] = temp;
    setSlides(nextSlides);
    saveSlides(nextSlides);
    setCurrentSlide(targetIndex);
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">Administration</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <Images size={36} className="text-accent" />
            <span>Home Carousel</span>
          </h1>
          <p className="text-white/70 mt-2">Manage banners. All changes are saved automatically.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
            saving ? "bg-accent/10 border-accent/20 text-accent" : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}>
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Auto-Saving...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">All Saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading carousel settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Slide List and Add Slide Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Add Slide Form */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Plus size={18} className="text-accent" />
                <span>Add Slide Banner</span>
              </h2>
              
              <form onSubmit={addSlide} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 uppercase">Image Banner *</label>
                  
                  {imagePreview ? (
                    <div className="relative w-full aspect-[21/9] bg-[#081736] rounded-xl overflow-hidden border-2 border-accent/50 group">
                      <Image
                        src={imagePreview}
                        alt="Upload Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-bold uppercase tracking-widest text-white">Click X to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-32 bg-[#081736] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-accent/40 transition-colors">
                        <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                          <Upload size={24} />
                        </div>
                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest group-hover:text-white/80">Click or Drag to Upload Image</p>
                      </div>
                    </div>
                  )}

                  {/* Fallback URL input */}
                  {!selectedFile && !imagePreview && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <p className="text-[10px] font-bold text-white/20 uppercase">Or provide URL</p>
                        <div className="h-px flex-1 bg-white/5"></div>
                      </div>
                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="e.g. /lps-vidhyawadi/gallery-01.jpg"
                        className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase">Title (Optional)</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Slide Title"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase">Description (Optional)</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Slide Description"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Optimizing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Insert Slide</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Slide List */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex justify-between items-center">
                <span>Slides Order ({slides.length})</span>
                <span className="text-xs text-white/40 font-normal">Reorder or remove items</span>
              </h2>

              {slides.length === 0 ? (
                <div className="text-center py-10 text-white/30 space-y-2">
                  <ImageIcon className="mx-auto text-white/15" size={40} />
                  <p className="text-sm">No slides configured. Please add one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slides.map((slide, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                        currentSlide === idx 
                          ? "bg-[#17346f]/70 border-accent/40 shadow-md" 
                          : "bg-[#081736]/40 border-white/5 hover:bg-[#081736]/70"
                      }`}
                    >
                      <span className="text-xs font-black text-white/40 w-4">{idx + 1}</span>
                      
                      {/* Image Thumbnail */}
                      <div className="relative w-16 h-10 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0">
                        {slide.image && (
                          <Image
                            src={slide.image}
                            alt={slide.title || "Thumbnail"}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{slide.title || "(Untitled)"}</p>
                        <p className="text-[10px] text-white/50 truncate font-semibold mt-0.5">{slide.image}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSlide(idx, "up"); }}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg disabled:opacity-20"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSlide(idx, "down"); }}
                          disabled={idx === slides.length - 1}
                          className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg disabled:opacity-20"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-white hover:bg-red-500 rounded-lg ml-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Live Slide Preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Sparkles size={18} className="text-accent animate-pulse" />
                <span>Live Interactive Preview</span>
              </h2>

              {slides.length > 0 && slides[currentSlide] ? (
                <div className="space-y-4">
                  {/* Aspect Ratio Box mimicking homepage */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[16/9] bg-[#081736] rounded-xl overflow-hidden border border-white/10 group">
                    <Image
                      src={slides[currentSlide].image}
                      alt="Carousel Preview"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Captions if existing */}
                    {(slides[currentSlide].title || slides[currentSlide].description) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                        {slides[currentSlide].title && <p className="text-xs font-black uppercase tracking-wider text-accent">{slides[currentSlide].title}</p>}
                        {slides[currentSlide].description && <p className="text-[10px] opacity-75 font-semibold mt-0.5">{slides[currentSlide].description}</p>}
                      </div>
                    )}

                    {/* Preview controls */}
                    <div className="absolute inset-y-0 left-0 flex items-center px-2">
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white"
                      >
                        <ChevronLeft size={14} />
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Active Slide Form Fields (Immediate editing) */}
                  <div className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] text-accent font-black uppercase tracking-wider">Modify Selected Slide</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-white/50 uppercase">Slide Title</label>
                      <input
                        type="text"
                        value={slides[currentSlide].title}
                        onChange={(e) => {
                          const nextSlides = [...slides];
                          nextSlides[currentSlide].title = e.target.value;
                          setSlides(nextSlides);
                        }}
                        onBlur={() => saveSlides(slides)}
                        className="w-full bg-[#081736] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-white/50 uppercase">Slide Description</label>
                      <input
                        type="text"
                        value={slides[currentSlide].description}
                        onChange={(e) => {
                          const nextSlides = [...slides];
                          nextSlides[currentSlide].description = e.target.value;
                          setSlides(nextSlides);
                        }}
                        onBlur={() => saveSlides(slides)}
                        className="w-full bg-[#081736] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/30 font-semibold text-sm">
                  Add slides to preview them live.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
