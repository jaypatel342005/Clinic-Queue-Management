"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// 15-min slots from 09:00 to 17:00
const SLOTS: string[] = [];
for (let h = 9; h < 17; h++) {
  for (const m of [0, 15, 30, 45]) {
    const sh = String(h).padStart(2, "0");
    const sm = String(m).padStart(2, "0");
    const em = (m + 15) % 60;
    const eh = em === 0 ? h + 1 : h;
    SLOTS.push(`${sh}:${sm}-${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`);
  }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BookAppointmentPage() {
  const [date, setDate] = useState(todayStr());
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) { toast.error("Please select a time slot."); return; }
    setSubmitting(true);
    try {
      await apiFetch("/appointments", {
        method: "POST",
        body: JSON.stringify({ appointmentDate: date, timeSlot: slot }),
      });
      toast.success("Appointment booked!");
      router.push("/patient");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader><CardTitle className="text-lg">Choose a date & time</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" min={todayStr()} value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select value={slot} onValueChange={(v) => setSlot(v || "")}>
                <SelectTrigger><SelectValue placeholder="Pick a slot" /></SelectTrigger>
                <SelectContent className="max-h-48">
                  {SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => router.push("/patient")}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Booking…" : "Book"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
