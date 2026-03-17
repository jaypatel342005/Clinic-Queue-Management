"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ClinicOverview() {
  const [clinic, setClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClinic() {
      try {
        const data = await apiFetch("/admin/clinic");
        setClinic(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load clinic information");
      } finally {
        setIsLoading(false);
      }
    }
    loadClinic();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  }

  if (!clinic) {
    return <div>Failed to load clinic data.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clinic Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clinic.name}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clinic Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clinic.code}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clinic.usersCount || 'N/A'}</div>
          <p className="text-xs text-muted-foreground">Admin, Doctors, Patients</p>
        </CardContent>
      </Card>
    </div>
  );
}
