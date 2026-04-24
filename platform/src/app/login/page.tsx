import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Inloggen",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <header className="mb-6 flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-semibold text-win-charcoal">
            Welkom terug
          </h1>
          <p className="text-sm text-win-charcoal/70">
            Log in op je WIN-omgeving.
          </p>
        </header>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-win-charcoal/60">
          Nog geen account?{" "}
          <Link
            href="/signup"
            className="font-medium text-win-gold underline-offset-4 hover:underline"
          >
            Aanmelden
          </Link>
        </p>
      </div>
    </main>
  );
}
