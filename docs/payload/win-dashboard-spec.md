# WIN Dashboard-spec — Reza's Payload-admin, volledige indexatie

> **Wat dit is:** het complete ontwerp van het CMS-dashboard waarmee Reza de website bijhoudt. Sidebar-indeling, de Pagina's-collectie met de block-catalogus, alle overige collecties en globals veld-voor-veld, functionaliteiten, rechten en workflows. Bron voor het veld-ontwerp: `docs/win-handboek.md` §5+§7. Technische onderbouwing: `docs/payload/win-cms-architectuur.md`.
>
> **Het model (besloten door Chris, 2026-07-13, verfijnd na blocks-check):** Payload zoals het bedoeld is — het patroon van het officiële Payload website-template: een **Pagina's-collectie** waarin elke pagina bestaat uit een **Hero + een `layout`-veld met blocks**. Elk block-type is één van onze bestaande sectie-componenten. Reza edit teksten/foto's in de blocks en kan secties herordenen of toevoegen **uit de goedgekeurde catalogus**. **Pagina's aanmaken of verwijderen is admin-only**: nieuwe pagina's (en nieuwe block-types) bouwt Kick via Claude Code, waarna Reza ze direct kan onderhouden. Vrije HTML, styling of layout-code bestaat nergens als veld.
>
> **Feiten-basis:** `blocks` is een core veldtype (`references/FIELDS.md` §Blocks); het officiële website-template gebruikt exact dit patroon (Pages-collectie, hero-tab + `layout: blocks`, live preview, SEO-plugin, revalidate-hooks) — geverifieerd in `templates/website/src/collections/Pages/index.ts` op payloadcms/payload main.

---

## 1. Het dashboard in één beeld

Reza logt in op `<website-url>/admin` (knop in zijn platform-dashboard). Interface volledig **Nederlands** (officiële `nl`-vertaling, geverifieerd in `@payloadcms/translations@3.86.0`), WIN-logo en goud-accent via admin-branding.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [WIN-logo]                                            Reza ▾   🔍      │
├──────────────────┬──────────────────────────────────────────────────────┤
│ CONTENT          │  Pagina's › Home                     ● Gepubliceerd  │
│  • Pagina's (14) │ ┌─Tabs────────────────────────────────────────────┐  │
│                  │ │  Hero  │  Inhoud (blocks)  │  SEO               │  │
│ BOUWSTENEN       │ ├─────────────────────────────────────────────────┤  │
│  • Diensten &    │ │  ⠿ 01 Intro-sectie (tekst + foto)      ▸ open  │  │
│    Prijzen       │ │  ⠿ 02 Kaarten-grid — De 4 Domeinen     ▸ open  │  │
│  • Methodes      │ │  ⠿ 03 Quote-band (navy)                ▸ open  │  │
│  • Publicaties   │ │  ⠿ 04 Herkenning + CTA                 ▸ open  │  │
│                  │ │  [+ Sectie toevoegen ▾ (uit catalogus)]        │  │
│ MEDIA            │ └─────────────────────────────────────────────────┘  │
│  • Mediabiblio-  │                                                      │
│    theek         │  [ Concept opslaan ]   [ 👁 Live voorbeeld ]         │
│                  │  [ Publiceren ]        [ ⟲ Versies (12) ]           │
│ SITE             │                                                      │
│  • Navigatie     │   ⠿ = versleepbaar (volgorde wijzigen)              │
│  • Footer        │                                                      │
│                  │                                                      │
│ BEHEER 🔒 admin  │                                                      │
│  • Gebruikers    │                                                      │
└──────────────────┴──────────────────────────────────────────────────────┘
```

## 2. Sidebar-menu — de volledige boom

| Groep | Item | Type | Wat Reza er doet |
|---|---|---|---|
| **Content** | **Pagina's** | collectie (14 docs) | Hét werkgebied: per pagina de hero, de block-volgorde en alle teksten/foto's |
| **Bouwstenen** | Diensten & Prijzen | collectie (4 docs) | Prijzen + dienst-omschrijvingen — één wijziging werkt overal door |
| | Methodes | collectie (8 docs) | Het integratieve palet — kan er een 9e bij |
| | Publicaties | collectie (3 docs) | Kennisinstituut-artikelen — kan groeien |
| **Media** | Mediabibliotheek | collectie (upload) | Foto's uploaden, alt-teksten, focal point |
| **Site** | Navigatie | global | Menu-labels + CTA-knoptekst |
| | Footer | global | Tagline, adres, KVK, Maps-link |
| **Beheer** 🔒 | Gebruikers | collectie (auth) | Alleen zichtbaar voor admin (Chris/Kick) |

## 3. Data-architectuur

### 3.1 De Pagina's-collectie (kern van het systeem)

Gemodelleerd naar het officiële website-template:

| Veld | Type | Toegang |
|---|---|---|
| `titel` | text — admin-lijstweergave (`useAsTitle`) | Reza ✅ |
| `slug` | slugField() — bepaalt de URL | alleen admin (route-wijziging = code-impact op nav/links) |
| **Tab Hero** | group — type-select + velden (zie §3.2) | Reza ✅ |
| **Tab Inhoud** | `layout` — **blocks-veld**, catalogus in §3.3, versleepbare volgorde | Reza ✅ |
| **Tab SEO** | metaTitel (max 60), metaOmschrijving (max 160) — plugin-seo-patroon | Reza ✅ |
| versies | `versions: { drafts: true }` + autosave | — |
| live preview | `admin.livePreview` → echte pagina-render | — |
| access | `create`/`delete`: **alleen admin** · `read`: publiek gepubliceerd · `update`: editor+admin | — |

De 14 bestaande pagina's worden geseed met hun exacte huidige sectie-volgorde (mapping in §3.4) — na de seed is de site pixel-identiek.

**Frontend-rendering:** één `RenderBlocks`-component mapt block-slug → bestaand sectie-component (de JSX uit handboek §5/§7, ongewijzigd). Nieuwe block-types = nieuw component + block-config = codewerk van Kick.

### 3.2 Hero-types (Hero-tab, select bepaalt welke velden zichtbaar zijn)

| Type | Gebruikt op | Velden |
|---|---|---|
| `homeHero` | Home | titelVoor + accentwoord, subLabel, introZin, foto, cta1 {label, doel}, cta2 {label, doel} |
| `paginaHero` | alle overige pagina's | titel (met accentwoord-veld), subtitel, foto, focus-positie (via focal point op media), cta {label, doel}, secundaireCta (optioneel) |
| `kopHeader` | Kennismaking | pillLabel, kop (met accentwoord), introAlinea, achtergrondFoto |

### 3.3 De block-catalogus (goedgekeurde sectie-types)

Elk block = één bestaand sectie-component. Reza kan deze blocks binnen een pagina toevoegen, herordenen en verwijderen; de catalogus zelf uitbreiden is code (Kick). Veld-patronen (kop-met-accent, CTA-select, foto-met-alt, item-arrays met min/max, textarea's zonder opmaak) zoals gedefinieerd in §3.5.

| # | Block | Waar nu in gebruik | Velden (kern) |
|---|---|---|---|
| 1 | `introSplit` | home-intro, methodiek "wat is", coaching-intro, wininstituut-oorsprong, kennisinstituut-methodiek, weerbaarheidsmentor basis/wortels, ontwikkellijn-intro | kop (met accent), quote (optioneel), alinea's[1–3], foto, fotoStijl (select: standaard / quote-kaart-overlay / cirkel / kader), fotoPositie (links/rechts) |
| 2 | `kaartenGrid` | 4 domeinen (home/methodiek/coaching/wininstituut), palet, pijlers kennisinstituut, resultaten opleidingen | kop, introZin, bron (select: handmatig / collectie Methodes), items[] {titel, omschrijving, icoon (select uit vaste set)}, kolommen (select: 3/4) |
| 3 | `quoteBand` | home-statement, methodiek-samenhang, opleidingen-intro-quote, mentorschap-intro-quote | stijl (select: navy-band / kaart-met-goudrand / gecentreerd-licht), quote, accentdeel, toonWaardedriehoek (checkbox — labels Zin·Betekenis·Vrijheid vast in code) |
| 4 | `herkenningSplit` | home "Herken je dit?", coaching lijf&brein, methodiek lijf&brein, weerbaarheidsmentor "regie", wininstituut lijf&brein | kop, introZin, items[3–5] {titel (optioneel), tekst}, afsluiter (optioneel), cta (optioneel), foto |
| 5 | `ontwikkellijnBand` | methodiek, coaching, aanbod, mentorschap, ontwikkellijn (5 varianten) | stijl (select: navy-kaarten / bronze-kaarten / cirkels-op-lijn / verspringend / uitgebreid), introZin, fasen[4] {omschrijving, subItems[0–2]} — fase-titels vast in code |
| 6 | `dienstenKaarten` | aanbod | introvelden — kaarten renderen uit collectie **Diensten & Prijzen** |
| 7 | `trajectenKaarten` | coaching | kop, kaarten[3] {label, titel, omschrijving, dienst (relatie → Diensten & Prijzen voor de prijs), doel} |
| 8 | `checklistKaart` | coaching "voor wie" | kop, items[3–5] {tekst} |
| 9 | `contrastKolommen` | organisaties probleem/oplossing | kolomLinks {koptitel, items[4] {titel, omschrijving}}, kolomRechts {idem} |
| 10 | `pijlersDrieluik` | organisaties drie pijlers | kop, introZin, pijlers[3] {titel, punten[4]} |
| 11 | `fotoLabelsSplit` | organisaties incompany, aanbod begeleidingsvormen | kop, alinea, items/labels[2–3] {groot, klein} of {titel, omschrijving}, foto, badgeTekst (optioneel) |
| 12 | `donkerPaneel` | mentorschap exclusiviteit, organisaties rouw&verlies | stijl (select: bronze-skew / navy-centered), eyebrow, kop, alinea, kolommen/kaarten[2] {titel, items[] of tekst} |
| 13 | `bentoGrid` | opleidingen gebieden, weerbaarheidsmentor "wat het brengt" | kop, subLabel, kaarten[4] {titel, omschrijving, accent (select: navy/goud/wit)} |
| 14 | `genummerdeLijst` | opleidingen leeraanpak, coaching resultaat, mentorschap oplevert | kop, accentregel (optioneel), items[3–4] {titel, omschrijving}, foto (optioneel), stijl (select: navy-band / licht) |
| 15 | `badgesRij` | weerbaarheidsmentor expertise, opleidingen "voor wie"-rollen | kop, badges[4–8] {label, subLabel (optioneel)} |
| 16 | `tabelSectie` | weerbaarheidsmentor transformatie-domeinen | kop, kolomkoppen[2], rijen[3–8] {kolom1, kolom2} |
| 17 | `progressieCirkels` | wininstituut Weerbaarheid→Groei→Leiderschap | kop, afsluitQuote — stappen vast in code |
| 18 | `fotoKaartenRij` | wininstituut pijler-kaarten | kaarten[3] {titel, omschrijving, linkTekst, doel, foto} |
| 19 | `publicatiesGrid` | kennisinstituut | kop — items renderen uit collectie **Publicaties** |
| 20 | `calloutBand` | kennisinstituut → weerbaarheidstherapie.nl | kop, alinea, knopLabel, externeUrl (alleen admin editbaar) |
| 21 | `investeringBlok` | mentorschap | eyebrow, kop, rationale, dienst (relatie → Diensten & Prijzen voor de prijsregel) |
| 22 | `verwachtingenLijst` | kennismaking | kop, items[3] {titel, tekst} |
| 23 | `agendaPlaceholder` | kennismaking | kop, tekst, statusLabel — vervalt bij echte agenda-integratie |
| 24 | `ctaBand` | alle eind-CTA's | stijl (select: navy / goud / cream / charcoal), kop (met accent), alinea, cta {label, doel}, secundaireCta (optioneel), disclaimer (optioneel) |

*De catalogus wordt in de Plan-fase definitief: waar twee huidige secties 95% overlappen worden ze één block met een stijl-select; waar consolidatie het design zou vervormen blijven het aparte blocks. Regel: een block rendert altijd een bestaand, goedgekeurd component — nooit vrije opmaak.*

### 3.4 Seed-mapping — pagina → hero + block-volgorde (huidige site, uit handboek §7)

| Pagina | Hero | Block-volgorde bij seed |
|---|---|---|
| Home | homeHero | introSplit · kaartenGrid(domeinen) · quoteBand(navy+driehoek) · herkenningSplit(+CTA) |
| Methodiek | paginaHero | introSplit · kaartenGrid(domeinen) · kaartenGrid(bron: Methodes) · herkenningSplit(lijf&brein) · ontwikkellijnBand(navy) · introSplit(mentor) · kaartenGrid(waardedriehoek, 3 kol) · ctaBand(navy) |
| Aanbod | paginaHero | ontwikkellijnBand(cirkels) · dienstenKaarten · fotoLabelsSplit(begeleidingsvormen) · ctaBand(cream) |
| Coaching | paginaHero | introSplit · kaartenGrid(domeinen) · herkenningSplit(lijf&brein) · ontwikkellijnBand(bronze) · checklistKaart · trajectenKaarten · genummerdeLijst(resultaat) · ctaBand(navy) |
| Mentorschap | paginaHero(portret) | quoteBand(intro) · introSplit(anders moet) · donkerPaneel(exclusiviteit) · introSplit(anders maakt) · ontwikkellijnBand(verspringend) · genummerdeLijst(oplevert) · investeringBlok · ctaBand(cream) |
| Opleidingen | paginaHero | quoteBand(kaart) · badgesRij(rollen) · bentoGrid(gebieden) · genummerdeLijst(leeraanpak) · kaartenGrid(resultaten) · ctaBand(cream-kader) |
| Organisaties | paginaHero | quoteBand(statement) · contrastKolommen · pijlersDrieluik · fotoLabelsSplit(incompany) · donkerPaneel(rouw&verlies) · ctaBand(wit-kaart) |
| Over WIN | paginaHero | introSplit(oorsprong) · kaartenGrid(domeinen) · herkenningSplit(lijf&brein) · progressieCirkels · badgesRij(doelgroepen) · fotoKaartenRij · ctaBand(charcoal) |
| Weerbaarheidsmentor | paginaHero | introSplit(intro) · herkenningSplit(regie) · bentoGrid(wat het brengt) · introSplit(basis) · introSplit(wortels) · badgesRij(expertise) · tabelSectie · ctaBand(navy) |
| Kennisinstituut | paginaHero | quoteBand(intro) · introSplit(methodiek) · kaartenGrid(pijlers) · calloutBand · publicatiesGrid · quoteBand(samenwerking) · ctaBand(cream) |
| Ontwikkellijn | paginaHero | introSplit · ontwikkellijnBand(uitgebreid) · introSplit(integratief) · kaartenGrid(voor wie, 3 kol) · genummerdeLijst(fundament) · ctaBand(goud) |
| Kennismaking | kopHeader | verwachtingenLijst · agendaPlaceholder |

*(+ 2 reserve-slots: nieuwe pagina's die Kick bouwt verschijnen hier automatisch bij.)*

### 3.5 Herbruikbare veld-patronen (in elk block hetzelfde)

| Patroon | Velden | Bescherming |
|---|---|---|
| **Kop met goud accent** | `tekstVoor` + `accentwoord` + `tekstNa` | Goud/underline-effect zit in code; Reza kiest alleen wélk woord |
| **CTA-knop** | `label` (max 40) + `doel` (select uit vaste routes) | Geen vrije URL's — dode links onmogelijk; styling in code |
| **Foto** | relatie → Mediabibliotheek | Alt verplicht op media-item; focal point; component bepaalt crop |
| **Item-lijst** | array met `minRows`/`maxRows` | Design-kritische aantallen afgedwongen (bv. exact 4 fasen) |
| **Alinea** | textarea (plat) | Geen rich text in site-teksten; inline goud-accenten zijn code |
| **Stijl-select** | select met vaste opties | Reza kiest uit goedgekeurde varianten, nooit vrije styling |

Merk-vaste woorden zijn **géén veld**: Zin·Betekenis·Vrijheid, de domeinnamen (Fysiek/Mentaal/Sociaal/Emotioneel) en de fasenamen (Fundamenteren/Stabiliseren/Versterken/Leiderschap) staan in code; hun *omschrijvingen* zijn editbaar (handboek §2).

### 3.6 Overige collecties

**Diensten & Prijzen** (`diensten`, 4 docs): naam, route (select), kaartOmschrijving, **prijsLabel** (bv. "Vanaf € 2.000,- per traject" — dé plek voor prijswijzigingen, werkt door op /aanbod, /coaching, /mentorschap), prijsDetail, linkTekst, volgorde. Verwijderen: alleen admin.

**Methodes** (`methodes`, 8 docs): titel (max 60), omschrijving (max 300), volgorde. Reza mag toevoegen/verwijderen — het grid rendert elk aantal.

**Publicaties** (`publicaties`, 3 docs): titel, themaLabel, foto, volgorde, inhoud (richText — voor latere detailpagina's). Reza mag toevoegen.

**Mediabibliotheek** (`media`, upload → **Vercel Blob**): alt (verplicht), credit (optioneel), focal point aan, automatische image sizes. Bij migratie worden de bestaande 44 portretten + 27 locatiefoto's + losse beelden geïmporteerd.

**Gebruikers** (`gebruikers`, auth): naam, email, rol (admin/editor). Alleen admin.

### 3.7 Site-globals

**Navigatie**: hoofdmenuLabels[7] {label}, meerMenuLabels[3] {label}, ctaKnopLabel, inloggenLabel — routes en volgorde zijn code.
**Footer**: tagline, adresRegel1/2, mapsUrl, kvkNummer, copyrightSuffix.

## 4. Functionaliteiten

| Functie | Hoe het werkt voor Reza |
|---|---|
| **Concept & publiceren** | Elke wijziging is eerst concept (`versions.drafts`); site verandert pas bij "Publiceren". Status altijd zichtbaar. |
| **Versie-historie** | Elke publicatie = versie; één klik terugrollen. Kick ziet de volledige log. |
| **Live preview** | Split-screen: velden links, échte pagina met concept-inhoud rechts (template-patroon `admin.livePreview`). |
| **Blocks herordenen** | Slepen in de Inhoud-tab; toevoegen via "+ Sectie toevoegen" uit de catalogus; inklapbaar (`initCollapsed`). |
| **Autosave** | Concepten worden tussentijds automatisch bewaard. |
| **Direct live** | Publiceren → `afterChange`-hook → `revalidatePath` van de route (template-patroon `revalidatePage`) — binnen seconden live, geen deploy. |
| **Mediabibliotheek** | Drag-and-drop, zoeken, alt verplicht, focal point, automatische formaten, opslag Vercel Blob. |
| **NL-interface** | Volledig Nederlands admin-panel; veld-labels/hulpteksten in NL met merkregel-hints (bv. bij quotes: "verbatim — handboek §3"). |
| **WIN-branding** | Logo + titel via `admin.meta` en component-overrides (sub-skill `admin-ui`). |
| **API's** | Local API (site zelf), REST + GraphQL automatisch beschikbaar voor later. |

## 5. Rollen & rechten-matrix

| Actie | Reza (`editor`) | Chris/Kick (`admin`) |
|---|---|---|
| Teksten/foto's in blocks wijzigen (concept) | ✅ | ✅ |
| Blocks herordenen / toevoegen / verwijderen binnen een pagina | ✅ (uit catalogus; versies als vangnet) | ✅ |
| Publiceren & terugrollen | ✅ | ✅ |
| Media uploaden/vervangen | ✅ | ✅ |
| Diensten/prijzen wijzigen | ✅ | ✅ |
| Methodes/Publicaties toevoegen & verwijderen | ✅ | ✅ |
| **Pagina's aanmaken/verwijderen** | ❌ (collectie-access: alleen admin — nieuwe pagina's via Kick/Claude Code) | ✅ |
| Slug/URL wijzigen | ❌ (veld-access) | ✅ |
| Diensten-documenten verwijderen | ❌ (design verwacht 4) | ✅ |
| Gebruikers beheren | ❌ (niet zichtbaar) | ✅ |
| Block-catalogus uitbreiden / velden / structuur / layout / styling | ❌ (bestaat niet in de UI — is code) | via code (G-Stack) |

Handhaving: collectie- + veld-level access control (`references/ACCESS-CONTROL.md`), rol in JWT (`saveToJWT`), `overrideAccess: false` waar namens een gebruiker wordt geopereerd.

## 6. Workflows

**Reza past een tekst aan (dagelijks):** Pagina's → pagina → block openen → veld wijzigen → Live voorbeeld → Publiceren. Binnen seconden live.

**Reza wil een sectie erbij op een bestaande pagina:** Inhoud-tab → "+ Sectie toevoegen" → block uit catalogus kiezen → invullen → voorbeeld → publiceren. Staat de gewenste sectie-soort er niet in? → Kick bouwt het block-type in code, daarna herbruikbaar op elke pagina.

**Reza wil een nieuwe pagina:** beschrijft het aan Kick/Chris → **Kick bouwt hem** (G-Stack: pagina-document + eventueel nieuwe block-types + nav-opname) → verschijnt in Reza's lijst, vanaf dan onderhoudt hij hem zelf.

**Er ging iets mis:** pagina → Versies → vorige versie herstellen. Kick ziet de volledige historie.

**Prijswijziging:** Bouwstenen → Diensten & Prijzen → prijsLabel → Publiceren → overal bijgewerkt.

## 7. Technische onderbouwing (waar dit leeft)

```
web/src/
├── app/(frontend)/[slug]/page.tsx   ← rendert pagina uit Payload: Hero + RenderBlocks
├── app/(payload)/admin/…            ← het admin-panel (deze spec)
├── blocks/                          ← per block: config.ts (velden) + Component.tsx (bestaande sectie-JSX)
├── heros/config.ts                  ← hero-types (§3.2)
├── collections/                     ← Paginas, Diensten, Methodes, Publicaties, Media, Gebruikers
├── globals/                         ← Navigatie, Footer
├── payload.config.ts                ← i18n: nl; sharp; db-postgres; storage-vercel-blob
└── payload-types.ts                 ← auto-gegenereerd
```

- **Structuur = het officiële website-template-patroon** (Pages + blocks + live preview + SEO + revalidate), ingevuld met WIN-componenten en -velden.
- **Database:** eigen Postgres-schema (`payload.*`) in Supabase — gescheiden van platform-drizzle.
- **Site leest via Local API** (`getPayload` → `payload.find({ collection: 'paginas', where: { slug } })`), types uit `payload-types.ts`.
- **Bestaande content** wordt eenmalig geseed volgens §3.4; daarna bewijst een pixel-diff QA dat de site identiek is gebleven.
- **Let op bij migratie:** de bestaande statische routes (`app/aanbod/page.tsx` e.d.) worden vervangen door de dynamische `[slug]`-route + seed; redirects zijn niet nodig (URL's blijven identiek).

## 8. Wat bewust NIET in het dashboard zit

- Geen vrije HTML/rich-text in site-teksten — platte velden; inline goud-accenten zijn code.
- Geen blocks buiten de goedgekeurde catalogus — nieuwe sectie-soorten zijn codewerk (Kick).
- Geen pagina's aanmaken/verwijderen of slugs wijzigen voor Reza — nieuwe pagina's via Claude Code.
- Geen vrije URL's op knoppen — selects met bestaande routes (uitz.: `calloutBand.externeUrl`, admin-only).
- Geen kleuren-, font- of spacing-instellingen — merkregels zijn code (handboek §4).
- Merk-vaste woorden (waardedriehoek, domeinnamen, fasenamen) zijn geen velden.
