---
name: win-copy-edit
description: Edits existing copy on the WIN website while preserving Reza's tone of voice (kalme kracht, integratief-psychofysiek, third-person avoided, Dutch). Use this skill whenever Chris or Reza asks to rewrite a headline, tighten a paragraph, sharpen a CTA, soften something that reads too salesy, translate a concept into WIN-language, or says "kun je deze tekst beter maken", "pas dit aan", "rewrite", "herschrijf", or similar. Always consults win-brand-rules for the voice rules and triggerwoorden.
allowed-tools: Read Edit Grep Glob
---

# WIN — Copy editing

Rewrite or refine copy on the WIN website without losing Reza's voice. The aim is not "marketing polish" — it's to make the copy feel more like Reza speaking from kalme kracht.

## Workflow

```
Task progress:
- [ ] Step 1: Read win-brand-rules (tone-of-voice, triggerwoorden, do/avoid)
- [ ] Step 2: Read the source passage in context (the full section, not just one sentence)
- [ ] Step 3: Diagnose — what's off? (tone? length? jargon? third person? Engelse woorden?)
- [ ] Step 4: Rewrite 1-3 variants
- [ ] Step 5: Present to Chris for review before editing the file
```

### Step 1 — Load the voice

Read `.claude/skills/win-brand-rules/SKILL.md`, focus on the "Tone of voice" section. Internalize:
- Second person (`je blijft`), not third person (`clienten ervaren`)
- Short sentence → longer reflective sentence rhythm
- Dualisms (binnen/buiten, lijf/brein, prestatie/rust)
- **Triggerwoorden:** kalme kracht, kompas, fundament, frictie, lijf & brein, binnenwereld, onwankelbaar, integratief, psychofysiek, kalme kern, automatische piloot
- **Misplaatste woorden:** boosten, hacken, unlocken, mindset-shift, synergie, 10x, awesome

### Step 2 — Read in context

One sentence cannot be edited well without the paragraph it lives in, and that paragraph cannot be edited well without the section purpose. Read the full section. Ask yourself:
- What is the emotional function of this block? (recognition? reassurance? invitation?)
- Which sentence carries the emotional weight? (Often the one before the CTA.)
- What's the next step the reader should take?

### Step 3 — Diagnose

Common diagnoses and the typical fix:

| Diagnosis | Fix |
|---|---|
| Reads as sales copy ("Ontdek nu!") | Remove urgency, add reflection |
| Too abstract / therapy-jargon | Replace with body-language ("lijf", "adem", "frictie") |
| Too long | Cut intensifiers ("heel", "echt", "ook") and connector-phrases |
| Corporate Dutch ("synergie", "holistisch") | Swap for integratief / in samenhang / geheel |
| Third person distance | Switch to `je` / `jij` |
| Reader has no clear next step | End with a concrete invitation, preferably sensory |
| English filler | Translate — NL overal, tenzij geen goed NL-equivalent bestaat |
| Misses the waardendriehoek | Weave in Zin / Betekenis / Vrijheid where natural |

### Step 4 — Rewrite

Produce 1-3 variants. For each:
- Aim for the same length as the original or shorter
- One variant should stick close to the original; one should take more liberty
- Mark the liberty-variant clearly so Chris can reject or embrace

**Voorbeeldstructuur:**

> **Origineel:**
> [verbatim]
>
> **Variant A (dichtbij origineel):**
> [herschreven versie, minimale aanpassing]
>
> **Variant B (meer ruimte):**
> [forsere rewrite, expliciet een aannemelijke andere richting]

### Step 5 — Present voor finale edit

Do **not** commit the edit to the source file before Chris confirms the variant. Copy is Reza's voice — Chris is the gatekeeper. Show the options, wait for sign-off, then `Edit` the file.

Exception: if Chris explicitly says "ga je gang en pas het direct aan", skip straight to edit.

## Anchor phrases die wij vaak terug willen zien

Reza-signature zinnen die, wanneer ze past in de context, meteen merk-congruent voelen:

- *"van je masker op te houden"* (over het kostbare functioneren)
- *"kalme kern"* (de ideale innerlijke staat)
- *"geen afstoten, maar absorberen"* (over druk)
- *"denken, voelen en handelen weer een lijn"* (de methodiek-aanpak)
- *"onwankelbaar fundament"* (waar de 4 domeinen naartoe werken)

Gebruik ze niet alle vijf tegelijk — maar één à twee per pagina houdt de voice herkenbaar.

## Ultra-kort CTA-regel

CTAs mogen één handelingsgericht werkwoord + één concreet zelfstandig naamwoord zijn. Max 7 woorden. Voorbeelden die werken:

- *"Plan een kennismaking"* (5 w)
- *"Ontdek de Methodiek"* (3 w)
- *"Over de Mentor"* (3 w)

Niet: *"Klik hier voor meer informatie"* (te generiek), *"Schrijf je nu in voor een transformatieve reis"* (te veel claim, te salesy).

## Wanneer je onzeker bent

Twee goede vragen:
1. Zou Reza dit zó hardop zeggen tegen een client op Nimmerdor?
2. Zou iemand die net besefte dat zijn masker wringt, zich hierin herkennen — of buitengesloten voelen?

Als het antwoord op beide ja is, is de copy goed.

## Integratie met G-Stack

- **Bij strategische copy-vragen** ("moeten we deze boodschap überhaupt vertellen?" / "wat is de 10-star versie van deze landingspage-claim?"): draai eerst `/office-hours` of `/plan-ceo-review` voordat je aan herformuleren begint. Copy-edit is oplossing-modus; `/office-hours` is probleem-modus.
- **Na grotere copy-revisies**: run `/qa` om te testen of de pagina's nog correct renderen en `/design-review` om te checken of het niet visueel verspringt (lengte-verschillen).
