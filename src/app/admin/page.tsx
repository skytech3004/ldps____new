import Link from "next/link";
import { Bell, CalendarDays, ChevronRight, FileText, Images, PlusCircle, ClipboardList } from "lucide-react";

const modules = [
  {
    title: "Notice Board",
    description: "Manage news, announcements, circulars, and admission alerts shown on the home page.",
    href: "/admin/notices",
    icon: Bell,
  },
  {
    title: "Page Content",
    description: "Edit text, sections, and descriptions of static informative pages across the site.",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Admission Inquiries",
    description: "Review, filter, and track parent's admission inquiries and schedule campus follow-ups.",
    href: "/admin/inquiries",
    icon: ClipboardList,
  },
  {
    title: "Events Management",
    description: "Create, edit, and delete event records with date and image support.",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Galleries Management",
    description: "Manage page-wise albums, categories, and uploaded photos used across the website.",
    href: "/admin/galleries",
    icon: Images,
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8">
        <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Dashboard</p>
        <h1 className="text-4xl font-black mt-2">Real Admin Panel</h1>
        <p className="text-white/70 mt-2">Choose a module below to manage live website content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-6 hover:bg-[#17346f] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="text-2xl font-black">{module.title}</h2>
              <p className="text-white/70 mt-2">{module.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 font-bold text-cyan-300">
                Open Module
                <ChevronRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/15 bg-[#0f234f]/80 p-5 flex flex-wrap gap-3">
        <Link href="/admin/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 font-bold">
          <PlusCircle size={16} />
          Add New Event
        </Link>
        <Link href="/admin/galleries" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-bold">
          <Images size={16} />
          Manage Photo Galleries
        </Link>
      </div>
    </section>
  );
}
