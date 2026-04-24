import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organisaties",
  description:
    "Weerbaarheid als fundament voor leiderschap, samenwerking en duurzame prestaties onder druk. WIN voor HR & C-Suite.",
};

export default function OrganisatiesPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-[700px] flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Professioneel leiderschap"
            className="w-full h-full object-cover"
            src="/images/locatie/nimmerdor 6.jpeg"
            fill
          />
          <div className="absolute inset-0 bg-win-olive/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-win-cream via-win-cream/20 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-win-gold/10 backdrop-blur-md border border-win-gold/20 text-win-gold font-bold text-xs tracking-widest uppercase mb-6">
            Voor HR &amp; C-Suite
          </span>
          <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-headline)] font-black tracking-tighter text-win-olive mb-8">
            Organisaties
          </h1>
          <p className="text-xl md:text-3xl text-win-olive leading-snug font-light max-w-3xl mx-auto">
            Weerbaarheid als fundament voor leiderschap, samenwerking en
            duurzame prestaties onder druk.
          </p>
        </div>
      </header>

      {/* Intro Typography Section */}
      <section className="py-24 px-6 bg-win-cream">
        <div className="max-w-5xl mx-auto border-l-4 border-win-gold pl-8 md:pl-16">
          <p className="text-2xl md:text-4xl font-[family-name:var(--font-headline)] text-win-charcoal leading-relaxed font-light">
            Organisaties functioneren via mensen. Wanneer mensen functioneren
            vanuit{" "}
            <span className="text-win-gold font-bold">
              spanning, aanpassing of onduidelijkheid
            </span>
            , vertaalt zich dat direct naar samenwerking, leiderschap en
            resultaten.
          </p>
        </div>
      </section>

      {/* Problem/Solution Contrast Section */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-stone-200 border border-stone-200">
            {/* Problem Side */}
            <div className="bg-white p-12 lg:p-20">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="text-xl font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider text-stone-500">
                  Wanneer weerbaarheid ontbreekt
                </h3>
              </div>
              <ul className="space-y-8">
                {[
                  { title: "Miscommunicatie", desc: "Indirect gedrag, aannames en ruis die de effectiviteit ondermijnen." },
                  { title: "Vermijding", desc: "Het niet aangaan van de noodzakelijke spanning of lastige gesprekken." },
                  { title: "Overbelasting", desc: "Een 'always-on' cultuur zonder herstelvermogen of duidelijke grenzen." },
                  { title: "Verlies van richting", desc: "Focus op de waan van de dag in plaats van strategische koers." },
                ].map((item) => (
                  <li key={item.title} className="group flex items-start gap-4">
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-stone-300 group-hover:bg-red-400 transition-colors"></div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-stone-600 font-light">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Solution Side */}
            <div className="bg-stone-50 p-12 lg:p-20 relative">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full border border-win-gold flex items-center justify-center text-win-gold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider text-win-gold">
                  Versterkte weerbaarheid
                </h3>
              </div>
              <ul className="space-y-8">
                {[
                  { title: "Innerlijke Rust", desc: "Handelen vanuit overzicht en kalmte, zelfs in crisissituaties." },
                  { title: "Positionering", desc: "Inname van de juiste rol en verantwoordelijkheid binnen de hierarchie." },
                  { title: "Effectieve Samenwerking", desc: "Constructief omgaan met verschillen en gezamenlijk eigenaarschap." },
                  { title: "Duurzaam Functioneren", desc: "Balans tussen prestatie en herstel voor langdurige inzetbaarheid." },
                ].map((item) => (
                  <li key={item.title} className="group flex items-start gap-4">
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-win-gold"></div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-win-olive font-light">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-32 px-6 bg-win-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-olive mb-4">
              De Drie Pijlers van Weerbaarheid
            </h2>
            <p className="text-win-olive/80 font-light text-lg">
              De integrale aanpak voor een vitale organisatiecultuur.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Leiderschap",
                items: ["Spanning dragen", "Richting houden", "Helder communiceren", "Veiligheid creeren"],
              },
              {
                title: "Teams en samenwerking",
                items: ["Verschillen hanteren", "Spanning reguleren", "Elkaar durven aanspreken", "Gezamenlijke verantwoordelijkheid"],
              },
              {
                title: "Cultuur en veiligheid",
                items: ["Gedrag bepaalt cultuur", "Duidelijkheid biedt houvast", "Verantwoordelijkheid nemen", "Echte verbinding"],
              },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white p-10 shadow-xl border-t-4 border-win-gold group hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-[family-name:var(--font-headline)] font-bold text-win-olive mb-6">{pillar.title}</h3>
                <ul className="space-y-4 text-stone-600 font-light">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-win-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incompany Trajecten Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                alt="Team workshop"
                className="w-full h-full object-cover"
                src="/images/locatie/nimmerdor 7.jpeg"
                fill
              />
              <div className="absolute bottom-0 right-0 bg-win-gold p-8 text-white max-w-xs">
                <p className="font-[family-name:var(--font-headline)] font-bold text-lg leading-tight uppercase tracking-widest">
                  Maatwerk dat beklijft
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-olive mb-8 uppercase tracking-tighter">
              Incompany Trajecten
            </h2>
            <p className="text-xl text-stone-600 font-light mb-10 leading-relaxed">
              Wij geloven niet in &apos;one size fits all&apos;. Onze incompany
              trajecten zijn een synthese van wetenschappelijke inzichten,
              jarenlange praktijkervaring en direct toepasbare methodieken.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-win-gold font-bold text-3xl mb-1">Deep Insight</p>
                <p className="text-stone-500 text-sm font-light uppercase tracking-wider">Analyse van de onderstroom</p>
              </div>
              <div>
                <p className="text-win-gold font-bold text-3xl mb-1">Actionable</p>
                <p className="text-stone-500 text-sm font-light uppercase tracking-wider">Directe toepassing op de werkvloer</p>
              </div>
            </div>
            <Link href="/wininstituut" className="flex items-center gap-4 text-win-gold font-bold group">
              ONTDEK DE WIN METHODIEK{" "}
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Rouw en Verlies in Organisaties Section */}
      <section className="py-32 px-6 bg-win-olive text-win-cream overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center mb-12">
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-win-gold"></div>
          </div>
          <div className="text-center">
            <span className="text-win-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
              Specialistische Expertise
            </span>
            <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-headline)] font-black mb-10 leading-tight">
              Rouw en Verlies in Organisaties
            </h2>
            <p className="text-xl md:text-2xl font-light text-win-cream/80 mb-12 leading-relaxed">
              Verlies binnen een organisatie -- of het nu gaat om het overlijden
              van een collega, ingrijpende reorganisaties of persoonlijk verlies
              van medewerkers -- vraagt om een bijzondere vorm van weerbaarheid.
              Wij bieden een sensitieve doch professionele begeleiding voor
              leiders en teams in deze kritieke fasen.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left mb-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                <h4 className="text-win-gold font-bold mb-4 uppercase tracking-wider">Voor Leidinggevenden</h4>
                <p className="text-sm font-light text-stone-300">
                  Hoe faciliteer je een veilige bedding voor rouw terwijl de
                  continuiteit van de organisatie gewaarborgd blijft?
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                <h4 className="text-win-gold font-bold mb-4 uppercase tracking-wider">Team Dynamiek</h4>
                <p className="text-sm font-light text-stone-300">
                  Het herstellen van de onderlinge verbinding en het verwerken
                  van gezamenlijk verlies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-12 md:p-20 flex-1">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black text-win-olive mb-8">
              Versterk Weerbaarheid in leiderschap, teams en organisatie.
            </h2>
            <p className="text-stone-600 mb-10 text-lg">
              Neem contact op voor een strategisch gesprek over de uitdagingen
              binnen uw organisatie en hoe de WIN-methodiek een duurzaam verschil
              kan maken.
            </p>
            <Link
              href="/organisaties"
              className="bg-win-gold hover:bg-win-olive text-white px-10 py-5 rounded-lg font-bold text-lg shadow-lg transition-all inline-block"
            >
              Plan een kennismaking
            </Link>
          </div>
          <div className="w-full md:w-1/3 bg-win-gold/10 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-win-gold mx-auto mb-6 flex items-center justify-center text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.026a43.4 43.4 0 00-1.481-.055C3.51 7.546 2.25 8.806 2.25 10.368v.442c0 .812.33 1.594.915 2.158l3.04 2.93c.384.369.59.87.59 1.393v3.634a.75.75 0 001.5 0v-3.634c0-.87-.344-1.706-.957-2.32l-3.04-2.929A1.316 1.316 0 013.75 10.81v-.442c0-.627.508-1.118 1.17-1.072.46.032.92.072 1.38.119v.76a.75.75 0 001.5 0v-.62a44.82 44.82 0 011.25.12v.5a.75.75 0 001.5 0v-.313a42.2 42.2 0 015 .145v.168a.75.75 0 001.5 0v-.032a43.82 43.82 0 011.25-.048v.312a.75.75 0 001.5 0v-.46a44.59 44.59 0 011.38-.168c.662-.046 1.17.445 1.17 1.072v.442c0 .37-.156.725-.434.984l-3.04 2.929a3.317 3.317 0 00-.957 2.32v3.634a.75.75 0 001.5 0v-3.634c0-.524.207-1.024.59-1.393l3.04-2.93a3.316 3.316 0 00.915-2.158v-.442c0-1.562-1.26-2.822-2.869-2.822a43.4 43.4 0 00-1.481.055V4.575a1.575 1.575 0 00-3.15 0v3.159a44.94 44.94 0 00-1.25.05V4.575a1.575 1.575 0 00-3.15 0v3.34a44.746 44.746 0 00-1.25-.113V4.575z" />
                </svg>
              </div>
              <p className="font-[family-name:var(--font-headline)] font-bold text-win-olive">Direct Contact?</p>
              <p className="text-stone-600 font-light">Neem contact op</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
