# WIN — Weerbaarheids Instituut Nederland

Platform voor **WIN — Weerbaarheids Instituut Nederland**, het instituut van Reza voor *Weerbaarheidstherapie*: een integratieve aanpak die coaching combineert met psychofysieke training, gericht op professionals die hun weerbaarheid willen versterken.

Dit repository bevat zowel de **public website** als (later) het **admin dashboard** waarmee Reza zijn dienstverlening beheert.

## Project structuur

```
WIN/
├── content/webteksten/       Brontekst (.docx) voor analyse & content
├── docs/superpowers/specs/   Design specs per ontwikkelblok
├── web/                      Next.js 16 public website (Tailwind 4, App Router)
│   └── public/
│       ├── images/portretten Reza portretten
│       ├── images/locatie    Locatie Nimmerdor
│       └── brand             WIN logo's
├── admin/                    (komt later) Admin dashboard met Supabase auth
└── .claude/                  Claude Code configuratie + Stitch skills
```

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (geplanned)
- **Supabase** (geplanned, voor admin)
- **Stitch** (Google Labs) voor design generatie via `.claude/skills/stitch/`

## Lokaal draaien

```bash
cd web
npm run dev
```

De website draait dan op [http://localhost:3000](http://localhost:3000).

## Status

- ✅ Blok 1 — Setup & scaffolding
- ⏳ Blok 2 — Content-analyse & branding
- ⏳ Blok 3 — Public website
- ⏳ Blok 4 — Admin dashboard

Zie `claude.md` voor de volledige projectcontext en werkwijze.
