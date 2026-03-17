"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Building2, Users, Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/clinic")
      .then((data) => setClinic(data))
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!clinic) return <p className="text-muted-foreground">Couldn't load clinic data.</p>;

 
  const cards = [
    { label: "Clinic Name", val: clinic.name, icon: <Building2 size={20} />, color: "text-primary bg-primary/10" },
    { label: "Clinic Code", val: clinic.code, icon: <Hash size={20} />, color: "text-amber-600 bg-amber-50" },
    { label: "Total Users", val: clinic.usersCount ?? "—", icon: <Users size={20} />, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
       
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.color}`}>
                {c.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="text-xl font-bold">{c.val}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
