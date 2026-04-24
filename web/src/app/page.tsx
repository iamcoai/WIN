import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welkom bij WIN",
  description:
    "De buitenwereld ziet succes, maar binnenin voel je de frictie. Wij helpen professionals de balans te herstellen tussen externe prestatie en interne rust.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/locatie/nimmerdor 1.jpeg"
            alt="Landgoed Nimmerdor in herfstlicht"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-win-charcoal/20 to-win-charcoal/60"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="inline-block px-4 py-1 mb-6 rounded-full border border-win-gold/40 bg-win-gold/10 backdrop-blur-sm text-win-gold font-semibold tracking-wider text-sm uppercase">
            Weerbaarheids Instituut Nederland
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 font-[family-name:var(--font-headline)]">
            Welkom bij <span className="text-win-gold">WIN</span>
          </h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed mb-10 text-stone-200">
            De buitenwereld ziet succes, maar binnenin voel je de frictie. Wij
            helpen professionals de balans te herstellen tussen externe prestatie
            en interne rust.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              className="w-full sm:w-auto bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-win-gold transition-all shadow-xl"
              href="#intro"
            >
              Ontdek de Methodiek
            </Link>
            <Link
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              href="/weerbaarheidsmentor"
            >
              Over de Mentor
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7M19 6l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* 2. Introduction Block */}
      <section className="py-24 bg-win-cream relative overflow-hidden" id="intro">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-win-olive leading-tight font-[family-name:var(--font-headline)]">
                Bij WIN herstellen we de verbinding tussen je{" "}
                <span className="text-win-gold underline decoration-win-gold/30 underline-offset-8">
                  binnenwereld
                </span>{" "}
                en je buitenwereld.
              </h2>
              <div className="w-20 h-1.5 bg-win-gold"></div>
              <p className="text-xl text-win-charcoal/80 leading-relaxed font-medium">
                &quot;Lijf &amp; Brein in lijn&quot; -- dat is de kern. In een
                wereld die altijd &apos;aan&apos; staat, raken we vaak de
                verbinding met ons eigen lichaam en onze werkelijke drijfveren
                kwijt. We functioneren op de automatische piloot, terwijl de
                interne frictie toeneemt.
              </p>
              <p className="text-lg text-win-charcoal/70 leading-relaxed">
                Onze methodiek is integratief en psychofysiek. We praten niet
                alleen over verandering; we laten je lichaam en geest in
                samenhang functioneren, zodat denken, voelen en handelen weer
                een lijn vormen.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-win-olive/5 rounded-2xl transition-all group-hover:bg-win-olive/10"></div>
              <Image
                className="relative rounded-xl shadow-2xl w-full aspect-[4/5] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                src="/images/portretten/20251206_Reza_1.jpg"
                alt="Reza - De Weerbaarheidsmentor"
                width={600}
                height={750}
              />
              <div className="absolute -bottom-8 -left-8 bg-win-gold p-8 rounded-xl shadow-2xl max-w-xs hidden md:block">
                <p className="text-white font-bold italic leading-snug">
                  &quot;Weerbaarheid is niet het afstoten van druk, maar het
                  absorberen ervan vanuit een kalme kern.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. De 4 domeinen Card Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-win-olive mb-6 font-[family-name:var(--font-headline)]">
              De 4 Domeinen van Weerbaarheid
            </h2>
            <p className="text-xl text-win-charcoal/60 max-w-2xl mx-auto">
              Wij benaderen persoonlijke groei vanuit een holistisch
              perspectief. Elk domein is essentieel voor een onwankelbaar
              fundament.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card: Fysiek */}
            <div className="group bg-win-cream/50 p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 bg-win-gold/10 rounded-lg flex items-center justify-center mb-6 text-win-gold group-hover:bg-win-gold group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-win-olive font-[family-name:var(--font-headline)]">Fysiek</h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                De basis van alles. We richten ons op lichaamsbewustzijn,
                energiebeheer en de fysieke respons op stress. Een weerbaar
                lichaam ondersteunt een krachtige geest.
              </p>
            </div>
            {/* Card: Mentaal */}
            <div className="group bg-win-cream/50 p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 bg-win-gold/10 rounded-lg flex items-center justify-center mb-6 text-win-gold group-hover:bg-win-gold group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-win-olive font-[family-name:var(--font-headline)]">Mentaal</h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                Helderheid in denken en focus. We versterken je cognitieve
                weerbaarheid, mindset en het vermogen om onder druk effectieve
                keuzes te blijven maken.
              </p>
            </div>
            {/* Card: Sociaal */}
            <div className="group bg-win-cream/50 p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 bg-win-gold/10 rounded-lg flex items-center justify-center mb-6 text-win-gold group-hover:bg-win-gold group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-win-olive font-[family-name:var(--font-headline)]">Sociaal</h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                Verbinding en grenzen. We kijken naar hoe je interacteert met je
                omgeving, leiderschap toont en gezonde professionele relaties
                onderhoudt zonder jezelf te verliezen.
              </p>
            </div>
            {/* Card: Emotioneel */}
            <div className="group bg-win-cream/50 p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 bg-win-gold/10 rounded-lg flex items-center justify-center mb-6 text-win-gold group-hover:bg-win-gold group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-win-olive font-[family-name:var(--font-headline)]">Emotioneel</h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                Emotionele intelligentie en regulatie. Het begrijpen van je eigen
                interne kompas en het constructief omgaan met intense emoties in
                veeleisende situaties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Progression Statement */}
      <section className="py-16 bg-win-olive text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block w-12 h-1 bg-win-gold mb-8"></div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10 italic font-[family-name:var(--font-headline)]">
            &quot;Wanneer deze vier domeinen in samenhang functioneren, ontstaat
            Weerbaarheid als stevig fundament voor duurzame groei en krachtig
            leiderschap.&quot;
          </h2>
          <div className="flex items-center justify-center gap-4 text-win-gold">
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Zin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-win-gold/30"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Betekenis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-win-gold/30"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Vrijheid</span>
          </div>
        </div>
      </section>

      {/* 5. Herken je dit? Recognition Section */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-10">
              <div>
                <h2 className="text-4xl font-black text-win-olive mb-4 font-[family-name:var(--font-headline)]">
                  Herken je dit?
                </h2>
                <p className="text-win-charcoal/60">
                  Voor veel van onze clienten zijn deze situaties de dagelijkse
                  realiteit voordat ze bij ons komen:
                </p>
              </div>
              <div className="space-y-6">
                {[
                  "Je blijft optimaal functioneren, maar het kost je steeds meer energie om je masker op te houden.",
                  "Je ervaart een constante innerlijke onrust of frictie, zelfs wanneer je 'vrij' bent.",
                  "De balans tussen je ambitieuze buitenwereld en je persoonlijke binnenwereld is volledig zoek.",
                  "Je voelt dat je potentieel hebt voor meer, maar je wordt geblokkeerd door onbewuste patronen.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4">
                    <svg className="w-6 h-6 text-win-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <p className="text-win-charcoal font-medium">{text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <p className="text-lg text-win-charcoal/80 mb-8 font-semibold italic">
                  Dit hoeft niet je standaard te zijn. Er is een weg terug naar
                  kalme kracht.
                </p>
                <Link
                  href="/coaching"
                  className="w-full sm:w-auto bg-win-gold text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-win-olive transition-all shadow-xl inline-flex items-center justify-center gap-3"
                >
                  Plan een GRATIS kennismaking
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                className="absolute inset-0 w-full h-full object-cover"
                src="/images/portretten/20251206_Reza_10.jpg"
                alt="Reza in gesprek met een client"
                fill
              />
              <div className="absolute inset-0 bg-win-olive/20"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
