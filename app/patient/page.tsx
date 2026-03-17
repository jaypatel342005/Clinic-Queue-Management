"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Calendar, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";


const statusColors: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  queued: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-purple-50 text-purple-700 border-purple-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/appointments/my")
      .then(setAppointments)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-sm text-muted-foreground">View and manage your booked appointments.</p>
        </div>
        <Link href="/patient/book">
          <Button><Plus size={16} className="mr-1.5" /> Book Appointment</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : appointments.length === 0 ? (
        <Card >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Calendar size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No appointments booked</p>
              <p className="text-sm text-muted-foreground">book your first appointment.</p>
            </div>
            <Link href="/patient/book"><Button variant="outline">Book Appointment</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => (
            <Link key={apt.id} href={`/patient/appointments/${apt.id}`}>
              <Card className="cursor-pointer py-0 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary" />
                      <span className="text-sm font-semibold">{formatDate(apt.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="outline" className={statusColors[apt.status] || ""}>
                        {apt.status?.replace("_", " ")}
                      </Badge>
                      {apt.queueEntry?.tokenNumber && (
                        <Badge variant="secondary" className="font-bold">#{apt.queueEntry.tokenNumber}</Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground/50" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
