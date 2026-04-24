import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aanbod",
  description:
    "Bij WIN werken we op het snijvlak van psychologie en fysieke kracht. We helpen professionals, leiders en organisaties om frictie om te zetten in veerkracht.",
};

export default function AanbodPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="text-win-gold uppercase tracking-[0.25em] text-xs font-bold px-4 py-1 border border-win-gold/20 rounded-full">
              Diensten &amp; Trajecten
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl text-win-charcoal mb-8 font-[family-name:var(--font-headline)] font-black">
            Aanbod
          </h1>
          <p className="text-xl md:text-2xl font-light text-win-charcoal/80 mb-6 italic">
            Weerbaarheid ontwikkelen, verdiepen en verankeren
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12 text-win-gold font-medium tracking-wide uppercase text-[10px] md:text-xs">
            <span>persoonlijk</span>
            <span className="opacity-30">&bull;</span>
            <span>professioneel</span>
            <span className="opacity-30">&bull;</span>
            <span>organisatorisch</span>
          </div>
          <p className="text-lg leading-relaxed text-win-charcoal/70 max-w-2xl mx-auto font-light">
            Bij WIN werken we op het snijvlak van psychologie en fysieke kracht.
            We helpen professionals, leiders en organisaties om frictie om te
            zetten in veerkracht. Of het nu gaat om individuele groei of een
            cultuuromslag: we brengen lijf en brein terug in lijn.
          </p>
        </div>
      </section>

      {/* WIN Ontwikkellijn Visual */}
      <section className="py-24 bg-white/50 border-y border-win-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 italic font-[family-name:var(--font-headline)]">
              De WIN Ontwikkellijn&reg;
            </h2>
            <p className="text-win-charcoal/60 uppercase tracking-widest text-xs">
              Van herstel naar meesterschap
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-win-gold/10 via-win-gold to-win-gold/10 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { icon: "01", title: "Fundamenteren", desc: "De basis leggen voor fysiek en mentaal herstel." },
                { icon: "02", title: "Stabiliseren", desc: "Rust creeren in het systeem en grenzen leren hanteren." },
                { icon: "03", title: "Versterken", desc: "Het vergroten van de draagkracht en effectiviteit." },
                { icon: "04", title: "Leiderschap", desc: "Leven en werken vanuit authentieke, kalme kracht." },
              ].map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full bg-win-cream border border-win-gold/30 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="text-win-gold text-2xl font-bold">{step.icon}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-headline)] font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-win-charcoal/60 px-4">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                num: "01",
                title: "Coaching",
                desc: "Focus op individuele transformatie voor professionals. We werken aan het herstellen van de balans tussen lijf en brein, zodat je weer regie krijgt over je eigen handelen.",
                price: "Vanaf \u20AC2.000 per traject",
                link: "/coaching",
                linkText: "Bekijk trajecten",
              },
              {
                num: "02",
                title: "Mentorschap",
                desc: "Exclusieve 1-op-1 begeleiding voor leiders en ondernemers die op het hoogste niveau opereren en behoefte hebben aan een klankbord vanuit kalme kracht.",
                price: "Vanaf \u20AC5.000 per kwartaal",
                link: "/mentorschap",
                linkText: "Intensieve begeleiding",
              },
              {
                num: "03",
                title: "Opleidingen",
                desc: "Word zelf een expert in weerbaarheidstherapie. Onze geaccrediteerde opleidingen combineren NLP, systemisch werk en psychofysieke methodieken.",
                price: "Voor coaches & therapeuten",
                link: "/opleidingen",
                linkText: "Bekijk curriculum",
              },
              {
                num: "04",
                title: "Organisaties",
                desc: "Incompany trajecten gericht op veerkrachtige teams, leiderschapscultuur en professionele omgang met verlies en trauma binnen de organisatie.",
                price: "Maatwerk oplossingen",
                link: "/organisaties",
                linkText: "Naar zakelijk aanbod",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="group relative bg-white p-12 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-win-charcoal/5 flex flex-col h-full overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-win-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-win-gold font-bold tracking-tighter text-4xl mb-6">{card.num}</span>
                  <h3 className="text-3xl mb-4 group-hover:text-win-gold transition-colors font-[family-name:var(--font-headline)]">
                    {card.title}
                  </h3>
                  <p className="text-win-charcoal/70 mb-8 leading-relaxed font-light">{card.desc}</p>
                  <div className="mt-auto">
                    <p className="text-xs text-win-charcoal/40 uppercase tracking-widest mb-4">{card.price}</p>
                    <Link
                      className="inline-flex items-center gap-3 text-win-gold font-bold group-hover:translate-x-2 transition-transform"
                      href={card.link}
                    >
                      {card.linkText}{" "}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forms of Guidance Section */}
      <section className="py-24 bg-win-olive text-win-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight italic font-[family-name:var(--font-headline)]">
              Vormen van begeleiding
            </h2>
            <p className="text-win-cream/70 mb-12 text-lg font-light leading-relaxed">
              De methode van Reza is integratief en psychofysiek. We bieden
              verschillende contexten aan waarin deze transformatie kan
              plaatsvinden.
            </p>
            <ul className="space-y-6">
              {[
                { title: "Individueel (1-op-1)", desc: "Maximale focus op persoonlijke diepgang en vertrouwelijkheid." },
                { title: "Groepstrajecten", desc: "Leren van en met gelijkgestemden in een veilige setting." },
                { title: "Incompany & Teams", desc: "Versterken van de gezamenlijke veerkracht en communicatie." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full border border-win-gold flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-win-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-lg block mb-1">{item.title}</span>
                    <span className="text-win-cream/60 text-sm">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-win-bronze rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src="/images/portretten/20251206_Reza_11.jpg"
                alt="Reza in coaching sessie"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-win-bronze/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="italic text-2xl text-win-gold font-[family-name:var(--font-headline)]">
                  &quot;Lijf &amp; Brein in lijn&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-win-cream text-center px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl text-win-charcoal mb-12 leading-tight font-[family-name:var(--font-headline)]">
            Versterk je Weerbaarheid als fundament voor{" "}
            <span className="text-win-gold italic">Groei en Leiderschap</span> in
            werk, prive en leven.
          </h2>
          <Link
            href="/coaching"
            className="bg-win-gold text-white px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-xl inline-block"
          >
            Plan een kennismaking
          </Link>
          <p className="mt-8 text-win-charcoal/50 text-sm italic">
            Geheel vrijblijvend, gericht op jouw specifieke situatie.
          </p>
        </div>
      </section>
    </>
  );
}
