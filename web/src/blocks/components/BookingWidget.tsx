'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

/* ------------------------------------------------------------------ */
/* Platform-API — contract vastgelegd in platform/src/app/api/booking  */
/* ------------------------------------------------------------------ */

const PLATFORM = process.env.NEXT_PUBLIC_PLATFORM_URL ?? ''

type FieldType = 'text' | 'textarea' | 'email' | 'phone' | 'select' | 'checkbox'

type BookingField = {
  key: string
  label: string
  fieldType: FieldType
  options: string[]
  placeholder?: string | null
  required: boolean
}

type BookingConfig = {
  active: boolean
  slotMinutes: number
  maxDaysAhead: number
  timezone: string
  location: string
  fields: BookingField[]
}

type SlotsResponse = { days: Record<string, string[]> }

type PostResult =
  | { ok: true; bookingId: string; startsAt?: string }
  | { ok: false; code: 'invalid' | 'slot_taken' | 'closed'; error: string }

/* ------------------------------------------------------------------ */
/* Datum-helpers — dagen zijn Europe/Amsterdam-kalenderdatums (YYYY-MM-DD),
   tijden zijn ISO UTC-instants die we in de config-timezone tonen.       */
/* ------------------------------------------------------------------ */

/** Vandaag in de opgegeven tijdzone als YYYY-MM-DD. */
function todayInTz(tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Kalender-rekenen op YYYY-MM-DD, tijdzone-onafhankelijk. */
function addDays(ymd: string, n: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

function minYmd(a: string, b: string): string {
  return a <= b ? a : b
}

/** Dag-chip: korte weekdag + dag/maand, in de config-timezone. Noen-UTC
    vermijdt DST-randgevallen rond middernacht. */
function dagLabel(ymd: string, tz: string): { weekdag: string; datum: string } {
  const dt = new Date(`${ymd}T12:00:00Z`)
  const weekdag = new Intl.DateTimeFormat('nl-NL', { timeZone: tz, weekday: 'short' }).format(dt)
  const datum = new Intl.DateTimeFormat('nl-NL', { timeZone: tz, day: 'numeric', month: 'short' }).format(dt)
  return { weekdag: weekdag.replace('.', ''), datum }
}

function tijdLabel(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** "woensdag 15 juli om 10:00" voor de bevestiging. */
function bevestigingLabel(iso: string, tz: string): string {
  const datum = new Intl.DateTimeFormat('nl-NL', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
  return `${datum} om ${tijdLabel(iso, tz)}`
}

/* ------------------------------------------------------------------ */
/* Widget                                                              */
/* ------------------------------------------------------------------ */

export function BookingWidget() {
  const [config, setConfig] = useState<BookingConfig | null>(null)
  const [configError, setConfigError] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const [days, setDays] = useState<Record<string, string[]>>({})
  const [loadedUntil, setLoadedUntil] = useState<string | null>(null)
  // start op true: het eerste slot-venster laadt zodra de config binnen is
  const [loadingSlots, setLoadingSlots] = useState(true)

  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const [responses, setResponses] = useState<Record<string, string>>({})
  const [website, setWebsite] = useState('') // honeypot
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null)

  /* --- config laden --- */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${PLATFORM}/api/booking/config`)
        if (!res.ok) throw new Error('config')
        const data = (await res.json()) as BookingConfig
        if (cancelled) return
        if (!data?.active) {
          setConfigError(true)
        } else {
          setConfig(data)
        }
      } catch {
        if (!cancelled) setConfigError(true)
      } finally {
        if (!cancelled) setLoadingConfig(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /* --- slots ophalen (merge) --- */
  const fetchSlots = useCallback(
    async (from: string, to: string) => {
      // géén synchrone setState hier: dat mag niet vanuit het init-effect.
      // De loading-indicator wordt op true gezet door de aanroeper (of de
      // begin-state) en hier in de finally weer uit.
      try {
        const res = await fetch(`${PLATFORM}/api/booking/slots?from=${from}&to=${to}`)
        if (!res.ok) throw new Error('slots')
        const data = (await res.json()) as SlotsResponse
        setDays((prev) => ({ ...prev, ...(data.days ?? {}) }))
        setLoadedUntil((prev) => (prev && prev > to ? prev : to))
      } catch {
        /* bestaande dagen laten staan; geen harde fout hier */
      } finally {
        setLoadingSlots(false)
      }
    },
    [],
  )

  /* --- eerste venster: 3 weken vooruit (gecapt op maxDaysAhead) --- */
  useEffect(() => {
    if (!config) return
    const vandaag = todayInTz(config.timezone)
    const to = minYmd(addDays(vandaag, 20), addDays(vandaag, config.maxDaysAhead))
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${PLATFORM}/api/booking/slots?from=${vandaag}&to=${to}`)
        if (!res.ok) throw new Error('slots')
        const data = (await res.json()) as SlotsResponse
        if (cancelled) return
        setDays((prev) => ({ ...prev, ...(data.days ?? {}) }))
        setLoadedUntil((prev) => (prev && prev > to ? prev : to))
      } catch {
        /* laat leeg — stap 1 toont dan de "geen momenten"-melding */
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [config])

  const canLoadMore = useMemo(() => {
    if (!config || !loadedUntil) return false
    return loadedUntil < addDays(todayInTz(config.timezone), config.maxDaysAhead)
  }, [config, loadedUntil])

  const loadMore = useCallback(() => {
    if (!config || !loadedUntil) return
    const maxDate = addDays(todayInTz(config.timezone), config.maxDaysAhead)
    const from = addDays(loadedUntil, 1)
    const to = minYmd(addDays(loadedUntil, 21), maxDate)
    setLoadingSlots(true)
    void fetchSlots(from, to)
  }, [config, loadedUntil, fetchSlots])

  /** Eén dag opnieuw ophalen (na slot_taken) — overschrijft of verwijdert. */
  const refreshDay = useCallback(async (day: string) => {
    try {
      const res = await fetch(`${PLATFORM}/api/booking/slots?from=${day}&to=${day}`)
      if (!res.ok) throw new Error('slots')
      const data = (await res.json()) as SlotsResponse
      setDays((prev) => {
        const next = { ...prev }
        const fresh = data.days?.[day] ?? []
        if (fresh.length) next[day] = fresh
        else delete next[day]
        return next
      })
    } catch {
      /* stil */
    }
  }, [])

  const beschikbareDagen = useMemo(
    () => Object.keys(days).filter((d) => (days[d]?.length ?? 0) > 0).sort(),
    [days],
  )

  /* --- form --- */
  const setResponse = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: false } : prev))
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!config || !selectedSlot || !selectedDay) return

    const errs: Record<string, boolean> = {}
    for (const f of config.fields) {
      const v = (responses[f.key] ?? '').trim()
      if (f.fieldType === 'checkbox') {
        if (f.required && responses[f.key] !== 'ja') errs[f.key] = true
      } else if (f.required && !v) {
        errs[f.key] = true
      } else if (f.fieldType === 'email' && v && !emailRe.test(v)) {
        errs[f.key] = true
      }
    }
    setFieldErrors(errs)
    if (Object.keys(errs).some((k) => errs[k])) {
      setFormError('Controleer de gemarkeerde velden.')
      return
    }

    setFormError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`${PLATFORM}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startsAt: selectedSlot, responses, website }),
      })
      const data = (await res.json()) as PostResult
      if (data.ok) {
        setConfirmedAt(data.startsAt ?? selectedSlot)
        return
      }
      if (data.code === 'slot_taken') {
        setFormError(data.error)
        await refreshDay(selectedDay)
        setSelectedSlot(null) // terug naar tijd-keuze
      } else {
        setFormError(data.error)
      }
    } catch {
      setFormError('Er ging iets mis bij het versturen. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- render-states ---------------- */

  if (loadingConfig) {
    return (
      <Kaart>
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      </Kaart>
    )
  }

  if (configError || !config) {
    return <FallbackKaart />
  }

  if (confirmedAt) {
    return (
      <Kaart>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-win-gold/10 flex items-center justify-center text-win-gold">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-win-navy mb-3 font-[family-name:var(--font-headline)]">
            Je kennismaking staat gepland
          </h3>
          <p className="text-lg text-win-charcoal/80 leading-relaxed">
            op <span className="font-semibold text-win-navy">{bevestigingLabel(confirmedAt, config.timezone)}</span>.
          </p>
          {config.location && (
            <p className="mt-2 text-win-charcoal/70">
              Locatie: <span className="font-medium text-win-charcoal">{config.location}</span>
            </p>
          )}
          <p className="mt-6 text-sm text-win-charcoal/60">
            Je ontvangt de details per e-mail. Tot binnenkort.
          </p>
        </div>
      </Kaart>
    )
  }

  // Stap 3 — formulier
  if (selectedSlot && selectedDay) {
    return (
      <Kaart>
        <StapKop
          stap={3}
          titel="Jouw gegevens"
          sub={`${bevestigingLabel(selectedSlot, config.timezone)}${config.location ? ` · ${config.location}` : ''}`}
          onTerug={() => {
            setSelectedSlot(null)
            setFormError(null)
          }}
        />
        <form onSubmit={submit} className="space-y-5" noValidate>
          {config.fields.map((f) => (
            <VeldRender
              key={f.key}
              veld={f}
              waarde={responses[f.key] ?? ''}
              fout={!!fieldErrors[f.key]}
              onChange={(v) => setResponse(f.key, v)}
            />
          ))}

          {/* honeypot — echte bezoekers vullen dit nooit in */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px opacity-0"
          />

          {formError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-win-navy transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Spinner small />
                Bezig met plannen…
              </>
            ) : (
              'Kennismaking bevestigen'
            )}
          </button>
        </form>
      </Kaart>
    )
  }

  // Stap 2 — tijdslots van de gekozen dag
  if (selectedDay) {
    const slots = days[selectedDay] ?? []
    const { weekdag, datum } = dagLabel(selectedDay, config.timezone)
    return (
      <Kaart>
        <StapKop
          stap={2}
          titel={`${weekdag} ${datum}`}
          sub="Kies een tijd"
          onTerug={() => {
            setSelectedDay(null)
            setFormError(null)
          }}
        />
        {formError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {formError}
          </p>
        )}
        {slots.length === 0 ? (
          <p className="py-8 text-center text-win-charcoal/70">
            Er zijn geen tijden meer beschikbaar op deze dag. Kies een andere dag.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {slots.map((iso) => (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  setSelectedSlot(iso)
                  setFormError(null)
                }}
                className="rounded-xl border border-win-navy/15 bg-white py-3 text-center font-semibold text-win-navy hover:border-win-gold hover:bg-win-gold/5 transition-colors"
              >
                {tijdLabel(iso, config.timezone)}
              </button>
            ))}
          </div>
        )}
      </Kaart>
    )
  }

  // Stap 1 — dagkiezer
  return (
    <Kaart>
      <StapKop stap={1} titel="Kies een dag" sub="Beschikbare momenten" />
      {beschikbareDagen.length === 0 && loadingSlots ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : beschikbareDagen.length === 0 ? (
        <p className="py-8 text-center text-win-charcoal/70">
          Er zijn op dit moment geen beschikbare momenten. Probeer het later opnieuw of mail naar{' '}
          <a href="mailto:info@wininstituut.nl" className="font-semibold text-win-gold hover:underline">
            info@wininstituut.nl
          </a>
          .
        </p>
      ) : (
        <>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {beschikbareDagen.map((d) => {
              const { weekdag, datum } = dagLabel(d, config.timezone)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className="snap-start shrink-0 min-w-[5rem] rounded-2xl border border-win-navy/15 bg-white px-4 py-3 text-center hover:border-win-gold hover:bg-win-gold/5 transition-colors"
                >
                  <span className="block text-xs uppercase tracking-wider text-win-charcoal/60">{weekdag}</span>
                  <span className="block mt-1 font-bold text-win-navy">{datum}</span>
                  <span className="block mt-1 text-xs text-win-gold font-medium">
                    {days[d]?.length} {days[d]?.length === 1 ? 'tijd' : 'tijden'}
                  </span>
                </button>
              )
            })}
          </div>
          {canLoadMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingSlots}
              className="mt-5 w-full rounded-xl border border-win-navy/15 py-3 text-sm font-semibold text-win-navy hover:border-win-gold hover:text-win-gold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingSlots ? <Spinner small /> : null}
              Meer dagen tonen
            </button>
          )}
        </>
      )}
    </Kaart>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-onderdelen                                                      */
/* ------------------------------------------------------------------ */

function Kaart({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-win-navy/10 bg-white p-6 md:p-10 shadow-xl">{children}</div>
  )
}

function StapKop({
  stap,
  titel,
  sub,
  onTerug,
}: {
  stap: number
  titel: string
  sub?: string
  onTerug?: () => void
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-win-gold">Stap {stap} van 3</span>
        {onTerug && (
          <button
            type="button"
            onClick={onTerug}
            className="text-sm font-semibold text-win-navy/70 hover:text-win-gold transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Terug
          </button>
        )}
      </div>
      <h3 className="mt-3 text-2xl font-bold text-win-navy font-[family-name:var(--font-headline)] first-letter:uppercase">
        {titel}
      </h3>
      {sub && <p className="mt-1 text-win-charcoal/60">{sub}</p>}
    </div>
  )
}

function VeldRender({
  veld,
  waarde,
  fout,
  onChange,
}: {
  veld: BookingField
  waarde: string
  fout: boolean
  onChange: (v: string) => void
}) {
  const randClass = fout ? 'border-red-400 focus:border-red-400' : 'border-win-navy/15 focus:border-win-gold'
  const base = `w-full rounded-xl border ${randClass} bg-white px-4 py-3 text-win-charcoal outline-none transition-colors placeholder:text-win-charcoal/40`

  if (veld.fieldType === 'checkbox') {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={waarde === 'ja'}
          onChange={(e) => onChange(e.target.checked ? 'ja' : '')}
          className="mt-1 h-5 w-5 shrink-0 rounded border-win-navy/30 accent-win-gold"
        />
        <span className={`text-sm leading-relaxed ${fout ? 'text-red-700' : 'text-win-charcoal/80'}`}>
          {veld.label}
          {veld.required && <span className="text-win-gold"> *</span>}
        </span>
      </label>
    )
  }

  return (
    <div>
      <label className="block mb-1.5 text-sm font-semibold text-win-navy">
        {veld.label}
        {veld.required && <span className="text-win-gold"> *</span>}
      </label>
      {veld.fieldType === 'textarea' ? (
        <textarea
          value={waarde}
          onChange={(e) => onChange(e.target.value)}
          placeholder={veld.placeholder ?? undefined}
          rows={4}
          className={`${base} resize-y`}
        />
      ) : veld.fieldType === 'select' ? (
        <select value={waarde} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">Maak een keuze…</option>
          {veld.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={veld.fieldType === 'email' ? 'email' : veld.fieldType === 'phone' ? 'tel' : 'text'}
          value={waarde}
          onChange={(e) => onChange(e.target.value)}
          placeholder={veld.placeholder ?? undefined}
          className={base}
        />
      )}
    </div>
  )
}

function Spinner({ small }: { small?: boolean }) {
  const size = small ? 'h-4 w-4' : 'h-8 w-8'
  return (
    <svg
      className={`${size} animate-spin ${small ? 'text-white' : 'text-win-gold'}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Laden"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

/** Zelfde sfeer als het agendaPlaceholder-blok: gestippelde gouden rand. */
function FallbackKaart() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-win-gold/40 bg-win-cream/50 p-10 md:p-14 text-center shadow-sm">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-win-gold/10 flex items-center justify-center text-win-gold">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-win-navy mb-3 font-[family-name:var(--font-headline)]">
        Online plannen is tijdelijk niet beschikbaar
      </h3>
      <p className="text-win-charcoal/70 leading-relaxed max-w-sm mx-auto">
        Mail naar{' '}
        <a href="mailto:info@wininstituut.nl" className="font-semibold text-win-gold hover:underline">
          info@wininstituut.nl
        </a>{' '}
        en we plannen samen een kennismaking in.
      </p>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-win-gold/80 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-win-gold animate-pulse" />
        Agenda in aanbouw
      </div>
    </div>
  )
}
