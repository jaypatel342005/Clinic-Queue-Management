"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/clinic")
      .then(setClinic)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!clinic) return <p className="text-muted-foreground">Failed to load clinic data.</p>;

  const stats = [
    { label: "Clinic Name", value: clinic.name, icon: <Building2 size={18} /> },
    { label: "Clinic Code", value: clinic.code, icon: <Hash size={18} /> },
    { label: "Total Users", value: clinic.usersCount ?? "—", icon: <Users size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <span className="text-muted-foreground">{s.icon}</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
