"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, Pill, FileText, User, Hash } from "lucide-react";
import { toast } from "sonner";

function ConsultationContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientName = searchParams.get("patient") || "Patient";
  const tokenNum = searchParams.get("token") || "";

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"prescription" | "report">("prescription");

  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [notes, setNotes] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState("");
  const [remarks, setRemarks] = useState("");

  const addRow = () => setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const removeRow = (i: number) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: string, value: string) => {
    const copy = [...medicines];
    copy[i] = { ...copy[i], [field]: value };
    setMedicines(copy);
  };

  const savePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (medicines.some((m) => !m.name || !m.dosage || !m.duration)) {
      toast.error("Please fill all medicine fields.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(`/prescriptions/${id}`, {
        method: "POST",
        body: JSON.stringify({ medicines, notes }),
      });
      toast.success("Prescription saved successfully!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const saveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) {
      toast.error("Diagnosis is required.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(`/reports/${id}`, {
        method: "POST",
        body: JSON.stringify({ diagnosis, testRecommended: tests, remarks }),
      });
      toast.success("Report saved successfully!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Bar ─── */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="mt-1 shrink-0" onClick={() => router.push("/doctor")}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold">Consultation</h1>
          <p className="text-sm text-muted-foreground">Appointment #{id}</p>
        </div>
      </div>

      {/* ─── Patient Info Strip ─── */}
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

      {/* ─── Tab Switcher ─── */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "prescription" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("prescription")}
        >
          <Pill size={14} className="mr-1.5" /> Prescription
        </Button>
        <Button
          variant={activeTab === "report" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("report")}
        >
          <FileText size={14} className="mr-1.5" /> Report
        </Button>
      </div>

      {/* ─── Prescription Form ─── */}
      {activeTab === "prescription" && (
        <Card>
          <form onSubmit={savePrescription}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill size={18} className="text-blue-500" /> Prescription
              </CardTitle>
              <CardDescription>Add medicines and instructions for the patient.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                {medicines.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_120px_40px] items-end gap-3 rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Medicine Name</Label>
                      <Input
                        placeholder="e.g. Paracetamol"
                        value={m.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(i, "name", e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Dosage</Label>
                      <Input
                        placeholder="e.g. 500mg"
                        value={m.dosage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(i, "dosage", e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Duration</Label>
                      <Input
                        placeholder="e.g. 5 days"
                        value={m.duration}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(i, "duration", e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(i)}
                      disabled={medicines.length === 1}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={addRow}>
                <Plus size={14} className="mr-1.5" /> Add Another Medicine
              </Button>

              <div className="space-y-1.5 border-t pt-4">
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  placeholder="e.g. Take after food, drink plenty of water…"
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t bg-muted/20 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/doctor")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save size={14} className="mr-1.5" />
                {submitting ? "Saving…" : "Save Prescription"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ─── Report Form ─── */}
      {activeTab === "report" && (
        <Card>
          <form onSubmit={saveReport}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText size={18} className="text-green-500" /> Clinical Report
              </CardTitle>
              <CardDescription>Record the diagnosis, tests, and remarks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Diagnosis <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Viral Fever, Hypertension"
                  value={diagnosis}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiagnosis(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Recommended Tests</Label>
                <Input
                  placeholder="e.g. Complete Blood Count (CBC), X-Ray Chest"
                  value={tests}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTests(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty if no tests needed.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Doctor&apos;s Remarks</Label>
                <Textarea
                  placeholder="e.g. Rest for 3 days, follow up next week…"
                  value={remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t bg-muted/20 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/doctor")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save size={14} className="mr-1.5" />
                {submitting ? "Saving…" : "Save Report"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}

export default function DoctorConsultationPage() {
  return (
    <Suspense fallback={<div className="flex h-48 items-center justify-center text-muted-foreground">Loading…</div>}>
      <ConsultationContent />
    </Suspense>
  );
}
