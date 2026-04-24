---
title: "Kick — Tools, Architecture + Operational Protocols"
summary: "Alles operationeel: G-Stack sprint, skill-triggers, escalatie, runtime-configuratie, deploy-config."
read_when:
  - Bij sessie-start
  - Voor elke werkbeslissing waar architectuur of protocol aan de orde is
  - Voor elke onomkeerbare actie
owner: Kick
version: 1.0
created: 2026-04-24
---

# TOOLS.md — Architecture + Operational Protocols

## Deel 1 — Tools & Runtime

### Claude Code tools (standaard)
Read, Edit, Write, Bash, Glob, Grep, WebFetch, WebSearch, TaskCreate, Skill, AskUserQuestion, ToolSearch.

### MCP servers (actief voor WIN)
- **Playwright** — headless browser, backup voor `/browse`
- **Context7** — actuele library docs (Next.js 16, Tailwind 4, shadcn, Supabase, Plug-and-Pay SDK) — **altijd** raadplegen vóór library-specifieke code
- **Stitch** (Google Labs) — primary design-tool voor WIN, via HTTP MCP, API key geconfigureerd
- **Word document server** — voor `content/webteksten/*.docx` (blok 2 content-analyse)
- **GitHub** — PRs, issues, code search. Actieve gh-account voor MCP = `cocreatie` (token-scopes: gist, read:org, repo, workflow). Git push naar `iamcoai/WIN` vereist `gh auth switch -u iamcoai` vooraf — push gaat **niet** via MCP.
- **Supabase MCP** (hosted: `mcp.supabase.com/mcp`, project-scoped) — database werkt via de `win-supabase-mcp` skill. Bij sessie-start: `claude mcp list | grep supabase` om te verifiëren. Volledige reference: memory `reference_supabase_mcp`. **Nooit tegen prod.**
- **PostHog** — analytics (nog niet aangesloten, optie voor blok 4)
- **Notion / Gmail / Google Calendar / Google Drive** — Chris's productivity suite, beschikbaar voor toekomstige integraties

### Skills geïnstalleerd
- **WIN-custom (4):** `/win-brand-rules`, `/win-new-section`, `/win-copy-edit`, `/win-deploy-check`
- **G-Stack (40):** complete set incl. `/office-hours`, `/autoplan`, `/plan-*`, `/review`, `/investigate`, `/qa`, `/browse`, `/ship`, `/land-and-deploy`, `/canary`, `/cso`, `/careful`, `/freeze`, `/retro`, `/learn`, `/mem` (zelf-gebouwd, zie stap 4)
- **Meta (losse plugins):** `skill-creator`, `claude-md-management`, `graphify`, `superpowers:*`, `frontend-design`

Volledige doc: `/Users/christianbleeker/Desktop/WIN/docs/skills/`.

### Deploy configuratie (via `/setup-deploy`, commit b34b5c5)
- **Platform:** Vercel
- **Production URL:** `https://win-weerbaarheid.vercel.app` *(placeholder — bevestig bij project-aanmaak)*
- **Deploy trigger:** automatisch op push naar `main`
- **Health check:** HTTP 200 poll op productie-URL
- **Merge method:** squash
- **Pre-merge:** `cd web && npm run build` (via `/win-deploy-check`)

## Deel 2 — De G-Stack sprint (VERPLICHT voor development)

Dit is de harde, niet-onderhandelbare werkwijze voor elk stuk development op WIN. **Uitzonderingen staan onder deel 5.**

| # | Fase | Primaire skill | Wat ik concreet doe |
|---|---|---|---|
| 1 | **Think** | `/office-hours` | 6 forcing questions — challenge scope vóór één regel code. |
| 2 | **Plan** | `/autoplan` (of losse `/plan-*-review`) | CEO + design + eng + DX review; spec naar `docs/superpowers/specs/`. |
| 3 | **Build** | *(geen skill — code)* | Implementatie. TDD waar mogelijk (`superpowers:test-driven-development`). |
| 4 | **Review** | `/review` + `/cso` (security-gevoelig) | Staff-eng audit + OWASP/STRIDE bij auth/Supabase/credentials. |
| 5 | **Test** | `/qa` (of `/qa-only`) | Browse-based end-to-end, fixt bugs met atomic commits. |
| 6 | **Ship** | `/win-deploy-check` → `/ship` → `/land-and-deploy` → `/canary` | WIN-gauntlet → PR → merge+deploy → post-deploy monitoring. |
| 7 | **Reflect** | `/retro` + `/learn` + `/mem` | Wekelijks retrospectief + learnings + persistent memory via `/mem`. |

**Sessiestart-regel:** ik kondig de fase expliciet aan: *"Dit is een [frontend/backend/...]-taak. Ik start fase 1 — `/office-hours`."*

## Deel 3 — Alignment-protocol (wanneer ik pauzeer vóór ik bouw)

Ik schrijf geen code zonder alignment met Chris op richting. Triggers voor pauze:

1. **Enumerated choice**: meerdere valide paden die uit elkaar lopen in uitkomst (bv. Supabase RLS-strategie, state management library).
2. **Schema/data-wijziging met bestaande data**: additive ja/nee, migration-strategie.
3. **UX-afweging waar smaak telt**: copy, naming, flow-ordering.
4. **Scope-afbakening**: nu bouwen vs defer vs split.

Pauze-vorm: 2-4 opties met trade-offs, één aanbeveling met één-zin-reden. Via `AskUserQuestion` zodra de deferred tool geladen is.

## Deel 4 — Escalatie-triggers (ik stop en vraag)

Voor elke niet-triviale actie check ik deze punten. Match → stop, voorleg met aanbeveling.

1. **Geld/kosten** boven vooraf-afgesproken grens (bv. Supabase tier-upgrade, custom domein kopen).
2. **Externe communicatie** — publiek zichtbaar (PRs op public repos, social posts, mails naar Reza).
3. **Destructief / onomkeerbaar**: `rm -rf`, `DROP TABLE`, `git push --force`, delete van iets dat niet in git staat.
4. **Strategische pivot**: licentie, pricing, kern-architectuur-wissel.
5. **3 plausibele opties die ver uit elkaar liggen** — Chris's intuïtie nodig.

## Deel 5 — Uitzonderingen op de G-Stack sprint

Sprint **NIET verplicht** bij:
1. **Triviale edits** — typo fix, 1-karakter wijziging, comment toevoegen.
2. **Read-only explorations** — file lezen, grep, status checken.
3. **Meta-werk** — CLAUDE.md/identity/memory updaten, nieuwe skill bouwen (gebruik wel meta-skills zoals `claude-md-management` of `skill-creator` waar relevant).
4. **Documentatie-only** — README tweaks, docs/ bijwerken zonder codewijziging.
5. **Strategie-gesprekken** — brainstorm met Chris vóór er een build-opdracht uit komt.

**Bij twijfel → G-Stack toepassen.** Overhead 30 seconden; weggelaten review kost uren.

## Deel 6 — Memory-protocol

- **Bij sessie-start**: lees `~/.claude/projects/-Users-christianbleeker-Desktop-WIN/memory/MEMORY.md` als index, haal per relevante entry de file op.
- **Bij eind van doorslaggevend werkblok of op commando ("mem" / "/mem" / "leg vast")**: activeer de `/mem` skill en schrijf een memory-file. Details: `.claude/skills/mem/SKILL.md`.

## Deel 7 — Skill-triggers (hard, niet onderhandelbaar)

Vóór elke actie scan ik triggers. Match → laad skill via `Skill` tool vóór ik begin.

### Development-triggers (G-Stack)
- *nieuwe feature / nieuwe pagina / nieuwe component / nieuwe sectie / backend-route / integratie / user flow* → `/office-hours` → `/autoplan`
- *debug / error / fix dit / waarom werkt dit niet / wtf* → `/investigate`
- *review / check / pre-merge / look at my diff* → `/review`
- *visual audit / design check / dit ziet er scheef uit* → `/design-review` (+ `/win-brand-rules`)
- *test / qa / does this work* → `/qa` (of `/qa-only`)
- *ship / deploy / PR / push to main* → `/win-deploy-check` → `/ship`
- *merge + deploy / live brengen* → `/land-and-deploy`
- *security / auth / credentials / is dit veilig* → `/cso`
- *performance / page speed / lighthouse* → `/benchmark`
- *retro / wekelijkse review / hoe staat het ervoor* → `/retro`

### WIN-specifieke triggers
- *sectie toevoegen / block erbij / nieuw blok op pagina* → `/win-new-section`
- *copy / tekst / herschrijf / pas aan / headline* → `/win-copy-edit`
- *kleuren / fonts / merk / tone of voice* → `/win-brand-rules`
- *deploy-check / ready to ship / pre-deploy* → `/win-deploy-check`
- *supabase / database / schema / migratie / drizzle push / rls / policy / db-logs / types genereren / tabel toevoegen* → `/win-supabase-mcp`

### Meta-triggers
- *mem / memory / leg vast / update jezelf* → `/mem`
- *CLAUDE.md verbeteren / audit* → `claude-md-management:claude-md-improver`
- *skill bouwen / nieuwe skill* → `skill-creator:skill-creator`
- *safety / wees voorzichtig / prod mode* → `/careful` of `/guard`
- *freeze edits / alleen in deze folder* → `/freeze` / `/unfreeze`

## Deel 8 — Gedragsregels (altijd aan)

1. **Reference-first**: als er al iets bestaat (code, docs, memory), lees dat vóór ik iets nieuws bouw. Geen parallel-universum creëren.
2. **Context7 vóór library-code**: altijd MCP-docs raadplegen voor Next.js 16, Tailwind 4, shadcn, Supabase — zelfs voor bekende libraries.
3. **Stitch doet design**, Claude bouwt alleen wat Stitch oplevert (zie memory `feedback_stitch_designs`).
4. **Niet zelf bedenken bij research**: alles eerst lezen, letterlijk citeren, geen aannames invullen (memory `feedback_no_invention`).
5. **Geen eigen architectuur ongevraagd uitleggen** bij sessie-start. Start bij Chris's input, niet bij meta-uitleg.
6. **Geen handtekening** met mijn naam in output.
7. **Destructieve actie** = altijd expliciete bevestiging, geen uitzonderingen.
8. **Filename case matters**: op WIN is `claude.md` lowercase in git; `CLAUDE.md` werkt via macOS case-insensitive fs maar git commit vereist de echte filename.
