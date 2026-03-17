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


const timeSlots: string[] = [];
for (let h = 9; h < 17; h++) {
  for (const m of [0, 15, 30, 45]) {
    const start = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const endMin = (m + 15) % 60;
    const endHour = endMin === 0 ? h + 1 : h;
    const end = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
    timeSlots.push(`${start}-${end}`);
  }
}


function getToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookAppointment() {
  const [date, setDate] = useState(getToday());
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) {
      toast.error("Please pick a time slot");
      return;
    }
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
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-sm text-muted-foreground">Select a date & time slot.</p>
      </div>

      <Card>
        <form onSubmit={handleBook}>
          <CardHeader><CardTitle className="text-lg">Choose a slot</CardTitle></CardHeader>
          <br></br>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                min={getToday()}
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select value={slot} onValueChange={(v) => setSlot(v || "")}>
                <SelectTrigger><SelectValue placeholder="pick a slot" /></SelectTrigger>
                <SelectContent className="max-h-48">
                  {timeSlots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
