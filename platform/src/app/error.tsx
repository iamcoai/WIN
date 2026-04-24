"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <h1 className="font-heading text-[1.375rem] font-semibold tracking-tight">
          Er ging iets mis
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Onverwachte fout. Probeer opnieuw of keer terug naar de startpagina.
          Herhaalt het zich? Mail <a className="text-primary hover:underline" href="mailto:info@win.nl">info@win.nl</a>.
        </p>
        {error.digest ? (
          <p className="mt-3 text-[0.6875rem] font-mono text-muted-foreground/60">
            ref: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>
            <RefreshCcw className="h-4 w-4" /> Probeer opnieuw
          </Button>
          <Link
            href={{ pathname: "/" }}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Home className="h-4 w-4" /> Naar start
          </Link>
        </div>
      </div>
    </main>
  );
}
