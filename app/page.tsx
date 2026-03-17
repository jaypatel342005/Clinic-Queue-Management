"use client";

import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Users, CalendarCheck, Clock } from "lucide-react";

const FEATURES = [
  { icon: <ShieldCheck size={20} />, title: "Multi-tenant Security", desc: "Complete data isolation per clinic." },
  { icon: <CalendarCheck size={20} />, title: "Smart Booking", desc: "Patients book by date & time slot." },
  { icon: <Clock size={20} />, title: "Live Queue", desc: "Receptionists advance status in real time." },
  { icon: <Users size={20} />, title: "Role-based Access", desc: "Admins, Doctors, Receptionists, Patients." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Activity size={20} className="text-primary" />
            ClinicQueue
          </div>
          <Link href="/login" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
            Log in <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="mb-4 inline-block rounded-full border px-3 py-1 text-xs font-medium">v1.0</span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Smart Queue Management<br />for <span className="text-primary">Modern Clinics</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          A multi-tenant platform connecting patients, doctors, receptionists, and administrators under one dashboard.
        </p>
        <Link href="/login" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          Access Portal <ArrowRight size={16} />
        </Link>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Built for Darshan University • v1.0.0
      </footer>
    </div>
  );
}
