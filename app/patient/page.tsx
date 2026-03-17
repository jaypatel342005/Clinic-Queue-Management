"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Calendar, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLOR: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  queued: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-purple-100 text-purple-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PatientDashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/appointments/my")
      .then(setAppointments)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <Link href="/patient/book">
          <Button size="sm"><Plus size={16} className="mr-1" /> Book</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">No appointments yet.</p>
            <Link href="/patient/book"><Button variant="outline" size="sm">Book your first appointment</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((a) => (
            <Link key={a.id} href={`/patient/appointments/${a.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{fmtDate(a.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{a.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="secondary" className={STATUS_COLOR[a.status] || ""}>
                        {a.status?.replace("_", " ")}
                      </Badge>
                      {a.queueEntry?.tokenNumber && (
                        <Badge variant="outline">Token {a.queueEntry.tokenNumber}</Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
