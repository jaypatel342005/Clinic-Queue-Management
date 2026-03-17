"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  CalendarDays,
  ListOrdered,
  Stethoscope,
  Pill,
  FileText,
  LogOut,
  Activity,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
  ],
  patient: [
    { label: "My Appointments", href: "/patient", icon: <CalendarDays size={18} /> },
    { label: "Book Appointment", href: "/patient/book", icon: <CalendarPlus size={18} /> },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: <Pill size={18} /> },
    { label: "Reports", href: "/patient/reports", icon: <FileText size={18} /> },
  ],
  receptionist: [
    { label: "Queue Manager", href: "/receptionist", icon: <ListOrdered size={18} /> },
  ],
  doctor: [
    { label: "Today's Queue", href: "/doctor", icon: <Stethoscope size={18} /> },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Activity size={20} className="text-primary" />
        <span className="text-sm font-semibold tracking-tight">ClinicQueue</span>
      </div>

      {/* Clinic badge */}
      <div className="border-b px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Clinic</p>
        <p className="text-sm font-semibold truncate">{user.clinicName}</p>
        <p className="text-xs text-muted-foreground">{user.clinicCode}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t px-4 py-3">
        <div className="mb-2">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">{user.role}</p>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
