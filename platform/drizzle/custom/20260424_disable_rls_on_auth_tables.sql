-- Applied via Supabase MCP on 2026-04-24 (version 20260424150837).
-- Chris approved (option A): disable RLS on BetterAuth infra tables;
-- BetterAuth owns access control at the app layer (session validation).
-- Business-domain tables in later PRs MUST keep RLS + policies.

ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" DISABLE ROW LEVEL SECURITY;
