"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/prescriptions/my")
      .then(setPrescriptions)
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Prescriptions</h1>

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : prescriptions.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No prescriptions yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p: any, idx: number) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Appointment #{p.appointmentId}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                      {p.medicines?.map((m: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{m.name}</td>
                          <td className="px-3 py-2">{m.dosage}</td>
                          <td className="px-3 py-2">{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {p.notes && <p className="mt-2 text-sm text-muted-foreground">Notes: {p.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
