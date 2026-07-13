# Plan v2 — Kennismaking-booking (eigen engine) → CRM → Kalender → Dashboard

> **Opdracht Chris (2026-07-13):** de agenda-placeholder op /kennismaking wordt een echte booking-flow. Boekingen landen in een CRM dat hij **zelf volledig kan aanpassen** (eigen velden, filters, kolommen, opgeslagen weergaven, inline edit), met analytics en aanmeld-timestamps, voornaam/achternaam als aparte kolommen, bedrijfsveld. Kalender-overzicht + dashboard-notificatie ("vandaag kennismaking met X"). Booking-formuliervelden én beschikbaarheid beheerbaar vanuit het dashboard. Fase 2: Google Calendar-sync + e-mailbevestigingen.
>
> **Status: GEBOUWD 2026-07-13 (fase 1-5).** Zie §6 voor wat er live staat en §7 voor fase 2.

## 1. Architectuur-pivot (v1 → v2)

**v1** plande cal.diy als aparte scheduling-app (embed + webhooks). Chris's harde eisen op 2026-07-13: **geen lokale cal, geen aparte app-server (geen Fly/Railway), stack = Neon + Vercel die er al zijn.** Antwoord: **eigen booking-engine in het platform.** Dat is ook functioneel beter voor de kern-eis "alles zelf kunnen aanpassen": formuliervelden en beschikbaarheid zijn nu platte database-rijen met eigen beheer-UI, geen cal-UI ernaast. Beslissing bevestigd door Chris (AskUserQuestion, optie "Eigen booking, alles op Neon+Vercel").

```
Bezoeker op /kennismaking (web, Payload → Vercel "win-web")
  └─ booking-block (client-widget)
       ├─ GET  {platform}/api/booking/config   → actieve velden + instellingen
       ├─ GET  {platform}/api/booking/slots    → beschikbare tijden (Europe/Amsterdam)
       └─ POST {platform}/api/booking          → contact-upsert + booking + activity (Neon)
Platform (Vercel "win-platform", Neon "neondb")
  ├─ /admin/boekingen            overzicht + annuleren (aanmeld-timestamp zichtbaar)
  ├─ /admin/boekingen/beschikbaarheid   weekvensters + slotduur/buffer/notice/horizon
  ├─ /admin/boekingen/formulier  velden CRUD (type/opties/verplicht/volgorde/actief)
  ├─ /admin/crm                  analytics-strip + tabel met views/kolommen/filters/inline-edit
  ├─ /coach/agenda               maand-grid met kennismakingen als bron
  └─ /admin dashboard            "Vandaag"-widget + aanmeldingen-stat
```

## 2. Infrastructuur (live)

| Wat | Waar |
|---|---|
| Website (Payload CMS) | Vercel **win-web** → https://win-web-henna.vercel.app |
| Platform (CRM/dashboard) | Vercel **win-platform** → https://win-platform-three.vercel.app |
| Database platform | Neon `neondb` (pooled voor runtime, direct voor drizzle-kit push) |
| Database website | Neon `win_cms` (Payload; gemigreerd van lokale pg via pg_dump) |
| Media website | Vercel Blob store `win-media` (112 bestanden, plugin al in payload.config) |
| Dev-logins | chris@co-creatie.ai (admin) / reza@win.nl (coach) / demo-client@win.nl — wachtwoord bij Chris bekend (seed 2026-07-13) |

## 3. Datamodel (platform, drizzle → Neon)

- **`booking`** — contactId, service (dienst), startsAt/endsAt, status (confirmed/rescheduled/cancelled), location, attendeeName/Email, `responses` (jsonb, alle formulier-antwoorden), **`bookedAt`** (= moment van "verstuur"-klik), cancellationReason, manageToken (voor fase-2 self-service links), partial-unique-index op startsAt (dubbelboek-backstop).
- **`booking_field`** — formulierveld-definities: key, label, fieldType (text/textarea/email/phone/select/checkbox), options, placeholder, required, active, system (voornaam/achternaam/email niet verwijderbaar), position.
- **`availability_rule`** — weekvensters: weekday (1=ma…7=zo), startMinute, endMinute, active.
- **`booking_settings`** — singleton: active, slotMinutes (30), bufferMinutes, minNoticeHours (24), maxDaysAhead (60), timezone (Europe/Amsterdam), location ("Videogesprek").
- **`crm_view`** — opgeslagen weergaven per gebruiker: columns (volgorde), filters, sort, density, isDefault.
- Bestaand hergebruikt: `contact` (aparte firstName/lastName, company, customFields jsonb), `custom_field` (+ beheer-UI bestond al), `activity` (tijdlijn).

## 4. Booking-engine (modules/booking/)

- `service.ts` — slot-berekening (dependency-vrij, DST-veilig via Intl-offset), `createBooking` met server-side her-validatie van het slot + race-bescherming via unique index, contact-upsert op e-mail (bestaande CRM-data wint; alleen lege velden aangevuld; source "kennismaking"), activity-log in NL.
- `cors.ts` — origin-allowlist (localhost:3000, win-web-henna, wininstituut.nl; extra via `BOOKING_ALLOWED_ORIGINS`).
- `actions.ts` — server actions voor settings/rules/fields/annuleren (requireAdminOrCoach).
- Publieke routes: `GET /api/booking/config`, `GET /api/booking/slots?from&to` (max 62 dagen), `POST /api/booking` (honeypot-veld "website" → nep-succes).
- Getest end-to-end (curl): boeken ✓, dubbelboeking geweigerd ✓, honeypot ✓, verplicht-veld-validatie ✓, slot verdwijnt na boeking ✓, contact+activity in CRM ✓.

## 5. CRM "alles zelf aanpassen" (gebouwd)

- Analytics-strip op /admin/crm: aanmeldingen per week (8 wk mini-bars, dataviz-conform), verdeling per dienst, bron, lead→klant.
- Contacten-tabel (client): kolom-kiezer incl. custom fields (volgorde instelbaar), per-kolom filters, klik-sortering, dichtheid-toggle, **opgeslagen weergaven** (crm_view, incl. standaard-weergave), **inline edit** (dubbelklik; ook status-select en custom-field-cellen). Voornaam/achternaam als losse kolommen.
- Contact-detail: sectie "Kennismakingen" (dienst, status, onderwerp, aangemeld-op) naast bestaande tijdlijn/custom fields.
- Veldenbeheer voor contacten bestond al (/admin/crm/custom-fields); formuliervelden voor booking op /admin/boekingen/formulier.

## 6. Definition of done — fase 1-5 status

| # | DoD | Status |
|---|---|---|
| 1 | Schema + publieke API, boeking → contact+booking in CRM | ✓ getest |
| 2 | Beschikbaarheid + formulier beheerbaar in dashboard, direct live | ✓ |
| 3 | booking-block op /kennismaking in WIN-stijl met fallback | in bouw (subagent) → daarna block op pagina zetten + web redeploy |
| 4 | CRM: eigen veld → kolom + filter; views opslaan; 375×667 | ✓ gebouwd; mobile-QA in fase Review/Test |
| 5 | Kalender + dashboard-widget kloppen met testboekingen | ✓ geverifieerd |
| 6 | Beide apps live op Vercel + Neon | ✓ (zie §2) |

## 7. Fase 2 — nog te bouwen (na go/API-gegevens Chris)

- **E-mailbevestigingen** (bezoeker + Reza) — Resend of SMTP; template met annuleer/verzet-link op basis van `manageToken`.
- **Google Calendar-sync** — met eigen engine loopt dit via de Google Calendar API (OAuth-credentials van Chris; `calendarAccount`/`externalEvent`-tabellen bestaan al als landingsplek).
- Self-service verzetten/annuleren door bezoeker (manageToken-pagina op de site).
- Custom domeinen (wininstituut.nl → win-web; subdomein voor platform) — cors-allowlist staat al klaar.

## 8. Bewust niet gebouwd

- cal.diy/Cal.com (geen aparte app-server in de stack — beslissing Chris 2026-07-13).
- E-mail-campagnes/sequenties vanuit het CRM.
- Drag-and-drop kolom-reorder (pijltjes in kolom-kiezer volstaan; dnd-kit ligt klaar als het ooit moet).
