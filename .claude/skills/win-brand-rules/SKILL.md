---
name: win-brand-rules
description: Authoritative brand, design, and tone-of-voice rules for WIN (Weerbaarheids Instituut Nederland). Use this skill whenever editing any website copy, creating new sections, picking colors, choosing photos, writing CTAs, or deciding on typography. Use it even when the user hasn't explicitly asked about branding — any UI or copy work on the WIN site should consult this first to stay on-brand. Covers the waardedriehoek (Zin/Betekenis/Vrijheid), Reza's voice, the gold/olive/cream palette, Manrope/Inter typography, and the photo library.
user-invocable: true
---

# WIN — Brand & Design Rules

Authoritative rules for everything customer-facing on the WIN website. When in doubt about a color, a word, or a layout decision, the answer is in here.

## Merkfundament

**WIN = Weerbaarheids Instituut Nederland** — the institute of **Reza** for *Weerbaarheidstherapie*: an integrative approach combining coaching and psychophysical training. Target audience: professionals under always-on pressure, organizations looking to strengthen resilience.

### De waardedriehoek (central to every page)

Three words, always in this order, always together when referenced:

**Zin** · **Betekenis** · **Vrijheid**

(Purpose · Meaning · Freedom — but in Dutch copy, always use the Dutch terms.)

### Signature quotes

Use these verbatim where appropriate — they are Reza's own words:

- *"Weerbaarheid is niet het afstoten van druk, maar het absorberen ervan vanuit een kalme kern."*
- *"Lijf & Brein in lijn"* (the methodiek-byline)
- *"Wanneer deze vier domeinen in samenhang functioneren, ontstaat Weerbaarheid als stevig fundament voor duurzame groei en krachtig leiderschap."*

## Tone of voice

Reza speaks — and WIN writes — from **kalme kracht** (calm strength). Not hype, not therapy-fluff, not corporate. The reader should feel recognized, not sold to.

| Do | Avoid |
|---|---|
| Direct, second-person ("je blijft optimaal functioneren") | Third-person distance ("clienten ervaren vaak...") |
| Reflective-confrontational ("Herken je dit?") | Promotional ("Ontdek nu de beste oplossing!") |
| Dualisms (binnen/buiten, lijf/brein, prestatie/rust) | Listicles without a why |
| Short sentences alternated with longer reflective ones | Corporate buzz ("synergie", "holistisch" as filler) |
| Integratieve/filosofische woordkeuze (kalme kern, interne kompas, onwankelbaar fundament) | Clinical wellness-taal (mindful, self-care, boosten) |
| **Nederlands overal** — website is NL-only | English unless it's a term with no good NL equivalent |

### Triggerwoorden die goed werken

*kalme kracht · weerbaarheid · fundament · integratief · psychofysiek · binnenwereld · buitenwereld · kompas · lijf & brein · druk absorberen · waardendriehoek · frictie · automatische piloot · zin · betekenis · vrijheid*

### Woorden die misplaatst zouden voelen

*boosten · hacken · unlocken · mindset-shift · synergie · 10x · awesome*

## De 4 domeinen van Weerbaarheid

Any time we list the domains, use these names (no synonyms):

1. **Fysiek** — lichaamsbewustzijn, energiebeheer, fysieke stress-respons
2. **Mentaal** — cognitieve weerbaarheid, mindset, keuzes onder druk
3. **Sociaal** — verbinding, grenzen, leiderschap, gezonde professionele relaties
4. **Emotioneel** — emotionele intelligentie, interne kompas, regulatie

Always in this order: Fysiek → Mentaal → Sociaal → Emotioneel.

## Color palette

Defined in `web/src/app/globals.css` via Tailwind 4 `@theme inline`.

| Token | Hex | Tailwind utility | Usage |
|---|---|---|---|
| `win-gold` | `#B8960C` | `bg-win-gold` `text-win-gold` | Primary accent — CTA buttons, quote accents, icon fills, keyword underlines |
| `win-olive` | `#4A4A2A` | `bg-win-olive` `text-win-olive` | Headlines (H1/H2), dark bands, CTA hover state |
| `win-charcoal` | `#2C2C2C` | `text-win-charcoal` | Body text |
| `win-cream` | `#F5F0E8` | `bg-win-cream` | Default page background, section alternation |
| `win-bronze` | `#1A1A1A` | `bg-win-bronze` | Reserved — currently unused, only deploy on purpose |

### Rules

- **Never** use raw Tailwind color tokens like `bg-yellow-500` or `text-stone-700` in new code — use the WIN tokens. (The footer currently has a `hover:text-yellow-500` bug; that's wrong.)
- `win-gold` is the **only** color that should appear on a CTA button by default.
- Section rhythm: alternate `bg-win-cream` → `bg-white` → `bg-win-olive` (with white text) → `bg-win-cream`. This is the established rhythm on the homepage.
- Photos tinted with `bg-win-olive/20` overlay for emotional weight.

## Typography

Two fonts, both Google Fonts, both loaded in `layout.tsx` via `next/font/google`.

| Font | Variable | Role | Tailwind |
|---|---|---|---|
| **Manrope** | `--font-headline` | H1, H2, H3, H4 | `font-[family-name:var(--font-headline)]` |
| **Inter** | `--font-body` | Body, paragraphs, UI | Default (body) |

### Scale

- Hero H1: `text-5xl md:text-7xl lg:text-8xl font-black`
- Section H2: `text-4xl md:text-5xl font-black` or `font-extrabold`
- Section H3 (card titles): `text-2xl font-bold`
- Body lead: `text-xl font-light`
- Body default: `text-lg leading-relaxed`
- Small labels: `text-xs uppercase tracking-[0.3em] font-bold`

### Keyword accent

When highlighting a word inside an H2, use gold with a subtle underline:

```tsx
<span className="text-win-gold underline decoration-win-gold/30 underline-offset-8">
  binnenwereld
</span>
```

## Spacing, radius, shadows

| Rule | Value |
|---|---|
| Vertical section rhythm | `py-24` default, `py-16` for narrow bands |
| Max content width | `max-w-7xl mx-auto px-6` |
| Card radius | `rounded-xl` |
| Hero/feature radius | `rounded-2xl` or `rounded-3xl` |
| Button radius | `rounded-xl` |
| Shadows | `shadow-xl` default, `shadow-2xl` for featured cards — **no sharp corners anywhere** |
| Gold accent bar (under H2) | `<div className="w-20 h-1.5 bg-win-gold" />` or `w-12 h-1` on dark band |

## CTA-knop patterns

**Primary CTA (gouden knop, donker worden op hover):**
```tsx
<Link
  href="..."
  className="bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-win-olive transition-all shadow-xl"
>
  Ontdek de Methodiek
</Link>
```

**Secondary CTA (glas, op donkere achtergrond):**
```tsx
<Link
  href="..."
  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
>
  Over de Mentor
</Link>
```

**Nav CTA (klein, rechts in navigation):**
```tsx
<Link className="bg-win-gold text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-win-olive transition-colors">
  Gratis Kennismaking
</Link>
```

## Photos

Portrait images of Reza live in `web/public/images/portretten/` (44 photos, `20251206_Reza_{1..45}.jpg`). Location photos of Nimmerdor in `web/public/images/locatie/` (27 photos). Brand logos in `web/public/brand/`.

### Rules for picking portraits

- **Hero-scale portraits:** `20251206_Reza_1.jpg` (current homepage intro) is a strong default
- **Conversational / in-gesprek:** `20251206_Reza_10.jpg` (currently used in "Herken je dit?" section)
- **Apply a subtle effect** — `grayscale-[0.3] hover:grayscale-0` creates editorial depth
- **Overlay** — darker photos benefit from `bg-win-olive/20` overlay when used as backgrounds

### Rules for picking location photos

- Herfst-sfeer (warm oranje, bos) past bij de WIN-look — `nimmerdor 1.jpeg` is currently in the hero
- Location photos gain cinematic weight with `brightness-[0.7]` + gradient overlay

## Design rule of last resort

When something feels off-brand:

1. Is it **warm** (cream/olive/gold, never cold blues or neon)?
2. Does it speak **kalme kracht** (not hype, not therapy-fluff)?
3. Could Reza say this sentence out loud without cringing?
4. Does it honor **Zin · Betekenis · Vrijheid**?

If all four are yes, ship it. If one is no, redo.

## Integratie met G-Stack

Dit is de **authoritative source** voor alle WIN-design beslissingen. G-Stack design-skills moeten hier aan voldoen:

- `/design-consultation` — **Niet gebruiken** voor WIN (we hebben al een design-system; gebruik deze file). Alleen als Reza ooit een tweede merk naast WIN lanceert.
- `/design-shotgun` — Als je varianten genereert, geef deze regels als input zodat de varianten bínnen het palet/voice blijven. Voor WIN geldt: **Stitch MCP is primary** voor design-exploratie (zie memory); `/design-shotgun` is secundair.
- `/design-review` / `/plan-design-review` — Nuttig om een audit te doen **tegen deze regels**. Bij mismatch: kies voor de regels hier, pas de code aan.
- `/win-new-section` en `/win-copy-edit` lezen deze file automatisch als referentie.
