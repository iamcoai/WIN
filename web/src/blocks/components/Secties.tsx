import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CheckIcon, KopAccent, PijlIcon, Tekst, heeftCta, media, mediaUrl } from '@/blocks/ui'
import type {
  AgendaPlaceholderBlok,
  ChecklistKaartBlok,
  ContrastKolommenBlok,
  Dienst,
  DienstenKaartenBlok,
  FotoLabelsSplitBlok,
  GenummerdeLijstBlok,
  HerkenningSplitBlok,
  InvesteringBlok as InvesteringBlokType,
  PijlersDrieluikBlok,
  TabelSectieBlok,
  TrajectenKaartenBlok,
  VerwachtingenLijstBlok,
} from '@/payload-types'

export function HerkenningSplit(props: HerkenningSplitBlok) {
  const { stijl, kop, introZin, alinea, items, afsluiter, cta, foto, fotoQuote } = props
  const fotoUrl = mediaUrl(foto)
  const fotoAlt = media(foto)?.alt ?? ''

  if (stijl === 'herkenning') {
    return (
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-10">
              <div>
                <h2 className="text-4xl font-black text-win-navy mb-4 font-[family-name:var(--font-headline)]">
                  <KopAccent kop={kop} />
                </h2>
                {introZin && <p className="text-win-charcoal/60">{introZin}</p>}
              </div>
              <div className="space-y-6">
                {items?.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckIcon />
                    <p className="text-win-charcoal font-medium">{item.tekst}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                {afsluiter && (
                  <p className="text-lg text-win-charcoal/80 mb-8 font-semibold italic">{afsluiter}</p>
                )}
                {heeftCta(cta) && (
                  <Link
                    href={cta.doel}
                    className="w-full sm:w-auto bg-win-gold text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-win-navy transition-all shadow-xl inline-flex items-center justify-center gap-3"
                  >
                    {cta.label}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                className="absolute inset-0 w-full h-full object-cover object-[62%_30%]"
                src={fotoUrl}
                alt={fotoAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-win-navy/20"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'regie') {
    return (
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy">
                <KopAccent kop={kop} accentClass="italic" />
              </h3>
              {introZin && <p className="text-win-charcoal/70 text-lg">{introZin}</p>}
              <ul className="space-y-6">
                {items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckIcon className="w-6 h-6 text-win-gold mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold block text-win-charcoal">{item.titel}</span>
                      <span className="text-win-charcoal/60">{item.tekst}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
                <Image alt={fotoAlt} className="w-full h-full object-cover" src={fotoUrl} fill />
              </div>
              {fotoQuote && (
                <div className="absolute -bottom-6 -left-6 bg-win-navy p-8 text-win-cream max-w-xs rounded-lg shadow-xl">
                  <p className="italic text-xl font-[family-name:var(--font-headline)]">&quot;{fotoQuote}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'labelBullets') {
    return (
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 order-2 md:order-1 relative aspect-[4/3]">
            <Image className="rounded-2xl shadow-2xl object-cover" src={fotoUrl} alt={fotoAlt} fill />
          </div>
          <div className="md:w-1/2 order-1 md:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-navy">
              <KopAccent kop={kop} />
            </h2>
            {alinea && <p className="text-lg leading-relaxed text-win-charcoal/80">{alinea}</p>}
            <ul className="space-y-4">
              {items?.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckIcon className="w-6 h-6 text-win-gold mt-1 shrink-0" />
                  <span className="text-win-charcoal/90">
                    <strong>{item.titel}</strong> {item.tekst}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  // lijfBrein (default): foto links, bullets rechts
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1 order-2 md:order-1 w-full">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-win-cream rounded-full -z-10"></div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  className="object-cover object-[center_30%] grayscale hover:grayscale-0 transition duration-700"
                  src={fotoUrl}
                  alt={fotoAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-8">
              <KopAccent kop={kop} />
            </h2>
            {alinea && (
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                <Tekst>{alinea}</Tekst>
              </p>
            )}
            <ul className="space-y-4">
              {items?.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckIcon />
                  <span className="text-zinc-800">{item.tekst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function DienstenKaarten(_props: DienstenKaartenBlok) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'diensten', sort: 'volgorde', limit: 10 })
  const nums = ['01', '02', '03', '04', '05']

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {docs.map((card, i) => (
            <div
              key={card.id}
              className="group relative bg-white p-12 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-win-charcoal/5 flex flex-col h-full overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-win-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-win-gold font-bold tracking-tighter text-4xl mb-6">{nums[i]}</span>
                <h3 className="text-3xl mb-4 group-hover:text-win-gold transition-colors font-[family-name:var(--font-headline)]">
                  {card.naam}
                </h3>
                <p className="text-win-charcoal/70 mb-8 leading-relaxed font-light">{card.kaartOmschrijving}</p>
                <div className="mt-auto">
                  <p className="text-xs text-win-charcoal/40 uppercase tracking-widest mb-4">{card.prijsLabel}</p>
                  <Link
                    className="inline-flex items-center gap-3 text-win-gold font-bold group-hover:translate-x-2 transition-transform"
                    href={card.route}
                  >
                    {card.linkTekst} <PijlIcon />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function dienstPrijs(dienst: number | Dienst | null | undefined): string | null {
  if (dienst && typeof dienst === 'object') {
    return [dienst.prijsLabel, dienst.prijsDetail].filter(Boolean).join(' ')
  }
  return null
}

export function TrajectenKaarten(props: TrajectenKaartenBlok) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-16 text-center">
          <KopAccent kop={props.kop} />
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {props.kaarten?.map((k, i) =>
            k.donker ? (
              <div
                key={i}
                className="group bg-win-navy text-white rounded-3xl p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <span className="text-xs tracking-widest text-win-gold font-bold uppercase block mb-4">{k.label}</span>
                <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-headline)]">{k.titel}</h3>
                <p className="text-zinc-300 mb-8 leading-relaxed">{k.omschrijving}</p>
                <div className="text-win-gold font-bold mb-8 italic">{dienstPrijs(k.dienst) ?? k.prijsTekst}</div>
                <Link
                  className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all"
                  href={k.link?.doel ?? '#'}
                >
                  {k.link?.label ?? 'Lees meer'} <PijlIcon />
                </Link>
              </div>
            ) : (
              <div
                key={i}
                className="group border border-zinc-200 rounded-3xl p-10 hover:border-win-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <span className="text-xs tracking-widest text-win-gold font-bold uppercase block mb-4">{k.label}</span>
                <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-headline)]">{k.titel}</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">{k.omschrijving}</p>
                <div className="text-win-charcoal font-bold mb-8 italic">{dienstPrijs(k.dienst) ?? k.prijsTekst}</div>
                <Link
                  className="inline-flex items-center gap-2 text-win-gold font-bold group-hover:gap-4 transition-all"
                  href={k.link?.doel ?? '#'}
                >
                  {k.link?.label ?? 'Lees meer'} <PijlIcon />
                </Link>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export function ChecklistKaart(props: ChecklistKaartBlok) {
  return (
    <section className="py-24 bg-win-cream">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-20 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-[family-name:var(--font-headline)] font-bold mb-10 text-center">
            <KopAccent kop={props.kop} />
          </h2>
          <div className="space-y-6">
            {props.items?.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-win-gold/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <p className="text-zinc-800 font-medium">{item.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContrastKolommen(props: ContrastKolommenBlok) {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-px bg-stone-200 border border-stone-200">
          <div className="bg-white p-12 lg:p-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-xl font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider text-stone-500">
                {props.kolomLinks?.koptitel}
              </h3>
            </div>
            <ul className="space-y-8">
              {props.kolomLinks?.items?.map((item, i) => (
                <li key={i} className="group flex items-start gap-4">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-stone-300 group-hover:bg-red-400 transition-colors"></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.titel}</h4>
                    <p className="text-stone-600 font-light">{item.omschrijving}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-stone-50 p-12 lg:p-20 relative">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-full border border-win-gold flex items-center justify-center text-win-gold">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider text-win-gold">
                {props.kolomRechts?.koptitel}
              </h3>
            </div>
            <ul className="space-y-8">
              {props.kolomRechts?.items?.map((item, i) => (
                <li key={i} className="group flex items-start gap-4">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-win-gold"></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.titel}</h4>
                    <p className="text-win-navy font-light">{item.omschrijving}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PijlersDrieluik(props: PijlersDrieluikBlok) {
  return (
    <section className="py-32 px-6 bg-win-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-navy mb-4">
            <KopAccent kop={props.kop} />
          </h2>
          {props.introZin && <p className="text-win-navy/80 font-light text-lg">{props.introZin}</p>}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {props.pijlers?.map((pillar, i) => (
            <div
              key={i}
              className="bg-white p-10 shadow-xl border-t-4 border-win-gold group hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-2xl font-[family-name:var(--font-headline)] font-bold text-win-navy mb-6">
                {pillar.titel}
              </h3>
              <ul className="space-y-4 text-stone-600 font-light">
                {pillar.punten?.map((item, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-win-gold shrink-0" />
                    {item.tekst}
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

export function FotoLabelsSplit(props: FotoLabelsSplitBlok) {
  const { stijl, kop, alinea, items, foto, badgeTekst, fotoQuote, link } = props
  const fotoUrl = mediaUrl(foto)
  const fotoAlt = media(foto)?.alt ?? ''

  if (stijl === 'begeleidingsvormen') {
    return (
      <section className="py-24 bg-win-navy text-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight italic font-[family-name:var(--font-headline)]">
              <KopAccent kop={kop} />
            </h2>
            {alinea && (
              <p className="text-win-cream/70 mb-12 text-lg font-light leading-relaxed">{alinea}</p>
            )}
            <ul className="space-y-6">
              {items?.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full border border-win-gold flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-win-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-lg block mb-1">{item.groot}</span>
                    <span className="text-win-cream/60 text-sm">{item.klein}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-win-bronze rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={fotoUrl}
                alt={fotoAlt}
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-win-bronze/80 to-transparent"></div>
              {fotoQuote && (
                <div className="absolute bottom-8 left-8">
                  <p className="italic text-2xl text-win-gold font-[family-name:var(--font-headline)]">
                    &quot;{fotoQuote}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // incompany
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl">
            <Image alt={fotoAlt} className="w-full h-full object-cover" src={fotoUrl} fill />
            {badgeTekst && (
              <div className="absolute bottom-0 right-0 bg-win-gold p-8 text-white max-w-xs">
                <p className="font-[family-name:var(--font-headline)] font-bold text-lg leading-tight uppercase tracking-widest">
                  {badgeTekst}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-navy mb-8 uppercase tracking-tighter">
            <KopAccent kop={kop} />
          </h2>
          {alinea && (
            <p className="text-xl text-stone-600 font-light mb-10 leading-relaxed">
              <Tekst>{alinea}</Tekst>
            </p>
          )}
          <div className="grid grid-cols-2 gap-8 mb-10">
            {items?.map((item, i) => (
              <div key={i}>
                <p className="text-win-gold font-bold text-3xl mb-1">{item.groot}</p>
                <p className="text-stone-500 text-sm font-light uppercase tracking-wider">{item.klein}</p>
              </div>
            ))}
          </div>
          {heeftCta(link) && (
            <Link href={link.doel} className="flex items-center gap-4 text-win-gold font-bold group">
              {link.label}{' '}
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export function GenummerdeLijst(props: GenummerdeLijstBlok) {
  const { stijl, kop, accentregel, alinea, items, foto, kaderQuote, kaderOnderschrift } = props
  const nums = ['01', '02', '03', '04']

  if (stijl === 'leeraanpak') {
    return (
      <section className="bg-win-navy py-24 text-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-[family-name:var(--font-headline)] mb-8">
              <KopAccent kop={kop} /> {accentregel && (<><br /><span className="italic text-win-gold">{accentregel}</span></>)}
            </h2>
            <div className="space-y-8">
              {items?.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-win-gold font-[family-name:var(--font-headline)] text-3xl font-bold">
                    {nums[i]}.
                  </span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.titel}</h4>
                    <p className="text-win-cream/60">{item.omschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full border border-win-gold/30 p-8 flex items-center justify-center">
              <div className="aspect-square w-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 relative">
                <Image alt={media(foto)?.alt ?? ''} className="w-full h-full object-cover" src={mediaUrl(foto)} fill />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-win-gold/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'oplevert') {
    return (
      <section className="py-32 bg-win-navy text-win-cream">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold">
              <KopAccent kop={kop} />
            </h2>
            <div className="space-y-6">
              {items?.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckIcon className="w-6 h-6 text-win-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">{item.titel}</h4>
                    <p className="opacity-70 text-sm">{item.omschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-square border border-win-gold/30 p-12 flex flex-col justify-center items-center text-center space-y-6">
              <div className="text-7xl font-[family-name:var(--font-headline)] font-black text-win-gold/20 group-hover:text-win-gold transition-colors duration-700 italic">
                &quot;{kaderQuote}&quot;
              </div>
              {kaderOnderschrift && <p className="text-xl italic font-light opacity-80">-- {kaderOnderschrift}</p>}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'fundamentLinks') {
    return (
      <section className="py-24 bg-win-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-headline)]">
              <KopAccent kop={kop} />
            </h2>
            {alinea && <p className="text-stone-300 text-lg mb-12">{alinea}</p>}
            <div className="grid md:grid-cols-3 gap-8">
              {items?.map((item, i) => (
                <Link key={i} href={item.link?.doel ?? '#'} className="block">
                  <h4 className="text-win-gold font-bold mb-2 uppercase tracking-tighter">{item.titel}</h4>
                  <p className="text-sm text-stone-400">{item.omschrijving}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // resultaat (default)
  return (
    <section className="py-24 bg-win-cream">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-8">
              <KopAccent kop={kop} />
            </h2>
            {alinea && <p className="text-lg text-zinc-700 leading-relaxed mb-10">{alinea}</p>}
          </div>
          <div className="space-y-8">
            {items?.map((result, i) => (
              <div key={i} className="flex items-center gap-6 border-b border-zinc-300 pb-6">
                <span className="text-3xl italic text-win-gold font-[family-name:var(--font-headline)]">{nums[i]}</span>
                <span className="text-xl font-bold">{result.omschrijving ?? result.titel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TabelSectie(props: TabelSectieBlok) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-16 text-center">
          <KopAccent kop={props.kop} />
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-win-gold">
                <th className="py-6 px-4 text-left font-[family-name:var(--font-headline)] text-xl text-win-navy w-1/4">
                  {props.kolomkop1}
                </th>
                <th className="py-6 px-4 text-left font-[family-name:var(--font-headline)] text-xl text-win-navy">
                  {props.kolomkop2}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-win-navy/10">
              {props.rijen?.map((row, i) => (
                <tr key={i} className="group hover:bg-win-cream/50 transition-colors">
                  <td className="py-8 px-4 font-bold text-win-charcoal">{row.kolom1}</td>
                  <td className="py-8 px-4 text-win-charcoal/70 italic">{row.kolom2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function InvesteringBlok(props: InvesteringBlokType) {
  const prijs = dienstPrijs(props.dienst)
  const zin = props.prijsZin?.replace('{prijs}', prijs ?? '')
  const delen = zin?.split(/(<b>[^<]*<\/b>)/) ?? []

  return (
    <section className="py-32 bg-white text-center">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {props.eyebrow && (
          <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold">{props.eyebrow}</span>
        )}
        <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-navy">
          <KopAccent kop={props.kop} />
        </h2>
        <div className="h-px w-24 bg-win-gold mx-auto"></div>
        {zin && (
          <p className="text-xl text-win-charcoal/80 leading-relaxed italic">
            &quot;
            {prijs && zin.includes(prijs)
              ? zin.split(prijs).map((deel, i, arr) => (
                  <span key={i}>
                    {deel}
                    {i < arr.length - 1 && <span className="text-win-navy font-bold">{prijs}</span>}
                  </span>
                ))
              : zin}
            &quot;
          </p>
        )}
        {props.rationale && (
          <p className="text-sm text-win-charcoal/50 max-w-lg mx-auto">{props.rationale}</p>
        )}
      </div>
    </section>
  )
}

export function VerwachtingenLijst(props: VerwachtingenLijstBlok) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-win-navy font-[family-name:var(--font-headline)]">
            <KopAccent kop={props.kop} />
          </h2>
          <div className="space-y-6">
            {props.items?.map((v, i) => (
              <div key={i} className="flex gap-4">
                <CheckIcon className="w-6 h-6 text-win-gold shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-win-charcoal mb-1 font-[family-name:var(--font-headline)]">
                    {v.titel}
                  </h3>
                  <p className="text-win-charcoal/70 leading-relaxed">{v.tekst}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AgendaKaart />
      </div>
    </section>
  )
}

function AgendaKaart({ kopTekst = 'Online agenda volgt', tekst, statusLabel = 'Agenda in aanbouw' }: { kopTekst?: string; tekst?: string | null; statusLabel?: string }) {
  return (
    <div className="relative">
      <div className="rounded-3xl border-2 border-dashed border-win-gold/40 bg-win-cream/50 p-10 md:p-14 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-win-gold/10 flex items-center justify-center text-win-gold">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-win-navy mb-3 font-[family-name:var(--font-headline)]">{kopTekst}</h3>
        {tekst && <p className="text-win-charcoal/70 leading-relaxed max-w-sm mx-auto">{tekst}</p>}
        <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-win-gold/80 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-win-gold animate-pulse"></span>
          {statusLabel}
        </div>
      </div>
    </div>
  )
}

export function AgendaPlaceholder(props: AgendaPlaceholderBlok) {
  return (
    <section className="pb-24 bg-white -mt-12">
      <div className="max-w-3xl mx-auto px-6">
        <AgendaKaart kopTekst={props.kopTekst ?? undefined} tekst={props.tekst} statusLabel={props.statusLabel ?? undefined} />
      </div>
    </section>
  )
}
