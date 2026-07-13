# Spec — Payload CMS implementatie (web/)

**Status:** goedgekeurd door Chris ("go", 2026-07-13). Think/Plan doorlopen in-sessie (3 correctierondes → blocks-model definitief). Architectuur: `docs/payload/win-cms-architectuur.md`. Dashboard + datamodel: `docs/payload/win-dashboard-spec.md`. Dit document: de bouwvolgorde + file-map + verificatie-eisen.

## Doel

De volledige WIN-website draait op Payload CMS (v3.86.0, exact gepind) binnen `web/`, met het officiële website-template-patroon (Pagina's-collectie, hero + layout-blocks). Reza update de site via het admin-panel; site blijft pixel-identiek na migratie.

## Geverifieerde basis

- Payload 3.86.0; `@payloadcms/next` peer: next ≥16.2.6 <17 → web bump `^16.2.4`→`^16.2.7` (template gebruikt 16.2.7)
- React 19.2.4 ✓; template zonder sass (custom.css i.p.v. scss)
- DB: `DATABASE_URL` beschikbaar in `platform/.env` (Supabase Postgres) → hergebruik als `DATABASE_URI` in `web/.env`
- **Géén `schemaName`** — experimenteel per db-postgres-reference; Payload-tabellen in `public` naast platform-tabellen (geen naamconflicten: eigen NL-slugs + `payload_*`)
- `idType` default (serial); `push: true` alleen dev
- Vercel Blob-adapter conditioneel (alleen actief met `BLOB_READ_WRITE_TOKEN`); dev = lokale uploads naar `web/public/media`
- Admin-taal NL: `@payloadcms/translations/languages/nl` (geverifieerd aanwezig)

## File-map (nieuw/gewijzigd in web/)

```
src/payload.config.ts                 config: collections, globals, blocks, nl, db, sharp, storage
src/payload/access.ts                 isAdmin / adminOfEditor / publiekGepubliceerd
src/payload/fields.ts                 herbruikbare velden: kopMetAccent, ctaVeld (route-select), fotoVeld
src/payload/revalidate.ts             afterChange/afterDelete → revalidatePath
src/collections/{Gebruikers,Media,Paginas,Diensten,Methodes,Publicaties}.ts
src/globals/{Navigatie,Footer}.ts
src/heros/config.ts + RenderHero.tsx  hero-types: homeHero / paginaHero / kopHeader
src/blocks/<Naam>/{config.ts,Component.tsx}  block-catalogus (dashboard-spec §3.3)
src/blocks/RenderBlocks.tsx           slug → component-mapper
src/app/(payload)/…                   template-scaffold (layout, admin, api, importMap)
src/app/(frontend)/layout.tsx         html/body + fonts + Navigation + Footer (uit root-layout)
src/app/(frontend)/page.tsx           home ← payload (slug 'home')
src/app/(frontend)/[slug]/page.tsx    overige pagina's ← payload
src/app/(frontend)/next/preview/route.ts   draft-mode voor live preview
src/seed/index.ts                     volledige content-seed (bron: originele TSX)
next.config.ts                        withPayload-wrapper + blob remotePatterns
tsconfig.json                         alias @payload-config
.env                                  DATABASE_URI, PAYLOAD_SECRET (niet committen)
```

Oude statische page-dirs (`app/aanbod/` t/m `app/wininstituut/` + `app/page.tsx`) worden pas verwijderd nadat de seed geslaagd is en `[slug]` rendert.

## Bouwvolgorde

1. **Baseline**: screenshots alle 12 routes op de huidige code (pixel-diff-referentie).
2. **Fundament**: deps installeren (exact 3.86.0), scaffold, config, env, typegen.
3. **Content-model**: collections/globals/blocks/heros + access + hooks.
4. **Frontend**: sectie-JSX → block-components (letterlijke kopie, alleen velden geparametriseerd), RenderHero/RenderBlocks, (frontend)-group, [slug]+home.
5. **Seed**: 12 pagina's exact volgens dashboard-spec §3.4 + bouwstenen + media + globals + users.
6. **QA**: screenshots ná migratie vs baseline; admin-flow testen (login → edit → preview → publiceer → revalidate); `npm run build` groen.

## Verificatie-eisen (niet onderhandelbaar)

- Pixel-vergelijking baseline vs. na-migratie per route — afwijkingen fixen tot identiek.
- `npm run build` (web) exit 0.
- Reza-rol kan: tekst editen, publiceren, terugrollen. Reza-rol kan níét: pagina aanmaken/verwijderen, slug wijzigen, users zien.
- Seed is idempotent genoeg om opnieuw te draaien in een lege database (prod-setup later).

## Risico's + mitigatie

| Risico | Mitigatie |
|---|---|
| Next 16-afwijkingen (web/AGENTS.md-waarschuwing) | template gebruikt zelf 16.2.7; bij twijfel `node_modules/next/dist/docs/` lezen |
| Turbopack + withPayload in monorepo | `turbopack.root` staat al goed; build-fouten direct adresseren |
| Supabase pooler vs. migrations | dev = `push: true` (geen migrations nodig); prod-migraties op directe verbinding — latere fase |
| Blocks-tabellen groot | acceptabel; `blocksAsJSON` NIET aanzetten (one-way, per reference) |
| Media in dev vs prod | conditionele Vercel Blob-adapter; dev lokaal `public/media` |
