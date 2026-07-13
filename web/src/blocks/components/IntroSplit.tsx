import Image from 'next/image'
import { FeatureCard } from '@/components/feature-card'
import { CheckIcon, KopAccent, Tekst, media, mediaUrl } from '@/blocks/ui'
import type { IntroSplitBlok } from '@/payload-types'

export function IntroSplit(props: IntroSplitBlok) {
  const { stijl, eyebrow, kop, quote, alineas, blockquote, citeLabel, foto, fotoKaartTekst, tegels, bullets } = props
  const fotoUrl = mediaUrl(foto)
  const fotoAlt = media(foto)?.alt ?? ''

  if (stijl === 'homeIntro') {
    return (
      <section className="py-24 bg-win-cream relative overflow-hidden" id="intro">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-win-navy leading-tight font-[family-name:var(--font-headline)]">
                <KopAccent kop={kop} accentClass="text-win-gold underline decoration-win-gold/30 underline-offset-8" />
              </h2>
              <div className="w-20 h-1.5 bg-win-gold"></div>
              {alineas?.[0] && (
                <p className="text-xl text-win-charcoal/80 leading-relaxed font-medium">
                  <Tekst>{alineas[0].tekst}</Tekst>
                </p>
              )}
              {alineas?.slice(1).map((a, i) => (
                <p key={i} className="text-lg text-win-charcoal/70 leading-relaxed">
                  <Tekst>{a.tekst}</Tekst>
                </p>
              ))}
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-win-navy/5 rounded-2xl transition-all group-hover:bg-win-navy/10"></div>
              <Image
                className="relative rounded-xl shadow-2xl w-full aspect-[4/5] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                src={fotoUrl}
                alt={fotoAlt}
                width={600}
                height={750}
              />
              {fotoKaartTekst && (
                <div className="absolute -bottom-8 -left-8 bg-win-gold p-8 rounded-xl shadow-2xl max-w-xs hidden md:block">
                  <p className="text-white font-bold italic leading-snug">{fotoKaartTekst}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'oorsprong') {
    return (
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy leading-tight">
              <KopAccent kop={kop} />
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-win-charcoal/80">
              {alineas?.map((a, i) => (
                <p key={i}>
                  <Tekst>{a.tekst}</Tekst>
                </p>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-12 shadow-2xl border-l-8 border-win-gold relative z-10">
              <span className="text-6xl text-win-gold/20 absolute top-4 left-4">&ldquo;</span>
              <blockquote className="font-[family-name:var(--font-headline)] italic text-2xl text-win-navy leading-relaxed relative">
                &quot;{quote}&quot;
              </blockquote>
              {citeLabel && (
                <cite className="block mt-6 font-semibold text-win-gold not-italic">-- {citeLabel}</cite>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-win-navy/10 -z-10"></div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'fotoLabelKaart') {
    return (
      <section className="py-24 px-8 bg-white/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square">
            <Image className="w-full h-full object-cover shadow-2xl rounded-lg" src={fotoUrl} alt={fotoAlt} fill />
            {fotoKaartTekst && (
              <div className="absolute -bottom-6 -right-6 bg-win-gold p-8 text-white hidden md:block">
                <p className="text-3xl font-[family-name:var(--font-headline)] whitespace-pre-line">{fotoKaartTekst}</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-8">
              <KopAccent kop={kop} />
            </h2>
            <div className="space-y-6 text-lg text-win-charcoal/80">
              {alineas?.map((a, i) => (
                <p key={i}>
                  <Tekst>{a.tekst}</Tekst>
                </p>
              ))}
              {quote && <p className="font-semibold text-win-navy italic">&quot;{quote}&quot;</p>}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'cirkelfoto') {
    return (
      <section className="py-24 bg-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="bg-win-gold/10 absolute -inset-4 rounded-full blur-3xl"></div>
              <div className="relative z-10 aspect-square rounded-full border-[12px] border-white overflow-hidden shadow-2xl">
                <Image alt={fotoAlt} className="w-full h-full object-cover" src={fotoUrl} fill />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              {eyebrow && (
                <h3 className="text-win-gold font-bold tracking-widest uppercase text-xs mb-4">{eyebrow}</h3>
              )}
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-6">
                <KopAccent kop={kop} />
              </h2>
              {alineas?.[0] && (
                <p className="text-win-charcoal/80 text-lg mb-8 leading-relaxed">
                  <Tekst goud="font-bold" sterk="font-bold">{alineas[0].tekst}</Tekst>
                </p>
              )}
              {alineas?.slice(1).map((a, i) => (
                <p key={i} className="text-win-charcoal/70 mb-8">
                  <Tekst>{a.tekst}</Tekst>
                </p>
              ))}
              {tegels && tegels.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {tegels.map((t, i) => (
                    <div key={i} className="p-4 bg-white/40 rounded border border-win-navy/5">
                      <span className="block text-win-gold font-bold text-xl mb-1">{t.titel}</span>
                      <span className="text-xs uppercase tracking-tighter text-win-navy/60 italic">{t.tekst}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'wortels') {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="w-full md:w-2/5">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 relative">
                <Image alt={fotoAlt} className="w-full h-full object-cover" src={fotoUrl} fill />
              </div>
            </div>
            <div className="w-full md:w-3/5">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-8">
                <KopAccent kop={kop} accentClass="italic" />
              </h2>
              <div className="space-y-6 text-win-charcoal/80 leading-relaxed">
                {alineas?.map((a, i) => (
                  <p key={i}>
                    <Tekst>{a.tekst}</Tekst>
                  </p>
                ))}
                {blockquote && (
                  <blockquote className="border-l-4 border-win-gold pl-6 py-2 italic text-xl text-win-navy font-[family-name:var(--font-headline)]">
                    &quot;{blockquote}&quot;
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'miniKaarten') {
    return (
      <section className="py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-navy leading-tight">
                <KopAccent kop={kop} />
              </h2>
              <div className="space-y-8 text-lg leading-relaxed text-win-charcoal/70">
                {alineas?.map((a, i) => (
                  <p key={i}>
                    <Tekst>{a.tekst}</Tekst>
                  </p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {tegels?.map((t, i) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? 'bg-white p-8 space-y-4 border-l-4 border-win-gold'
                      : 'bg-white p-8 space-y-4 mt-8 border-l-4 border-win-navy'
                  }
                >
                  {i === 0 ? (
                    <svg className="w-8 h-8 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-win-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                    </svg>
                  )}
                  <h4 className="font-bold text-win-navy">{t.titel}</h4>
                  <p className="text-sm opacity-70 italic">{t.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'featureKaarten') {
    return (
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 aspect-[3/4] overflow-hidden bg-win-cream relative">
              <Image className="w-full h-full object-cover" src={fotoUrl} alt={fotoAlt} fill />
              <div className="absolute inset-0 bg-win-gold/5"></div>
            </div>
            <div className="md:col-span-7 space-y-12">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-navy">
                <KopAccent kop={kop} />
              </h2>
              {alineas?.[0] && (
                <p className="text-xl text-win-charcoal/70 leading-relaxed">
                  <Tekst cursief="italic text-win-navy font-medium">{alineas[0].tekst}</Tekst>
                </p>
              )}
              {tegels && tegels.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tegels.map((t, i) => (
                    <FeatureCard key={i} title={t.titel ?? ''} description={t.tekst ?? ''} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'tweeKolomsTekst') {
    return (
      <section className="py-24 md:py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              {eyebrow && (
                <h2 className="text-sm uppercase tracking-[0.3em] text-win-gold font-bold mb-6">{eyebrow}</h2>
              )}
              {quote && (
                <p className="text-3xl md:text-4xl font-light text-win-charcoal leading-snug font-[family-name:var(--font-headline)]">
                  {quote}
                </p>
              )}
            </div>
            <div className="space-y-6">
              {alineas?.map((a, i) => (
                <p key={i} className="text-lg text-stone-600 leading-relaxed">
                  <Tekst sterk="text-win-navy font-semibold italic">{a.tekst}</Tekst>
                </p>
              ))}
              <div className="h-1 w-20 bg-win-gold"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'fullBleedFoto') {
    return (
      <section className="relative overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-win-charcoal mb-8 leading-tight font-[family-name:var(--font-headline)]">
              {kop?.voor}
              {kop?.voor && <br />}
              {kop?.accent && <span className="text-win-gold italic font-light">{kop.accent}</span>}
              {kop?.na && <> {kop.na}</>}
            </h2>
            <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
              {alineas?.map((a, i) => (
                <p key={i}>
                  <Tekst>{a.tekst}</Tekst>
                </p>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 relative min-h-[400px]">
            <Image className="absolute inset-0 w-full h-full object-cover" src={fotoUrl} alt={fotoAlt} fill />
          </div>
        </div>
      </section>
    )
  }

  if (stijl === 'gecentreerd') {
    return (
      <section className="py-24 bg-win-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] text-win-navy mb-10 leading-relaxed">
            <KopAccent kop={kop} accentClass="italic" />
          </h2>
          <div className="w-24 h-1 bg-win-gold/30 mx-auto mb-10"></div>
          {alineas?.map((a, i) => (
            <p key={i} className="text-xl text-win-charcoal/70 leading-loose">
              <Tekst>{a.tekst}</Tekst>
            </p>
          ))}
        </div>
      </section>
    )
  }

  // default: quoteTekstFoto (methodiek/coaching-intro)
  return (
    <section className="py-24 bg-white/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {quote && (
              <p className="text-2xl leading-relaxed font-light italic text-win-charcoal">&quot;{quote}&quot;</p>
            )}
            <div className="h-px w-24 bg-win-gold"></div>
            {alineas?.map((a, i) => (
              <p key={i} className="text-lg leading-relaxed text-zinc-700">
                <Tekst>{a.tekst}</Tekst>
              </p>
            ))}
            {bullets && bullets.length > 0 && (
              <ul className="space-y-4">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckIcon />
                    <span className="text-zinc-800">
                      {b.label && <strong>{b.label} </strong>}
                      {b.tekst}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
            <Image
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition duration-700"
              src={fotoUrl}
              alt={fotoAlt}
              fill
            />
          </div>
        </div>
      </div>
    </section>
  )
}
