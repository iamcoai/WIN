"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-win-charcoal">E-mailadres</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="rounded-lg border border-win-charcoal/15 bg-white px-3.5 py-2.5 text-base outline-none focus:border-win-gold focus:ring-2 focus:ring-win-gold/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-win-charcoal">Wachtwoord</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={8}
          required
          className="rounded-lg border border-win-charcoal/15 bg-white px-3.5 py-2.5 text-base outline-none focus:border-win-gold focus:ring-2 focus:ring-win-gold/30"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-win-gold px-4 py-2.5 font-semibold text-white transition hover:bg-win-olive disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Bezig…" : "Inloggen"}
      </button>
    </form>
  );
}
