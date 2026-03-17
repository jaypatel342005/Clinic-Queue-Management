"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pill } from "lucide-react";
import { toast } from "sonner";

export default function MyPrescriptions() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/prescriptions/my")
      .then(setList)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Prescriptions</h1>
        <p className="text-sm text-muted-foreground">all prescriptions from your appointments.</p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Pill className="mx-auto mb-3 h-8 w-8 opacity-40" />
            No prescriptions found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((rx) => (
            <Card key={rx.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Prescription #{rx.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="overflow-x-auto rounded border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-1.5 text-center font-medium">Medicine</th>
                        <th className="px-3 py-1.5 text-center font-medium">Dosage</th>
                        <th className="px-3 py-1.5 text-center font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.medicines?.map((m: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-1.5 text-center">{m.name}</td>
                          <td className="px-3 py-1.5 text-center">{m.dosage}</td>
                          <td className="px-3 py-1.5 text-center">{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rx.notes && <p className="text-muted-foreground"><strong>Notes:</strong> {rx.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
