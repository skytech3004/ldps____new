"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, NavItem } from "@/types/adminNav";
import { allNavItems } from "@/data/adminNav";

interface RoleDetails {
  id: UserRole;
  title: string;
  badgeColor: string;
  description: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDetails> = {
  super_admin: {
    id: "super_admin",
    title: "Super Administrator",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description: "Full access to all school administration features, users, and settings.",
  },
  admin: {
    id: "admin",
    title: "School Principal / Vice Principal",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "Full management of academic, website, and institutional content.",
  },
  accountant: {
    id: "accountant",
    title: "Accountant / Office Staff",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "Access to fee structures, bus routes, disclosures, and financial documents.",
  },
  admission: {
    id: "admission",
    title: "Admission Staff",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "Access to parent inquiries, alumni records, pre-primary showcase, and downloads.",
  },
  staff: {
    id: "staff",
    title: "Teaching / General Staff",
    badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    description: "Access to notice board, school holidays, and events.",
  },
};

interface AdminRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canAccessRoute: (href: string) => boolean;
  canAccessItem: (item: NavItem) => boolean;
  isSuperAdmin: boolean;
  roleDetails: RoleDetails;
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("super_admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("lps_admin_role") as UserRole;
    if (savedRole && ROLE_DEFINITIONS[savedRole]) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("lps_admin_role", newRole);
  };

  const canAccessItem = (item: NavItem): boolean => {
    if (role === "super_admin") return true;
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  };

  const canAccessRoute = (href: string): boolean => {
    if (role === "super_admin") return true;
    const navItem = allNavItems.find((item) => item.href === href);
    if (!navItem) return true; // Default allow if unknown route
    return canAccessItem(navItem);
  };

  return (
    <AdminRoleContext.Provider
      value={{
        role,
        setRole,
        canAccessRoute,
        canAccessItem,
        isSuperAdmin: role === "super_admin",
        roleDetails: ROLE_DEFINITIONS[role],
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext);
  if (!context) {
    throw new Error("useAdminRole must be used within an AdminRoleProvider");
  }
  return context;
}
