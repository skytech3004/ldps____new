"use client";

import React, { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload, Users, X } from "lucide-react";

export interface ShowcasePlayer {
  _id?: string;
  name: string;
  role: string;
  achievement: string;
  image: string;
}

const emptyPlayer = (): ShowcasePlayer => ({ name: "", role: "", achievement: "", image: "" });

export default function PlayerShowcasePanel({
  title,
  badge,
  achievementPlaceholder,
  players,
  onChange,
}: {
  title: string;
  badge: string;
  achievementPlaceholder: string;
  players: ShowcasePlayer[];
  onChange: (next: ShowcasePlayer[]) => void;
}) {
  const [draft, setDraft] = useState<ShowcasePlayer>(emptyPlayer);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputId = `player-photo-${badge.replace(/\s+/g, "-").toLowerCase()}`;

  const resetForm = () => {
    setDraft(emptyPlayer());
    setEditingIndex(null);
    setFile(null);
    setPreview(null);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(nextFile);
    event.target.value = "";
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.role.trim() || !draft.achievement.trim()) {
      alert("Please fill in player name, class, and achievement.");
      return;
    }

    let image = draft.image;
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("page", "sports");
        formData.append("section", "sports");
        formData.append("title", `${badge} ${draft.name}`);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Player image upload failed");
        const uploadData = await res.json();
        image = uploadData.upload.src;
      } catch (error) {
        console.error(error);
        alert("Failed to upload player image.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const player: ShowcasePlayer = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      achievement: draft.achievement.trim(),
      image,
    };
    const next = editingIndex === null
      ? [...players, player]
      : players.map((existing, index) => (index === editingIndex ? player : existing));
    onChange(next);
    resetForm();
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-6">
      <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2">
        <Users size={18} className="text-accent" />
        <span>{title}</span>
        <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-accent">{players.length}</span>
      </h2>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-[#081736]/25 border border-white/5 p-4 rounded-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Player Name *</label>
          <input
            type="text"
            required
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. Ms. Priyanka Sirvi"
            className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Role / Class *</label>
          <input
            type="text"
            required
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            placeholder="e.g. Class X"
            className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Achievement *</label>
          <input
            type="text"
            required
            value={draft.achievement}
            onChange={(e) => setDraft({ ...draft, achievement: e.target.value })}
            placeholder={achievementPlaceholder}
            className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Player Photo (Optional)</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" id={inputId} />
            <label htmlFor={inputId} className="bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-lg border border-white/5 text-xs font-bold cursor-pointer flex items-center gap-2">
              <Upload size={14} />
              Choose Photo
            </label>
            {preview && (
              <div className="flex items-center gap-2 bg-[#081736] px-3 py-1 rounded-lg border border-accent/20">
                <img src={preview} alt="" className="w-6 h-6 object-cover rounded-full" />
                <span className="text-[10px] text-white/60">Selected</span>
                <button type="button" onClick={() => { setFile(null); setPreview(draft.image || null); }} className="text-red-400 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {editingIndex !== null && (
            <button type="button" onClick={resetForm} className="mr-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white/70 hover:bg-white/10">
              Cancel
            </button>
          )}
          <button type="submit" disabled={uploading} className="bg-white hover:bg-white/90 text-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {editingIndex === null ? "Add Player" : "Update Player"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {players.length === 0 ? (
          <p className="text-center py-6 text-white/40 text-xs font-semibold uppercase">No {badge.toLowerCase()} players yet</p>
        ) : (
          players.map((player, index) => (
            <div key={`${player.name}-${index}`} className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 flex items-center gap-4 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {player.image ? (
                    <img src={player.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="text-white/30" size={20} />
                  )}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-sm font-black text-white uppercase truncate">{player.name}</h4>
                  <p className="text-xs text-white/50 font-bold">{player.role}</p>
                  <p className="text-[10px] text-accent font-bold uppercase mt-1 tracking-wider">{player.achievement}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(player);
                    setEditingIndex(index);
                    setFile(null);
                    setPreview(player.image || null);
                  }}
                  className="p-2 bg-accent/10 hover:bg-accent hover:text-primary text-accent rounded-lg transition-colors"
                  aria-label={`Edit ${player.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(players.filter((_, itemIndex) => itemIndex !== index))}
                  className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-colors"
                  aria-label={`Delete ${player.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
