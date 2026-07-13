import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { KopAccent, heeftCta, kopTekst, media, mediaUrl } from '@/blocks/ui'
import type { Pagina } from '@/payload-types'

type HeroData = Pagina['hero']

export function RenderHero({ hero }: { hero?: HeroData }) {
  if (!hero) return null

  if (hero.type === 'homeHero') {
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={mediaUrl(hero.foto)}
            alt={media(hero.foto)?.alt ?? ''}
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-win-charcoal/20 to-win-charcoal/60"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white translate-y-[12vh] md:translate-y-[16vh]">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 font-[family-name:var(--font-headline)] [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
            <KopAccent kop={hero.kop} />
          </h1>
          {hero.subtitel && (
            <p className="text-win-gold font-extrabold uppercase tracking-[0.25em] text-sm md:text-base mb-8 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]">
              {hero.subtitel}
            </p>
          )}
          {hero.introZin && (
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-white/95 [text-shadow:0_1px_14px_rgba(0,0,0,0.35)]">
              {hero.introZin}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {heeftCta(hero.cta) && (
              <Link
                className="w-full sm:w-[17rem] text-center bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-win-gold transition-all shadow-xl"
                href={hero.cta.doel}
              >
                {hero.cta.label}
              </Link>
            )}
            {heeftCta(hero.secundaireCta) && (
              <Link
                className="w-full sm:w-[17rem] text-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                href={hero.secundaireCta.doel}
              >
                {hero.secundaireCta.label}
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7M19 6l-7 7-7-7" />
          </svg>
        </div>
      </section>
    )
  }

  if (hero.type === 'kopHeader') {
    return (
      <header className="relative py-24 md:py-28 bg-win-cream overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            className="w-full h-full object-cover opacity-15"
            src={mediaUrl(hero.foto)}
            alt={media(hero.foto)?.alt ?? ''}
            fill
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          {hero.pillLabel && (
            <span className="inline-block px-4 py-1 mb-6 rounded-full border border-win-gold text-win-gold font-semibold tracking-widest text-sm uppercase">
              {hero.pillLabel}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-black text-win-navy leading-tight mb-6 font-[family-name:var(--font-headline)]">
            <KopAccent
              kop={hero.kop}
              accentClass="text-win-gold underline decoration-win-gold/30 underline-offset-8"
            />
          </h1>
          <div className="w-20 h-1.5 bg-win-gold mx-auto mb-8"></div>
          {hero.introZin && (
            <p className="text-xl text-win-charcoal/80 leading-relaxed font-medium max-w-2xl mx-auto">
              {hero.introZin}
            </p>
          )}
        </div>
      </header>
    )
  }

  return (
    <PageHero
      title={<KopAccent kop={hero.kop} />}
      subtitle={hero.subtitel || undefined}
      image={mediaUrl(hero.foto)}
      imageAlt={media(hero.foto)?.alt ?? kopTekst(hero.kop)}
      imagePosition={hero.fotoFocus ?? 'center 25%'}
      cta={heeftCta(hero.cta) ? { label: hero.cta.label, href: hero.cta.doel } : undefined}
      secondaryCta={
        heeftCta(hero.secundaireCta)
          ? { label: hero.secundaireCta.label, href: hero.secundaireCta.doel }
          : undefined
      }
    />
  )
}
