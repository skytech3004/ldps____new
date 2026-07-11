"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Flat array of all showcase items for easy Lightbox cycling
const prePrimaryShowcaseItems = [
  // SECTION 1: Pre School (5 items)
  {
    section: "Pre School",
    title: "Bead Maze Learning",
    description: "Developing fine motor skills and spatial reasoning through tactile wooden bead maze puzzles.",
    src: "https://images.unsplash.com/photo-1603354363425-60bfee595b8d?auto=format&fit=crop&w=600&q=80",
    alt: "tactile bead maze toy block learning",
  },
  {
    section: "Pre School",
    title: "Cup Stacking Tower",
    description: "Collaborative building exercises to teach kids coordination, scale, balance, and patience.",
    src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
    alt: "cup stacking and balance coordination",
  },
  {
    section: "Pre School",
    title: "Preschool Classroom Seating",
    description: "Creating comfortable learning spaces where kids look ahead, listen, and participate together.",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    alt: "children sitting at school tables looking ahead",
  },
  {
    section: "Pre School",
    title: "Sensory Wall Activity Board",
    description: "Hands-on wall activities featuring gears, shapes, and textures to foster cognitive development.",
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    alt: "toddler touching wall activity toys",
  },
  {
    section: "Pre School",
    title: "Vibrant Creative Playroom",
    description: "Vibrant playroom loaded with educational blocks, dolls, and puzzles for active social play.",
    src: "https://images.unsplash.com/photo-1566378246598-5b11a0fe3a23?auto=format&fit=crop&w=600&q=80",
    alt: "preschool colorful creative toys setup",
  },

  // SECTION 2: Academics (5 items)
  {
    section: "Academics",
    title: "Interactive Art & Drawing Group",
    description: "Group art classes where teachers guide kids in using pencils, sketch pens, and vibrant colors.",
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    alt: "teacher helping preschool students write and paint at tables",
  },
  {
    section: "Academics",
    title: "Writing Practice Workshops",
    description: "Developing early pencil grip, handwriting rhythm, and stroke order at custom low preschool desks.",
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    alt: "preschool children writing on white sketch papers",
  },
  {
    section: "Academics",
    title: "Wooden Alphabet Word Puzzle",
    description: "Understanding letters, building words, and spelling using tactile wooden cutouts.",
    src: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
    alt: "colorful letters puzzle frame",
  },
  {
    section: "Academics",
    title: "Tactile Interactive Display",
    description: "Experiential learning workshops using hands-on exhibits to trigger spatial curiosity.",
    src: "/lps-vidhyawadi/gallery-04.jpg",
    alt: "primary science experiential learning project display",
  },
  {
    section: "Academics",
    title: "Clay Modeling & Sculpting",
    description: "Fostering shape comprehension and finger strength using colorful organic modeling clay.",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    alt: "pre-primary kids using clay models",
  },

  // SECTION 3: Co-Curricular Activities (4 items)
  {
    section: "Co-Curricular Activities",
    title: "Origami Paper Craft Demonstration",
    description: "Enhancing spatial orientation and focus by folding vibrant paper frogs and planes.",
    src: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=600&q=80",
    alt: "child holding a cute green origami paper craft",
  },
  {
    section: "Co-Curricular Activities",
    title: "Group Painting & Crafting Sessions",
    description: "Encouraging collaborative expression as students share paints, brushes, and creative ideas.",
    src: "/lps-vidhyawadi/gallery-07.jpg",
    alt: "saturday bagless day activity craft school room",
  },
  {
    section: "Co-Curricular Activities",
    title: "Ladybug Papercraft Showcase",
    description: "Cutting, gluing, and constructing gorgeous paper ladybugs to understand insect biology.",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    alt: "ladybug craft paper models shown by students",
  },
  {
    section: "Co-Curricular Activities",
    title: "Vibrant Toy Counters",
    description: "Interactive mock counters where children learn to play, coordinate, and organize shapes.",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "kids activity counter at preschool play room",
  },

  // SECTION 4: Sports Activities (6 items)
  {
    section: "Sports Activities",
    title: "Outdoor Climbing Jungle Gym",
    description: "Strengthening muscles and gaining confidence by climbing color-blocked playground structures.",
    src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80",
    alt: "kids play playground gym climbing frame",
  },
  {
    section: "Sports Activities",
    title: "Indoor Dynamic Physical Play",
    description: "Developing balance, coordination, and physical fitness with active indoor classroom setups.",
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    alt: "preschool sports session in activity room",
  },
  {
    section: "Sports Activities",
    title: "Strategic Focus & Chess Practice",
    description: "Early logic development and strategy by understanding board configurations and pieces.",
    src: "/lps-vidhyawadi/gallery-02.jpg",
    alt: "school sports chess event matches",
  },
  {
    section: "Sports Activities",
    title: "Outdoor Recreation Drills",
    description: "Holistic fitness, coordination, and outdoor play sessions under teacher guidance.",
    src: "/lps-vidhyawadi/gallery-12.jpg",
    alt: "outdoor playground sports court games",
  },
  {
    section: "Sports Activities",
    title: "Pre-Primary Karate & Self Defense",
    description: "Building agility, discipline, focus, and core strength through guided junior karate kates.",
    src: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80",
    alt: "karate physical training class kids",
  },
  {
    section: "Sports Activities",
    title: "Road Safety Tricycle Track",
    description: "Interactive play track simulating road lanes, stop lights, and traffic signs for civic education.",
    src: "https://images.unsplash.com/photo-1564144006388-615f4f4ad6f1?auto=format&fit=crop&w=600&q=80",
    alt: "play scooter track school with road signs",
  },

  // SECTION 5: Projector Class (2 items)
  {
    section: "Projector Class",
    title: "Smart AV Presentation Hall",
    description: "High-tech audio-visual projector classrooms that make geography, history, and science come alive.",
    src: "/lps-vidhyawadi/gallery-09.jpg",
    alt: "projection room classroom with long tables and display",
  },
  {
    section: "Projector Class",
    title: "Smart Whiteboard Classroom Sessions",
    description: "Vibrant classrooms equipped with high-resolution digital whiteboards for interactive learning.",
    src: "https://images.unsplash.com/photo-1568658176307-bfbd2873abda?auto=format&fit=crop&w=600&q=80",
    alt: "interactive flat panel whiteboard classroom screen kids",
  },

  // SECTION 6: Skill Classes (2 items)
  {
    section: "Skill Classes",
    title: "Sand Play Sensory Station",
    description: "Fostering texture recognition, scooping math, and physical coordination at sandboxes.",
    src: "https://images.unsplash.com/photo-1610473068565-d06b67a99252?auto=format&fit=crop&w=600&q=80",
    alt: "children playing sandbox sand table sensory station",
  },
  {
    section: "Skill Classes",
    title: "Geometric Shape Learning Activity",
    description: "Drawing, coloring, and learning shapes like circle, triangle, and square with visual aids.",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    alt: "preschooler displaying geometry drawing on floor shapes",
  },
];

export default function PrePrimaryClient() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [showcaseItems, setShowcaseItems] = useState(prePrimaryShowcaseItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowcase() {
      try {
        const res = await fetch("/api/pre-primary");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setShowcaseItems(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pre-primary items from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShowcase();
  }, []);

  // Navigate lightbox photos
  const handlePrev = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === 0 ? showcaseItems.length - 1 : (prev ?? 0) - 1));
  }, [activePhoto, showcaseItems]);

  const handleNext = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((prev) => (prev === showcaseItems.length - 1 ? 0 : (prev ?? 0) + 1));
  }, [activePhoto, showcaseItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setActivePhoto(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, handlePrev, handleNext]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (activePhoto !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePhoto]);

  // Group items by section to make rendering structured and clean
  const getSectionItems = (sectionName: string) => {
    return showcaseItems
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => item.section === sectionName);
  };

  const renderSectionHeader = (title: string) => (
    <div className="flex flex-col items-center mb-16 space-y-2">
      <span className="text-xs font-black uppercase tracking-[0.3em] text-[#7678ED]">Learning Modules</span>
      <h2 className="text-3xl md:text-5xl font-black text-[#3D348B] uppercase font-montserrat tracking-tight">{title}</h2>
      <div className="w-16 h-1 bg-accent rounded-full mt-2" />
    </div>
  );

  const renderImageCard = (item: { title: string; description: string; src: string; alt: string; originalIndex: number }) => (
    <motion.div
      key={item.originalIndex}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (item.originalIndex % 3) * 0.05 }}
      onClick={() => setActivePhoto(item.originalIndex)}
      className="group relative cursor-pointer h-full"
    >
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 flex flex-col h-full hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1.5 shadow-premium-sm">
        {/* Polaroid Style Image Frame */}
        <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-sm">
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/lps-vidhyawadi/gallery-02.jpg";
            }}
          />
          {/* Overlay hover badge */}
          <div className="absolute inset-0 bg-[#3D348B]/10 group-hover:bg-[#3D348B]/30 transition-colors duration-300 flex items-end justify-start p-3">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-[#3D348B] uppercase bg-accent px-3 py-1.5 rounded-full shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <ImageIcon size={10} />
              Enlarge
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-5 px-1 flex-1 flex flex-col space-y-1 text-left">
          <h3 className="text-[#3D348B] text-base md:text-lg font-black line-clamp-1 leading-snug tracking-tight">
            {item.title}
          </h3>
          <p className="text-gray-500 text-xs font-bold leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div >
  );

  return (
    <div className="w-full space-y-24 relative pb-20">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-[#7678ED]/5 rounded-full blur-3xl -z-20 animate-pulse" />
      <div className="absolute top-[20%] -right-20 w-96 h-96 bg-[#F7B801]/5 rounded-full blur-3xl -z-20" />
      <div className="absolute top-[50%] -left-20 w-96 h-96 bg-[#3D348B]/5 rounded-full blur-3xl -z-20 animate-pulse" />

      {/* SECTION 1: Pre School */}
      <section className="w-full py-16 md:py-24 border-b border-slate-100">
        {renderSectionHeader("Pre School Showcase")}
        {/* Grid of 5 horizontal cards in a row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {getSectionItems("Pre School").map((item) => renderImageCard(item))}
        </div>
      </section>

      {/* SECTION 2: Academics */}
      <section className="w-full py-16 md:py-24 border-b border-slate-100">
        {renderSectionHeader("Interactive Academics")}
        <div className="space-y-8">
          {/* Row 1: 2 large cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getSectionItems("Academics").slice(0, 2).map((item) => renderImageCard(item))}
          </div>
          {/* Row 2: 3 smaller cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {getSectionItems("Academics").slice(2, 5).map((item) => renderImageCard(item))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Co-Curricular Activities */}
      <section className="w-full py-16 md:py-24 border-b border-slate-100">
        {renderSectionHeader("Co-Curricular Exploration")}
        {/* Grid of 4 horizontal cards in a row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {getSectionItems("Co-Curricular Activities").map((item) => renderImageCard(item))}
        </div>
      </section>

      {/* SECTION 4: Sports Activities */}
      <section className="w-full py-16 md:py-24 border-b border-slate-100">
        {renderSectionHeader("Active Sports & Fun")}
        <div className="space-y-8">
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {getSectionItems("Sports Activities").slice(0, 3).map((item) => renderImageCard(item))}
          </div>
          {/* Row 2: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {getSectionItems("Sports Activities").slice(3, 6).map((item) => renderImageCard(item))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Projector Class */}
      <section className="w-full py-16 md:py-24 border-b border-slate-100">
        {renderSectionHeader("Digital Projector Learning")}
        {/* Grid of 2 large horizontal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getSectionItems("Projector Class").map((item) => renderImageCard(item))}
        </div>
      </section>

      {/* SECTION 6: Skill Classes */}
      <section className="w-full py-16 md:py-24">
        {renderSectionHeader("Life Skill Development")}
        {/* Grid of 2 large horizontal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getSectionItems("Skill Classes").map((item) => renderImageCard(item))}
        </div>
      </section>

      {/* Premium Lightbox Modal Viewer */}
      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-6 px-4"
          >
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center text-white px-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-[#F7B801] uppercase">
                LPS Vidyawadi - Pre-Primary Wing
              </span>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-2.5 bg-white/5 hover:bg-white/15 hover:scale-105 border border-white/10 rounded-full text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Area */}
            <div className="flex-1 w-full flex items-center justify-center relative my-4 max-h-[75vh]">
              {/* Left Navigation Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Active Image with organic zoom */}
              <motion.div
                key={activePhoto}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full md:max-w-4xl flex flex-col items-center justify-center"
              >
                <img
                  src={showcaseItems[activePhoto].src}
                  alt={showcaseItems[activePhoto].alt}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl border border-white/5 shadow-2xl"
                />
              </motion.div>

              {/* Right Navigation Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-full transition-all cursor-pointer hidden sm:block"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Info Bar & Mobile Swiper Controls */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl text-center flex flex-col items-center gap-2 text-white px-4"
            >
              {/* Title display */}
              <div className="space-y-1">
                <span className="text-[11px] font-black tracking-widest text-[#F7B801] uppercase bg-[#3D348B] px-3 py-1 rounded-full">
                  {showcaseItems[activePhoto].section}
                </span>
                <p className="text-base md:text-xl font-black text-white tracking-wide max-w-2xl leading-snug mt-2">
                  {showcaseItems[activePhoto].title}
                </p>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {showcaseItems[activePhoto].description}
                </p>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Photo {activePhoto + 1} of {showcaseItems.length}
                </p>
              </div>

              {/* Mobile Arrows (Visible only on small screens) */}
              <div className="flex sm:hidden items-center gap-6 mt-1">
                <button
                  onClick={handlePrev}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full cursor-pointer text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full cursor-pointer text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
