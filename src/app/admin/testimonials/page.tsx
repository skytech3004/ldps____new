"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, MessageSquare, Pencil, Plus, Star, Trash2, X } from "lucide-react";

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  sortOrder: number;
  status: "active" | "inactive";
};

const emptyForm = {
  quote: "",
  name: "",
  role: "",
  location: "",
  rating: 5,
  status: "active" as "active" | "inactive",
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load testimonials");
      setItems(data);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
    setNotice("");
  }

  function startEdit(item: Testimonial) {
    setEditingId(item._id);
    setForm({
      quote: item.quote,
      name: item.name,
      role: item.role,
      location: item.location || "",
      rating: item.rating || 5,
      status: item.status,
    });
    setOpen(true);
    setNotice("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const current = editingId ? items.find((item) => item._id === editingId) : null;
      const res = await fetch("/api/admin/testimonials", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _id: editingId,
          sortOrder: current?.sortOrder,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setOpen(false);
      setNotice(editingId ? "Testimonial updated." : "Testimonial added.");
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Testimonial) {
    if (!window.confirm(`Delete the quote from ${item.name}?`)) return;
    const res = await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item._id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error || "Delete failed");
      return;
    }
    setNotice("Testimonial deleted.");
    await load();
  }

  async function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);
    setItems(reordered);
    await Promise.all(
      reordered.map((item, order) =>
        fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, sortOrder: order + 1 }),
        })
      )
    );
  }

  return (
    <section className="space-y-6 text-white font-montserrat">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Homepage</p>
          <h1 className="text-3xl md:text-4xl font-black mt-2 flex items-center gap-3">
            <MessageSquare className="text-accent" />
            Parents & Alumni
          </h1>
          <p className="text-white/70 mt-2 text-sm">Quotes shown in “What Parents & Alumni Say” on the homepage.</p>
        </div>
        <button type="button" onClick={startAdd} className="px-5 py-3 rounded-xl bg-white text-primary text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <Plus size={14} /> Add quote
        </button>
      </div>

      {notice && <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-[#F7B801]">{notice}</p>}

      {open && (
        <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#0f234f]/80 p-5 grid md:grid-cols-2 gap-4">
          <label className="md:col-span-2 space-y-2 text-xs font-bold uppercase text-white/50">
            Quote *
            <textarea required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold normal-case text-white outline-none" />
          </label>
          <label className="space-y-2 text-xs font-bold uppercase text-white/50">
            Name *
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold normal-case text-white outline-none" />
          </label>
          <label className="space-y-2 text-xs font-bold uppercase text-white/50">
            Role *
            <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Parent of Class XI Student" className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold normal-case text-white outline-none" />
          </label>
          <label className="space-y-2 text-xs font-bold uppercase text-white/50">
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Jodhpur, Rajasthan" className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold normal-case text-white outline-none" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-2 text-xs font-bold uppercase text-white/50">
              Stars
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none">
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-xs font-bold uppercase text-white/50">
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })} className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none">
                <option value="active">Shown on site</option>
                <option value="inactive">Hidden</option>
              </select>
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-xs font-black uppercase text-white/70"><X size={14} className="inline mr-1" />Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-3 rounded-xl bg-[#F7B801] text-[#3D348B] text-xs font-black uppercase disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center text-white/50"><Loader2 className="animate-spin mx-auto" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <article key={item._id} className="rounded-2xl border border-white/10 bg-[#0f234f]/70 p-4 flex gap-4 items-start">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => void move(index, -1)} className="p-1.5 rounded-lg bg-white/5" aria-label="Move up"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => void move(index, 1)} className="p-1.5 rounded-lg bg-white/5" aria-label="Move down"><ArrowDown size={14} /></button>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  {Array.from({ length: item.rating || 5 }).map((_, star) => <Star key={star} size={12} className="fill-current" />)}
                  <span className={`text-[10px] font-black uppercase ${item.status === "active" ? "text-green-300" : "text-white/40"}`}>{item.status === "active" ? "On homepage" : "Hidden"}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">“{item.quote}”</p>
                <p className="text-xs font-black uppercase">{item.name}</p>
                <p className="text-xs text-white/50">{item.role}{item.location ? ` • ${item.location}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className="p-2 rounded-lg bg-accent/10 text-accent" aria-label={`Edit ${item.name}`}><Pencil size={14} /></button>
                <button type="button" onClick={() => void remove(item)} className="p-2 rounded-lg bg-red-500/10 text-red-300" aria-label={`Delete ${item.name}`}><Trash2 size={14} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
