import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aanmelden",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
        <h1 className="text-2xl font-semibold text-win-charcoal">
          Aanmelden
        </h1>
        <p className="mt-3 text-sm text-win-charcoal/70">
          Registratie is op dit moment op uitnodiging. Neem contact op met WIN
          of je coach om toegang te krijgen.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-win-gold underline-offset-4 hover:underline"
        >
          ← Terug naar inloggen
        </Link>
      </div>
    </main>
  );
}
