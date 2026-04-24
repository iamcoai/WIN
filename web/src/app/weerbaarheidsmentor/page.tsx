import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "De Weerbaarheidsmentor",
  description:
    "Reza - De Weerbaarheidsmentor. Regie over Lijf & Brein. Integratief & psychofysiek werken aan Weerbaarheid, Groei & Leiderschap.",
};

export default function WeerbaarheidsmentorPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Reza - De Weerbaarheidsmentor"
            className="w-full h-full object-cover object-center brightness-90"
            src="/images/portretten/20251206_Reza_17.jpg"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-win-cream/80 via-win-cream/40 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="text-win-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4 block">
              Personal Brand
            </span>
            <h1 className="text-6xl md:text-8xl text-win-olive mb-6 leading-tight font-[family-name:var(--font-headline)] font-extrabold">
              De Weerbaarheids-
              <br />
              <span className="italic font-light">mentor&reg;</span>
            </h1>
            <p className="text-2xl md:text-3xl text-win-charcoal/80 font-light mb-8 max-w-xl">
              Regie over{" "}
              <span className="text-win-gold font-semibold">
                Lijf &amp; Brein
              </span>
            </p>
            <div className="flex items-center gap-4 text-win-olive/70 border-l-2 border-win-gold pl-6 py-2 italic text-lg font-[family-name:var(--font-headline)]">
              Integratief &amp; psychofysiek werken aan Weerbaarheid &bull; Groei
              &bull; Leiderschap
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text Block */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-10 leading-relaxed">
            Echte kracht ontstaat wanneer je stopt met overleven op karakter en
            begint te leiden vanuit{" "}
            <span className="italic">innerlijke stabiliteit</span>.
          </h2>
          <div className="w-24 h-1 bg-win-gold/30 mx-auto mb-10"></div>
          <p className="text-xl text-win-charcoal/70 leading-loose">
            In een wereld die altijd &apos;aan&apos; staat, verliezen we vaak de
            verbinding met ons fundament. Mijn methodiek brengt jouw denken,
            voelen en handelen weer in een lijn. Geen losse vaardigheden, maar
            een diepgaande transformatie van binnenuit.
          </p>
        </div>
      </section>

      {/* "Voor wie de regie wil pakken" */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive">
                Voor wie de regie <br />
                <span className="italic">echt</span> wil pakken.
              </h3>
              <p className="text-win-charcoal/70 text-lg">
                Herken jij jezelf in de frictie van het moderne presteren?
              </p>
              <ul className="space-y-6">
                {[
                  { title: "Vastlopen in spanning", desc: "Je functioneert op hoog niveau, maar de interne druk wordt onhoudbaar." },
                  { title: "Presteren ten koste van energie", desc: "Successen voelen leeg omdat ze je fysiek en mentaal uitputten." },
                  { title: "Blijven analyseren zonder verandering", desc: "Je weet rationeel wat er moet gebeuren, maar je lichaam volgt niet." },
                  { title: "Verantwoordelijkheid met onrust", desc: "Je draagt grote lasten, maar ervaart intern een constante storm." },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-win-gold mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold block text-win-charcoal">{item.title}</span>
                      <span className="text-win-charcoal/60">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
                <Image
                  alt="Natuurlijke rust bij Nimmerdor"
                  className="w-full h-full object-cover"
                  src="/images/locatie/nimmerdor 16.jpeg"
                  fill
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-win-olive p-8 text-win-cream max-w-xs rounded-lg shadow-xl">
                <p className="italic text-xl font-[family-name:var(--font-headline)]">
                  &quot;Het bos van Nimmerdor is mijn buiten-praktijk, waar de
                  natuur de spiegel is voor jouw innerlijke proces.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Wat dit oplevert" - Bento Grid Layout */}
      <section className="py-24 bg-win-olive text-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] mb-4">
              Lijf &amp; Brein in lijn
            </h2>
            <p className="text-win-gold tracking-widest uppercase text-sm">
              Wat de WIN-methodiek jou brengt
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-win-charcoal/40 p-10 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-[family-name:var(--font-headline)] mb-3">
                  Rust &amp; Stabiliteit
                </h4>
                <p className="text-win-cream/60">
                  Een kalm zenuwstelsel, ongeacht de chaos om je heen.
                </p>
              </div>
            </div>
            <div className="bg-win-charcoal/40 p-10 rounded-xl border border-white/10 md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-[family-name:var(--font-headline)] mb-3">
                  Helderheid in keuzes
                </h4>
                <p className="text-win-cream/60">
                  Weten wat je te doen staat omdat je toegang hebt tot je
                  volledige potentieel -- zowel cognitief als intuitief.
                </p>
              </div>
            </div>
            <div className="bg-win-charcoal/40 p-10 rounded-xl border border-white/10 md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-[family-name:var(--font-headline)] mb-3">
                  Krachtig onder druk
                </h4>
                <p className="text-win-cream/60">
                  Je verliest jezelf niet in de waan van de dag, maar blijft
                  gepositioneerd in jouw eigen kracht en waarden.
                </p>
              </div>
            </div>
            <div className="bg-win-charcoal/40 p-10 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-[family-name:var(--font-headline)] mb-3">
                  Regie over energie
                </h4>
                <p className="text-win-cream/60">
                  Bewust sturen op je emoties, gedrag en vitale reserves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "De kern" */}
      <section className="py-24 bg-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="bg-win-gold/10 absolute -inset-4 rounded-full blur-3xl"></div>
              <div className="relative z-10 aspect-square rounded-full border-[12px] border-white overflow-hidden shadow-2xl">
                <Image
                  alt="Psychofysiek fundament"
                  className="w-full h-full object-cover"
                  src="/images/portretten/20251206_Reza_18.jpg"
                  fill
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-win-gold font-bold tracking-widest uppercase text-xs mb-4">
                De Methodiek
              </h3>
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-6">
                De Basis van Leiderschap
              </h2>
              <p className="text-win-charcoal/80 text-lg mb-8 leading-relaxed">
                Echte groei en leiderschap beginnen niet bij een nieuwe
                managementvaardigheid of een hippe tool. Het begint bij de basis:{" "}
                <span className="font-bold">Weerbaarheid</span>.
              </p>
              <p className="text-win-charcoal/70 mb-8">
                Mijn psychofysieke aanpak integreert de nieuwste inzichten uit de
                neuropsychologie met eeuwenoude wijsheid over
                lichaamsbewustzijn. We werken op de laag waar echte verandering
                beklijft.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/40 rounded border border-win-olive/5">
                  <span className="block text-win-gold font-bold text-xl mb-1">Fundament</span>
                  <span className="text-xs uppercase tracking-tighter text-win-olive/60 italic">
                    Lijf &amp; Brein
                  </span>
                </div>
                <div className="p-4 bg-white/40 rounded border border-win-olive/5">
                  <span className="block text-win-gold font-bold text-xl mb-1">Impact</span>
                  <span className="text-xs uppercase tracking-tighter text-win-olive/60 italic">
                    Groei &amp; Vrijheid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Oorsprong" */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="w-full md:w-2/5">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 relative">
                <Image
                  alt="Reza - Persoonlijk"
                  className="w-full h-full object-cover"
                  src="/images/portretten/20251206_Reza_20.jpg"
                  fill
                />
              </div>
            </div>
            <div className="w-full md:w-3/5">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-8">
                De Wortels van <br />
                <span className="italic">Weerbaarheid</span>
              </h2>
              <div className="space-y-6 text-win-charcoal/80 leading-relaxed">
                <p>
                  Mijn reis begon lang voordat ik coach werd. Als kind van een
                  vader die me de waarde van discipline en innerlijke kracht
                  bijbracht, leerde ik vroeg wat het betekent om te staan in de
                  storm.
                </p>
                <p>
                  Weerbaarheid is voor mij geen theoretisch concept. Het is
                  geleefde ervaring. Vanuit de fysieke training en jarenlange
                  ervaring in crisis- en verandermanagement zag ik steeds
                  hetzelfde patroon: wie zijn basis niet op orde heeft, verliest
                  zichzelf in de complexiteit van de buitenwereld.
                </p>
                <blockquote className="border-l-4 border-win-gold pl-6 py-2 italic text-xl text-win-olive font-[family-name:var(--font-headline)]">
                  &quot;Ik help professionals de weg terug te vinden naar hun
                  eigen kern, zodat ze weer kunnen leiden vanuit rust in plaats
                  van onrust.&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-win-cream border-y border-win-olive/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-[family-name:var(--font-headline)] text-win-olive mb-12 text-center">
            Ervaring en Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { label: "35+ Jaar", sub: "Ervaring" },
              { label: "NLP Trainer", sub: "Gecertificeerd" },
              { label: "Psychofysiek", sub: "Sinds 1993" },
              { label: "Crisis/Change", sub: "Management" },
              { label: "Systeemwerk", sub: "Samengesteld gezin" },
              { label: "Organisaties", sub: "Cultuur & Teams" },
            ].map((item) => (
              <div key={item.label} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-win-gold group-hover:text-white transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="font-bold text-win-olive block">{item.label}</span>
                <span className="text-xs uppercase text-win-olive/60">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Table */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-16 text-center">
            Domeinen van Transformatie
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-win-gold">
                  <th className="py-6 px-4 text-left font-[family-name:var(--font-headline)] text-xl text-win-olive w-1/4">
                    Domein
                  </th>
                  <th className="py-6 px-4 text-left font-[family-name:var(--font-headline)] text-xl text-win-olive">
                    Focus &amp; Impact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-win-olive/10">
                {[
                  { domain: "Persoonlijke Ontwikkeling", focus: "De weg naar binnen. Herstel van balans, verwerken van stress en het herontdekken van je authentieke kracht." },
                  { domain: "(Zelf)leiderschap", focus: "Positionering vanuit rust. Helderheid in visie en krachtig handelen zonder jezelf te verliezen." },
                  { domain: "Relationele Samenwerking", focus: "Verbinding zonder verlies van autonomie. Systemisch kijken naar patronen in interactie." },
                  { domain: "Sport & Performance", focus: "De psychologie van de winnaar. Fysieke weerbaarheid vertalen naar mentale overmacht." },
                  { domain: "Teams & Organisaties", focus: "Collectieve weerbaarheid. Van reactieve cultuur naar proactief leiderschap binnen het hele systeem." },
                ].map((row) => (
                  <tr key={row.domain} className="group hover:bg-win-cream/50 transition-colors">
                    <td className="py-8 px-4 font-bold text-win-charcoal">{row.domain}</td>
                    <td className="py-8 px-4 text-win-charcoal/70 italic">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-win-olive relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] text-win-cream mb-8 leading-tight">
            Wil jij de regie terug en{" "}
            <span className="italic">Lijf &amp; Brein</span> duurzaam in lijn
            brengen?
          </h2>
          <p className="text-win-cream/70 text-xl mb-12">
            Zet vandaag de eerste stap naar een leven en loopbaan vanuit kalme
            kracht.
          </p>
          <Link
            className="inline-block bg-win-gold hover:bg-win-gold/90 text-win-bronze font-bold py-5 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            href="/weerbaarheidsmentor"
          >
            Plan een kennismaking met De Weerbaarheidsmentor&reg;
          </Link>
        </div>
      </section>
    </>
  );
}
