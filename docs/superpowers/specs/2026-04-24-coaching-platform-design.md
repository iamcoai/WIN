# WIN Coaching Platform — Design & Plan van Aanpak (v2)

**Datum:** 2026-04-24
**Auteur:** Christian (Kick) + Claude
**Status:** Draft — ter review
**Referentie:** Vervangt `2026-04-24-admin-dashboard-design.md` (scope uitgebreid)
**Blok:** 4 (Coaching platform + admin)
**Externe referenties:** [trackler.nl](https://trackler.nl/) (feature-inspiratie), [plugandpay.nl](https://plugandpay.nl/) (checkout + betalingen + abonnementen)

---

## 1. Scope-uitbreiding t.o.v. v1

Waar v1 alleen een admin-paneel voor intern gebruik beschreef, bouwen we nu een volledig **coachingsplatform** in de stijl van [trackler.nl](https://trackler.nl/) — één systeem dat zowel intern (Reza + WIN-team) als extern (cliënten van Reza) bedient.

**Drie gebruikerservaringen, één applicatie:**

| Rol | URL-surface | Wat ze doen |
|-----|-------------|-------------|
| `client` | `/app/*` | Hun traject doorlopen: modules, habits, chat, afspraken |
| `coach` | `/coach/*` | Cliënten begeleiden: overzicht, notities, sessies, trajectbouwer |
| `admin` | `/admin/*` | Platform runnen: users, CRM, kanban-met-Claude, site-editor |

## 2. Feature-inventaris (gebaseerd op Trackler + WIN-specifiek)

### Voor cliënten (`/app`)
- **Mijn traject** — overzicht van ingeschreven programma('s), voortgang per module
- **Modules** — video, tekst, opdrachten, reflectievragen
- **Habit tracker** — dagelijkse psychofysieke oefeningen, check-off, streak
- **Chat** — direct met coach (real-time)
- **Afspraken** — sessies boeken/zien, Google Calendar-sync
- **Dagboek / reflectie** — opdrachten invullen, eerder werk teruglezen
- **Formulieren** — intake, tussentijdse evaluaties
- **Profiel** — eigen gegevens, privacy, wachtwoord

### Voor coaches (`/coach` — in eerste versie: Reza)
- **Cliënten-overzicht** ("helikopterview") — alle cliënten met status, recente activiteit, red flags
- **Cliënt-detail** — progress, habits-log, chat-historie, notities, sessie-historie
- **Trajectbouwer** — drag-drop modules samenstellen: intro → weken → eindreflectie
  - Per module: titel, video, tekst, opdracht(en), habit-prescription
- **Formulieren-builder** — custom forms (intake, evaluatie)
- **Sessieplanning** — kalender, beschikbaarheid, automatische reminders
- **Notities** — per cliënt, per sessie, gekoppeld aan modules
- **Rapportage** — engagement, completion rates
- **Templates** — opgeslagen trajecten herbruiken voor nieuwe cliënten

### Voor admin (`/admin` — Christian + Reza samen)
- **Users** — alle clients + coaches, rollen, toegang
- **Trajecten-library** — gepubliceerde trajecten beheren, gekoppeld aan Plug and Pay-producten
- **CRM** — leads, organisaties, deals + **betaalstatus uit Plug and Pay**, login-historie, trajectvoortgang
- **Payments** — orders, abonnementen, failed payments (gesynced vanuit P&P)
- **Projecten** — interne projecten
- **Kanban ↔ GitHub** — ons gezamenlijke werk met Claude
- **Inbox** — Linear-style unified activity
- **Pages Explorer** — public site-boom + preview
- **Site-editor** (later) — blokken op /web bewerken
- **Integrations** — Plug and Pay, Google Calendar, GitHub, Resend
- **Settings** — branding, e-mailsjablonen, platform-configuratie

## 3. Architectuur (herzien)

### 3.1 Apps & locatie

**Twee apps** in deze repo, één database:

```
/web            Next.js — public marketing site (bestaand, www.win.nl)
/platform       Next.js — unified app (client + coach + admin)
                → app.win.nl
```

**Waarom niet drie aparte apps (web/admin/app):**
- Admin, coach en client delen 80% van de code: auth, DB-laag, design-system, data-modellen, chat, afspraken
- Rol-gebaseerde routing met Next.js `route groups` is native ondersteund
- Eén deploy, één auth-sessie, één DB-connectie-pool
- Dit is ook hoe Trackler werkt (één app, drie views)

### 3.2 URL-structuur binnen `/platform`

```
app.win.nl/
├── /                      → marketing-teaser of redirect naar /login
├── /login, /signup, /verify
├── /app/                  → (client) layout
│   ├── /                  → mijn traject
│   ├── /modules/[id]
│   ├── /habits
│   ├── /chat
│   ├── /afspraken
│   ├── /formulieren/[id]
│   └── /profiel
├── /coach/                → (coach) layout
│   ├── /                  → cliënten-overzicht
│   ├── /cliënten/[id]
│   ├── /trajecten         → library
│   ├── /trajecten/[id]/bouwer
│   ├── /formulieren
│   ├── /sessies
│   └── /rapportage
└── /admin/                → (admin) layout
    ├── /                  → KPIs
    ├── /users
    ├── /crm
    ├── /projects
    ├── /kanban
    ├── /inbox
    ├── /pages
    ├── /integrations
    └── /settings
```

### 3.3 Auth & rollen

- **BetterAuth** (email + password, later GitHub OAuth voor team, magic link voor clients)
- Rollen: `admin` | `coach` | `client` (array — een user kan meerdere rollen hebben)
- Middleware in `platform/src/middleware.ts`: leest sessie → check rol voor `/app`, `/coach`, `/admin` prefix
- Default user = `client`, Reza krijgt `[coach, admin]`, Christian krijgt `[admin]`

### 3.4 Database

**Postgres** (Supabase-hosted) + **Drizzle ORM**.
**Realtime-laag:** Supabase Realtime voor chat + live habit-updates. We gebruiken Supabase dus alleen als DB+Realtime; auth blijft BetterAuth.

### 3.5 Design-systeem

**Twee visuele modi, één token-set:**

- `web/` en `/app/` (cliënt): **licht** — cream achtergrond, charcoal tekst, gold accent — warm, welkom
- `/coach/` en `/admin/`: **donker** — bronze/charcoal achtergrond, cream tekst, gold accent — werk-modus

Kern-tokens (uit `web/src/app/globals.css`):
- `win-gold #B8960C` / `win-olive #4A4A2A` / `win-charcoal #2C2C2C` / `win-cream #F5F0E8` / `win-bronze #1A1A1A`
- Manrope (headings) / Inter (body)

**Shared package** `packages/ui/` met: Tailwind-config, CSS-variabelen, shadcn primitives (Button, Input, Dialog, Tabs, Sheet, Command, Toast). Geconsumeerd door `web/` en `platform/`.

#### 3.5.1 Rem-based sizing — harde regel

**Alle spacing, typografie en layout-maten in `rem`, nooit `px`.** Reden: Reza of een cliënt die z'n systeem-lettergrootte op 1.25× heeft staan krijgt een 25% groter UI — toegankelijk, schaalbaar, voorspelbaar.

- Tailwind class `p-4` = `1rem` = 16px bij root — OK, dat is al rem-based.
- Custom CSS in `globals.css` of inline styles: **altijd** `rem`. Uitzonderingen: hairlines (`1px` border), media-query breakpoints (browsers eisen px), box-shadow-spread (visueel niet-schalend bedoeld).
- Iconen: `rem` (w-5 h-5 = 1.25rem).
- Breakpoints blijven in px (Tailwind default: sm 640, md 768, lg 1024, xl 1280). Binnen een breakpoint alles rem.
- Root font-size blijft 16px (browser-default), niet hardcoden in CSS zodat user-preference werkt.

Lint: een ESLint-regel in `platform/` die warning geeft bij px-waardes in styled components en Tailwind `[...]`-arbitraries. Toevoegen in PR 02.

#### 3.5.2 Mobile-first — harde regel

Reza moet vanaf zijn telefoon cliënten kunnen checken, chat kunnen beantwoorden, en admin-dingen kunnen doen. Platform wordt **mobile-first** gebouwd:

- Elke pagina wordt eerst ontworpen op 375px viewport, daarna desktop-layout erbij.
- **Top-bar** (fixed, 3.5rem hoog): hamburger links, WIN-logo midden, user-menu rechts. Identiek op mobile + desktop.
- **Mobile navigatie** = twee plekken:
  1. **Hamburger → sheet** (sidebar die van links inslidet) met volledige boom: Dashboard / CRM / Users / Projects / Kanban / Pages / Settings etc.
  2. **Bottom-nav-bar** (fixed, `safe-area-inset-bottom` voor iPhone notch): 4–5 primaire acties, icon + label. Voor `/admin`: Dashboard, CRM, Kanban, Inbox, Meer. Voor `/coach`: Cliënten, Agenda, Chat, Trajecten, Meer. Voor `/app`: Traject, Habits, Chat, Afspraken, Profiel. "Meer" opent de hamburger-sheet.
- **Desktop** (≥`md`, 768px): bottom-nav verdwijnt, sidebar permanent zichtbaar als rail (rechts van content). Topbar blijft.
- **Tabellen** krijgen een mobile-alternatief (card-lijst met expandable details).
- **Modals/dialogs** op mobile worden full-screen sheets (shadcn Sheet i.p.v. Dialog).
- **Formulieren**: labels boven inputs op mobile, inline op desktop. Submit-knop sticky onderin viewport op mobile.

Component-checklist voor PR 02 (design-system):
- `<AppShell>` — verzorgt topbar + sidebar-desktop + bottom-nav-mobile
- `<BottomNav>` — rol-specifieke primaire nav (config via prop)
- `<MobileHamburger>` — shadcn Sheet met volledige menu-boom
- `<ResponsiveTable>` — auto card-layout <`md`
- `<ResponsiveDialog>` — Dialog op desktop, Sheet op mobile
- `<StickyFormFooter>` — submit/cancel die mobiel-sticky wordt

Test-criterium: **iedere PR moet op 375×667 (iPhone SE) werken** — scroll-gedrag, tap-targets ≥2.75rem, geen horizontal scroll. Playwright-test op die viewport is verplicht voor elke merge.

### 3.6 Externe integraties

| Integratie | Doel | Implementatie |
|-----------|------|---------------|
| **Plug and Pay** | **Checkout, orders, abonnementen, upsells, affiliates** | **REST API (eigen TS-client) + webhooks — zie §3.9** |
| GitHub | Kanban (admin-kant) | Octokit + webhooks |
| Google Calendar | Afspraken sync | Google Calendar API + OAuth |
| Video | Module-content | Supabase Storage (MVP), Mux later |
| E-mail | Transactional (verify, reminders, magic links) | Resend |
| Bestandsopslag | Opdracht-uploads, audio | Supabase Storage |

> We gebruiken Stripe **niet** direct — Plug and Pay regelt de betalingsprovider (Mollie/Stripe zit onder hun hood).

### 3.7 Realtime
- **Chat**: Supabase Realtime (Postgres changes subscription)
- **Habit-updates**: idem, coach ziet live wanneer cliënt incheckt

### 3.8 Mobile
- **V1:** PWA (responsive web + installable). Werkt op iOS/Android via browser.
- **V2 (later):** native wrapper via Capacitor als Reza/cliënten dat echt willen. Nu overkill.

### 3.9 Plug and Pay integratie

**Taakverdeling:**

| Doet P&P | Doet ons platform |
|----------|-------------------|
| Pricing-pagina's | — |
| Checkout-pagina's (formulier, 3DS, iDEAL/credit-card) | — |
| Order-creatie + betaalverwerking (via Mollie/Stripe onder hun hood) | — |
| Factuur-mail + factuur-PDF | — |
| Abonnement-renewals + failed-payment retries | — |
| Debtor-management workflows (eerste aanmaning) | — |
| Affiliate-tracking | — |
| — | Toegangscontrole coachingstrajecten |
| — | User-account + login (BetterAuth) |
| — | Trajecten, modules, habits, chat, afspraken |
| — | CRM met gejoinde payment-data |
| — | "Klant heeft betaalprobleem" workflow (chat/email) |

**Data-flow — aankoop:**

```
1. Prospect op www.win.nl klikt "Koop Weerbaarheidstrajekt"
2. Redirect naar checkout.plugandpay.nl/reza/traject-12wkn (door P&P gehost)
3. Klant betaalt → P&P maakt order + customer aan
4. P&P vuurt webhook af naar https://app.win.nl/api/webhooks/plugandpay
   Events: order.created, order.paid
5. Onze webhook-handler:
   a. Map plugandpay_product_id → onze trajecten.id
   b. Upsert user in BetterAuth: bij nieuwe user → magic-link mail naar hun adres
   c. Maak enrollment aan (status=active)
   d. Log in audit_log + inbox
6. Klant klikt magic link → zet wachtwoord → landt op /app
7. /app toont hun traject, module 1 is unlocked
```

**Data-flow — abonnement renewal (maandelijks):**

```
P&P subscription.renewed → status blijft active
P&P subscription.payment_failed → flag enrollment als payment_issue,
   stuur notificatie naar admin-inbox + Reza, cliënt behoudt toegang
   voor grace-periode van 7 dagen, daarna restrict tot "payment update" scherm
P&P subscription.cancelled → enrollment.status = cancelled
   (Beleidsbeslissing: read-only toegang tot voltooide modules? Of volledige revoke?
   Default: read-only — goedwil, behouden contact.)
```

**Synchronisatie-strategie (hybrid):**

1. **Webhooks (push, real-time)** — primair. P&P → `/api/webhooks/plugandpay`
2. **Nightly reconcile job** — elke nacht fetched sync-job alle orders/subscriptions van afgelopen 48u. Vangt gemiste webhooks op.
3. **On-demand fetch bij CRM-detail** — als een admin op een klant klikt, refresht een server-action de P&P-data live (laat geen stale zien).

**Toegangscontrole:**

Middleware op `/app/traject/[id]`:
```
1. Sessie bestaat? → anders /login
2. Query: enrollment waar user_id = session.user.id AND traject_id = param.id
3. Geen enrollment → 403 "Geen toegang — heb je dit traject gekocht?"
4. enrollment.status == 'payment_issue' AND grace_until < now() → redirect /payment-needed
5. enrollment.status == 'cancelled' AND module is post-cancellation → 403
6. Anders → render
```

**Authenticatie-koppeling:**

- P&P checkout vraagt e-mail + adres — geen wachtwoord
- Onze webhook-handler gebruikt die e-mail als user-identity
- Bestaande user in BetterAuth? → attach order
- Nieuwe user? → BetterAuth insert, status=`invited`, stuur magic-link via Resend
- Klant klikt → zet wachtwoord → account actief

**Open technische punten (te verifiëren bij bouw):**

- `docs.plugandpay.nl` gaf 404 tijdens dit onderzoek — kennelijke docs-URL onzeker. Verifiëren via P&P-account zodra je die hebt. Mogelijk is de echte URL achter auth of anders geschreven.
- Webhook-signing? Nodig voor verificatie dat een request echt van P&P komt. Hun PHP SDK wiki noemt het niet; te controleren in hun admin-panel of via support.
- Welke events precies? Minimaal nodig: `order.created`, `order.paid`, `order.refunded`, `subscription.created`, `subscription.renewed`, `subscription.payment_failed`, `subscription.cancelled`. Lijst verifiëren.
- Rate-limits? Voor nightly reconcile niet blokkerend; voor on-demand fetch wel.
- Geen officiële TS/Node SDK. We schrijven een dunne client (`platform/src/lib/plugandpay/client.ts`) tegen de REST-API. ~200 regels.

## 4. Datamodel (kern)

```
-- auth (BetterAuth beheert dit)
users, sessions, accounts, verification_tokens
user_roles (user_id, role)            -- many-to-many voor rol-array

-- coaching content
trajecten                             -- "Weerbaarheidstrajekt 12 weken"
  id, title, slug, description, author_id, is_template, published_at
modules                               -- onderdelen van een traject
  id, traject_id, order, title, body (mdx), video_url, duration_min
opdrachten                            -- assignments binnen een module
  id, module_id, title, instructions, type (text|upload|form|habit)
formulieren                           -- custom forms
  id, title, schema_json, owner_id
formulier_antwoorden
  id, formulier_id, user_id, answers_json, submitted_at

-- enrollment & progress
enrollments
  id, user_id (client), traject_id, coach_id,
  status (invited|active|payment_issue|cancelled|completed),
  grace_until,                          -- bij payment_issue: datum tot toegang
  plugandpay_order_id,                  -- link naar betaalde order
  plugandpay_subscription_id,           -- null voor eenmalige aankoop
  started_at, completed_at
module_progress
  id, enrollment_id, module_id, started_at, completed_at, time_spent_sec
opdracht_responses
  id, enrollment_id, opdracht_id, content (text or file_url), submitted_at, coach_feedback

-- habits
habits
  id, enrollment_id, title, frequency (daily|weekly), active_from, active_until
habit_checkins
  id, habit_id, date, done, note

-- communication
chat_threads
  id, client_id, coach_id, last_message_at
chat_messages
  id, thread_id, sender_id, body, attachments_json, created_at
notities                              -- coach-only notes
  id, coach_id, client_id, module_id?, body, created_at

-- scheduling
afspraken
  id, client_id, coach_id, starts_at, duration_min, location (online|fysiek|hybrid),
  gcal_event_id, status (scheduled|done|cancelled|no_show)

-- CRM (uit v1)
contacts, companies, activities

-- internal kanban (uit v1)
kanban_boards, kanban_columns, kanban_cards

-- Plug and Pay
plugandpay_products                    -- cache + mapping
  id, plugandpay_product_id (unique), title, price_cents, currency,
  is_subscription, interval (month|year|null),
  traject_id,                          -- nullable — welk traject unlockt deze product?
  synced_at
plugandpay_customers                   -- cache — keyed op email
  id, plugandpay_customer_id (unique), email, name, phone,
  user_id,                             -- nullable link naar users
  synced_at
plugandpay_orders
  id, plugandpay_order_id (unique), customer_id, product_id,
  amount_cents, currency, status (pending|paid|refunded|failed),
  invoice_url, placed_at, paid_at, synced_at
plugandpay_subscriptions
  id, plugandpay_subscription_id (unique), customer_id, product_id,
  status (active|past_due|cancelled|ended),
  current_period_end, cancelled_at, synced_at
plugandpay_webhook_events              -- idempotency + replay
  id, event_id (unique from P&P), event_type, payload_json,
  received_at, processed_at, error

-- traject ↔ P&P mapping
traject_plugandpay_links
  traject_id, plugandpay_product_id, created_at

-- session tracking (voor CRM "laatste login/logout")
user_session_events
  id, user_id, type (login|logout), ip, user_agent, created_at

-- meta
audit_log (generic event stream → voedt /admin/inbox)
pages_manifest (uit v1)
```

## 5. Herziene PR-breakdown

**Principe:** eerst foundation, dan client-surface (laagste risico, direct waarde), dan coach-surface, dan admin-surface. Claude-kanban zit bewust in de admin-track omdat het ons tooling is, geen product-waarde voor Reza's cliënten.

### Foundation (blokkeert alles)

| # | Branch | Scope |
|---|--------|-------|
| 1 | `feat/platform-01-scaffold` | `/platform` app, BetterAuth, Drizzle, Postgres, `/login` |
| 2 | `feat/platform-02-design-system` | `packages/ui/`, shadcn, light+dark tokens, **rem-based sizing + ESLint-guard tegen px**, `<AppShell>` met topbar + hamburger-sheet + bottom-nav + desktop-rail, responsive primitives (Table/Dialog/FormFooter), Playwright mobile-viewport test |
| 3 | `feat/platform-03-rbac` | Rol-systeem, middleware, seed-users (admin/coach/client), session-event tracking |

### Plug and Pay foundation (vroeg — blokkeert access-control)

| # | Branch | Scope |
|---|--------|-------|
| 3b | `feat/platform-03b-plugandpay-client` | TS REST-client + env-config + `plugandpay_*` tabellen + `/admin/integrations/plugandpay` pagina (connect + test) |
| 3c | `feat/platform-03c-plugandpay-webhooks` | `/api/webhooks/plugandpay`, idempotency via `plugandpay_webhook_events`, signature-verify (zodra we weten hoe) |
| 3d | `feat/platform-03d-plugandpay-sync` | Nightly reconcile cron + on-demand fetch helpers |
| 3e | `feat/platform-03e-enrollment-gating` | Access-middleware: geen enrollment of payment_issue → block/redirect; magic-link flow vanuit webhook |

### Client-surface (MVP voor cliënt)

| # | Branch | Scope |
|---|--------|-------|
| 4 | `feat/platform-04-trajecten-viewer` | `/app` — cliënt ziet traject + modules (read-only, enrollment-gated) |
| 5 | `feat/platform-05-opdrachten` | Opdrachten invullen (text/upload), feedback-view |
| 6 | `feat/platform-06-habits` | Habit tracker, check-off, streak |
| 7 | `feat/platform-07-chat` | Supabase Realtime chat client↔coach |
| 8 | `feat/platform-08-afspraken` | Afspraken-kalender + Google Calendar sync |
| 9 | `feat/platform-09-formulieren-client` | Formulier-rendering + antwoorden opslaan |

### Coach-surface

| # | Branch | Scope |
|---|--------|-------|
| 10 | `feat/platform-10-coach-overview` | `/coach` — cliënten-overzicht (helikopter) |
| 11 | `feat/platform-11-client-detail` | Cliënt-detail met notities, progress, chat-historie |
| 12 | `feat/platform-12-trajectbouwer` | Drag-drop trajecten maken (modules, opdrachten, habits) |
| 13 | `feat/platform-13-formulieren-builder` | Form-builder (schema editor) |
| 14 | `feat/platform-14-sessies` | Sessieplanning + reminders |
| 15 | `feat/platform-15-rapportage` | Coach-rapportages (engagement, completion) |

### Admin-surface (uit v1, herbruikt)

| # | Branch | Scope |
|---|--------|-------|
| 16 | `feat/platform-16-admin-users` | User management, rollen toewijzen, laatste login/logout kolom |
| 17 | `feat/platform-17-crm` | Contacts, companies, activities |
| 17b | `feat/platform-17b-crm-payments` | ⭐ CRM-join met P&P: orders, subs, betaalproblemen, "contact klant"-knop |
| 17c | `feat/platform-17c-payments-dashboard` | `/admin/payments` — orders-lijst, failed-payments, MRR-grafiek |
| 18 | `feat/platform-18-projects` | Interne projecten + milestones |
| 19 | `feat/platform-19-kanban-github` | ⭐ Kanban ↔ GH Issues (jij + ik) |
| 20 | `feat/platform-20-inbox` | Linear-style activity feed (GH + CRM + P&P events) |
| 21 | `feat/platform-21-pages-explorer` | Public site file tree + preview |
| 22 | `feat/platform-22-integrations` | Integrations-pagina (P&P, GH, GCal, Resend) |
| 22b | `feat/platform-22b-public-pricing-links` | Knoppen op www.win.nl linken naar P&P-checkout-URLs |

### Phase 2 (later)

| # | Branch | Scope |
|---|--------|-------|
| 23 | `feat/platform-23-video-modules` | Mux/Cloudflare Stream integratie |
| 24 | `feat/platform-24-ai-coach` | Claude-assisted reflectie-prompts |
| 25 | `feat/platform-25-site-editor` | MDX block editor → /web content |
| 26 | `feat/platform-26-billing` | Stripe subscriptions |
| 27 | `feat/platform-27-mobile-pwa` | PWA manifest, install-prompt, offline habit-checkin |

## 6. Milestones (tempo)

- **M1 — Foundation (PR 1–3):** inloggen werkt, drie rol-routes gescheiden, session-events gelogd
- **M1b — P&P-infrastructure (PR 3b–3e):** webhook binnen, enrollments via betaling, gating werkt. Na M1b kan een klant op P&P betalen en in /app landen met toegang tot z'n traject.
- **M2 — Cliënt kan traject doorlopen (PR 4–9):** Reza kan een traject publiceren en cliënt doet het zelfstandig
- **M3 — Coach runt praktijk (PR 10–15):** Reza beheert al zijn cliënten vanuit één scherm
- **M4 — Intern platform (PR 16–22b):** CRM met payment-inzicht, kanban, inbox, pages
- **M5 — Phase 2** (per feature los)

> **M1b is bewust vroeg** — zonder betaalde access-control heeft de rest geen commerciële waarde. We willen zo snel mogelijk de eerste euro door de pipeline krijgen, ook al is de cliënt-UI nog basic.

## 7. Open forks voor Christian

Nog twee waar ik je input op wil — de rest heb ik als CTO beslist:

1. **Beleid bij abonnements-annulering**: read-only toegang tot voltooide modules behouden (zachter, meer goodwill) of volledige revoke (hard, stimuleert heraanmelden)? Aanbeveling: read-only.
2. **Onboarding-flow na aankoop**: direct na magic-link → setup-wizard (foto, timezone, intake-form) of gewoon droppen in /app? Trackler heeft een "onboarding flow" — past goed bij warme welkom. Aanbeveling: korte wizard (3 stappen) in PR 4.

Alle andere keuzes (unified app / Supabase Storage video / PWA / enkelvoudig tenant / webhook-driven P&P-sync / eigen TS-client i.p.v. wachten op officiële SDK / magic-link bij eerste aankoop / AI Coach als Phase 2) heb ik op basis van de gesprekken tot nu toe genomen. Als je er één wil wijzigen: zeg het en ik pas het spec aan.

## 8. Migratie vanaf v1-spec

De 7 oude branches (`feat/admin-01` t/m `feat/admin-07`) hernoemen naar het nieuwe schema:

```
feat/admin-01-scaffold         → feat/platform-01-scaffold
feat/admin-02-design-system    → feat/platform-02-design-system
feat/admin-03-crm              → feat/platform-17-crm
feat/admin-04-projects         → feat/platform-18-projects
feat/admin-05-kanban-github    → feat/platform-19-kanban-github
feat/admin-06-inbox            → feat/platform-20-inbox
feat/admin-07-pages-explorer   → feat/platform-21-pages-explorer
```

Daarna nieuwe branches aanmaken voor de client- en coach-tracks.

## 9. Volgende stappen

1. ✅ Deze spec reviewen — Christian feedback op de 2 resterende forks in §7
2. Branches aangevuld met P&P-branches (lokaal)
3. **Vraag Chris voor P&P-toegang**: account-credentials + API-token + URL van hun docs (`docs.plugandpay.nl` gaf 404, we hebben de juiste URL nodig)
4. Start met **PR 1 — platform-scaffold** (foundation)
5. Na M1: ik pak M1b (P&P-infra) zelf op. Parallel kan jij alvast in Reza's P&P-dashboard één product aanmaken voor "Weerbaarheidstrajekt" zodat we met een echte webhook kunnen testen.

## 10. User flow samenvatting (end-to-end)

```
┌────────────────────┐       ┌────────────────────┐
│   www.win.nl       │       │   Plug and Pay     │
│   (marketing)      │──▶────│   checkout page    │
└────────────────────┘       └──────────┬─────────┘
                                        │ order.paid webhook
                                        ▼
                             ┌────────────────────┐
                             │  app.win.nl        │
                             │  /api/webhooks/    │
                             │   plugandpay       │◀───── nightly reconcile
                             └──────────┬─────────┘
                                        │
            ┌───────────────────────────┼─────────────────────────────┐
            │                           │                             │
            ▼                           ▼                             ▼
   BetterAuth user +            enrollments row            audit_log +
   magic-link mail              (status=active)            admin-inbox event
            │
            ▼
   Klant klikt → wachtwoord → /app → traject zichtbaar
            │
            ▼
   Doet modules/habits/chat → data landt in onze DB
            │
            ▼
   Coach ziet in /coach/cliënten/[id]: progress + chat
   Admin ziet in /admin/crm/[id]: + orders + subscription status
                                    + laatste login/logout
                                    + "contact klant" bij payment_issue
```

