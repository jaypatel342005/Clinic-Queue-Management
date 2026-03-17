"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Play, SkipForward, CheckCircle, Phone, User } from "lucide-react";
import { toast } from "sonner";


function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  waiting:     { label: "Waiting",     className: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "In Progress", className: "bg-purple-50 text-purple-700 border-purple-200" },
  done:        { label: "Completed",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  skipped:     { label: "Skipped",     className: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function QueueManager() {
  const [date, setDate] = useState(today());
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null); 

  function loadQueue(d: string) {
    setLoading(true);
    apiFetch(`/queue?date=${d}`)
      .then(setEntries)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadQueue(date); }, [date]);

  async function updateStatus(id: number, newStatus: string) {
    setBusyId(id);
    try {
      await apiFetch(`/queue/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated");
      loadQueue(date);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Queue Manager</h1>
          <p className="text-sm text-muted-foreground">manage patient flow.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} className="w-44" />
          <Button variant="outline" size="icon" onClick={() => loadQueue(date)} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className = "bg-muted/50">
              <TableHead className="font-bold text-center">Token</TableHead>
              <TableHead className="font-bold text-center">Patient</TableHead>
              <TableHead className="font-bold text-center">Phone</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && entries.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No queue entries for this date.</TableCell></TableRow>
            ) : (
              entries.map((entry) => {
                const style = statusStyles[entry.status] || { label: entry.status, className: "" };
                return (
                  <TableRow key={entry.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center text-sm font-bold text-primary">
                        {entry.tokenNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        
                        <span className="font-medium">{entry.appointment?.patient?.name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                        {entry.appointment?.patient?.phone || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={style.className}>{style.label}</Badge></TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {entry.status === "waiting" && (
                          <>
                            <Button size="sm" variant="outline" disabled={busyId === entry.id} onClick={() => updateStatus(entry.id, "skipped")}>
                              <SkipForward size={14} className="mr-1" /> skip
                            </Button>
                            <Button size="sm" disabled={busyId === entry.id} onClick={() => updateStatus(entry.id, "in-progress")}>
                              <Play size={14} className="mr-1" /> call In
                            </Button>
                          </>
                        )}
                        {entry.status === "in_progress" && (
                          <Button size="sm" disabled={busyId === entry.id} onClick={() => updateStatus(entry.id, "done")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <CheckCircle size={14} className="mr-1" /> mark done
                          </Button>
                        )}
                        {(entry.status === "done" || entry.status === "skipped") && (
                          <span className="text-xs italic text-muted-foreground">No actions</span>
                        )}
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
