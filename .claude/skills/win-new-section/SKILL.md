---
name: win-new-section
description: Adds a new section to any page on the WIN website following the established design conventions — proper color rhythm (cream/white/olive), Manrope headline + Inter body, py-24 vertical spacing, win-gold CTA buttons, rounded cards with shadow-xl. Use this skill whenever Chris or Reza says "voeg een sectie toe", "add a testimonial block", "nieuw blok op de coaching-pagina", "sectie voor [anything] op [page]", or when expanding any page with new content. Always consults win-brand-rules first so tone-of-voice and palette stay consistent.
allowed-tools: Read Edit Write Glob Grep
---

# WIN — Add a new section

Add a new section to any page (Home, Coaching, Mentorschap, etc.) following the existing WIN design language. Before writing any code, read `win-brand-rules` to check palette, typography, and tone-of-voice rules.

## Workflow

```
Task progress:
- [ ] Step 1: Read win-brand-rules (palette, typography, CTAs)
- [ ] Step 2: Read the target page to understand current section rhythm
- [ ] Step 3: Pick the right section variant (see library below)
- [ ] Step 4: Place the section in the JSX, keeping bg-color alternation
- [ ] Step 5: Verify — run win-deploy-check or at least `npm run build`
```

### Step 1 — Load brand rules

Read `.claude/skills/win-brand-rules/SKILL.md` to ground yourself in:
- Color tokens (`win-gold`, `win-olive`, `win-cream`, `win-charcoal`)
- Typography variables (`--font-headline` Manrope, `--font-body` Inter)
- Tone-of-voice rules (kalme kracht, third person avoided, triggerwoorden)
- CTA button patterns

### Step 2 — Read the target page

Read the full page file (e.g. `web/src/app/coaching/page.tsx`) to see:
- Current section rhythm (what background color ends the page?)
- Section spacing pattern (`py-24` default on WIN)
- Existing componenten die je kunt hergebruiken
- Max-width container pattern (`max-w-7xl mx-auto px-6`)

### Step 3 — Pick a variant from the library

Six proven section patterns on the WIN site. Copy the one closest to what you need, then adjust content.

#### Variant A: Hero band (full-screen, background image)

Use for page tops. Alternates dark photo + gold accent badge + large Manrope headline.

See `web/src/app/page.tsx` lines 15-58 for the canonical implementation.

#### Variant B: 2-column intro (text + portrait)

Left: lead copy with underlined gold keyword. Right: portrait with gold quote-card overlay. Use for "about" or methodiek-introductions.

See `web/src/app/page.tsx` lines 60-105.

#### Variant C: 4-card grid (icons + title + copy)

White background, 4 equal cards on lg, cream card color, gold icon backplate that fills on hover.

See `web/src/app/page.tsx` lines 107-179 (the "4 Domeinen" section).

#### Variant D: Dark quote band

Short band, `bg-win-olive` with white italic quote, 12px gold accent above, Zin·Betekenis·Vrijheid below.

See `web/src/app/page.tsx` lines 181-198.

#### Variant E: Split-card with CTA (checklist + photo)

Large rounded card on cream background. Left: H2 + 4 checkmark items + prominent gold CTA. Right: portrait with olive overlay.

See `web/src/app/page.tsx` lines 200-256 (the "Herken je dit?" section).

#### Variant F: Dense content band

Plain text section for long-form copy. White or cream background, single column, max-w-3xl, `py-24`.

Template:
```tsx
<section className="py-24 bg-win-cream">
  <div className="max-w-3xl mx-auto px-6 space-y-8">
    <h2 className="text-4xl md:text-5xl font-black text-win-olive font-[family-name:var(--font-headline)]">
      [Heading]
    </h2>
    <div className="w-20 h-1.5 bg-win-gold" />
    <p className="text-xl text-win-charcoal/80 leading-relaxed font-medium">
      [Lead paragraph — de zwaarste zin.]
    </p>
    <p className="text-lg text-win-charcoal/70 leading-relaxed">
      [Volgende paragraaf — context, nuance.]
    </p>
  </div>
</section>
```

### Step 4 — Place in JSX & keep the rhythm

The WIN section rhythm alternates backgrounds. When adding a section, check the background of the one **above** it in the JSX and the one **below**:

| Previous section bg | New section bg (rule of thumb) |
|---|---|
| `bg-win-cream` | `bg-white` or `bg-win-olive` |
| `bg-white` | `bg-win-cream` or `bg-win-olive` |
| `bg-win-olive` | `bg-win-cream` or `bg-white` |

Goal: readers' eyes rest between bands. Two `bg-win-cream` sections stacked breaks the rhythm.

### Step 5 — Verify

Quick local check:
```bash
cd /Users/christianbleeker/Desktop/WIN/web && npm run build 2>&1 | tail -15
```

Or invoke `/win-deploy-check` for the full gauntlet.

## Rules

- Never introduce new colors. Stick to `win-gold` / `win-olive` / `win-cream` / `win-charcoal` / white. Anything else → read `win-brand-rules`.
- Never introduce a new font. Manrope + Inter only.
- New H2s always use Manrope via `font-[family-name:var(--font-headline)]`.
- Mobile-first. Always test `md:` and `lg:` breakpoints. No desktop-only layouts.
- The section should work at 320px wide (iPhone SE) as well as 1440px.
- Replace `win-bronze` usage only on explicit approval — it's reserved, currently unused.
- Copy in Dutch. If placeholder English leaks in, Chris will ask Reza to review — flag it clearly.

## Tone check before finishing

Read the copy you wrote back aloud. Could Reza say this from kalme kracht? Does it avoid therapy-fluff and corporate buzz? If not, rewrite using the triggerwoorden list in `win-brand-rules`.

## Integratie met G-Stack

- **Vóór je bouwt** (bij grote nieuwe sectie met strategische vraag): draai eerst `/office-hours` om te challengen of de sectie wel nodig is, en `/plan-design-review` om de design-kant te auditen.
- **Voor visuele divergentie** (3-6 varianten genereren): gebruik Stitch MCP (zie memory: Stitch doet design, niet Claude) of `/design-shotgun` als secundair alternatief.
- **Na het bouwen**: draai `/design-review` om visuele issues te vangen (spacing, hierarchy, AI-slop patterns) en `/qa` om functioneel te testen. Dan pas `/ship`.
