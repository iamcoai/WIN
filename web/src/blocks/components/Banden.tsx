import Link from 'next/link'
import { KopAccent, Tekst, heeftCta } from '@/blocks/ui'
import type {
  CalloutBandBlok,
  CtaBandBlok,
  DonkerPaneelBlok,
  OntwikkellijnBandBlok,
  ProgressieCirkelsBlok,
  QuoteBandBlok,
} from '@/payload-types'

const FASE_TITELS = ['Fundamenteren', 'Stabiliseren', 'Versterken', 'Leiderschap']

export function QuoteBand(props: QuoteBandBlok) {
  const { stijl, kop, quote, accentDeel, toonWaardedriehoek } = props

  if (stijl === 'kaartGoudrand') {
    return (
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-win-navy/5 border-l-4 border-win-gold p-12 relative">
            <span className="text-win-gold absolute top-4 right-4 opacity-30 text-6xl">&ldquo;</span>
            <p className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] text-win-navy leading-snug">
              &quot;<Tekst goud="text-win-gold font-bold">{quote}</Tekst>&quot;
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'gecentreerdLicht') {
    return (
      <section className="py-24 bg-white/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] leading-relaxed text-win-navy font-light">
            &quot;<Tekst goud="text-win-gold font-semibold italic">{quote}</Tekst>&quot;
          </p>
        </div>
      </section>
    )
  }

  if (stijl === 'statementRand') {
    return (
      <section className="py-24 px-6 bg-win-cream">
        <div className="max-w-5xl mx-auto border-l-4 border-win-gold pl-8 md:pl-16">
          <p className="text-2xl md:text-4xl font-[family-name:var(--font-headline)] text-win-charcoal leading-relaxed font-light">
            <Tekst goud="text-win-gold font-bold">{quote}</Tekst>
          </p>
        </div>
      </section>
    )
  }

  if (stijl === 'navyTekst') {
    return (
      <section className="py-24 px-8 bg-win-navy text-win-cream text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-[family-name:var(--font-headline)] mb-6">
            <KopAccent kop={kop} />
          </h2>
          {quote && <p className="text-lg opacity-80 mb-12">{quote}</p>}
        </div>
      </section>
    )
  }

  // navyBand (home-statement)
  return (
    <section className="py-16 bg-win-navy text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="inline-block w-12 h-1 bg-win-gold mb-8"></div>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10 italic font-[family-name:var(--font-headline)]">
          &quot;{quote}&quot;
        </h2>
        {toonWaardedriehoek && (
          <div className="flex items-center justify-center gap-4 text-win-gold">
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Zin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-win-gold/30"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Betekenis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-win-gold/30"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Vrijheid</span>
          </div>
        )}
      </div>
    </section>
  )
}

export function OntwikkellijnBand(props: OntwikkellijnBandBlok) {
  const { stijl, kop, eyebrow, introZin, fasen } = props
  const nums = ['01', '02', '03', '04']

  if (stijl === 'cirkels') {
    return (
      <section className="py-24 bg-white/50 border-y border-win-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 italic font-[family-name:var(--font-headline)]">
              <KopAccent kop={kop} />
            </h2>
            {introZin && (
              <p className="text-win-charcoal/60 uppercase tracking-widest text-xs">{introZin}</p>
            )}
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-win-gold/10 via-win-gold to-win-gold/10 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {fasen?.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full bg-win-cream border border-win-gold/30 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="text-win-gold text-2xl font-bold">{nums[i]}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-headline)] font-bold text-lg mb-2">{FASE_TITELS[i]}</h3>
                  <p className="text-sm text-win-charcoal/60 px-4">{step.omschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'verspringend') {
    const mts = ['', 'md:mt-8', '', 'md:mt-8']
    return (
      <section className="py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          {eyebrow && (
            <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block">{eyebrow}</span>
          )}
          <h2 className="text-5xl font-[family-name:var(--font-headline)] font-bold text-win-navy">
            <KopAccent kop={kop} />
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-win-gold/20 hidden md:block -translate-y-1/2"></div>
            {fasen?.map((step, i) => (
              <div
                key={i}
                className={`relative bg-white p-10 space-y-6 group hover:bg-win-gold transition-all duration-500 hover:-translate-y-2 ${mts[i]}`}
              >
                <span className="text-5xl font-[family-name:var(--font-headline)] font-black text-win-gold/20 group-hover:text-white/20 transition-colors">
                  {nums[i]}
                </span>
                <h3 className="text-xl font-bold text-win-navy group-hover:text-white uppercase tracking-widest">
                  {FASE_TITELS[i]}
                </h3>
                <p className="text-sm text-win-charcoal/60 group-hover:text-white/70">{step.omschrijving}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'uitgebreid') {
    const mts = ['', 'mt-8 lg:mt-12', 'mt-0 lg:mt-6', 'mt-8 lg:mt-16']
    return (
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-win-navy mb-4 font-[family-name:var(--font-headline)]">
              <KopAccent kop={kop} />
            </h2>
            {introZin && <p className="text-stone-500 max-w-xl mx-auto">{introZin}</p>}
          </div>
          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 -z-0"></div>
            {fasen?.map((phase, i) => (
              <div
                key={i}
                className={`relative z-10 bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group ${mts[i]}`}
              >
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-win-gold transition-colors">
                  <span className="text-win-gold font-bold group-hover:text-white">{nums[i]}</span>
                </div>
                <h3 className="text-xl font-bold text-win-navy mb-4 font-[family-name:var(--font-headline)]">
                  Fase {i + 1} — {FASE_TITELS[i]}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">{phase.omschrijving}</p>
                <ul className="space-y-2">
                  {phase.subItems?.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-stone-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // navyKaarten / bronzeKaarten
  const donker = stijl === 'bronzeKaarten' ? 'bg-win-bronze' : 'bg-win-navy'
  const subKleur = stijl === 'bronzeKaarten' ? 'text-zinc-400' : 'text-stone-300'
  return (
    <section className={`py-24 ${donker} text-white`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-4">
            <KopAccent kop={kop} />
          </h2>
          {introZin && <p className="text-stone-300 max-w-2xl mx-auto mb-6">{introZin}</p>}
          <div className="h-1 w-20 bg-win-gold mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {fasen?.map((phase, i) => (
            <div
              key={i}
              className="group relative bg-white/5 p-10 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
            >
              <div className="text-6xl font-black text-white/10 absolute top-4 right-6 group-hover:text-win-gold/20 transition-colors">
                {nums[i]}
              </div>
              <h3 className="text-xl font-bold mb-4 text-win-gold">{FASE_TITELS[i]}</h3>
              <p className={`text-sm ${subKleur}`}>{phase.omschrijving}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DonkerPaneel(props: DonkerPaneelBlok) {
  const { stijl, eyebrow, kop, alinea, kolommen } = props

  if (stijl === 'bronzeSkew') {
    return (
      <section className="py-32 bg-win-bronze text-win-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-win-navy opacity-30 transform skew-x-12"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-12">
            <div className="space-y-4">
              {eyebrow && (
                <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold">{eyebrow}</span>
              )}
              <h2 className="text-5xl font-[family-name:var(--font-headline)] font-extrabold leading-tight">
                <KopAccent kop={kop} />
              </h2>
            </div>
            {alinea && <p className="text-xl font-light text-win-cream/80 leading-relaxed">{alinea}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-win-gold/30">
              {kolommen?.map((k, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold text-win-gold">{k.titel}</h3>
                  <ul className="space-y-3 opacity-80 font-light">
                    {k.items?.map((item, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-win-gold rounded-full"></span> {item.tekst}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // navyCentered (rouw & verlies)
  return (
    <section className="py-32 px-6 bg-win-navy text-win-cream overflow-hidden relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center mb-12">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-win-gold"></div>
        </div>
        <div className="text-center">
          {eyebrow && (
            <span className="text-win-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">{eyebrow}</span>
          )}
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-headline)] font-black mb-10 leading-tight">
            <KopAccent kop={kop} />
          </h2>
          {alinea && (
            <p className="text-xl md:text-2xl font-light text-win-cream/80 mb-12 leading-relaxed">{alinea}</p>
          )}
          <div className="grid md:grid-cols-2 gap-8 text-left mb-16">
            {kolommen?.map((k, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                <h4 className="text-win-gold font-bold mb-4 uppercase tracking-wider">{k.titel}</h4>
                <p className="text-sm font-light text-stone-300">{k.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProgressieCirkels(props: ProgressieCirkelsBlok) {
  return (
    <section className="py-24 px-8 bg-win-navy text-win-cream">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-[family-name:var(--font-headline)] mb-16">
          <KopAccent kop={props.kop} />
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-win-gold/20 hidden md:block -translate-y-1/2 z-0"></div>
          <div className="relative z-10 bg-win-navy border-2 border-win-gold/30 p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center">
            <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 1</span>
            <span className="text-xl font-bold">Weerbaarheid</span>
          </div>
          <div className="relative z-10 bg-win-navy border-2 border-win-gold/60 p-8 rounded-full w-56 h-56 flex flex-col items-center justify-center scale-110">
            <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 2</span>
            <span className="text-2xl font-bold">Groei</span>
          </div>
          <div className="relative z-10 bg-win-navy border-2 border-win-gold p-8 rounded-full w-64 h-64 flex flex-col items-center justify-center scale-125">
            <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 3</span>
            <span className="text-3xl font-bold">Leiderschap</span>
          </div>
        </div>
        {props.afsluitQuote && <p className="mt-24 text-xl italic opacity-80">&quot;{props.afsluitQuote}&quot;</p>}
      </div>
    </section>
  )
}

export function CalloutBand(props: CalloutBandBlok) {
  return (
    <section className="py-20 px-8">
      <div className="max-w-5xl mx-auto bg-win-navy text-win-cream p-12 md:p-20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-3xl font-[family-name:var(--font-headline)] mb-4">
              <KopAccent kop={props.kop} />
            </h2>
            {props.alinea && <p className="text-win-cream/80 text-lg">{props.alinea}</p>}
          </div>
          {props.externeUrl && (
            <a
              className="px-8 py-4 bg-win-gold text-white font-semibold flex items-center gap-2 hover:bg-win-gold/90 transition-colors shrink-0"
              href={props.externeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.knopLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export function CtaBand(props: CtaBandBlok) {
  const { stijl, kop, alinea, cta, secundaireCta, secundaireTekst, disclaimer, contactTitel, contactSub } = props

  if (stijl === 'goud') {
    return (
      <section className="py-32 relative overflow-hidden bg-win-gold">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 font-[family-name:var(--font-headline)]">
            <KopAccent kop={kop} accentClass="text-white" />
          </h2>
          {alinea && <p className="text-xl text-yellow-100 mb-12">{alinea}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {heeftCta(cta) && (
              <Link
                className="bg-win-bronze text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform inline-block"
                href={cta.doel}
              >
                {cta.label}
              </Link>
            )}
            {heeftCta(secundaireCta) && (
              <Link
                className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/30 transition-all inline-block"
                href={secundaireCta.doel}
              >
                {secundaireCta.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'cream') {
    return (
      <section className="py-32 bg-win-cream text-center px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl text-win-charcoal mb-12 leading-tight font-[family-name:var(--font-headline)]">
            <KopAccent kop={kop} accentClass="text-win-gold italic" />
          </h2>
          {heeftCta(cta) && (
            <Link
              href={cta.doel}
              className="bg-win-gold text-white px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-xl inline-block"
            >
              {cta.label}
            </Link>
          )}
          {disclaimer && <p className="mt-8 text-win-charcoal/50 text-sm italic">{disclaimer}</p>}
        </div>
      </section>
    )
  }

  if (stijl === 'creamKader') {
    return (
      <section className="pb-32 px-8 pt-24">
        <div className="max-w-5xl mx-auto bg-win-cream border-2 border-win-gold/30 p-16 text-center relative">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-navy mb-8">
            <KopAccent kop={kop} />
          </h2>
          {alinea && <p className="text-xl text-win-charcoal/70 mb-12 max-w-2xl mx-auto">{alinea}</p>}
          {heeftCta(cta) && (
            <Link
              className="inline-block bg-win-gold text-white px-10 py-5 uppercase tracking-widest font-bold hover:bg-win-navy transition-colors duration-300 shadow-xl"
              href={cta.doel}
            >
              {cta.label}
            </Link>
          )}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-win-gold/40"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-win-gold/40"></div>
        </div>
      </section>
    )
  }

  if (stijl === 'charcoal') {
    return (
      <section className="py-24 px-8 bg-win-charcoal text-win-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-headline)] mb-8">
            <KopAccent kop={kop} />
          </h2>
          {alinea && <p className="text-xl mb-12 opacity-80">{alinea}</p>}
          {heeftCta(cta) && (
            <Link
              className="bg-win-gold text-white px-10 py-5 rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-xl inline-block"
              href={cta.doel}
            >
              {cta.label}
            </Link>
          )}
        </div>
      </section>
    )
  }

  if (stijl === 'witKaart') {
    return (
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-12 md:p-20 flex-1">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-navy mb-8">
              <KopAccent kop={kop} />
            </h2>
            {alinea && <p className="text-stone-600 mb-10 text-lg">{alinea}</p>}
            {heeftCta(cta) && (
              <Link
                href={cta.doel}
                className="bg-win-gold hover:bg-win-navy text-white px-10 py-5 rounded-lg font-bold text-lg shadow-lg transition-all inline-block"
              >
                {cta.label}
              </Link>
            )}
          </div>
          <div className="w-full md:w-1/3 bg-win-gold/10 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-win-gold mx-auto mb-6 flex items-center justify-center text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.026a43.4 43.4 0 00-1.481-.055C3.51 7.546 2.25 8.806 2.25 10.368v.442c0 .812.33 1.594.915 2.158l3.04 2.93c.384.369.59.87.59 1.393v3.634a.75.75 0 001.5 0v-3.634c0-.87-.344-1.706-.957-2.32l-3.04-2.929A1.316 1.316 0 013.75 10.81v-.442c0-.627.508-1.118 1.17-1.072.46.032.92.072 1.38.119v.76a.75.75 0 001.5 0v-.62a44.82 44.82 0 011.25.12v.5a.75.75 0 001.5 0v-.313a42.2 42.2 0 015 .145v.168a.75.75 0 001.5 0v-.032a43.82 43.82 0 011.25-.048v.312a.75.75 0 001.5 0v-.46a44.59 44.59 0 011.38-.168c.662-.046 1.17.445 1.17 1.072v.442c0 .37-.156.725-.434.984l-3.04 2.929a3.317 3.317 0 00-.957 2.32v3.634a.75.75 0 001.5 0v-3.634c0-.524.207-1.024.59-1.393l3.04-2.93a3.316 3.316 0 00.915-2.158v-.442c0-1.562-1.26-2.822-2.869-2.822a43.4 43.4 0 00-1.481.055V4.575a1.575 1.575 0 00-3.15 0v3.159a44.94 44.94 0 00-1.25.05V4.575a1.575 1.575 0 00-3.15 0v3.34a44.746 44.746 0 00-1.25-.113V4.575z" />
                </svg>
              </div>
              <p className="font-[family-name:var(--font-headline)] font-bold text-win-navy">{contactTitel}</p>
              <p className="text-stone-600 font-light">{contactSub}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'mentorschap') {
    return (
      <section className="py-40 bg-win-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-win-navy tracking-tighter leading-tight">
            <KopAccent kop={kop} />
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {heeftCta(cta) && (
              <Link
                className="bg-win-gold text-win-cream px-12 py-5 font-[family-name:var(--font-headline)] uppercase tracking-widest text-sm font-bold hover:scale-105 transition-all shadow-xl"
                href={cta.doel}
              >
                {cta.label}
              </Link>
            )}
            {heeftCta(secundaireCta) && (
              <Link href={secundaireCta.doel} className="text-sm opacity-50 tracking-widest uppercase">
                {secundaireCta.label ?? secundaireTekst}
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/50 to-transparent -z-10"></div>
      </section>
    )
  }

  // navy (default)
  return (
    <section className="py-32 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-win-navy -z-10"></div>
      <div className="max-w-7xl mx-auto px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-extrabold mb-8 max-w-4xl mx-auto leading-tight">
          <KopAccent kop={kop} accentClass="italic" />
        </h2>
        {alinea && <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">{alinea}</p>}
        {heeftCta(cta) && (
          <Link
            href={cta.doel}
            className="bg-win-gold hover:bg-win-navy text-white px-12 py-5 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-block"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  )
}
