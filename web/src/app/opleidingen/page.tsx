import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Opleidingen",
  description:
    "Professionaliseren in integratief & psychofysiek werken voor Weerbaarheid, Groei & Leiderschap. WIN Opleidingen.",
};

export default function OpleidingenPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <span className="inline-block text-win-gold font-[family-name:var(--font-headline)] tracking-widest uppercase text-xs mb-4">
              Integratief &amp; Psychofysiek
            </span>
            <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-headline)] font-black text-win-olive leading-tight mb-8">
              WIN &bull; <br />
              <span className="text-win-gold italic">Opleidingen</span>
            </h1>
            <p className="text-xl md:text-2xl text-win-charcoal/80 leading-relaxed max-w-xl font-light">
              Professionaliseren in{" "}
              <span className="font-semibold text-win-olive">
                integratief &amp; psychofysiek werken
              </span>{" "}
              voor Weerbaarheid &bull; Groei &amp; Leiderschap.
            </p>
            <div className="mt-10 flex gap-6">
              <div className="w-12 h-[1px] bg-win-gold self-center"></div>
              <span className="text-sm uppercase tracking-widest text-win-olive/60">
                35+ jaar expertise in transformatie
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-tl-[100px] overflow-hidden shadow-2xl">
              <Image
                alt="Educatie bij WIN"
                className="w-full h-full object-cover"
                src="/images/locatie/nimmerdor 4.jpeg"
                fill
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-win-olive p-8 text-win-cream hidden md:block max-w-xs shadow-xl">
              <p className="text-sm italic leading-relaxed font-[family-name:var(--font-headline)]">
                &quot;Echte verandering ontstaat wanneer we het lichaam betrekken
                bij de intellectuele groei.&quot;
              </p>
              <p className="mt-4 text-xs uppercase tracking-tighter">
                -- Reza, De Weerbaarheidsmentor&reg;
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-win-olive/5 border-l-4 border-win-gold p-12 relative">
            <span className="text-win-gold absolute top-4 right-4 opacity-30 text-6xl">&ldquo;</span>
            <p className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] text-win-olive leading-snug">
              &quot;Veel professionals beschikken over kennis, vaardigheden en
              ervaring, maar missen het vermogen om{" "}
              <span className="text-win-gold font-bold">
                daadwerkelijk te begeleiden
              </span>{" "}
              wat er onder de oppervlakte speelt.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Voor wie Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-4">
              Voor wie is dit bedoeld?
            </h2>
            <div className="h-1 w-20 bg-win-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {["Coaches", "Begeleiders", "Trainers", "Leidinggevenden", "HR Professionals", "Mensgericht"].map((role) => (
              <div key={role} className="flex flex-col items-center text-center p-6 hover:bg-win-cream transition-colors duration-300 group">
                <div className="w-16 h-16 rounded-full bg-win-olive/5 flex items-center justify-center mb-6 group-hover:bg-win-gold transition-colors">
                  <svg className="w-6 h-6 text-win-olive group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <span className="text-sm uppercase font-bold tracking-wider">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Areas (Bento Grid) */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-win-olive text-win-cream p-12 lg:p-20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-headline)] mb-6">
                Weerbaarheidstherapie &amp; -coaching
              </h3>
              <p className="text-win-cream/70 text-lg mb-10 leading-relaxed max-w-md">
                De kernmethodiek van WIN. Leer professionals begeleiden in het
                herstellen van de balans tussen lijf en brein door middel van
                integratieve interventies.
              </p>
              <Link className="inline-flex items-center text-win-gold uppercase text-sm tracking-widest font-bold" href="/wininstituut">
                Ontdek Methodiek{" "}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white border border-win-olive/10 p-12 flex flex-col justify-between">
            <div>
              <div className="text-win-gold mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-2xl font-[family-name:var(--font-headline)] text-win-olive mb-4">NLP (wNLP)</h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                De WIN-benadering van Neuro Linguistisch Programmeren.
                Communicatie, bewustwording en gedragsverandering met een focus
                op belichaamde aanwezigheid.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white border border-win-olive/10 p-12 flex flex-col justify-between">
            <div>
              <div className="text-win-gold mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>
              <h3 className="text-2xl font-[family-name:var(--font-headline)] text-win-olive mb-4">
                Systemisch werk en opstellingen
              </h3>
              <p className="text-win-charcoal/70 leading-relaxed">
                Werken met de diepere dynamieken binnen systemen. Begrijp hoe
                onzichtbare krachten professioneel en persoonlijk functioneren
                beinvloeden.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 bg-win-gold p-12 lg:p-20 text-win-cream relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-headline)] mb-6">
                Integratief en psychofysiek werken
              </h3>
              <p className="text-white/90 text-lg mb-10 leading-relaxed">
                Lichaam, ervaring en bewustzijn samengebracht. Leer werken met
                fysieke signalen als ingang voor mentale transformatie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section className="bg-win-olive py-24 text-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-[family-name:var(--font-headline)] mb-8">
              Onze Leeraanpak: <br />
              <span className="italic text-win-gold">Ervaren boven weten</span>
            </h2>
            <div className="space-y-8">
              {[
                { num: "01.", title: "Experiential learning", desc: "Geen droge theorie, maar diepgaande persoonlijke ervaring als basis voor professionele groei." },
                { num: "02.", title: "Zelfregulatie", desc: "Beheers de kunst van het 'midden' vinden, zodat je als baken van rust kunt fungeren voor anderen." },
                { num: "03.", title: "Werken met spanning", desc: "Leer frictie en weerstand niet te vermijden, maar in te zetten als bron voor transformatie." },
              ].map((item) => (
                <div key={item.num} className="flex gap-6">
                  <span className="text-win-gold font-[family-name:var(--font-headline)] text-3xl font-bold">{item.num}</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-win-cream/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full border border-win-gold/30 p-8 flex items-center justify-center">
              <div className="aspect-square w-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                <Image
                  alt="Natuur als spiegel"
                  className="w-full h-full object-cover"
                  src="/images/locatie/nimmerdor 5.jpeg"
                  fill
                />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-win-gold/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white p-12 md:p-20 shadow-sm border border-win-gold/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { title: "Verdiept inzicht", desc: "Begrijp de patronen die menselijk gedrag en weerbaarheid sturen." },
                { title: "Begeleidingsvermogen", desc: "Interventies die werkelijk raken en blijvende verandering realiseren." },
                { title: "Zelfregulatie", desc: "Belichaamde aanwezigheid en balans, ook onder intense druk." },
                { title: "Congruent Handelen", desc: "Een professionele houding waar woord en daad volledig in lijn zijn." },
              ].map((item) => (
                <div key={item.title} className="space-y-4">
                  <div className="flex items-center gap-3 text-win-gold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <h5 className="uppercase text-xs tracking-widest font-black">{item.title}</h5>
                  </div>
                  <p className="text-sm text-win-charcoal/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-8">
        <div className="max-w-5xl mx-auto bg-win-cream border-2 border-win-gold/30 p-16 text-center relative">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-olive mb-8">
            Klaar voor de volgende stap?
          </h2>
          <p className="text-xl text-win-charcoal/70 mb-12 max-w-2xl mx-auto">
            Ontwikkel jezelf als de professional die jij wilt zijn. Onze
            opleidingen starten op diverse momenten in het jaar op landgoed
            Nimmerdor.
          </p>
          <Link
            className="inline-block bg-win-gold text-white px-10 py-5 uppercase tracking-widest font-bold hover:bg-win-olive transition-colors duration-300 shadow-xl"
            href="/opleidingen"
          >
            Bekijk de opleidingen
          </Link>
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-win-gold/40"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-win-gold/40"></div>
        </div>
      </section>
    </>
  );
}
