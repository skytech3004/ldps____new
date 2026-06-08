"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { 
  Bell, 
  Download, 
  FolderPlus, 
  Settings, 
  SquarePen, 
  Trash2, 
  Upload, 
  Loader2, 
  ImageIcon
} from "lucide-react";
import { schoolImages } from "@/data/lpsVidhyawadiDatabase";

type Album = {
  _id?: string;
  id: string;
  title: string;
  page: string;
  category: string;
  date: string;
  description: string;
  photos: string[];
  cover: string;
  featured: boolean;
};

const PAGE_OPTIONS = ["All Pages", "home", "about", "contact", "admin"];
const DEFAULT_CATEGORIES = ["All Categories", "Campus", "Events", "Sports", "Cultural", "Infrastructure"];

function toDate(dateIso: string) {
  const date = new Date(dateIso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildBaseAlbums(): Album[] {
  const banner = schoolImages.find((item) => item.category === "banner");
  const gallery = schoolImages.filter((item) => item.category === "gallery");

  return [
    {
      id: "db-home-hero",
      title: "Home Hero Slides",
      page: "home",
      category: "Campus",
      date: "29/11/2025",
      description: "Homepage main visuals and hero coverage.",
      photos: [banner?.src, gallery[0]?.src, gallery[1]?.src].filter(Boolean) as string[],
      cover: banner?.src ?? gallery[0]?.src ?? "/lps-vidhyawadi/about-banner.jpg",
      featured: true,
    },
    {
      id: "db-home-gallery",
      title: "Home Gallery",
      page: "home",
      category: "Events",
      date: "29/11/2025",
      description: "School events and activity highlights.",
      photos: gallery.slice(0, 6).map((item) => item.src),
      cover: gallery[2]?.src ?? "/lps-vidhyawadi/about-banner.jpg",
      featured: false,
    },
  ];
}

export default function AdminGalleryManager() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activePage, setActivePage] = useState("All Pages");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumPage, setNewAlbumPage] = useState("home");
  const [newAlbumCategory, setNewAlbumCategory] = useState("Campus");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editorAlbumId, setEditorAlbumId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Campus");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  
  // Upload state
  const [uploading, setUploading] = useState(false);

  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchGalleries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/galleries");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.length > 0) {
        setAlbums(data);
      } else {
        setAlbums(buildBaseAlbums());
      }
    } catch (err) {
      console.error(err);
      setAlbums(buildBaseAlbums());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const saveAlbum = async (album: Album) => {
    setSaving(true);
    try {
      const method = album._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/galleries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(album),
      });
      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      
      setAlbums(prev => prev.map(a => (a.id === album.id ? saved : a)));
      if (editorAlbumId === album.id) {
        setEditorAlbumId(saved.id);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const deleteAlbum = async (id: string, _id?: string) => {
    if (!_id) {
      setAlbums(prev => prev.filter(a => a.id !== id));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/galleries?id=${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAlbums(prev => prev.filter(a => a._id !== _id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const optimizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window as any).Image() as HTMLImageElement;
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetAlbumId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const optimizedBlob = await optimizeImage(file);
      const formData = new FormData();
      formData.append("file", optimizedBlob, `gallery-${Date.now()}.webp`);
      formData.append("page", "admin");
      formData.append("section", "gallery");
      formData.append("title", "Gallery Image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const imageUrl = data.upload.src;

      const album = albums.find(a => a.id === targetAlbumId);
      if (album) {
        const nextPhotos = [...album.photos, imageUrl];
        const updatedAlbum = { ...album, photos: nextPhotos, cover: album.cover || imageUrl };
        setAlbums(prev => prev.map(a => (a.id === targetAlbumId ? updatedAlbum : a)));
        saveAlbum(updatedAlbum);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const categoryMatch = activeCategory === "All Categories" || album.category === activeCategory;
      const pageMatch = activePage === "All Pages" || album.page === activePage;
      return categoryMatch && pageMatch;
    });
  }, [activeCategory, activePage, albums]);

  function downloadExcelLikeCsv() {
    const rows = [
      ["Album Title", "Page", "Category", "Date", "Photos", "Cover", "Featured"],
      ...filteredAlbums.map((album) => [
        album.title,
        album.page,
        album.category,
        album.date,
        String(album.photos.length),
        album.cover,
        album.featured ? "Yes" : "No",
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gallery-${activePage}-${activeCategory}.csv`.toLowerCase().replace(/\s+/g, "-");
    link.click();
    URL.revokeObjectURL(url);
  }

  function addCategory() {
    const next = newCategory.trim();
    if (!next || categories.includes(next)) return;
    setCategories((previous) => [...previous, next]);
    setNewCategory("");
  }

  function addAlbum() {
    if (!newAlbumTitle.trim()) return;
    const now = toDate(new Date().toISOString());
    const nextAlbum: Album = {
      id: `custom-${Date.now()}`,
      title: newAlbumTitle.trim(),
      page: newAlbumPage,
      category: newAlbumCategory,
      date: now,
      description: "",
      photos: [],
      cover: "",
      featured: false,
    };
    setAlbums((previous) => [nextAlbum, ...previous]);
    saveAlbum(nextAlbum);
    setNewAlbumTitle("");
    setShowNewAlbum(false);
  }

  function openEditModal(id: string) {
    const album = albums.find((item) => item.id === id);
    if (!album) return;
    setEditorAlbumId(id);
    setEditTitle(album.title);
    setEditCategory(album.category);
    setEditDate(album.date);
    setEditDescription(album.description || "");
    setNewImageUrl("");
    setEditModalOpen(true);
  }

  function addImageToAlbum(id: string) {
    const image = newImageUrl.trim();
    if (!image) return;

    const album = albums.find(a => a.id === id);
    if (album) {
      const nextPhotos = album.photos.includes(image) ? album.photos : [...album.photos, image];
      const updatedAlbum = { ...album, photos: nextPhotos, cover: album.cover || image };
      setAlbums(prev => prev.map(a => (a.id === id ? updatedAlbum : a)));
      saveAlbum(updatedAlbum);
    }
    setNewImageUrl("");
  }

  function removeImageFromAlbum(id: string, image: string) {
    const album = albums.find(a => a.id === id);
    if (album) {
      const nextPhotos = album.photos.filter((photo) => photo !== image);
      const updatedAlbum = { 
        ...album, 
        photos: nextPhotos, 
        cover: album.cover === image ? nextPhotos[0] ?? "" : album.cover 
      };
      setAlbums(prev => prev.map(a => (a.id === id ? updatedAlbum : a)));
      saveAlbum(updatedAlbum);
    }
  }

  function setCoverImage(id: string, image: string) {
    const album = albums.find(a => a.id === id);
    if (album) {
      const updatedAlbum = { ...album, cover: image };
      setAlbums(prev => prev.map(a => (a.id === id ? updatedAlbum : a)));
      saveAlbum(updatedAlbum);
    }
  }

  const editorAlbum = useMemo(() => albums.find((item) => item.id === editorAlbumId) ?? null, [albums, editorAlbumId]);

  function saveEditedAlbum() {
    if (!editorAlbumId) return;
    const album = albums.find(a => a.id === editorAlbumId);
    if (album) {
      const updatedAlbum = {
        ...album,
        title: editTitle.trim() || album.title,
        category: editCategory,
        date: editDate.trim() || album.date,
        description: editDescription.trim(),
      };
      setAlbums(prev => prev.map(a => (a.id === editorAlbumId ? updatedAlbum : a)));
      saveAlbum(updatedAlbum);
    }
    setEditModalOpen(false);
  }

  function toggleFeatured(id: string) {
    const album = albums.find(a => a.id === id);
    if (album) {
      const updatedAlbum = { ...album, featured: !album.featured };
      setAlbums(prev => prev.map(a => (a.id === id ? updatedAlbum : a)));
      saveAlbum(updatedAlbum);
    }
  }

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 text-white/40">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-xs font-black uppercase tracking-widest">Loading Photo Galleries...</p>
      </div>
    );
  }

  return (
    <>
      <section className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Media</p>
          <h1 className="text-4xl font-black mt-2">Photo Gallery</h1>
          <p className="text-white/70 mt-2">Curate collections. All changes are saved automatically.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
            saving ? "bg-accent/10 border-accent/20 text-accent" : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}>
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Saving...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">All Saved</span>
              </>
            )}
          </div>
          <button onClick={downloadExcelLikeCsv} className="h-11 px-5 rounded-2xl border border-white/20 bg-white/5 font-bold inline-flex items-center gap-2">
            <Download size={16} />
            CSV
          </button>
          <button onClick={() => setShowCategoryEditor((value) => !value)} className="h-11 px-5 rounded-2xl border border-white/20 bg-white/5 font-bold inline-flex items-center gap-2">
            <Settings size={16} />
            Categories
          </button>
          <button onClick={() => setShowNewAlbum((value) => !value)} className="h-11 px-5 rounded-2xl border border-pink-400/40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 font-bold inline-flex items-center gap-2">
            <FolderPlus size={16} />
            New Album
          </button>
        </div>
      </section>

      {showCategoryEditor ? (
        <section className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Add category"
            className="h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
          />
          <button onClick={addCategory} className="h-10 px-4 rounded-lg bg-pink-500 font-bold">
            Add Category
          </button>
        </section>
      ) : null}

      {showNewAlbum ? (
        <section className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={newAlbumTitle}
            onChange={(event) => setNewAlbumTitle(event.target.value)}
            placeholder="Album title"
            className="h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
          />
          <select value={newAlbumPage} onChange={(event) => setNewAlbumPage(event.target.value)} className="h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white">
            {PAGE_OPTIONS.filter((page) => page !== "All Pages").map((page) => (
              <option key={page} value={page} className="text-black">
                {page}
              </option>
            ))}
          </select>
          <select value={newAlbumCategory} onChange={(event) => setNewAlbumCategory(event.target.value)} className="h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white">
            {categories.filter((category) => category !== "All Categories").map((category) => (
              <option key={category} value={category} className="text-black">
                {category}
              </option>
            ))}
          </select>
          <button onClick={addAlbum} className="h-10 px-4 rounded-lg bg-green-primary font-bold text-white">
            Create Album
          </button>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        {PAGE_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            className={`px-4 h-10 rounded-xl text-sm font-bold uppercase ${
              activePage === item ? "bg-cyan-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setActiveCategory(item)}
            className={`px-5 h-10 rounded-xl text-sm font-bold ${
              activeCategory === item ? "bg-pink-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="rounded-3xl border border-white/15 bg-[#0f234f]/80 overflow-hidden">
        <div className="px-6 py-5 text-white/70 font-medium">Showing {filteredAlbums.length} albums</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-white/50 border-y border-white/10">
                <th className="px-6 py-4">Album Title</th>
                <th className="px-6 py-4">Page</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Photos</th>
                <th className="px-6 py-4">Cover</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlbums.map((album) => (
                <tr key={album.id} className="border-b border-white/10">
                  <td className="px-6 py-4 text-xl font-semibold">{album.title}</td>
                  <td className="px-6 py-4 text-white/75 uppercase">{album.page}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white/10 border border-white/10 uppercase">
                      {album.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/75">{album.date}</td>
                  <td className="px-6 py-4 text-white/75">{album.photos.length} images</td>
                  <td className="px-6 py-4">
                    <div className="relative w-14 h-10 rounded-md overflow-hidden border border-white/20">
                      {album.cover && (
                        <Image src={album.cover} alt={album.title} fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(album.id)}
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        title="Edit"
                      >
                        <SquarePen size={14} />
                      </button>
                      <button onClick={() => toggleFeatured(album.id)} className={`w-9 h-9 rounded-lg flex items-center justify-center ${album.featured ? "bg-cyan-500/70" : "bg-white/10 hover:bg-white/20"}`} title="Feature">
                        <Bell size={14} />
                      </button>
                      <button onClick={() => deleteAlbum(album.id, album._id)} className="w-9 h-9 rounded-lg bg-red-500/20 hover:bg-red-500/35 flex items-center justify-center" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editModalOpen && editorAlbum ? (
        <div className="fixed inset-0 z-50 bg-[#060d22]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl border border-white/15 bg-[#0b1b45] overflow-hidden max-h-[92vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-black">Edit Gallery</h3>
                <p className="text-white/60 mt-1">Photo galleries and albums</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 font-black text-xl">
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-white/60 block mb-2">Title *</label>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  onBlur={saveEditedAlbum}
                  className="w-full h-12 rounded-full bg-[#061434] border border-white/15 px-5 text-white focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-white/60 block mb-2">Category</label>
                  <select
                    value={editCategory}
                    onChange={(event) => {
                      setEditCategory(event.target.value);
                      const album = albums.find(a => a.id === editorAlbumId);
                      if (album) saveAlbum({ ...album, category: event.target.value });
                    }}
                    className="w-full h-12 rounded-full bg-[#061434] border border-white/15 px-5 text-white outline-none"
                  >
                    {categories.filter((item) => item !== "All Categories").map((item) => (
                      <option key={item} value={item} className="text-black">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-white/60 block mb-2">Date</label>
                  <input
                    value={editDate}
                    onChange={(event) => setEditDate(event.target.value)}
                    onBlur={saveEditedAlbum}
                    placeholder="dd-mm-yyyy"
                    className="w-full h-12 rounded-full bg-[#061434] border border-white/15 px-5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-white/60 block mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  onBlur={saveEditedAlbum}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full rounded-3xl bg-[#061434] border border-white/15 px-5 py-4 text-white resize-y outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black uppercase tracking-widest text-white/60">Album Photos</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, editorAlbum.id)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-accent/30 bg-accent/10 text-accent font-black text-[10px] uppercase tracking-wider hover:bg-accent hover:text-primary transition-all ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {uploading ? "Optimizing..." : "Upload Photo"}
                    </button>
                  </div>
                </div>

                {editorAlbum.photos.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/20 gap-2">
                    <ImageIcon size={40} />
                    <p className="text-sm font-bold uppercase tracking-widest">No photos yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {editorAlbum.photos.map((photo, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#0a214f]">
                        <Image src={photo} alt="Gallery" fill sizes="150px" className="object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button
                            onClick={() => setCoverImage(editorAlbum.id, photo)}
                            className={`w-24 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${editorAlbum.cover === photo ? "bg-accent text-primary" : "bg-white/20 hover:bg-white/40 text-white"}`}
                          >
                            {editorAlbum.cover === photo ? "Cover Image" : "Set as Cover"}
                          </button>
                          <button onClick={() => removeImageFromAlbum(editorAlbum.id, photo)} className="w-24 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-wider transition-all">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row gap-3">
                  <input
                    value={newImageUrl}
                    onChange={(event) => setNewImageUrl(event.target.value)}
                    placeholder="Or paste external image URL"
                    className="flex-1 h-11 rounded-full bg-[#061434] border border-white/15 px-5 text-white outline-none text-xs"
                  />
                  <button onClick={() => addImageToAlbum(editorAlbum.id)} className="h-11 px-5 rounded-full bg-white/10 hover:bg-white/20 font-black text-xs uppercase tracking-widest transition-all">
                    Add URL
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-white/10 flex items-center justify-end bg-white/5">
              <button onClick={() => setEditModalOpen(false)} className="px-8 h-11 rounded-full bg-accent text-primary font-black uppercase tracking-widest text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
