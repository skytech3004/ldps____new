"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutGrid, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Upload,
  X,
  Link as LinkIcon
} from "lucide-react";

interface CategoryItem {
  _id?: string;
  image: string;
  title: string;
  link: string;
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  // New item input form
  const [newImage, setNewImage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("#");
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories.");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      alert("Error loading category data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveItems = async (nextItems: CategoryItem[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: nextItems }),
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
      setNewImage("");
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

  const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200; // Categories are smaller than carousel
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

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = newImage.trim();

    if (selectedFile) {
      setUploading(true);
      try {
        const optimizedBlob = await optimizeImage(selectedFile);
        const formData = new FormData();
        formData.append("file", optimizedBlob, `category-${Date.now()}.webp`);
        formData.append("page", "home");
        formData.append("section", "categories");
        formData.append("title", newTitle || "Category Image");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        imageUrl = data.upload.src;
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image.");
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
    if (!newTitle.trim()) {
      alert("Title is required.");
      return;
    }

    const newItem: CategoryItem = {
      image: imageUrl,
      title: newTitle.trim(),
      link: newLink.trim(),
    };
    const nextItems = [...items, newItem];
    setItems(nextItems);
    saveItems(nextItems);

    setNewImage("");
    setNewTitle("");
    setNewLink("#");
    clearFile();
  };

  const removeItem = (index: number) => {
    const nextItems = items.filter((_, idx) => idx !== index);
    setItems(nextItems);
    saveItems(nextItems);
    if (currentItem >= nextItems.length && nextItems.length > 0) {
      setCurrentItem(nextItems.length - 1);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const nextItems = [...items];
    const temp = nextItems[index];
    nextItems[index] = nextItems[targetIndex];
    nextItems[targetIndex] = temp;
    setItems(nextItems);
    saveItems(nextItems);
    setCurrentItem(targetIndex);
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">Administration</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <LayoutGrid size={36} className="text-accent" />
            <span>Category Grid</span>
          </h1>
          <p className="text-white/70 mt-2">Manage blocks. All changes are saved automatically.</p>
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
          <p className="text-xs font-semibold uppercase tracking-wider">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: List and Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Add Item Form */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Plus size={18} className="text-accent" />
                <span>Add New Category</span>
              </h2>
              
              <form onSubmit={addItem} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 uppercase">Category Image *</label>
                  
                  {imagePreview ? (
                    <div className="relative w-full aspect-[4/3] max-h-48 bg-[#081736] rounded-xl overflow-hidden border-2 border-accent/50 group">
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
                        <Upload size={24} className="text-white/40 group-hover:text-accent" />
                        <p className="text-xs font-bold text-white/50 uppercase">Upload Category Image</p>
                      </div>
                    </div>
                  )}

                  {!selectedFile && !imagePreview && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Or provide Image URL"
                        className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase">Category Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. SMART CLASSES"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase">Link URL</label>
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="#"
                      className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Insert Category</span>
                </button>
              </form>
            </div>

            {/* Items List */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex justify-between items-center">
                <span>Grid Items ({items.length})</span>
                <span className="text-xs text-white/40 font-normal">Reorder items</span>
              </h2>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentItem(idx)}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                      currentItem === idx 
                        ? "bg-[#17346f]/70 border-accent/40 shadow-md" 
                        : "bg-[#081736]/40 border-white/5 hover:bg-[#081736]/70"
                    }`}
                  >
                    <span className="text-xs font-black text-white/40 w-4">{idx + 1}</span>
                    <div className="relative w-16 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate uppercase tracking-wider">{item.title}</p>
                      <p className="text-[10px] text-white/40 truncate mt-0.5">{item.link}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(idx, "up"); }}
                        disabled={idx === 0}
                        className="p-1.5 hover:bg-white/10 text-white/60 disabled:opacity-20"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(idx, "down"); }}
                        disabled={idx === items.length - 1}
                        className="p-1.5 hover:bg-white/10 text-white/60 disabled:opacity-20"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                        className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-white hover:bg-red-500 rounded-lg ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Preview & Edit */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Sparkles size={18} className="text-accent animate-pulse" />
                <span>Live Preview</span>
              </h2>

              {items.length > 0 && items[currentItem] ? (
                <div className="space-y-6">
                  {/* Aspect Ratio Box mimicking component */}
                  <div className="relative w-full aspect-[4/3] bg-[#081736] rounded-xl overflow-hidden border border-white/10 group">
                    <Image
                      src={items[currentItem].image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-navy/60 flex items-center justify-center p-4">
                      <h3 className="text-white font-black text-xl text-center uppercase tracking-widest">
                        {items[currentItem].title}
                      </h3>
                    </div>
                  </div>

                  {/* Immediate Edit */}
                  <div className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] text-accent font-black uppercase tracking-wider">Modify Selected Item</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-white/50 uppercase">Item Title</label>
                      <input
                        type="text"
                        value={items[currentItem].title}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[currentItem].title = e.target.value;
                          setItems(nextItems);
                        }}
                        onBlur={() => saveItems(items)}
                        className="w-full bg-[#081736] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-white/50 uppercase">Item Link</label>
                      <input
                        type="text"
                        value={items[currentItem].link}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[currentItem].link = e.target.value;
                          setItems(nextItems);
                        }}
                        onBlur={() => saveItems(items)}
                        className="w-full bg-[#081736] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/30 font-semibold text-sm">
                  Add items to see preview.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
