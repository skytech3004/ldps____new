"use client";

import Link from "next/link";
import { 
  Bell, CalendarDays, ChevronRight, FileText, Images, PlusCircle, ClipboardList, 
  LayoutGrid, ShieldCheck, BookOpen, Bus, Calendar, Download, Award, 
  GraduationCap, Trophy, Home, Briefcase, Sparkles, Terminal, Activity, Users, MessageSquare, Phone 
} from "lucide-react";

const modules = [
  {
    title: "Hostel & Residences",
    description: "Manage residential rooms, facilities grid, guidelines, and session fees table.",
    href: "/admin/hostel",
    icon: Home,
    featured: true, // bento sizing
    badge: "Database Ready"
  },
  {
    title: "Blog & Insights",
    description: "Create, edit, draft, and delete news articles, stories, and school blog posts.",
    href: "/admin/blog",
    icon: BookOpen,
    featured: true,
    badge: "Active Engine"
  },
  {
    title: "Pre-Primary Showcase",
    description: "Manage photos, titles, and descriptions shown in the preschool showcase tabs.",
    href: "/admin/pre-primary",
    icon: Images,
    badge: "Media Sync"
  },
  {
    title: "Career & Openings",
    description: "Post job vacancies, review applications, and access submitted CV portfolios.",
    href: "/admin/career",
    icon: Briefcase,
    badge: "Applications"
  },
  {
    title: "Important Contacts",
    description: "Manage department contacts shown on the Contact page — add, edit, hide, or delete entries.",
    href: "/admin/contact",
    icon: Phone,
    badge: "CRUD"
  },
  {
    title: "Notice Board",
    description: "Manage news, announcements, circulars, and admission alerts shown on the home page.",
    href: "/admin/notices",
    icon: Bell,
    badge: "Alerts"
  },
  {
    title: "Brand Identity",
    description: "Manage school logo, favicons, and other brand assets used in Navbar and Footer.",
    href: "/admin/brand",
    icon: Images
  },
  {
    title: "About Pages",
    description: "Edit About Trust and Management Committee intro, office bearers table, and inspiration section.",
    href: "/admin/about-pages",
    icon: FileText,
    badge: "CMS"
  },
  {
    title: "About Messages",
    description: "Edit President, CEO, Secretary, and Principal messages from the About navbar with portrait upload and rich text.",
    href: "/admin/about-messages",
    icon: MessageSquare,
    badge: "CMS"
  },
  {
    title: "Managing Committee",
    description: "Manage the Academic Excellence Team names and designations loaded from teacher.txt.",
    href: "/admin/managing-committee",
    icon: Users,
    badge: "Local Roster"
  },
  {
    title: "Investiture Cabinet",
    description: "Manage Student Cabinet portfolios (Head Girl, Prefects) for the Investiture Ceremony.",
    href: "/admin/investiture",
    icon: Award
  },
  {
    title: "Alumni Registrations",
    description: "Review, filter, and track registrations submitted by school alumni.",
    href: "/admin/alumni",
    icon: GraduationCap
  },
  {
    title: "Advanced Facilities",
    description: "Manage structural elements and images shown in the advanced facilities showcase grid.",
    href: "/admin/facilities",
    icon: LayoutGrid
  },
  {
    title: "Board Results Hub",
    description: "Manage board exam years, stats, student toppers, and marks directories.",
    href: "/admin/results",
    icon: Trophy
  },
  {
    title: "Sports & Selections",
    description: "Manage player listings, game summaries, selectors statistics, and complex carousels.",
    href: "/admin/sports",
    icon: Trophy
  },
  {
    title: "More Pages",
    description: "Edit the content pages behind the More menu items and publish new page sections.",
    href: "/admin/pages",
    icon: FileText
  },
  {
    title: "Home Carousel",
    description: "Manage sliding banners and gallery images used in the main page IntroSection carousel.",
    href: "/admin/carousel",
    icon: Images
  },
  {
    title: "Category Grid",
    description: "Manage the boarding, smart classes, and facility blocks shown on the home page.",
    href: "/admin/categories",
    icon: LayoutGrid
  },
  {
    title: "Admission Inquiries",
    description: "Review, filter, and track parent's admission inquiries and schedule campus follow-ups.",
    href: "/admin/inquiries",
    icon: ClipboardList
  },
  {
    title: "Events Management",
    description: "Create, edit, and delete event records with date and image support.",
    href: "/admin/events",
    icon: CalendarDays
  },
  {
    title: "Galleries Management",
    description: "Manage page-wise albums, categories, and uploaded photos used across the website.",
    href: "/admin/galleries",
    icon: Images
  },
  {
    title: "Magazine Management",
    description: "Manage school magazines, bulletins, and journals with month, year, and PDF uploads.",
    href: "/admin/magazine",
    icon: BookOpen
  },
  {
    title: "Transport Management",
    description: "Manage school bus routes, safety norms, operating timings, and driver details.",
    href: "/admin/transport",
    icon: Bus
  },
  {
    title: "CBSE Disclosures",
    description: "Manage mandatory public disclosures, school certificates, safety documents, and compliance PDFs.",
    href: "/admin/disclosures",
    icon: FileText
  },
  {
    title: "Holiday List",
    description: "Manage academic year school holidays, seasonal breaks, and national festivals.",
    href: "/admin/holidays",
    icon: Calendar
  },
  {
    title: "Downloads Manager",
    description: "Manage official school PDF forms, applications, brochures, and dynamic planners.",
    href: "/admin/downloads",
    icon: Download
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8 text-left text-[#E2E8F0]">
      
      {/* Notion-style Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1F2937]/50 bg-[#0A0E17] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7B801]/5 via-[#7678ED]/5 to-transparent pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#F7B801]/10 text-[#F7B801] rounded text-[9px] font-mono font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-mono text-gray-500">v1.2.0-stable</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-montserrat">Workspace Console</h1>
          <p className="text-xs text-[#94A3B8] font-semibold">Choose an operations module to publish, manage, or audit live website content.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 bg-[#1F2937]/60 hover:bg-[#1F2937] border border-[#374151]/70 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-white">
            <Sparkles size={12} className="text-[#F7B801]" />
            Live Website
          </Link>
        </div>
      </div>

      {/* Statistics Row / Linear-inspired widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Modules", value: modules.length.toString(), desc: "Dynamic and static layouts", icon: LayoutGrid },
          { label: "Storage Health", value: "Optimal", desc: "98% upload bandwidth", icon: Activity },
          { label: "CMS Status", value: "Online", desc: "Seed caches active", icon: Terminal },
          { label: "Framework", value: "NextJS 16", desc: "Turbopack optimization", icon: Sparkles }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#0A0E17]/60 border border-[#1F2937]/50 p-5 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-medium text-gray-500">{stat.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#1F2937]/30 border border-[#1F2937]/60 flex items-center justify-center text-[#94A3B8]">
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bento Grid layout of modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((module) => {
          const Icon = module.icon;
          const isFeatured = module.featured;
          return (
            <Link
              key={module.href}
              href={module.href}
              className={`group flex flex-col justify-between bg-[#0A0E17]/60 border border-[#1F2937]/50 p-6 rounded-xl hover:bg-[#111827]/40 hover:border-[#374151] transition-all duration-300 relative overflow-hidden ${
                isFeatured ? "md:col-span-2" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#1F2937]/40 border border-[#1F2937]/60 flex items-center justify-center text-[#94A3B8] group-hover:text-white transition-colors">
                    <Icon size={16} />
                  </div>
                  {module.badge && (
                    <span className="px-2 py-0.5 bg-[#F7B801]/10 border border-[#F7B801]/25 text-[#F7B801] rounded text-[8px] font-mono font-bold uppercase tracking-wider">
                      {module.badge}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <h2 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#F7B801] transition-colors">
                    {module.title}
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono text-gray-500 group-hover:text-white transition-colors">
                <span>Configure workspace</span>
                <ChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
