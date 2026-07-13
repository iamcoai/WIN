import type { Media } from '@/payload-types'

export type FotoRef = number | Media | null | undefined

export function media(f: FotoRef): Media | null {
  if (f && typeof f === 'object') return f
  return null
}

export function mediaUrl(f: FotoRef): string {
  return media(f)?.url ?? ''
}

export function mediaAlt(f: FotoRef, fallback = ''): string {
  return media(f)?.alt ?? fallback
}

type Kop = { voor?: string | null; accent?: string | null; na?: string | null } | null | undefined

export function kopTekst(kop: Kop): string {
  return [kop?.voor, kop?.accent, kop?.na].filter(Boolean).join(' ')
}

/** Kop met gouden accentwoord — het accent-effect zit hier in code. */
export function KopAccent({
  kop,
  accentClass = 'text-win-gold',
}: {
  kop: Kop
  accentClass?: string
}) {
  if (!kop) return null
  return (
    <>
      {kop.voor ? <>{kop.voor} </> : null}
      {kop.accent ? <span className={accentClass}>{kop.accent}</span> : null}
      {kop.na ? <> {kop.na}</> : null}
    </>
  )
}

export function CheckIcon({ className = 'w-6 h-6 text-win-gold shrink-0 mt-0.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function PijlIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
  )
}

export type CtaData = { label?: string | null; doel?: string | null } | null | undefined

export function heeftCta(cta: CtaData): cta is { label: string; doel: string } {
  return Boolean(cta?.label && cta?.doel)
}

/**
 * Inline-accenten in lopende tekst, zodat de bestaande gouden/cursieve woorden
 * uit het design behouden blijven én Reza ze kan verplaatsen:
 *   **woord**  → goud semibold      *woord*  → cursief      __woord__ → navy semibold
 */
export function Tekst({
  children,
  goud = 'text-win-gold font-semibold',
  cursief = 'italic',
  sterk = 'text-win-navy font-semibold',
}: {
  children?: string | null
  goud?: string
  cursief?: string
  sterk?: string
}) {
  if (!children) return null
  const delen = children.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*)/g)
  return (
    <>
      {delen.map((d, i) => {
        if (d.startsWith('**') && d.endsWith('**')) return <span key={i} className={goud}>{d.slice(2, -2)}</span>
        if (d.startsWith('__') && d.endsWith('__')) return <span key={i} className={sterk}>{d.slice(2, -2)}</span>
        if (d.startsWith('*') && d.endsWith('*')) return <span key={i} className={cursief}>{d.slice(1, -1)}</span>
        return <span key={i}>{d}</span>
      })}
    </>
  )
}
