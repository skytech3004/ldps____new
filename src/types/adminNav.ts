import { LucideIcon } from "lucide-react";

export type UserRole = "super_admin" | "admin" | "accountant" | "admission" | "staff";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
  roles?: UserRole[]; // If undefined, accessible to all admin roles
}

export interface NavGroup {
  id: string;
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
}
