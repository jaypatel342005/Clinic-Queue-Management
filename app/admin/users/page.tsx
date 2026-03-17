"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";


const badgeColors: Record<string, string> = {
  admin: "bg-blue-50 text-blue-700 border-blue-200",
  doctor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  receptionist: "bg-amber-50 text-amber-700 border-amber-200",
  patient: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("patient");

  function fetchUsers() {
    setLoading(true);
    apiFetch("/admin/users")
      .then(setUsers)
      .catch((err: any) => toast.error(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsers(); }, []);

  function resetForm() {
    setName(""); setEmail(""); setPassword(""); setPhone(""); setRole("patient");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role, phone: phone || undefined }),
      });
      toast.success("User created successfully");
      setDialogOpen(false);
      resetForm();
      fetchUsers(); 
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">manage staff and patients in your clinic.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus size={16} /> Add User
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>add a  staffmember or patient to clinic.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required minLength={3} placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required minLength={6} placeholder="min 6 characters" />
              </div>
              <div className="space-y-2">
                <Label>Phone <span className="text-muted-foreground">(optional)</span></Label>
                <Input value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} placeholder="999999999" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v || "patient")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create User"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-center">Name</TableHead>
              <TableHead className="font-bold text-center">Email</TableHead>
              <TableHead className="font-bold text-center">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <Loader2 className="mx-auto inline-flex items-center h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">No users found. Create one above!</TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium text-center">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground text-center">{u.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={badgeColors[u.role] || ""}>
                      {u.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
