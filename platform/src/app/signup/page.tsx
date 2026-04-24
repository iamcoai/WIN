import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Aanmelden",
};

export default function SignupPage() {
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Mail className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h1 className="text-[1.5rem] font-semibold tracking-tight">
            Aanmelden op uitnodiging
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Registratie loopt via Reza of via een betaald traject. Neem contact
            op voor toegang tot het platform.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <a
              href="mailto:info@win.nl"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-sm"
            >
              Stuur een e-mail
            </a>
            <Link
              href={{ pathname: "/login" }}
              className="inline-flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Terug naar inloggen
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
