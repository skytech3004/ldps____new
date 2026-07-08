"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, User, ArrowRight, BookMarked, X, ChevronDown, Tag } from "lucide-react";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  status: "Draft" | "Published";
  publishedAt: string;
};

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Sort State
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  // Accordion State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  // Lightbox Modal State
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const [filters, setFilters] = useState<string[]>(["All", "Academic", "Events", "Hostel", "Others"]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
          
          // Initialize first accordion group to be open by default
          if (data && data.length > 0) {
            const date = new Date(data[0].publishedAt);
            const firstGroup = `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getFullYear()}`;
            setOpenAccordions({ [firstGroup]: true });
          }
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchFilters() {
      try {
        const res = await fetch("/api/admin/filters?type=blog");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFilters(["All", ...data.map((f: any) => f.name)]);
          }
        }
      } catch (err) {
        console.error("Failed to load blog filters:", err);
      }
    }
    fetchBlogs();
    fetchFilters();
  }, []);

  // Category matching logic
  const matchesCategory = (post: BlogPost, filter: string) => {
    if (filter === "All") return true;
    const tagsLower = post.tags.map((t) => t.toLowerCase());
    
    if (filter === "Academic") {
      return tagsLower.some(
        (t) =>
          t.includes("academic") ||
          t.includes("study") ||
          t.includes("class") ||
          t.includes("curriculum") ||
          t.includes("science") ||
          t.includes("commerce") ||
          t.includes("arts")
      );
    }
    if (filter === "Events") {
      return tagsLower.some(
        (t) =>
          t.includes("event") ||
          t.includes("celebration") ||
          t.includes("activity") ||
          t.includes("activities") ||
          t.includes("conservation") ||
          t.includes("fest")
      );
    }
    if (filter === "Hostel") {
      return tagsLower.some(
        (t) =>
          t.includes("hostel") ||
          t.includes("boarding") ||
          t.includes("mess") ||
          t.includes("residence")
      );
    }
    
    // Others matches everything else
    const knownKeywords = [
      "academic", "study", "class", "curriculum", "science", "commerce", "arts",
      "event", "celebration", "activity", "activities", "conservation", "fest",
      "hostel", "boarding", "mess", "residence"
    ];
    return !tagsLower.some((t) => knownKeywords.some((k) => t.includes(k)));
  };

  const filteredBlogs = blogs.filter((post) => matchesCategory(post, activeFilter));

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Group blogs by Month Year
  const groupedBlogs: Record<string, BlogPost[]> = {};
  sortedBlogs.forEach((post) => {
    const date = new Date(post.publishedAt);
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    const groupKey = `${month} ${year}`;
    if (!groupedBlogs[groupKey]) {
      groupedBlogs[groupKey] = [];
    }
    groupedBlogs[groupKey].push(post);
  });

  const groupKeys = Object.keys(groupedBlogs);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Lock scroll when modal is active
  useEffect(() => {
    if (activePost !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePost]);

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans antialiased selection:bg-accent selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 bg-gradient-to-br from-[#3D348B] to-[#7678ED] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span className="text-white/80">Blog & Stories</span>
          </div>
          
          <Reveal width="100%">
            <h1 className="text-4xl md:text-6xl font-black font-montserrat uppercase tracking-tight text-accent leading-none">
              Vidyawadi Journal
            </h1>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <p className="text-white/80 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
              Explore school stories, educational research insights, parent tips, and student accomplishments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filters and Sorting Controls */}
      <section className="pt-16 pb-6 px-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-[#3D348B] text-white shadow-premium-sm"
                  : "bg-white text-[#3D348B] border border-slate-100 hover:bg-[#F1F2F6]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort by Date:</span>
          <div className="inline-flex rounded-xl bg-white border border-slate-150 p-1 shadow-premium-xs">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                sortOrder === "newest"
                  ? "bg-[#3D348B] text-white"
                  : "text-gray-400 hover:text-[#3D348B]"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                sortOrder === "oldest"
                  ? "bg-[#3D348B] text-white"
                  : "text-gray-400 hover:text-[#3D348B]"
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </section>

      {/* Journal Index grouped by Month/Year in Accordions */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Compiling journal feed...</p>
          </div>
        ) : sortedBlogs.length === 0 ? (
          <FadeIn>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto shadow-premium-sm">
              <BookMarked size={36} className="text-[#7678ED] mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Articles Found</h3>
              <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                Stay tuned! No articles match the category &quot;{activeFilter}&quot;. Check out other options.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-8">
            {groupKeys.map((groupKey) => {
              const isOpen = !!openAccordions[groupKey];
              const posts = groupedBlogs[groupKey];

              return (
                <div 
                  key={groupKey}
                  className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300"
                >
                  {/* Group header accordion button */}
                  <button
                    onClick={() => toggleAccordion(groupKey)}
                    className="w-full flex items-center justify-between p-6 md:p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                      <h2 className="text-lg md:text-2xl font-black text-[#3D348B] uppercase tracking-tight font-montserrat">
                        {groupKey}
                      </h2>
                      <span className="px-2.5 py-0.5 bg-[#7678ED]/10 text-[#3D348B] text-[10px] font-black rounded-full uppercase tracking-wider">
                        {posts.length} {posts.length === 1 ? "Article" : "Articles"}
                      </span>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown size={20} className="text-[#3D348B]" />
                    </div>
                  </button>

                  {/* Group Content Accordion Grid */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {posts.map((post, idx) => (
                            <motion.div 
                              key={post._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-premium-xs hover:shadow-premium-lg hover:-translate-y-1.5 transition-all duration-500 h-full relative cursor-pointer"
                              onClick={() => setActivePost(post)}
                            >
                              {/* Aspect Cover Image */}
                              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                                <img 
                                  src={post.image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.src = "/lps-vidhyawadi/gallery-04.jpg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-[#3D348B]/10 group-hover:bg-[#3D348B]/20 transition-colors"></div>
                                {/* Quick read button visible on hover */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="px-4 py-2 bg-[#F7B801] text-[#3D348B] text-xs font-black uppercase tracking-widest rounded-xl shadow-premium-sm transform scale-90 group-hover:scale-100 transition-transform">
                                    Quick Read
                                  </span>
                                </div>
                              </div>

                              {/* Metadata & Details */}
                              <div className="p-6 flex flex-col flex-1 text-left space-y-4 justify-between">
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, tagIdx) => (
                                      <span key={tagIdx} className="px-2.5 py-0.5 bg-[#7678ED]/10 text-[#3D348B] text-[9px] font-black uppercase tracking-wider rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  <h3 className="text-lg font-black text-[#3D348B] uppercase tracking-tight leading-snug group-hover:text-[#7678ED] transition-colors">
                                    {post.title}
                                  </h3>
                                  
                                  <p className="text-gray-500 text-xs font-bold leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                  <div className="text-left text-[10px] text-gray-400 font-bold space-y-0.5">
                                    <p className="flex items-center gap-1.5"><User size={10} /> {post.author}</p>
                                    <p className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(post.publishedAt).toLocaleDateString()}</p>
                                  </div>

                                  <Link 
                                    href={`/blog/${post.slug}`} 
                                    onClick={(e) => e.stopPropagation()} // Stop modal triggers when clicking details direct link
                                    className="inline-flex items-center justify-center gap-1.5 bg-[#3D348B]/10 hover:bg-[#3D348B] text-[#3D348B] hover:text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                  >
                                    Detail <ArrowRight size={10} />
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick-Read Article Lightbox Modal */}
      <AnimatePresence>
        {activePost !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePost(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F8F9FC] border border-slate-100 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Top Bar */}
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7678ED]">
                  <BookOpen size={12} className="text-accent" />
                  Quick Read Journal
                </span>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-full text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="p-8 overflow-y-auto space-y-6 flex-grow text-left">
                {/* Header Metadata */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {activePost.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase bg-[#7678ED]/10 text-[#3D348B] px-3 py-1 rounded-full">
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#3D348B] font-montserrat uppercase tracking-tight leading-snug">
                    {activePost.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-gray-400 border-b border-gray-100 pb-5">
                    <span className="flex items-center gap-2">
                      <Calendar size={13} className="text-accent" />
                      {new Date(activePost.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <User size={13} className="text-accent" />
                      Published by {activePost.author}
                    </span>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="aspect-[16/9] rounded-[1.8rem] overflow-hidden shadow-inner border border-slate-100 bg-slate-50">
                  <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
                </div>

                {/* Rich HTML Content */}
                <div 
                  className="prose prose-sm md:prose-base max-w-none text-gray-600 font-medium leading-relaxed space-y-4 pt-2 border-b border-gray-100 pb-6"
                  dangerouslySetInnerHTML={{ __html: activePost.content }}
                />

                {/* Actions bottom */}
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setActivePost(null)}
                    className="px-5 py-3 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors text-gray-500"
                  >
                    Close
                  </button>
                  <Link 
                    href={`/blog/${activePost.slug}`}
                    onClick={() => setActivePost(null)}
                    className="px-6 py-3 bg-[#3D348B] hover:bg-[#7678ED] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-premium-sm flex items-center gap-2"
                  >
                    View Full Article Page
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
