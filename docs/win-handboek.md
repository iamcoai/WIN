# WIN — Het Handboek

> **Doel van dit document:** de volledige, geïndexeerde kennis van de WIN-website (`web/`) op één plek, zodat Kick nooit meer de hele site hoeft te herlezen om on-brand te werken. Elke sectie, elk component, elke dienst, elke prijs, elk woord. Bron: volledige code-read van alle 14 routes + componenten op 2026-07-13.
>
> **Status:** levend document. Bij elke structurele site-wijziging deze file mee-updaten. Skills worden hiervan afgeleid.

---

## 1. Identiteitskaart — de harde feiten

| Veld | Waarde |
|---|---|
| **Volledige naam** | Weerbaarheids Instituut Nederland (WIN) |
| **KVK** | 50946315 (in footer) |
| **Adres** | Zuiderinslag 8N, 3871 MR Hoevelaken (in footer, met Google Maps-link) |
| **Buiten-praktijk** | Het bos van Landgoed Nimmerdor — "waar de natuur de spiegel is voor jouw innerlijke proces" |
| **Grondlegger / gezicht** | **Reza** — "De Weerbaarheidsmentor®" (altijd mét ®-teken bij de merknaam) |
| **Kern-tagline footer** | "Hét Instituut voor Weerbaarheidstherapie & -coaching." |
| **Copyright-regel** | "© {jaar} Weerbaarheids Instituut Nederland. Integratief · Psychofysiek · Systemisch." |
| **Site-meta (default)** | Titel: "WIN — Weerbaarheids Instituut Nederland", template `%s \| WIN`. Description: "Opleiding, coaching & kennisinstituut voor Weerbaarheid, Groei & Leiderschap. Integratief & Psychofysiek. Lijf & Brein in lijn." |
| **Externe kennisbank** | https://weerbaarheidstherapie.nl (gelinkt vanaf /kennisinstituut) |
| **Taal** | Site is 100% Nederlands (`<html lang="nl">`) |
| **Contact** | Geen e-mail of telefoonnummer op de site. Enige conversiepad: /kennismaking (agenda-placeholder, Google Calendar volgt) |
| **Login-knop** | Verwijst naar `http://localhost:3002/login` — **dev-placeholder**, moet naar platform-URL bij livegang |
| **Geregistreerde merken (®)** | "De Weerbaarheidsmentor®" en "De WIN Ontwikkellijn®" |

## 2. Wie is WIN — merkfundament

**WIN** is het instituut van Reza voor **Weerbaarheidstherapie**: een integratieve, psychofysieke methodiek die coaching, therapie en fysieke training verweeft. Drie poten: **opleiding, coaching en kennisinstituut** — voor Weerbaarheid, Groei & Leiderschap.

**Doelgroep:** professionals, ondernemers en leiders die onder always-on druk presteren maar interne frictie ervaren; plus organisaties (HR & C-Suite) en professionals die zelf willen leren werken met de methodiek (coaches, trainers, begeleiders).

**Kernpropositie in één zin (homepage-hero):** *"De buitenwereld ziet succes, maar binnenin voel je de frictie. Wij helpen professionals de balans te herstellen tussen externe prestatie en interne rust."*

### De waardedriehoek — altijd in deze volgorde

**Zin · Betekenis · Vrijheid**

Met vaste omschrijvingen (methodiek-pagina):
- **Zin** — "Weer voelen waar je energie vandaan komt en waarom je doet wat je doet."
- **Betekenis** — "Handelen vanuit een innerlijk kompas, niet vanuit de automatische piloot."
- **Vrijheid** — "Kiezen vanuit een kalme kern, in plaats van reageren vanuit druk."

### De 4 domeinen van Weerbaarheid — altijd in deze volgorde

1. **Fysiek** — "Lichaamsbewustzijn, energiebeheer en het fysiek kunnen dragen van verantwoordelijkheid."
2. **Mentaal** — "Cognitieve weerbaarheid, mindset en het vermogen om heldere keuzes te maken onder druk."
3. **Sociaal** — "Verbinding, grenzen stellen en gezonde, effectieve professionele relaties."
4. **Emotioneel** — "Emotionele intelligentie, zelfregulatie en het volgen van je interne kompas."

*(Dit zijn de canonieke home/methodiek-omschrijvingen. Coaching en wininstituut hebben lichte variaties — zie §7.)*

### De WIN Ontwikkellijn® — de vier fasen

Canonieke versie (methodiek + coaching):

| # | Fase | Omschrijving |
|---|---|---|
| 01 | **Fundamenteren** | "Het herstellen van de basis. Rust, overzicht en het stoppen van de energetische lekkage." |
| 02 | **Stabiliseren** | "Het inbouwen van structuren en routines die jouw weerbaarheid dagelijks ondersteunen." |
| 03 | **Versterken** | "Groeien vanuit kracht. Het vergroten van je draaglast en het verfijnen van je impact." |
| 04 | **Leiderschap** | "Natuurlijk overwicht vanuit een geïntegreerd systeem. Rust in de storm." |

Sublijn op /aanbod: "Van herstel naar meesterschap". De Ontwikkellijn is "de rode draad door alles wat we doen" (/ontwikkellijn). Progressiemodel op /wininstituut: **Weerbaarheid → Groei → Leiderschap** ("Eerst jezelf leiden, dan pas de ander.").

### Het integratieve palet — de 8 methodes (methodiek-pagina)

"Geen protocol, maar maatwerk":

1. **NLP** — Neuro Linguïstisch Programmeren: inzicht in hoe gedachten, gevoelens en gedrag elkaar beïnvloeden.
2. **Organisatie- & familie-opstellingen** — systemisch werk dat onzichtbare patronen zichtbaar en hanteerbaar maakt.
3. **Therapeutisch & systemisch kickboksen** — psychofysieke training: via het lichaam mentale barrières doorbreken, grenzen voelen en stellen.
4. **Rouw- & verliesverweving** — verlies verwerken en verweven in je verhaal.
5. **Kracht- & conditietraining** — een sterk lichaam als fundament.
6. **Psychosociale begeleiding** — gesprekstherapie; wensen, grenzen en behoeften centraal.
7. **Koudetherapie** — kou en ademhaling om de stress-respons te reguleren.
8. **Positieve psychologie & gezondheid** — bouwen vanuit wat werkt.

### Wie is Reza — biografische feiten (alleen deze claimen)

- Meer dan **30 jaar praktijkervaring** in leidinggeven en bestuursfuncties (methodiek-pagina); expertise-badges op /weerbaarheidsmentor zeggen **"35+ jaar ervaring"**; /kennisinstituut zegt **"meer dan 40 jaar doorleefde ervaring in Weerbaarheid"**. ⚠️ Drie verschillende getallen op de site — bij nieuwe copy: niet zelf een getal kiezen, aan Chris/Reza vragen welke canoniek is.
- Ervaring in verschillende (sub)culturen, breedtesport en topsport.
- Internationale certificeringen in **NLP** (gecertificeerd NLP-trainer), **Weerbaarheidstherapie** en **mastercoaching**.
- **Psychofysiek sinds 1993**; achtergrond in **crisis- en verandermanagement**; **systeemwerk** (o.a. samengesteld gezin); organisaties (cultuur & teams).
- Persoonlijke oorsprong: "Als kind van een vader die me de waarde van discipline en innerlijke kracht bijbracht, leerde ik vroeg wat het betekent om te staan in de storm."
- Domeinen van transformatie (tabel /weerbaarheidsmentor): Persoonlijke Ontwikkeling · (Zelf)leiderschap · Relationele Samenwerking · Sport & Performance · Teams & Organisaties.

## 3. Tone of voice — hoe WIN schrijft

**Grondtoon: kalme kracht.** Geen hype, geen therapie-fluff, geen corporate. De lezer moet zich herkend voelen, niet verkocht.

| Doen | Vermijden |
|---|---|
| Direct, tweede persoon ("je blijft optimaal functioneren") | Derde-persoon-afstand ("cliënten ervaren vaak…") |
| Reflectief-confronterend ("Herken je dit?") | Promotioneel ("Ontdek nu de beste oplossing!") |
| Dualismen: binnen/buiten, lijf/brein, prestatie/rust, denken/voelen/handelen | Lijstjes zonder waarom |
| Korte zinnen afgewisseld met langere reflectieve | Corporate buzz ("synergie", "holistisch" als vulling) |
| Integratief-filosofische woordkeus (kalme kern, interne kompas, onwankelbaar fundament) | Klinische wellness-taal (mindful, self-care, boosten) |
| Nederlands, overal | Engels tenzij er geen goed NL-equivalent is |

**Triggerwoorden die de site draagt:** kalme kracht · weerbaarheid · fundament · integratief · psychofysiek · binnenwereld · buitenwereld · (interne/innerlijk) kompas · lijf & brein · druk absorberen · frictie · automatische piloot · always-on · zin · betekenis · vrijheid · regie · zelfregulatie · draagkracht/draaglast · belichaming/belichaamd · onderstroom · positionering · congruent · systeem/systemisch · rust in de storm · de waan van de dag · energetische lekkage · van Kennis naar Kracht · doorleefde ervaring · beklijven.

**Verboden woorden:** boosten · hacken · unlocken · mindset-shift · synergie · 10x · awesome — en alles wat als growth-hack-taal klinkt.

**Stijlpatronen in de copy:**
- Retorische spiegel-vragen als sectiekop: "Herken je dit?", "Voor wie is dit traject?", "Wanneer je merkt dat het anders moet."
- Quote-blokken in italics met goud accent, vaak als sectie-opener.
- De prijs van succes als terugkerend motief: presteren kost energie, masker ophouden, functioneren op wilskracht.
- Antithese-constructies: "Niet door harder te werken, maar door effectiever te zijn in je rust en je actie." / "niet vanuit wilskracht alleen, maar vanuit een fundament".
- U-vorm alleen op zakelijke pagina's (organisaties: "uw organisatie"; kennisinstituut: "Wilt u meer weten"). Alle persoonsgerichte pagina's: je/jij.

### Signature quotes (verbatim gebruiken, niets aan wijzigen)

| Quote | Waar |
|---|---|
| "Weerbaarheid is niet het afstoten van druk, maar het absorberen ervan vanuit een kalme kern." | home (gouden kaart), methodiek |
| "Lijf & Brein in lijn" | site-breed — dé merkbyline |
| "Wanneer deze vier domeinen in samenhang functioneren, ontstaat Weerbaarheid als stevig fundament voor duurzame groei en krachtig leiderschap." | home (navy band), methodiek |
| "Weerbaarheid is niet het vermogen om de storm te overleven, maar de kunst om de storm te gebruiken als brandstof voor je volgende stap." — Reza | wininstituut |
| "Bij WIN staan jouw wensen, grenzen en behoeften centraal. Wij bieden je veiligheid, begeleiding en ondersteuning waarmee je duurzame verbindingen opbouwt en versterkt." | methodiek (Reza-sectie) |
| "Je kunt blijven functioneren op pure wilskracht, maar tegen welke prijs?" | coaching (intro) |
| "Het bos van Nimmerdor is mijn buiten-praktijk, waar de natuur de spiegel is voor jouw innerlijke proces." | weerbaarheidsmentor |
| "Ik help professionals de weg terug te vinden naar hun eigen kern, zodat ze weer kunnen leiden vanuit rust in plaats van onrust." | weerbaarheidsmentor |
| "Wij werken daar waar patronen zichtbaar worden en verandering werkelijkheid is." | kennisinstituut |
| "Eerst jezelf leiden, dan pas de ander." | wininstituut |
| "Veel professionals beschikken over kennis, vaardigheden en ervaring, maar missen het vermogen om daadwerkelijk te begeleiden wat er onder de oppervlakte speelt." | opleidingen (intro-quote) |
| "Er komt een punt waarop inzicht niet meer voldoende is. […] scherpte, stabiliteit en innerlijke regie." | mentorschap (intro) |

## 4. Visuele identiteit — kleuren, typografie, vormen

### Kleurtokens (Tailwind 4 `@theme inline` in `web/src/app/globals.css`)

| Token | Hex | Gebruik |
|---|---|---|
| `win-gold` | `#B8960C` | Primair accent: CTA's, quotes, iconen, keyword-underlines. **Enige** kleur op een primaire CTA-knop. |
| `win-navy` | `#324355` | Headlines (H1/H2), donkere banden, CTA-hover. Het blauw uit het logo. |
| `win-charcoal` | `#2C2C2C` | Body-tekst. |
| `win-cream` | `#F5F0E8` | Default paginakleur (op `body`), sectie-afwisseling. |
| `win-bronze` | `#1A1A1A` | Bijna-zwart. In gebruik als donker band-alternatief (coaching Ontwikkellijn-band, mentorschap "Voor wie"-band, ontwikkellijn CTA-knop, aanbod fotokader). |
| `win-olive` | `#324355` | **Alias op navy** — legacy. Nooit in nieuwe code gebruiken. Groen is uit de brand. |

**Regels:** geen rauwe Tailwind-kleuren (`bg-yellow-500` e.d.) in nieuwe code; sectie-ritme afwisselen cream → wit → navy(band, witte tekst) → cream; foto's op donkere achtergrond krijgen `bg-win-navy/20` overlay; **geen groen, geen neon**.

### Typografie

| Font | Variable | Rol |
|---|---|---|
| **Manrope** | `--font-headline` | H1–H4 (globaal via CSS; in JSX expliciet `font-[family-name:var(--font-headline)]`) |
| **Inter** | `--font-body` | Body, UI (default op `body`) |

Beide via `next/font/google` in `layout.tsx`.

**Schaal:** Hero-H1 `text-5xl md:text-7xl lg:text-8xl font-black`; PageHero-H1 `text-4xl→lg:text-7xl font-black leading-[1.05]`; sectie-H2 `text-4xl md:text-5xl font-black/extrabold/bold`; kaart-H3 `text-2xl font-bold`; body-lead `text-xl font-light`; body `text-lg leading-relaxed`; micro-labels `text-xs uppercase tracking-[0.3em] font-bold` (goud).

**Keyword-accent in H2:** `<span className="text-win-gold underline decoration-win-gold/30 underline-offset-8">woord</span>`.

### Spacing, radius, schaduwen

- Sectie-ritme `py-24` (smalle band `py-16`, zware CTA-secties `py-32`/`py-40`); container `max-w-7xl mx-auto px-6` (subpagina's soms `px-8`).
- Radius: kaarten `rounded-xl`, feature/hero `rounded-2xl`/`rounded-3xl`, knoppen `rounded-xl` (subpagina-eind-CTA's gebruiken in praktijk vaak `rounded-full` pill). Geen scherpe hoeken.
- Schaduwen: `shadow-xl` default, `shadow-2xl` featured.
- Gouden accentbalk onder H2: `<div className="w-20 h-1.5 bg-win-gold" />` (op donker: `w-12 h-1`).

### Logo's (`web/public/brand/`)

- `win-logo-2026-trim.png` — **actueel**, gebruikt in nav (h-14) en footer (h-20, `brightness-0 invert` voor wit).
- `win-logo-2026.png` (ongetrimd), `win-logo-transparant.png`, `win-logo-wit.jpg` — legacy/reserve.
- Logo-alt: "WIN Instituut — Integratief, Psychofysiek, Systemisch".

### Fotobibliotheek

- **Portretten:** `web/public/images/portretten/20251206_Reza_{1..45}.jpg` — 44 stuks (geen 28; let op 2 afwijkende namen: `_16jpg.jpg` en `_33jpg.jpg`). Niet alle zijn schone solo's (`_1`, `_5`, `_14`, `_17`, `_22` zijn groeps-/scèneshots).
- **Locatie:** `web/public/images/locatie/` — 27 stuks, `nimmerdor {1..22}.jpeg` + varianten (`15a`, `bos 15b/c`, `2 kopie`, `SM post 5`). Herfstbos-sfeer = de WIN-look. Schoonste solo-hero's van Reza: `nimmerdor 1, 6, 8, 9, 11, 17, 18`.
- **Losse beelden:** `images/herken-je-dit.jpg` (Reza in gesprek, homepage), `images/lijf-brein-in-lijn.jpg` (methodiek).
- **Effecten:** `grayscale-[0.3] hover:grayscale-0` (editorial), `brightness-[0.6-0.78]` + gradient op hero's, `object-position` omhoog (bv. `center 22%`) zodat gezichten niet afsnijden.

## 5. Componenten (`web/src/components/`)

| Component | File | Wat het is |
|---|---|---|
| **Navigation** | `navigation.tsx` | Fixed top, `bg-white/95 backdrop-blur`, h-20. Hoofdbalk: Methodiek, Aanbod, Coaching, Mentorschap, Opleidingen, Organisaties, Over WIN. "Meer"-dropdown (hover): Kennisinstituut, De Mentor, Ontwikkellijn. Rechts: "Inloggen" (outline, → localhost:3002 ⚠️) + gouden CTA "Gratis Kennismaking" (→ /kennismaking). Mobiel: hamburger met alle links + Meer-sectie. |
| **Footer** | `footer.tsx` | `bg-stone-900`. 3 kolommen: logo+tagline / navigatie (2 sub-kolommen) / locatie met Maps-link. Onderbalk: copyright + KVK. Geen contactgegevens, geen socials, geen privacy/voorwaarden-links. |
| **PageHero** | `page-hero.tsx` | Standaard-hero voor álle subpagina's (niet home). Foto full-bleed `brightness-[0.78]`, navy-scrim links→rechts (`from-win-navy/90 via-45 to-5`) zodat titel links leesbaar is en Reza rechts vrij blijft. Titel links-uitgelijnd, subtitle met gouden border-l. Props: title (mag gouden span bevatten), subtitle, image, imagePosition (default `center 25%`), cta, secondaryCta. `eyebrow`-prop bestaat maar rendert niet meer. |
| **FeatureCard** | `feature-card.tsx` | Dé WIN-kaart voor alle grids: `bg-win-cream/50`, hover → wit + lift + shadow. Met icoon: gouden icon-box die op hover vult; zonder icoon: gouden streep die verbreedt. Export `domainIcons`: vaste iconen voor Fysiek (bliksem), Mentaal (lamp), Sociaal (mensen), Emotioneel (hart). |

### CTA-patronen

```tsx
// Primair (goud). Hover is per context: bg-win-navy (nav/kaarten) of bg-white + text-win-gold/navy (hero's)
<Link className="bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-win-navy transition-all shadow-xl" href="/kennismaking">Plan een GRATIS kennismaking</Link>
// Secundair (glas op donker)
<Link className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all" href="...">…</Link>
// Nav (klein)
<Link className="bg-win-gold text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-win-navy transition-colors" href="/kennismaking">Gratis Kennismaking</Link>
```

Standaard CTA-teksten: "Gratis Kennismaking" (hero's/nav), "Plan een kennismaking" (eind-secties), "Plan een GRATIS kennismaking" (home).

### Terugkerende sectie-bouwstenen (patronen, geen componenten)

- **Checklist-item**: gouden check-circle-svg + tekst (home "Herken je dit?", methodiek, coaching, mentorschap-resultaten).
- **Quote-kaart**: witte/gouden kaart met italic quote, vaak absoluut gepositioneerd over een foto.
- **Ontwikkellijn-grid**: 4 kaarten met groot vervaagd nummer rechtsboven (navy- of bronze-band) óf cirkels op een gouden lijn (aanbod) óf verspringende witte kaarten (mentorschap, ontwikkellijn).
- **Navy statement-band**: `py-16 bg-win-navy` met italic quote + Zin·Betekenis·Vrijheid-microlabels.
- **Eind-CTA-band**: donkere (navy/charcoal/goud) `py-32` band met grote kop + pill-knop.

## 6. Sitemap & informatie-architectuur

```
/                    Home — "Welkom bij WIN"
├── /methodiek       De methodiek achter Weerbaarheidstherapie (kern-uitlegpagina)
├── /aanbod          Overzicht 4 diensten + prijzen + begeleidingsvormen
│   ├── /coaching        Individueel + groep, trajecten & prijzen
│   ├── /mentorschap     Exclusief 1-op-1 (elite-tier)
│   ├── /opleidingen     Professionalisering (coaches/trainers/HR)
│   └── /organisaties    Incompany, HR & C-Suite, rouw & verlies
├── /wininstituut    "Over WIN" — origin story, progressiemodel, voor wie
├── /weerbaarheidsmentor  Personal brand-pagina Reza (De Weerbaarheidsmentor®)
├── /kennisinstituut Kennisinstituut — methodiekontwikkeling, publicaties, → weerbaarheidstherapie.nl
├── /ontwikkellijn   De WIN Ontwikkellijn® — de 4 fasen uitgediept
└── /kennismaking    Gratis kennismaking — conversiepagina (agenda-placeholder)
```

- **Hoofdnav (7):** Methodiek · Aanbod · Coaching · Mentorschap · Opleidingen · Organisaties · Over WIN. **"Meer" (3):** Kennisinstituut · De Mentor · Ontwikkellijn.
- **Footer-nav:** Navigatie (Aanbod, Coaching, Mentorschap, Opleidingen) + Meer (Organisaties, Kennisinstituut, De Mentor, Ontwikkellijn). Home alleen via logo. /methodiek en /kennismaking staan niet in de footer.
- **Alle PageHero-CTA's** → /kennismaking. Eind-CTA's onderaan pagina's wijken af (zie §9 quirks).
- Interne kruislinks: methodiek↔coaching, aanbod→alle 4 diensten, opleidingen/organisaties/mentorschap→/wininstituut ("ontdek de methodiek"), ontwikkellijn→coaching/opleidingen/organisaties, wininstituut→coaching/opleidingen/organisaties.

## 7. Pagina-index — elke pagina, elke sectie

### `/` — Home (`page.tsx`)
Meta: "Welkom bij WIN" · hero-foto `nimmerdor 1.jpeg` (h-screen, eigen hero, géén PageHero).
1. **Hero** — "Welkom bij WIN" (WIN in goud), sub "Weerbaarheids Instituut Nederland", propositie-zin, CTA's "Ontdek de Methodiek" (→/methodiek) + "Over de Mentor" (→/weerbaarheidsmentor), bounce-pijl.
2. **Intro** (cream) — H2 "Bij WIN herstellen we de verbinding tussen je *binnenwereld* en je buitenwereld." + "Lijf & Brein in lijn"-uitleg + portret `Reza_1` met gouden quote-kaart (kalme kern-quote).
3. **De 4 Domeinen** (wit) — FeatureCards met domainIcons, intro-zin "holistisch perspectief… onwankelbaar fundament".
4. **Progressie-statement** (navy band) — de "vier domeinen in samenhang"-quote + Zin·Betekenis·Vrijheid-labels.
5. **Herken je dit?** (cream, witte kaart + foto `herken-je-dit.jpg`) — 4 herkenningspunten (masker ophouden / innerlijke onrust / balans zoek / geblokkeerd door onbewuste patronen), afsluiter "Dit hoeft niet je standaard te zijn. Er is een weg terug naar kalme kracht." CTA "Plan een GRATIS kennismaking" → /kennismaking.

### `/methodiek` — Ontdek de Methodiek
Meta: "Ontdek de Methodiek" · hero `nimmerdor 1.jpeg`, titel "De **Methodiek** achter Weerbaarheidstherapie", sub "Lijf & Brein in lijn • integratief & psychofysiek".
1. **Wat is Weerbaarheidstherapie** — kalme kern-quote + uitleg: geen enkele techniek maar integratieve methodiek; hoofd (ratio), hart (gevoel), lichaam (actie); beweging "van **Kennis naar Kracht**". Portret `Reza_1`.
2. **De vier domeinen** — canonieke FeatureCards + samenhang-quote.
3. **Het integratieve palet** — de 8 methodes (zie §2).
4. **Lijf & Brein in lijn** — foto `lijf-brein-in-lijn.jpg` + 4 bullets (stress-signalen herkennen / psychofysieke training / NLP+systemisch in de praktijk / van inzicht naar belichaming).
5. **De WIN Ontwikkellijn** (navy band) — canonieke 4 fasen.
6. **De mentor achter de methodiek** — Reza-bio (30+ jaar, certificeringen) + "wensen, grenzen en behoeften"-quote. Portret `Reza_20`.
7. **Waardedriehoek** — Zin/Betekenis/Vrijheid-kaarten met vaste omschrijvingen.
8. **Eind-CTA** (navy) — "Ervaar de methodiek zelf." → knop "Plan een kennismaking" (⚠️ linkt naar /coaching).

### `/aanbod` — Aanbod
Meta: "Aanbod" · hero `nimmerdor 9.jpeg`, sub "Weerbaarheid ontwikkelen, verdiepen en verankeren".
1. **Ontwikkellijn-visual** — "De WIN Ontwikkellijn®", "Van herstel naar meesterschap", 4 cirkels op gouden lijn (verkorte fase-omschrijvingen).
2. **4 dienstenkaarten** (genummerd, met prijs — zie §8): Coaching / Mentorschap / Opleidingen / Organisaties.
3. **Vormen van begeleiding** (navy band) — Individueel (1-op-1) · Groepstrajecten · Incompany & Teams. Foto `Reza_11` met "Lijf & Brein in lijn"-overlay.
4. **Eind-CTA** (cream) — "Versterk je Weerbaarheid als fundament voor *Groei en Leiderschap* in werk, privé en leven." → /coaching, met disclaimer "Geheel vrijblijvend, gericht op jouw specifieke situatie."

### `/coaching` — Coaching
Meta: "Coaching" · hero `nimmerdor 2.jpeg`, titel "Weerbaarheid als **fundament** voor Groei en Leiderschap".
1. **Intro** — wilskracht-quote + always-on/frictie-verhaal. Foto `Reza_12`.
2. **Functioneren vanuit Weerbaarheid** — 4 domeinen (variant-omschrijvingen: "Belichaamde kracht…", "Focus, cognitieve flexibiliteit…", "Verbinding met de omgeving…", "Zelfregulatie, interne signalen…"), zonder iconen.
3. **Lijf & Brein in lijn** — 3 bullets. Foto `Reza_13`.
4. **De WIN Ontwikkellijn** (bronze band) — canonieke 4 fasen.
5. **Voor wie is dit traject?** — witte kaart: hoog presteren maar frictie/uitputting · automatische piloot · niet langer compenseren met discipline maar flow · weerbaarheid als strategisch kapitaal.
6. **Onze Trajecten** — 3 kaarten: **Solo trajecten** (Individueel, "Vanaf € 2.000,-"), **Groepstrajecten** (Samen Groeien, "Op aanvraag"), **Mentorschap** (Elite, navy kaart, "Vanaf € 5.000,- / 3 mnd" → /mentorschap).
7. **Het Resultaat** — 01 rust/minder ruis · 02 focus & besluitvorming · 03 stevige natuurlijke positionering · 04 zelfregulatie onder hoogspanning.
8. **Eind-CTA** (navy) — "Versterk je Weerbaarheid…" → ⚠️ /coaching (zichzelf).

### `/mentorschap` — Mentorschap
Meta: "Mentorschap" · hero **portret `Reza_14`** (enige dienst-hero met portret i.p.v. bos), titel "WIN Mentorschap".
1. **Intro-quote** — "Er komt een punt waarop inzicht niet meer voldoende is…"
2. **Wanneer het anders moet** — always-on prijs + belichaamde stabiliteit; 2 mini-kaarten "Always-on druk" / "Frictie".
3. **Dit is geen traject voor iedereen** (bronze band, skew-effect) — doelgroep: eindverantwoordelijken. Kolommen "Wie je bent" (Ondernemer/Eindverantwoordelijke · Senior Leadership · High-impact professionals) en "Wat je zoekt" (Werkelijke innerlijke rust · Mentorschap op niveau · Psychofysieke integratie).
4. **Wat mentorschap anders maakt** — coaching = gedrag/doelen, mentorschap = fundament van jouw zijn; FeatureCards "Psychofysiek" + "Integratief". Foto `nimmerdor 3.jpeg`.
5. **De Ontwikkellijn** — 4 verspringende kaarten (variant-teksten, o.a. "Leidinggeven vanuit een onwrikbaar innerlijk kompas").
6. **Wat dit je oplevert** (navy) — rust onder druk · scherpte in besluitvorming · stevigheid in positionering · duurzame energie. Rechts: "Lijf & Brein in lijn" — Reza (De Weerbaarheidsmentor®).
7. **Investering in Meesterschap** — "De instap voor WIN Mentorschap start vanaf **€5.000** voor een traject van 3 maanden." + rationale (1-op-1 beschikbaarheid van Reza).
8. **Eind-CTA** (cream) — "Werk op het niveau waar het verschil daadwerkelijk wordt gemaakt." → ⚠️ /mentorschap (zichzelf); secundair "Of ontdek de methodiek" → /wininstituut.

### `/opleidingen` — Opleidingen
Meta: "Opleidingen" · hero `nimmerdor 4.jpeg`, sub "Professionaliseren in integratief & psychofysiek werken…".
1. **Intro-quote** — "…missen het vermogen om daadwerkelijk te begeleiden wat er onder de oppervlakte speelt."
2. **Voor wie** — 6 rollen: Coaches · Begeleiders · Trainers · Leidinggevenden · HR Professionals · Mensgericht.
3. **Opleidingsgebieden (bento-grid, 4):** **Weerbaarheidstherapie & -coaching** (kernmethodiek, navy) · **NLP (wNLP)** (de WIN-benadering van NLP, belichaamde aanwezigheid) · **Systemisch werk en opstellingen** · **Integratief en psychofysiek werken** (gouden kaart).
4. **Leeraanpak: "Ervaren boven weten"** (navy) — 01 Experiential learning · 02 Zelfregulatie ("baken van rust") · 03 Werken met spanning. Foto `nimmerdor 5.jpeg` in cirkel.
5. **Resultaten** — Verdiept inzicht · Begeleidingsvermogen · Zelfregulatie · Congruent handelen.
6. **Eind-CTA** — "Klaar voor de volgende stap?"; opleidingen "starten op diverse momenten in het jaar op landgoed Nimmerdor" → ⚠️ /opleidingen (zichzelf). Geen prijzen, geen data, geen curriculum-detail op de site.

### `/organisaties` — Organisaties
Meta: "Organisaties" · hero `nimmerdor 6.jpeg`, eyebrow-concept "Voor HR & C-Suite".
1. **Intro-statement** — "Organisaties functioneren via mensen…"
2. **Contrast-sectie** — "Wanneer weerbaarheid ontbreekt" (Miscommunicatie · Vermijding · Overbelasting · Verlies van richting) vs "Versterkte weerbaarheid" (Innerlijke Rust · Positionering · Effectieve Samenwerking · Duurzaam Functioneren).
3. **De Drie Pijlers van Weerbaarheid** — **Leiderschap** (spanning dragen, richting houden, helder communiceren, veiligheid creëren) · **Teams en samenwerking** (verschillen hanteren, spanning reguleren, elkaar durven aanspreken, gezamenlijke verantwoordelijkheid) · **Cultuur en veiligheid** (gedrag bepaalt cultuur, duidelijkheid biedt houvast, verantwoordelijkheid nemen, echte verbinding).
4. **Incompany Trajecten** — geen one-size-fits-all; synthese van wetenschap + praktijk; labels "Deep Insight" (analyse van de onderstroom) + "Actionable" (directe toepassing op de werkvloer). Foto `nimmerdor 7.jpeg` + "Maatwerk dat beklijft".
5. **Rouw en Verlies in Organisaties** (navy, "Specialistische Expertise") — overlijden collega, reorganisaties, persoonlijk verlies; kaarten "Voor Leidinggevenden" + "Team Dynamiek". Unieke niche-expertise.
6. **Eind-CTA** — "Versterk Weerbaarheid in leiderschap, teams en organisatie." (u-vorm) → ⚠️ /organisaties (zichzelf); rechterpaneel "Direct Contact? / Neem contact op" zonder werkende link.

### `/wininstituut` — Over WIN
Meta: "Over WIN" · hero `nimmerdor 8.jpeg`, titel "WIN", sub "Opleiding, coaching en kennisinstituut voor Weerbaarheid, Groei, Leiderschap".
1. **Origin story** — "Doorleefde ervaring, professionele praktijk en meegegeven waarden." + storm-als-brandstof-quote (Reza).
2. **Integratief & Psychofysiek** — 4 domeinen (variant: "Het lichaam als kompas. Biofeedback…", "herprogrammeren van belemmerende overtuigingen", "de onderstroom herkennen en sturen").
3. **Lijf & Brein in lijn** — interne coherentie; bullets Onuitputtelijke Energie · Absolute Helderheid · Besluitvaardigheid. Foto `Reza_15`.
4. **Progressiemodel** (navy) — 3 groeiende cirkels: Weerbaarheid → Groei → Leiderschap + "Eerst jezelf leiden, dan pas de ander."
5. **Voor wie is het WIN?** — outside world domineert inside world; doelgroep-tegels: Ondernemers · Professionals · Leidinggevenden · Coaches & Trainers · Organisaties & Teams. Foto `nimmerdor 3.jpeg`.
6. **Drie pijler-cards met foto** — Coaching (`nimmerdor 2`) · Opleidingen (`nimmerdor 4`) · Organisaties (`nimmerdor 6`), elk met link.
7. **Eind-CTA** (charcoal) — "Versterk je Weerbaarheid." → /coaching.

### `/weerbaarheidsmentor` — De Weerbaarheidsmentor®
Meta: "De Weerbaarheidsmentor" · hero `nimmerdor 18.jpeg`, titel "De **Weerbaarheidsmentor**®", sub "Regie over Lijf & Brein". Ik-vorm (Reza spreekt zelf) — uniek op de site.
1. **Intro** — "Echte kracht ontstaat wanneer je stopt met overleven op karakter en begint te leiden vanuit *innerlijke stabiliteit*."
2. **Voor wie de regie *echt* wil pakken** — 4 herkenningen: Vastlopen in spanning · Presteren ten koste van energie · Blijven analyseren zonder verandering · Verantwoordelijkheid met onrust. Foto `nimmerdor 16` + Nimmerdor-quote.
3. **Lijf & Brein in lijn** (navy bento) — Rust & Stabiliteit ("kalm zenuwstelsel") · Helderheid in keuzes · Krachtig onder druk · Regie over energie.
4. **De Basis van Leiderschap** — psychofysieke aanpak: "nieuwste inzichten uit de neuropsychologie met eeuwenoude wijsheid over lichaamsbewustzijn"; tegels Fundament (Lijf & Brein) + Impact (Groei & Vrijheid). Cirkel-portret `Reza_18`.
5. **De Wortels van Weerbaarheid** — persoonlijke oorsprong (vader/discipline), crisis- en verandermanagement, kern-quote. Portret `Reza_20`.
6. **Ervaring en Expertise** — 6 badges: 35+ Jaar Ervaring · NLP Trainer Gecertificeerd · Psychofysiek Sinds 1993 · Crisis/Change Management · Systeemwerk Samengesteld gezin · Organisaties Cultuur & Teams.
7. **Domeinen van Transformatie** (tabel) — de 5 domeinen (zie §2, Reza-bio).
8. **Eind-CTA** (navy) — "Wil jij de regie terug…?" → knop "Plan een kennismaking met De Weerbaarheidsmentor®" → ⚠️ /weerbaarheidsmentor (zichzelf).

### `/kennisinstituut` — Kennisinstituut
Meta: "Kennisinstituut" · hero `nimmerdor 11.jpeg`, sub "Het fundament onder Weerbaarheidstherapie & -coaching".
1. **Intro** — "…gebouwd op meer dan 40 jaar doorleefde ervaring in Weerbaarheid."
2. **Weerbaarheidstherapie & -coaching** — verder dan cognitief inzicht; snijvlak neurologie, psychologie en systeemgericht werk; patronen-quote. Foto `nimmerdor 12` + "Lijf & Brein in lijn"-blok.
3. **De Rol van het Kennisinstituut** — FeatureCards: Methodiekontwikkeling · Kennisvertaling · Kwaliteit en borging.
4. **Call-out** (navy) — "Diepgaande methodiek" → externe knop **weerbaarheidstherapie.nl**.
5. **Inzichten & Publicaties** — 3 artikel-teasers (niet klikbaar): "De impact van onverwerkt verlies op weerbaarheid" (Emotionele Weerbaarheid) · "Het zenuwstelsel als kompas bij burn-out preventie" (Fysiologische Regulatie) · "De rol van het lichaam in professioneel leiderschap" (Psychofysiek Werken). Label "Lees Paper" zonder link.
6. **Samenwerking** (navy) — gedeelde expertise, interdisciplinaire dialoog.
7. **Eind-CTA** — "Zet de eerste stap naar verdieping" (u-vorm) → ⚠️ /kennisinstituut (zichzelf).

### `/ontwikkellijn` — De WIN Ontwikkellijn
Meta: "De WIN Ontwikkellijn" · hero `nimmerdor 17.jpeg`, titel "De WIN **Ontwikkellijn**", sub "Van functioneren op wilskracht naar leven en leiden vanuit rust, kracht en regie."
1. **Intro "Herstel de Samenhang"** — "Veel mensen functioneren ogenschijnlijk goed, maar doen dat op spanning, aanpassing of compensatie."
2. **De Vier Fasen van Transformatie** — uitgebreidste fase-teksten van de site, elk met 2 sub-items: 01 Fundamenteren (Inzicht in patronen · Lichaamsbewustzijn) · 02 Stabiliseren (Emotieregulatie · Stressbeheersing) · 03 Versterken (Grensbewaking · Authenticiteit) · 04 Leiderschap (Belichaamd leiden · Impact & Rust). ⚠️ Koppen zeggen "Phase 1 —" (Engels).
3. **Integratief en Psychofysiek** — "Praten over spanning lost de spanning in je zenuwstelsel vaak niet op." Lijf als ingang om het brein te informeren. Foto `Reza_22`.
4. **Voor wie is dit?** — inzicht volstaat niet meer; 3 tegels: interne frictie ondanks succes · leiden vanuit rust i.p.v. druk · fundament dat echt beklijft.
5. **Het Fundament van al onze Diensten** (navy) — Ontwikkellijn als rode draad → links Coaching/Opleidingen/Organisaties.
6. **Eind-CTA** (gouden band — enige op de site) — "Versterk je Weerbaarheid." → "Plan Kennismaking" (⚠️ → /coaching, bronze knop) + "Bekijk Aanbod" (→ /aanbod).

### `/kennismaking` — Gratis Kennismaking (conversiepagina)
Meta: "Gratis Kennismaking" · eigen header (geen PageHero): cream met `nimmerdor 1.jpeg` op 15% opacity, pill "WIN • Kennismaking", H1 "Plan je *gratis* kennismaking".
1. **Wat je kunt verwachten** — Een kalm, open gesprek ("Geen intakeformulier, geen verkooppraatje.") · Herkenning, geen oordeel · Een eerste richting.
2. **Agenda-placeholder** — dashed kaart "Online agenda volgt" met pulserende "Agenda in aanbouw"-indicator. ⚠️ Google Calendar-integratie moet hier nog in. Dit is het enige conversiemechanisme van de hele site.

## 8. Dienstverlening & prijzen — het commerciële overzicht

| # | Dienst | Voor wie | Vorm | Prijs (zoals op site) |
|---|---|---|---|---|
| 1 | **Coaching — solo traject** | Professionals met interne frictie | Individueel maatwerk, intensief | **Vanaf € 2.000,- per traject** |
| 2 | **Coaching — groepstraject** | Gelijkgestemden, "veilige high-end omgeving" | Groep | **Op aanvraag** |
| 3 | **Mentorschap** | Ondernemers/leiders met eindverantwoordelijkheid ("Elite", "Dit is geen traject voor iedereen") | Exclusief 1-op-1, strategisch, beschikbaar op afroep | **Vanaf € 5.000,- voor 3 maanden** (aanbod-pagina zegt "per kwartaal") |
| 4 | **Opleidingen** | Coaches, begeleiders, trainers, leidinggevenden, HR | 4 opleidingsgebieden, op landgoed Nimmerdor, "diverse startmomenten" | **Geen prijs op site** ("Voor coaches & therapeuten") |
| 5 | **Organisaties / incompany** | HR & C-Suite; leiderschap, teams, cultuur; niche: rouw & verlies | Maatwerk incompany | **"Maatwerk oplossingen"** — geen prijs |
| 6 | **Gratis kennismaking** | Iedereen | Vrijblijvend gesprek | **Gratis** |

Begeleidingsvormen (aanbod): **Individueel (1-op-1)** · **Groepstrajecten** · **Incompany & Teams**.

## 9. Bekende afwijkingen & technische schuld (belangrijk bij elke edit)

**Copy-inconsistenties:**
1. **Ervaringsjaren:** 30+ (methodiek) vs 35+ (weerbaarheidsmentor) vs 40 (kennisinstituut). Niet zelf harmoniseren zonder akkoord.
2. **Ontbrekende diakrieten** op meerdere subpagina's: "clienten", "barrieres", "geintegreerd", "creeren", "essentiele", "beinvloeden", "continuiteit", "geinteresseerd", "prive". Home/nieuwere secties zijn wél correct. Bij copy-edits: correcte NL-spelling aanhouden (ë, é).
3. **"Phase 1 —"** (Engels) in de fase-koppen op /ontwikkellijn — hoort "Fase" te zijn.

**Link-quirks (eind-CTA's die niet naar /kennismaking gaan):** methodiek→/coaching · coaching→/coaching (zichzelf) · mentorschap→/mentorschap (zichzelf) · weerbaarheidsmentor→/weerbaarheidsmentor (zichzelf) · organisaties→/organisaties (zichzelf) · kennisinstituut→/kennisinstituut (zichzelf) · opleidingen→/opleidingen (zichzelf) · ontwikkellijn→/coaching · wininstituut→/coaching · aanbod→/coaching. Alleen de PageHero's, de nav-CTA en de home-"Herken je dit?"-knop linken correct naar /kennismaking. **Bij elke pagina-edit: eind-CTA meteen naar /kennismaking richten (tenzij Chris anders beslist).**
4. "Meer"-dropdown-knop in nav heeft `aria-haspopup` maar werkt alleen op hover/focus-within — geen click-toggle.
5. Kennisinstituut "Lees Paper"-labels zonder links; organisaties "Direct Contact?"-paneel zonder werkende link.

**Styling-afwijkingen t.o.v. brand rules:**
6. Rauwe tokens in bestaande code: `hover:bg-yellow-600` (methodiek + coaching eind-CTA), `text-yellow-100` (ontwikkellijn CTA), veel `text-zinc-*`/`text-stone-*` als body-kleur op subpagina's. Regel: laten staan tot een pagina toch op de schop gaat, nooit kopiëren naar nieuwe code.
7. `win-bronze` is in de brand rules "reserved/unused" maar wordt feitelijk gebruikt (coaching-band, mentorschap-band, ontwikkellijn-knop, aanbod-kader). Realiteit: bronze = donker band-alternatief.
8. Subpagina-eind-CTA's zijn `rounded-full` pills i.p.v. `rounded-xl`; mentorschap gebruikt hoekige knoppen (geen radius). Bestaande realiteit, geen regel.

**Infrastructuur:**
9. Inloggen-knop → `http://localhost:3002/login` (platform-dev). Moet productie-URL worden vóór livegang.
10. /kennismaking heeft nog geen agenda — Google Calendar-integratie gepland.
11. Footer mist: privacybeleid, algemene voorwaarden, e-mail, telefoon, socials.

## 10. Tech-noten voor edits

- **Stack:** Next.js App Router (let op `web/AGENTS.md`: nieuwe Next-versie, docs in `node_modules/next/dist/docs/` lezen vóór code), Tailwind 4 (`@theme inline`), `next/font/google`.
- **Layout:** nav is `fixed` h-20; `main` heeft `pt-20`; hero-secties compenseren met `-mt-20` (home + PageHero). Nieuwe full-bleed hero's moeten dit patroon volgen.
- **Alle subpagina's gebruiken `PageHero`** behalve home en /kennismaking (eigen headers).
- **Alle kaart-grids horen `FeatureCard` te gebruiken** (consistentie-regel in het component zelf).
- **Metadata:** elke pagina exporteert `Metadata` met eigen title (template plakt "| WIN" erachter) en NL description.
- **Foto's:** altijd `next/image`, meestal `fill` + expliciete `object-position`; gezichten via `imagePosition`/`object-[center_2x%]` in het bovenste derde houden.
- Gerelateerde skills: `/win-brand-rules` (regels §3-4 in skill-vorm), `/win-new-section`, `/win-copy-edit`, `/win-deploy-check`, `/win-payload` (CMS-werk). Dit handboek is de bron; de skills zijn de afgeleiden.
- **CMS-traject (sinds 2026-07-13):** de site wordt editbaar voor Reza via Payload CMS — architectuur, fasen en beslissingen staan in `docs/payload/win-cms-architectuur.md`. Harde eis: dit handboek beschrijft de site zoals hij is en blijft; de CMS-koppeling mag niets aan design of copy veranderen (fase 3 eist een pixel-identieke QA-diff).
