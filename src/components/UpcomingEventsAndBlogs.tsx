"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import FadeIn from "@/components/ui/FadeIn";

type BlogItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  tags?: string[];
};

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
};

type GalleryAlbum = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  cover?: string;
  photos?: string[];
  createdAt?: string;
};

type EventPhotoItem = {
  _id: string;
  title: string;
  src: string;
  alt?: string;
  category?: string;
  type?: string;
  createdAt?: string;
};

export default function UpcomingEventsAndBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventPhotos, setEventPhotos] = useState<EventPhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Calendar Date State
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 6, 1)); // Default starts July 2026

  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const currentMonthName = calendarDate.toLocaleDateString("en-US", { month: "long" });

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const rawDay = new Date(calendarYear, calendarMonth, 1).getDay();
  // Mon=0, Tue=1, ..., Sun=6
  const startDayOffset = (rawDay + 6) % 7;

  useEffect(() => {
    async function fetchData() {
      try {
        const [blogsRes, eventsRes, eventPhotosRes, legacyPhotosRes, galleriesRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/admin/events"),
          fetch("/api/admin/media-items?type=event-photo"),
          fetch("/api/admin/media-items?type=photo"),
          fetch("/api/admin/galleries"),
        ]);

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          setBlogs(blogsData.slice(0, 2)); // Get top 2 recent blogs
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }

        if (eventPhotosRes.ok) {
          const eventPhotosData = await eventPhotosRes.json();
          const normalizedEventPhotos = Array.isArray(eventPhotosData) ? eventPhotosData : [];

          if (legacyPhotosRes.ok) {
            const legacyPhotosData = await legacyPhotosRes.json();
            const legacyEventPhotos = Array.isArray(legacyPhotosData)
              ? legacyPhotosData.filter((item: EventPhotoItem) => item.category === "Events")
              : [];

            const mergedEventPhotos = [...normalizedEventPhotos, ...legacyEventPhotos].filter((item, index, array) => {
              return index === array.findIndex((other) => other._id === item._id);
            });

            if (mergedEventPhotos.length > 0) {
              setEventPhotos(mergedEventPhotos);
            } else if (galleriesRes.ok) {
              const galleriesData = await galleriesRes.json();
              const fallbackEventPhotos = Array.isArray(galleriesData)
                ? galleriesData
                    .filter((album: GalleryAlbum) => album.category === "Events")
                    .flatMap((album: GalleryAlbum) =>
                      (album.photos?.length ? album.photos : album.cover ? [album.cover] : []).map((photo, index) => ({
                        _id: `${album._id}-${index}`,
                        title: album.title,
                        src: photo,
                        alt: album.description || album.title,
                        category: album.category,
                        createdAt: album.createdAt,
                      }))
                    )
                : [];

              setEventPhotos(fallbackEventPhotos);
            }
          } else if (galleriesRes.ok) {
            const galleriesData = await galleriesRes.json();
            const fallbackEventPhotos = Array.isArray(galleriesData)
              ? galleriesData
                  .filter((album: GalleryAlbum) => album.category === "Events")
                  .flatMap((album: GalleryAlbum) =>
                    (album.photos?.length ? album.photos : album.cover ? [album.cover] : []).map((photo, index) => ({
                      _id: `${album._id}-${index}`,
                      title: album.title,
                      src: photo,
                      alt: album.description || album.title,
                      category: album.category,
                      createdAt: album.createdAt,
                    }))
                  )
              : [];

            setEventPhotos(fallbackEventPhotos);
          }
        }
      } catch (err) {
        console.error("Failed to fetch events and blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Fallback events if database events are empty
  const fallbackEvents: EventItem[] = [
    {
      _id: "default-1",
      title: "Investiture Ceremony 2026",
      description: "Leadership appointments and swearing-in ceremony for our newly elected student cabinet leaders.",
      date: "2026-07-15T09:30:00Z"
    },
    {
      _id: "default-2",
      title: "Rainwater Harvesting Seminar",
      description: "A special seminar conducted during Jal Pakhwada showcasing rain water harvesting models by environmentalists.",
      date: "2026-07-22T11:00:00Z"
    }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events to only keep upcoming ones (event date >= today)
  const upcomingEvents = events.filter(evt => {
    const evtDate = new Date(evt.date);
    return evtDate.getTime() >= today.getTime();
  });

  const filteredFallbackEvents = fallbackEvents.filter(evt => {
    const evtDate = new Date(evt.date);
    return evtDate.getTime() >= today.getTime();
  });

  const activeEvents = upcomingEvents.length > 0 
    ? upcomingEvents.slice(0, 2) 
    : filteredFallbackEvents.slice(0, 2);

  // Get highlighted event days for the selected month/year
  const allEventsForCalendar = events.length > 0 ? events : fallbackEvents;
  const eventDays = allEventsForCalendar
    .filter(evt => {
      const d = new Date(evt.date);
      return d.getFullYear() === calendarYear && d.getMonth() === calendarMonth;
    })
    .map(evt => new Date(evt.date).getDate());

  return (
    <section className="py-32 md:py-40 px-6 bg-white border-t border-[#1F2937]/5">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title Section */}
        <div className="text-left space-y-3">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7678ED]">Events & Updates</span>
          </Reveal>
          <Reveal width="100%">
            <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight leading-none">
              Journal & Upcoming Events
            </h2>
          </Reveal>
      </div>

      <div className="mt-10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#3D348B] border-b border-slate-100 pb-3">
          Event Gallery
        </h3>

        {eventPhotos.length === 0 ? (
          <p className="text-sm text-gray-500 font-bold italic">
            Event photos will appear here after they are published in Admin &gt; Media Gallery.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {eventPhotos.slice(0, 6).map((photo) => (
              <div key={photo._id} className="group rounded-3xl border border-slate-100 bg-[#F8F9FC] overflow-hidden hover:shadow-premium-md transition-all">
                <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                  <img
                    src={photo.src || "/uploads/hostel/hostel.jpg"}
                    alt={photo.alt || photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-[#F7B801] text-[#3D348B] text-[9px] font-black uppercase tracking-widest rounded-full mb-2">
                      {photo.category || "Events"}
                    </span>
                    <h4 className="text-white font-black uppercase text-sm tracking-tight leading-snug">
                      {photo.title}
                    </h4>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 font-bold line-clamp-2">
                    {photo.alt || "Recent campus event moments from the media gallery."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Recent Blogs & Events Feed (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Blogs Feed */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#3D348B] border-b border-slate-100 pb-3">
                Recent Journal Articles
              </h3>

              {loading ? (
                <div className="py-6 text-center text-gray-400">Loading journal...</div>
              ) : blogs.length === 0 ? (
                <p className="text-sm text-gray-500 font-bold italic">No recent posts available.</p>
              ) : (
                <div className="space-y-6">
                  {blogs.map((post, idx) => (
                    <FadeIn key={post._id} delay={idx * 0.05}>
                      <Link href={`/blog/${post.slug}`} className="block group">
                        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-[#F8F9FC] hover:bg-white rounded-3xl border border-slate-100 hover:shadow-premium-md transition-all duration-300">
                          {/* Image Thumbnail */}
                          <div className="relative w-full sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/uploads/hostel/hostel.jpg";
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col justify-between text-left space-y-2">
                            <div>
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-[#7678ED]">
                                <span>{post.tags?.[0] || "News"}</span>
                                <span>•</span>
                                <span>{formatDate(post.publishedAt)}</span>
                              </div>
                              <h4 className="text-base font-black text-[#3D348B] uppercase tracking-tight font-montserrat mt-1 group-hover:text-[#7678ED] transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500 font-bold line-clamp-2 mt-1 leading-relaxed">
                                {post.excerpt}
                              </p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#3D348B] group-hover:text-[#7678ED] transition-colors pt-2">
                              Read Full Article
                              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Event Feed List */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#3D348B] border-b border-slate-100 pb-3">
                Upcoming Campus Events
              </h3>
              
              <div className="space-y-4">
                {activeEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 font-bold italic">No upcoming campus events scheduled at this time.</p>
                ) : (
                  activeEvents.map((evt, idx) => (
                    <FadeIn key={evt._id} delay={idx * 0.05}>
                      <div className="flex gap-4 p-5 bg-[#F8F9FC] border border-slate-100 rounded-3xl text-left items-center group">
                        <div className="w-12 h-12 rounded-2xl bg-[#3D348B]/10 flex flex-col items-center justify-center text-[#3D348B] shrink-0 font-montserrat">
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {new Date(evt.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-lg font-black leading-none -mt-0.5">
                            {new Date(evt.date).getDate()}
                          </span>
                        </div>

                        {evt.imageUrl && (
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100/50">
                            <img
                              src={evt.imageUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                // Hide image container on error
                                e.currentTarget.parentElement?.classList.add('hidden');
                              }}
                            />
                          </div>
                        )}

                        <div className="space-y-1 flex-1">
                          <h4 className="font-black text-[#3D348B] uppercase text-sm tracking-tight font-montserrat">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-bold leading-relaxed line-clamp-2">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Side: Interactive Calendar Widget (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] shadow-premium-lg p-8 border border-slate-100/60 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7678ED]/5 rounded-full blur-2xl" />

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3D348B]/10 flex items-center justify-center text-[#3D348B]">
                    <CalendarIcon size={16} />
                  </div>
                  <h3 className="font-black text-[#3D348B] uppercase text-sm tracking-wider font-montserrat">
                    Event Planner
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))}
                    className="p-1 hover:bg-slate-100 rounded-md transition-all text-[#3D348B] cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest text-[#7678ED] min-w-[100px] text-center">
                    {currentMonthName} {calendarYear}
                  </span>
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))}
                    className="p-1 hover:bg-slate-100 rounded-md transition-all text-[#3D348B] cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Mon-Sun Header Grid */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <span key={day} className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    {day}
                  </span>
                ))}
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {/* Empty Offsets */}
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`offset-${idx}`} className="w-full h-8" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const isEvent = eventDays.includes(day);
                  return (
                    <div
                      key={`day-${day}`}
                      className={`relative w-full h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isEvent
                          ? "bg-[#3D348B] text-white shadow-premium-sm font-black"
                          : "hover:bg-slate-50 text-gray-600"
                      }`}
                    >
                      <span>{day}</span>
                      {isEvent && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#F7B801] animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3D348B] inline-block" />
                  <span>Scheduled Event</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7B801] inline-block" />
                  <span>Highlight Event</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
