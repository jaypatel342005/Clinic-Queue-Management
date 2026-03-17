"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Activity, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); 
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      
      router.push(`/${data.user.role}`);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm ring-1 ring-primary/20">
            <Activity size={32} className="text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">ClinicQueue Login</h1>
          </div>
        </div>

        <Card className="shadow-lg border-primary/10">
          <form onSubmit={handleLogin}>
            <CardHeader className="text-center space-y-2 pb-6 pt-8">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Enter your credential details to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  disabled={busy}
                  autoFocus
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  disabled={busy}
                  className="h-12 text-base"
                />
              </div>
            </CardContent>
            <CardFooter className="pb-8 pt-4 px-8">
              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={busy}>
                {busy ? (
                  <><Loader2 size={18} className="mr-2 animate-spin" /> Signing in…</>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        
      </div>
    </div>
  );
}
