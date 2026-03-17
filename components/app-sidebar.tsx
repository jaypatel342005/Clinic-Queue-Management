"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/contexts/auth-context";
import {
  LayoutDashboard, Users, CalendarPlus, CalendarDays,
  ListOrdered, Stethoscope, Pill, FileText,
  LogOut, Activity, ChevronRight,
} from "lucide-react";

const navConfig: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
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

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  doctor: "Doctor",
  receptionist: "Receptionist",
  patient: "Patient",
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = navConfig[user.role] || [];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground shadow-sm">
      
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Activity size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">ClinicQueue</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Management</p>
        </div>
      </div>

      
      <div className="border-b px-5 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Clinic</p>
        <p className="mt-0.5 text-sm font-semibold truncate">{user.clinicName}</p>
        <p className="text-xs text-muted-foreground">{user.clinicCode}</p>
      </div>

      
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Menu</p>
        {links.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-primary/50" />}
            </Link>
          );
        })}
      </nav>

      
      <div className="border-t px-4 py-4">
        <div className="mb-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <p className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {roleLabels[user.role] || user.role}
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
