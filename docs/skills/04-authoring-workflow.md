# 04 — Authoring Workflow

Hoe je van idee naar werkende skill komt. Samengesteld uit de **skill-creator** skill (Anthropic's officiële authoring workflow) en de best-practices docs.

## De core loop

Uit skill-creator, verbatim:

> - Figure out what the skill is about
> - Draft or edit the skill
> - Run claude-with-access-to-the-skill on test prompts
> - With the user, evaluate the outputs
> - Repeat until you and the user are satisfied
> - Package the final skill and return it to the user

## Stap 1 — Capture Intent

Voordat je één letter schrijft: beantwoord 4 vragen.

1. What should this skill enable Claude to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?
4. Should we set up test cases to verify the skill works?

> Skills with objectively verifiable outputs (file transforms, data extraction, code generation, fixed workflow steps) benefit from test cases. Skills with subjective outputs (writing style, art) often don't need them.

**Voor WIN specifiek — typische skill-briefing:**
- *Wat* moet de skill doen? (bv. "nieuwe sectie toevoegen aan een pagina conform WIN-styling")
- *Wanneer* triggert hij? (bv. "als Chris zegt 'voeg een testimonial-block toe aan /coaching'")
- *Welke bestanden* worden aangeraakt? (vaste lijst of dynamic?)
- *Welke tools* mogen zonder permission? (`Edit`, `Read`, `Write`, evt. `Bash`)

## Stap 2 — Interview & Research

> Proactively ask questions about edge cases, input/output formats, example files, success criteria, and dependencies. Wait to write test prompts until you've got this part ironed out.

> Check available MCPs - if useful for research, research in parallel via subagents if available.

## Stap 3 — Write the SKILL.md draft

Structureer zoals beschreven in [02-skill-md-reference.md](02-skill-md-reference.md):

```yaml
---
name: <gerund-form-name>
description: <third person, what AND when, pushy if needed>
allowed-tools: <space-separated list or YAML list>
---

# <Skill title>

## Quick start / Usage

[Minimal working example]

## Workflow

[Clear sequential steps]

## Additional resources

- For X, see [X.md](X.md)
- For Y, see [Y.md](Y.md)
```

**Houd in gedachten:**
- Concise. Challenge elk woord.
- 3rd person. "Does X when Y" — niet "I help you with X".
- Include key terms die de gebruiker zou zeggen.
- One level deep references.

## Stap 4 — Test cases

Uit skill-creator:

> After writing the skill draft, come up with 2-3 realistic test prompts — the kind of thing a real user would actually say. Share them with the user: "Here are a few test cases I'd like to try. Do these look right, or do you want to add more?" Then run them.

**Opslaan in `evals/evals.json`:**
```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

## Stap 5 — Run, evaluate, iterate

> Put results in `<skill-name>-workspace/` as a sibling to the skill directory. Within the workspace, organize results by iteration (`iteration-1/`, `iteration-2/`, etc.) and within that, each test case gets a directory.

**Per test case — spawn 2 subagents parallel:**
1. **With-skill** — skill geladen, prompt uitgevoerd
2. **Baseline** — zonder skill (bij nieuwe skill), of oude versie (bij iteratie)

Doel: kwantitatief vergelijken of de skill echt waarde toevoegt.

## Stap 6 — Evaluation-driven development

Uit best-practices:

> **Create evaluations BEFORE writing extensive documentation.** This ensures your Skill solves real problems rather than documenting imagined ones.
>
> 1. **Identify gaps:** Run Claude on representative tasks without a Skill. Document specific failures or missing context
> 2. **Create evaluations:** Build three scenarios that test these gaps
> 3. **Establish baseline:** Measure Claude's performance without the Skill
> 4. **Write minimal instructions:** Create just enough content to address the gaps and pass evaluations
> 5. **Iterate:** Execute evaluations, compare against baseline, and refine

## Stap 7 — Iteratief verbeteren met Claude zelf

Heel praktisch patroon uit best-practices:

> The most effective Skill development process involves Claude itself. Work with one instance of Claude ("Claude A") to create a Skill that is used by other instances ("Claude B").
>
> **Creating a new Skill:**
>
> 1. **Complete a task without a Skill:** Work through a problem with Claude A using normal prompting. Notice what information you repeatedly provide.
> 2. **Identify the reusable pattern:** After completing the task, identify what context you provided that would be useful for similar future tasks.
> 3. **Ask Claude A to create a Skill:** "Create a Skill that captures this pattern we just used..."
> 4. **Review for conciseness:** Check that Claude A hasn't added unnecessary explanations.
> 5. **Improve information architecture:** Ask Claude A to organize the content more effectively.
> 6. **Test on similar tasks:** Use the Skill with Claude B (a fresh instance with the Skill loaded).
> 7. **Iterate based on observation:** If Claude B struggles, return to Claude A with specifics.

**Dit is exact het patroon dat we voor WIN gaan gebruiken.** Chris + ik (Kick, Claude A) bouwen skills; toekomstige Claude-sessies (Claude B) gebruiken ze.

## Stap 8 — Tips voor het verbeteren

Uit skill-creator:

### Generalize from feedback

> We're trying to create skills that can be used a million times across many different prompts. Rather than put in fiddly overfitty changes, or oppressively constrictive MUSTs, if there's some stubborn issue, you might try branching out and using different metaphors, or recommending different patterns of working.

### Keep the prompt lean

> Remove things that aren't pulling their weight. Make sure to read the transcripts, not just the final outputs.

### Explain the why

> Try hard to explain the **why** behind everything you're asking the model to do. Today's LLMs are *smart*. They have good theory of mind and when given a good harness can go beyond rote instructions.

### Look for repeated work across test cases

> Read the transcripts from the test runs and notice if the subagents all independently wrote similar helper scripts. If all 3 test cases resulted in the subagent writing a `create_docx.py`, that's a strong signal the skill should bundle that script. Write it once, put it in `scripts/`, and tell the skill to use it.

## Stap 9 — Description optimization

Na de skill werkt: optimaliseer de description voor betere triggering.

> The description field in SKILL.md frontmatter is the primary mechanism that determines whether Claude invokes a skill.

**Genereer 20 eval queries — 10 should-trigger + 10 should-not-trigger.**

> The queries must be realistic and something a Claude Code or Claude.ai user would actually type. Not abstract requests, but requests that are concrete and specific and have a good amount of detail.

**Bad queries** (niet testbaar): `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

**Good queries** (realistisch en specifiek):
> "ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage."

**De kunst van should-NOT-trigger queries:**
> The most valuable ones are the near-misses — queries that share keywords or concepts with the skill but actually need something different.

## Hoe skill-triggering werkt (belangrijk om te snappen)

> Skills appear in Claude's `available_skills` list with their name + description, and Claude decides whether to consult a skill based on that description. **The important thing to know is that Claude only consults skills for tasks it can't easily handle on its own** — simple, one-step queries like "read this PDF" may not trigger a skill even if the description matches perfectly, because Claude can handle them directly with basic tools. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

## Verkorte checklist voor onze workflow op WIN

Wanneer Chris zegt "laten we skill X bouwen":

1. **Interview** — Wat doet het exact? Wanneer triggert het? Welke tools nodig?
2. **Draft** — `.claude/skills/<name>/SKILL.md` met frontmatter + minimale body
3. **Test** — 2-3 realistische prompts, eventueel vanuit echte WIN-taken
4. **Run** — Laat claude (met skill) + claude (zonder skill) beide proberen
5. **Review** — Chris/Reza kijkt naar de output. Is het goed?
6. **Iterate** — Aanscherpen op basis van feedback, opnieuw runnen
7. **Commit** — Naar repo zodat het geshared is

Voor simpele skills (zoals `/win-deploy-check`) kunnen we vaak gewoon stap 2 → 3 → 7. Voor complexere (zoals `/new-section` die styling moet respecteren) doen we de volle loop.
