"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Award, Trophy, Star, FileSpreadsheet, Sparkles, ChevronRight, Check } from "lucide-react";

interface Topper {
  name: string;
  class: "Class X" | "Class XII";
  stream: string;
  score: string;
  rank: number;
  medal: string;
  description: string;
}

interface Student {
  name: string;
  class: "Class X" | "Class XII";
  stream: string;
  percent: number;
  status: string;
}

interface BoardResult {
  _id: string;
  year: string;
  passPercentage: string;
  highestScore: string;
  highestScoreScorer: string;
  distinctionsCount: number;
  batchAverage: string;
  toppers: Topper[];
  students: Student[];
}

export default function AdminResultsPage() {
  const [resultYears, setResultYears] = useState<BoardResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BoardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New year inputs
  const [newYearName, setNewYearName] = useState("");

  // Editor states
  const [passPercentage, setPassPercentage] = useState("100%");
  const [highestScore, setHighestScore] = useState("0.0%");
  const [highestScoreScorer, setHighestScoreScorer] = useState("");
  const [distinctionsCount, setDistinctionsCount] = useState(0);
  const [batchAverage, setBatchAverage] = useState("0.0%");
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Topper form states
  const [tName, setTName] = useState("");
  const [tClass, setTClass] = useState<"Class X" | "Class XII">("Class XII");
  const [tStream, setTStream] = useState("Science");
  const [tScore, setTScore] = useState("");
  const [tRank, setTRank] = useState(1);
  const [tMedal, setTMedal] = useState("star");
  const [tDesc, setTDesc] = useState("");
  const [editingTopperIndex, setEditingTopperIndex] = useState<number | null>(null);

  // Student form states
  const [sName, setSName] = useState("");
  const [sClass, setSClass] = useState<"Class X" | "Class XII">("Class XII");
  const [sStream, setSStream] = useState("Science");
  const [sPercent, setSPercent] = useState<number>(0);
  const [sStatus, setSStatus] = useState("Distinction");
  const [editingStudentIndex, setEditingStudentIndex] = useState<number | null>(null);

  // Active tab within editor
  const [editorTab, setEditorTab] = useState<"stats" | "toppers" | "students">("stats");

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/results");
      if (res.ok) {
        const data = await res.json();
        setResultYears(data);
        if (data.length > 0) {
          // Select first year if none is selected
          const defaultSelect = selectedResult 
            ? data.find((r: BoardResult) => r.year === selectedResult.year) || data[0]
            : data[0];
          selectResult(defaultSelect);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error loading board results data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const selectResult = (result: BoardResult) => {
    setSelectedResult(result);
    setPassPercentage(result.passPercentage);
    setHighestScore(result.highestScore);
    setHighestScoreScorer(result.highestScoreScorer);
    setDistinctionsCount(result.distinctionsCount);
    setBatchAverage(result.batchAverage);
    setToppers(result.toppers || []);
    setStudents(result.students || []);
    resetTopperForm();
    resetStudentForm();
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanYear = newYearName.trim();
    if (!cleanYear) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: cleanYear }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create year.");
      }
      setNewYearName("");
      // Refresh list
      const listRes = await fetch("/api/admin/results");
      if (listRes.ok) {
        const listData = await listRes.json();
        setResultYears(listData);
        const newlyCreated = listData.find((r: BoardResult) => r.year === cleanYear);
        if (newlyCreated) selectResult(newlyCreated);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error creating year.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveData = async () => {
    if (!selectedResult) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedResult._id,
          year: selectedResult.year,
          passPercentage,
          highestScore,
          highestScoreScorer,
          distinctionsCount,
          batchAverage,
          toppers,
          students,
        }),
      });

      if (!res.ok) throw new Error("Failed to save data.");
      
      alert("Results updated successfully!");
      // Reload year data
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error saving result configurations.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteYear = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result year? This removes all associated toppers and student marks lists!")) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed.");
      setSelectedResult(null);
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error deleting board results year.");
    } finally {
      setSaving(false);
    }
  };

  // Toppers array CRUD
  const handleAddTopper = () => {
    if (!tName.trim() || !tScore.trim()) return;

    const newTopper: Topper = {
      name: tName.trim(),
      class: tClass,
      stream: tStream,
      score: tScore.trim(),
      rank: Number(tRank) || 1,
      medal: tMedal,
      description: tDesc.trim(),
    };

    if (editingTopperIndex !== null) {
      const next = [...toppers];
      next[editingTopperIndex] = newTopper;
      setToppers(next);
      setEditingTopperIndex(null);
    } else {
      setToppers([...toppers, newTopper]);
    }
    resetTopperForm();
  };

  const handleEditTopper = (idx: number) => {
    const t = toppers[idx];
    setTName(t.name);
    setTClass(t.class);
    setTStream(t.stream);
    setTScore(t.score);
    setTRank(t.rank);
    setTMedal(t.medal);
    setTDesc(t.description || "");
    setEditingTopperIndex(idx);
  };

  const handleDeleteTopper = (idx: number) => {
    setToppers(toppers.filter((_, i) => i !== idx));
    if (editingTopperIndex === idx) setEditingTopperIndex(null);
  };

  const resetTopperForm = () => {
    setTName("");
    setTScore("");
    setTRank(1);
    setTMedal("star");
    setTDesc("");
    setEditingTopperIndex(null);
  };

  // Students array CRUD
  const handleAddStudent = () => {
    if (!sName.trim() || !sPercent) return;

    const newStudent: Student = {
      name: sName.trim(),
      class: sClass,
      stream: sStream,
      percent: Number(sPercent) || 0,
      status: sStatus.trim(),
    };

    if (editingStudentIndex !== null) {
      const next = [...students];
      next[editingStudentIndex] = newStudent;
      setStudents(next);
      setEditingStudentIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }
    resetStudentForm();
  };

  const handleEditStudent = (idx: number) => {
    const s = students[idx];
    setSName(s.name);
    setSClass(s.class);
    setSStream(s.stream);
    setSPercent(s.percent);
    setSStatus(s.status);
    setEditingStudentIndex(idx);
  };

  const handleDeleteStudent = (idx: number) => {
    setStudents(students.filter((_, i) => i !== idx));
    if (editingStudentIndex === idx) setEditingStudentIndex(null);
  };

  const resetStudentForm = () => {
    setSName("");
    setSPercent(0);
    setSStatus("Distinction");
    setEditingStudentIndex(null);
  };

  return (
    <section className="space-y-6 text-white font-montserrat">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase font-sans">Administration</p>
          <h1 className="text-4xl font-black mt-2 flex items-center gap-3">
            <Trophy size={36} className="text-accent" />
            <span>Academic Results Hub</span>
          </h1>
          <p className="text-white/70 mt-2">Manage dynamic board topper lists and full marks directories by academic year.</p>
        </div>
        <div className="flex items-center gap-3">
          {saving ? (
            <div className="px-4 py-2 rounded-xl border border-accent/20 bg-accent/10 text-accent flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Saving Configuration...</span>
            </div>
          ) : (
            <button
              onClick={handleSaveData}
              disabled={!selectedResult}
              className="bg-accent hover:bg-accent-hover text-primary font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-md shadow-accent/10"
            >
              Save Results Data
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading boards databases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Result Years list & Creation */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Create year */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider border-b border-white/5 pb-2">Add Result Year</h3>
              <form onSubmit={handleCreateYear} className="space-y-3">
                <input
                  type="text"
                  required
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  placeholder="e.g. 2026-27"
                  className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={saving || !newYearName.trim()}
                  className="w-full bg-accent hover:bg-accent-hover text-primary font-black text-[10px] uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  <span>Create Year</span>
                </button>
              </form>
            </div>

            {/* List of Years */}
            <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider border-b border-white/5 pb-2">Select Result Year</h3>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                {resultYears.length === 0 ? (
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-center py-4">No records found</p>
                ) : (
                  resultYears.map((ry) => (
                    <div
                      key={ry._id}
                      onClick={() => selectResult(ry)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedResult?.year === ry.year
                          ? "bg-accent/15 border-accent text-accent"
                          : "bg-[#0b1738]/50 border-white/5 text-white/80 hover:bg-[#0b1738]/80"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">Result {ry.year}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteYear(ry._id);
                        }}
                        className="p-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Year"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Selected Year Details Editor */}
          <div className="lg:col-span-9">
            {!selectedResult ? (
              <div className="border border-dashed border-white/15 rounded-3xl p-24 text-center text-white/35 flex flex-col items-center justify-center gap-3">
                <Trophy size={48} />
                <h3 className="text-lg font-black uppercase tracking-wider">No Board Record Selected</h3>
                <p className="text-xs text-white/50 max-w-sm">Create a new academic year or select an existing one on the left menu to customize toppers portfolios.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/15 bg-[#0f234f]/80 overflow-hidden shadow-2xl flex flex-col">
                
                {/* Year Header Indicator */}
                <div className="bg-[#112759]/60 px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    <span className="font-extrabold text-sm uppercase tracking-wider">Currently Editing: Result {selectedResult.year}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full border border-white/5">
                    {toppers.length} Toppers • {students.length} Registry Entries
                  </span>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex border-b border-white/5 bg-[#0b1738]/30">
                  <button
                    onClick={() => setEditorTab("stats")}
                    className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      editorTab === "stats" ? "border-accent text-accent font-black" : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    1. Statistics Overview
                  </button>
                  <button
                    onClick={() => setEditorTab("toppers")}
                    className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      editorTab === "toppers" ? "border-accent text-accent font-black" : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    2. Toppers Cards ({toppers.length})
                  </button>
                  <button
                    onClick={() => setEditorTab("students")}
                    className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      editorTab === "students" ? "border-accent text-accent font-black" : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    3. Student Directory ({students.length})
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-6">
                  
                  {/* Tab 1: Stats */}
                  {editorTab === "stats" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Pass Percentage</label>
                        <input
                          type="text"
                          value={passPercentage}
                          onChange={(e) => setPassPercentage(e.target.value)}
                          placeholder="e.g. 100%"
                          className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/60">School Highest Score (%)</label>
                        <input
                          type="text"
                          value={highestScore}
                          onChange={(e) => setHighestScore(e.target.value)}
                          placeholder="e.g. 98.4%"
                          className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/60">School Highest Scorer</label>
                        <input
                          type="text"
                          value={highestScoreScorer}
                          onChange={(e) => setHighestScoreScorer(e.target.value)}
                          placeholder="e.g. Ms. Bhavya Sharma (Class X)"
                          className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Distinctions Count (&gt;90%)</label>
                        <input
                          type="number"
                          value={distinctionsCount}
                          onChange={(e) => setDistinctionsCount(Number(e.target.value))}
                          className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Batch Average Score</label>
                        <input
                          type="text"
                          value={batchAverage}
                          onChange={(e) => setBatchAverage(e.target.value)}
                          placeholder="e.g. 91.8%"
                          className="w-full bg-[#0b1738] border border-white/15 text-white rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Toppers */}
                  {editorTab === "toppers" && (
                    <div className="space-y-6">
                      
                      {/* Inline Form to Add/Edit Topper */}
                      <div className="bg-[#0b1738]/50 p-4 border border-white/5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-1.5">
                          <Award size={14} />
                          <span>{editingTopperIndex !== null ? "Edit Topper Details" : "Create New Topper Card"}</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Student Name</label>
                            <input
                              type="text"
                              value={tName}
                              onChange={(e) => setTName(e.target.value)}
                              placeholder="Ms. Name"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Class</label>
                            <select
                              value={tClass}
                              onChange={(e) => setTClass(e.target.value as any)}
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            >
                              <option value="Class XII">Class XII (Senior Secondary)</option>
                              <option value="Class X">Class X (Secondary)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Stream/Division</label>
                            <input
                              type="text"
                              value={tStream}
                              onChange={(e) => setTStream(e.target.value)}
                              placeholder="e.g. Science, Commerce, General"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Topper Score (%)</label>
                            <input
                              type="text"
                              value={tScore}
                              onChange={(e) => setTScore(e.target.value)}
                              placeholder="e.g. 98.2%"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Rank</label>
                            <input
                              type="number"
                              value={tRank}
                              onChange={(e) => setTRank(Number(e.target.value))}
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Medal Tier</label>
                            <select
                              value={tMedal}
                              onChange={(e) => setTMedal(e.target.value)}
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            >
                              <option value="gold">Gold Medalist</option>
                              <option value="silver">Silver Medalist</option>
                              <option value="bronze">Bronze Medalist</option>
                              <option value="star">Star Distinction</option>
                            </select>
                          </div>

                          <div className="space-y-1 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-white/50">Description Achievement Quote</label>
                            <input
                              type="text"
                              value={tDesc}
                              onChange={(e) => setTDesc(e.target.value)}
                              placeholder="e.g. School Topper - Honored with laptop by Chief Minister..."
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          {editingTopperIndex !== null && (
                            <button
                              type="button"
                              onClick={resetTopperForm}
                              className="px-4 py-2 border border-white/10 text-white/70 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleAddTopper}
                            disabled={!tName || !tScore}
                            className="bg-accent hover:bg-accent-hover text-primary font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all flex items-center gap-1 shadow-md shadow-accent/10"
                          >
                            {editingTopperIndex !== null ? <Check size={12} /> : <Plus size={12} />}
                            <span>{editingTopperIndex !== null ? "Save Card" : "Add Topper Card"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Toppers Cards List */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Currently Configured Toppers</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {toppers.length === 0 ? (
                            <p className="col-span-2 text-center text-white/40 text-xs py-6 uppercase font-bold tracking-wider">No toppers card created yet.</p>
                          ) : (
                            toppers.map((t, idx) => (
                              <div key={idx} className="bg-[#0b1738]/30 border border-white/5 p-4 rounded-xl flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white/80">{t.class}</span>
                                    <span className="text-[9px] font-black uppercase bg-accent/20 border border-accent/30 text-accent px-2 py-0.5 rounded-full">Rank #{t.rank}</span>
                                  </div>
                                  <h5 className="font-extrabold text-sm text-white">{t.name}</h5>
                                  <p className="text-[10px] text-white/40">{t.stream} • Score: {t.score}</p>
                                  {t.description && <p className="text-[10px] italic text-white/60 truncate max-w-[200px] mt-1">&quot;{t.description}&quot;</p>}
                                </div>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleEditTopper(idx)}
                                    className="p-1.5 bg-white/5 text-white/80 hover:bg-accent/25 hover:text-accent rounded border border-white/5 transition-all"
                                    title="Edit"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopper(idx)}
                                    className="p-1.5 bg-white/5 text-white/80 hover:bg-red-500/25 hover:text-red-400 rounded border border-white/5 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 3: Student Registry */}
                  {editorTab === "students" && (
                    <div className="space-y-6">
                      
                      {/* Inline Form to Add/Edit Student Registry */}
                      <div className="bg-[#0b1738]/50 p-4 border border-white/5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-1.5">
                          <FileSpreadsheet size={14} />
                          <span>{editingStudentIndex !== null ? "Edit Student Record" : "Add Student Registry Row"}</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Student Name</label>
                            <input
                              type="text"
                              value={sName}
                              onChange={(e) => setSName(e.target.value)}
                              placeholder="Ms. Name"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Class</label>
                            <select
                              value={sClass}
                              onChange={(e) => setSClass(e.target.value as any)}
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            >
                              <option value="Class XII">Class XII (Senior Secondary)</option>
                              <option value="Class X">Class X (Secondary)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Stream/Division</label>
                            <input
                              type="text"
                              value={sStream}
                              onChange={(e) => setSStream(e.target.value)}
                              placeholder="e.g. Science, General"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Aggregate Score %</label>
                            <input
                              type="number"
                              step="0.1"
                              value={sPercent || ""}
                              onChange={(e) => setSPercent(Number(e.target.value))}
                              placeholder="e.g. 95.8"
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-white/50">Merit Status</label>
                            <input
                              type="text"
                              value={sStatus}
                              onChange={(e) => setSStatus(e.target.value)}
                              placeholder="e.g. Distinction, Merit..."
                              className="w-full bg-[#0b1738] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          {editingStudentIndex !== null && (
                            <button
                              type="button"
                              onClick={resetStudentForm}
                              className="px-4 py-2 border border-white/10 text-white/70 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleAddStudent}
                            disabled={!sName || !sPercent}
                            className="bg-accent hover:bg-accent-hover text-primary font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all flex items-center gap-1 shadow-md shadow-accent/10"
                          >
                            {editingStudentIndex !== null ? <Check size={12} /> : <Plus size={12} />}
                            <span>{editingStudentIndex !== null ? "Save Student" : "Add Student"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Students List Directory */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Marks Directory Table</h4>
                        <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0b1738]/30 max-h-[400px] overflow-y-auto pr-1">
                          <table className="w-full text-left text-xs text-white/80">
                            <thead>
                              <tr className="bg-[#0b1738]/80 text-[10px] text-white/50 uppercase tracking-widest border-b border-white/5">
                                <th className="p-3">Index</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Class</th>
                                <th className="p-3">Stream</th>
                                <th className="p-3">Percent</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="p-6 text-center text-white/30 uppercase font-bold">No students registered yet.</td>
                                </tr>
                              ) : (
                                students.map((s, idx) => (
                                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3 text-white/40 font-bold">#{idx + 1}</td>
                                    <td className="p-3 font-extrabold text-white">{s.name}</td>
                                    <td className="p-3 text-[10px] uppercase font-bold text-white/50">{s.class}</td>
                                    <td className="p-3 text-[10px] uppercase font-semibold text-white/50">{s.stream}</td>
                                    <td className="p-3 font-black text-white">{s.percent}%</td>
                                    <td className="p-3">
                                      <span className="text-[9px] font-black uppercase bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
                                        {s.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right flex gap-1 justify-end">
                                      <button
                                        onClick={() => handleEditStudent(idx)}
                                        className="p-1.5 bg-white/5 text-white/80 hover:bg-accent/25 hover:text-accent rounded border border-white/5 transition-all"
                                        title="Edit"
                                      >
                                        <Edit2 size={10} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStudent(idx)}
                                        className="p-1.5 bg-white/5 text-white/80 hover:bg-red-500/25 hover:text-red-400 rounded border border-white/5 transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Footer Save Button Action */}
                <div className="bg-[#112759]/40 border-t border-white/5 p-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Always hit Save at the top right to commit.</span>
                  <button
                    onClick={handleSaveData}
                    className="bg-accent hover:bg-accent-hover text-primary font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md shadow-accent/10"
                  >
                    Commit {selectedResult.year} Board Changes
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      )}
    </section>
  );
}
