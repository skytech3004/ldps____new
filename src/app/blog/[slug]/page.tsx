"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Tag, Feather } from "lucide-react";

type BlogType = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage?: string;
  tags: string[];
  status: "Draft" | "Published";
  publishedAt: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load blog detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans">
        <Navbar />
        <div className="pt-48 pb-32 text-center">
          <div className="w-8 h-8 border-4 border-[#3D348B] border-t-accent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Article...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !blog || blog.status === "Draft") {
    notFound();
  }

  const dateStr = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const authorName = blog.author || "Vidyawadi Editorial Team";
  const authorImg = blog.authorImage || "";

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans">
      <Navbar />
      
      <article className="pt-36 pb-24 px-6 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-start">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3D348B] hover:text-[#7678ED] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Articles
          </Link>
        </div>

        <div className="space-y-4">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-accent text-[#3D348B] px-3 py-1 rounded-full"
                >
                  <Tag size={8} />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] leading-tight uppercase font-montserrat tracking-tight">
            {blog.title}
          </h1>

          {/* Author Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#3D348B]/10 border-2 border-accent shrink-0 shadow-sm">
                {authorImg ? (
                  <img src={authorImg} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#3D348B] flex items-center justify-center text-accent font-black text-base">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Written By</p>
                <p className="text-base font-black text-[#3D348B] leading-tight">{authorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Calendar size={14} className="text-accent" />
              <span>{dateStr}</span>
            </div>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-[2rem] overflow-hidden shadow-md bg-slate-100 border border-gray-100">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/lps-vidhyawadi/about-banner.jpg";
            }}
          />
        </div>

        {/* Content Area */}
        <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-6 pt-4">
          {/<[a-z][\s\S]*>/i.test(blog.content) ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <div className="space-y-4 whitespace-pre-wrap">
              {blog.content.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          )}
        </div>

        {/* Writer Profile Footer Card */}
        <div className="mt-12 bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#F7B801] shrink-0 shadow-sm">
            {authorImg ? (
              <img src={authorImg} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#3D348B] flex items-center justify-center text-white font-black text-2xl">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-2 text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#3D348B] bg-[#7678ED]/10 px-3 py-1 rounded-full">
              <Feather size={12} className="text-accent" />
              <span>Article Author</span>
            </div>
            <h3 className="text-xl font-black text-[#3D348B] uppercase font-montserrat">{authorName}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Educator and contributor to the Vidyawadi Journal, sharing insights on academics, student growth, and institutional excellence.
            </p>
          </div>
        </div>
      </article>
      
      <Footer />
    </main>
  );
}
