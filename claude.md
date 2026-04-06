# WIN — Weerbaarheids Instituut Nederland

Project context for Claude. Read this first whenever you start working in this repository.

## Wat is WIN?

**WIN = Weerbaarheids Instituut Nederland** — het instituut van **Reza** voor *Weerbaarheidstherapie*: een integratieve aanpak die coaching en psychofysieke training combineert. WIN richt zich op professionals die last hebben van always-on druk, verstoorde werk-privé-balans, en belichaamde stress, en helpt hen weer in contact te komen met **Zin (Purpose)**, **Betekenis (Meaning)** en **Vrijheid (Freedom)** — de "waardedriehoek".

- **Founder / domein-expert:** Reza
- **Technisch bouwer:** Christian Bleeker
- **Doelgroep van WIN:** Professionals onder druk, organisaties die weerbaarheid willen versterken
- **Tone of voice (extern):** Authentiek, krachtig, empathisch. Een expert die vanuit kalme kracht spreekt over transformatie en weerbaarheid.

## Wat bouwen we hier?

Een platform voor Reza dat bestaat uit twee delen:

1. **Public website** (`web/`) — marketing/services site met meerdere paginas (Home, Aanbod, Coaching, Mentorschap, Opleidingen, Organisaties, Kennisinstituut, Wininstituut, De Weerbaarheidsmentor, en subpaginas). Mobile-responsive, met WIN-branding.
2. **Admin dashboard** (`admin/`, nog niet aangemaakt) — login (Supabase Auth), Kanban CRM, projectbeheer, beeldbeheer. Eén centrale plek waar Reza zijn business runt.

## Folder layout

```
WIN/
├── .claude/
│   ├── settings.json
│   └── skills/
│       └── stitch/                ← google-labs-code/stitch-skills (vendored)
├── content/
│   └── webteksten/                ← 10 .docx bestanden met de echte website-teksten
│                                     (voor analyse: branding, tone-of-voice, sitemap)
├── docs/
│   └── superpowers/specs/         ← brainstorm- en design-specs per blok
├── web/                           ← Next.js public website
│   ├── public/
│   │   ├── images/
│   │   │   ├── portretten/        ← 44 foto's van Reza (20251206_Reza_*.jpg)
│   │   │   └── locatie/           ← 27 foto's van locatie Nimmerdor
│   │   └── brand/                 ← WIN logo's (transparant + witte achtergrond)
│   └── src/                       ← App Router code
├── admin/                         ← (later) admin dashboard
├── claude.md                      ← dit bestand
├── README.md
└── .gitignore
```

## Tech stack

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript
- **Component library:** shadcn/ui (te installeren)
- **Auth + DB:** Supabase (later, voor admin)
- **Design tooling:** Stitch (Google Labs) via de skills in `.claude/skills/stitch/`
- **Mobile-responsive:** verplicht overal, geen desktop-only views

> **BELANGRIJK over Next.js 16:** dit is een nieuwe major versie met breaking changes ten opzichte van eerdere training data. Voordat je Next.js code schrijft, lees `web/AGENTS.md` en raadpleeg `web/node_modules/next/dist/docs/` voor de actuele API. Niet blind vertrouwen op oude patterns.

## Beschikbare tools (MCP/skills)

- **Playwright** (`mcp__plugin_playwright_playwright__*`) — headless browser, screenshots, navigatie. Gebruik dit om de website te previewen, te testen of om beeldmateriaal te valideren.
- **Word document MCP** (`mcp__word-document-server__*`) — voor het lezen/parseren van de `.docx` bestanden in `content/webteksten/`.
- **context7** (`mcp__plugin_context7_context7__*`) — actuele library docs (Next.js, Tailwind, shadcn, Supabase). Gebruik dit altijd voordat je library-specifieke code schrijft, ook voor bekende libraries.
- **Stitch skills** — `.claude/skills/stitch/skills/` bevat 8 skills (stitch-design, stitch-loop, design-md, enhance-prompt, react-components, shadcn-ui, remotion, taste-design). Deze skills verwachten de Stitch MCP server. Wanneer er Stitch-werk komt: activeer de relevante skill via Read en volg het workflow.

## Werkwijze (per blok)

We bouwen dit project in blokken. Elk blok doorloopt:

1. **Brainstorm** — `superpowers:brainstorming` skill
2. **Spec** — `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
3. **Plan** — `superpowers:writing-plans` skill
4. **Uitvoering** — TDD waar mogelijk
5. **Review** — `superpowers:requesting-code-review`

**Blokken:**
- ✅ **Blok 1:** Setup & tooling — *deze scaffolding*
- ⏳ **Blok 2:** Content-analyse & branding — `.docx` parsen, sitemap, kleurpalet, tone-of-voice, beeldselectie
- ⏳ **Blok 3:** Public website (`web/`) — alle paginas, mobile-first, shadcn/ui
- ⏳ **Blok 4:** Admin dashboard (`admin/`) — Supabase auth, Kanban CRM, beeldbeheer

## Communicatie

- Christian spreekt **Nederlands**. Reageer in het Nederlands tenzij hij in het Engels schrijft.
- Technisch jargon mag in NL of EN — wat duidelijker is.
- Reza is de domein-expert; Christian is de technisch bouwer en de schakel naar Reza.

## GitHub

- Remote: `https://github.com/iamcoai/WIN.git`
- De huidige `gh` auth (`chris-co-creators-ai`) heeft pull-rechten maar nog **geen push**. Push moet apart geregeld worden.
