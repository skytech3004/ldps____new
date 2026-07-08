"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";
import { BookOpen, Calendar, User, ArrowRight, BookMarked } from "lucide-react";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  tags: string[];
  publishedAt: string;
};

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

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

      {/* Journal Index - 120-160px Spacing */}
      <section className="py-32 md:py-40 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Compiling journal feed...</p>
          </div>
        ) : blogs.length === 0 ? (
          <FadeIn>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-2xl mx-auto shadow-premium-sm">
              <BookMarked size={36} className="text-[#7678ED] mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">No Articles Published</h3>
              <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                Stay tuned! Our educational council is compiling stories. They will show up here very soon.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, idx) => (
              <FadeIn key={post._id} delay={idx * 0.04}>
                <div 
                  className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-premium-sm hover:shadow-premium-lg hover:-translate-y-1.5 transition-all duration-500 h-full"
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
                  </div>

                  {/* Metadata & Details */}
                  <div className="p-6 md:p-8 flex flex-col flex-1 text-left space-y-4 justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="px-2.5 py-0.5 bg-[#7678ED]/10 text-[#3D348B] text-[9px] font-black uppercase tracking-wider rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-lg md:text-xl font-black text-[#3D348B] uppercase tracking-tight leading-snug group-hover:text-secondary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-500 text-xs font-bold leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div className="text-left text-[10px] text-gray-400 font-bold space-y-0.5">
                        <p className="flex items-center gap-1.5"><User size={10} /> {post.author}</p>
                        <p className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(post.publishedAt).toLocaleDateString()}</p>
                      </div>

                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="inline-flex items-center justify-center gap-1 bg-accent/15 hover:bg-accent text-[#3D348B] p-2.5 rounded-xl font-black transition-colors"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
