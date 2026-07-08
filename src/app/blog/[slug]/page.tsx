import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogModel } from "@/models/Blog";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const { slug } = await params;
  
  const blog = await BlogModel.findOne({ slug, status: "Published" }).lean() as any;
  
  if (!blog) {
    notFound();
  }

  const dateStr = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800 font-sans">
      <Navbar />
      
      <article className="pt-36 pb-24 px-6 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-start">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal hover:text-navy transition-colors"
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
          <div className="flex items-center gap-6 text-xs md:text-sm font-bold text-gray-400 border-b border-gray-100 pb-6">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-accent" />
              {dateStr}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} className="text-accent" />
              Published by {blog.author}
            </span>
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
        <div 
          className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-6 pt-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
      
      <Footer />
    </main>
  );
}
