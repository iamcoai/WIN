import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coaching",
  description:
    "Weerbaarheid als fundament voor Groei en Leiderschap. Lijf & Brein in lijn -- integratief & psychofysiek.",
};

export default function CoachingPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            className="w-full h-full object-cover opacity-20"
            src="/images/locatie/nimmerdor 2.jpeg"
            alt="Landgoed Nimmerdor"
            fill
          />
        </div>
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 rounded-full border border-win-gold text-win-gold font-semibold text-sm tracking-widest uppercase mb-6">
              WIN &bull; Coaching
            </span>
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-win-charcoal leading-tight mb-6">
              Weerbaarheid als{" "}
              <span className="italic font-light text-win-gold">fundament</span>{" "}
              voor Groei en Leiderschap
            </h1>
            <p className="text-xl md:text-2xl font-light text-win-olive leading-relaxed mb-8 border-l-2 border-win-gold pl-6">
              Lijf &amp; Brein in lijn &bull; integratief &amp; psychofysiek
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-2xl leading-relaxed font-light italic text-win-charcoal">
                &quot;Je kunt blijven functioneren op pure wilskracht, maar tegen
                welke prijs?&quot;
              </p>
              <div className="h-px w-24 bg-win-gold"></div>
              <p className="text-lg leading-relaxed text-zinc-700">
                Veel professionals ervaren dat hun brein altijd &apos;aan&apos;
                staat, terwijl hun lijf signalen van stress afgeeft die worden
                genegeerd. Uiteindelijk ontstaat er frictie. Bij WIN geloven we
                dat werkelijke impact pas ontstaat wanneer jouw interne systeem
                niet langer tegenwerkt, maar samenwerkt. Het in lijn brengen van
                Lijf &amp; Brein is geen luxe, maar een noodzakelijk fundament
                voor duurzaam leiderschap.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <Image
                className="w-full h-full object-cover"
                src="/images/portretten/20251206_Reza_12.jpg"
                alt="Reza in een rustige, natuurlijk verlichte werkruimte"
                fill
              />
            </div>
          </div>
        </div>
      </section>

      {/* Functioneren vanuit Weerbaarheid (The 4 Domains) */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-8 text-center mb-16">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-4">
            Functioneren vanuit Weerbaarheid
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Weerbaarheid is de integrale verbinding tussen vier essentiele
            domeinen.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-8">
          {[
            { title: "Fysiek", desc: "Belichaamde kracht, energiehuishouding en het fysiek kunnen dragen van verantwoordelijkheid." },
            { title: "Mentaal", desc: "Focus, cognitieve flexibiliteit en het vermogen om heldere keuzes te maken onder druk." },
            { title: "Sociaal", desc: "Verbinding met de omgeving, grenzen stellen en effectieve interactie met anderen." },
            { title: "Emotioneel", desc: "Zelfregulatie, het begrijpen van interne signalen en emotionele stabiliteit." },
          ].map((domain) => (
            <div key={domain.title} className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-win-gold">
              <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-headline)]">{domain.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{domain.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lijf & Brein in lijn */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 order-2 md:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-win-cream rounded-full -z-10"></div>
                <Image
                  className="rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition duration-700"
                  src="/images/portretten/20251206_Reza_13.jpg"
                  alt="Coaching sessie bij WIN"
                  width={600}
                  height={450}
                />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-8">
                Lijf &amp; Brein in lijn
              </h2>
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                Onze methodiek gaat verder dan traditionele praat-coaching. We
                werken integratief: het hoofd (ratio), het hart (gevoel) en het
                lichaam (actie) moeten in samenhang functioneren.
              </p>
              <ul className="space-y-4">
                {[
                  "Herkennen van fysieke stress-signalen voor ze blokkeren.",
                  "Psychofysieke training om mentale barrieres te doorbreken.",
                  "Integratie van NLP en systemisch werk in de dagelijkse praktijk.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-win-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span className="text-zinc-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* De WIN Ontwikkellijn */}
      <section className="py-24 bg-win-bronze text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-4">
              De WIN Ontwikkellijn
            </h2>
            <div className="h-1 w-20 bg-win-gold mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { num: "01", title: "Fundamenteren", desc: "Het herstellen van de basis. Rust, overzicht en het stoppen van de energetische lekkage." },
              { num: "02", title: "Stabiliseren", desc: "Het inbouwen van structuren en routines die jouw weerbaarheid dagelijks ondersteunen." },
              { num: "03", title: "Versterken", desc: "Groeien vanuit kracht. Het vergroten van je draaglast en het verfijnen van je impact." },
              { num: "04", title: "Leiderschap", desc: "Natuurlijk overwicht vanuit een geintegreerd systeem. Rust in de storm." },
            ].map((phase) => (
              <div
                key={phase.num}
                className="group relative bg-white/5 p-10 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
              >
                <div className="text-6xl font-black text-white/10 absolute top-4 right-6 group-hover:text-win-gold/20 transition-colors">
                  {phase.num}
                </div>
                <h3 className="text-xl font-bold mb-4 text-win-gold">{phase.title}</h3>
                <p className="text-sm text-zinc-400">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voor wie */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto bg-white p-12 md:p-20 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-[family-name:var(--font-headline)] font-bold mb-10 text-center">
              Voor wie is dit traject?
            </h2>
            <div className="space-y-6">
              {[
                "Professionals die op hoog niveau presteren maar intern frictie en uitputting ervaren.",
                "Leiders die voelen dat ze op de automatische piloot draaien en de verbinding met hun essentie zoeken.",
                "Degenen die niet langer willen 'compenseren' met discipline, maar willen functioneren vanuit flow.",
                "Ondernemers die hun weerbaarheid als strategisch kapitaal zien voor hun organisatie.",
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-win-gold/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                  <p className="text-zinc-800 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Onze Trajecten */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-16 text-center">
            Onze Trajecten
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group border border-zinc-200 rounded-3xl p-10 hover:border-win-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <span className="text-xs tracking-widest text-win-gold font-bold uppercase block mb-4">Individueel</span>
              <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-headline)]">Solo trajecten</h3>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                Maatwerk begeleiding volledig afgestemd op jouw specifieke
                context en doelen. Intensief en transformatief.
              </p>
              <div className="text-win-charcoal font-bold mb-8 italic">Vanaf &euro; 2.000,-</div>
              <Link className="inline-flex items-center gap-2 text-win-gold font-bold group-hover:gap-4 transition-all" href="/coaching">
                Lees meer{" "}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="group border border-zinc-200 rounded-3xl p-10 hover:border-win-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <span className="text-xs tracking-widest text-win-gold font-bold uppercase block mb-4">Samen Groeien</span>
              <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-headline)]">Groepstrajecten</h3>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                Leer van en met gelijkgestemden in een veilige, high-end
                omgeving. Focus op gedeelde dynamieken.
              </p>
              <div className="text-win-charcoal font-bold mb-8 italic">Op aanvraag</div>
              <Link className="inline-flex items-center gap-2 text-win-gold font-bold group-hover:gap-4 transition-all" href="/coaching">
                Lees meer{" "}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="group bg-win-olive text-white rounded-3xl p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <span className="text-xs tracking-widest text-win-gold font-bold uppercase block mb-4">Elite</span>
              <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-headline)]">Mentorschap</h3>
              <p className="text-zinc-300 mb-8 leading-relaxed">
                Exclusieve 1-op-1 begeleiding voor leiders. Strategisch,
                diepgaand en beschikbaar op afroep.
              </p>
              <div className="text-win-gold font-bold mb-8 italic">Vanaf &euro; 5.000,- / 3 mnd</div>
              <Link className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all" href="/mentorschap">
                Lees meer{" "}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Het Resultaat */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-8">Het Resultaat</h2>
              <p className="text-lg text-zinc-700 leading-relaxed mb-10">
                Investeren in weerbaarheid levert rendement op alle vlakken van
                je leven. Niet door harder te werken, maar door effectiever te
                zijn in je rust en je actie.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { num: "01", text: "Meer rust, minder ruis in het hoofd." },
                { num: "02", text: "Heldere focus en scherpe besluitvorming." },
                { num: "03", text: "Stevige en natuurlijke positionering." },
                { num: "04", text: "Optimale zelfregulatie onder hoogspanning." },
              ].map((result) => (
                <div key={result.num} className="flex items-center gap-6 border-b border-zinc-300 pb-6">
                  <span className="text-3xl italic text-win-gold font-[family-name:var(--font-headline)]">{result.num}</span>
                  <span className="text-xl font-bold">{result.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-win-olive -z-10"></div>
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-extrabold mb-8 max-w-4xl mx-auto leading-tight">
            Versterk je Weerbaarheid als fundament voor Groei en Leiderschap.
          </h2>
          <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
            Zet vandaag de eerste stap naar een geintegreerd systeem. Plan een
            vrijblijvende kennismaking.
          </p>
          <Link
            href="/coaching"
            className="bg-win-gold hover:bg-yellow-600 text-white px-12 py-5 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-block"
          >
            Plan een kennismaking
          </Link>
        </div>
      </section>
    </>
  );
}
