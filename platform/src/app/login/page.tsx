import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Inloggen",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      {/* Ambient background */}
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

        <div className="rounded-2xl border border-border bg-surface p-7 shadow-lg sm:p-8">
          <header className="mb-6 flex flex-col gap-1.5">
            <h1 className="text-[1.5rem] font-semibold tracking-tight">
              Welkom terug
            </h1>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              Log in op je WIN-omgeving.
            </p>
          </header>

          <LoginForm />

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Nog geen account?{" "}
            <Link
              href={{ pathname: "/signup" }}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Aanmelden
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/80">
          Weerbaarheidsinstituut Nederland · integratief &amp; psychofysiek
        </p>
      </div>
    </main>
  );
}
