# WIN — Weerbaarheids Instituut Nederland

Dit is de mono-repo voor **WIN — Weerbaarheids Instituut Nederland**, het
instituut van Reza voor *Weerbaarheidstherapie*: een integratieve aanpak
die coaching combineert met psychofysieke training, gericht op
professionals die hun weerbaarheid willen versterken.

De repo bevat twee Next.js-apps + shared content en docs.

## Repo-layout

```
WIN/
├── web/                         Public marketing site (win.nl)
│                                Next 16 + Tailwind 4 + App Router
├── platform/                    Coaching platform (app.win.nl)
│                                Next 16 + Tailwind 4 + BetterAuth
│                                + Drizzle + Supabase Postgres
├── content/webteksten/          Reza's brontekst (.docx) voor analyse
├── docs/
│   ├── superpowers/specs/       Per-blok design- en implementation-specs
│   ├── handoff/                 Session-handoffs voor cold-start
│   └── skills/                  Claude Code skills-referentie
├── scripts/                     Root-level tooling (Stitch generate, …)
├── .claude/                     Kick identity + WIN-skills + MCP config
│   ├── kick/                    IDENTITY / USER / TOOLS / SOUL
│   └── skills/                  win-brand-rules, -copy-edit, -deploy-check,
│                                -new-section, -supabase-mcp
└── .mcp.json                    MCP-server-config (Supabase, …)
```

## Workspaces

npm workspaces — installeer en draai altijd vanaf de root:

```bash
npm install                    # installs web + platform together
npm run dev:web                # http://localhost:3000
npm run dev:platform           # http://localhost:3001
npm run build                  # both workspaces
npm run lint                   # both workspaces
```

Per-app docs: [`web/README.md`](web/README.md) · [`platform/README.md`](platform/README.md).

## Tech stack

- **Next.js 16.2.4** + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS 4** (tokens in each app's `globals.css`, same palette)
- **BetterAuth** (email + password, Drizzle adapter) — platform only
- **Drizzle ORM** over `postgres-js` — platform only
- **Supabase** (hosted Postgres, hosted MCP for schema work) — dev project
  `ujlkvaxlmrsvzgmlakgn`, production project handled manually by Chris
- **Plug and Pay** (merchant PAT, tenant 45161) — enrollments layer in M1b
- **Stitch** (Google Labs) voor design-generatie via `.claude/skills/`

## Workflow

Kick (AI CTO-partner) werkt via de G-Stack sprint-flow:
**Think → Plan → Build → Review → Test → Ship → Reflect**.

Alle context leeft in `.claude/kick/`:

- `IDENTITY.md` — basis + scope
- `USER.md` — over Chris + decoder-protocol
- `TOOLS.md` — MCP-servers, skills, escalatie, deploy-config
- `SOUL.md` — trait-kalibratie + missie + kritieke regels

Persistente geheugens: `~/.claude/projects/-Users-christianbleeker-Desktop-WIN/memory/MEMORY.md`.

## Status

| Blok | Status |
|---|---|
| Setup & scaffolding | ✅ |
| Content-analyse & branding | ✅ |
| Public website (`/web`) | ✅ 8 pagina's live |
| Platform scaffold (PR 01) | 🚧 T1–T5 code-complete, T6–T7 wacht op DATABASE_URL |
| Platform design system (PR 02) | ⏳ |
| RBAC + sessions (PR 03) | ⏳ |
| Plug and Pay integration (PR 03b–e) | ⏳ |
| Client surface (PR 04–09) | ⏳ |
| Coach surface (PR 10–15) | ⏳ |
| Admin surface (PR 16–22b) | ⏳ |

Volledig bouwplan: `docs/superpowers/specs/2026-04-24-coaching-platform-implementation.md`.
