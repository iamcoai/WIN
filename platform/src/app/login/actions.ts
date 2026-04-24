"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type State = { error?: string };

export async function loginAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Vul e-mail en wachtwoord in." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Inloggen mislukt. Probeer opnieuw.";
    return { error: message };
  }

  redirect("/");
}
