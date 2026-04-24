-- Applied via Supabase MCP on 2026-04-24 (version ...).
-- Follow-up to RLS-disable: without RLS the public anon/authenticated
-- roles could query account.password, session.token, etc via PostgREST.
-- Revoke everything from both roles; keep service_role + postgres.

REVOKE ALL ON TABLE "user" FROM anon, authenticated;
REVOKE ALL ON TABLE "session" FROM anon, authenticated;
REVOKE ALL ON TABLE "account" FROM anon, authenticated;
REVOKE ALL ON TABLE "verification" FROM anon, authenticated;

GRANT ALL ON TABLE "user" TO service_role;
GRANT ALL ON TABLE "session" TO service_role;
GRANT ALL ON TABLE "account" TO service_role;
GRANT ALL ON TABLE "verification" TO service_role;
