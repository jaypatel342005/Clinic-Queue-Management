"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-muted/30 px-4">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        
        <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-[28px] bg-primary/10 shadow-sm ring-1 ring-primary/20">
          <Activity size={44} className="text-primary" />
        </div>
        
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground/90">
          ClinicQueue
        </h1>
        
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          A smart queue management system .
        </p>
        
        <Link href="/login" className="w-full sm:w-auto mt-2">
          <Button size="lg" className="h-14 w-full px-12 text-[17px] font-medium shadow-md transition-all hover:shadow-lg sm:w-auto rounded-xl bg-primary/95 hover:bg-primary">
            Go to Dashboard <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
        
        <p className="mt-16 text-sm text-muted-foreground">
          Created by Jay Patel
        </p>

      </div>
    </div>
  );
}
