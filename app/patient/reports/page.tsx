"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function MyReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/reports/my")
      .then(setReports)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reports</h1>
        <p className="text-sm text-muted-foreground">clinical reports from your appointments.</p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-8 w-8 opacity-40" />
            No reports found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((rpt) => (
            <Card key={rpt.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Report #{rpt.id}</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">Diagnosis</dt>
                    <dd className="font-medium">{rpt.diagnosis}</dd>
                  </div>
                  {rpt.testRecommended && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Tests</dt>
                      <dd>{rpt.testRecommended}</dd>
                    </div>
                  )}
                  {rpt.remarks && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Remarks</dt>
                      <dd>{rpt.remarks}</dd>
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
