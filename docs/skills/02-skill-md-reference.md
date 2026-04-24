# 02 — SKILL.md Reference

Alles wat je moet weten om een SKILL.md file correct te schrijven. Verbatim uit de officiële docs.

## Directory-structuur

```text
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

> The `SKILL.md` contains the main instructions and is required. Other files are optional and let you build more powerful skills: templates for Claude to fill in, example outputs showing the expected format, scripts Claude can execute, or detailed reference documentation. Reference these files from your `SKILL.md` so Claude knows what they contain and when to load them.
>
> — *Claude Code docs*

**Conventie uit best-practices:**
```text
pdf/
├── SKILL.md              # Main instructions (loaded when triggered)
├── FORMS.md              # Form-filling guide (loaded as needed)
├── reference.md          # API reference (loaded as needed)
├── examples.md           # Usage examples (loaded as needed)
└── scripts/
    ├── analyze_form.py   # Utility script (executed, not loaded)
    ├── fill_form.py      # Form filling script
    └── validate.py       # Validation script
```

## Waar skills leven (Claude Code)

| Location | Path | Applies to |
|---|---|---|
| Enterprise | See managed settings | All users in your organization |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<skill-name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Where plugin is enabled |

> When skills share the same name across levels, higher-priority locations win: **enterprise > personal > project**. Plugin skills use a `plugin-name:skill-name` namespace, so they cannot conflict with other levels.

## Minimum SKILL.md

```yaml
---
name: my-skill
description: What this skill does and when to use it
---

Your skill instructions here...
```

**Required:** alleen `description` wordt *aanbevolen* zodat Claude weet wanneer te triggeren. `name` defaults naar de directory-naam.

## YAML Frontmatter — volledige reference (Claude Code)

| Field | Required | Description |
|---|---|---|
| `name` | No | Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters). |
| `description` | **Recommended** | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Front-load the key use case: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage. |
| `when_to_use` | No | Additional context for when Claude should invoke the skill, such as trigger phrases or example requests. Appended to `description` in the skill listing and counts toward the 1,536-character cap. |
| `argument-hint` | No | Hint shown during autocomplete to indicate expected arguments. Example: `[issue-number]` or `[filename] [format]`. |
| `arguments` | No | Named positional arguments for `$name` substitution in the skill content. Accepts a space-separated string or a YAML list. Names map to argument positions in order. |
| `disable-model-invocation` | No | Set to `true` to prevent Claude from automatically loading this skill. Use for workflows you want to trigger manually with `/name`. Also prevents the skill from being preloaded into subagents. Default: `false`. |
| `user-invocable` | No | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`. |
| `allowed-tools` | No | Tools Claude can use without asking permission when this skill is active. Accepts a space-separated string or a YAML list. |
| `model` | No | Model to use when this skill is active. The override applies for the rest of the current turn and is not saved to settings. Accepts the same values as `/model`, or `inherit` to keep the active model. |
| `effort` | No | Effort level when this skill is active. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model. |
| `context` | No | Set to `fork` to run in a forked subagent context. |
| `agent` | No | Which subagent type to use when `context: fork` is set. |
| `hooks` | No | Hooks scoped to this skill's lifecycle. |
| `paths` | No | Glob patterns that limit when this skill is activated. Accepts a comma-separated string or a YAML list. When set, Claude loads the skill automatically only when working with files matching the patterns. |
| `shell` | No | Shell to use for inline shell execution. `bash` (default) or `powershell`. |

## YAML Frontmatter — Agent Skills (API/Claude.ai)

De API-versie is strenger en heeft minder features:

**`name`:**
- Maximum 64 characters
- Must contain only lowercase letters, numbers, and hyphens
- Cannot contain XML tags
- Cannot contain reserved words: `"anthropic"`, `"claude"`

**`description`:**
- Must be non-empty
- Maximum **1024 characters**
- Cannot contain XML tags

**Regel voor WIN:** omdat we in Claude Code werken kunnen we alle extra velden gebruiken, maar **houd `description` onder 1024 chars** zodat de skill eventueel later via de API ook kan draaien.

## String Substitutions (Claude Code)

Dynamic values in skill content:

| Variable | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed when invoking the skill. If `$ARGUMENTS` is not present in the content, arguments are appended as `ARGUMENTS: <value>`. |
| `$ARGUMENTS[N]` | Access a specific argument by 0-based index, such as `$ARGUMENTS[0]` for the first argument. |
| `$N` | Shorthand for `$ARGUMENTS[N]`, such as `$0` for the first argument or `$1` for the second. |
| `$name` | Named argument declared in the `arguments` frontmatter list. Names map to positions in order. |
| `${CLAUDE_SESSION_ID}` | The current session ID. Useful for logging, creating session-specific files. |
| `${CLAUDE_SKILL_DIR}` | The directory containing the skill's `SKILL.md` file. Use this in bash injection commands to reference scripts or files bundled with the skill, regardless of the current working directory. |

> Indexed arguments use shell-style quoting, so wrap multi-word values in quotes to pass them as a single argument. For example, `/my-skill "hello world" second` makes `$0` expand to `hello world` and `$1` to `second`.

**Voorbeeld:**
```yaml
---
name: migrate-component
description: Migrate a component from one framework to another
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

→ `/migrate-component SearchBar React Vue` werkt.

## Dynamic Context Injection (Claude Code — zeer krachtig)

Met `` !`<command>` `` voer je shell-commando's uit **voordat de skill naar Claude gaat**. De output vervangt de placeholder.

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

> When this skill runs:
> 1. Each `` !`<command>` `` executes immediately (before Claude sees anything)
> 2. The output replaces the placeholder in the skill content
> 3. Claude receives the fully-rendered prompt with actual PR data
>
> This is preprocessing, not something Claude executes. Claude only sees the final result.

Voor multi-line commands gebruik een fenced code block geopend met ` ```! `:

````markdown
## Environment
```!
node --version
npm --version
git status --short
```
````

## Subagent Execution: `context: fork`

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

> When this skill runs:
> 1. A new isolated context is created
> 2. The subagent receives the skill content as its prompt
> 3. The `agent` field determines the execution environment (model, tools, and permissions)
> 4. Results are summarized and returned to your main conversation

**Waarschuwing uit de docs:**
> `context: fork` only makes sense for skills with explicit instructions. If your skill contains guidelines like "use these API conventions" without a task, the subagent receives the guidelines but no actionable prompt, and returns without meaningful output.

## Invocation Control Matrix

| Frontmatter | You can invoke | Claude can invoke | When loaded into context |
|---|---|---|---|
| (default) | Yes | Yes | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes | No | Description not in context, full skill loads when you invoke |
| `user-invocable: false` | No | Yes | Description always in context, full skill loads when invoked |

## `allowed-tools` — pre-approve tools

```yaml
---
name: commit
description: Stage and commit the current changes
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *)
---
```

> The `allowed-tools` field grants permission for the listed tools while the skill is active, so Claude can use them without prompting you for approval. It does not restrict which tools are available: every tool remains callable, and your permission settings still govern tools that are not listed.

## Extended Thinking Trigger

> To enable extended thinking in a skill, include the word "ultrathink" anywhere in your skill content.
>
> — *Claude Code docs*

## Volledig voorbeeld (uit Claude Code docs)

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.
```

## Troubleshooting (uit de docs)

**Skill not triggering:**
1. Check the description includes keywords users would naturally say
2. Verify the skill appears in `What skills are available?`
3. Try rephrasing your request to match the description more closely
4. Invoke it directly with `/skill-name` if the skill is user-invocable

**Skill triggers too often:**
1. Make the description more specific
2. Add `disable-model-invocation: true` if you only want manual invocation

**Skill descriptions are cut short:**
> All skill names are always included, but if you have many skills, descriptions are shortened to fit the character budget. The budget scales dynamically at 1% of the context window, with a fallback of 8,000 characters. To raise the limit, set the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable. Or trim the `description` and `when_to_use` text at the source: front-load the key use case, since each entry's combined text is capped at 1,536 characters regardless of budget.
