"use client";

import React from "react";
import Link from "next/link";
import { 
  Bell, ChevronRight, FileText, Images, 
  ClipboardList, BookOpen, Bus, Calendar, Download, Award, 
  GraduationCap, Trophy, Home, Briefcase, Sparkles, Users, 
  MessageSquare, Phone, CreditCard, School, ShieldCheck, UserCheck
} from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";
import { adminNavGroups } from "@/data/adminNav";

export default function AdminDashboardPage() {
  const { roleDetails, canAccessRoute } = useAdminRole();

  return (
    <section className="space-y-8 text-left text-[#E2E8F0]">
      
      {/* ============================================================ */}
      {/* WELCOME BANNER FOR SCHOOL STAFF                             */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1F2937]/80 bg-gradient-to-br from-[#0F172A] via-[#090D16] to-[#070A12] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7B801]/10 via-[#3B82F6]/5 to-transparent pointer-events-none" />
        
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-[#F7B801]/10 border border-[#F7B801]/30 text-[#F7B801] rounded-lg text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
              <School size={12} />
              School Administration Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-400">Academic Session 2025-26</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-montserrat leading-tight">
            Welcome, School Administrator
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed">
            Manage student notices, fee structures, hostel guidelines, admission inquiries, board results, and public website content from this unified portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <div className="px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-semibold text-gray-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#F7B801]" />
            <span>Role: <strong className="text-white">{roleDetails.title}</strong></span>
          </div>
          <Link 
            href="/" 
            target="_blank" 
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7B801] to-[#D97706] text-black font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg"
          >
            <Sparkles size={14} />
            View Live Website
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* QUICK STATUS OVERVIEW FOR SCHOOL STAFF                       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Available Sections", 
            value: "34 Modules", 
            desc: "Fee, Hostel, Notices, Media", 
            icon: School,
            color: "text-[#F7B801] bg-[#F7B801]/10 border-[#F7B801]/30"
          },
          { 
            label: "Admission Inquiries", 
            value: "Portal Active", 
            desc: "Parent inquiries & follow-ups", 
            icon: ClipboardList,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
          },
          { 
            label: "Notice Board & Alerts", 
            value: "Live Sync", 
            desc: "Public circulars & alerts", 
            icon: Bell,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/30"
          },
          { 
            label: "Fee Tables & Routes", 
            value: "90+ Destinations", 
            desc: "Bus transport & hostel fee rates", 
            icon: Bus,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/30"
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#0A0E17]/80 border border-[#1F2937]/70 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-[#374151] transition-colors">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-semibold text-gray-400">{stat.desc}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* QUICK ACCESS HIGHLIGHT CARDS                                 */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#1F2937]/70 pb-3">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight font-montserrat flex items-center gap-2">
              <School size={18} className="text-[#F7B801]" />
              School Administration Sections
            </h2>
            <p className="text-xs text-[#94A3B8] font-medium">Click on any section to manage its entries and content.</p>
          </div>
        </div>

        {adminNavGroups.map((group) => {
          // Filter items user can access
          const accessibleItems = group.items.filter((item) => canAccessRoute(item.href));
          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F7B801]" />
                <h3 className="text-xs font-mono font-black text-[#F7B801] uppercase tracking-widest">
                  {group.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex flex-col justify-between bg-[#0A0E17]/80 border border-[#1F2937]/60 p-5 rounded-xl hover:bg-[#111827] hover:border-[#F7B801]/40 transition-all duration-200 relative overflow-hidden shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-[#1E293B]/60 border border-[#334155]/60 flex items-center justify-center text-[#94A3B8] group-hover:text-[#F7B801] group-hover:border-[#F7B801]/40 transition-colors">
                            <Icon size={18} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#F7B801] transition-colors flex items-center gap-1">
                            Open <ChevronRight size={10} />
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-white uppercase tracking-tight group-hover:text-[#F7B801] transition-colors">
                            {item.label}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-[#94A3B8] font-medium leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
