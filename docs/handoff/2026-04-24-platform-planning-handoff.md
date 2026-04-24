# Handoff — WIN Coaching Platform planning (2026-04-24)

> Chris, kopieer dit volledige bericht in een nieuw gesprek. Dit is de cold-start voor future-Kick.

---

## Wie ben jij en wat moet je doen

Jij bent **Kick** — Chris' CTO-partner (Claude Opus 4.7) voor het **WIN-platform**. Chris = eigenaar/strateeg. Reza = domein-expert (weerbaarheidstherapie). Jij bouwt het platform.

We hebben op **2026-04-24** een uitgebreide planning-sessie gedaan voor het **coachingsplatform achter win.nl**. Drie grote outputs:

1. Complete architectuur-spec (why)
2. Per-PR implementation playbook (how)
3. 29 branches klaargezet lokaal

De code is **nog niet begonnen**. Jouw taak bij de volgende sessie: eerst bovenstaande docs lezen, dan PR 01 bouwen zodra Chris groen licht geeft.

## Wat je ABSOLUUT eerst doet bij cold-start

**Lees in deze volgorde** (niet skippen, niet samenvatten-zonder-lezen):

1. `CLAUDE.md` — project-context, execution discipline, CTO-rol. Bevat de "jij bent CTO, niet intern"-regels die bepalen hoe jij communiceert.
2. `docs/superpowers/specs/2026-04-24-coaching-platform-design.md` — **architectuur-spec (513 regels)**. Waarom unified app, waarom P&P, waarom rem/mobile-first, taakverdeling P&P ↔ ons. **Dit is de why.**
3. `docs/superpowers/specs/2026-04-24-coaching-platform-implementation.md` — **per-PR playbook (2173 regels)**. Per PR: files, taken, subtaken, edge cases, acceptance. **Dit is de how.** Bevat Appendix A met de complete P&P API-reference.
4. Memory-files (automatisch geladen via MEMORY.md):
   - `project_coaching_platform.md` — scope + status
   - `reference_plugandpay.md` — P&P kernfeiten
   - `feedback_mobile_first_rem.md` — rem-regel + bottom-nav
   - `feedback_proactivity.md` — CTO-toon
   - `feedback_no_invention.md` — bron-discipline

**Pas dan** ga je iets maken. Eerst lezen is niet vrijblijvend.

## Wat we bouwen — snelle samenvatting

Eén Next.js-app `/platform` naast de bestaande `/web`. Drie rol-surfaces, één database, één auth.

| Rol | URL-prefix | Wat ze doen |
|-----|-----------|-------------|
| `client` | `/app/*` | Eigen coaching-traject doorlopen (modules, habits, chat, afspraken) |
| `coach` | `/coach/*` | Reza runt z'n praktijk (helikopterview, trajectbouwer, notities, sessies) |
| `admin` | `/admin/*` | Chris + Reza runnen het platform (users, CRM met betalingen, kanban-met-mij, inbox, pages, integraties) |

**Tech stack:**
- Next.js 16 + React 19 + Tailwind 4 + TypeScript (strict)
- **BetterAuth** — email+password nu, GitHub-OAuth en magic-links later
- **Drizzle ORM + Postgres** (Supabase-hosted, alleen DB + Realtime — geen Supabase Auth)
- **Supabase Realtime** voor chat
- **shadcn/ui** in gedeelde `packages/ui/` met WIN-tokens
- **Plug and Pay** voor checkout, orders, abonnementen (zie onder)
- **Resend** voor transactional email
- **PWA** voor mobile (geen native)

**Design-discipline:**
- Alles in `rem`, **nooit px** (uitzonderingen: 1px borders, breakpoints, box-shadow)
- Mobile-first: elke pagina eerst ontworpen op 375×667
- Topbar-hamburger + bottom-nav op mobile; sidebar-rail op desktop
- Licht thema voor `web/` en `/app/` (cream), dark voor `/coach/` en `/admin/` (bronze)
- ESLint-guard tegen px in arbitrary Tailwind-values

**Architectuur-lagen** (zie playbook §0.0):
```
UI → server-action → service → (repo | external-client)
```
Per domain een module: `modules/<domain>/{client,services,repo,schemas,types,enums,mappers,events}`.

## Plug and Pay — de commerce-lijn

P&P doet frontend-checkout, facturatie, abonnementen. Wij doen coaching-content + access-control. Grens: `order_paid` webhook → enrollment aangemaakt → toegang unlocked.

**Complete reference staat in Appendix A van de implementation-spec.** Verifieerde ground-truth uit de officiële PHP SDK (github.com/plug-and-pay/sdk-php) + Context7-docs. Alle enums, endpoints, OAuth2-flow, webhook-registratie via Rules API. Niet zelf bedenken — appendix raadplegen.

**Vier punten nog te verifiëren bij eerste live-contact met P&P:**
1. Webhook-signature header-naam (kandidaat `X-PlugAndPay-Signature`)
2. Complete lijst van `trigger_type` waarden (we kennen alleen `order_paid` zeker)
3. Exacte webhook-payload structuur (aanname op basis van gebruikelijke patronen)
4. Rate-limit getallen

Deze vier kunnen met één test-rule-creatie in Chris' P&P-admin + een Discord-vraag worden beantwoord.

## Branches (29 stuks, lokaal, nog niet gepusht)

Op `main` staan **nog geen feature-commits** — alle branches wijzen naar de huidige HEAD en zijn klaar om op te werken.

```
Foundation (M1)
  feat/platform-01-scaffold              # Next.js + BetterAuth + Drizzle + /login
  feat/platform-02-design-system         # packages/ui, shadcn, AppShell, mobile-nav, rem-guard
  feat/platform-03-rbac                  # rollen, middleware, session-events

Plug and Pay infrastructure (M1b — commerciële MVP)
  feat/platform-03b-plugandpay-client    # TS service-layer + OAuth2 PKCE + tabellen
  feat/platform-03c-plugandpay-webhooks  # Rules API registratie + event handlers
  feat/platform-03d-plugandpay-sync      # nightly reconcile + on-demand
  feat/platform-03e-enrollment-gating    # access-middleware + magic-link

Client-surface (M2)
  feat/platform-04-trajecten-viewer
  feat/platform-05-opdrachten
  feat/platform-06-habits
  feat/platform-07-chat
  feat/platform-08-afspraken
  feat/platform-09-formulieren-client

Coach-surface (M3)
  feat/platform-10-coach-overview
  feat/platform-11-client-detail
  feat/platform-12-trajectbouwer
  feat/platform-13-formulieren-builder
  feat/platform-14-sessies
  feat/platform-15-rapportage

Admin-surface (M4)
  feat/platform-16-admin-users
  feat/platform-17-crm
  feat/platform-17b-crm-payments
  feat/platform-17c-payments-dashboard
  feat/platform-18-projects
  feat/platform-19-kanban-github          # ⭐ jij+Chris via GitHub Issues
  feat/platform-20-inbox
  feat/platform-21-pages-explorer
  feat/platform-22-integrations
  feat/platform-22b-public-pricing-links
```

Verifieer met `git branch --list 'feat/platform-*' | wc -l` → moet 29 geven.

## Volgorde waarop we bouwen

1. **M1 foundation** sequentieel: 01 → 02 → 03 (PR 02 is zwaar — alle responsive primitives)
2. **M1b P&P** sequentieel: 03b → 03c → 03d → 03e (hier krijg je eerste echte euro door)
3. Daarna **parallel** twee tracks:
   - Track A (Reza-waarde): 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15
   - Track B (intern tooling): 16 → 17 → 17b → 17c → 19 → 20 → 21 → 22 → 22b
   - Track C (los): 18 projects

## Repository-structuur (huidig + target)

**Nu bestaand:**
- `/web` — publieke site (Next.js 16, live op win.nl). NIET aanraken tenzij PR 22b.
- `/content/webteksten/*.docx` — bron-teksten voor branding
- `/.claude/skills/stitch/` — design via Stitch MCP (niet zelf design verzinnen)
- `/docs/superpowers/specs/` — onze design-specs

**Wordt gemaakt in PR 01+:**
- `/platform` — unified app (nieuw)
- `/packages/ui` — shared design-primitives (nieuw)

## Configuratie die al bestaat

- Remote: `https://github.com/iamcoai/WIN.git`
- `gh` is ingelogd met drie accounts. `cocreatie` is actief, maar **push-eigenaar is `iamcoai`**. Voor push: `gh auth switch --user iamcoai`.
- Commits maken: git user is `Chris - Founder at Co-Creators.ai <chris-co-creators-ai@users.noreply.github.com>` — OK laten.

## Wat Chris aan jou laat (nog geen antwoord op)

Twee product-forks:
1. **Beleid bij abonnements-annulering** — read-only toegang tot voltooide modules behouden (aanbeveling) of volledige revoke?
2. **Onboarding-wizard na eerste magic-link** — 3 stappen (foto / timezone / intake) of direct in /app droppen? Aanbeveling: ja, 3 stappen (warme welkom, past bij Reza).

Plus praktisch:
3. **P&P-toegang** — API-token + tenant-id nodig voor PR 03b/03c bouw + test
4. **Testproduct in P&P** — "Weerbaarheidstrajekt 12 weken" voor €1 zodat we end-to-end kunnen testen zonder echte verkoop

Vraag deze niet nogmaals als Chris ze in de nieuwe sessie al beantwoordt.

## Werkafspraken (uit CLAUDE.md + feedback-memory)

- **Toon = CTO**: "ik doe X en Y, ik laat Z aan jou over" — niet "wil je dat ik X doe?"
- **Proactief fixen**: als je een gat ziet (stale memory, ontbrekende test, verkeerde anchor) → los op in dezelfde beurt, niet terugkaatsen
- **Niet zelf verzinnen**: research eerst bron lezen, alle claims citeerbaar
- **Niet eindeloos brainstormen**: grote forks voorleggen, kleine zelf nemen
- **Design gaat via Stitch MCP** (`.claude/skills/stitch/`), niet Claude. Jij bouwt wat Stitch oplevert.
- **rem + mobile-first = harde regel** — elke PR Playwright-getest op 375×667
- **Destructive acties (force-push, rm -rf, prod-mutatie) altijd bevestigen** — rest zelf doen

## Wat is er verder nog

- **Playwright MCP** beschikbaar voor UI-tests en screenshots
- **Word document MCP** voor `.docx` parsen indien nodig
- **Context7 MCP** voor library-docs (ook voor P&P SDK: `/plug-and-pay/sdk-php`)
- **PostHog MCP** — geconfigureerd voor project "Default project" (id: 130972) — later relevant voor platform-telemetrie
- **Stitch skills** geïnstalleerd in `.claude/skills/stitch/skills/` (8 skills)

## Concrete eerste zet van jou bij de volgende sessie

1. Alle bestanden uit sectie "Wat je ABSOLUUT eerst doet" lezen
2. `git branch --list 'feat/platform-*' | wc -l` → verify 29
3. `git status` → check of main nog schoon is
4. Kort CTO-update-bericht naar Chris: "ik heb de spec + playbook + memory gelezen, ik sta klaar voor PR 01. Twee forks nog open [...]. Go?"
5. Als Chris "go" zegt:
   - `git switch feat/platform-01-scaffold`
   - Open playbook §2 PR 01, werk T1 → T7 af met acceptance checklist
   - Daarna PR 02 (design-system — hier komt de mobile-nav + rem-guard)
   - Dan PR 03, dan M1b
6. Bij elke PR: §0 conventies + Gates A–E uit playbook doorlopen

## Checksum — klopt je context?

Als alles klopt zie je dit:
- `docs/superpowers/specs/` bevat 3 files (design v1 superseded, design v2, implementation)
- `docs/handoff/2026-04-24-platform-planning-handoff.md` bestaat (dit bestand)
- 29 branches met prefix `feat/platform-`
- MEMORY.md bevat regels voor `project_coaching_platform`, `reference_plugandpay`, `feedback_mobile_first_rem`
- `main` is nog op commit `4653cce` (initial scaffolding) — zonder nieuwe PRs is er niks gemerged

Zo niet, check wat er mist voordat je begint.

---

**Einde handoff. Chris — paste dit in een nieuw Claude-gesprek en ik pak op vanaf daar.**
