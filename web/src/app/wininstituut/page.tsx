import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Over WIN",
  description:
    "WIN is een opleidings-, coaching- en kennisinstituut voor Weerbaarheid, Groei & Leiderschap. Integratief & Psychofysiek.",
};

export default function WininstituutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            className="w-full h-full object-cover"
            src="/images/locatie/nimmerdor 8.jpeg"
            alt="Landgoed Nimmerdor in herfstlicht"
            fill
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-white text-5xl md:text-7xl font-[family-name:var(--font-headline)] font-bold mb-6">
            WIN &bull; Weerbaarheids Instituut Nederland
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto">
            Opleiding, coaching en kennisinstituut voor{" "}
            <span className="font-semibold italic">
              Weerbaarheid &bull; Groei &bull; Leiderschap
            </span>
          </p>
        </div>
      </section>

      {/* Intro Section (Origin Story) */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive leading-tight">
              Doorleefde ervaring, professionele praktijk en meegegeven waarden.
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-win-charcoal/80">
              <p>
                Het fundament van WIN ligt in het besef dat echte weerbaarheid
                niet enkel uit een boekje komt. Het is een optelsom van
                jarenlange ervaring in de frontlinie van menselijk gedrag,
                gecombineerd met wetenschappelijke inzichten en diepe persoonlijke
                transformatie.
              </p>
              <p>
                Reza&apos;s visie op het Weerbaarheids Instituut Nederland
                ontstond uit de overtuiging dat professionals en leiders die
                opereren onder hoge druk een plek nodig hebben waar &apos;Lijf
                &amp; Brein&apos; werkelijk in lijn worden gebracht.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-12 shadow-2xl border-l-8 border-win-gold relative z-10">
              <span className="text-6xl text-win-gold/20 absolute top-4 left-4">&ldquo;</span>
              <blockquote className="font-[family-name:var(--font-headline)] italic text-2xl text-win-olive leading-relaxed relative">
                &quot;Weerbaarheid is niet het vermogen om de storm te overleven,
                maar de kunst om de storm te gebruiken als brandstof voor je
                volgende stap.&quot;
              </blockquote>
              <cite className="block mt-6 font-semibold text-win-gold not-italic">
                -- Reza, De Weerbaarheidsmentor&reg;
              </cite>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-win-olive/10 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Integratief & Psychofysiek Section */}
      <section className="py-24 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-olive mb-6">
              Integratief &amp; Psychofysiek
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-win-charcoal/70">
              Niet symptoombestrijding, maar de onderliggende patronen aanpakken
              door de vier domeinen van mens-zijn te verenigen.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Fysiek", desc: "Het lichaam als kompas. Biofeedback, belichaamde stress en fysieke paraatheid." },
              { title: "Mentaal", desc: "Focus, mindset en de kracht van intentie. Het herprogrammeren van belemmerende overtuigingen." },
              { title: "Sociaal", desc: "Interactie, grenzen stellen en verbinding. Hoe beweeg jij je ten opzichte van de ander?" },
              { title: "Emotioneel", desc: "Zelfregulatie en emotionele intelligentie. De onderstroom herkennen en sturen." },
            ].map((domain) => (
              <div key={domain.title} className="group p-8 bg-win-cream rounded-xl border border-transparent hover:border-win-gold/30 transition-all duration-500">
                <div className="w-16 h-16 bg-win-olive/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-win-gold/20 transition-colors">
                  <svg className="w-7 h-7 text-win-olive group-hover:text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-headline)]">{domain.title}</h3>
                <p className="text-win-charcoal/70">{domain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lijf & Brein in lijn Section */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 order-2 md:order-1 relative aspect-[4/3]">
            <Image
              className="rounded-2xl shadow-2xl object-cover"
              src="/images/portretten/20251206_Reza_15.jpg"
              alt="Reza kijkt nadenkend uit het raam"
              fill
            />
          </div>
          <div className="md:w-1/2 order-1 md:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-olive">
              Lijf &amp; Brein in lijn
            </h2>
            <p className="text-lg leading-relaxed text-win-charcoal/80">
              Wanneer denken, voelen en handelen niet op een lijn zitten, ontstaat
              interne frictie. Dit vreet energie en belemmert je besluitvorming.
              WIN richt zich op het herstellen van deze interne coherentie.
            </p>
            <ul className="space-y-4">
              {[
                { label: "Onuitputtelijke Energie:", desc: "Stop het lekken van energie door interne conflicten." },
                { label: "Absolute Helderheid:", desc: "Zie de essentie in complexe situaties." },
                { label: "Besluitvaardigheid:", desc: "Handel vanuit je kern in plaats van reactiviteit." },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-win-gold mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-win-charcoal/90">
                    <strong>{item.label}</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Progression Model */}
      <section className="py-24 px-8 bg-win-olive text-win-cream">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] mb-16">
            Weerbaarheid &bull; Groei &bull; Leiderschap
          </h2>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-win-gold/20 hidden md:block -translate-y-1/2 z-0"></div>
            <div className="relative z-10 bg-win-olive border-2 border-win-gold/30 p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center">
              <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 1</span>
              <span className="text-xl font-bold">Weerbaarheid</span>
            </div>
            <div className="relative z-10 bg-win-olive border-2 border-win-gold/60 p-8 rounded-full w-56 h-56 flex flex-col items-center justify-center scale-110">
              <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 2</span>
              <span className="text-2xl font-bold">Groei</span>
            </div>
            <div className="relative z-10 bg-win-olive border-2 border-win-gold p-8 rounded-full w-64 h-64 flex flex-col items-center justify-center scale-125">
              <span className="text-sm uppercase tracking-widest text-win-gold mb-2">Stap 3</span>
              <span className="text-3xl font-bold">Leiderschap</span>
            </div>
          </div>
          <p className="mt-24 text-xl italic opacity-80">
            &quot;Eerst jezelf leiden, dan pas de ander.&quot;
          </p>
        </div>
      </section>

      {/* Voor Wie Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-8">
                Voor wie is het WIN?
              </h2>
              <p className="text-lg text-win-charcoal/70 mb-12">
                Wij werken met mensen die de lat hoog leggen voor zichzelf, maar
                merken dat de druk van de &apos;outside world&apos; hun
                &apos;inside world&apos; begint te domineren.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Ondernemers", "Professionals", "Leidinggevenden", "Coaches & Trainers"].map((item) => (
                  <div key={item} className="p-6 bg-win-cream rounded-lg font-medium text-win-olive">
                    {item}
                  </div>
                ))}
                <div className="p-6 bg-win-cream rounded-lg font-medium text-win-olive col-span-full">
                  Organisaties &amp; Teams
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px] relative">
              <Image
                className="w-full h-full object-cover"
                src="/images/locatie/nimmerdor 9.jpeg"
                alt="Professionele setting bij WIN"
                fill
              />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars (Visual Cards) */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Coaching", desc: "Individuele en groepsgerichte begeleiding die tot de kern gaat. Voor transformatie op de lange termijn.", link: "/coaching", linkText: "Ontdek Coaching" },
              { title: "Opleidingen", desc: "Professionalisering voor coaches en trainers. Leer werken met de unieke WIN methodiek.", link: "/opleidingen", linkText: "Ontdek Opleidingen" },
              { title: "Organisaties", desc: "Voor leiders, teams en cultuur. Bouwen aan een weerbare organisatie die floreert onder druk.", link: "/organisaties", linkText: "Voor Organisaties" },
            ].map((pillar) => (
              <div key={pillar.title} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                  <Image
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="/images/locatie/nimmerdor 10.jpeg"
                    alt={pillar.title}
                    fill
                  />
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-[family-name:var(--font-headline)] text-win-olive mb-4">{pillar.title}</h3>
                  <p className="text-win-charcoal/70 mb-8">{pillar.desc}</p>
                  <Link className="mt-auto text-win-gold font-bold inline-flex items-center gap-2 group/link" href={pillar.link}>
                    {pillar.linkText}{" "}
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

      {/* CTA Section */}
      <section className="py-24 px-8 bg-win-charcoal text-win-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-headline)] mb-8">
            Versterk je Weerbaarheid.
          </h2>
          <p className="text-xl mb-12 opacity-80">
            Zet vandaag de eerste stap naar een leven en loopbaan in lijn.
          </p>
          <Link
            className="bg-win-gold text-white px-10 py-5 rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-xl inline-block"
            href="/coaching"
          >
            Plan een kennismaking
          </Link>
        </div>
      </section>
    </>
  );
}
