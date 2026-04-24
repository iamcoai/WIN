# platform/drizzle/custom/

Raw SQL migrations that sit **outside** the Drizzle declarative schema —
things Drizzle can't express (RLS toggles, role grants, function bodies,
triggers, policies, extensions, etc.).

Workflow:

1. Draft the SQL. Preview to Chris. Get `go`.
2. Apply via Supabase MCP (`apply_migration`) — that registers the
   migration in Supabase's own ledger.
3. Save the exact SQL here, file-named `<YYYYMMDD>_<slug>.sql`, so the
   git repo has the full history and future-Kick can see what was done.
4. Commit alongside whichever feature PR requires it.

These files are **reference**, not source-of-truth. The source-of-truth
is the applied state in Supabase (visible via `list_migrations`). If the
two drift, trust Supabase; reconcile by adding a new migration, never by
rewriting an old file.
