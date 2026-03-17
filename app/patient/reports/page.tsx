"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/reports/my")
      .then(setReports)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Reports</h1>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : reports.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No reports yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {reports.map((r: any, idx: number) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Appointment #{r.appointmentId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Diagnosis</dt>
                    <dd className="font-medium">{r.diagnosis}</dd>
                  </div>
                  {r.testRecommended && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Tests</dt>
                      <dd>{r.testRecommended}</dd>
                    </div>
                  )}
                  {r.remarks && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Remarks</dt>
                      <dd>{r.remarks}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
