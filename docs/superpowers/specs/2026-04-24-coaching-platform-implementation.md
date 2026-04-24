# WIN Coaching Platform — Implementation Playbook

**Datum:** 2026-04-24
**Status:** Execution manual — leidraad bij bouw
**Begeleidend document:** `2026-04-24-coaching-platform-design.md` (architectuur/why)
**Dit document:** per-PR bouwplan (how)

Dit is de stap-voor-stap manual voor het bouwen van het volledige platform. Elke PR is iteratief: bouwt voort op wat ervóór is gemerged. Per PR: afhankelijkheden, file-inventaris, taken+subtaken, integraties, edge cases, en een acceptatie-checklist die gehaald moet worden voordat er wordt gemerged.

---

## Inhoudsopgave

- [§0 Universele conventies](#0-universele-conventies) — geldt voor iedere PR
- [§1 Phase-overzicht + dependency graph](#1-phase-overzicht--dependency-graph)
- [§2 Phase M1 — Foundation (PR 01–03)](#2-phase-m1--foundation)
- [§3 Phase M1b — Plug and Pay infrastructure (PR 03b–03e)](#3-phase-m1b--plug-and-pay-infrastructure)
- [§4 Phase M2 — Client surface (PR 04–09)](#4-phase-m2--client-surface)
- [§5 Phase M3 — Coach surface (PR 10–15)](#5-phase-m3--coach-surface)
- [§6 Phase M4 — Admin surface (PR 16–22b)](#6-phase-m4--admin-surface)
- [§7 Cross-cutting gates](#7-cross-cutting-gates) — QA, security, deploy
- [Appendix A — Plug and Pay API Reference](#appendix-a--plug-and-pay-api-reference) — base URLs, OAuth2 PKCE, endpoints, enums, entities, webhooks via Rules API, pagination, errors

---

## §0 Universele conventies

Geldt voor **elke** PR. Faalt één hiervan → niet mergen.

### 0.0 Architectuur-patroon — laags denken

Iedere feature volgt deze lagen. Mengen = fail review.

```
┌──────────────────────────────────────────────────────────────┐
│  UI (React components)                                       │
│  — alleen render, hooks, forms; geen fetch naar externe API  │
└────────────┬─────────────────────────────────────────────────┘
             │ server action of RSC
┌────────────▼─────────────────────────────────────────────────┐
│  Use-case / server-action (app/**/actions.ts)                │
│  — auth + validate (zod) + orchestreer + return typed result │
└────────────┬─────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────┐
│  Service layer (modules/<domain>/services/*.service.ts)      │
│  — domein-logica, transacties, cross-repo coördinatie        │
└────────────┬───────────────────┬─────────────────────────────┘
             │                   │
┌────────────▼──────────┐   ┌────▼─────────────────────────────┐
│ Repository            │   │ External client (HTTP/SDK)       │
│ (modules/<d>/repo/)   │   │ (modules/<d>/client/http.ts)     │
│ — Drizzle queries     │   │ — retry, auth, error mapping     │
└───────────────────────┘   └──────────────────────────────────┘
```

**Regels:**
- UI importeert **nooit** direct een repository of externe client
- Server actions zijn **dunne adapters**, geen business-logic
- Services zijn **pure** (mockable) — DB en HTTP krijgen ze geïnjecteerd
- Externe API-responses worden **altijd** gemapped naar interne types via `mappers/`
- Routes onder `/api/` zijn **alleen** voor webhooks, health, cron, external callers — interne UI gebruikt server actions

**Directory-conventie per domain-module:**
```
platform/src/modules/<domain>/
├── client/          # transport (HTTP, SDK-wrappers)
├── services/        # domein-logica
├── repo/            # Drizzle queries (1 file per aggregate)
├── schemas/         # zod schemas voor input/output
├── types/           # interne TS-types
├── enums/           # value-object enums
├── mappers/         # extern ↔ intern
└── events/          # event-handlers (webhooks, pub/sub)
```

**Unit-test-model:** mock het niveau direct onder je. Service-test mockt repo + client. Server-action-test mockt service. UI-test mockt server-action.

### 0.1 Rem + mobile-first gate
- [ ] Geen `px` in Tailwind arbitraries (`[10px]`), geen `px` in inline styles of styled components
- [ ] Uitzonderingen alleen: 1px borders, media-query breakpoints (sm/md/lg/xl), box-shadow spreads
- [ ] ESLint passeert zonder `no-raw-pixels` warnings
- [ ] Playwright test op 375×667 (iPhone SE): geen horizontal scroll, alle tap-targets ≥2.75rem
- [ ] Playwright test op 1440×900 (desktop): layout klopt
- [ ] Dark-mode toggle werkt als de pagina in `/coach` of `/admin` zit

### 0.2 Code-kwaliteit
- [ ] TypeScript strict mode — geen `any` tenzij gedocumenteerd waarom
- [ ] `npm run build` slaagt zonder warnings
- [ ] `npm run lint` slaagt
- [ ] Drizzle-migratie (indien schema-wijziging) draait idempotent tegen lege + seeded DB
- [ ] Server-only secrets alleen in `process.env.*` bij `"use server"` of `/api/` routes

### 0.3 Veiligheid
- [ ] Geen client-side API-tokens
- [ ] Server actions checken sessie én rol voordat ze data muteren
- [ ] User-supplied IDs worden gevalideerd (zod) en ge-scoped op sessie
- [ ] Externe webhooks verifiëren signature (zodra mogelijk)

### 0.4 PR-hygiëne
- [ ] Branch-naam volgt `feat/platform-NN-slug` conventie
- [ ] Commits zijn atomair en hebben duidelijke berichten
- [ ] PR-body verwijst naar het relevante PR-nummer in dit document
- [ ] Screenshots van mobile + desktop toegevoegd aan PR
- [ ] `main` is gemerged in de branch vóór review

---

## §1 Phase-overzicht + dependency graph

```
                  ┌──────── PR 01 scaffold ────────┐
                  │                                │
         ┌──── PR 02 design-system ────┐           │
         │      (AppShell, mobile-nav)  │          │
         │                              │          │
         └─── PR 03 rbac + sessions ────┤          │
                                        │          │
                           ┌────────────┴──────────┘
                           │
          ┌────────────────┼──────────────────┐
          │                │                  │
     PR 03b P&P        PR 03c webhook    PR 03d sync
     client + tables   handler           cron
          │                │                  │
          └──────┬─────────┴──────────────────┘
                 │
          PR 03e enrollment-gating
                 │
     ┌───────────┼─────────────┐
     │           │             │
  M2 client   M3 coach      M4 admin
  surface     surface       surface
  (PR 04-09)  (PR 10-15)    (PR 16-22b)
```

**Harde dependencies:** PR 01 → PR 02 → PR 03 → {M1b track} → alles.
**Soft dependencies binnen M2-M4:** trajecten viewer (04) moet bestaan vóór opdrachten (05) en voor trajectbouwer (12).

**Parallel mogelijk na M1b:**
- Track A (Reza-waarde): PR 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15
- Track B (intern/tooling): PR 16 → 17 → 17b → 17c → 19 → 20 → 21 → 22 → 22b
- Track C (sideline, kan tussendoor): PR 18 projects

---

# §2 Phase M1 — Foundation

Doel: login werkt, drie rol-routes, responsive shell. Na M1 is het platform een leeg-maar-werkend skelet waarin je als admin/coach/client kunt inloggen en elk van de drie layouts ziet.

---

## PR 01 — `feat/platform-01-scaffold`

**Goal:** Next.js 16 app `/platform` naast `/web`, met BetterAuth + Drizzle + Postgres en een werkend `/login`.

**Depends on:** niets. Eerste PR van deze track.
**Unlocks:** PR 02.

### Files created
```
platform/
├── package.json                          # next 16, react 19, tailwind 4, ts 5
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── drizzle.config.ts
├── .env.example                          # DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # root html/body, fonts
│   │   ├── globals.css                   # Tailwind entry + tokens (copy vanuit web/)
│   │   ├── page.tsx                      # /  → redirect naar /login of dashboard
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx               # initieel disabled (invite-only); UI al wel klaar
│   │   └── api/auth/[...all]/route.ts    # BetterAuth handler
│   ├── lib/
│   │   ├── auth.ts                       # BetterAuth config + exports
│   │   ├── auth-client.ts                # client-side helper
│   │   └── db/
│   │       ├── index.ts                  # drizzle client
│   │       └── schema/
│   │           ├── index.ts              # re-exports
│   │           └── auth.ts               # users, sessions, accounts, verification
│   └── middleware.ts                     # no-op in deze PR (filled in PR 03)
├── drizzle/                              # gegenereerde migrations
└── README.md                             # hoe lokaal te draaien
```

### Files modified
- Root `package.json` — npm workspaces config aanpassen indien monorepo
- `.gitignore` — drizzle output, `.env.local`

### Tasks

**T1. Next.js 16 app aanmaken**
- [ ] `mkdir platform && cd platform && npx create-next-app@16 . --typescript --tailwind --eslint --app --no-src-dir` — daarna handmatig `src/` dir maken (consistent met `/web`)
- [ ] Controleer Next 16 API: `experimental.typedRoutes` aan, `reactCompiler` check of standaard
- [ ] Verify met `npm run dev` op poort 3001 (poort 3000 is voor `/web`) — `next.config.ts: { devIndicators: false }` optioneel
- [ ] Kopieer `globals.css` tokens uit `web/src/app/globals.css` (de `@theme inline` block)

**T2. Workspace-setup**
- [ ] Root-niveau `package.json` in repo-root maken (indien nog niet bestaand) met `workspaces: ["web", "platform", "packages/*"]`
- [ ] Root scripts: `dev:web`, `dev:platform`, `build`, `lint`
- [ ] Install deps op root, niet per package (`npm install` vanuit root)

**T3. Drizzle + Postgres opzetten**
- [ ] Install: `drizzle-orm drizzle-kit postgres @types/pg`
- [ ] `drizzle.config.ts`: dialect postgres, schema `./src/lib/db/schema/*`, out `./drizzle`
- [ ] `lib/db/index.ts`: maak `db` export; lees `DATABASE_URL` via server-env
- [ ] `lib/db/schema/auth.ts`: BetterAuth-verplichte tabellen (users, sessions, accounts, verification_tokens) — exact volgens [BetterAuth docs](https://www.better-auth.com/docs/adapters/drizzle)
- [ ] `npm run db:push` → schema naar lokale Postgres (bv Supabase project `win-dev`)

**T4. BetterAuth configureren**
- [ ] Install: `better-auth`
- [ ] `lib/auth.ts`: `betterAuth({ database: drizzleAdapter(db, { provider: "pg" }), emailAndPassword: { enabled: true } })`
- [ ] `app/api/auth/[...all]/route.ts`: export `GET`, `POST` = `toNextJsHandler(auth)`
- [ ] `.env.example` + lokale `.env.local` met `BETTER_AUTH_SECRET` (gen via `openssl rand -base64 32`)

**T5. Login-pagina (minimal, niet gefinaliseerd design)**
- [ ] Eenvoudige form: email + password + submit
- [ ] Server action → `auth.api.signInEmail({ body })`
- [ ] Bij success: redirect `/` (redirect-logica komt in PR 03)
- [ ] Bij error: toon melding; error-boundary correct

**T6. Seed-script**
- [ ] `scripts/seed.ts`: maakt admin-user (email: `chris@co-creatie.ai`, password uit env), coach-user (`reza@win.nl`), demo-client
- [ ] `npm run db:seed`

**T7. README + docs**
- [ ] `platform/README.md`: vereisten, setup-stappen, `.env`-uitleg, scripts
- [ ] Update root `README.md` met pointer naar `/platform`

### Integrations
- Gebruikt: Postgres (Supabase)
- Biedt: BetterAuth endpoints, `db` instance voor volgende PRs

### Edge cases
- Supabase connection string heeft pooler/direct-connection verschil — gebruik direct voor migraties, pooler voor runtime
- BetterAuth vereist `BETTER_AUTH_URL` in production — zet in `.env.example`
- Cookies werken niet over cross-origin; `platform/` moet op dezelfde top-level domain als `web/` in prod (`www.win.nl` + `app.win.nl` — beide `.win.nl` cookies)

### Acceptance checklist
- [ ] `npm run dev` op poort 3001 toont `/login`
- [ ] Seed maakt drie users aan
- [ ] Inloggen met seeded account werkt → sessie-cookie gezet → redirect naar `/`
- [ ] `/` toont placeholder ("Welkom") — geen 500
- [ ] `.env.local` genegeerd door git
- [ ] Drizzle-migratie voert uit tegen lege DB (reset + up)
- [ ] §0 conventies gehaald (rem, mobile, code-quality, security, PR-hygiëne)

### Mobile test (verplicht)
- [ ] `/login` op 375×667: form past, labels leesbaar, submit-knop niet onder keyboard
- [ ] Geen horizontal scroll

---

## PR 02 — `feat/platform-02-design-system`

**Goal:** shared design primitives (`packages/ui/`), shadcn geïnstalleerd, `<AppShell>` met topbar + hamburger-sheet + bottom-nav-mobile + desktop-rail, rem-lint-guard, Playwright-baseline op 375×667 en 1440×900.

**Depends on:** PR 01.
**Unlocks:** PR 03 en alle UI-werk.

### Files created
```
packages/ui/
├── package.json
├── tsconfig.json
├── tailwind.config.ts                    # shared, import in /web en /platform
├── src/
│   ├── tokens.css                        # alle WIN-tokens + dark variant
│   ├── lib/cn.ts                         # clsx + tailwind-merge helper
│   └── components/
│       ├── primitives/                   # shadcn re-exports
│       │   ├── button.tsx
│       │   ├── input.tsx
│       │   ├── dialog.tsx
│       │   ├── sheet.tsx
│       │   ├── toast.tsx
│       │   ├── tabs.tsx
│       │   └── command.tsx
│       └── responsive/
│           ├── responsive-table.tsx
│           ├── responsive-dialog.tsx
│           └── sticky-form-footer.tsx

platform/src/
├── components/shell/
│   ├── app-shell.tsx                     # wrapper: topbar + nav-left + bottom-nav + content
│   ├── topbar.tsx                        # hamburger, logo, user-menu
│   ├── mobile-hamburger.tsx              # Sheet met volledige menu-boom
│   ├── bottom-nav.tsx                    # rol-specifiek, 4-5 items, safe-area
│   └── desktop-rail.tsx                  # permanent sidebar ≥md
├── config/
│   └── nav.ts                            # { admin: [...], coach: [...], client: [...] }
└── app/
    ├── layout.tsx                        # wrap met ThemeProvider (light/dark)
    └── ui-kit/page.tsx                   # demo-pagina met alle primitives

platform/eslint.config.mjs                # extend met no-raw-pixels regel
playwright.config.ts                      # repo-root of platform-level
platform/e2e/
├── mobile-baseline.spec.ts
└── desktop-baseline.spec.ts
```

### Tasks

**T1. packages/ui/ opzetten**
- [ ] Maak `packages/ui/` met eigen `package.json` (als workspace-package)
- [ ] Tailwind config centraliseren — importeren vanuit `/web` en `/platform` (export function `createTailwindConfig({ darkMode })`)
- [ ] `tokens.css` met alle kleuren + spacing-schaal in rem; `:root` = light, `[data-theme="dark"]` = dark variant (bronze-basis, cream-tekst)
- [ ] `/web/src/app/globals.css` migreren naar import van `packages/ui/src/tokens.css`

**T2. shadcn installeren en wrappen**
- [ ] `npx shadcn@latest init` binnen `packages/ui/` — config met WIN-tokens
- [ ] Installeer primitives: `button`, `input`, `label`, `sheet`, `dialog`, `toast`, `tabs`, `command`, `separator`, `avatar`, `dropdown-menu`
- [ ] Alle primitives re-exporteren uit `packages/ui/src/components/primitives/index.ts`

**T3. Responsive primitives bouwen**
- [ ] `<ResponsiveDialog>`: gebruikt `useMediaQuery('(min-width: 48rem)')` → Dialog op desktop, Sheet (bottom of right) op mobile
- [ ] `<ResponsiveTable>`: prop `columns` + `rows`; op `<md` rendert als card-list met `columns[i].label: value`; op `≥md` als gewone tabel
- [ ] `<StickyFormFooter>`: `position: sticky; bottom: 0` op mobile, gewoon inline op desktop

**T4. AppShell + navigatie**
- [ ] `<AppShell role>`: topbar (h-14 = 3.5rem), bij `≥md` toont desktop-rail links, bij `<md` toont bottom-nav onderin met `pb-[env(safe-area-inset-bottom)]`
- [ ] `<Topbar>`: links hamburger (IconButton toont Sheet), midden logo, rechts avatar-dropdown
- [ ] `<MobileHamburger>`: Sheet uit shadcn, volledige menu-boom per rol
- [ ] `<BottomNav>`: tab-bar met 5 items uit `config/nav.ts[role]`, actieve tab met win-gold accent
- [ ] `<DesktopRail>`: ~15rem breed, scrollable, vast zichtbaar ≥md
- [ ] `config/nav.ts`: exporteer `navConfig = { admin: [...], coach: [...], client: [...] }` met label, icon (lucide), href, en flag `mobilePrimary: boolean` voor bottom-nav

**T5. ESLint rem-guard**
- [ ] Maak custom regel of gebruik bestaande plugin `eslint-plugin-tailwindcss`
- [ ] Regel die warning geeft bij:
  - Tailwind class `[0-9]+px` in arbitrary syntax
  - Inline `style={{ padding: '8px' }}` met px
- [ ] Whitelist: `1px`, border-waardes, `shadow-*` classes (die gebruiken intern px maar zijn design-tokens)
- [ ] Faal CI op warning — `lint: next lint --max-warnings 0`

**T6. UI-kit demo**
- [ ] `/ui-kit` pagina toont alle primitives met voorbeelden
- [ ] Beide themes-switchers (light/dark)
- [ ] Toont bewust alle breakpoints

**T7. Playwright baseline**
- [ ] Install `@playwright/test`
- [ ] `mobile-baseline.spec.ts` met `viewport: { width: 375, height: 667 }` — navigeer naar `/login`, `/ui-kit`: screenshot + geen horizontal scroll assertion
- [ ] `desktop-baseline.spec.ts` met `1440×900` — idem
- [ ] Add npm script: `test:e2e`

### Integrations
- Gebruikt: shadcn/ui, Tailwind v4
- Biedt: `<AppShell>` + primitives voor alle volgende PRs

### Edge cases
- iPhone notch: bottom-nav moet `env(safe-area-inset-bottom)` padding hebben
- Sheet op mobile Safari: overflow-behaviour kan scroll-lock breken — `vaul` library als fallback overwegen
- Dark-mode flash bij eerste load: gebruik `next-themes` met `suppressHydrationWarning` op `<html>`
- Hamburger + bottom-nav overlap: hamburger opent full-sheet, bottom-nav blijft daarachter; z-index discipline (topbar z-40, sheet z-50, bottom-nav z-30)

### Acceptance checklist
- [ ] `/ui-kit` toont alle primitives, werkt licht + donker
- [ ] AppShell op `/` rendert: topbar zichtbaar, bottom-nav op mobile, rail op desktop
- [ ] Hamburger-sheet slidet in/uit, sluit bij route-change
- [ ] Bottom-nav toont correct per rol (na PR 03 met echte sessie, hier nog demo-prop)
- [ ] Playwright mobile+desktop baselines groen
- [ ] ESLint faalt op ingevoegde `[20px]` test-regel (remove na test)
- [ ] Geen hydratie-warnings in console
- [ ] §0 conventies gehaald

### Mobile test (verplicht)
- [ ] 375×667: topbar 3.5rem, bottom-nav zichtbaar, geen content eronder weggedrukt
- [ ] Hamburger opent vanaf links, full height, sluit via backdrop-tap
- [ ] 320×568 (iPhone SE gen 1) ook getest — geen overflow

---

## PR 03 — `feat/platform-03-rbac`

**Goal:** rol-systeem + beschermde routes per rol + session-event tracking (voor "laatste login/logout" in CRM).

**Depends on:** PR 02.
**Unlocks:** alle M1b + M2 + M3 + M4 werk (want die hebben rol-check nodig).

### Files created / modified

**New:**
```
platform/src/lib/db/schema/
├── rbac.ts                               # user_roles
└── sessions.ts                           # user_session_events

platform/src/lib/auth/
├── session.ts                            # getSessionWithRoles() helper
├── rbac.ts                               # hasRole(), requireRole()
└── hooks.ts                              # BetterAuth after-sign-in, after-sign-out

platform/src/app/
├── (authed)/
│   ├── layout.tsx                        # AppShell wrapper, check sessie
│   ├── page.tsx                          # redirect naar juiste rol-home
│   ├── app/layout.tsx                    # requireRole('client')
│   ├── coach/layout.tsx                  # requireRole('coach')
│   └── admin/layout.tsx                  # requireRole('admin')
```

**Modified:**
- `platform/src/middleware.ts` — check sessie, stuur ongeauth naar `/login`
- `scripts/seed.ts` — rollen toevoegen aan seed-users
- `platform/src/lib/auth.ts` — register session-event hooks

### Tasks

**T1. Schema**
- [ ] `rbac.ts`: `userRoles(userId, role)` — composite primary key; enum `admin|coach|client`
- [ ] `sessions.ts`: `userSessionEvents(id, userId, type 'login'|'logout', ip, userAgent, createdAt)`
- [ ] Migratie draaien

**T2. Auth helpers**
- [ ] `getSessionWithRoles()`: wrapper om `auth.api.getSession()` die tevens rollen uit `userRoles` ophaalt
- [ ] `hasRole(session, role)` / `requireRole(role)` — laatste throwed of redirect bij missend
- [ ] Cache binnen één request via `React.cache()`

**T3. Middleware**
- [ ] `middleware.ts`: als pad start met `/app`, `/coach`, `/admin` en er is geen sessie → redirect `/login?redirect=...`
- [ ] Config `matcher: ["/app/:path*", "/coach/:path*", "/admin/:path*"]`

**T4. Rol-specifieke layouts**
- [ ] `(authed)/layout.tsx`: render `<AppShell>` en bepaalt welke nav-config actief is op basis van pad
- [ ] `app/layout.tsx`, `coach/layout.tsx`, `admin/layout.tsx` elk `await requireRole(...)` — bij mismatch redirect `/login` met toast "geen toegang"
- [ ] `(authed)/page.tsx`: als user admin → `/admin`, coach → `/coach`, client → `/app`. Voorkeur volgorde `admin > coach > client` als meerdere rollen

**T5. Session-event hooks**
- [ ] BetterAuth `hooks.after` op `signIn` → insert `userSessionEvents` type=login
- [ ] Op `signOut` → insert type=logout
- [ ] Helper `getLastLogin(userId)` / `getLastLogout(userId)` voor later gebruik in CRM

**T6. Seed verrijken**
- [ ] `chris@...` → `['admin']`
- [ ] `reza@...` → `['admin', 'coach']` (Reza doet ook adminwerk)
- [ ] `client@demo.nl` → `['client']`

### Integrations
- Gebruikt: BetterAuth, Drizzle
- Biedt: `requireRole`, session-events voor CRM

### Edge cases
- User met 0 rollen (bv. nieuwe signup): redirect naar `/waiting` scherm "wacht op goedkeuring"
- User met rol maar niet de juiste: 403 i.p.v. redirect (anders loop)
- Session-event op logout kan falen als user al weg is — catch en log, niet blocking
- IP + userAgent gevoelig: anonimiseer IP (laatste octet op 0) voor AVG

### Acceptance checklist
- [ ] Inloggen als `chris` → landt op `/admin`
- [ ] Inloggen als `reza` → landt op `/admin` (eerste rol wint), kan manueel naar `/coach`
- [ ] Inloggen als `client` → landt op `/app`, `/admin` = 403
- [ ] `userSessionEvents` heeft rijen voor elke login+logout
- [ ] Middleware redirects anonieme bezoekers van `/admin` → `/login?redirect=/admin`
- [ ] Na login → `?redirect=` wordt gehonoreerd
- [ ] Bottom-nav toont rol-specifieke items
- [ ] §0 conventies gehaald

### Mobile test (verplicht)
- [ ] Login → juiste rol-layout → bottom-nav correct per rol
- [ ] 403-pagina leesbaar op mobile

---

# §3 Phase M1b — Plug and Pay infrastructure

Doel: klant op P&P betaalt → user + enrollment aangemaakt → magic-link → toegang. Dit is de commerciële kritieke lijn. Na M1b kan de eerste euro door de pipeline.

---

## PR 03b — `feat/platform-03b-plugandpay-client`

**Goal:** Complete service-laag voor Plug and Pay (HTTP transport + services per resource + zod-schemas + typed enums + mappers) + alle P&P-cachetabellen + `/admin/integrations/plugandpay` connect-UI met OAuth2 PKCE flow.

> **Bron van waarheid voor dit PR:** Appendix A van dit document. Niet zelf API-shapes verzinnen — alles daar staat geverifieerd uit de officiële PHP SDK en Context7-docs van Plug and Pay.

**Depends on:** PR 03.
**Unlocks:** PR 03c, PR 03d.

### Files created (volgens §0.0 architectuur-lagen)

```
platform/src/modules/plugandpay/
├── client/                                 # TRANSPORT layer
│   ├── http-client.ts                      # PlugAndPayHttpClient — Guzzle-equivalent in TS
│   ├── oauth.ts                            # PKCE flow: authorize-url + code→token exchange + refresh
│   ├── token-store.ts                      # encrypted tenant-scoped token storage (Drizzle)
│   ├── rate-limiter.ts                     # token-bucket rate-limiter
│   ├── retry.ts                            # exponential backoff helper
│   └── errors.ts                           # typed: PlugAndPayApiError, NotFound, Validation, Unauthorized
├── services/                               # DOMAIN services (1 per resource)
│   ├── orders.service.ts                   # list/find/create/update/delete
│   ├── subscriptions.service.ts
│   ├── products.service.ts
│   ├── checkouts.service.ts
│   ├── rules.service.ts                    # ← webhooks worden via Rules API geregistreerd
│   ├── tax-rates.service.ts
│   ├── memberships-settings.service.ts
│   ├── portal-settings.service.ts
│   ├── affiliate-sellers.service.ts
│   └── tenant.service.ts
├── enums/                                  # mirror van SDK enums
│   ├── order.ts                            # OrderIncludes, OrderSortType
│   ├── subscription.ts                     # SubscriptionStatus, SubscriptionIncludes
│   ├── product.ts                          # ContractType, ProductIncludes, ProductSortType
│   ├── payment.ts                          # PaymentStatus, PaymentMethod, PaymentProvider, PaymentType
│   ├── common.ts                           # Mode, Source, Direction, Locale, CountryCode, CurrencyCodeIso
│   ├── checkout.ts                         # CheckoutStatus, CheckoutIncludes, CheckoutSort
│   ├── invoice.ts                          # InvoiceStatus
│   ├── tax.ts                              # TaxExempt
│   ├── discount.ts                         # DiscountType
│   ├── interval.ts                         # Interval, PlanCycle
│   ├── item.ts                             # ItemType
│   └── rule.ts                             # TriggerType (onze enum voor de triggers die we ondersteunen)
├── schemas/                                # zod schemas voor input/output validation
│   ├── primitives.ts                       # Money, ISODate, TenantId
│   ├── contact.schema.ts
│   ├── address.schema.ts
│   ├── payment.schema.ts
│   ├── order.schema.ts
│   ├── subscription.schema.ts
│   ├── product.schema.ts
│   ├── checkout.schema.ts
│   ├── rule.schema.ts
│   └── pagination.schema.ts                # meta + links structure
├── types/                                  # interne TS-types (mapper-output)
│   ├── order.ts
│   ├── subscription.ts
│   ├── product.ts
│   └── index.ts
├── mappers/                                # P&P-response ↔ ons DB-model
│   ├── order.mapper.ts                     # → plugandpay_orders
│   ├── subscription.mapper.ts              # → plugandpay_subscriptions
│   ├── product.mapper.ts                   # → plugandpay_products
│   └── customer.mapper.ts                  # contact → plugandpay_customers
├── repo/                                   # Drizzle queries (cache-laag)
│   ├── orders.repo.ts
│   ├── subscriptions.repo.ts
│   ├── products.repo.ts
│   ├── customers.repo.ts
│   ├── webhook-events.repo.ts
│   └── integration.repo.ts                 # tenant, tokens, integration-settings
└── filters/                                # query-builder helpers (mirror PHP Filters)
    ├── order.filter.ts
    ├── subscription.filter.ts
    └── product.filter.ts

platform/src/lib/db/schema/
├── plugandpay.ts                           # alle plugandpay_* tabellen (design §4) +
                                            # plugandpay_integration (tenant_id, tokens)
├── enrollments.ts                          # enrollment status + grace_until + P&P FKs
└── trajecten.ts                            # basics (uitgebreid in PR 12)

platform/src/app/admin/integrations/plugandpay/
├── page.tsx                                # status-dashboard
├── actions.ts                              # server actions (connect, disconnect, test, register-webhooks)
├── oauth-callback/
│   └── route.ts                            # /oauth/callback — vangt P&P redirect
└── _components/
    ├── connection-card.tsx
    ├── product-link-table.tsx
    └── webhook-registration.tsx
```

### Reference-tabel — welk bestand bouwt wat tegen welke API

| Ons bestand | HTTP-verb + pad | SDK-equivalent (PHP) |
|------------|-----------------|----------------------|
| `services/orders.service.ts`:`list()` | GET `/v2/orders` | `OrderService::get()` |
| `services/orders.service.ts`:`find(id)` | GET `/v2/orders/{id}` | `OrderService::find()` |
| `services/orders.service.ts`:`create(dto)` | POST `/v2/orders` | `OrderService::create()` |
| `services/orders.service.ts`:`update(id, patch)` | PATCH `/v2/orders/{id}` | `OrderService::update()` |
| `services/orders.service.ts`:`remove(id)` | DELETE `/v2/orders/{id}` | `OrderService::delete()` |
| `services/subscriptions.service.ts` | `/v2/subscriptions` CRUD | `SubscriptionService` |
| `services/products.service.ts` | `/v2/products` CRUD | `ProductService` |
| `services/checkouts.service.ts` | `/v2/checkouts` CRUD | `CheckoutService` |
| `services/rules.service.ts`:`registerWebhook()` | POST `/v2/rules` met driver='webhook' | `RuleService::create()` |
| `services/rules.service.ts`:`listRules()` | GET `/v2/rules` | `RuleService::get()` |
| `client/oauth.ts`:`authorizeUrl()` | redirect → `https://admin.plugandpay.com/oauth/authorize?...` | `Client::generateAuthorizationUrl()` |
| `client/oauth.ts`:`exchangeCode()` | POST `/oauth/token` grant=authorization_code | `Client::getCredentials()` |
| `client/oauth.ts`:`refresh()` | POST `/oauth/token` grant=refresh_token | `Client::refreshTokensIfNeeded()` |
| `client/oauth.ts`:`revoke()` | POST `/v2/auth/oauth/revoke` | `Client::revokeTokens()` |

### Tasks

**T1. Schema toevoegen**
- [ ] `plugandpay.ts`: alle `plugandpay_*` tabellen uit design §4
- [ ] Extra: `plugandpay_integration(id, tenant_id, access_token_encrypted, refresh_token_encrypted, access_token_expires_at, scope, connected_at, disconnected_at)` — versleutelde token-opslag
- [ ] `enrollments.ts` + `trajecten.ts` (minimal)
- [ ] Migratie draait idempotent

**T2. Enums (mirror SDK)**
- [ ] Kopieer **exact** de waardes uit Appendix A §A.4 — dit zijn value-strings die over de wire gaan, geen eigen vertaling
- [ ] Elke enum als TS-`const` + zod `z.nativeEnum()` voor validatie
- [ ] Één file per logisch domein (order/subscription/payment/etc)

**T3. Zod schemas (input + output)**
- [ ] `primitives.ts`: `Money` (amount: number with 2 decimals, currency: CurrencyCode), `ISODate` (datetime), `TenantId` (positive int)
- [ ] Per entity: schema voor **response** (wat P&P teruggeeft) én **create/update** input (wat wij sturen)
- [ ] Pagination: `{ data: T[], meta: { current_page, per_page, total, last_page } }` — P&P gebruikt Laravel-achtige pagination
- [ ] Errors: `{ errors: Record<field, string[]> }` bij 422

**T4. HTTP-client (transport)**
- [ ] `http-client.ts`: class `PlugAndPayHttpClient({ baseUrl, tenantId, tokenStore })`
- [ ] `request<T>(method, path, body?, { query, retry })` — generic met zod-validation van response
- [ ] Auto-refresh access-token als expired (via `token-store.refreshIfNeeded(tenantId)`)
- [ ] Retry op 5xx + netwerk-errors met exponential backoff: 500ms, 1s, 2s, 4s, stop
- [ ] Respect `Retry-After` header op 429
- [ ] `rate-limiter.ts`: default 2 req/sec (conservatief tot rate-limit gedocumenteerd is)
- [ ] Request-id (`X-Request-Id: wininstituut-{uuid}`) in headers + logs
- [ ] Error-types: `PlugAndPayApiError` base, subclasses `UnauthorizedError`, `NotFoundError`, `ValidationError`, `RateLimitError`, `ServerError`

**T5. OAuth2 PKCE flow**
- [ ] `oauth.ts`:
  - `buildAuthorizeUrl(state, codeVerifier)`: S256 challenge, redirect naar `https://admin.plugandpay.com/oauth/authorize` met `client_id`, `response_type=code`, `scope=''`, `state`, `code_challenge`, `code_challenge_method=S256`, `step=select_tenant`
  - `exchangeCode(code, codeVerifier, tenantId)`: POST naar `https://api.plugandpay.com/oauth/token` met grant_type=authorization_code
  - `refresh(refreshToken, tenantId)`: POST met grant_type=refresh_token
  - `revoke()`: POST `/v2/auth/oauth/revoke`
- [ ] `token-store.ts`: versleutel tokens met AES-256-GCM via app-secret (uit env), decrypt bij gebruik
- [ ] Callback-route `/admin/integrations/plugandpay/oauth-callback`: valideer state (CSRF), valideer code-verifier-match uit secure cookie, exchange, opslaan, redirect naar `/admin/integrations/plugandpay`
- [ ] CSRF-bescherming: state in signed cookie, code-verifier in httpOnly cookie (gebruikt eenmalig)

**T6. Per-resource services**
- [ ] Generieke base-class `BaseService<TEntity, TFilter, TIncludes>` met CRUD-methods
- [ ] `OrdersService extends BaseService` — methods: `list(filter?, includes?)`, `find(id, includes?)`, `create(dto)`, `update(id, patch)`, `remove(id)`
- [ ] Subscriptions/Products/Checkouts/Rules/TaxRates/MembershipsSettings/AffiliateSellers idem
- [ ] `TenantService.get()` — haalt huidige tenant-info op (voor connect-flow)
- [ ] Alle services krijgen http-client geïnjecteerd via constructor — **niet** zelf instantiëren

**T7. Filters (query-builder)**
- [ ] `OrderFilter`, `SubscriptionFilter`, `ProductFilter` — chainable builders met exacte keys uit Appendix A
- [ ] Elk heeft `.parameters()` / `.toQueryString()` om aan service door te geven
- [ ] Zod-schema voor filter-input zodat UI-form kan valideren

**T8. Mappers (P&P → ons model)**
- [ ] `order.mapper.ts`: `mapPlugAndPayOrderToDbRow(response)` — extraheert alleen wat wij cachen (id, customer_id, amount_cents, currency, status, invoice_url, placed_at, paid_at)
- [ ] Symmetrisch als we PATCH'en: `mapDbRowToPlugAndPayOrder(row)` — alleen velden die muteerbaar zijn
- [ ] Subscription, Product, Customer (uit Contact + OrderBilling) idem
- [ ] Expliciete unit-tests met **echte P&P-payload fixtures** (uit Appendix A examples)

**T9. Repo laag (Drizzle)**
- [ ] `orders.repo.ts`: `upsertByPlugAndPayId`, `findByCustomerId`, `listPaged`
- [ ] Subscriptions/Products/Customers/WebhookEvents idem
- [ ] `integration.repo.ts`: `saveTokens`, `getActiveIntegration`, `markDisconnected`
- [ ] Alle queries zijn pure functions met `db` geïnjecteerd — voor test-mocks

**T10. Admin UI**
- [ ] `/admin/integrations/plugandpay` server-component toont:
  - Connection status: Not connected / Connected (tenant X sinds Y)
  - Als niet connected: "Connect with Plug and Pay" knop → redirect naar authorize-URL
  - Als connected: disconnect-knop, laatste sync, aantal cached records
- [ ] Test-connection knop: server-action die `TenantService.get()` aanroept, toont tenant-naam
- [ ] Webhook-registratie knop: roept `RulesService.registerWebhook(triggerType)` voor alle benodigde events (lijst in Appendix A §A.6)
- [ ] Product-link-tabel: lijst cached P&P products, per product dropdown om aan traject te koppelen

**T11. Unit-tests**
- [ ] Mock http-client, test elk service-method
- [ ] Mock service, test server-actions
- [ ] Mappers: input echte P&P payload fixtures uit Appendix A → assert exact DB-row

### Integrations
- Externe: Plug and Pay REST API (api.plugandpay.com), OAuth (admin.plugandpay.com)
- Intern: biedt `getPlugAndPayServices(tenantId)` factory voor PR 03c/03d

### Edge cases
- **Tenant-switch**: user connect als tenant A, later tenant B — we moeten twee integrations kunnen hebben per installatie maar voor WIN MVP is één genoeg. Schema ondersteunt meerdere, UI dwingt één af.
- **Token-expiry tijdens request**: 401 → trigger refresh, retry de request één keer. Als refresh faalt → markeer integration `disconnected_at` en alert admin.
- **Encrypted-token leak preventie**: nooit loggen; `.toJSON()` override op token-store type.
- **State-mismatch op OAuth callback**: CSRF — redirect met error, log attempt.
- **Rate-limit tijdens full-sync**: rate-limiter pauzeert; na 10 min timeout → abort + partial result.
- **Validation-errors (422)**: P&P geeft `{ errors: { field: [msg, msg] } }` — doorgeven aan UI zodat form-errors per veld gerenderd worden.
- **Unknown enum-waarde in response**: zod `z.enum()` faalt; catch en log met origineel → fallback naar 'unknown' of expliciete fail (per resource-kritikaliteit).

### Acceptance checklist
- [ ] Schema migreert; alle tabellen bestaan
- [ ] OAuth-flow werkt: click connect → redirect → P&P-login-view → callback → token opgeslagen versleuteld
- [ ] `TenantService.get()` returned tenant-naam na connect
- [ ] Product-list fetched; kan aan traject gekoppeld worden
- [ ] Alle services hebben unit-tests met ≥85% coverage
- [ ] Mappers: 100% coverage op fixture-based tests
- [ ] Geen `PLUGANDPAY_*` secret in client bundle (verify met `npm run build && grep -r "plugandpay" .next/static`)
- [ ] Error-types gooien en worden correct gecatched in routes
- [ ] §0 conventies gehaald, inclusief §0.0 laag-discipline

### Mobile test (verplicht)
- [ ] Integrations-pagina op 375×667: status-kaart leesbaar, connect-knop tap-baar
- [ ] OAuth-flow werkt op mobile (popup of redirect)
- [ ] Product-link-tabel → card-layout op mobile

---

---

## PR 03c — `feat/platform-03c-plugandpay-webhooks`

**Goal:** P&P webhooks binnenhalen via de **Rules API** (geen email-configuratie, geen admin-UI-koppeling in P&P — wij registreren programmatisch). Inkomende events idempotent verwerken. Enrollment-lifecycle afhandelen en magic-link versturen bij nieuwe klant.

> **Kernfeit uit onderzoek:** P&P gebruikt **geen dedicated webhook-endpoint** in de API. In plaats daarvan creëer je via `POST /v2/rules` een Rule met `driver='webhook'`, `action_type='call_webhook'`, `action_data={url}`, `trigger_type={event}`. Eén Rule per event-type dat we willen ontvangen. Voor details zie Appendix A §A.6.

**Depends on:** PR 03b (Rules service + HTTP client) + Resend configured.
**Unlocks:** PR 03e.

### Files created
```
platform/src/modules/plugandpay/events/     # webhook-ontvangst
├── webhook-dispatcher.ts                   # main entry van route.ts
├── event-registry.ts                       # { triggerType: handler } map
├── signature-verifier.ts                   # verify van signed webhook
├── handlers/
│   ├── order-paid.handler.ts
│   ├── order-refunded.handler.ts
│   ├── subscription-started.handler.ts
│   ├── subscription-renewed.handler.ts
│   ├── subscription-payment-failed.handler.ts
│   └── subscription-cancelled.handler.ts
└── replay.ts                               # retry-failed-event helper

platform/src/modules/enrollments/           # nieuw enrollment-module
├── services/
│   ├── enrollment.service.ts               # createFromOrder, updateStatus, grantAccess
│   └── invite.service.ts                   # magic-link flow
├── repo/
│   └── enrollment.repo.ts
└── types.ts

platform/src/modules/email/                 # email-module
├── client/
│   └── resend-client.ts
├── services/
│   └── email.service.ts                    # sendMagicLink, sendPaymentIssueAlert
└── templates/
    └── magic-link.tsx                      # React Email

platform/src/app/api/webhooks/plugandpay/
└── route.ts                                # dun adapter → dispatcher

platform/src/app/set-password/
└── page.tsx                                # landing vanuit magic-link

platform/src/app/admin/integrations/plugandpay/webhooks/
├── page.tsx                                # lijst events
└── _components/
    └── replay-button.tsx
```

### Tasks

**T1. Rule-registratie programmatisch**
- [ ] `RulesService.registerWebhook({ triggerType, conditionData? })` — POST `/v2/rules` met:
  ```
  {
    name: `wininstituut-${triggerType}`,
    driver: 'webhook',
    action_type: 'call_webhook',
    action_data: { url: `${process.env.PUBLIC_URL}/api/webhooks/plugandpay` },
    trigger_type: triggerType,
    condition_data: conditionData ?? {}
  }
  ```
- [ ] `RulesService.ensureAllWebhooksRegistered()` — haalt bestaande rules op, creëert ontbrekende
- [ ] `RulesService.unregisterAll()` — cleanup bij disconnect
- [ ] Admin UI "Register webhooks" knop → roept `ensureAllWebhooksRegistered`
- [ ] Bij disconnect van tenant → `unregisterAll`

**T2. Webhook ontvangst + idempotency**
- [ ] `POST /api/webhooks/plugandpay`:
  - Lees raw body (nodig voor signature verify)
  - Parse met zod `WebhookPayloadSchema`
  - Check `event_id` of fallback-dedup-key (timestamp + resource-id hash) tegen `plugandpay_webhook_events` — als reeds `processed_at` → 200 zonder re-run
  - Insert row
  - Dispatch via `event-registry[trigger_type]`
  - Bij success: `processed_at=now()`, return 200
  - Bij error: log, `error='...'`, return 500 zodat P&P retried
- [ ] Route is maximum 3s compute — dispatch van zware work via Supabase-queue of Vercel-queue als het escaleert (MVP: inline)

**T3. Signature-verification**
- [ ] `signature-verifier.ts`: HMAC-SHA256 met shared secret (uit P&P admin-panel bij rule-creatie, opslaan in env)
- [ ] Header-naam verifiëren via Discord/test — tijdelijk `X-PlugAndPay-Signature` als placeholder
- [ ] Dev-bypass via `PLUGANDPAY_ALLOW_UNSIGNED_WEBHOOKS=true` — nooit true in prod (assert in startup)

**T4. Event-handlers**
Elke handler is een pure `(event: ValidatedEvent, deps: Deps) => Promise<void>`. Deps injectie via ctor = testbaar.

- [ ] `order-paid.handler.ts`:
  1. Upsert customer cache (uit event payload.contact)
  2. Upsert order cache
  3. Find traject via `trajectPlugAndPayLinks[product_id]` — geen link → log warning, stop (product hoort niet bij een traject)
  4. Find of create user op `contact.email` → als nieuw: `status=invited`
  5. Create enrollment `(user, traject, coach=default-coach, status=active, plugandpay_order_id)`
  6. Stuur magic-link als user nieuw
  7. audit_log + inbox-event
- [ ] `order-refunded.handler.ts`: enrollment → cancelled, log
- [ ] `subscription-started.handler.ts`: koppel subscription_id aan enrollment
- [ ] `subscription-renewed.handler.ts`: update `current_period_end` in cache
- [ ] `subscription-payment-failed.handler.ts`: enrollment → payment_issue, `grace_until = now + 7d`, stuur admin-alert-email
- [ ] `subscription-cancelled.handler.ts`: enrollment → cancelled bij period-end; read-only toegang blijft (per design §7)

**T5. Magic-link flow**
- [ ] `invite.service.ts`: genereer eenmalig-JWT met `sub=userId, scope=set-password, exp=7d`
- [ ] Verstuur email via `email.service.sendMagicLink(user, url)`
- [ ] `/set-password?token=...`: verify token → render wachtwoord-form → submit → `auth.api.updateUser` → redirect /app
- [ ] Token eenmalig: na gebruik markeer `users.invited_at_consumed`

**T6. Admin webhooks-pagina**
- [ ] `/admin/integrations/plugandpay/webhooks` toont laatste 100 events met: trigger_type, received_at, status (processed/error), replay-knop
- [ ] Replay: re-dispatched zelfde payload door handler (niet opnieuw P&P contacteren)
- [ ] Filter op trigger_type + status

**T7. Tests**
- [ ] Per handler: unit-test met gemockte deps + fixture payload
- [ ] Integration test: hit `/api/webhooks/plugandpay` met gesigned payload, verwacht DB-mutation
- [ ] Idempotency-test: zelfde event_id 2x → één mutation

### Integrations
- Externe: P&P Rules API (outbound registreren) + webhook (inbound ontvangen), Resend
- Intern: enrollment-module, email-module, audit-log, inbox

### Edge cases
- **Bekende, onbekende en aanname-trigger-types**: gebruik toch dispatch — onbekend → log + 200 (niet retryable)
- **Email bounce**: enrollment blijft staan, admin krijgt alert "klant kon niet bereikt worden" via inbox + email
- **Order.paid landt vóór webhook registreert**: niet mogelijk als we registreren vóór eerste publicatie; wel backfill via reconcile (PR 03d)
- **Klant betaalt met ander email dan bestaande user**: maak nieuwe user aan. In PR 17b merge-UI om later te koppelen.
- **Payload schema wijzigt** (P&P upgrade): zod-validation faalt hard → 500, alert. Beter dan silent-corrupt.
- **Concurrent same-event** (twee webhook-deliveries): unique constraint op `event_id` in `plugandpay_webhook_events` voorkomt duplicate inserts
- **Handler crasht mid-work**: `processed_at` blijft null → bij replay wordt het herzet. Mutaties moeten idempotent zijn (gebruik upsert/if-not-exists)

### Acceptance checklist
- [ ] Rule-registratie werkt: na knop-klik bestaan alle rules in P&P admin (manueel verifiëren)
- [ ] Test-webhook via curl met gesigned payload → DB-mutation zichtbaar
- [ ] Dezelfde payload 2x → één mutation, tweede call 200 idempotent
- [ ] Nieuwe user krijgt magic-link-email (Resend dashboard toont send)
- [ ] `/set-password` flow werkt → user kan daarna inloggen
- [ ] `/admin/integrations/plugandpay/webhooks` toont alle ontvangen events met status
- [ ] Replay-knop werkt en muteert niets extra als event al gelukt
- [ ] Unit-tests per handler ≥85% coverage
- [ ] §0 conventies inclusief §0.0 laag-discipline

### Mobile test (verplicht)
- [ ] Magic-link in email klikken op iPhone → `/set-password` rendert goed, wachtwoord-form werkt
- [ ] Webhooks-admin-pagina op 375×667: tabel → card-layout, replay-knop bereikbaar

---

## PR 03d — `feat/platform-03d-plugandpay-sync`

**Goal:** nightly reconcile-job + on-demand fetch voor admin-detail-views.

**Depends on:** PR 03b.

### Files created
```
platform/src/lib/plugandpay/
├── sync.ts                               # reconcileOrders, reconcileSubs, reconcileCustomers
└── sync-cron.ts                          # handler voor cron-trigger

platform/src/app/api/cron/plugandpay-reconcile/
└── route.ts                              # Vercel-cron-compatible endpoint

platform/src/app/admin/crm/[id]/
└── refresh-plugandpay-button.tsx         # on-demand refresh server-action
```

### Tasks

**T1. Reconcile logic**
- [ ] `reconcileOrders(since)`: fetch alle orders met `updated_at > since`, upsert in cache
- [ ] `reconcileSubs(since)`: idem
- [ ] `reconcileCustomers(since)`: idem
- [ ] Per reconcile: log aantal nieuwe/geüpdatet records

**T2. Cron-endpoint**
- [ ] `/api/cron/plugandpay-reconcile`: check `Authorization: Bearer ${CRON_SECRET}` header
- [ ] Draai `reconcileOrders(now - 48h)` + subs + customers
- [ ] Return JSON met counts
- [ ] Registreer in Vercel cron (later bij deploy) via `vercel.json`

**T3. On-demand fetch**
- [ ] Server action `refreshPlugAndPayForCustomer(customerId)`: fetch live van P&P → upsert cache → return fresh data
- [ ] Button-component die action aanroept met loading-state

**T4. Manual sync-knop**
- [ ] In `/admin/integrations/plugandpay`: "Force full sync" knop die reconcile zonder since-filter runt (voor initial seed)

### Edge cases
- Reconcile tijdens webhook-storm: idempotent upserts voorkomen conflicts
- Rate-limit tijdens force-full-sync: progressief fetchen, pauze tussen batches
- Cron-endpoint niet beschikbaar in development: toevoegen `npm run sync:local` script

### Acceptance checklist
- [ ] Force-full-sync populeert caches met seed-data uit P&P staging
- [ ] Nightly reconcile-route heeft cron-secret check
- [ ] On-demand refresh-knop werkt in CRM detail view (placeholder — echte detail in PR 17b)
- [ ] Logging zichtbaar via audit_log
- [ ] §0 conventies gehaald

---

## PR 03e — `feat/platform-03e-enrollment-gating`

**Goal:** middleware/guards die `/app/traject/[id]` blokkeert zonder actieve enrollment; payment-issue grace-flow; `/payment-needed` pagina.

**Depends on:** PR 03c.
**Unlocks:** veilig starten van client-surface (PR 04).

### Files created
```
platform/src/lib/auth/
└── enrollment-guard.ts                   # requireEnrollment(trajectId)

platform/src/app/app/traject/[id]/
├── layout.tsx                            # wraps met guard
└── page.tsx                              # placeholder (echte viewer in PR 04)

platform/src/app/payment-needed/
└── page.tsx                              # "Je abonnement heeft een probleem..."

platform/src/app/waiting-for-invite/
└── page.tsx                              # user met 0 rollen nog geen enrollment
```

### Tasks

**T1. Guard-helper**
- [ ] `requireEnrollment(trajectId, userId)` retourneert enrollment of gooit redirect:
  - Geen enrollment → 403
  - status `payment_issue` + grace_until < now → `/payment-needed?enrollment=...`
  - status `cancelled` + module is post-cancellation → 403
  - Anders → enrollment

**T2. Payment-needed pagina**
- [ ] Toont enrollment info, "update betaalmethode" knop → redirect naar P&P customer-portal URL
- [ ] Contact-knop → opent chat met coach

**T3. Waiting-for-invite pagina**
- [ ] Voor users zonder rollen/enrollments (bv. magic-link gedaan maar enrollment webhook nog niet binnen)
- [ ] Auto-refresh elke 30s

**T4. Middleware-extensie**
- [ ] Bestaande `middleware.ts` checkt rol; wanneer user `client` is zonder enrollments → `/waiting-for-invite`

### Edge cases
- Klant krijgt magic-link, webhook `order.paid` komt 10s later aan → user klikt eerder op link dan enrollment exists: `/waiting-for-invite` moet auto-refreshen
- Klant met meerdere trajecten: enrollment-guard werkt per trajectId, niet per user
- Admin bypassen gate? Nee — gate staat op `/app`, admin gebruikt eigen preview in `/admin/trajecten/[id]/preview` (later)

### Acceptance checklist
- [ ] Test: nieuwe user zonder enrollment naar `/app/traject/x` → 403
- [ ] Test: enrollment payment_issue met grace verlopen → redirect naar `/payment-needed`
- [ ] Test: happy path → ziet placeholder
- [ ] Unit-tests dekken de guard-logic
- [ ] §0 conventies gehaald

### Mobile test (verplicht)
- [ ] `/payment-needed` op mobile: knoppen bereikbaar, CTA duidelijk
- [ ] `/waiting-for-invite` toont spinner, niet jarring

---

# §4 Phase M2 — Client surface

Doel: client kan inloggen en zijn traject doorlopen — modules, opdrachten, habits, chat met coach, afspraken.

---

## PR 04 — `feat/platform-04-trajecten-viewer`

**Goal:** `/app` client-home + `/app/traject/[id]` met module-lijst + `/app/modules/[moduleId]` read-only-viewer.

**Depends on:** PR 03e.

### Files created
```
platform/src/lib/db/schema/
├── modules.ts                            # modules table
├── opdrachten.ts                         # opdrachten table (structuur, niet logic)
└── habits.ts                             # habits table (structuur)

platform/src/app/app/
├── page.tsx                              # home: "Jouw trajecten"
├── traject/[id]/page.tsx                 # module-lijst met progress bars
├── modules/[id]/page.tsx                 # module-detail met body + video + "volgende"
└── profiel/page.tsx                      # minimal profiel (foto, naam, timezone)

platform/src/components/client/
├── traject-card.tsx
├── module-list.tsx
├── module-content.tsx                    # MDX-renderer
└── onboarding-wizard.tsx                 # 3 stappen: foto / timezone / intake-form
```

### Tasks

**T1. Schema**
- [ ] `modules`: id, traject_id, order, title, body (markdown text), video_url, duration_min
- [ ] `opdrachten`: minimal (PR 05 vult logic)
- [ ] `habits`: minimal (PR 06 vult logic)
- [ ] `module_progress` tabel: id, enrollment_id, module_id, started_at, completed_at, time_spent_sec

**T2. Client home `/app`**
- [ ] Server-fetch user's enrollments
- [ ] `<TrajectCard>` per enrollment: titel, progress %, "doorgaan" knop
- [ ] Empty-state: "Reza heeft nog geen traject toegewezen"

**T3. Traject-detail `/app/traject/[id]`**
- [ ] Call `requireEnrollment(id, user.id)`
- [ ] Module-lijst met status: niet-gestart / bezig / voltooid
- [ ] Vervolg-knop op eerstvolgende incompleete module

**T4. Module-viewer `/app/modules/[id]`**
- [ ] Read body als MDX-content (server-render via `@next/mdx` of `react-markdown`)
- [ ] Video inline (HTML5 `<video>` met controls)
- [ ] "Markeer als voltooid" knop → update `module_progress.completed_at`
- [ ] "Volgende module" navigatie

**T5. Onboarding wizard**
- [ ] Bij eerste login na magic-link → 3 stappen in full-screen Sheet
- [ ] Stap 1: welcome + foto upload
- [ ] Stap 2: timezone auto-detect + bevestig
- [ ] Stap 3: intake-formulier (PR 09 levert de echte forms; hier hardcoded placeholder)
- [ ] Flag `user.onboarded_at` na voltooiing

### Edge cases
- Modules uit order: sort op `order` integer
- Video-URL null → geen player, alleen tekst
- Lange MDX op mobile: typography-plugin voor prose, max-w-prose
- Onboarding wizard afgebroken: bij volgend bezoek weer tonen (state in DB, niet localStorage)

### Acceptance checklist
- [ ] Demo-traject aanmaken in seed met 3 modules
- [ ] Client-user ziet `/app` home met traject-kaart
- [ ] Klik → module-lijst → module-viewer
- [ ] Markeer voltooid werkt; progress op home updatet
- [ ] Onboarding wizard verschijnt bij eerste bezoek, niet erna
- [ ] §0 conventies gehaald

### Mobile test (verplicht)
- [ ] Module-viewer op 375px: video schaalt, tekst leesbaar, navigatie-knoppen tap-baar
- [ ] Onboarding-wizard op mobile is full-screen sheet, niet afgeknepen

---

## PR 05 — `feat/platform-05-opdrachten`

**Goal:** opdracht-submissie (tekst + upload) binnen module, coach-feedback in read-only voor client.

**Depends on:** PR 04.

### Files / tasks (samengevat)

**Files:**
- `lib/db/schema/opdrachten.ts` — full schema (type enum: text/upload/form)
- `app/app/modules/[id]/opdracht/[opdrachtId]/page.tsx` — submission form
- `components/client/opdracht-form.tsx`
- `lib/storage/upload.ts` — Supabase Storage client

**Tasks:**
1. Schema: opdrachten + `opdracht_responses (id, enrollment_id, opdracht_id, content_text, file_url, submitted_at, coach_feedback, feedback_at)`
2. Upload-flow: presigned URL via Supabase Storage, client-side multipart
3. Submission-form: tekst (textarea) of file-input per type
4. Feedback-view: coach-feedback inline met datum
5. E-mail notificatie aan coach bij submit (Resend)

**Edge cases:** file-size-limit (10MB), allowed types (pdf/doc/mp3/mp4/jpg/png), virus-scan (skip in v1, flag v2)

**Acceptance:** client submit, zichtbaar, coach-feedback rendert zodra gezet (nog geen UI voor coach — komt in PR 11)

**Mobile test:** upload-flow werkt op mobile Safari/Chrome; keyboard pusht submit-knop niet weg dankzij StickyFormFooter

---

## PR 06 — `feat/platform-06-habits`

**Goal:** habit-tracker voor client: dagelijkse check-off + streak-view; coach schrijft habits voor via trajectbouwer (PR 12).

**Depends on:** PR 04.

**Files:**
- `lib/db/schema/habits.ts` full (habits + habit_checkins)
- `app/app/habits/page.tsx` — vandaag + week-overzicht
- `components/client/habit-card.tsx` — met toggle
- `components/client/streak-badge.tsx`

**Tasks:**
1. Schema volledig
2. Server-fetch: actieve habits voor deze enrollment
3. Vandaag-view: grote knoppen per habit (tap = check-off)
4. Week-view: 7-dag grid met gedane/gemiste dagen
5. Streak-logica: aantal opeenvolgende dagen met alle habits done
6. Optional note per check-in

**Edge cases:** timezone-based "vandaag" (gebruik user.timezone), habit die pas morgen actief wordt, retroactive check-off alleen gisteren toestaan

**Acceptance:** client kan tappen, streak updatet, week-view klopt over timezone-grens

**Mobile test:** tap-targets groot genoeg, check-off voelt direct (optimistic update)

---

## PR 07 — `feat/platform-07-chat`

**Goal:** real-time chat tussen client en coach via Supabase Realtime.

**Depends on:** PR 04.

**Files:**
- `lib/db/schema/chat.ts` — chat_threads, chat_messages
- `lib/realtime/chat.ts` — Supabase channel subscription
- `app/app/chat/page.tsx` — client zijde
- `app/coach/cliënten/[id]/chat.tsx` — coach component (gebruikt in PR 11)
- `components/chat/message-list.tsx`, `message-input.tsx`

**Tasks:**
1. Schema + realtime publication op `chat_messages`
2. Auto-create thread bij eerste gesprek (coach ↔ client)
3. Subscribe-hook voor nieuwe messages + optimistic send
4. Typing-indicator (presence channel)
5. Attachments via Supabase Storage (image + file)
6. Ongelezen-count in bottom-nav badge

**Edge cases:** user offline → server persist; message editen (niet in v1); bericht verwijderen (niet in v1); veel oude messages → paginate

**Acceptance:** twee browsers (client + coach) sturen realtime; badge updatet; werkt na refresh

**Mobile test:** keyboard pusht input omhoog (iOS Safari), nieuwe messages auto-scroll, attachments via camera-roll mogelijk

---

## PR 08 — `feat/platform-08-afspraken`

**Goal:** client ziet komende afspraken en boekt binnen coach-beschikbaarheid. Google Calendar sync optioneel (fallback: platform-only).

**Depends on:** PR 04.

**Files:**
- `lib/db/schema/afspraken.ts` — afspraken + availability_slots (coach-side in PR 14)
- `app/app/afspraken/page.tsx` — lijst + boek-dialog
- `components/afspraken/booking-dialog.tsx`
- `lib/gcal/client.ts` — Google Calendar API (optioneel, voor PR 14)

**Tasks:**
1. Schema + status-enum (scheduled/done/cancelled/no_show)
2. Fetch coach-beschikbaarheid (uit PR 14 availability_slots, hier hardcode placeholder)
3. Boek-dialog: kies datum uit beschikbare slots → bevestig
4. E-mail reminder 24u vooraf (cron)
5. Online vs fysiek: locatie-veld, optioneel link (zoom/jitsi)
6. Cancel-flow: tot 24u vooraf

**Edge cases:** timezone verschillen (toon in user-tz), dubbele boeking-preventie (DB constraint), no-show handling

**Acceptance:** client boekt, coach ziet, reminder werkt

**Mobile test:** datum/tijd-picker bruikbaar op mobile (native picker ideaal)

---

## PR 09 — `feat/platform-09-formulieren-client`

**Goal:** formulieren renderen + antwoorden opslaan (builder komt in PR 13).

**Depends on:** PR 04.

**Files:**
- `lib/db/schema/formulieren.ts` — formulieren + formulier_antwoorden
- `app/app/formulieren/[id]/page.tsx` — render form
- `components/forms/form-renderer.tsx` — reads schema_json, rendert velden
- `lib/forms/schema.ts` — zod schema voor form-schema-schema

**Tasks:**
1. Schema voor form-schema (JSON: sections, fields, field-types)
2. Renderer voor types: text, textarea, radio, checkbox, select, scale (1-10), date
3. Validatie per field-type
4. Auto-save draft elke 10s
5. Submit → opslaan met `submitted_at`
6. Read-only view van eigen antwoorden terug

**Edge cases:** form met conditional logic (v2), form gewijzigd na submit (versie-ID lock), lange forms met auto-scroll naar error

**Acceptance:** intake-form met 5 vragen kan ingevuld en gesubmit worden; response zichtbaar voor coach in PR 11

**Mobile test:** lange forms op mobile met sticky submit; keyboard-vriendelijk

---

# §5 Phase M3 — Coach surface

Doel: Reza runt z'n praktijk volledig vanuit `/coach`. Helikopter → cliënten → traject-bouwen → sessies plannen → rapportage zien.

---

## PR 10 — `feat/platform-10-coach-overview`

**Goal:** `/coach` helikopter-dashboard met alle cliënten, status, red flags.

**Depends on:** PR 03.

**Files:**
- `app/coach/page.tsx` — grid van client-cards
- `components/coach/client-card.tsx` — avatar, naam, traject-progress, laatste activiteit, alerts
- `lib/coach/queries.ts` — aggregerende query's

**Tasks:**
1. Query: alle enrollments waar coach = session.user
2. Per client: laatste login, progress %, unread chat, payment_issue-flag
3. Filter: alle / actief / attention-needed
4. Sort: recent actief, problemen bovenaan
5. Empty-state + welcome

**Edge cases:** coach met 0 cliënten, coach met 50+ (pagineer boven 20)

**Acceptance:** Reza logt in, ziet ALLE z'n cliënten in één scherm met relevante signalen

**Mobile test:** cards-grid → 1 col op mobile; attention-needed filter werkt met chips

---

## PR 11 — `feat/platform-11-client-detail`

**Goal:** `/coach/cliënten/[id]` — diep cliënt-profiel: progress, chat, notities, opdracht-feedback.

**Depends on:** PR 10 + PR 07 (chat) + PR 05 (opdrachten).

**Files:**
- `app/coach/cliënten/[id]/page.tsx` — tabs: Overzicht / Progress / Chat / Notities / Opdrachten / Habits
- `components/coach/notitie-editor.tsx`
- `components/coach/opdracht-feedback.tsx`
- `lib/db/schema/notities.ts` — full schema

**Tasks:**
1. Schema notities (coach-only)
2. Tabs-layout
3. Overzicht-tab: summary + shortcuts
4. Progress-tab: module-voor-module met tijden
5. Chat-tab: embedded chat-component uit PR 07
6. Notities-tab: rich-text editor (tiptap), opgeslagen per cliënt, optioneel per module
7. Opdrachten-tab: lijst submissions, click → feedback-form → stuur naar client

**Edge cases:** notitie mid-edit wanneer client iets wijzigt (optimistic concurrent edits, last-write-wins OK v1); privé-notities nooit via API lekken

**Acceptance:** Reza kan voor één client alle tabs doorlopen, notitie maken, feedback geven

**Mobile test:** tabs scrollbaar horizontaal; rich-text editor werkt op mobile; feedback-form sticky footer

---

## PR 12 — `feat/platform-12-trajectbouwer`

**Goal:** drag-drop trajectbouwer met modules, opdrachten, habits, videos.

**Depends on:** PR 04 + 05 + 06.

**Files:**
- `app/coach/trajecten/page.tsx` — library
- `app/coach/trajecten/[id]/bouwer/page.tsx` — editor
- `components/coach/bouwer/` — module-card, opdracht-editor, habit-editor, draggable-list
- `lib/mdx/editor.ts` — MDX rich-text editor (tiptap + MDX export)

**Tasks:**
1. Library: lijst trajecten + "nieuw traject" + duplicate-from-template
2. Bouwer-layout: links canvas (modules), rechts inspector
3. Drag-drop module-reordering via `@dnd-kit`
4. Per module: titel, video-upload, MDX-body-editor, opdrachten-sublist, habits-sublist
5. Publiceren-flow: "draft" → "published" (toont dialog: "zeker? Klanten kunnen dan kopen")
6. Koppeling met P&P-product via link-UI (uit PR 03b)

**Edge cases:** traject al verkocht aan klanten → publicatie-wijzigingen versioneren (of blokkeer structurele edits; v1: blokkeer)

**Acceptance:** Reza bouwt een compleet 4-modules-traject, publiceert, koppelt aan P&P-product

**Mobile test:** editor is primair desktop-feature maar moet niet breken op tablet (768-1023); bij mobile: read-only view met hint "bewerk op desktop"

---

## PR 13 — `feat/platform-13-formulieren-builder`

**Goal:** form-schema editor voor coach (drag-drop field-builder).

**Depends on:** PR 09.

**Files:**
- `app/coach/formulieren/page.tsx` — library
- `app/coach/formulieren/[id]/builder/page.tsx`
- `components/coach/forms/field-palette.tsx`, `field-inspector.tsx`

**Tasks:**
1. Field-types palette
2. Drag-to-add op canvas
3. Per-field configuratie (label, required, options bij radio/select, min/max bij scale)
4. Preview-toggle (ziet hoe client het ziet via PR 09 renderer)
5. Save als template, koppel aan traject

**Acceptance:** Reza bouwt 10-vraag intake-formulier, client ziet het in PR 09 renderer

---

## PR 14 — `feat/platform-14-sessies`

**Goal:** coach definieert beschikbaarheid + syncs met Google Calendar.

**Depends on:** PR 08.

**Files:**
- `lib/db/schema/availability.ts` — availability_slots
- `app/coach/agenda/page.tsx`
- `components/coach/availability-editor.tsx`
- `lib/gcal/sync.ts`

**Tasks:**
1. Schema slots (coach_id, weekday, from_time, to_time) + exceptions
2. Weekview waarop Reza uren aanklikt (beschikbaar/niet)
3. Google OAuth-flow (eenmalig, per coach)
4. Sync: nieuwe afspraak → event in GCal; cancel → event verwijderen
5. Import: external GCal events blokkeren automatisch slots

**Edge cases:** OAuth-token expiry → refresh-flow, GCal-event verwijderd buiten platform → orphaned afspraak

**Acceptance:** Reza stelt beschikbaarheid in, client ziet alleen vrije slots, booking landt in GCal

**Mobile test:** weekview swipe-bar, GCal-auth-popup werkt op mobile (externe browser OK)

---

## PR 15 — `feat/platform-15-rapportage`

**Goal:** rapportages voor coach — engagement, completion, attention-needed.

**Depends on:** PR 10.

**Files:**
- `app/coach/rapportage/page.tsx`
- `components/charts/` — recharts-wrappers

**Tasks:**
1. KPI-cards: actieve cliënten, voltooide modules/week, no-shows
2. Engagement-grafiek: activity-heatmap per client
3. Attention-list: cliënten zonder activiteit in 14d
4. Export CSV (voor later reporting)

**Acceptance:** Reza opent rapportage, ziet z'n praktijk in één oogopslag

**Mobile test:** grafieken hergebruiken `<ResponsiveTable>` waar mogelijk; charts swipable

---

# §6 Phase M4 — Admin surface

Doel: Chris en Reza runnen platform zelf. Users, CRM met betalingen, kanban-met-Claude, inbox, pages-explorer.

---

## PR 16 — `feat/platform-16-admin-users`

**Goal:** `/admin/users` user-lijst + rol-edit + last-login kolom + "invite user" flow.

**Depends on:** PR 03.

**Files:**
- `app/admin/users/page.tsx` — table
- `app/admin/users/[id]/page.tsx` — detail
- `components/admin/user-row.tsx`
- `lib/auth/invite.ts` — invite-flow (email + magic-link)

**Tasks:**
1. Table met search, filter op rol
2. Kolommen: naam, email, rollen (chips), laatste login (uit user_session_events), status
3. Detail-pagina: bewerk rollen, reset password, deactivate
4. Invite-flow: admin voert email + rol in → magic-link email

**Edge cases:** admin probeert eigen admin-rol te verwijderen → blokkeren (need-1-admin rule)

**Acceptance:** Chris ziet alle users, kan Reza's rollen bewerken, kan nieuwe coach inviten

**Mobile test:** table → `<ResponsiveTable>` card-layout; acties via long-press menu of tap-expand

---

## PR 17 — `feat/platform-17-crm`

**Goal:** CRM core — contacts, companies, activities.

**Depends on:** PR 16.

**Files:**
- `lib/db/schema/crm.ts` — contacts, companies, activities, tags
- `app/admin/crm/contacts/page.tsx`, `[id]/page.tsx`
- `app/admin/crm/companies/page.tsx`, `[id]/page.tsx`
- `components/admin/crm/`

**Tasks:**
1. Schema
2. Contacts lijst + detail met activity-timeline
3. Companies idem + link naar contacts
4. Activity-types: email, call, meeting, note
5. Tags + filter
6. Full-text search (Postgres tsvector) over contacts

**Acceptance:** Chris/Reza kunnen leads beheren, activiteiten loggen

**Mobile test:** lists responsive; new-activity form sticky footer

---

## PR 17b — `feat/platform-17b-crm-payments`

**Goal:** verrijk CRM met Plug-and-Pay data per klant — orders, subscription, betaalproblemen, "contact klant"-knop.

**Depends on:** PR 17 + PR 03d.

**Files:**
- `app/admin/crm/contacts/[id]/payments-tab.tsx`
- `components/admin/crm/payment-timeline.tsx`
- `components/admin/crm/contact-klant-button.tsx`

**Tasks:**
1. Join query: contact.email → `plugandpay_customers` → orders + subscriptions
2. Payments-tab in contact-detail: order-lijst, subscription-status, invoice-links
3. Alerts: payment_issue visible met datum + grace
4. "Contact klant"-knop → opent chat OF email-template voor betalingskwestie
5. "Refresh from P&P"-knop (uit PR 03d on-demand fetch)
6. Koppel knop aan user (als email match → show link "bekijk user")

**Edge cases:** klant met zelfde email als ander contact → merge-UI (handmatig, admin action)

**Acceptance:** Chris opent contact → payments-tab → ziet alles wat klant heeft betaald, failed subs, grace-status, kan contact leggen

**Mobile test:** tab-navigatie werkt, timeline leesbaar

---

## PR 17c — `feat/platform-17c-payments-dashboard`

**Goal:** `/admin/payments` — orders-lijst, failed-payments, MRR-graph.

**Depends on:** PR 17b.

**Files:**
- `app/admin/payments/page.tsx`
- `components/admin/payments/mrr-chart.tsx`
- `components/admin/payments/failed-payments-table.tsx`

**Tasks:**
1. KPI-cards: MRR, churn%, actieve subs, failed this month
2. MRR-graph (maand over maand)
3. Failed-payments tabel met dedicated fix-flow
4. Orders-lijst met filter/search

**Acceptance:** Chris ziet commerciële gezondheid van platform in één scherm

**Mobile test:** grafieken schalen, tabel → cards

---

## PR 18 — `feat/platform-18-projects`

**Goal:** interne project-tracking met milestones.

**Depends on:** PR 16.

**Files:** `lib/db/schema/projects.ts`, `app/admin/projects/*`

**Tasks:**
1. Schema projects + milestones + project_members
2. Grid-view
3. Detail met milestone-timeline
4. Link naar CRM companies (client-projecten)
5. Link naar kanban-board (PR 19)

**Acceptance:** interne projecten beheerbaar

---

## PR 19 — `feat/platform-19-kanban-github` ⭐

**Goal:** kanban-board dat two-way synct met GitHub Issues. Kaarten met label `claude` zijn voor Claude om op te werken.

**Depends on:** PR 16.

**Files:**
- `lib/db/schema/kanban.ts` — boards, columns, cards (cache)
- `lib/github/octokit.ts` — client
- `lib/github/sync.ts` — two-way sync logic
- `app/api/webhooks/github/route.ts`
- `app/admin/kanban/page.tsx`, `[boardId]/page.tsx`
- `components/admin/kanban/board.tsx`, `card.tsx`, `card-dialog.tsx`

**Tasks:**
1. Schema + initial sync op board-creatie
2. Octokit met app-level PAT
3. Board-UI: columns via `@dnd-kit`; drag card → PATCH label
4. Card-dialog: titel, body (markdown render), comments (read-only v1)
5. Webhook-endpoint: update cache on `issues.*` events
6. "New card" → `POST /repos/:owner/:repo/issues` met kolom-label
7. Polling-fallback (elke 60s) bij webhook-failure
8. Speciale "Claude-werk" kolom: label `claude` + copyable CLI-hint

**Edge cases:** GitHub-rate-limit (4k calls/hr) → efficiënte fetches; webhook retry op 5xx; offline user drag → queue local, sync on reconnect

**Acceptance:** kaart verplaatsen → GH label wijzigt in <2s; nieuwe GH issue → board update via webhook

**Mobile test:** drag-drop via long-press → move; card-dialog bottom-sheet op mobile

---

## PR 20 — `feat/platform-20-inbox`

**Goal:** Linear-style unified activity feed (GH + CRM + P&P + platform-events).

**Depends on:** PR 17 + PR 19.

**Files:**
- `lib/db/schema/audit.ts` — audit_log (al deels in eerdere PRs, full schema hier)
- `app/admin/inbox/page.tsx`
- `components/admin/inbox/feed.tsx`, `item.tsx`

**Tasks:**
1. Schema audit_log (generic: actor, action, target_type, target_id, payload_json, created_at)
2. Alle eerdere PRs refactoren: events-schrijvers consolideren naar één helper
3. Feed-UI met filters (Alles / GH / CRM / P&P / Platform)
4. Mark-as-read per user
5. Unread-badge in bottom-nav + topbar

**Acceptance:** elke actie (nieuwe issue, CRM-contact, P&P-order-paid, cliënt voltooit module) verschijnt in feed

**Mobile test:** feed virtualized, swipe-to-mark-read

---

## PR 21 — `feat/platform-21-pages-explorer`

**Goal:** read-only boom van `/web` pagina's + preview-iframe.

**Depends on:** PR 16.

**Files:**
- `scripts/generate-page-manifest.ts`
- `platform/src/generated/pages-manifest.json`
- `app/admin/pages/page.tsx` + `[...slug]/page.tsx`
- `components/admin/pages/preview-iframe.tsx`

**Tasks:**
1. Script scant `web/src/app/**/page.tsx`, extraheert route, metadata (title), laatste git-mutatie
2. Output committed JSON
3. Boom-UI in `/admin/pages`
4. Detail: metadata, preview-iframe met desktop/tablet/mobile toggle
5. "Regenerate manifest"-knop → re-runt script server-side + commit in-memory

**Acceptance:** alle public pages zichtbaar, preview werkt

**Mobile test:** boom → accordion op mobile; preview aanpasbare viewport-simulatie

---

## PR 22 — `feat/platform-22-integrations`

**Goal:** één `/admin/integrations` landing met alle integraties (P&P, GH, GCal, Resend) en hun status.

**Depends on:** PR 03b, 14, 19, en Resend-config.

**Files:**
- `app/admin/integrations/page.tsx` — index
- `app/admin/integrations/[slug]/page.tsx` — per-integratie detail (enkele zijn er al uit eerdere PRs)

**Tasks:**
1. Index-grid met integratie-cards: naam, logo, status, "configure" knop
2. Per-integratie detail: connection-status, last-sync, logs, settings

**Acceptance:** één overzichtelijke hub voor alle integraties

---

## PR 22b — `feat/platform-22b-public-pricing-links`

**Goal:** knoppen op `www.win.nl` linken naar P&P-checkout voor specifieke producten.

**Depends on:** PR 03b (P&P producten gekoppeld aan trajecten).

**Files modified:**
- `web/src/app/aanbod/page.tsx` — pricing-sectie
- `web/src/app/coaching/page.tsx` — CTA's
- `web/src/app/mentorschap/page.tsx` — idem
- `web/src/config/products.ts` — centraal beheer van P&P-checkout-URLs

**Tasks:**
1. Config-file met mapping `{ [productSlug]: { title, price, plugandpayCheckoutUrl } }`
2. Replace existing contact-CTA's door "Koop dit traject" → P&P URL
3. UTM-parameters toevoegen voor tracking
4. Fallback: als config ontbreekt, behoud contact-CTA

**Acceptance:** klik op "koop" op `www.win.nl` → landing in P&P checkout met juiste product voorgeselecteerd

**Mobile test:** CTA-knoppen gold, voldoende tap-target; redirect naar P&P werkt op mobile

---

# §7 Cross-cutting gates

Elke PR door deze gates voordat merge naar `main`.

### Gate A — QA (vóór code-review)
- [ ] `npm run lint` passeert
- [ ] `npm run build` passeert
- [ ] `npm run test` (unit) passeert met >80% coverage op nieuwe code
- [ ] Playwright E2E (mobile + desktop) passeert
- [ ] Handmatig getest op iPhone SE viewport
- [ ] Handmatig getest op 1440px desktop
- [ ] §0 conventies opnieuw nagelopen

### Gate B — Review (tijdens review)
- [ ] PR-body verwijst naar PR-nummer in dit document
- [ ] Screenshots toegevoegd (mobile + desktop)
- [ ] Changelog-note toegevoegd
- [ ] Breaking changes expliciet gedocumenteerd

### Gate C — Security
- [ ] Geen secrets in git history
- [ ] Server actions checken sessie én rol
- [ ] SQL-injection: alle raw SQL is via Drizzle of parameterized
- [ ] XSS: user-content rendert nooit als HTML zonder sanitize
- [ ] CSRF: BetterAuth handled, maar eigen server-actions met state-change checken `origin`

### Gate D — Deploy-readiness (bij M-milestones)
- [ ] Env-vars voor prod gedocumenteerd
- [ ] DB-migratie draait op staging
- [ ] Rollback-plan: vorige versie-tag + db-migration-rollback
- [ ] Monitoring: `/api/health` endpoint + Vercel/Sentry hook

### Gate E — Documentatie
- [ ] Indien nieuw concept: een korte note in `docs/` of memory
- [ ] README updates als dev-setup wijzigt
- [ ] Dit playbook updaten als PR significant afwijkt van plan

---

# Appendix A — Plug and Pay API Reference

Bron: officiële `plug-and-pay/sdk-php` v1.2+ sources (geconfirmeerd in `/tmp/pap-sdk` clone, 2026-04-24) + Context7 docs (`/plug-and-pay/sdk-php`) + SDK wiki. Alles hier is geverifieerd, niet verzonnen. Waar ik iets niet 100% zeker weet, staat **[TE VERIFIËREN]**.

## A.1 Base URLs & versioning

| Scope | URL |
|-------|-----|
| API (productie) | `https://api.plugandpay.com` |
| Admin-UI + OAuth-authorize | `https://admin.plugandpay.com` |
| API-versie | `/v2/*` (alle resource-paden starten met `/v2/`) |
| OAuth token endpoint | `/oauth/token` (niet onder `/v2/`) |
| OAuth revoke | `/v2/auth/oauth/revoke` |
| Content-type | `application/json` |
| Accept | `application/json` |
| HTTP verbs | GET, POST, PATCH, PUT, DELETE |
| SDK default timeout | 25s |

## A.2 Authenticatie — OAuth 2.0 Authorization Code + PKCE

P&P is multi-tenant. Eén installatie (= één OAuth app) kan op meerdere tenants verbinden. Elke `access_token` is scoped aan één `tenant_id`.

### Stap 1 — Authorize URL (redirect user)
```
GET https://admin.plugandpay.com/oauth/authorize
  ?client_id={CLIENT_ID}
  &redirect_uri={CALLBACK_URL}
  &response_type=code
  &scope=
  &state={CSRF_TOKEN}
  &code_challenge={BASE64URL(SHA256(code_verifier))}
  &code_challenge_method=S256
  &step=select_tenant
```

### Stap 2 — Callback vangt code + state
```
GET {CALLBACK_URL}?code=...&state=...&tenant_id=...
```
Valideer `state` tegen opgeslagen CSRF-cookie; decodeer `tenant_id`.

### Stap 3 — Exchange code
```
POST https://api.plugandpay.com/oauth/token
Content-Type: application/json
{
  "grant_type": "authorization_code",
  "client_id": {CLIENT_ID},
  "client_secret": "{CLIENT_SECRET}",
  "redirect_uri": "{CALLBACK_URL}",
  "code_verifier": "{ORIGINAL_CODE_VERIFIER}",
  "code": "{CODE_FROM_CALLBACK}",
  "tenant_id": {TENANT_ID}
}

→ 200 { "access_token": "...", "refresh_token": "...", "expires_in": 3600 }
```

### Stap 4 — Refresh vóór expiry
```
POST https://api.plugandpay.com/oauth/token
{
  "grant_type": "refresh_token",
  "client_id": {CLIENT_ID},
  "client_secret": "{CLIENT_SECRET}",
  "refresh_token": "{REFRESH_TOKEN}",
  "tenant_id": {TENANT_ID}
}
```

### Stap 5 — Revoke (bij disconnect)
```
POST https://api.plugandpay.com/v2/auth/oauth/revoke
Authorization: Bearer {ACCESS_TOKEN}
```

### Request headers bij elke API-call
```
Authorization: Bearer {ACCESS_TOKEN}
Accept: application/json
Content-Type: application/json  # bij body
X-Request-Id: wininstituut-{uuid}  # optioneel maar aanbevolen voor tracing
```

## A.3 Endpoint map

| Resource | Base path | Verbs | SDK service |
|----------|-----------|-------|-------------|
| Orders | `/v2/orders` | GET list, GET `/{id}`, POST, PATCH `/{id}`, DELETE `/{id}` | `OrderService` |
| Order Payments | `/v2/orders/{id}/payments` | GET, POST | `OrderPaymentService` |
| Subscriptions | `/v2/subscriptions` | list + CRUD op `/{id}` | `SubscriptionService` |
| Products | `/v2/products` | list + CRUD | `ProductService` |
| Checkouts | `/v2/checkouts` | list + CRUD | `CheckoutService` |
| Rules (= webhook-registratie) | `/v2/rules` | list + CRUD | `RuleService` |
| Tax Rates | `/v2/tax-rates` | list + CRUD | `TaxRateService` |
| Affiliate Sellers | `/v2/affiliate-sellers` | list + CRUD | `AffiliateSellerService` |
| Memberships Settings | `/v2/memberships-settings` | list + CRUD | `MembershipsSettingService` |
| Portal Settings | `/v2/portal-settings` | GET, PATCH | `PortalSettingService` |
| Tenant | `/v2/tenant` | GET | `TenantService` |

## A.4 Enums — complete waardenlijsten

Alle waarden zijn **string** tenzij anders vermeld. Kopieer exact — dit zijn de wire-values.

### Order-gerelateerd
```typescript
// Source: src/Enum/Mode.php
enum Mode { TEST='test', LIVE='live' }

// Source: src/Enum/Source.php
enum Source {
  ADMIN='admin', API='api', CHECKOUT='checkout', IMPORT='import',
  RECURRING='recurring', UPGRADE='upgrade', UPSELL='upsell', UNKNOWN='unknown'
}

// Source: src/Enum/InvoiceStatus.php
enum InvoiceStatus { FINAL='final', CONCEPT='concept' }

// Source: src/Enum/OrderIncludes.php — query-param ?include=
enum OrderIncludes {
  BILLING='billing', COMMENTS='comments', DISCOUNTS='discounts',
  ITEMS='items', PAYMENT='payment', TAGS='tags', TAXES='taxes'
}

// Source: src/Enum/OrderSortType.php  [TE VERIFIËREN complete lijst]
// Uit Context7 bekend: 'paid_at'
```

### Subscription-gerelateerd
```typescript
// Source: src/Enum/SubscriptionStatus.php ← belangrijk voor enrollment-logica
enum SubscriptionStatus {
  ACTIVE='active',
  CANCELLED='cancelled',
  ENDED='ended',
  INACTIVE='inactive'
}

// Source: src/Enum/SubscriptionIncludes.php
enum SubscriptionIncludes {
  BILLING='billing', META='meta', PRICING='pricing',
  PRODUCT='product', TAGS='tags', TRIAL='trial'
}

// Source: src/Enum/Interval.php
enum Interval { MONTHLY='monthly', QUARTERLY='quarterly', YEARLY='yearly' }

// Source: src/Enum/PlanCycle.php
enum PlanCycle { MONTHLY='monthly', YEARLY='yearly' }
```

### Payment-gerelateerd
```typescript
// Source: src/Enum/PaymentStatus.php
enum PaymentStatus {
  CREDIT_INVOICE='credit_invoice',
  CREDITED='credited',
  OPEN='open',
  PAID='paid',
  PROCESSING='processing',
  REVERSED='reversed'
}

// Source: src/Enum/PaymentMethod.php
enum PaymentMethod {
  APPLEPAY='applepay', BANCONTACT='bancontact', BANKTRANSFER='banktransfer',
  BELFIUS='belfius', CREDITCARD='creditcard', DIRECTDEBIT='directdebit',
  EPS='eps', GIFTCARD='giftcard', GIROPAY='giropay', IBAN='iban',
  IDEAL='ideal', IN3='in3', INGHOMEPAY='inghomepay', KBC='kbc',
  KLARNAPAYLATER='klarnapaylater', KLARNAPAYNOW='klarnapaynow',
  KLARNASLICEIT='klarnasliceit', P24='przelewy24', PAYPAL='paypal',
  PAYSAFECARD='paysafecard', SOFORT='sofort'
}

// Source: src/Enum/PaymentProvider.php
enum PaymentProvider { MOLLIE='mollie', STRIPE='stripe' }

// Source: src/Enum/PaymentType.php
enum PaymentType { MAIL='mail', MANDATE='mandate', MANUAL='manual', UNKNOWN='unknown' }
```

### Product-gerelateerd
```typescript
// Source: src/Enum/ContractType.php
enum ContractType { SUBSCRIPTION='subscription', INSTALLMENTS='installments', ONE_OFF='one_off' }

// Source: src/Enum/ProductIncludes.php  [TE VERIFIËREN complete lijst]
// Bekend uit Context7: 'pricing', 'tax_rates'

// Source: src/Enum/ProductSortType.php  [TE VERIFIËREN]
// Bekend uit Context7: 'active_subscriptions'

// Source: src/Enum/ItemType.php
enum ItemType {
  GIFT='gift', ONE_CLICK_UPSELL='one-click-upsell', ORDER_BUMP='order-bump',
  STANDARD='standard', UPSELL='upsell', DOWNSELL='downsell'
}
```

### Checkout-gerelateerd
```typescript
// Source: src/Enum/CheckoutStatus.php
enum CheckoutStatus { DELETED='deleted', INACTIVE='inactive', ACTIVE='active', EXPIRED='expired', ALL='all' }
```

### Affiliate / Discount
```typescript
// Source: src/Enum/DiscountType.php
enum DiscountType { PROMOTION='promotion', SALE='sale', TIER='tier' }
```

### Tax / Locale / Currency
```typescript
// Source: src/Enum/TaxExempt.php  [TE VERIFIËREN waarden]
// Source: src/Enum/Locale.php
enum Locale { EN='en', NL='nl' }
// Source: src/Enum/CurrencyCodeIso.php
enum CurrencyCodeIso { EUR='EUR' }  // alleen EUR op dit moment
// Source: src/Enum/CountryCode.php  — ISO-3166 codes (NL, BE, DE, ...)
```

### Common
```typescript
// Source: src/Enum/Direction.php
enum Direction { ASC='asc', DESC='desc' }
```

## A.5 Kern-entiteiten — velden (uit geverifieerde SDK-source)

### Order
```typescript
type Order = {
  id: number
  reference: string              // human-readable order-nummer
  mode: Mode                     // test | live
  source: Source                 // hoe de order is aangemaakt
  amount: number                 // excl. btw
  amountWithTax: number          // incl. btw
  invoiceNumber: string | null
  invoiceStatus: InvoiceStatus   // final | concept
  first: boolean                 // is dit klant's eerste order?
  hidden: boolean
  tags: string[]                 // include=tags
  comments: Comment[]            // include=comments
  items: Item[]                  // include=items
  billing: OrderBilling          // include=billing — bevat contact + address
  payment: Payment               // include=payment
  taxes: Tax[]                   // include=taxes
  totalDiscounts: Discount[]     // include=discounts
  createdAt: string              // ISO datetime
  updatedAt: string
  deletedAt: string | null
}
```

### Item (binnen Order)
```typescript
type Item = {
  id: number
  productId: number
  label: string
  quantity: number
  amount: number
  amountWithTax: number
  type: ItemType                 // standard | upsell | gift | ...
  tax: Tax
  discounts: Discount[]
}
```

### OrderBilling
```typescript
type OrderBilling = {
  contact: Contact               // zie onder
  address: Address
}
```

### Contact
```typescript
type Contact = {
  firstName: string
  lastName: string
  email: string
  company: string | null
  telephone: string | null
  vatIdNumber: string | null
  website: string | null
  taxExempt: TaxExempt
}
```

### Payment
```typescript
type Payment = {
  customerId: string | null      // mollie/stripe customer ref
  mandateId: string | null       // voor recurring
  method: PaymentMethod | null   // ideal, creditcard, ...
  provider: PaymentProvider | null  // mollie | stripe
  type: PaymentType | null       // mail | mandate | manual | unknown
  status: PaymentStatus | null   // paid | open | ...
  transactionId: string | null
  paidAt: string | null          // ISO datetime
  url: string | null             // betaal-URL (voor open betalingen)
  orderId: number | null
}
```

### Subscription
```typescript
type Subscription = {
  id: number
  mode: Mode
  source: Source
  status: SubscriptionStatus     // active | cancelled | ended | inactive
  product: Product               // include=product
  pricing: SubscriptionPricing   // include=pricing
  billing: SubscriptionBilling   // include=billing
  trial: SubscriptionTrial       // include=trial
  tags: string[]                 // include=tags
  cancelledAt: string | null
  createdAt: string
  deletedAt: string | null
}
```

### Product
```typescript
type Product = {
  id: number
  title: string
  publicTitle: string
  description: string
  slug: string | null
  sku: string | null
  ledger: number | string | null
  physical: boolean
  type: ContractType             // subscription | installments | one_off
  pricing: ProductPricing        // include=pricing
  stock: Stock
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
```

### Rule (= webhook-registratie)
```typescript
type Rule = {
  id: number
  name: string
  driver: 'webhook' | string     // we gebruiken alleen 'webhook'
  triggerType: string            // bv. 'order_paid' — zie A.6
  actionType: 'call_webhook' | string
  actionData: { url: string }    // waar P&P onze webhook naartoe POSTed
  conditionData: Record<string, any> | null  // bv. { product_id: [1,2] }
}
```

## A.6 Webhooks — registratie via Rules API

P&P kent **geen aparte "webhook config"-UI in de admin**. In plaats daarvan:

1. **Registreer** een Rule via `POST /v2/rules`:
```json
{
  "name": "wininstituut-order-paid",
  "driver": "webhook",
  "action_type": "call_webhook",
  "action_data": { "url": "https://app.win.nl/api/webhooks/plugandpay" },
  "trigger_type": "order_paid",
  "condition_data": { "product_id": [1, 2, 3] }
}
```

2. **P&P POST'ed naar ons** wanneer een order met `product_id` in `[1,2,3]` betaald wordt.

3. **Ons endpoint** (`/api/webhooks/plugandpay`) ontvangt het event.

### Bekende `trigger_type` waarden
**Geverifieerd uit Context7-docs:**
- `order_paid` ← gedocumenteerd voorbeeld

**Afleidbaar / te verifiëren — volledige lijst via P&P Discord of admin:**
- `order_created`
- `order_paid` ✓
- `order_refunded`
- `order_cancelled`
- `subscription_started`
- `subscription_renewed`
- `subscription_payment_failed`
- `subscription_cancelled`
- `subscription_ended`

> **Actie:** eerste live-run bouwen we op `order_paid` (bekend). Overige trigger-namen verifiëren via test-rule-creatie in P&P admin én Discord-support. Documenteren in `modules/plugandpay/enums/rule.ts`.

### Webhook-payload (vermoed, te verifiëren)
Waarschijnlijk:
```json
{
  "event_id": "evt_...",
  "trigger_type": "order_paid",
  "occurred_at": "2026-04-24T14:30:00Z",
  "tenant_id": 123,
  "data": {
    "order": { /* Order entity, zie A.5 */ }
  }
}
```

### Webhook-signature
- HMAC-SHA256 over raw body, secret gedeeld bij rule-setup
- Header-naam: **[TE VERIFIËREN]** — kandidaat: `X-PlugAndPay-Signature`
- Verifieer in `signature-verifier.ts`; dev-bypass alleen via env-flag die in prod assert'ed off is

### Retry-gedrag (te verifiëren)
Waarschijnlijk standaard retry-on-5xx met exponential backoff (gebruikelijk). Altijd 200 retourneren voor succesvol-ontvangen events, ook bij business-logica-probleem dat niet retrybaar is (→ log + inbox-alert).

## A.7 Pagination & filtering

### Pagination (Laravel-stijl op basis van filters)
Query params:
- `limit` — aantal per pagina (default waarschijnlijk 25)
- `page` — pagina-nummer (1-based)

Response-meta (verwacht):
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 127,
    "last_page": 6
  },
  "links": {
    "first": "...?page=1",
    "last": "...?page=6",
    "prev": null,
    "next": "...?page=2"
  }
}
```

### Order filter parameters (geverifieerd uit `src/Filters/OrderFilter.php`)
```
affiliate_id (int), checkout_id (int), contract_id (int[]),
contract_type (enum[]), country (ISO), direction (asc|desc),
discount_code (string), email (string), has_bump (bool),
has_tax (bool), invoice_status (enum), is_deleted (bool),
is_first (bool), is_hidden (bool), is_upsell (bool),
limit (int), mode (test|live), page (int),
payment_status (enum[]), product_id (int), product_group (string),
product_tag (string), q (free-text search),
since_invoice_date (Y-m-d), since_paid_at (Y-m-d H:i:s),
until_paid_at (Y-m-d H:i:s), sort (enum), source (enum),
include (enum[]) — komma-gescheiden
```

### Subscription filter parameters
Subset van bovenstaande — heeft `SubscriptionStatus`, `Interval`, date-ranges. Exact afleiden bij gebruik.

### Relations eager-loaden (`include`)
```
GET /v2/orders?include=billing,items,payment&limit=25&page=1
```

## A.8 Error shapes

### 401 Unauthorized
```json
{ "message": "Unauthenticated." }
```
Trigger access-token refresh, retry één keer. Bij 2e 401 → disconnect integration.

### 404 Not Found
```json
{ "message": "Resource not found." }
```

### 422 Validation error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "contact.email": ["The email field is required."],
    "items.0.product_id": ["Product niet gevonden."]
  }
}
```
Deze door mappen naar form-errors per veld.

### 429 Rate limit
Header: `Retry-After: {seconds}`
Volg header, pauze, retry.

### 5xx Server
Retry met exponential backoff (500ms, 1s, 2s, 4s), max 4 attempts. Daarna bubble-up.

## A.9 Rate-limits (vermoed)

Niet publiek gedocumenteerd. Conservatieve aanname in MVP:
- **Runtime on-demand calls**: respecteer 429 via `Retry-After`
- **Reconcile / bulk jobs**: zelf throttle op 2 req/sec
- **Webhook-bursts**: geen limiet nodig — P&P pushed, wij ontvangen

Verifiëren bij eerste live productie-run. Bij reached-limit meteen adjusten in `rate-limiter.ts`.

## A.10 Referentie-SDK & ondersteuning

- **PHP SDK repo**: https://github.com/plug-and-pay/sdk-php (v1.2+, MIT licensed)
- **Wiki** (endpoint-docs per resource): https://github.com/plug-and-pay/sdk-php/wiki
- **Context7 MCP**: `/plug-and-pay/sdk-php` — query vanuit onze codebase bij twijfel
- **Discord** (support + feature-requests): https://discord.gg/PHuj4gnPX7
- **Admin-panel**: https://admin.plugandpay.com (waar Reza zijn tenant beheert)

---

## Appendix — Hoe ik dit document gebruik

Wanneer ik aan een PR werk:

1. Open deze file op de juiste PR-sectie
2. Check de "Depends on" — zijn die gemerged? Zo niet, stop.
3. Maak een checkout: `git switch feat/platform-NN-slug`
4. Rebase op `main`: `git rebase main`
5. Werk de "Tasks" sectie af, elke subtask vinken als done
6. Doorloop de "Acceptance checklist" — alleen mergen als alles groen
7. Open PR op GitHub met verwijzing naar deze sectie
8. Doorloop Gates A–E
9. Merge via `gh pr merge --squash`
10. Lokaal: `git switch main && git pull && git branch -D feat/platform-NN-slug`

Als tijdens bouw blijkt dat de plan niet klopt: update dit document **eerst**, dan de code.
