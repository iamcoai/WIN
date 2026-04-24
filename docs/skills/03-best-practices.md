# 03 — Best Practices

Verbatim geciteerd uit Anthropic's officiële *Skill authoring best practices*. Dit is het kwaliteitshandboek.

## De kernprincipes

### 1. Concise is key

> The context window is a public good. Your Skill shares the context window with everything else Claude needs to know [...] once Claude loads it, every token competes with conversation history and other context.

**Default assumption:** Claude is already very smart.

> Only add context Claude doesn't already have. Challenge each piece of information:
> - "Does Claude really need this explanation?"
> - "Can I assume Claude knows this?"
> - "Does this paragraph justify its token cost?"

**Goed (~50 tokens):**
````markdown
## Extract PDF text

Use pdfplumber for text extraction:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Slecht (~150 tokens):**
```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing...
```

### 2. Set appropriate degrees of freedom

Match specificity to the task's fragility.

> **Analogy:** Think of Claude as a robot exploring a path:
> - **Narrow bridge with cliffs on both sides:** There's only one safe way forward. Provide specific guardrails and exact instructions (low freedom). Example: database migrations that must run in exact sequence.
> - **Open field with no hazards:** Many paths lead to success. Give general direction and trust Claude to find the best route (high freedom). Example: code reviews where context determines the best approach.

| Freedom level | When to use | Example |
|---|---|---|
| **High** (text instructions) | Multiple valid approaches, context-dependent | `"1. Analyze code structure. 2. Check for bugs. 3. Suggest improvements."` |
| **Medium** (pseudocode/scripts with params) | Preferred pattern exists, some variation OK | Template functions with configurable flags |
| **Low** (specific scripts, no params) | Fragile operations, consistency critical | `"Run exactly: python scripts/migrate.py --verify --backup"` |

### 3. Test with all models you plan to use

> Skills act as additions to models, so effectiveness depends on the underlying model. Test your Skill with all the models you plan to use it with.
>
> What works perfectly for Opus might need more detail for Haiku.

## Naming conventions

> Use consistent naming patterns to make Skills easier to reference and discuss. Consider using **gerund form** (verb + -ing) for Skill names, as this clearly describes the activity or capability the Skill provides.

| Category | Examples |
|---|---|
| ✅ **Gerund (preferred)** | `processing-pdfs`, `analyzing-spreadsheets`, `testing-code`, `writing-documentation` |
| ✅ **Noun phrases (OK)** | `pdf-processing`, `spreadsheet-analysis` |
| ✅ **Action-oriented (OK)** | `process-pdfs`, `analyze-spreadsheets` |
| ❌ **Vague** | `helper`, `utils`, `tools` |
| ❌ **Generic** | `documents`, `data`, `files` |
| ❌ **Reserved** | anything with `anthropic` or `claude` |

**Technical constraint:** `name` moet lowercase letters, numbers, hyphens zijn. Max 64 chars.

## Description — the most critical field

> Each Skill has exactly one description field. The description is critical for skill selection: Claude uses it to choose the right Skill from potentially 100+ available Skills. Your description must provide enough detail for Claude to know when to select this Skill, while the rest of SKILL.md provides the implementation details.

### ⚠️ Always write in third person

> The description is injected into the system prompt, and inconsistent point-of-view can cause discovery problems.
>
> - **Good:** "Processes Excel files and generates reports"
> - **Avoid:** "I can help you process Excel files"
> - **Avoid:** "You can use this to process Excel files"

### Include both WHAT and WHEN

> Be specific and include key terms. Include both what the Skill does and specific triggers/contexts for when to use it.

**Goede voorbeelden:**
```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

```yaml
description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.
```

```yaml
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

**Slechte voorbeelden:**
```yaml
description: Helps with documents
description: Processes data
description: Does stuff with files
```

### "Pushy" descriptions (uit skill-creator)

> Claude has a tendency to "undertrigger" skills -- to not use them when they'd be useful. To combat this, please make the skill descriptions a little bit "pushy".

**Niet:** "How to build a simple fast dashboard to display internal Anthropic data."

**Wel:** "How to build a simple fast dashboard to display internal Anthropic data. **Make sure to use this skill whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any kind of company data, even if they don't explicitly ask for a 'dashboard.'**"

## Progressive Disclosure — authoring patterns

### Pattern 1: High-level guide with references

```markdown
---
name: pdf-processing
description: Extracts text and tables from PDF files...
---

# PDF Processing

## Quick start

Extract text with pdfplumber: [kleine code snippet]

## Advanced features

**Form filling**: See [FORMS.md](FORMS.md) for complete guide
**API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
**Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns
```

Claude leest FORMS.md, REFERENCE.md, EXAMPLES.md alleen wanneer nodig.

### Pattern 2: Domain-specific organization

```text
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

> When a user asks about sales metrics, Claude only needs to read sales-related schemas, not finance or marketing data.

### Pattern 3: Conditional details

```markdown
# DOCX Processing

## Creating documents
Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify the XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

## ⚠️ Avoid deeply nested references

> Claude may partially read files when they're referenced from other referenced files. When encountering nested references, Claude might use commands like `head -100` to preview content rather than reading entire files, resulting in incomplete information.
>
> **Keep references one level deep from SKILL.md.** All reference files should link directly from SKILL.md to ensure Claude reads complete files when needed.

**Slecht (te diep):**
```
SKILL.md → advanced.md → details.md → (echte info)
```

**Goed (1 level deep):**
```
SKILL.md → advanced.md
SKILL.md → reference.md
SKILL.md → examples.md
```

## Table of contents voor grote reference files

> For reference files longer than 100 lines, include a table of contents at the top. This ensures Claude can see the full scope of available information even when previewing with partial reads.

## Workflows met checklists

Voor complexe multi-step skills:

````markdown
## PDF form filling workflow

Copy this checklist and check off items as you complete them:

```
Task Progress:
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill the form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
```

**Step 1: Analyze the form**
Run: `python scripts/analyze_form.py input.pdf`
...
````

## Feedback loops

> **Common pattern:** Run validator → fix errors → repeat

```markdown
## Document editing process

1. Make your edits to `word/document.xml`
2. **Validate immediately**: `python ooxml/scripts/validate.py unpacked_dir/`
3. If validation fails:
   - Review the error message carefully
   - Fix the issues in the XML
   - Run validation again
4. **Only proceed when validation passes**
5. Rebuild: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Test the output document
```

## Content guidelines

### Avoid time-sensitive information

**Slecht:**
```markdown
If you're doing this before August 2025, use the old API.
After August 2025, use the new API.
```

**Goed:**
```markdown
## Current method
Use the v2 API endpoint: `api.example.com/v2/messages`

## Old patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
The v1 API used: `api.example.com/v1/messages`
This endpoint is no longer supported.
</details>
```

### Use consistent terminology

> Choose one term and use it throughout the Skill.
>
> - ✅ Always "API endpoint" — never mix with "URL", "route", "path"
> - ✅ Always "field" — never mix with "box", "element", "control"

## Writing style

Uit skill-creator's instructies:

> Try to explain to the model **why** things are important in lieu of heavy-handed musty MUSTs. Use theory of mind and try to make the skill general and not super-narrow to specific examples.

> If you find yourself writing ALWAYS or NEVER in all caps, or using super rigid structures, that's a yellow flag — if possible, reframe and explain the reasoning so that the model understands why the thing you're asking for is important. That's a more humane, powerful, and effective approach.

## Anti-patterns om te vermijden

### ❌ Windows-style paths
```markdown
Bad:  scripts\helper.py
Good: scripts/helper.py
```

### ❌ Offering too many options
```markdown
Bad:  "You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image, or..."
Good: "Use pdfplumber for text extraction.
       For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."
```

### ❌ Punt to Claude (bij scripts)
```python
# Bad — just fails
def process_file(path):
    return open(path).read()

# Good — handles errors
def process_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File {path} not found, creating default")
        with open(path, "w") as f: f.write("")
        return ""
```

### ❌ Voodoo constants
```python
# Bad
TIMEOUT = 47  # Why 47?
RETRIES = 5  # Why 5?

# Good
# HTTP requests typically complete within 30 seconds
REQUEST_TIMEOUT = 30

# Three retries balances reliability vs speed
MAX_RETRIES = 3
```

## Finale checklist (uit best-practices)

**Core quality:**
- [ ] Description is specific and includes key terms
- [ ] Description includes both WHAT the Skill does and WHEN to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are **one level deep**
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

**Code and scripts:**
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No voodoo constants (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

**Testing:**
- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus
- [ ] Tested with real usage scenarios
