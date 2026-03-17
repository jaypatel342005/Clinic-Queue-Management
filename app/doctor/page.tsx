"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Stethoscope } from "lucide-react";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; cls: string }> = {
  waiting:     { label: "Waiting",         cls: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "In Consultation", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  done:        { label: "Completed",       cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  skipped:     { label: "Skipped",         cls: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function DoctorQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    apiFetch("/doctor/queue")
      .then(setQueue)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { refresh(); }, []);

  
  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Queue</h1>
          <p className="text-sm text-muted-foreground">{todayLabel}</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw size={14} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-center">Token</TableHead>
              <TableHead className="font-bold text-center">Patient Name</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && queue.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : queue.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No patients in your queue.</TableCell></TableRow>
            ) : (
              queue.map((item) => {
                const st = statusMap[item.status] || { label: item.status, cls: "" };
                return (
                  <TableRow key={item.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {item.tokenNumber}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-center">{item.patientName}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={st.cls}>{st.label}</Badge></TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Link href={`/doctor/appointments/${item.appointmentId}?patient=${encodeURIComponent(item.patientName)}&token=${item.tokenNumber}`}>
                          <Button size="sm" variant={item.status === "in_progress" ? "default" : "outline"}>
                            <Stethoscope size={14} className="mr-1.5" /> Consult
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
