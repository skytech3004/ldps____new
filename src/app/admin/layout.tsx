"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, Database, FileText, FolderKanban, Images, LayoutDashboard, LogOut, 
  ClipboardList, LayoutGrid, BookOpen, Bus, Calendar, Download, 
  Award, GraduationCap, Trophy, Home, Briefcase, ChevronRight, Users, MessageSquare, Phone
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/filters", label: "Filter Tags Manager", icon: LayoutGrid },
  { href: "/admin/hostel", label: "Hostel & Residence", icon: Home },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/pre-primary", label: "Pre-Primary Showcase", icon: Images },
  { href: "/admin/career", label: "Career Listings", icon: Briefcase },
  { href: "/admin/contact", label: "Important Contacts", icon: Phone },
  { href: "/admin/notices", label: "Notice Board", icon: Bell },
  { href: "/admin/about-pages", label: "About Pages", icon: FileText },
  { href: "/admin/about-messages", label: "About Messages", icon: MessageSquare },
  { href: "/admin/managing-committee", label: "Managing Committee", icon: Users },
  { href: "/admin/investiture", label: "Investiture Cabinet", icon: Award },
  { href: "/admin/investiture-ceremony", label: "Investiture Ceremony", icon: Award },
  { href: "/admin/alumni", label: "Alumni Registrations", icon: GraduationCap },
  { href: "/admin/facilities", label: "Advanced Facilities", icon: LayoutGrid },
  { href: "/admin/results", label: "Board Results", icon: Trophy },
  { href: "/admin/sports", label: "Sports Selections", icon: Trophy },
  { href: "/admin/pages", label: "More Pages", icon: FileText },
  { href: "/admin/carousel", label: "Home Carousel", icon: Images },
  { href: "/admin/hero", label: "Hero Carousel", icon: Images },
  { href: "/admin/categories", label: "Category Grid", icon: LayoutGrid },
  { href: "/admin/inquiries", label: "Inquiries", icon: ClipboardList },
  { href: "/admin/events", label: "Events", icon: Database },
  { href: "/admin/galleries", label: "Media Gallery", icon: Images },
  { href: "/admin/videos", label: "Video Highlights", icon: Images },
  { href: "/admin/magazine", label: "Magazine", icon: BookOpen },
  { href: "/admin/transport", label: "Bus Routes", icon: Bus },
  { href: "/admin/disclosures", label: "CBSE Disclosures", icon: FileText },
  { href: "/admin/holidays", label: "Holiday List", icon: Calendar },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Find active label for breadcrumbs
  const activeItem = navItems.find((item) => item.href === pathname) || navItems[0];

  return (
    <main className="min-h-screen bg-[#07090E] text-[#E2E8F0] font-sans antialiased">
      <div className="flex min-h-screen">
        
        {/* Notion / Linear-Style Left Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#0A0E17] border-r border-[#1F2937]/60 flex-col shrink-0">
          <div className="px-6 py-5 border-b border-[#1F2937]/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-black tracking-widest text-[#F7B801] uppercase">LPS Vidyawadi</p>
              <p className="text-[10px] font-mono text-[#94A3B8]/80 mt-0.5">Control Center</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </div>

          {/* Navigation with custom styling and overflow handling */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full inline-flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-[#1F2937]/50 text-white border border-[#374151]/70 shadow-sm font-black" 
                      : "text-[#94A3B8] hover:text-white hover:bg-[#111827]/40"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#F7B801]" : "text-[#94A3B8]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#1F2937]/60">
            <button className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 text-[#FCA5A5] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer">
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </aside>

        {/* Workspace Canvas Area */}
        <section className="flex-1 min-w-0 flex flex-col">
          {/* Translucent Vercel-Style Header */}
          <header className="h-16 px-6 md:px-8 border-b border-[#1F2937]/60 bg-[#0A0E17]/80 backdrop-blur-md flex items-center justify-between z-40 sticky top-0">
            <div className="inline-flex items-center gap-2.5 text-xs text-[#94A3B8] font-bold">
              <span className="font-mono text-[#F7B801]">root</span>
              <ChevronRight size={10} />
              <span className="font-mono text-[#94A3B8]/80">admin</span>
              <ChevronRight size={10} />
              <span className="text-white font-mono">{activeItem.label.toLowerCase().replace(/\s+/g, "-")}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-mono bg-[#111827]/80 border border-[#1F2937]/80 px-3 py-1.5 rounded-full text-[#94A3B8]">
                <Database size={10} />
                <span>MongoDB Connected</span>
              </div>
            </div>
          </header>

          {/* Main workspace container with fine border layout */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-[#0A0E17] to-[#07090E] flex-1">
            <div className="bg-[#090D16] border border-[#1F2937]/50 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
