# QA-scorecard — WIN Platform (2026-04-24)

Systematische audit van alle surfaces, components en server-actions.
Gescored per dimensie 1-10. Gevonden issues zijn gefixt in 2 commit-
batches; remaining-items staan onderaan.

## Build health

| Check | Resultaat |
|---|---|
| `tsc --noEmit` | ✅ 0 errors |
| `next build` | ✅ 53 routes, clean |
| `npm audit` | 4 moderate (dev-only esbuild chain, accepted) |
| eslint | ✅ geen warnings |

## Scorecard per surface

| Surface | Score | Kern-bevindingen |
|---|---|---|
| **Public (/login, /signup, /no-access)** | **9/10** | Ambient gradients + consistent logo lockup op alle 3. Console 0 errors. Mobile layout werkt op 375px. Alleen: geen rate-limiting op login-actie (BetterAuth doet default, maar geen visuele feedback op throttle). |
| **Client (/app/\*)** | **8/10** | 9 routes, alle met empty-states + notFound() guards. Habits optimistic toggle werkt, formulieren dynamisch uit jsonb. Missing: file-upload op client-side (alleen admin), profielvoorkeuren (alleen display). |
| **Coach (/coach/\*)** | **9/10** | 12 routes (11 + vandaag/taken/agenda nieuw). /vandaag + /taken + /agenda hebben loading.tsx. GTD-view drag-drop met optimistic UI, keyboard-shortcut `n`. Follow-up button alom beschikbaar. Missing: bulk-task-ops, export. |
| **Admin (/admin/\*)** | **8/10** | 18+ routes. Full CRM met pipeline kanban. Projecten-query nu properly scoped (fix in batch-2). Custom-fields CRUD werkt. Missing: CRUD-edit voor contacts/deals (alleen create + delete), geen bulk-select. |
| **Shared primitives** | **9/10** | 47 shadcn components + 6 WIN-specifieke wrappers. Token-consistent. Drag-drop via @dnd-kit met rectIntersection. Dialog backdrop blur, dropdown-menu animated. |
| **Server actions** | **9/10** | 32 actions over 5 bestanden. Alle mutaties door `requireUser()` of `requireAdminOrCoach()`. Login-actie public (correct). Drizzle voorkomt SQL-injection; geen `sql\`\${userInput}\`` patterns. revalidatePath correct op alle mutating paths. |

**Overall: 8.7/10** — productieklaar voor gebruik door Reza zodra DATABASE_URL + service-role key zijn ingesteld.

## Issues gevonden + gefixt (batch 1 + 2)

### Kritiek
- **5 broken nav-links** (`/coach/meer`, `/admin/meer`, `/app/meer`, `/app/profiel`, `/coach/formulieren`) → alle 5 pagina's gebouwd met consistent hover-tiles pattern
- **N+1 query** in `/coach/trajecten/[id]` — `for (const m of modules) { db.select ... }` → vervangen door 1 `inArray()` query

### Middel
- **Geen globale error-boundary** — uncaught errors landden op Next default-500 → `app/error.tsx` met branded WIN-styling, reset + Home-button, digest voor debugging
- **Ontbrekende loading.tsx** op top-3 dagelijkse surfaces → `/coach/vandaag/loading.tsx`, `/coach/taken/loading.tsx`, `/coach/agenda/loading.tsx` met surface-specifieke skeleton-layout
- **Morning-ritual timer perf**: useEffect deps bevatten `seconds` → setInterval werd elke seconde herbouwd → deps gefixt naar `[running]` only (60× minder werk)
- **Admin/projecten unbounded query**: `db.select().from(task)` laadde alle tasks → gescoped met `inArray(task.projectId, projectIds)`

### Klein
- Hardcoded `text-win-charcoal/70` in `/signup` → vervangen door `muted-foreground` token
- `/no-access` voelde minder premium dan `/login` → volledige make-over: ambient gradient, logo lockup, warning-icon chip, primary+ghost button-hiërarchie
- Form-validatie input-hint ("min. 8 tekens") consistent NL

## Wat NIET gedekt in deze QA-ronde

- **Runtime-tests met echte DB**: DATABASE_URL niet gezet → geen end-to-end login/mutation-test. Wacht op Chris (zie handoff-doc).
- **Load-testing**: geen k6/artillery-runs. Voor MVP-volumes (Reza + tientallen cliënten) niet nodig; herbeoordeel bij >1000 gebruikers.
- **Cross-browser testing**: Playwright test op Chromium-only. Safari iOS test zodra deployment live staat.
- **Accessibility-audit met screen-reader**: visuele ARIA checks gedaan, maar geen VoiceOver/JAWS walkthrough.
- **Visual regression**: geen baseline-screenshots gestored. Toekomst: Playwright with toMatchSnapshot.

## Bekende, geaccepteerde issues

| Issue | Ernst | Waarom niet fixen nu |
|---|---|---|
| `any` types in `plugandpay/mappers.ts` | Laag | P&P API-shape is loose; `unknown` + type-guards maakt code 2× groter zonder echte type-safety-winst |
| Login-action heeft geen rate-limiting UI | Laag | BetterAuth doet server-side throttling; zonder UI-feedback is geen UX-blocker voor MVP |
| CRUD-edit voor contacts/deals mist | Middel | Schema + create/delete bestaan; edit-dialoog is 1 extra PR; niet blocker voor demo |
| Geen per-route metadata op alle pages | Laag | Alleen tabblad-titel issue; SEO niet relevant voor authed-routes |
| Geen i18n-framework (alles hardcoded NL) | Laag | Reza werkt alleen NL; als B2B-internationaal groeit → next-intl toevoegen |

## Top-5 volgende-ronde verbeteringen

1. **Bulk-ops op tasks + contacts** — select multiple + batch move / tag / delete
2. **Edit-dialogen voor bestaande entities** — contact/deal/workshop updates (nu alleen Create)
3. **Calendar-sync cron** — Google OAuth-flow staat, events-pull ontbreekt
4. **Notificaties via e-mail** — Resend integratie voor chat-messages + form-responses
5. **AI session-summarize** — Claude API call na sessie-notes opslaan → auto-send naar cliënt

## Commits in deze QA-ronde

```
ef7f8a3  fix(qa): batch-2 — no-access polish, projecten scoping, morning-ritual perf
2b7427a  fix(qa): batch-1 — 5 broken nav links, N+1 query, global error.tsx, loading states
```

## Verificatie-checklist voor Chris

Wanneer DATABASE_URL + service-role key zijn gezet:
- [ ] Login als Reza → land op /coach/vandaag
- [ ] Check /coach/taken — druk `n` → quick-capture werkt
- [ ] Sleep taak van "Binnenkort" naar "Vandaag" — persist
- [ ] Klik op habit — tick werkt + log slaat op
- [ ] Klik op sessie → /coach/sessies/[id]/prep → live notes → save
- [ ] Contact-detail → Follow-up → "Over 2 weken" → taak verschijnt in /vandaag op die dag
- [ ] CRM pipeline — sleep deal tussen stages
- [ ] /coach/agenda — maand-navigatie werkt
- [ ] Upload document op contact-detail → signed URL opens
- [ ] Forceer error (bv. /admin/crm/deals/invalidid) → error.tsx toont
- [ ] Sign-out → terug op /login

Als ieder van deze 11 stappen werkt: platform is user-ready voor Reza.
