# WIN × Payload CMS — Architectuur & Infrastructuur-index

> **Doel:** de source of truth voor het CMS-project: hoe Payload werkt (gefactcheckt), hoe de skill-infrastructuur eruitziet, welke architectuur we kiezen voor WIN en wat er nog open staat. Samen met `.claude/skills/win-payload/SKILL.md` en `docs/win-handboek.md` vormt dit de basis waar de definitieve onderhouds-skills van worden afgeleid.
>
> **Status:** GEBOUWD op 2026-07-13 — fasen 0 t/m 4 afgerond. Site rendert volledig uit Payload (lokaal), admin draait, build groen. Open: fase 5 (dashboard-koppeling) en fase 6 (prod-DB + deploy + definitieve skills). Zie de fasentabel §5.

---

## 1. Wat is Payload — de feiten (bron: officiële payloadcms/skills, commit 832d5bc)

Payload is een **Next.js-native, code-first headless CMS**. Kernprincipes:

- **Alles start in `payload.config.ts`**: je declareert **collections** (documenttypes), **globals** (singletons, bv. per-pagina content), velden, access control en plugins in TypeScript. Payload genereert daaruit: het admin-panel, het database-schema, REST- + GraphQL-API's en een **Local API** voor server-side gebruik (`payload.find/create/update` — direct, zonder HTTP).
- **Het admin-panel draait ín je Next.js-app** (route group `(payload)/admin/[[...segments]]`), niet als aparte service.
- **Drafts & versies**: `versions: { drafts: true }` injecteert automatisch een `_status`-veld (draft/published/changed) — publiceren wordt een bewuste stap en alles is terug te rollen. Dit is de officiële default-aanbeveling voor content-collecties.
- **`slugField()`** is de officiële helper voor slugs (auto-generatie uit titel, uniek, geïndexeerd) — geen handgemaakte slug-velden.
- **Access control** op collection-, veld- en global-niveau; rollen + row-level queries. RBAC-patronen staan in `references/ACCESS-CONTROL.md`.
- **Hooks** (beforeChange/afterChange/afterRead, collection- én veld-niveau) voor business-logica, o.a. Next.js-revalidation na publish.
- **Live preview**: drafts bekijken in de echte frontend vóór publiceren.
- **Type-generatie**: `payload-types.ts` wordt automatisch gegenereerd (dev + `payload build`).

**De drie valkuilen die iedereen raken** (uit de officiële skill, altijd toepassen):
1. Local API **negeert access control** tenzij je `overrideAccess: false` meegeeft naast `user`.
2. Geneste operaties in hooks hebben **`req`** nodig, anders draaien ze buiten de transactie (data-corruptierisico).
3. Hooks die dezelfde collectie updaten **loopen oneindig** — guard met `req.context`-vlag.

## 2. Geverifieerde versie-feiten (npm-metadata, 2026-07-13)

| Wat | Waarde | Consequentie |
|---|---|---|
| Payload latest | **3.86.0** | — |
| `@payloadcms/next` peer-dep Next | `>=16.2.6 <17.0.0` (voor de Next 16-range) | WIN draait Next **16.2.4** (`^16.2.4`) → **minor-bump naar ≥16.2.6 vereist**, valt binnen de caret |
| `@payloadcms/richtext-lexical` peer-dep React | `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1` | WIN draait React **19.2.4** ✓ |
| `payload` peer-dep | `graphql ^16.8.1` | wordt meegeïnstalleerd |
| DB-adapter | `@payloadcms/db-postgres` (peer: alleen payload zelf) | past op Supabase Postgres |

## 3. Skill-infrastructuur — de nieuwe staat (geïnstalleerd 2026-07-13)

| Laag | Locatie | Inhoud | Herkomst |
|---|---|---|---|
| **Master-skill** | `~/.claude/skills/payload/` (globaal) | Router + 30 sub-skills (config, collections, fields, hooks, access-control, auth, local-api, rest/graphql, admin-ui, lexical, versions-drafts, localization, uploads, live-preview, nextjs, jobs, migrations, db-postgres, email-resend, storage-vercel-blob, plugins-seo/nested-docs/search/form-builder/redirects, plugin-mcp, payload-auth, content-workflows) | Afgeleid van officiële skill + uitbreidingen; **references ververst 2026-07-13** naar officiële stand (commit 832d5bc, 2026-07-07) |
| **References** | `~/.claude/skills/payload/references/` | 11 upstream reference-docs (FIELDS, COLLECTIONS, HOOKS, ACCESS-CONTROL(+ADVANCED), QUERIES, ENDPOINTS, ADAPTERS, ADVANCED, PLUGIN-DEVELOPMENT, FIELD-TYPE-GUARDS) + PAYLOAD-OFFICIAL-SKILL.md (verbatim kopie officiële master) | **Byte-identiek aan officiële repo** — geverifieerd met diff |
| **Migratie-skill** | `~/.claude/skills/cms-migration/` (globaal) | Officiële config-first workflow: bestaande site/CMS-data → Payload collections, interactief, met veld-referentie | **Verbatim upstream** |
| **WIN-adapter** | `.claude/skills/win-payload/` (project) | WIN-constraints, versie-feiten, architectuur, Reza-guardrails, onderhoudsprotocol. **Startpunt voor al het Payload-werk op WIN.** | Zelf geschreven, 2026-07-13 |
| **Trigger-registratie** | `.claude/kick/TOOLS.md` deel 7 | *cms / payload / content editbaar / Reza kan zelf editen* → `/win-payload` | — |

**Let op (Driftawave-erfenis):** de globale master-skill bevat een "opensrc"-sectie en verwijzingen naar Neon en een better-auth-runbook die alleen in Chris's Driftawave-repo bestaan. In WIN negeren; staat ook zo in de master-skill en de WIN-adapter genoteerd.

## 4. Doelarchitectuur voor WIN

**Eis van Chris:** de website (`web/`) blijft volledig intact — design, componenten, alles. Reza moet via zijn dashboard-login content kunnen bijwerken. Kick heeft eindverantwoordelijkheid om te voorkomen dat Reza de site kan breken.

### 4.1 Waar mount Payload? (drie opties)

| Optie | Hoe | Voordelen | Nadelen |
|---|---|---|---|
| **A. In `platform/`** | Admin bij het bestaande dashboard; `web/` haalt content op via REST | Eén login-plek (better-auth zit daar al) | web/ krijgt netwerk-hop + CORS/preview-complexiteit; Payload-schema naast drizzle-schema in één app; live preview van de website vanuit een ándere app is gedoe |
| **B. In `web/` (aanbeveling)** | Route group `(payload)/admin` in de website zelf; platform-dashboard krijgt een knop/link "Website bewerken" | Local API direct in de servercomponents (geen netwerk-hop, geen CORS); live preview native in dezelfde app; site + content = één deploy; kleinste bouwrisico voor het bestaande design | Tweede user-store (Payload-users naast platform better-auth) totdat de SSO-brug er is |
| **C. Shared package `packages/cms`** | `payload.config` in een workspace-package, gemount in één app, types gedeeld | Nette scheiding op termijn | Meer bewegende delen nu; kan later alsnog — B sluit C niet uit |

**Aanbeveling: B.** Payload is Next-native en is precies voor dit patroon gebouwd; de eis "website intact" is het best gediend met content die via de Local API rechtstreeks in de bestaande servercomponents stroomt. De dashboard-integratie is in fase 1 een link vanuit platform-admin; de `payload-auth`-plugin (better-auth-koppeling, sub-skill aanwezig maar deferred) kan dat later tot echte SSO maken.

### 4.2 Database

`@payloadcms/db-postgres` op het bestaande **Supabase dev-project** (`ujlkvaxlmrsvzgmlakgn`), in een **eigen Postgres-schema** (bv. `payload`), strikt gescheiden van het platform-drizzle-schema. Migraties via `payload migrate` (sub-skill `migrations`). Productie-database: apart Supabase prod-project bij livegang — **nooit dev-tegen-prod**.

### 4.3 Media

Vercel heeft geen persistent filesystem → storage-adapter verplicht. Twee kandidaten:
- **Vercel Blob** (`@payloadcms/storage-vercel-blob`) — first-party adapter, sub-skill aanwezig.
- **Supabase Storage** (via S3-adapter) — alles bij één leverancier.

Open keuze (§6). De bestaande foto-bibliotheek (44 portretten + 27 locatiefoto's, zie handboek §4) wordt bij migratie in de Media-collectie geïmporteerd mét verplichte alt-teksten.

### 4.4 Content-model — zo blijft het design onaantastbaar

Het cms-migration-draaiboek is config-first: eerst structuur vaststellen, dan pas data. Voor WIN (bron: `docs/win-handboek.md` §7 — alle 14 pagina's zijn al sectie-voor-sectie geïndexeerd):

- **Het patroon van het officiële Payload website-template** (geverifieerd in `templates/website/src/collections/Pages/index.ts`): een **Pagina's-collectie** met per pagina een Hero-tab + een `layout`-veld van type **blocks**. Elk block-type in de catalogus is één van onze bestaande sectie-componenten (JSX ongewijzigd, gerenderd via één `RenderBlocks`-mapper). De 14 bestaande pagina's worden geseed met hun exacte huidige block-volgorde — daarna pixel-identiek.
- **Reza's speelruimte:** teksten/foto's in blocks editen, blocks herordenen/toevoegen/verwijderen **uit de goedgekeurde catalogus**, met drafts + versie-rollback als vangnet. Velden zijn beschermd (maxLength, CTA's als route-selects, verplichte alt, min/max op arrays, stijl-selects i.p.v. vrije styling). **Layout, styling, vrije HTML en de catalogus zelf bestaan niet als veld.**
- **Pagina's aanmaken/verwijderen en slugs wijzigen: alleen admin** (collectie-/veld-access). Nieuwe pagina's en nieuwe block-types bouwt Kick (Claude Code) — daarna onderhoudt Reza ze zelf. Geen page-builder buiten de catalogus.
- **Gedeelde data als collecties:** Media, Diensten & Prijzen (prijs op één plek → overal consistent), Methodes (integratieve palet), Publicaties. Domein- en fase-omschrijvingen blijven block-velden per pagina (bewust variërende teksten, handboek §7); de namen zelf zijn merk-vast in code.
- **Overal:** `versions: { drafts: true }`, live preview, en rollen `admin` (Chris/Kick) vs `editor` (Reza).

**De volledige dashboard-spec (sidebar, block-catalogus, seed-mapping per pagina, rechten-matrix, workflows) staat in `docs/payload/win-dashboard-spec.md`.** De block-catalogus wordt in de Plan-fase definitief gefinetuned met de cms-migration-workflow.

### 4.5 Publicatie-flow voor Reza

1. Reza logt in (fase 1: aparte Payload-login op de site-admin, link vanuit zijn dashboard; later SSO).
2. Past content aan → automatisch draft.
3. Bekijkt live preview.
4. Publiceert → `afterChange`-hook triggert Next.js-revalidation van de betreffende route (patroon staat in `references/HOOKS.md`).
5. Fout gemaakt? Versie-historie → terugrollen. Kick ziet alles in de versie-log.

## 5. Bouwfasen (elk via de G-Stack sprint)

| Fase | Wat | Resultaat |
|---|---|---|
| 0 ✅ | Research + skill-integratie | Skills geïnstalleerd, feiten geverifieerd |
| 1 ✅ | Plan: beslissingen Chris + specs | `docs/superpowers/specs/payload-cms-implementatie.md` + dashboard-spec |
| 2 ✅ | Fundament (2026-07-13): Next 16.2.7, Payload 3.86.0 in `web/`, db-postgres (dev: lokale pg `win_cms` — Supabase-dev bleek gepauzeerd), users+rollen, NL-admin | Admin draait op /admin |
| 3 ✅ | Content-model: Pagina's-collectie + 24-block-catalogus + hero-types; seed met alle 12 pagina's, 28 foto's, 4 diensten, 8 methodes, 3 publicaties, nav/footer-globals | Site rendert 100% uit Payload; visuele QA per pagina; `next build` groen (18 routes) |
| 4 ✅ | Reza-laag: rollen admin/editor, drafts+autosave+versies, live-preview-route, revalidate-hooks | Reza kan veilig editen |
| 5 | Dashboard-koppeling: knop "Website bewerken" in platform-admin; later payload-auth SSO; site-nav "Inloggen"-URL naar prod | Eén ingang voor Reza |
| 6 | Prod-DB (Supabase heractiveren of nieuw) + Vercel Blob-token + deploy + definitieve onderhouds-skills | Live + duurzaam onderhoud |

**Bekende afwijkingen na de bouw (2026-07-13):** dev-DB is lokale Postgres (`win_cms`) — Supabase-dev-project gepauzeerd/verdwenen, prod-keuze bij Chris; `payload run` werkt niet op brew-Node 26 → seed via `npx tsx` met Node 24; nav/footer-componenten lezen nog hardcoded teksten (globals bestaan + zijn geseed, wiring = kleine vervolgklus); machine-fix + repo-verhuizing naar `~/dev/win`: memory `reference_machine_fix_repo_locatie`.

**Definition of done fase 3 (kritiek):** de site is vóór en na de CMS-koppeling visueel identiek (screenshot-diff via /qa) en `npm run build:web` is groen. Dat is de hardste garantie op "alles behouden".

## 6. Beslissingen

| # | Beslissing | Status |
|---|---|---|
| 1 | **Mount-locatie: optie B — Payload in `web/`** (admin op de site zelf, Local API in de bestaande componenten, dashboard-knop als brug) | ✅ **Besloten door Chris, 2026-07-13** |
| 2 | **Media-storage: Vercel Blob** (`@payloadcms/storage-vercel-blob`) | ✅ **Besloten door Chris, 2026-07-13** |
| 3 | Payload-versie exact pinnen op 3.86.0 bij de bouw (geen caret) | Aanname: ja — bevestigen in Plan-fase |
| 4 | Login-knop site-nav (`localhost:3002`, handboek §9) meteen naar echte platform-URL | Meenemen in fase 5 (dashboard-koppeling) |
| 5 | Payload-admin op NL voor Reza (i18n) | Aanname: ja |

## 7. Onderhoudsprotocol (source of truth-discipline)

- **Dit document** verandert mee met elke architectuur- of schema-beslissing (beslissing → zelfde commit als de code).
- **`.claude/skills/win-payload/`** houdt de feiten-tabel en constraints actueel; versie-bumps → peer-deps opnieuw verifiëren en tabel updaten.
- **Upstream-refresh** (maandelijks of bij Payload-major): officiële `payloadcms/skills` clonen → diffen → references verversen → Versioning-regel in globale skill updaten. Procedure staat in de WIN-adapter.
- **`docs/win-handboek.md`** krijgt na livegang een nieuw hoofdstuk "CMS" (welke velden waar leven, hoe Reza edit) en §9/§10 worden bijgewerkt.
- **Definitieve skills** (fase 6) worden uit deze docs afgeleid — niet andersom; docs eerst, skill volgt.
