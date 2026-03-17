"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/appointments/${id}`)
      .then(setAppt)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!appt) return <p className="text-muted-foreground">appointment not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/patient")}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Appointment Details</h1>
      </div>

      
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="flex items-center gap-1 text-sm font-medium">{formatDate(appt.appointmentDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="flex items-center gap-1 text-sm font-medium">{appt.timeSlot}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant="outline" className="mt-0.5">{appt.status?.replace("_", " ")}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Queue Token</p>
            <p className="text-lg font-bold text-primary">{appt.queueEntry?.tokenNumber ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Prescription</CardTitle></CardHeader>
        <CardContent>
          {appt.prescription ? (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-center font-medium">Medicine</th>
                      <th className="px-3 py-2 text-center font-medium">Dosage</th>
                      <th className="px-3 py-2 text-center font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appt.prescription.medicines?.map((med: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 text-center">{med.name}</td>
                        <td className="px-3 py-2 text-center">{med.dosage}</td>
                        <td className="px-3 py-2 text-center">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {appt.prescription.notes && (
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Notes:</span> {appt.prescription.notes}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No prescription</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Clinical Report</CardTitle></CardHeader>
        <CardContent>
          {appt.report ? (
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Diagnosis</dt>
                <dd className="font-medium">{appt.report.diagnosis}</dd>
              </div>
              {appt.report.testRecommended && (
                <div>
                  <dt className="text-xs text-muted-foreground">Tests</dt>
                  <dd>{appt.report.testRecommended}</dd>
                </div>
              )}
              {appt.report.remarks && (
                <div>
                  <dt className="text-xs text-muted-foreground">Remarks</dt>
                  <dd>{appt.report.remarks}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">No report</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
