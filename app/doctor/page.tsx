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

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  waiting: { label: "Waiting", cls: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "With You", cls: "bg-purple-100 text-purple-700" },
  done: { label: "Done", cls: "bg-green-100 text-green-700" },
  skipped: { label: "Skipped", cls: "bg-slate-100 text-slate-500" },
};

export default function DoctorDashboardPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch("/doctor/queue")
      .then(setQueue)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Today's Queue</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && queue.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : queue.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No patients in your queue today.</TableCell></TableRow>
            ) : (
              queue.map((q) => {
                const s = STATUS_BADGE[q.status] || { label: q.status, cls: "" };
                return (
                  <TableRow key={q.id}>
                    <TableCell className="text-lg font-bold">{q.tokenNumber}</TableCell>
                    <TableCell className="font-medium">{q.patientName}</TableCell>
                    <TableCell><Badge variant="secondary" className={s.cls}>{s.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Link href={`/doctor/appointments/${q.appointmentId}?patient=${encodeURIComponent(q.patientName)}&token=${q.tokenNumber}`}>
                        <Button size="sm" variant={q.status === "in_progress" ? "default" : "outline"}>
                          <Stethoscope size={14} className="mr-1" /> Consult
                        </Button>
                      </Link>
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
