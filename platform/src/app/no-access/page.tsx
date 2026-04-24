import Link from "next/link";
import { ShieldAlert, ArrowRight, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NoAccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(184,150,12,0.08),transparent_55%),radial-gradient(circle_at_75%_85%,rgba(74,74,42,0.06),transparent_55%)]"
      />

      <div className="w-full max-w-[22rem] animate-fade-in">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-[1.375rem] font-semibold tracking-tight">WIN</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Platform
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-7 text-center shadow-lg sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
            <ShieldAlert className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h1 className="text-[1.5rem] font-semibold tracking-tight">
            Nog geen actieve inschrijving
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
            We hebben voor jouw account nog geen actieve inschrijving gevonden.
            Net betaald? Geef het systeem een paar minuten om te synchroniseren.
            Voor vragen: mail Reza of je coach.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="https://www.win.nl/aanbod"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
            >
              Bekijk het aanbod <ArrowRight className="h-4 w-4" />
            </Link>
            <form action="/api/auth/sign-out" method="post">
              <Button
                type="submit"
                variant="ghost"
                size="lg"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Uitloggen
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
