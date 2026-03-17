"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/appointments/${id}`)
      .then(setData)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!data) return <p className="text-muted-foreground">Appointment not found.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/patient")}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-semibold">Appointment Details</h1>
      </div>

      {/* Overview */}
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="flex items-center gap-1 text-sm font-medium"><Calendar size={14} /> {fmtDate(data.appointmentDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="flex items-center gap-1 text-sm font-medium"><Clock size={14} /> {data.timeSlot}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant="outline" className="mt-0.5">{data.status?.replace("_", " ")}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Queue Token</p>
            <p className="text-lg font-bold text-primary">{data.queueEntry?.tokenNumber ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Prescription */}
      <Card>
        <CardHeader><CardTitle className="text-base">Prescription</CardTitle></CardHeader>
        <CardContent>
          {data.prescription ? (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Medicine</th>
                      <th className="px-3 py-2 text-left font-medium">Dosage</th>
                      <th className="px-3 py-2 text-left font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.prescription.medicines?.map((m: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2">{m.dosage}</td>
                        <td className="px-3 py-2">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.prescription.notes && (
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Notes:</span> {data.prescription.notes}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No prescription added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Report */}
      <Card>
        <CardHeader><CardTitle className="text-base">Clinical Report</CardTitle></CardHeader>
        <CardContent>
          {data.report ? (
            <dl className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Diagnosis</dt>
                <dd className="font-medium">{data.report.diagnosis}</dd>
              </div>
              {data.report.testRecommended && (
                <div>
                  <dt className="text-xs text-muted-foreground">Tests Recommended</dt>
                  <dd>{data.report.testRecommended}</dd>
                </div>
              )}
              {data.report.remarks && (
                <div>
                  <dt className="text-xs text-muted-foreground">Remarks</dt>
                  <dd>{data.report.remarks}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">No report added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
