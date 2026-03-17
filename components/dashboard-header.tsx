"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold capitalize tracking-tight">
          {user?.clinicName} - {user?.role} Portal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end text-sm md:flex">
          <span className="font-medium leading-none">{user?.name}</span>
          <span className="text-muted-foreground">{user?.email}</span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <UserIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => logout()} title="Log out">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}
