"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="ml-64 flex-1 bg-muted/30 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

