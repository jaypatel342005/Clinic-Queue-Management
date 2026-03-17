"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Play, SkipForward, CheckCircle } from "lucide-react";
import { toast } from "sonner";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  waiting: { label: "Waiting", cls: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "In Progress", cls: "bg-purple-100 text-purple-700" },
  done: { label: "Done", cls: "bg-green-100 text-green-700" },
  skipped: { label: "Skipped", cls: "bg-slate-100 text-slate-500" },
};

export default function ReceptionistPage() {
  const [date, setDate] = useState(todayStr());
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = (d: string) => {
    setLoading(true);
    apiFetch(`/queue?date=${d}`)
      .then(setQueue)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(date); }, [date]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/queue/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success("Status updated");
      load(date);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Queue Manager</h1>
        <div className="flex items-center gap-2">
          <Input type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} className="w-40" />
          <Button variant="outline" size="icon" onClick={() => load(date)} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && queue.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : queue.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No queue entries for this date.</TableCell></TableRow>
            ) : (
              queue.map((q) => {
                const s = STATUS_BADGE[q.status] || { label: q.status, cls: "" };
                return (
                  <TableRow key={q.id}>
                    <TableCell className="text-lg font-bold">{q.tokenNumber}</TableCell>
                    <TableCell className="font-medium">{q.appointment?.patient?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{q.appointment?.patient?.phone || "—"}</TableCell>
                    <TableCell><Badge variant="secondary" className={s.cls}>{s.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {q.status === "waiting" && (
                          <>
                            <Button size="sm" variant="outline" disabled={updatingId === q.id} onClick={() => updateStatus(q.id, "skipped")}>
                              <SkipForward size={14} className="mr-1" /> Skip
                            </Button>
                            <Button size="sm" disabled={updatingId === q.id} onClick={() => updateStatus(q.id, "in-progress")}>
                              <Play size={14} className="mr-1" /> Call
                            </Button>
                          </>
                        )}
                        {q.status === "in_progress" && (
                          <Button size="sm" disabled={updatingId === q.id} onClick={() => updateStatus(q.id, "done")}>
                            <CheckCircle size={14} className="mr-1" /> Done
                          </Button>
                        )}
                        {(q.status === "done" || q.status === "skipped") && (
                          <span className="text-xs text-muted-foreground">—</span>
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
