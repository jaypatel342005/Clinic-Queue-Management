"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Save, Pill, FileText, User, Hash } from "lucide-react";
import { toast } from "sonner";


function ConsultForm() {
  const { id } = useParams();
  const router = useRouter();
  const params = useSearchParams();
  const patientName = params.get("patient") || "Patient";
  const tokenNum = params.get("token") || "";

  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"rx" | "report">("rx"); 

  
  const [meds, setMeds] = useState([{ name: "", dosage: "", duration: "" }]);
  const [rxNotes, setRxNotes] = useState("");

  
  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState("");
  const [remarks, setRemarks] = useState("");

  
  function addMed() { setMeds([...meds, { name: "", dosage: "", duration: "" }]); }
  function removeMed(idx: number) { setMeds(meds.filter((_, i) => i !== idx)); }
  function updateMed(idx: number, field: string, val: string) {
    const updated = [...meds];
    updated[idx] = { ...updated[idx], [field]: val };
    setMeds(updated);
  }

  async function handleSaveRx(e: React.FormEvent) {
    e.preventDefault();
    
    if (meds.some(m => !m.name || !m.dosage || !m.duration)) {
      toast.error("Please fill all medicine fields.");
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/prescriptions/${id}`, {
        method: "POST",
        body: JSON.stringify({ medicines: meds, notes: rxNotes }),
      });
      toast.success("Prescription saved!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveReport(e: React.FormEvent) {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error("Diagnosis can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/reports/${id}`, {
        method: "POST",
        body: JSON.stringify({ diagnosis, testRecommended: tests, remarks }),
      });
      toast.success("Report saved!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="mt-1 shrink-0" onClick={() => router.push("/doctor")}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Consultation</h1>
          <p className="text-sm text-muted-foreground">Appointment #{id}</p>
        </div>
      </div>

      
      <Card>
        <CardContent className="flex flex-wrap items-center gap-6 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="text-sm font-medium">{patientName}</p>
            </div>
          </div>
          {tokenNum && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Hash size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Token</p>
                <p className="text-sm font-bold">{tokenNum}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      
      <div className="flex gap-2">
        <Button variant={tab === "rx" ? "default" : "outline"} size="sm" onClick={() => setTab("rx")}>
          <Pill size={14} className="mr-1.5" /> Prescription
        </Button>
        <Button variant={tab === "report" ? "default" : "outline"} size="sm" onClick={() => setTab("report")}>
          <FileText size={14} className="mr-1.5" /> Report
        </Button>
      </div>

      
      {tab === "rx" && (
        <Card>
          <form onSubmit={handleSaveRx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill size={18} className="text-primary" /> Prescription
              </CardTitle>

              <br></br>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                {meds.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_120px_40px] items-end gap-3 rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Medicine Name</Label>
                      <Input placeholder="Medicine Name" value={m.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMed(i, "name", e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Dosage</Label>
                      <Input placeholder="Dosage" value={m.dosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMed(i, "dosage", e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Duration</Label>
                      <Input placeholder="Duration" value={m.duration} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMed(i, "duration", e.target.value)} required className="bg-background" />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMed(i)} disabled={meds.length === 1} className="shrink-0 text-muted-foreground hover:text-destructive">
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={addMed}>
                <Plus size={14} className="mr-1.5" /> Add Another 
              </Button>

              <div className="space-y-1.5 border-t pt-4">
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea placeholder="additional notes here..." value={rxNotes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRxNotes(e.target.value)} rows={3} />
              </div>
              <br></br>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t bg-muted/20 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/doctor")}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                <Save size={14} className="mr-1.5" />{saving ? "Saving…" : "Save Prescription"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      
      {tab === "report" && (
        <Card>
          <form onSubmit={handleSaveReport}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText size={18} className="text-green-500" /> Clinical Report
              </CardTitle>
              <br></br>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Diagnosis <span className="text-destructive">*</span></Label>
                <Input placeholder="diagnosis..." value={diagnosis} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiagnosis(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Recommended Tests</Label>
                <Input placeholder="tests..." value={tests} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTests(e.target.value)} />
                <p className="text-xs text-muted-foreground"> empty if no tests.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Doctor&apos;s Remarks</Label>
                <Textarea placeholder="remarks..." value={remarks} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)} rows={4} />
              </div>
              <br></br>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t bg-muted/20 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/doctor")}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                <Save size={14} className="mr-1.5" />{saving ? "Saving…" : "Save Report"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}


export default function DoctorConsultation() {
  return (
    <Suspense fallback={<div className="flex h-48 items-center justify-center text-muted-foreground">Loading…</div>}>
      <ConsultForm />
    </Suspense>
  );
}
