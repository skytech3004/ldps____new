"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const chromeLess = pathname === "/admin/login" || pathname.startsWith("/admin/pages/");

  if (chromeLess) {
    return children;
  }

  return (
    <main className="min-h-screen bg-[#07090E] text-[#E2E8F0]">
      {children}
    </main>
  );
}
