"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  ChevronDown, ChevronRight, Menu, X, LogOut, 
  Sparkles, School, ShieldCheck, User, ExternalLink,
  LayoutDashboard, Check
} from "lucide-react";
import { AdminRoleProvider, useAdminRole, ROLE_DEFINITIONS } from "@/context/AdminRoleContext";
import { adminNavGroups, topLevelNav, allNavItems } from "@/data/adminNav";
import { UserRole, NavGroup, NavItem } from "@/types/adminNav";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const { role, setRole, canAccessItem, roleDetails } = useAdminRole();

  // Helper to check if a navigation item is currently active (including query params like ?category=...)
  const isItemActive = (itemHref: string): boolean => {
    const [itemPath, itemQuery] = itemHref.split("?");
    if (itemPath !== pathname) return false;
    if (!itemQuery) {
      return !currentCategory;
    }
    const params = new URLSearchParams(itemQuery);
    return params.get("category") === currentCategory;
  };

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Role switcher dropdown open state
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Group collapse state: record of group.id -> boolean (true = expanded)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    adminNavGroups.forEach((group) => {
      initial[group.id] = false;
    });
    return initial;
  });

  // Auto-expand group if any of its items is active
  useEffect(() => {
    adminNavGroups.forEach((group) => {
      const hasActiveChild = group.items.some((item) => isItemActive(item.href));
      if (hasActiveChild) {
        setExpandedGroups((prev) => ({
          ...prev,
          [group.id]: true,
        }));
      }
    });
  }, [pathname, currentCategory]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Find active item for header breadcrumbs
  const activeItem = allNavItems.find((item) => isItemActive(item.href)) || topLevelNav;

  // Active category title lookup
  const activeGroup = adminNavGroups.find((group) =>
    group.items.some((item) => isItemActive(item.href))
  );

  return (
    <main className="min-h-screen bg-[#06080E] text-[#E2E8F0] font-sans antialiased flex flex-col">
      <div className="flex flex-1 min-h-screen relative">
        
        {/* ============================================================ */}
        {/* DESKTOP SIDEBAR                                              */}
        {/* ============================================================ */}
        <aside className="hidden lg:flex w-72 bg-[#090D16] border-r border-[#1F2937]/70 flex-col shrink-0 sticky top-0 h-screen z-30 shadow-2xl">
          {/* School Header / Brand Header */}
          <div className="p-5 border-b border-[#1F2937]/70 bg-gradient-to-b from-[#0F172A]/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7B801] to-[#D97706] p-0.5 shadow-lg flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <School className="w-5 h-5 text-[#F7B801]" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-black tracking-wider text-white uppercase truncate font-montserrat">
                  LPS Vidyawadi
                </h1>
                <p className="text-[11px] font-semibold text-[#F7B801] tracking-wide truncate">
                  School Administration
                </p>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-3.5 pt-3 border-t border-[#1F2937]/50 flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Live Website Synced
              </span>
              <span className="text-gray-400 font-mono">Session 2025-26</span>
            </div>
          </div>

          {/* Navigation Accordion Menu */}
          <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto no-scrollbar scroll-smooth">
            {/* Top level Dashboard */}
            <div>
              {canAccessItem(topLevelNav) && (
                <Link
                  href={topLevelNav.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isItemActive(topLevelNav.href)
                      ? "bg-gradient-to-r from-[#F7B801]/20 to-[#1F2937]/40 text-white border border-[#F7B801]/40 shadow-md font-black"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#111827]/60"
                  }`}
                >
                  <LayoutDashboard size={16} className={isItemActive(topLevelNav.href) ? "text-[#F7B801]" : "text-[#94A3B8]"} />
                  <span className="tracking-wide">Dashboard</span>
                </Link>
              )}
            </div>

            <div className="h-px bg-[#1F2937]/60 my-2" />

            {/* Categorized Groups */}
            {adminNavGroups.map((group) => {
              // Filter items accessible to user
              const accessibleItems = group.items.filter(canAccessItem);
              if (accessibleItems.length === 0) return null;

              const isExpanded = expandedGroups[group.id];
              const hasActiveChild = group.items.some((item) => isItemActive(item.href));
              const GroupIcon = group.icon || School;

              return (
                <div key={group.id} className="space-y-1">
                  {/* Category Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors group ${
                      hasActiveChild
                        ? "text-[#F7B801]"
                        : "text-[#64748B] hover:text-[#94A3B8] hover:bg-[#111827]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <GroupIcon size={14} className={hasActiveChild ? "text-[#F7B801]" : "text-[#64748B] group-hover:text-[#94A3B8]"} />
                      <span className="truncate text-[11px] font-mono tracking-widest">{group.title}</span>
                    </div>
                    <div className="p-0.5 rounded transition-transform duration-200">
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-[#94A3B8]" />
                      ) : (
                        <ChevronRight size={14} className="text-[#64748B]" />
                      )}
                    </div>
                  </button>

                  {/* Category Sub-items */}
                  {isExpanded && (
                    <div className="pl-3 space-y-1 pt-0.5 border-l-2 border-[#1F2937]/60 ml-3">
                      {accessibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isItemActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                              isActive
                                ? "bg-[#1F2937]/80 text-white font-bold border border-[#F7B801]/30 shadow-sm"
                                : "text-[#94A3B8] hover:text-white hover:bg-[#111827]/40"
                            }`}
                          >
                            <Icon size={14} className={isActive ? "text-[#F7B801]" : "text-[#64748B]"} />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Role Card & Logout */}
          <div className="p-3 border-t border-[#1F2937]/70 bg-[#070A12]/90 space-y-2">
            {/* Role indicator badge */}
            <div className="px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1F2937] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#F7B801] shrink-0 font-black">
                  <User size={13} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">Staff Account</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{roleDetails.title}</p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-[#1E293B]/60 hover:bg-[#1E293B] border border-[#334155]/60 text-gray-300 font-bold text-xs transition-colors"
            >
              <ExternalLink size={12} className="text-[#F7B801]" />
              View Live Website
            </Link>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MOBILE MENU DRAWER (SLIDE-IN OVERLAY)                        */}
        {/* ============================================================ */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar Content */}
            <div className="relative w-80 max-w-[85vw] bg-[#090D16] border-r border-[#1F2937] flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
              <div className="p-5 border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F7B801]/10 border border-[#F7B801]/30 flex items-center justify-center">
                    <School className="w-5 h-5 text-[#F7B801]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-montserrat uppercase">LPS Vidyawadi</h2>
                    <p className="text-[10px] text-[#F7B801] font-bold">School Administration</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-4">
                <Link
                  href={topLevelNav.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold ${
                    isItemActive(topLevelNav.href)
                      ? "bg-[#F7B801]/20 text-white border border-[#F7B801]/40 font-black"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <LayoutDashboard size={18} className="text-[#F7B801]" />
                  <span>Dashboard</span>
                </Link>

                {adminNavGroups.map((group) => {
                  const accessibleItems = group.items.filter(canAccessItem);
                  if (accessibleItems.length === 0) return null;
                  const isExpanded = expandedGroups[group.id];

                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between py-2 text-xs font-black uppercase text-[#F7B801] tracking-wider"
                      >
                        <span>{group.title}</span>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      {isExpanded && (
                        <div className="pl-2 space-y-1 border-l-2 border-[#1F2937]">
                          {accessibleItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isItemActive(item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                                  isActive
                                    ? "bg-[#1F2937] text-white font-bold border border-[#F7B801]/40"
                                    : "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                <Icon size={16} className={isActive ? "text-[#F7B801]" : "text-gray-400"} />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#1F2937]">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-white font-bold text-xs uppercase"
                >
                  <ExternalLink size={14} className="text-[#F7B801]" />
                  Open Public Website
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN WORKSPACE & RESPONSIVE HEADER                           */}
        {/* ============================================================ */}
        <section className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <header className="h-16 px-4 md:px-8 border-b border-[#1F2937]/70 bg-[#090D16]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
            
            {/* Left section: Hamburger for Mobile + Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-300 hover:text-white"
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 min-w-0 truncate">
                <span className="hidden sm:inline font-mono text-[#F7B801]">School Admin</span>
                {activeGroup && (
                  <>
                    <ChevronRight size={12} className="hidden sm:inline text-gray-600" />
                    <span className="hidden md:inline font-semibold text-gray-300 truncate">{activeGroup.title}</span>
                  </>
                )}
                <ChevronRight size={12} className="text-gray-600" />
                <span className="text-white font-black truncate">{activeItem.label}</span>
              </div>
            </div>

            {/* Right section: Role Switcher & Live Link */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Role Switcher Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 bg-[#111827] border border-[#1F2937] hover:border-[#374151] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  <ShieldCheck size={14} className="text-[#F7B801]" />
                  <span className="hidden sm:inline font-mono">{roleDetails.title}</span>
                  <span className="sm:hidden font-mono capitalize">{role.replace("_", " ")}</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-[#1F2937] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-[#1F2937]">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Switch Staff View</p>
                      <p className="text-xs text-gray-300 mt-0.5">Test navigation permissions by staff role</p>
                    </div>

                    {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => {
                      const rDef = ROLE_DEFINITIONS[rKey];
                      const isSelected = role === rKey;
                      return (
                        <button
                          key={rKey}
                          onClick={() => {
                            setRole(rKey);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-colors ${
                            isSelected
                              ? "bg-[#1E293B] border border-[#F7B801]/40 text-white"
                              : "hover:bg-[#1E293B]/50 text-gray-300"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold flex items-center gap-1.5">
                              {rDef.title}
                              {isSelected && <Check size={12} className="text-[#F7B801]" />}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight">{rDef.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Public Website Button */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#1F2937]/70 hover:bg-[#1F2937] border border-[#374151]/80 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
              >
                <Sparkles size={13} className="text-[#F7B801]" />
                Website
              </Link>
            </div>
          </header>

          {/* Main workspace container */}
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#070A12] to-[#06080E] flex-1">
            <div className="bg-[#090D16] border border-[#1F2937]/60 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoleProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#06080E] p-8 text-white font-bold">Loading admin portal...</div>}>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </AdminRoleProvider>
  );
}
