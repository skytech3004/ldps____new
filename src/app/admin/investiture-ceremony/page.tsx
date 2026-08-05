import Link from "next/link";
import { ArrowRight, Award, ChevronRight, ImageIcon, Sparkles } from "lucide-react";

const cards = [
  {
    title: "Student Leadership",
    description:
      "Open the cabinet manager to add, edit, or remove student leaders with image upload support.",
    href: "/admin/investiture-ceremony/cabinet",
    icon: Award,
    accent: "from-[#3D348B] to-[#7678ED]",
  },
  {
    title: "Ceremony Gallery",
    description:
      "Open the gallery manager to upload ceremony photos, set the cover image, and maintain the album.",
    href: "/admin/investiture-ceremony/gallery",
    icon: ImageIcon,
    accent: "from-[#F7B801] to-[#F59E0B]",
  },
];

export default function AdminInvestitureCeremonyHubPage() {
  return (
    <section className="space-y-8 text-[#0b1738]">
      <div className="relative overflow-hidden rounded-3xl border border-teal/10 bg-white p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(118,120,237,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(247,184,1,0.12),transparent_35%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#7678ED]">Investiture Ceremony Admin</p>
            <h1 className="text-3xl md:text-5xl font-black text-[#3D348B] leading-tight">
              Choose what you want to manage
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl">
              Use the left card for Student Leadership and the right card for the Ceremony Gallery. Each area has its own clean CRUD page.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-[0.3em]">
            <Sparkles size={14} className="text-[#F7B801]" />
            Organized Workflow
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(61,52,139,0.12)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />
              <div className="flex items-start justify-between gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-lg`}>
                  <Icon size={28} />
                </div>
                <div className="w-11 h-11 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#3D348B] group-hover:text-white transition-colors">
                  <ArrowRight size={18} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                  <ChevronRight size={12} />
                  Open Editor
                </div>
                <h2 className="text-2xl font-black text-[#3D348B]">{card.title}</h2>
                <p className="text-sm md:text-base leading-relaxed text-slate-600 max-w-xl">{card.description}</p>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#3D348B] group-hover:text-[#7678ED] transition-colors">
                Enter section
                <ArrowRight size={15} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
