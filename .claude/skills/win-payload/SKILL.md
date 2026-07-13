---
name: win-payload
description: WIN-adapter voor alle Payload CMS-werk op de WIN-repo. Gebruik deze skill ALTIJD eerst bij cms-werk, "Reza kan zelf editen", content editbaar maken, pagina's bewerken via het dashboard, collections/globals ontwerpen voor de website, of elke payload.config-wijziging. Routet naar de globale payload master-skill en cms-migration skill, en bevat de WIN-constraints (website intact, Reza-guardrails, versie-feiten, architectuurkeuzes). Triggers: "cms", "payload", "content editen", "Reza aanpassen", "website editbaar", "pagina bewerken", "admin panel website".
user-invocable: true
---

# WIN × Payload CMS — Project-adapter

Alle Payload-werk op WIN begint hier. Deze skill bevat wat de generieke skills níét weten: de WIN-constraints, de geverifieerde versie-feiten en de architectuurbeslissingen. Voor de Payload-techniek zelf: **altijd doorklikken naar de bronnen hieronder — nooit uit het hoofd werken.**

## Bronnen-hiërarchie (in deze volgorde raadplegen)

1. **`~/.claude/skills/payload/SKILL.md`** — master-router. Kies daar de sub-skill (collections, fields, hooks, access-control, nextjs, db-postgres, uploads, live-preview, versions-drafts, …) en lees die vóór je bouwt.
2. **`~/.claude/skills/payload/references/*.md`** — docs-snapshot, ververst 2026-07-13 vanaf officiële `payloadcms/skills` (commit `832d5bc`, 2026-07-07).
3. **`~/.claude/skills/cms-migration/SKILL.md`** — de officiële workflow voor het omzetten van een bestaande site naar Payload-collections (config-first, interactief met de gebruiker). Dit is ons migratie-draaiboek.
4. **Context7 MCP** (`/payloadcms/payload`) — live docs bij twijfel of versie-drift.
5. **`docs/payload/win-cms-architectuur.md`** (in deze repo) — de WIN-doelarchitectuur, beslissingen en open punten.

⚠️ **Niet van toepassing in WIN:** de "opensrc"-sectie in de globale skill (Driftawave-only), Neon-verwijzingen (wij gebruiken Supabase Postgres), en `docs/handoff/09-better-auth-runbook.md` (bestaat alleen in Driftawave).

## Geverifieerde feiten (npm-metadata, gecheckt 2026-07-13)

| Feit | Waarde |
|---|---|
| Payload actueel | **3.86.0** |
| `@payloadcms/next` peer-dep op Next | `>=15.2.9 <15.3.0 \|\| >=15.3.9 <15.4.0 \|\| >=15.4.11 <15.5.0 \|\| >=16.2.6 <17.0.0` |
| WIN Next-versie | `^16.2.4` (geïnstalleerd 16.2.4) → **bump naar ≥16.2.6 nodig** vóór Payload-installatie (valt binnen caret) |
| React | 19.2.4 — valt binnen lexical-peer-range `^19.2.1` ✓ |
| Monorepo | npm workspaces: `web`, `platform`, `packages/*` (packages nog leeg) |
| DB-adapter keuze | `@payloadcms/db-postgres` op Supabase Postgres (dev-project `ujlkvaxlmrsvzgmlakgn`) — **nooit tegen prod** |

Bij versie-bumps: peer-deps opnieuw checken met `npm view @payloadcms/next@<versie> peerDependencies` — niet aannemen.

## WIN-constraints (hard, niet onderhandelbaar)

1. **De website blijft 100% intact.** Payload levert *content*, geen layout. De bestaande componenten, Tailwind-classes en het design uit `docs/win-handboek.md` zijn leidend. Geen page-builder die vrije HTML rendert; content stroomt veld-voor-veld in de bestaande JSX. Bij twijfel of een veld het design kan breken: veld strakker maken (select/vaste opties), niet losser.
2. **Reza-guardrails.** Reza is domein-expert, geen developer. Elke content-collectie/global krijgt:
   - `versions: { drafts: true }` — alles is terug te rollen, publiceren is een bewuste stap (auto `_status`-veld, géén eigen status-veld).
   - Live preview vóór publish waar zinvol.
   - Access control met rollen: `admin` (Chris/Kick — alles) vs `editor` (Reza — content lezen/schrijven, geen structuur, geen delete op kritieke collecties, geen toegang tot users/settings).
   - Validatie op velden die het design raken (maxLength op koppen, verplichte alt-teksten, vaste beeldverhoudingen).
3. **Merkregels gelden ook in het CMS.** Copy die via Payload binnenkomt volgt `/win-brand-rules` en het handboek (§3 tone of voice — triggerwoorden, verboden woorden, signature quotes verbatim). Bouw waar mogelijk hulpteksten (`admin.description`) in de velden die Reza hieraan herinneren.
4. **Bronnen-trouw.** Elke config-keuze moet herleidbaar zijn naar een reference-file, de officiële docs of npm-metadata. De drie kritieke valkuilen uit de master-skill gelden altijd: (a) Local API bypasses access control zonder `overrideAccess: false`, (b) nested ops in hooks hebben `req` nodig voor transactie-atomiciteit, (c) hook-loops voorkomen met `req.context`-vlag.
5. **G-Stack verplicht.** De CMS-bouw is development → volledige sprint (Think → Plan → Build → Review → Test → Ship). Deze skill is input voor die sprint, geen vervanging.

## Architectuur (besloten door Chris, 2026-07-13)

Vastgelegd met opties en onderbouwing in `docs/payload/win-cms-architectuur.md` §6:

- ✅ **Payload mount in `web/`** (route group `(payload)/admin`) — admin op de site-URL zelf; Local API direct in de servercomponents van de site (geen netwerk-hop); live preview in dezelfde app. Dashboard-koppeling: knop/link in platform-admin → website-admin (SSO-brug via better-auth later, `payload-auth` sub-skill is er al maar staat op deferred).
- **DB:** `@payloadcms/db-postgres` op Supabase (eigen schema, gescheiden van platform-drizzle-schema).
- ✅ **Media: Vercel Blob** (`@payloadcms/storage-vercel-blob`, sub-skill `storage-vercel-blob`).
- **Content-model:** het officiële website-template-patroon — Pagina's-collectie met Hero-tab + `layout`-blocks-veld; block-catalogus = onze bestaande sectie-componenten (JSX ongewijzigd via RenderBlocks). Reza edit teksten/foto's en herordent/voegt blocks toe uit de catalogus; **pagina's aanmaken/verwijderen + slugs = admin-only** — nieuwe pagina's en nieuwe block-types bouwt Kick in code. Collecties voor gedeelde data: Diensten & Prijzen, Methodes, Publicaties, Media. Volledige spec incl. catalogus + seed-mapping: `docs/payload/win-dashboard-spec.md`.

## Onderhoud (dit is jouw source of truth — houd hem levend)

- **Upstream-refresh:** `git clone --depth 1 https://github.com/payloadcms/skills` → diff `skills/payload/reference/*.md` tegen `~/.claude/skills/payload/references/` → kopieer bij drift → update de Versioning-regel in de globale SKILL.md én de feiten-tabel hierboven.
- **Bij elke Payload-versiebump in de repo:** peer-deps verifiëren, feiten-tabel hier updaten.
- **Bij elke architectuur- of schema-wijziging:** `docs/payload/win-cms-architectuur.md` mee-updaten, en na livegang ook `docs/win-handboek.md`.
- **Na de bouwfase:** uit deze adapter + de architectuur-doc de definitieve onderhouds-skills afleiden (samen met Chris), o.a. "nieuwe pagina maken", "sectie toevoegen", "Reza-hulp bij content".
