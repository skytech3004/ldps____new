import Link from "next/link";
import { Bell, Database, FileText, FolderKanban, Images, LayoutDashboard, LogOut, ClipboardList, LayoutGrid, ShieldCheck, BookOpen, Bus, Calendar, Download } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notices", label: "Notice Board", icon: Bell },
  { href: "/admin/leadership", label: "Leadership Team", icon: ShieldCheck },
  { href: "/admin/pages", label: "More Pages", icon: FileText },
  { href: "/admin/carousel", label: "Home Carousel", icon: Images },
  { href: "/admin/categories", label: "Category Grid", icon: LayoutGrid },
  { href: "/admin/inquiries", label: "Inquiries", icon: ClipboardList },
  { href: "/admin/events", label: "Events", icon: Database },
  { href: "/admin/galleries", label: "Galleries", icon: Images },
  { href: "/admin/magazine", label: "Magazine", icon: BookOpen },
  { href: "/admin/transport", label: "Bus Routes", icon: Bus },
  { href: "/admin/disclosures", label: "CBSE Disclosures", icon: FileText },
  { href: "/admin/holidays", label: "Holiday List", icon: Calendar },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0b1738] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 bg-[#081a3a] border-r border-white/10 flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <p className="text-lg font-black tracking-wide">LPS Admin Panel</p>
            <p className="text-xs text-white/60 mt-1">Content Management</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-full inline-flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 mt-auto border-t border-white/10">
            <button className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-red-500/90 hover:bg-red-500 font-black">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          <header className="h-20 px-4 md:px-8 border-b border-white/10 bg-[#0c1f46] flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FolderKanban size={16} />
              </div>
              <div>
                <p className="text-sm font-black tracking-wider uppercase">Admin Workspace</p>
                <p className="text-xs text-white/60">Manage website data and media</p>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 bg-gradient-to-b from-[#152c62] to-[#0c1e46] min-h-[calc(100vh-5rem)]">{children}</div>
        </section>
      </div>
    </main>
  );
}
