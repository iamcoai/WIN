# 01 — Overview: wat zijn skills en hoe laadt Claude ze?

> Verbatim citaten uit de officiële Anthropic docs, tenzij anders aangegeven.

## Definitie

> Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.
>
> — *Claude Code docs*

> Agent Skills are modular capabilities that extend Claude's functionality. Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant.
>
> Skills are reusable, filesystem-based resources that provide Claude with domain-specific expertise: workflows, context, and best practices that transform general-purpose agents into specialists. Unlike prompts (conversation-level instructions for one-off tasks), Skills load on-demand and eliminate the need to repeatedly provide the same guidance across multiple conversations.
>
> — *Agent Skills overview*

## Wanneer een skill maken?

> Create a skill when you keep pasting the same playbook, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact. Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it.
>
> — *Claude Code docs*

## Hoe invoke je een skill?

Twee manieren — afhankelijk van frontmatter:

| Invocation | Door wie |
|---|---|
| **Automatic** — Claude besluit op basis van `description` | Claude zelf |
| **Manual** — `/skill-name [args]` | Gebruiker |
| **Beide** (default) | Beide |

Gedragscontrole via frontmatter:
- `disable-model-invocation: true` — alleen gebruiker kan invoken (goed voor `/commit`, `/deploy`)
- `user-invocable: false` — alleen Claude kan invoken (goed voor background kennis)

## Progressive Disclosure — het kernmechanisme

Dit is hét ontwerpprincipe waar alles om draait:

> Progressive disclosure ensures only relevant content occupies the context window at any given time.

### De 3 levels

| Level | Wanneer geladen | Token cost | Inhoud |
|---|---|---|---|
| **1. Metadata** | Altijd (bij startup) | ~100 tokens per skill | `name` en `description` uit YAML frontmatter |
| **2. Instructions** | Wanneer skill triggert | Onder 5k tokens | SKILL.md body |
| **3. Resources** | On-demand | Effectief unlimited | Bundled files — scripts, references, assets |

> **Level 1: Metadata (always loaded).** Claude loads this metadata at startup and includes it in the system prompt. This lightweight approach means you can install many Skills without context penalty; Claude only knows each Skill exists and when to use it.
>
> **Level 2: Instructions (loaded when triggered).** When you request something that matches a Skill's description, Claude reads SKILL.md from the filesystem via bash. Only then does this content enter the context window.
>
> **Level 3: Resources and code (loaded as needed).** Claude accesses these files only when referenced. The filesystem model means each content type has different strengths: instructions for flexible guidance, code for reliability, resources for factual lookup.
>
> — *Agent Skills overview*

### Wat maakt progressive disclosure zo krachtig?

> **No practical limit on bundled content**: Because files don't consume context until accessed, Skills can include comprehensive API documentation, large datasets, extensive examples, or any reference materials you need. There's no context penalty for bundled content that isn't used.
>
> **Efficient script execution**: When Claude runs `validate_form.py`, the script's code never loads into the context window. Only the script's output consumes tokens.

## Voorbeeldflow — hoe een skill echt laadt

> 1. **Startup**: System prompt includes: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
> 2. **User request**: "Extract the text from this PDF and summarize it"
> 3. **Claude invokes**: `bash: read pdf-skill/SKILL.md` → Instructions loaded into context
> 4. **Claude determines**: Form filling is not needed, so FORMS.md is not read
> 5. **Claude executes**: Uses instructions from SKILL.md to complete the task

## Content lifecycle in een sessie

Kritiek detail dat vaak misgaat:

> When you or Claude invoke a skill, the rendered `SKILL.md` content enters the conversation as a single message and stays there for the rest of the session. Claude Code does not re-read the skill file on later turns, so write guidance that should apply throughout a task as **standing instructions** rather than one-time steps.
>
> — *Claude Code docs*

### Bij auto-compaction (als context vol raakt)

> Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens.

## Live change detection (Claude Code alleen)

> Claude Code watches skill directories for file changes. Adding, editing, or removing a skill under `~/.claude/skills/`, the project `.claude/skills/`, or a `.claude/skills/` inside an `--add-dir` directory takes effect within the current session without restarting.

**Let op:** een *nieuwe* `.claude/skills/`-folder aanmaken die er nog niet was bij sessiestart vereist wél een restart.

## Security waarschuwing

> We strongly recommend using Skills only from trusted sources: those you created yourself or obtained from Anthropic. Skills provide Claude with new capabilities through instructions and code, and while this makes them powerful, it also means a malicious Skill can direct Claude to invoke tools or execute code in ways that don't match the Skill's stated purpose.
>
> — *Agent Skills overview, "Security considerations"*

## Claude Code vs. Claude API vs. Claude.ai

| Surface | Custom skills? | Pre-built skills? | Notes |
|---|---|---|---|
| **Claude Code** (onze context) | ✅ filesystem-based | ❌ niet van toepassing | Alle skills via `.claude/skills/` of `~/.claude/skills/`. Plus features: invocation control, subagent execution, dynamic context injection. |
| **Claude API** | ✅ via `/v1/skills` endpoints | ✅ pptx, xlsx, docx, pdf | Vereist 3 beta headers. Skills runnen in code execution container (géén netwerk). |
| **Claude.ai** | ✅ upload zip via Settings | ✅ ingebakken | Skills per user, geen org-wide sharing. |

Voor WIN werken we **altijd in Claude Code** — dus filesystem-based.
