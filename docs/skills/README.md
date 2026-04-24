# Claude Code Skills — Reference Bundle

Officiële Anthropic documentatie over het bouwen van **Claude Code skills**, gesynthetiseerd uit de bron en verbatim geciteerd waar het ertoe doet. Alle 4 de bronnen zijn opgehaald op **2026-04-24** (datum fetch).

## Wat is dit en waarom staat het hier?

Skills zijn filesystem-based mappen met een `SKILL.md` die Claude automatisch gebruikt wanneer relevant, of die je handmatig invoket met `/skill-name`. Ze zijn dé manier om Claude Code consistent te laten werken aan repeterende taken zonder die instructies steeds opnieuw in CLAUDE.md of in een prompt te plakken.

Deze bundle is het geheugen voor toekomstige sessies: als Kick (ik) een nieuwe skill moet bouwen voor WIN, start ik hier.

## Bronnen

| # | Bron | URL |
|---|---|---|
| 1 | Claude Code skills (CLI-specific) | https://code.claude.com/docs/en/skills |
| 2 | Agent Skills — overview | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| 3 | Agent Skills — authoring best practices | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices |
| 4 | skill-creator skill (Anthropic's authoring workflow) | `~/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator/SKILL.md` |

## Leeswijzer

| Bestand | Inhoud | Wanneer lezen |
|---|---|---|
| [01-overview.md](01-overview.md) | Wat is een skill, hoe laadt Claude ze, 3-level progressive disclosure | Begin altijd hier |
| [02-skill-md-reference.md](02-skill-md-reference.md) | SKILL.md anatomie, volledig YAML frontmatter-schema, string substitutions, directory-structuur | Wanneer je een skill gaat schrijven |
| [03-best-practices.md](03-best-practices.md) | Concise writing, degrees of freedom, description-patterns, anti-patterns | Tijdens het schrijven, voor review |
| [04-authoring-workflow.md](04-authoring-workflow.md) | Draft → test → review → iterate | Voor grote/complexe skills |

## Kernregel

> **Keep `SKILL.md` under 500 lines.** Move detailed reference material to separate files.
>
> — *Claude Code docs, "Add supporting files"*

## Kernkennis in één zicht

**Locaties (hoger overrulet lager):**
1. Enterprise (managed settings)
2. Personal — `~/.claude/skills/<name>/SKILL.md`
3. Project — `.claude/skills/<name>/SKILL.md`
4. Plugin — namespace `plugin-name:skill-name`

**Minimum SKILL.md:**
```yaml
---
name: my-skill
description: Wat de skill doet EN wanneer hem te gebruiken. Claude kiest hierop.
---

Instructies in markdown...
```

**3 loading-levels:**
1. **Metadata** (naam + description) — altijd in context (~100 tokens per skill)
2. **SKILL.md body** — in context zodra skill triggert (<500 regels ideaal)
3. **Bundled resources** (scripts/, references/, assets/) — on-demand

**Voor WIN specifiek:** gebruik `.claude/skills/<name>/SKILL.md` in deze repo voor project-skills die we samen met Reza/Chris bouwen.
