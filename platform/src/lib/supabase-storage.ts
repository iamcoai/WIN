import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Returns a Supabase client authenticated with the service-role key.
 * Server-side only. Throws if env vars are missing — catch in the caller
 * and present a user-friendly message.
 */
export function getStorageClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ontbreekt. Voeg 'm toe aan platform/.env.local (Dashboard → Project Settings → API → service_role key).",
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const DOCUMENTS_BUCKET = "documents";
