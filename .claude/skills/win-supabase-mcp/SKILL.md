---
name: win-supabase-mcp
description: Bedient de Supabase MCP server (hosted, project-scoped) voor alle database-werk op WIN — schema inspecteren, read-only queries, migraties voorstellen+toepassen, TypeScript-types genereren, logs lezen. Gebruik deze skill altijd vóór directe SQL of `supabase` CLI-commando's wanneer het om het dev-project gaat. Triggers: "supabase", "database", "migratie", "schema", "tabel toevoegen", "drizzle push", "types genereren", "db-logs", "rls", "policy", "query de db", en alle M1 schema-werk (PR 01/03/03b). **Nooit** tegen productie.
---

# win-supabase-mcp — Supabase MCP werkprotocol

**Wanneer:** elk stuk database-werk op WIN in dev. Schema, queries, migraties, types, logs.
**Nooit:** tegen het productie-project. Productie = handmatig via Chris + `supabase` CLI.
**Bron:** ground-truth in memory `reference_supabase_mcp.md` — lees die altijd eerst.

## Preflight (1x per sessie)

Vóór de eerste MCP-call in een sessie:

1. Verifieer dat de MCP verbonden is: `claude mcp list | grep supabase`. Zo niet → STOP, escaleer naar Chris. (Skill kan niet installeren; dat doet Chris via `claude mcp add`.)
2. Bevestig actieve scope: run `get_project_url` via MCP. Zichtbare URL moet **dev-project** zijn, nooit `win.nl`-productie. Bij twijfel: `list_projects` (alleen zichtbaar als account-tools ingeschakeld zijn) → expliciet scope verifiëren.
3. Lees `reference_supabase_mcp.md` memory-entry (verbatim recall).

Faalt een van de drie → niet doorgaan, meld terug aan Chris.

## Operaties

### 1. Schema inspecteren (altijd veilig)

Doel: begrijpen wat er staat vóór je iets wijzigt.

Tools: `list_tables`, `list_extensions`, `list_migrations`, `execute_sql` (read-only selects op `information_schema`/`pg_catalog`).

Output: Markdown-tabel per tabel met kolommen + types + constraints. Nooit `SELECT *` op business-tabellen dumpen — te veel noise in context.

### 2. Read-only query (veilig)

Doel: data-vraag beantwoorden zonder te muteren.

Tool: `execute_sql` met read-only queries (`SELECT`, `EXPLAIN`, `SHOW`).

Regels:
- `LIMIT <= 100` by default; groter alleen op expliciete vraag.
- Geen queries die `pg_sleep`, `lock`-statements of `pg_*` admin-functies aanroepen.
- PII-kolommen (`email`, `phone`, `address`) maskeren in output tenzij Chris expliciet om de echte waarde vraagt.

### 3. Migratie voorstellen + toepassen (schrijft DDL)

Doel: schema-wijziging landen. Dit is een gate — niet zonder tussen-review van Chris.

Stappen:
1. **Ontwerp**: schrijf het Drizzle-schemafragment (`platform/src/lib/db/schema/*.ts`) in de chat. Vermeld: welke tabellen nieuw/gewijzigd, welke indices, welke constraints, welke RLS-policies.
2. **Migratie-SQL genereren**: draai `npx drizzle-kit generate` lokaal (via Bash), lees de gegenereerde SQL-file, plak die in de chat. Als het migration-pad niet via Drizzle gaat: schrijf de SQL handmatig.
3. **Preview**: toon Chris **de exacte SQL** plus één zin waarom. Wacht expliciet op "go".
4. **Apply**: `apply_migration({ name: "<iso-date>__<slug>", query: "<SQL>" })` via MCP. Niet `execute_sql` voor DDL — `apply_migration` logt in `list_migrations`.
5. **Verify**: `list_tables` / `list_migrations` na afloop, toon bevestiging.
6. **Types refresh**: roep operatie 4 aan.

Altijd expliciet bevestigen vóór: DROP TABLE/COLUMN, RENAME, ALTER TYPE, TRUNCATE, CASCADE-deletes. Dat zijn escalatie-triggers (SOUL.md kritieke regel 3).

### 4. TypeScript-types genereren

Na elke migratie: `generate_typescript_types` → output wegschrijven naar `platform/src/lib/db/types-generated.ts`. Commit als aparte commit naast de schema-change (diff-leesbaarheid).

### 5. Logs lezen (debugging)

Tool: `get_logs({ service: 'api' | 'postgres' | 'edge-function' | 'auth' | 'storage', ... })`.

Wanneer:
- Webhook- of API-call die faalt → `service: 'api'`, filter op tijdsvenster rond het event.
- Trage query → `service: 'postgres'` + `get_advisors` voor performance-hints.
- Edge function fout → `service: 'edge-function'` + function-naam.

Output: relevante regels samenvatten, niet volledige log-dump plakken (contextvervuiling).

## Guardrails (altijd aan)

1. **Dev-only**. Zie reference-memory; bij verzoek "doe dit op prod" → STOP, meld regel expliciet, laat Chris het handmatig doen.
2. **Geen silent DDL**. Elke DDL-mutatie na preview + bevestiging.
3. **Read-only default**. Twijfel je? Gebruik `execute_sql` met `SET TRANSACTION READ ONLY` of `BEGIN; ...; ROLLBACK;`.
4. **PII-bescherming**. E-mails/telefoon/adres niet loggen of echoen tenzij noodzakelijk.
5. **RLS-respect**. Bij elke nieuwe tabel: ontwerp RLS-policy mee. `apply_migration` zonder policy op user-tabellen = fail review.

## Integratie met de G-Stack sprint

- **Think (`/office-hours`)**: schema-scope uitdagen vóór migratie.
- **Plan (`/autoplan`)**: migratie-volgorde bevriezen als deel van PR-playbook.
- **Build**: deze skill.
- **Review (`/review` + `/cso`)**: DDL-diff + RLS-policies auditen.
- **Test (`/qa`)**: dev-seed → integratie-test tegen gewijzigde DB.
- **Ship**: migraties die naar prod moeten worden **handmatig** door Chris via `supabase db push` of Vercel-release-step gepromoveerd — niet via MCP.
- **Reflect (`/mem`)**: nieuwe invariants (bv. "RLS-pattern X werkt, Y niet") naar memory.

## Quick-reference — MCP tool-namen

Gebruik deze tools direct. Namen verbatim uit `reference_supabase_mcp.md`:

| Operatie | Tool |
|---|---|
| Tabellen lijsten | `list_tables` |
| Extensies | `list_extensions` |
| Migratie-historie | `list_migrations` |
| Migratie toepassen | `apply_migration` |
| SQL uitvoeren | `execute_sql` |
| Logs | `get_logs` |
| Performance-hints | `get_advisors` |
| Project-URL | `get_project_url` |
| Publishable keys | `get_publishable_keys` |
| TS-types genereren | `generate_typescript_types` |
| Edge-functions | `list_edge_functions`, `get_edge_function`, `deploy_edge_function` |
| Docs doorzoeken | `search_docs` |

## Escalatie-trigger

Stop en vraag Chris als:
- Schema-wijziging raakt `auth.users` / BetterAuth-tabellen (auth-schade = productie-pijn).
- Migratie vereist downtime (lock op grote tabel, kolom-rewrite).
- Je denkt "misschien moet dit ook op prod" — Chris beslist, nooit MCP.
- MCP-response bevat onverwachte tabel (bv. prod-data in dev-project).
