# Google Stitch — Expert Reference

> Alles in dit document komt uit officiële bronnen: de vendored `google-labs-code/stitch-skills` repo (59 files), de `@google/stitch-sdk` README op GitHub, de `@_davideast/stitch-mcp` README, en de officiële docs op `stitch.withgoogle.com/docs/`. Niets zelf bedacht.

---

## 1. Wat is Stitch?

Google Stitch is een **AI-powered design tool van Google Labs** die UI-screens genereert vanuit tekstprompts. Het levert:

- Volledige **HTML + Tailwind CSS** code per scherm
- **PNG screenshots** (via Google Cloud Storage)
- Design metadata (device type, design theme, afmetingen)

**URLs:**
- Web UI: `https://labs.google.com/stitch`
- Docs: `https://stitch.withgoogle.com/docs/`
- SDK: `https://github.com/google-labs-code/stitch-sdk`
- Skills: `https://github.com/google-labs-code/stitch-skills`

**Status:** Google Labs product (experimenteel, niet GA). Copyright 2026 Google LLC, Apache 2.0. Disclaimer: "This is not an officially supported Google product."

**Gratis** te gebruiken (geen pricing/quota informatie gevonden in docs).

---

## 2. MCP Server Setup (WIN project)

**Transport:** HTTP direct naar Google's endpoint
**URL:** `https://stitch.googleapis.com/mcp`
**Auth:** API key via `X-Goog-Api-Key` header
**Env var (SDK):** `STITCH_API_KEY`

### Geconfigureerd via:
```bash
claude mcp add stitch --transport http "https://stitch.googleapis.com/mcp" \
  --header "X-Goog-Api-Key: <key>" -s user
```

Opgeslagen in `~/.claude.json` (user scope, niet in git).

### Alternatieve methodes (niet gebruikt):
1. **`@_davideast/stitch-mcp proxy`** — npm wrapper met extra tools (build_site, get_screen_code, get_screen_image), OAuth of API key auth
2. **`@google/stitch-sdk` StitchProxy** — officiële SDK, programmatische MCP server via `StdioServerTransport`
3. **OAuth via gcloud** — `gcloud auth application-default login` + project ID

---

## 3. Beschikbare MCP Tools (12 stuks)

### Project Management
| Tool | Params | Return |
|------|--------|--------|
| `list_projects` | `filter?: "view=owned"` | Array van projecten |
| `get_project` | `name: "projects/{id}"` | Project details + designTheme |
| `create_project` | `title: string` | Nieuw project met ID |

### Design Generation
| Tool | Params | Return |
|------|--------|--------|
| `generate_screen_from_text` | `projectId`, `prompt`, `deviceType?` | Nieuw screen object |
| `edit_screens` | `projectId`, `selectedScreenIds[]`, `prompt` | Gewijzigd screen |
| `generate_variants` | `prompt`, `variantOptions`, `deviceType?`, `modelId?` | Array van screen varianten |

### Screen Management
| Tool | Params | Return |
|------|--------|--------|
| `list_screens` | `projectId` | Array van screens |
| `get_screen` | `projectId`, `screenId` | Screen details + downloadUrls |

### Design Systems
| Tool | Params | Return |
|------|--------|--------|
| `create_design_system` | `designSystem` | DesignSystem object |
| `update_design_system` | `designSystem` | Updated DesignSystem |
| `list_design_systems` | — | Array van design systems |
| `apply_design_system` | `selectedScreenInstances` | Array van screens met theme |

---

## 4. Device Types

```
"MOBILE" | "DESKTOP" | "TABLET" | "AGNOSTIC"
```

`DESKTOP` is de default in de stitch-loop voorbeelden.

---

## 5. Model IDs (voor edit/variants)

```
"GEMINI_3_PRO" | "GEMINI_3_FLASH"
```

---

## 6. Variant Options

| Field | Type | Default | Values |
|-------|------|---------|--------|
| `variantCount` | number | 3 | 1–5 |
| `creativeRange` | string | "EXPLORE" | "REFINE", "EXPLORE", "REIMAGINE" |
| `aspects` | string[] | all | "LAYOUT", "COLOR_SCHEME", "IMAGES", "TEXT_FONT", "TEXT_CONTENT" |

---

## 7. Design Theme (project metadata)

```json
{
  "designTheme": {
    "colorMode": "DARK",
    "font": "INTER",
    "roundness": "ROUND_EIGHT",
    "customColor": "#40baf7",
    "saturation": 3
  }
}
```

**Bekende enum-waarden (uit voorbeelden):**

| Property | Bekende waarden | Onbekend |
|----------|----------------|----------|
| `colorMode` | `"DARK"`, `"LIGHT"` | volledig |
| `font` | `"INTER"` | andere opties niet gedocumenteerd |
| `roundness` | `"ROUND_EIGHT"` | andere presets niet gedocumenteerd |
| `customColor` | Elke hex string | — |
| `saturation` | Integer (bijv. `3`) | range niet gedocumenteerd |

---

## 8. Screen Output

`get_screen` retourneert:
- `screenshot.downloadUrl` — PNG preview (Google Cloud Storage)
- `htmlCode.downloadUrl` — Volledige HTML/CSS source
- `width`, `height` — Afmetingen in pixels
- `deviceType` — DESKTOP, MOBILE, TABLET

**Belangrijk over screenshots:** De `screenshot.downloadUrl` serveert low-res thumbnails. Append `=w{width}` aan de URL (waar `{width}` de screen metadata width is) voor volledige resolutie.

**Belangrijk over HTML downloads:** Interne AI fetch tools kunnen falen op Google Cloud Storage domeinen. De skills bevatten een `fetch-stitch.sh` script dat `curl -L -f -sS --connect-timeout 10 --compressed` gebruikt voor redirects.

---

## 9. De Prompt Structuur die Stitch Verwacht

```
[Eén-zin vibe + doel van de pagina]

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web/Mobile, Desktop/Mobile-first
- Theme: Light/Dark, [stijl-descriptors]
- Background: [naam] (#hex)
- Primary Accent: [naam] (#hex) for [rol]
- Text Primary: [naam] (#hex)
- Buttons: [shape], [size]
- Cards: [roundness], [shadow]

**Page Structure:**
1. **Header:** ...
2. **Hero Section:** ...
3. **Content:** ...
4. **Footer:** ...
```

Stitch werkt beter met:
- **Descriptive natural language** ("Deep Ocean Blue (#1a365d) for primary CTAs") i.p.v. losse hex codes
- **Expliciete vibe-adjectieven** ("minimalist, generous whitespace, subtle elevations") i.p.v. vage termen ("modern, nice")

---

## 10. De `.stitch/` Werkmap

De skills verwachten deze mappenstructuur als "source of truth":

```
.stitch/
├── metadata.json     ← projectId + screen IDs (per page)
├── DESIGN.md         ← visueel design system in natural language
├── SITE.md           ← site visie, sitemap, roadmap
├── next-prompt.md    ← "baton" file voor de stitch-loop
└── designs/          ← gedownloade HTML + PNG per screen
    ├── home.html
    └── home.png
```

### metadata.json schema

```json
{
  "projectId": "6139132077804554844",
  "deviceType": "MOBILE",
  "designTheme": { ... },
  "screens": {
    "<page>": {
      "id": "...",
      "sourceScreen": "...",
      "x": 0, "y": 0,
      "width": 1440, "height": 900
    }
  }
}
```

---

## 11. DESIGN.md Formaat

```markdown
# Design System: [Project Title]
**Project ID:** [Insert Project ID Here]

## 1. Visual Theme & Atmosphere
(Mood, density, aesthetic philosophy)

## 2. Color Palette & Roles
(Descriptive Name + Hex Code + Functional Role)

## 3. Typography Rules
(Font families, weights, usage)

## 4. Component Stylings
* **Buttons:** Shape, color, behavior
* **Cards/Containers:** Roundness, elevation
* **Inputs/Forms:** Stroke style, background

## 5. Layout Principles
(Whitespace strategy, grid alignment)

## 6. Design System Notes for Stitch Generation
(Copy-paste block voor elke Stitch prompt)
```

---

## 12. Vendored Skills (8 stuks)

| Skill | Install | Doel |
|-------|---------|------|
| **stitch-design** | `npx skills add google-labs-code/stitch-skills --skill stitch-design --global` | Unified entry point: prompt enhancement, design system synthesis, screen generation/editing |
| **stitch-loop** | `npx skills add google-labs-code/stitch-skills --skill stitch-loop --global` | Autonome multi-page website bouw met baton-passing loop |
| **design-md** | `npx skills add google-labs-code/stitch-skills --skill design-md --global` | Analyseer Stitch projecten, genereer DESIGN.md |
| **enhance-prompt** | `npx skills add google-labs-code/stitch-skills --skill enhance-prompt --global` | Vage prompts → Stitch-geoptimaliseerde prompts |
| **react-components** | `npx skills add google-labs-code/stitch-skills --skill react:components --global` | Stitch designs → React/TypeScript component systeem |
| **remotion** | `npx skills add google-labs-code/stitch-skills --skill remotion --global` | Walkthrough video's genereren |
| **shadcn-ui** | `npx skills add google-labs-code/stitch-skills --skill shadcn-ui --global` | shadcn/ui integratie |
| **taste-design** | *(geen apart install commando)* | Premium anti-generic design system met strikte esthetiek |

### MCP Tool Prefix Discovery
Skills gebruiken dynamische prefix. Run `list_tools` om de prefix te vinden (bijv. `mcp_StitchMCP_`, `stitch:`, etc.). In onze setup met HTTP transport: de tools heten gewoon hun naam zonder prefix.

### Compatibele agents
Antigravity, Gemini CLI, Claude Code, Cursor

---

## 13. SDK Programmatische Toegang (`@google/stitch-sdk`)

```bash
npm install @google/stitch-sdk
```

### Basis gebruik

```typescript
import { stitch } from "@google/stitch-sdk";

// Project
const project = stitch.project("your-project-id");

// Generate
const screen = await project.generate("A login page with email and password fields");
const html = await screen.getHtml();
const imageUrl = await screen.getImage();

// Edit
const edited = await screen.edit("Make the background dark and add a sidebar");

// Variants
const variants = await screen.variants("Try different color schemes", {
  variantCount: 3,
  creativeRange: "EXPLORE",
  aspects: ["COLOR_SCHEME", "LAYOUT"],
});

// Design Systems
const ds = await project.createDesignSystem(designSystem);
const applied = await ds.apply(project.data.screenInstances);
```

### StitchProxy (MCP server)

```typescript
import { StitchProxy } from "@google/stitch-sdk";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const proxy = new StitchProxy({ apiKey: "..." });
const transport = new StdioServerTransport();
await proxy.start(transport);
```

---

## 14. Bronnen

- `@google/stitch-sdk` README: https://github.com/google-labs-code/stitch-sdk
- `@_davideast/stitch-mcp` README: https://github.com/davideast/stitch-mcp
- `google-labs-code/stitch-skills` repo: https://github.com/google-labs-code/stitch-skills
- Stitch docs: https://stitch.withgoogle.com/docs/
- SOTAAZ setup guide: https://www.sotaaz.com/post/stitch-mcp-guide-en
- SOTAAZ integration guide: https://www.sotaaz.com/post/stitch-mcp-integration-en
- Google Codelabs: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch
