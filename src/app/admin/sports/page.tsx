"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, Plus, Trash2, Save, Loader2, Sparkles, Upload, X, Shield, ArrowUp, ArrowDown, Users, Image as ImageIcon, ClipboardList
} from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

interface Player {
  _id?: string;
  name: string;
  role: string;
  achievement: string;
  image: string;
}

interface Game {
  _id?: string;
  title: string;
  desc: string;
}

interface Stat {
  count: string;
  label: string;
}

export default function AdminSportsPage() {
  const [complexImages, setComplexImages] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for adding items
  const [newComplexImageFile, setNewComplexImageFile] = useState<File | null>(null);
  const [complexUploadPreview, setComplexUploadPreview] = useState<string | null>(null);
  const [uploadingComplex, setUploadingComplex] = useState(false);

  const [newPlayer, setNewPlayer] = useState<Player>({ name: "", role: "", achievement: "", image: "" });
  const [newPlayerFile, setNewPlayerFile] = useState<File | null>(null);
  const [playerUploadPreview, setPlayerUploadPreview] = useState<string | null>(null);
  const [uploadingPlayer, setUploadingPlayer] = useState(false);

  const [newGame, setNewGame] = useState<Game>({ title: "", desc: "" });

  const fetchSportsData = async () => {
    try {
      const res = await fetch("/api/admin/sports");
      if (!res.ok) throw new Error("Failed to load sports details");
      const data = await res.json();
      setComplexImages(data.complexImages || []);
      setPlayers(data.players || []);
      setGames(data.games || []);
      setStats(data.stats || [
        { count: "0", label: "District Selections" },
        { count: "0", label: "State Selections" },
        { count: "0", label: "National Selections" },
        { count: "0", label: "Total Selections" }
      ]);
    } catch (err) {
      console.error(err);
      alert("Error loading sports data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsData();
  }, []);

  const saveSportsData = async (nextComplex: string[], nextPlayers: Player[], nextGames: Game[], nextStats: Stat[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complexImages: nextComplex,
          players: nextPlayers,
          games: nextGames,
          stats: nextStats
        }),
      });
      if (!res.ok) throw new Error("Failed to save sports details");
    } catch (err) {
      console.error(err);
      alert("Failed to auto-save sports details.");
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  // Complex Images actions
  const handleComplexFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewComplexImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComplexUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadComplexImage = async () => {
    if (!newComplexImageFile) return;
    setUploadingComplex(true);
    try {
      const formData = new FormData();
      formData.append("file", newComplexImageFile);
      formData.append("page", "sports");
      formData.append("section", "sports");
      formData.append("title", "Sports Complex Image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      const nextComplex = [...complexImages, data.upload.src];
      setComplexImages(nextComplex);
      saveSportsData(nextComplex, players, games, stats);
      
      setNewComplexImageFile(null);
      setComplexUploadPreview(null);
    } catch (error) {
      console.error(error);
      alert("Failed to upload sports complex image.");
    } finally {
      setUploadingComplex(false);
    }
  };

  const deleteComplexImage = (index: number) => {
    const nextComplex = complexImages.filter((_, idx) => idx !== index);
    setComplexImages(nextComplex);
    saveSportsData(nextComplex, players, games, stats);
  };

  // Players actions
  const handlePlayerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPlayerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.role || !newPlayer.achievement) {
      alert("Please fill in player name, role, and achievement.");
      return;
    }

    let pImage = "";
    if (newPlayerFile) {
      setUploadingPlayer(true);
      try {
        const formData = new FormData();
        formData.append("file", newPlayerFile);
        formData.append("page", "sports");
        formData.append("section", "sports");
        formData.append("title", `Player ${newPlayer.name}`);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Player image upload failed");
        const uploadData = await res.json();
        pImage = uploadData.upload.src;
      } catch (err) {
        console.error(err);
        alert("Failed to upload player image.");
        setUploadingPlayer(false);
        return;
      } finally {
        setUploadingPlayer(false);
      }
    }

    const added: Player = {
      name: newPlayer.name,
      role: newPlayer.role,
      achievement: newPlayer.achievement,
      image: pImage
    };

    const nextPlayers = [...players, added];
    setPlayers(nextPlayers);
    saveSportsData(complexImages, nextPlayers, games, stats);

    setNewPlayer({ name: "", role: "", achievement: "", image: "" });
    setNewPlayerFile(null);
    setPlayerUploadPreview(null);
  };

  const deletePlayer = (index: number) => {
    const nextPlayers = players.filter((_, idx) => idx !== index);
    setPlayers(nextPlayers);
    saveSportsData(complexImages, nextPlayers, games, stats);
  };

  // Game Summaries actions
  const addGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.title || !newGame.desc) {
      alert("Please fill in game title and description.");
      return;
    }
    const nextGames = [...games, { title: newGame.title, desc: newGame.desc }];
    setGames(nextGames);
    saveSportsData(complexImages, players, nextGames, stats);
    setNewGame({ title: "", desc: "" });
  };

  const deleteGame = (index: number) => {
    const nextGames = games.filter((_, idx) => idx !== index);
    setGames(nextGames);
    saveSportsData(complexImages, players, nextGames, stats);
  };

  // Stats actions
  const updateStatCount = (index: number, countVal: string) => {
    const nextStats = [...stats];
    nextStats[index].count = countVal;
    setStats(nextStats);
    saveSportsData(complexImages, players, games, nextStats);
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">CMS Operations</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <Trophy size={36} className="text-accent" />
            <span>Sports & Selections</span>
          </h1>
          <p className="text-white/70 mt-2">Manage players, sports complex images, selections counters, and summaries. Saved automatically.</p>
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
          <p className="text-xs font-semibold uppercase tracking-wider">Loading sports dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Columns (8): Selections Stats, Player List, Games Summary */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stat Counters */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <span>Selections Stats Counter</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-bold text-white/50 uppercase truncate">{stat.label}</p>
                    <input 
                      type="text" 
                      value={stat.count}
                      onChange={(e) => updateStatCount(idx, e.target.value)}
                      className="w-full bg-[#081736] border border-white/10 rounded-lg px-3 py-2 text-xl font-black text-center text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Players Table / Upload Form */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-6">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2">
                <Users size={18} className="text-accent" />
                <span>National Players Showcase</span>
              </h2>

              <form onSubmit={addPlayer} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-[#081736]/25 border border-white/5 p-4 rounded-xl">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Player Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    placeholder="e.g. Ms. Manisha Kanwar"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Role / Class *</label>
                  <input 
                    type="text" 
                    required
                    value={newPlayer.role}
                    onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                    placeholder="e.g. XII Humanities"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Achievement *</label>
                  <input 
                    type="text" 
                    required
                    value={newPlayer.achievement}
                    onChange={(e) => setNewPlayer({ ...newPlayer, achievement: e.target.value })}
                    placeholder="e.g. 8 Times National Player"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Player Photo (Optional)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePlayerFileChange}
                      className="hidden"
                      id="player-photo-upload"
                    />
                    <label 
                      htmlFor="player-photo-upload"
                      className="bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-lg border border-white/5 text-xs font-bold cursor-pointer flex items-center gap-2"
                    >
                      <Upload size={14} />
                      Choose Photo
                    </label>
                    {playerUploadPreview && (
                      <div className="flex items-center gap-2 bg-[#081736] px-3 py-1 rounded-lg border border-accent/20">
                        <img src={playerUploadPreview} alt="Preview" className="w-6 h-6 object-cover rounded-full" />
                        <span className="text-[10px] text-white/60">Selected</span>
                        <button type="button" onClick={() => { setNewPlayerFile(null); setPlayerUploadPreview(null); }} className="text-red-400 hover:text-red-500">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={uploadingPlayer}
                    className="bg-white hover:bg-white/90 text-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploadingPlayer ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Add Player
                  </button>
                </div>
              </form>

              {/* Player list */}
              <div className="space-y-3">
                {players.length === 0 ? (
                  <p className="text-center py-6 text-white/40 text-xs font-semibold uppercase">No players registered yet</p>
                ) : (
                  players.map((p, idx) => (
                    <div key={idx} className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 flex items-center gap-4 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="text-white/30" size={20} />
                          )}
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-black text-white uppercase">{p.name}</h4>
                          <p className="text-xs text-white/50 font-bold">{p.role}</p>
                          <p className="text-[10px] text-accent font-bold uppercase mt-1 tracking-wider">{p.achievement}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deletePlayer(idx)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Game Summaries & Selections */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-6">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2">
                <ClipboardList size={18} className="text-accent" />
                <span>Game Summaries & Selections</span>
              </h2>

              <form onSubmit={addGame} className="space-y-4 bg-[#081736]/25 border border-white/5 p-4 rounded-xl text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Game Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newGame.title}
                    onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                    placeholder="e.g. Basketball Champions"
                    className="w-full bg-[#081736] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Description / Selection details *</label>
                  <TipTapEditor
                    value={newGame.desc}
                    onChange={(value) => setNewGame({ ...newGame, desc: value })}
                    placeholder="Provide details about divisions, district/state selections..."
                    uploadPage="sports"
                    uploadSection="sports"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-white hover:bg-white/90 text-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus size={12} />
                    Add Summary
                  </button>
                </div>
              </form>

              {/* Games summaries list */}
              <div className="space-y-3">
                {games.length === 0 ? (
                  <p className="text-center py-6 text-white/40 text-xs font-semibold uppercase">No game summaries entered yet</p>
                ) : (
                  games.map((g, idx) => (
                    <div key={idx} className="bg-[#081736]/40 border border-white/5 rounded-xl p-4 flex gap-4 justify-between items-start text-left">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white uppercase">{g.title}</h4>
                        <p className="text-xs text-white/60 font-semibold leading-relaxed">{g.desc}</p>
                      </div>
                      <button 
                        onClick={() => deleteGame(idx)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* Right Columns (4): Complex Images Carousel */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 text-left">
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-6">
              <h2 className="text-lg font-black border-b border-white/5 pb-2.5 flex items-center gap-2">
                <ImageIcon size={18} className="text-accent" />
                <span>Sports Complex Images</span>
              </h2>

              <div className="space-y-4">
                {complexUploadPreview ? (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-accent/20 bg-slate-900 flex items-center justify-center">
                    <img src={complexUploadPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setNewComplexImageFile(null); setComplexUploadPreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleComplexFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-32 bg-[#081736] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-accent/40 transition-colors">
                      <Upload size={24} className="text-white/40 group-hover:text-accent" />
                      <p className="text-[10px] font-bold text-white/50 uppercase">Upload Complex Image</p>
                    </div>
                  </div>
                )}

                {newComplexImageFile && (
                  <button 
                    onClick={uploadComplexImage}
                    disabled={uploadingComplex}
                    className="w-full bg-[#3D348B] hover:bg-[#3D348B]/95 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploadingComplex ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    <span>Add to Carousel</span>
                  </button>
                )}
              </div>

              {/* Complex Carousel Images Grid */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] text-accent font-black uppercase tracking-wider">Carousel Items ({complexImages.length})</p>
                {complexImages.length === 0 ? (
                  <p className="text-center py-6 text-white/30 text-xs uppercase font-semibold">No images uploaded</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {complexImages.map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/5 bg-slate-900 group">
                        <img src={img} alt={`Complex ${i + 1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => deleteComplexImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}
    </section>
  );
}
