# WIN Platform — Reza daily-ops handoff (2026-04-24)

7 features gebouwd om Reza's dagelijkse werk te dragen. Landingspagina
`/coach/vandaag` is vanaf nu de default home voor coach + admin.

## Wat er staat

| # | Feature | Waar | Status |
|---|---|---|---|
| 1 | Schema-uitbreiding (tasks+calendar+docs+journal+settings) | migratie + drizzle | ✅ live in Supabase |
| 2 | `/coach/vandaag` dagelijkse landingsplek | `app/(authed)/coach/vandaag/` | ✅ volledig functioneel |
| 3 | GTD taken-view + quick-capture (`n`-shortcut) | `/coach/taken` | ✅ volledig functioneel |
| 4 | Session-prep dossier + FollowUpButton | `/coach/sessies/[id]/prep` + contact/deal headers | ✅ volledig functioneel |
| 5 | Unified agenda (maand-view) + Google OAuth routes | `/coach/agenda` + `/api/calendar/google/*` | ⚠️ wacht op env-vars |
| 6 | Document-uploads via Supabase Storage | contact-detail documents-panel | ⚠️ wacht op service-role key |
| 7 | Nav reorganisatie | `config/nav.ts` | ✅ Vandaag eerst, Taken + Agenda als bottom-nav items |

## Wat Chris moet doen

Vier concrete stappen om de 2 wachtende stukken live te krijgen:

### A. Supabase service-role key voor uploads (2 min)
1. `https://supabase.com/dashboard/project/ujlkvaxlmrsvzgmlakgn/settings/api`
2. Kopieer **`service_role` secret key** (het tweede rij, NIET anon)
3. Voeg toe aan `platform/.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
```
4. Restart dev-server. Upload-knop op contact-detail werkt nu.

⚠️ **Nooit committen of delen** — deze key bypasst RLS volledig. Rotate als 'ie lekt.

### B. Google Calendar OAuth (15 min)
1. Ga naar https://console.cloud.google.com → APIs & Services → Credentials
2. **Create credentials → OAuth client ID** → Web application
3. Naam: "WIN Platform"
4. Authorized redirect URI:
   - Dev: `http://localhost:3001/api/calendar/google/callback`
   - Prod: `https://app.win.nl/api/calendar/google/callback`
5. Kopieer Client ID + Client Secret
6. Voeg toe aan `platform/.env.local`:
```bash
GOOGLE_CLIENT_ID=1234-abcd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz...
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/api/calendar/google/callback
```
7. Enable **Google Calendar API** in het project (APIs & Services → Library)
8. Restart. Ga naar `/coach/instellingen/agenda` → klik **Verbind Google Calendar**.

### C. Calendar sync cron (10 min later, wanneer je wilt dat externe events binnenkomen)
De OAuth-flow staat maar NIET de eigenlijke events-sync. Volgende iteratie kan:
- `/api/cron/calendar-sync` (zoals plugandpay-sync) die:
  - Itereert over `calendar_account` waar `sync_enabled=true`
  - Ververst access_token als `expires_at` voorbij is (via refresh_token)
  - Fetcht events: `GET /calendar/v3/calendars/primary/events?syncToken=...`
  - Upsert in `external_event` keyed on `(account_id, external_id)`
  - Voor platform → google push: `POST /calendar/v3/calendars/primary/events` bij elke nieuwe afspraak/workshop
- Vercel cron in `vercel.json`: `{ "path": "/api/cron/calendar-sync", "schedule": "*/15 * * * *" }`

### D. Rotate demo-wachtwoord vóór staging/prod
`win-dev-2026!` is het seeded wachtwoord voor alle 3 accounts. Voor staging:
```bash
cd platform
SEED_PASSWORD='<nieuw-sterk-wachtwoord>' npm run db:seed
```

## Hoe Reza het gebruikt

**'s Ochtends** — opent `/coach/vandaag`:
- Greeting adapteert aan tijd (Goedemorgen/middag/avond)
- Focus-taak (max 1) bovenaan — wat vandaag écht telt
- Morning-ritual timer 10 min (ademwerk/meditatie) rechts
- Sessies vandaag in tijd-chips met client-naam — klik = session-prep
- Zijn eigen habits aftikken (slaat op in `habit_log`)
- Capacity-gauge toont hoeveel uur sessies ingepland t.o.v. 6u/dag richtlijn

**10 min voor sessie** — klikt op een sessie → `/coach/sessies/[id]/prep`:
- Links: traject-status (welke module, welke opdrachten af), laatste activities, recente chat, habits-grid 7 dagen
- Rechts (sticky): live notities-pad — typ tijdens gesprek, klik "Opslaan op dossier" → landt als activity op het contact
- In header: "Herinner me" dropdown → Morgen / 3d / 1w / 2w / 1mnd / custom → automatisch een taak

**Na sessie** — klikt "Herinner me" → "Over 2 weken" → klaar. Taak verschijnt in `/coach/vandaag` op die dag.

**Tussendoor** — toetst `n` om snel iets vast te leggen:
- Dialoog opent, typt, kiest bucket (Inbox default), cmd+Enter = opslaan
- Taak landt in `/coach/taken` → GTD-style kolommen

**Volgens agenda** — `/coach/agenda` toont maand:
- Gold chips = sessies · Olijf = workshops · Info-blauw = taken met deadline · Grijs = externe Google-events
- Klik sessie-chip → direct naar prep

**Per cliënt** — `/admin/crm/contacts/[id]`:
- Documenten-panel onderaan — sleep PDF/audio/foto, wordt opgeslagen in Supabase Storage, via signed-URL te downloaden
- Links in die header: Follow-up inplannen

**'s Avonds** — scrollt naar beneden op `/coach/vandaag`:
- Avondreflectie-prompt: "Wat voelde vandaag af? Wat wil ik morgen laten landen?"
- Twee zinnen + mood 1-7 → opgeslagen in `journal_entry`

## Commits in deze push

```
3fbd26a  chore(nav): surface vandaag/taken/agenda + handoff doc
7b3b268  feat(calendar): unified agenda + Google OAuth flow
4419983  feat(sessions): session-prep dossier + FollowUpButton
146b771  feat(documents): Supabase Storage uploads + panel
e10107f  feat(tasks): GTD task-view + quick-capture
b0260be  feat(vandaag): /coach/vandaag landingsplek
6c481c7  feat(ops): schema extensions
```

Totaal: 7 commits, ~3500 regels, 0 build-errors, 46+ routes.

## Volgende natuurlijke stappen

Als fundament voelt goed en Reza gebruikt dit, volgende iteratie-ideeën:
- **Content library** — herbruikbare opdrachten/oefeningen los van trajecten
- **Message templates + broadcast** — "stuur deze update naar iedereen met tag=HR"
- **Revenue dashboard** — maand-grafiek van enrollments
- **Voice-memo's** — audio-opname met Whisper-transcriptie
- **AI session-summarize** — knop na sessie "Stuur samenvatting" → Claude genereert + stuurt
- **Mobile push-notifications** — web push API + service worker
- **Client-kant habits** op `/app/vandaag` — zelfde pattern voor cliënten
