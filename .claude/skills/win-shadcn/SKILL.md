---
name: win-shadcn
description: Werkprotocol voor alle UI-werk op het WIN-platform dat shadcn-componenten raakt — add, preview, customize, upgrade. Gebruik deze skill VOOR een nieuwe UI-feature je pagina of component raakt waar een shadcn-primitive voor is. Triggers — "voeg een [component] toe", "shadcn", "button/input/dialog/sheet/drawer/calendar/etc", "nieuwe form", "modal", "dropdown", "table", "tabs", "sidebar", "sonner toast". Consulteert win-brand-rules voor kleur/typografie zodat shadcn-primitives in WIN-stijl blijven. Raadpleegt shadcn MCP voor component-metadata in plaats van zelf te bedenken.
---

# win-shadcn — UI-werk op het platform

**Doel:** alle UI-primitives komen via shadcn. Ad-hoc `<button className="…">` = review-fail. Deze skill is het protocol dat ik volg vóór ik aan een UI-taak begin.

## Ground-truth

**Installed components** (`platform/src/components/ui/`, 47 stuks op 2026-04-24):

accordion · alert · aspect-ratio · avatar · badge · breadcrumb · button · button-group · calendar · card · carousel · checkbox · collapsible · command · context-menu · dialog · drawer · dropdown-menu · empty-state* · hover-card · input · input-group · input-otp · label · menubar · navigation-menu · page-header* · pagination · popover · progress · radio-group · resizable · scroll-area · select · separator · sheet · sidebar · skeleton · slider · sonner · switch · table · tabs · textarea · toggle · toggle-group · tooltip

`*` = WIN-project-specifiek, geen shadcn-primitive.

**Brand-tokens gebonden aan shadcn CSS-vars** (in `platform/src/app/globals.css`):

| Shadcn token | WIN-kleur |
|---|---|
| `--primary` | `#B8960C` (win-gold) |
| `--secondary` | `#4A4A2A` (win-olive) |
| `--foreground` | `#2C2C2C` (win-charcoal) |
| `--background` | `#F5F0E8` (win-cream) |
| `--card` | `#FFFFFF` |
| `--accent` | `rgba(184, 150, 12, 0.12)` (gold-tint) |

Dus `<Button variant="default">` = win-gold knop. Raak de mapping alleen aan als Reza/Chris een expliciete design-aanpassing wil.

## Workflow voor elke UI-taak

### 1) Check eerst — pak 'm niet opnieuw af

Voor elk component dat ik nodig heb:
- **Installed hierboven?** gebruik direct via `import { X } from "@/components/ui/<x>"`.
- **Niet geïnstalleerd?** add via de CLI:

```bash
cd platform && npx shadcn@latest add <naam> -y
```

Nooit handmatig een shadcn-bestand schrijven. Het is registry-code, niet project-code.

### 2) Component-info opvragen — shadcn MCP

`.mcp.json` heeft een `shadcn` server die `shadcn@latest mcp` runt (stdio). Gebruik 'm om:
- Lijst van beschikbare componenten te krijgen
- Source van een specifiek component te lezen
- Voorbeelden / demo-code te vinden
- Te zien welke dependencies een component nodig heeft

Liever dan zelf bedenken hoe `<Calendar>` werkt of van buiten te raden.

Als de MCP-tools niet in m'n context staan (fresh session), vraag ik ze via ToolSearch — query: `select:mcp__shadcn__*` of `mcp__plugin_shadcn_*`. De preciese tool-namen wijzigen soms; fetch ze just-in-time.

### 3) Project-stijl toepassen

Na installatie van een shadcn-component:
- **Raak het bestand alleen aan als de WIN-mapping het vereist.** Shadcn uses `bg-primary` → dat bindt al aan win-gold via globals.css. In 90% van de gevallen hoef je niets te patchen.
- **Extra variants** — voeg toe in `cva({ variants: { ... } })` binnen het component. Bv. `variant: { subtle: "bg-accent text-accent-foreground" }`.
- **Radius / spacing** — volg shadcn defaults. WIN-design is consistent met shadcn base radius 0.625rem.
- **NL tekst** — labels, placeholders, buttons in NL (zie win-brand-rules voor tone-of-voice).

### 4) Composities

Nieuwe composities (bv. "TrajectCard", "OpdrachtRow") → **aparte file** in `platform/src/components/<domain>/...`, niet in `ui/`. `ui/` is shadcn-registry-only.

Pattern:
```tsx
// platform/src/components/trajecten/traject-card.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TrajectCard({ traject }: { traject: Traject }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{traject.title}</CardTitle>
        <CardDescription>{traject.coach.name}</CardDescription>
      </CardHeader>
      <CardContent>…</CardContent>
    </Card>
  );
}
```

### 5) Forms — altijd via `<Form>` uit shadcn

Shadcn's `form.tsx` wraps react-hook-form + zod. Dit is onze form-baseline.

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
```

Voor server actions gebruik ik `useActionState` met `FormData` — compatible met shadcn's Form via een thin wrapper. Zie `platform/src/app/login/login-form.tsx` als referentie.

### 6) Feedback & errors

- **Toast** — gebruik `sonner` (al geïnstalleerd). Import `toast` uit `sonner`, niet uit `@/components/ui/sonner`. Wrap root layout met `<Toaster />` uit `@/components/ui/sonner`.
- **Inline form-errors** — gebruik `<FormMessage>` binnen `<FormField>`.
- **Loading states** — `<Skeleton>` voor lijsten, `<Spinner />` bestaat niet in shadcn → gebruik `Loader2` uit `lucide-react` met `animate-spin`.

### 7) Responsiveness

Shadcn-primitives zijn responsive-aware maar niet-mobile-first. Daarom:
- Mobiel = default styling; desktop via `md:` / `lg:` breakpoints.
- Voor dialogs op mobile: `<Drawer>` (slide-up) ipv `<Dialog>` (centered). Shadcn heeft beiden.
- Voor tables op mobile: wrap in `<ScrollArea>` OF gebruik card-list fallback (design choice, vraag Chris bij twijfel).

Zie ook `win-new-section` skill voor mobile-first section-ritme.

### 8) Upgrade / diff check

Periodiek (elke maand):
```bash
cd platform && npx shadcn@latest diff <component>
```

Toont of upstream registry updates heeft. Als Chris wil upgraden — preview diff, dan:
```bash
npx shadcn@latest add <component> -y --overwrite
```

Pas lokale aanpassingen terug toe (indien any).

## Never do

- **Geen custom Button/Input/Card/etc. schrijven** — gebruik shadcn. Als shadcn een variant mist, add hem in `cva()` of maak een wrapper-component in `components/<domain>/`.
- **Geen kleuren hardcoden** in component-bestanden — gebruik `bg-primary text-primary-foreground` etc. via de shadcn tokens.
- **Geen `@/components/ui/<x>` buiten `platform/` importeren** — als `web/` een shadcn-primitive nodig heeft, bouw `web/`'s eigen lichte versie OF verhuis naar `packages/ui` (grote beslissing, vraag Chris).

## Escalatie-trigger

Stop en vraag Chris als:
- Een design van Stitch shadcn-componenten mist (bv. custom animated-gradient button).
- Performance-probleem met een component (bv. `<Calendar>` laadt traag).
- Upstream breaking changes in shadcn CLI na een npm upgrade.
- Design-beslissing die brand-tokens raakt (dark-mode variants, accent-kleur).

## Integratie met G-Stack sprint

- **Think (`/office-hours`)**: besluiten welke interaction-patterns passen (dialog vs drawer, table vs card-list).
- **Plan (`/autoplan`)**: lijst componenten die de feature nodig heeft, markeer wat nog niet geïnstalleerd is.
- **Build**: deze skill.
- **Review (`/review`)**: checken dat nieuwe componenten niet hardcoded kleuren gebruiken; dat forms via `<Form>` gaan; geen duplicate primitives.
- **Test (`/qa`)**: mobile test op 375×667 (iPhone SE), daarna 1440×900 desktop.
- **Ship**: productie gebruikt dezelfde globals.css — geen surprises.
- **Reflect (`/mem`)**: nieuwe patterns die goed werkten (bv. "traject-card pattern") → memory voor hergebruik.

## Quick-reference

| Nodig | Shadcn primitive |
|---|---|
| Klik-actie | `button` |
| Tekst-input | `input`, `textarea` |
| Veld-label | `label` |
| Card | `card` |
| Tag/chip | `badge` |
| Modal (desktop) | `dialog` |
| Modal (mobile) | `drawer` |
| Slide-out panel | `sheet` |
| Dropdown | `dropdown-menu`, `select`, `combobox` (via `command`) |
| Keuzeschakelaar | `switch`, `checkbox`, `radio-group` |
| Datumpicker | `calendar` + `popover` |
| Navigatie | `tabs`, `breadcrumb`, `navigation-menu`, `sidebar` |
| Overlay-tips | `tooltip`, `hover-card`, `popover` |
| Feedback | `sonner` (toast), `alert`, `progress` |
| Skeleton | `skeleton` |
| Collapsible | `collapsible`, `accordion` |
| Table | `table` |
| Sort/filter | `command` (cmdk), `toggle`, `toggle-group` |
| Zij-navigatie | `sidebar` |

Als een use-case niet in deze tabel staat → shadcn MCP raadplegen, niet zelf bedenken.
