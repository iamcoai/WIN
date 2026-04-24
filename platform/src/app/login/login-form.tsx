"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mailadres</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="jij@domein.nl"
          required
          className="h-10 text-[0.9375rem]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Wachtwoord</Label>
          <span className="text-xs text-muted-foreground/80">min. 8 tekens</span>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={8}
          required
          className="h-10 text-[0.9375rem]"
        />
      </div>

      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive animate-fade-in"
        >
          {state.error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="mt-1 h-11 w-full text-[0.9375rem] font-medium"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Bezig…
          </>
        ) : (
          "Inloggen"
        )}
      </Button>
    </form>
  );
}
