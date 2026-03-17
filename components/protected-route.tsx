"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";


export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isLoading) return; 

    if (!user) {
      router.push("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      
      router.push(`/${user.role}`);
    } else {
      setOk(true);
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !ok) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
