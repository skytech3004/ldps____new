"use client";

import React, { useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LifeAtGis() {
  const [videoItems, setVideoItems] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/admin/media-items?type=highlight");
        if (res.ok) {
          const data = await res.json();
          setVideoItems(data.slice(0, 4)); // Get top 4 videos
          if (data && data.length > 0) {
            // Set the first video as active to autoplay immediately
            setActiveVideo(data[0].src);
          }
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    }
    fetchVideos();
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!isYouTubeUrl(url)) return url;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    if (videoId) {
      // enablejsapi=1 allows listening to ended event via postMessage
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`;
    }
    return url;
  };

  // Switch to the next video automatically
  const handleVideoEnd = () => {
    if (videoItems.length === 0) return;
    const currentSrc = activeVideo || videoItems[0]?.src;
    const currentIdx = videoItems.findIndex((item) => item.src === currentSrc);
    if (currentIdx !== -1) {
      const nextIdx = (currentIdx + 1) % videoItems.length;
      setActiveVideo(videoItems[nextIdx].src);
    }
  };

  // YouTube postMessage event listener for "ended" status
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com") && !event.origin.includes("youtube-nocookie.com")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onStateChange" && data.info === 0) {
          // state 0 is ended in YouTube Player API
          handleVideoEnd();
        }
      } catch (err) {
        // Suppress parsing errors for other message types
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeVideo, videoItems]);

  const currentSrc = activeVideo || (videoItems[0] ? videoItems[0].src : null);

  return (
    <section className="bg-white pb-32">
      {/* Top Banner with Curved Background */}
      <div className="relative bg-[#0b1736] pt-16 pb-32 overflow-hidden">
        {/* Background Curves Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute w-[200%] h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <svg className="absolute bottom-0 w-full h-auto text-white/10" viewBox="0 0 1440 320" fill="currentColor">
            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <h2 className="relative z-10 text-4xl lg:text-5xl font-black text-white text-center mb-16 uppercase tracking-tight">
          Campus Video Highlights
        </h2>

        {/* Video Thumbnails */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar items-center justify-center">
            {videoItems.map((video, i) => {
              const isYT = isYouTubeUrl(video.src);
              const thumb = isYT ? getYouTubeThumbnail(video.src) : null;
              const isActive = activeVideo === video.src;
              return (
                <div 
                  key={i} 
                  onClick={() => setActiveVideo(video.src)}
                  className={`min-w-[280px] w-[280px] md:w-[320px] aspect-video relative rounded-xl overflow-hidden shrink-0 snap-center shadow-2xl cursor-pointer group border-4 bg-black flex items-center justify-center transition-all ${
                    isActive ? "border-accent scale-105" : "border-white hover:border-accent/40"
                  }`}
                >
                  {isYT ? (
                    thumb && (
                      <Image 
                        src={thumb} 
                        alt={video.title} 
                        fill 
                        sizes="(max-width: 768px) 280px, 320px" 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    )
                  ) : (
                    <video 
                      src={video.src} 
                      preload="metadata" 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="text-white fill-white ml-0.5" size={18} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent font-sans">
                    <p className="text-white text-xs font-bold line-clamp-1">{video.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Video Player */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 -mt-20">
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border-8 border-white relative group">
           {currentSrc ? (
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentSrc}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
                 transition={{ duration: 0.4 }}
                 className="w-full h-full"
               >
                 {isYouTubeUrl(currentSrc) ? (
                   <iframe 
                     src={getYouTubeEmbedUrl(currentSrc)} 
                     className="w-full h-full" 
                     allow="autoplay; fullscreen"
                     allowFullScreen
                   />
                 ) : (
                   <video 
                     src={currentSrc} 
                     controls 
                     autoPlay 
                     muted 
                     playsInline
                     onEnded={handleVideoEnd}
                     preload="auto" 
                     className="w-full h-full object-contain" 
                   />
                 )}
               </motion.div>
             </AnimatePresence>
           ) : (
             <div className="w-full h-full flex items-center justify-center text-white font-bold">
               Loading Highlights...
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
