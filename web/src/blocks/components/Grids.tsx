import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FeatureCard, domainIcons } from '@/components/feature-card'
import { KopAccent, PijlIcon, Tekst, media, mediaUrl } from '@/blocks/ui'
import type {
  BadgesRijBlok,
  BentoGridBlok,
  FotoKaartenRijBlok,
  KaartenGridBlok,
  PublicatiesGridBlok,
} from '@/payload-types'

const domeinIconKeys: Record<string, string> = {
  fysiek: 'Fysiek',
  mentaal: 'Mentaal',
  sociaal: 'Sociaal',
  emotioneel: 'Emotioneel',
}

export async function KaartenGrid(props: KaartenGridBlok) {
  const { stijl, kop, introZin, afsluitQuote } = props
  let items = props.items ?? []

  if (stijl === 'methodes') {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'methodes', sort: 'volgorde', limit: 50 })
    items = docs.map((m) => ({ titel: m.titel, omschrijving: m.omschrijving, icoon: 'geen' as const }))
  }

  if (stijl === 'waardedriehoek') {
    return (
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-4">
            <KopAccent kop={kop} />
          </h2>
          <div className="h-1.5 w-20 bg-win-gold mx-auto mb-16"></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {items.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl shadow-xl">
                <h3 className="text-3xl font-[family-name:var(--font-headline)] font-bold text-win-gold mb-4">
                  {v.titel}
                </h3>
                <p className="text-zinc-600 leading-relaxed">{v.omschrijving}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'domeinenRond') {
    return (
      <section className="py-24 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-navy mb-6">
              <KopAccent kop={kop} />
            </h2>
            {introZin && <p className="text-xl max-w-2xl mx-auto text-win-charcoal/70">{introZin}</p>}
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {items.map((domain, i) => (
              <div
                key={i}
                className="group p-8 bg-win-cream rounded-xl border border-transparent hover:border-win-gold/30 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-win-navy/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-win-gold/20 transition-colors">
                  <svg className="w-7 h-7 text-win-navy group-hover:text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-headline)]">{domain.titel}</h3>
                <p className="text-win-charcoal/70">{domain.omschrijving}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'witKader') {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white p-12 md:p-20 shadow-sm border border-win-gold/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {items.map((item, i) => (
                <FeatureCard key={i} title={item.titel ?? ''} description={item.omschrijving ?? ''} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'voorWieTegels') {
    return (
      <section className="py-24 bg-win-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-win-navy mb-8 font-[family-name:var(--font-headline)]">
            <KopAccent kop={kop} />
          </h2>
          {introZin && (
            <p className="text-xl text-win-charcoal leading-relaxed mb-12">
              <Tekst cursief="italic" goud="font-bold" sterk="font-bold">{introZin}</Tekst>
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-win-gold/10 text-win-gold flex items-center justify-center group-hover:bg-win-gold group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-win-charcoal/80 font-medium leading-relaxed">{item.omschrijving}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const isMethodes = stijl === 'methodes'
  const isDomeinen = stijl === 'domeinen'
  return (
    <section className={isDomeinen ? 'py-24 bg-white' : 'py-24 ' + (isMethodes ? 'bg-white' : 'bg-win-cream')}>
      <div className={`max-w-7xl mx-auto px-${isDomeinen ? '6' : '8'}`}>
        <div className="text-center mb-16">
          <h2 className={isDomeinen ? 'text-4xl md:text-5xl font-black text-win-navy mb-6 font-[family-name:var(--font-headline)]' : 'text-4xl font-[family-name:var(--font-headline)] font-bold mb-4'}>
            <KopAccent kop={kop} />
          </h2>
          {isMethodes && <div className="h-1.5 w-20 bg-win-gold mx-auto mb-6"></div>}
          {introZin && (
            <p className={isDomeinen ? 'text-xl text-win-charcoal/60 max-w-2xl mx-auto' : 'text-zinc-600 max-w-2xl mx-auto'}>
              {introZin}
            </p>
          )}
        </div>
        <div className={isMethodes ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'grid md:grid-cols-2 lg:grid-cols-4 gap-8'}>
          {items.map((item, i) => (
            <FeatureCard
              key={i}
              icon={item.icoon && domeinIconKeys[item.icoon] ? domainIcons[domeinIconKeys[item.icoon]] : undefined}
              title={item.titel ?? ''}
              description={item.omschrijving ?? ''}
            />
          ))}
        </div>
        {afsluitQuote && (
          <div className="max-w-3xl mx-auto px-8 mt-16 text-center">
            <p className="text-xl md:text-2xl font-light italic text-win-navy leading-relaxed">
              &quot;{afsluitQuote}&quot;
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export function BentoGrid(props: BentoGridBlok) {
  const { stijl, kop, subLabel, kaarten } = props

  if (stijl === 'watHetBrengt') {
    const spans = ['', 'md:col-span-2', 'md:col-span-2', '']
    return (
      <section className="py-24 bg-win-navy text-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] mb-4">
              <KopAccent kop={kop} />
            </h2>
            {subLabel && <p className="text-win-gold tracking-widest uppercase text-sm">{subLabel}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kaarten?.map((k, i) => (
              <div
                key={i}
                className={`bg-win-charcoal/40 p-10 rounded-xl border border-white/10 flex flex-col justify-between ${spans[i] ?? ''}`}
              >
                <div>
                  <h4 className="text-2xl font-[family-name:var(--font-headline)] mb-3">{k.titel}</h4>
                  <p className="text-win-cream/60">{k.omschrijving}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // opleidingen-bento: navy(7) / wit(5) / wit(5) / goud(7)
  const kaart = kaarten ?? []
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {kaart[0] && (
          <div className="lg:col-span-7 bg-win-navy text-win-cream p-12 lg:p-20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-headline)] mb-6">{kaart[0].titel}</h3>
              <p className="text-win-cream/70 text-lg mb-10 leading-relaxed max-w-md">{kaart[0].omschrijving}</p>
            </div>
          </div>
        )}
        {kaart.slice(1, 3).map((k, i) => (
          <div key={i} className="lg:col-span-5 bg-white border border-win-navy/10 p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-[family-name:var(--font-headline)] text-win-navy mb-4">{k.titel}</h3>
              <p className="text-win-charcoal/70 leading-relaxed">{k.omschrijving}</p>
            </div>
          </div>
        ))}
        {kaart[3] && (
          <div className="lg:col-span-7 bg-win-gold p-12 lg:p-20 text-win-cream relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-headline)] mb-6">{kaart[3].titel}</h3>
              <p className="text-white/90 text-lg mb-10 leading-relaxed">{kaart[3].omschrijving}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function BadgesRij(props: BadgesRijBlok) {
  const { stijl, kop, alinea, badges, foto } = props

  if (stijl === 'rollen') {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-4">
              <KopAccent kop={kop} />
            </h2>
            <div className="h-1 w-20 bg-win-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {badges?.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 hover:bg-win-cream transition-colors duration-300 group">
                <div className="w-16 h-16 rounded-full bg-win-navy/5 flex items-center justify-center mb-6 group-hover:bg-win-gold transition-colors">
                  <svg className="w-6 h-6 text-win-navy group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <span className="text-sm uppercase font-bold tracking-wider">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'doelgroepen') {
    return (
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-8">
                <KopAccent kop={kop} />
              </h2>
              {alinea && <p className="text-lg text-win-charcoal/70 mb-12">{alinea}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges?.map((b, i) => (
                  <div
                    key={i}
                    className={`group flex items-center gap-4 bg-win-cream/70 rounded-xl p-5 border border-stone-100 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all ${i === (badges?.length ?? 0) - 1 && (badges?.length ?? 0) % 2 === 1 ? 'sm:col-span-2' : ''}`}
                  >
                    <div className="w-11 h-11 shrink-0 rounded-lg bg-win-gold/10 text-win-gold flex items-center justify-center group-hover:bg-win-gold group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-win-navy">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px] relative">
              <Image
                className="w-full h-full object-cover object-[center_30%]"
                src={mediaUrl(foto)}
                alt={media(foto)?.alt ?? ''}
                fill
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // expertise-badges
  return (
    <section className="py-24 bg-win-cream border-y border-win-navy/10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-[family-name:var(--font-headline)] text-win-navy mb-12 text-center">
          <KopAccent kop={kop} />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges?.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-win-gold group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="font-bold text-win-navy block">{item.label}</span>
              <span className="text-xs uppercase text-win-navy/60">{item.subLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FotoKaartenRij(props: FotoKaartenRijBlok) {
  return (
    <section className="py-24 px-8 bg-win-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {props.kaarten?.map((pillar, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <Image
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src={mediaUrl(pillar.foto)}
                  alt={media(pillar.foto)?.alt ?? pillar.titel ?? ''}
                  fill
                />
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-[family-name:var(--font-headline)] text-win-navy mb-4">{pillar.titel}</h3>
                <p className="text-win-charcoal/70 mb-8">{pillar.omschrijving}</p>
                <Link
                  className="mt-auto text-win-gold font-bold inline-flex items-center gap-2 group/link"
                  href={pillar.link?.doel ?? '#'}
                >
                  {pillar.linkTekst}{' '}
                  <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function PublicatiesGrid(props: PublicatiesGridBlok) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'publicaties', sort: 'volgorde', limit: 12 })

  return (
    <section className="py-24 px-8 bg-win-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-[family-name:var(--font-headline)] text-win-navy mb-12 text-center md:text-left">
          <KopAccent kop={props.kop} />
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {docs.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                <Image
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  src={mediaUrl(article.foto)}
                  alt={media(article.foto)?.alt ?? article.titel}
                  fill
                />
              </div>
              <h3 className="text-xl font-[family-name:var(--font-headline)] text-win-navy mb-3 group-hover:text-win-gold transition-colors">
                {article.titel}
              </h3>
              <p className="text-win-charcoal/60 text-sm mb-4">{article.themaLabel}</p>
              <span className="text-win-gold flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                Lees Paper <PijlIcon className="w-4 h-4" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
