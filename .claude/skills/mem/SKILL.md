---
name: mem
description: Vastleggen van een werksessie voor future Kick. Schrijft een memory-file in ~/.claude/projects/-Users-christianbleeker-Desktop-WIN/memory/, updatet de MEMORY.md index, en geeft Chris een kort overzicht van wat is vastgelegd. Gebruik deze skill wanneer Chris "mem", "/mem", "memory", "leg vast", of "update jezelf" zegt, of aan het eind van een doorslaggevend werkblok uit eigen beweging.
---

# /mem — Sessie vastleggen voor future Kick

## Wanneer gebruiken

- **Einde van een werksessie** die iets doorslaggevends heeft opgeleverd (nieuwe voorkeur, nieuwe afspraak, nieuw project-feit, referentie naar externe tool).
- **Op commando**: Chris zegt expliciet "mem" / "/mem" / "leg vast" / "update jezelf" / "remember this".

## Wat leg je vast (wel)

- **Feedback-patronen**: iets wat Chris 2+ keer corrigeerde, of eenmalig zo sterk dat herhaling zeker is.
- **Voorkeur-signalen**: toon, werkstijl, beslis-stijl, format.
- **Project-feiten**: wie doet wat, welke deadline, welk doel, welke blokkades.
- **Externe references**: "documentatie op X", "tickets in Y", "API-key voor Z geconfigureerd".
- **Surprising wins**: een aanpak die werkte tegen verwachting in — de waarde zit in het "waarom".
- **Harde regels**: elke keer dat Chris iets als "verplicht" of "niet-onderhandelbaar" markeert.

## Wat leg je NIET vast

- **Code-patterns, conventies, architectuur** → haalbaar uit de code zelf.
- **Git-history / wie wat wijzigde** → `git log` / `git blame` doen dat.
- **Debug-oplossingen** → zitten in commit-message + code.
- **Wat al in IDENTITY/USER/TOOLS/SOUL.md of CLAUDE.md staat** → één bron van waarheid.
- **Ephemeral taak-details** (in-progress werk, tijdelijke state).
- **Triviale dingen** waarvan je moet twijfelen of ze de moeite waard zijn — wanneer je twijfelt, skip je.

## Memory-types (kies één bij vastleggen)

| Type | Filename-prefix | Voor wat |
|---|---|---|
| `user` | `user_*.md` | Over Chris — rol, voorkeuren, hoe hij denkt |
| `feedback` | `feedback_*.md` | Correctie of validatie die future-Kick moet onthouden |
| `project` | `project_*.md` | Project-feiten, deadlines, decisions, motivations |
| `reference` | `reference_*.md` | Pointer naar externe bron (URL, folder, tool, skill-bundle) |

## Vaste structuur van een memory-file

```markdown
---
name: <korte naam voor dit memory-item>
description: <één-regel-beschrijving — wordt later gebruikt om relevantie te bepalen, dus concreet>
type: <user | feedback | project | reference>
---

<Lichaam van de memory. Max ~20 regels.>

**Waarom:** <de reden of het incident dat dit memory rechtvaardigt>
**Hoe toe te passen:** <wanneer/waar deze regel inschopt in toekomstige werk>
```

## Proces (volg exact)

### Stap 1 — Bepaal of vastleggen nodig is

Vraag: *"Is er iets uit deze sessie dat future-Kick mist als ik het nu niet opschrijf, en dat ik niet uit code/git/docs kan terugvinden?"*
- **Nee** → geen memory. Zeg eerlijk: *"Geen nieuwe memory nodig uit deze sessie — [reden]."* Klaar.
- **Ja** → door naar stap 2.

### Stap 2 — Kies type + bedenk filename

Filename: kort, beschrijvend, lowercase, underscores, met type-prefix.

Voorbeelden uit bestaande memory:
- `feedback_proactivity.md`
- `feedback_gstack_mandatory.md`
- `project_coaching_platform.md`
- `user_christian.md`
- `reference_stitch.md`

Bestaat al een memory-file die deze observatie afdekt? Dan updaten, niet dupliceren. Check `MEMORY.md` index eerst.

### Stap 3 — Schrijf de memory-file

**Locatie**: `~/.claude/projects/-Users-christianbleeker-Desktop-WIN/memory/<filename>.md`

Gebruik de frontmatter-structuur hierboven. Lichaam: maximaal ~20 regels. Langer = het is geen memory meer, het is een document — zet het dan in `docs/` en verwijs er vanaf de memory naar.

### Stap 4 — Update `MEMORY.md`

Pad: `~/.claude/projects/-Users-christianbleeker-Desktop-WIN/memory/MEMORY.md`

Als hij niet bestaat, maak 'm aan met alleen `# WIN Platform — Memory Index`.

Voeg één regel toe, ~150 chars max:

```markdown
- [Titel](filename.md) — één-zin-hook
```

Plaats de regel **semantisch** (onder relevante groep), niet chronologisch. Bij 100+ regels: prune dubbele/verouderde entries.

### Stap 5 — Rapporteer aan Chris

Kort, één zin:
> *"Vastgelegd in `<filename>` als `<type>`: <samenvatting in 1 zin>. MEMORY.md geüpdatet."*

**Niet** de volledige inhoud herhalen. **Niet** vragen of Chris het goed vindt. Als je twijfelde bij stap 1, had je daar moeten stoppen.

## Voorbeeld-interactie

**Chris:** "Ik vind het irritant als je 4 opties voorlegt bij kleine keuzes, gewoon je beste gok en doorpakken. Leg vast."

**Jij (activeert `/mem`):**
1. Stap 1 — ja, dit is een feedback-patroon dat future-Kick moet onthouden.
2. Stap 2 — type `feedback`, filename `feedback_best_gok_doorpakken.md`.
3. Stap 3 — schrijf file met de regel, Waarom (Chris's quote), Hoe toe te passen (kleine keuzes = beste gok + motivatie in 1 zin, geen opties-lijstje).
4. Stap 4 — regel toevoegen aan MEMORY.md onder feedback-sectie.
5. Stap 5 — *"Vastgelegd in `feedback_best_gok_doorpakken.md` als feedback: bij kleine keuzes geen opties-lijstje maar beste gok + korte reden. MEMORY.md geüpdatet."*

Klaar.
