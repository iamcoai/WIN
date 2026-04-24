# WIN Coaching Platform — Full build handoff (2026-04-24)

**Branch:** `feat/platform-01-scaffold`
**Commits:** 13 (from T1 scaffold to PR 22b admin surface)
**Files:** 141 gewijzigd, +24,007 lines
**Build:** groen, 34 routes
**Chris action needed:** zie laagste sectie.

---

## TL;DR

Het complete platform is code-compleet en bouwt clean. Alle drie de surfaces
(client, coach, admin) tonen echte data uit Supabase. Zodra jij
`DATABASE_URL` invult in `platform/.env.local` en `npm run dev:platform`
draait kun je inloggen en het hele product dogfooden.

---

## Wat er staat

### Backend
- **Supabase dev-project** `ujlkvaxlmrsvzgmlakgn` — 23 tabellen live,
  0 security-lints, 6 migraties geregistreerd
- **Drizzle schema** in `platform/src/lib/db/schema/` met 3 modules:
  `auth.ts` (BetterAuth), `enrollment.ts` (P&P), `core.ts` (domein)
- **BetterAuth** met drizzle-adapter, email+password, scrypt hashes,
  7-day sessions, Next.js handler op `/api/auth/[...all]`
- **Plug and Pay** client (`pnpFetch` + services + mappers),
  webhook handler met HMAC-verify, cron sync endpoint
- **Proxy** guard die `/app`, `/coach`, `/admin` afschermt; `/login`
  redirect als je al ingelogd bent

### 3 surfaces, 34 routes

**Client** `/app/*`
- `/app` — welkom-dashboard met Zin/Betekenis/Vrijheid pills en 4 tegels
- `/app/trajecten` — lijst eigen trajecten met progress-bar
- `/app/trajecten/[id]` — module-view met opdracht-checkmarks
- `/app/habits` — 7-dagen grid + toggle per dag
- `/app/chat` — chat-stream met coach, verstuur via server action
- `/app/afspraken` — komende + afgelopen sessies
- `/app/formulieren` — openstaande + ingediende formulieren
- `/app/formulieren/[id]` — dynamic form renderer uit jsonb fields

**Coach** `/coach/*`
- `/coach` — dashboard
- `/coach/clienten` — grouped client-list met traject-chips
- `/coach/clienten/[id]` — detail: trajecten + afspraken + habits + chat
- `/coach/trajecten` — lijst eigen trajecten
- `/coach/trajecten/[id]` — modules + opdrachten overzicht
- `/coach/sessies` — agenda
- `/coach/chat` — threads-list
- `/coach/rapportage` — 4-tile stats

**Admin** `/admin/*`
- `/admin` — dashboard
- `/admin/users` — user-table met rollen
- `/admin/crm` — 5-column pipeline-board (leads)
- `/admin/payments` — enrollments-overview met P&P-ID's
- `/admin/projecten` — projecten met task-count
- `/admin/kanban` — 4-column board (todo/doing/review/done)
- `/admin/inbox` — webhook_event feed
- `/admin/pages` — explorer van `web/` pagina's
- `/admin/integrations` — live-status van alle integraties (env-based)
- `/admin/settings` — config-panels

### Skills + MCP
- **shadcn MCP** geregistreerd in `.mcp.json` — 47 componenten
  geïnstalleerd, volledige WIN token-mapping (`--primary = win-gold`,
  etc.) zodat alles out-of-the-box in huisstijl rendert
- **Nieuwe skill `/win-shadcn`** — werkprotocol voor alle UI-taken
- **TOOLS.md** bijgewerkt met shadcn MCP + trigger-routing

### Seeded demo-data (klaar om in te loggen)
- **3 users** (chris=admin, reza=coach, demo-client=client)
- **1 demo traject** (12-weken, 2 modules, 3 opdrachten)
- **3 habits** voor demo-client met 5-dagen log
- **1 chat-thread** met 3 berichten
- **1 upcoming afspraak** (+2 dagen)
- **1 intake-formulier** (4 vragen)
- **3 leads** in CRM
- **3 projecten** + **5 tasks** in kanban

---

## Lokaal draaien — wat Chris nú moet doen

### Stap 1: Supabase DATABASE_URL ophalen (30 seconden)

1. Open https://supabase.com/dashboard/project/ujlkvaxlmrsvzgmlakgn/settings/database
2. Scroll naar **Connection string**
3. Kies **Transaction pooler** (port 6543)
4. Klik **Show password**, copy de volledige URL
5. Plak 'm in `platform/.env.local` als:

```bash
DATABASE_URL=postgres://postgres.ujlkvaxlmrsvzgmlakgn:<YOUR-PASSWORD>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Stap 2: Start de dev-server

```bash
cd ~/Desktop/WIN
npm run dev:platform
```

Open **http://localhost:3001** → login-scherm.

### Stap 3: Login

Drie accounts om te proberen (zelfde wachtwoord):

| Rol | Email | Password | Landt op |
|---|---|---|---|
| Admin | `chris@co-creatie.ai` | `win-dev-2026!` | `/admin` |
| Coach | `reza@win.nl` | `win-dev-2026!` | `/coach` |
| Client | `demo-client@win.nl` | `win-dev-2026!` | `/app` |

⚠️  **Rotate `win-dev-2026!` vóór je naar staging/production gaat.** Het is
nu de wachtwoord-hash in de dev-DB en staat in deze handoff.

---

## Wat nog niet af is (bewuste shortcuts)

Om binnen redelijk scope te blijven heb ik de volgende dingen gepland
maar niet gebouwd. Ze zijn allemaal add-ons op het huidige fundament:

### Client surface
- Opdracht-response submit-flow (pagina bestaat, submit mist)
- Chat realtime via Supabase Realtime (nu pagina-refresh)
- Formulier-completion tracking in het dashboard (nu los)

### Coach surface
- Trajectbouwer (create/edit modules + opdrachten) — pagina is read-only
- Formulieren-builder — nu alleen admin-seed kan forms maken
- Sessie inplannen-flow (alleen list, geen create)

### Admin surface
- Create/edit voor leads, projects, tasks (alles is read-only view)
- Role-toewijzing vanaf users-page
- Settings-forms (nu descriptieve panels)

### Integratie
- **Resend/email** — welkomstmail, reset-password
- **PostHog** — analytics
- **Vercel Cron** — nog niet geconfigureerd in `vercel.json`

### Polish
- `packages/ui/` workspace-extractie (nu direct in platform/)
- Playwright baseline-tests op mobile+desktop
- ESLint rem-guard
- Dark-mode toggle
- /ui-kit demo-pagina
- Onboarding-wizard na eerste magic-link

---

## Roadmap naar productie

### Week 1 — runtime groen + iteratie
- [ ] DATABASE_URL in place → alles werkt lokaal
- [ ] Chris + Reza dogfooden de client-flow, feedback
- [ ] Ontbrekende create/edit flows per prioriteit (list hierboven)

### Week 2 — Plug and Pay live
- [ ] `PLUGANDPAY_WEBHOOK_SECRET` vastleggen + registreren via
      `upsertWebhookRule` voor `order_paid`, `subscription_cancelled`,
      `subscription_renewed`
- [ ] `CRON_SECRET` + `vercel.json` cron schedule
- [ ] Sync-test met 1 test-order in P&P van €1

### Week 3 — staging deploy
- [ ] Vercel project koppelen aan `iamcoai/WIN`
- [ ] Env vars in Vercel (DATABASE_URL, BETTER_AUTH_*, PLUGANDPAY_*)
- [ ] Prod Supabase project aanmaken (apart van dev)
- [ ] Migraties handmatig pushen naar prod via `supabase db push`
      (MCP NOOIT tegen prod)

### Week 4 — productie + Reza-onboarding
- [ ] DNS: `app.win.nl` → Vercel
- [ ] BetterAuth cookie-domain `.win.nl`
- [ ] Reza + eerste 5 cliënten onboarden

---

## Open forks die ik bewust niet heb gesloten

Uit je oorspronkelijke handoff (2026-04-24):

1. **Abo-annulering**: read-only toegang tot voltooide modules of volledige
   revoke? Nu: revoke (status wordt `cancelled` → `/no-access`). Jouw call
   voor iteratie 2.

2. **Onboarding-wizard** na eerste magic-link: 3 stappen of direct naar
   `/app`? Nu: direct naar `/app`. Wizard is 1 extra PR.

3. **Magic-link vs email+password**: nu email+password. BetterAuth
   ondersteunt ook magic-link plugin. Voor coaching-publiek waarschijnlijk
   gebruiksvriendelijker — overweeg voor productie.

---

## Security-checklist

- ✅ `.env.local` gitignored (root + platform)
- ✅ RLS uit op auth+business tabellen, anon/authenticated REVOKED
      (PostgREST kan password/token niet lezen met public anon-key)
- ✅ BetterAuth scrypt-hashing (industrie-standaard)
- ✅ Webhook HMAC-SHA256 signature-verify (dev accepteert unsigned,
      prod weigert)
- ✅ Cron endpoint bearer-auth'd via CRON_SECRET
- ✅ Server actions check altijd `requireRole()` vóór mutatie
- ✅ Typed-routes voorkomen typos in href's
- ⚠️ `win-dev-2026!` dev-password staat in deze file — rotate vóór prod
- ⚠️ `PLUGANDPAY_API_KEY` (PAT, long-lived) — rotate periodiek
- ⚠️ `BETTER_AUTH_SECRET` — verschillend secret voor prod dan voor dev

---

## Commit-timeline van deze sessie

```
e364a78  PR 16-22b admin surface
9c23996  PR 10-15 coach surface
64465ca  PR 04-09 client surface
850fb21  PR 03b-e Plug and Pay stack + enrollment gating
394887a  PR 03 RBAC + role-scoped layouts + proxy guard
4c6420c  Full shadcn install + WIN-branded tokens + shadcn MCP
26d52e8  PR 02 AppShell + UI primitives
f543be4  fix: Drizzle adapter schema + MCP seed helper
d501023  PR 01 T6 seed script + T7 READMEs
496dd33  PR 01 T4 BetterAuth handler + T5 login/signup pages
b1d88a4  PR 01 T3 Drizzle + BetterAuth schema + first Supabase migration
b468a2f  PR 01 T2 workspaces + Next 16.2.4 security patch
f5233b8  PR 01 T1 scaffold — Next.js 16 platform/ with WIN tokens
```

---

Open localhost, log in als Chris, klik rond, noteer wat raar/leeg voelt.
Stuur me de lijst — dan doen we de volgende iteratie in één pass.
