# WIN Admin Dashboard — Design & Plan van Aanpak

> ⚠️ **SUPERSEDED — zie `2026-04-24-coaching-platform-design.md`.**
> De scope is uitgebreid van "alleen admin" naar een volledig coachingsplatform
> (client + coach + admin in één app). Dit document blijft staan voor de
> historische context en blok-1-decompositie die nog steeds geldt.

**Datum:** 2026-04-24
**Auteur:** Christian (Kick) + Claude
**Status:** Superseded
**Blok:** 4 (Admin dashboard)

---

## 1. Doel

Eén centrale back-office voor Reza en het WIN-team. Vanuit hier runnen we:

- **CRM** — leads, klanten, organisaties, contactmomenten
- **Projecten** — lopende trajecten (coaching, mentorschap, opleidingen), milestones
- **Kanban** — ons gezamenlijke werkbord, **gesynced met GitHub Issues** zodat Claude via git kan committen op kaarten
- **Inbox / Activity (Linear-style)** — één stream waarin alle updates (GH events, CRM-mutaties, project-updates) samenkomen
- **Pages Explorer** — live inzicht in welke paginas op de publieke site staan (bestandsboom + preview)
- **Site Editor (toekomst)** — MDX/JSON blok-editor zodat Reza zelf teksten kan wijzigen op de public site

Authenticatie: **BetterAuth** (e-mail + wachtwoord, later magic link / GitHub OAuth).

## 2. Architectuurbeslissingen

### 2.1 Mono-app of twee apps?
**Keuze:** Aparte Next.js-app in `/admin/`, **náást** `/web/` (niet binnen).

**Waarom:**
- Admin heeft andere deps (BetterAuth, Drizzle, Octokit, dnd-kit) die we niet in de public bundle willen
- Aparte deploys mogelijk (public op `www.win.nl`, admin op `admin.win.nl`)
- Scheidt auth-flow strikt — geen risico dat marketing-routes per ongeluk beschermd raken
- CLAUDE.md plaatst `/admin/` al op dat niveau

**Gevolg:** design tokens en primitives moeten gedeeld worden. Oplossing: minimal shared package `/packages/ui/` met Tailwind config + CSS-variabelen + shadcn primitives. Start simpel: duplicate `globals.css` tokens; extract naar package zodra het pijn doet.

### 2.2 Database + ORM
**Keuze:** Postgres (Supabase-hosted) + **Drizzle ORM**.

**Waarom:**
- BetterAuth heeft een eersteklas Drizzle-adapter
- Drizzle is SQL-first, type-safe, klein (geen runtime-engine zoals Prisma)
- Supabase geeft ons gratis Postgres + backups; we gebruiken alleen de DB (niet hun auth)

**Migraties:** `drizzle-kit push` in dev, `drizzle-kit migrate` in prod.

### 2.3 Auth
**Keuze:** BetterAuth.
- E-mail + password uit de box
- Session-cookies, server-side verificatie via middleware
- Later: GitHub OAuth (koppelt mooi met de Kanban→Issues sync)

### 2.4 GitHub-integratie
**Keuze:** start met één **app-level PAT** (in env), upgrade later naar per-user OAuth.

- **Kanban kaart == GitHub Issue** op `iamcoai/WIN` (en later andere repos)
- **Kolom == label** (`status:backlog`, `status:doing`, `status:review`, `status:done`)
- **Sync richting:** tweerichtingsverkeer
  - Drag in UI → PATCH label in GH via Octokit
  - GH webhook → update cache in onze DB → revalideer UI
- **Cache-laag in onze DB** (tabel `kanban_cards`) zodat UI niet elke keer GH hoeft te hitten; webhook houdt het vers

### 2.5 Pages Explorer
**Keuze:** **Build-time manifest**.

- Script (`scripts/generate-page-manifest.ts`) scant `/web/src/app/**/page.tsx`
- Output: `packages/shared/pages-manifest.json` — route, bestandspad, metadata (title/description uit de file)
- Admin leest dit manifest server-side
- **Live preview** in admin: `<iframe src="https://www.win.nl/{route}">` met een toggle voor mobile/desktop
- Trigger: manifest-regeneratie in CI en lokale `dev`-script

### 2.6 Site Editor (out of scope nu, design klaarleggen)
- Elk blok op de public site wordt een **MDX component** of **JSON content-doc**
- Editor = form per bloktype → schrijft naar `web/content/*.mdx` → commit → revalidate
- Dit vereist dat de public site al blok-gedreven is opgezet (nu is het nog hardcoded) → eerst refactor in Blok 3 afronden

## 3. Sitemap admin

```
/admin
├── /                          # Dashboard home (KPIs, recent activity)
├── /login
├── /signup (invite-only later)
├── /crm
│   ├── /contacts
│   ├── /contacts/[id]
│   ├── /companies
│   ├── /companies/[id]
│   └── /activities
├── /projects
│   ├── /                      # grid overzicht
│   └── /[id]                  # detail + milestones
├── /kanban
│   ├── /                      # board lijst
│   └── /[boardId]             # kanban board
├── /inbox                     # Linear-style activity feed
├── /pages                     # public-site file tree + previews
│   └── /[...slug]             # per-page detail + metadata
└── /settings
    ├── /account
    ├── /team
    └── /integrations          # GH PAT, Supabase, etc.
```

## 4. Data model (eerste versie)

```
users                  (BetterAuth)
sessions               (BetterAuth)
accounts               (BetterAuth — OAuth providers)

contacts
  id, full_name, email, phone, role, company_id,
  tags[], notes, created_at, created_by

companies
  id, name, website, sector, notes, created_at

activities
  id, contact_id, company_id, type (email|call|meeting|note),
  body, occurred_at, created_by

projects
  id, name, slug, description, status (active|paused|done),
  client_company_id, owner_id, starts_at, ends_at

milestones
  id, project_id, title, due_at, done_at

kanban_boards
  id, name, github_repo (e.g. "iamcoai/WIN"), created_at

kanban_columns
  id, board_id, name, order, github_label

kanban_cards
  id, board_id, column_id, order,
  github_issue_number, github_issue_id,
  title, body_cache, assignees_cache[], labels_cache[],
  synced_at

page_manifest          (read-only, regenerated)
  route, file_path, title, description, last_modified
```

## 5. Design language

**Bron:** de bestaande public-site tokens in `web/src/app/globals.css`.

- Palette: `win-gold #B8960C`, `win-olive #4A4A2A`, `win-charcoal #2C2C2C`, `win-cream #F5F0E8`, `win-bronze #1A1A1A`
- Fonts: Manrope (headings), Inter (body)
- Admin UI: **donkere variant** van dezelfde taal — `win-bronze`/`win-charcoal` als basis, `win-cream` als tekst, `win-gold` als accent. Reden: dashboards zijn vaak dark-mode voor lange werksessies, en het geeft contrast met de public site.
- Primitives: **shadcn/ui** — geïnstalleerd in /admin, getuned met WIN tokens
- Iconen: `lucide-react`
- Drag-drop: `@dnd-kit/core`

## 6. PR-breakdown

**Principe:** elke PR is independently reviewable, onder ~500 regels diff waar mogelijk, en brengt de main branch in werkende staat.

| # | Branch | Titel | Deps |
|---|--------|-------|------|
| 1 | `feat/admin-01-scaffold` | Admin app scaffold + BetterAuth + DB | - |
| 2 | `feat/admin-02-design-system` | Shared tokens, shadcn, sidebar shell | PR1 |
| 3 | `feat/admin-03-crm` | CRM module (contacts, companies, activities) | PR2 |
| 4 | `feat/admin-04-projects` | Projects + milestones | PR2 |
| 5 | `feat/admin-05-kanban-github` | Kanban met GH Issues sync | PR2 |
| 6 | `feat/admin-06-inbox` | Linear-style activity feed | PR3, PR4, PR5 |
| 7 | `feat/admin-07-pages-explorer` | Public-site file tree + preview | PR2 |
| 8 | `feat/admin-08-site-editor` *(later)* | Block editor naar /web/content | PR7 |

### PR 1 — Admin scaffold + auth

**Scope:**
- `admin/` — nieuwe Next.js 16 app (App Router, TS, Tailwind 4)
- Install: `better-auth`, `drizzle-orm`, `postgres`, `drizzle-kit`, `zod`
- `admin/src/db/schema.ts` met BetterAuth tabellen (users/sessions/accounts)
- `admin/src/lib/auth.ts` — BetterAuth configuratie
- `admin/src/middleware.ts` — protected route guard
- `/login`, `/signup` pagina (styled, email+password)
- `/` dashboard home (placeholder "Welkom Reza")
- `.env.example` met `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GITHUB_PAT`
- README: lokaal runnen, eerste user aanmaken

**Acceptance:**
- `npm run dev` in `/admin` werkt
- Drizzle migratie runt tegen lokale/dev Postgres
- Je kunt registreren en inloggen
- `/` redirect naar `/login` als uitgelogd

### PR 2 — Shared design system + sidebar shell

**Scope:**
- Kopieer WIN tokens uit `web/src/app/globals.css` naar `admin/src/app/globals.css` (donkere variant)
- Install shadcn/ui, init met WIN-kleuren
- `admin/src/components/shell/sidebar.tsx` — links: Dashboard, CRM, Projects, Kanban, Inbox, Pages, Settings
- `admin/src/components/shell/topbar.tsx` — user-menu, search-placeholder
- `admin/src/app/(authed)/layout.tsx` — shell-wrapper
- Responsief: sidebar collapst op mobile (sheet)
- Component-demo pagina `/ui-kit` voor interne sanity-check

**Acceptance:**
- Shell rendert op alle authed routes
- Keyboard-nav werkt
- Mobile: hamburger opent sidebar als sheet

### PR 3 — CRM module

**Scope:**
- Drizzle schema: `contacts`, `companies`, `activities`, `tags`
- CRUD API routes (`app/api/crm/**`)
- UI: `/crm/contacts` lijst (TanStack Table), filter, zoek
- `/crm/contacts/[id]` detail + activity timeline
- `/crm/companies` analoog
- Form-primitives (zod + react-hook-form)
- Seed-script met 5 dummy contacts

**Acceptance:**
- Contacten aanmaken/bewerken/verwijderen
- Zoeken op naam/email
- Activity-log toevoegen aan een contact

### PR 4 — Projects + milestones

**Scope:**
- Schema: `projects`, `milestones`, `project_members`
- `/projects` grid view (cards met status, owner, deadline)
- `/projects/[id]` detail: beschrijving, milestone-timeline, linked contacts, linked kanban-board
- Milestone add/edit inline

**Acceptance:**
- Project aanmaken en linken aan client (company)
- Milestones toevoegen met due date
- Status-toggle (active/paused/done) werkt

### PR 5 — Kanban + GitHub sync **⭐ hartstuk**

**Scope:**
- Schema: `kanban_boards`, `kanban_columns`, `kanban_cards`
- Board-setup UI: kies repo, map kolommen naar labels
- Sync-worker: bij mount fetched Octokit de issues, vult cache
- Webhook-endpoint `/api/webhooks/github` — update cache on `issues.labeled`, `issues.opened`, `issues.closed`
- Board UI met `@dnd-kit`:
  - Drag card tussen kolommen → optimistic update + PATCH label via Octokit
  - Card-detail modal: titel, body (markdown render), comments (read-only v1)
  - "New card" → `POST /repos/:owner/:repo/issues`
- Speciale kolom "Claude-werk": kaarten met label `claude` zijn voor Claude; Christian kan daar instructies op zetten
- CLI-hint in card-detail: "claude commit op deze issue" → copy-paste command

**Acceptance:**
- Kaarten verplaatsen in UI → labels op GH wijzigen binnen 2s
- Nieuwe GH-issue verschijnt in board binnen 5s (via webhook)
- Lost connectie? Poll-fallback elke 60s

### PR 6 — Linear-style inbox

**Scope:**
- Unified activity table (bron: GH events + CRM mutaties + project-mutaties)
- `/inbox` feed met filters (Alles / GH / CRM / Projects)
- Mark-as-read
- Unread-badge in sidebar

**Acceptance:**
- Nieuwe GH-issue-comment verschijnt in feed
- Klik op feed-item → navigeert naar bron (card / contact / project)

### PR 7 — Pages Explorer

**Scope:**
- `scripts/generate-page-manifest.ts` — scant `web/src/app/**/page.tsx`, extraheert route, title (uit metadata export), laatste wijziging (git)
- Output: `admin/src/generated/pages-manifest.json` (committed)
- `/pages` UI: boomstructuur (Dashboard → Aanbod → Coaching etc.)
- Click → detail-pagina met:
  - Metadata
  - Live preview iframe (desktop/tablet/mobile toggle)
  - Link "open file in VS Code" (vscode://)
- Regenereer-manifest knop (re-runt script server-side)

**Acceptance:**
- Alle huidige paginas (home, aanbod, coaching, mentorschap, opleidingen, organisaties, kennisinstituut, wininstituut, ontwikkellijn, weerbaarheidsmentor) zichtbaar
- Preview toont live de public site

### PR 8 — Site Editor (design-only, later implementeren)

Zie `docs/superpowers/specs/2026-XX-XX-site-editor-design.md` (nog te schrijven wanneer Blok 3 de public site block-gedreven heeft gemaakt).

## 7. Open beslissingen / forks voor Christian

Voor je groen licht geeft — dit zijn de forks waar ik graag je input op heb:

1. **Admin locatie**: aparte app `/admin` (mijn voorstel) of route-groep binnen `/web`? (Aanbeveling: aparte app.)
2. **DB-host**: Supabase Postgres (al genoemd in CLAUDE.md) of lokaal Postgres + aparte prod-host (bv. Neon/Railway)? (Aanbeveling: Supabase — je had het al.)
3. **GitHub-integratie eerste versie**: één app-PAT (snel) of direct per-user OAuth (beter, meer werk)? (Aanbeveling: PAT nu, OAuth in PR 8+.)
4. **Kanban sync-modus**: real-time webhook + optimistic UI, of simpeler polling-only in v1? (Aanbeveling: webhook vanaf start — 30 min extra werk, veel betere UX.)
5. **Site editor ambitie**: wil je `/admin/pages` alleen als read-only boom (PR 7) of ook alvast een simpele title/metadata-edit? (Aanbeveling: read-only boom in PR 7; editor pas als public site block-gedreven is.)

## 8. Push-pipeline

De `gh` CLI heeft drie accounts ingelogd, `cocreatie` is nu actief. `iamcoai` is de push-eigenaar van de repo. Bij PR-creatie schakelen we met:

```bash
gh auth switch --user iamcoai
```

Commits zelf worden lokaal gemaakt met `Chris - Founder at Co-Creators.ai <chris-co-creators-ai@users.noreply.github.com>`; dit staat los van de push-auth.

## 9. Volgende stappen

1. ✅ Deze spec reviewen — Christian feedback op de 5 forks
2. Branches aanmaken voor PR 1–7 (lokaal, geen push nog)
3. Start met **PR 1** — admin-scaffold
4. Parallel: iemand (of Claude in een andere sessie) pakt **PR 7** op omdat die geen DB nodig heeft
