import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kennisinstituut",
  description:
    "Het WIN Kennisinstituut: het fundament onder Weerbaarheidstherapie & -coaching. Methodiekontwikkeling, kennisvertaling en kwaliteitsborging.",
};

export default function KennisinstituutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            className="w-full h-full object-cover brightness-50 contrast-125"
            src="/images/locatie/nimmerdor 11.jpeg"
            alt="Sfeervolle bibliotheek setting"
            fill
            priority
          />
          <div className="absolute inset-0 bg-win-olive/30 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-headline)] text-win-cream mb-6 tracking-tight">
            WIN Kennisinstituut
          </h1>
          <p className="text-xl md:text-2xl text-win-gold font-light tracking-wide uppercase">
            Het fundament onder Weerbaarheidstherapie &amp; -coaching
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block w-12 h-px bg-win-gold mb-8"></span>
          <p className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] text-win-olive leading-snug">
            WIN is een opleidings-, coaching- en kennisinstituut, gebouwd op meer
            dan 40 jaar doorleefde ervaring in Weerbaarheid.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 px-8 bg-white/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square">
            <Image
              className="w-full h-full object-cover shadow-2xl rounded-lg"
              src="/images/locatie/nimmerdor 12.jpeg"
              alt="Methodiek en patronen"
              fill
            />
            <div className="absolute -bottom-6 -right-6 bg-win-gold p-8 text-white hidden md:block">
              <p className="text-3xl font-[family-name:var(--font-headline)]">
                Lijf &amp; Brein
                <br />
                in lijn.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-8">
              Weerbaarheidstherapie &amp; -coaching
            </h2>
            <div className="space-y-6 text-lg text-win-charcoal/80">
              <p>
                Bij WIN gaan we verder dan cognitief inzicht. Echte verandering
                vindt plaats daar waar patronen ontstaan en zich nestelen: in de
                wisselwerking tussen psyche en fysiologie.
              </p>
              <p>
                Het Kennisinstituut vormt de academische en empirische
                ruggengraat van onze methodiek. Wij werken op het snijvlak van
                neurologie, psychologie en systeemgericht werk om professionals
                te begeleiden naar duurzame weerbaarheid.
              </p>
              <p className="font-semibold text-win-olive italic">
                &quot;Wij werken daar waar patronen zichtbaar worden en
                verandering werkelijkheid is.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role of Knowledge Institute */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] text-win-gold font-bold mb-4">
              De Pijlers
            </h2>
            <p className="text-3xl font-[family-name:var(--font-headline)] text-win-olive">
              De Rol van het Kennisinstituut
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Methodiekontwikkeling",
                desc: "Het voortdurend verfijnen en doorontwikkelen van de integratieve WIN-benadering, gebaseerd op de nieuwste wetenschappelijke inzichten en decennia aan praktijkervaring.",
                borderColor: "border-win-gold",
              },
              {
                title: "Kennisvertaling",
                desc: "Complexe psychofysieke processen vertalen naar heldere, effectieve interventies die direct toepasbaar zijn in coaching- en therapietrajecten.",
                borderColor: "border-win-olive",
              },
              {
                title: "Kwaliteit en borging",
                desc: "Bewaken van de diepgang en effectiviteit van de WIN-ontwikkellijn, zodat elke interventie bijdraagt aan het fundament van de client.",
                borderColor: "border-win-charcoal",
              },
            ].map((card) => (
              <div key={card.title} className={`bg-white p-10 border-t-4 ${card.borderColor} shadow-md hover:shadow-xl transition-shadow`}>
                <h3 className="text-xl font-[family-name:var(--font-headline)] text-win-olive mb-4">{card.title}</h3>
                <p className="text-win-charcoal/70 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-out Section */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto bg-win-olive text-win-cream p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl font-[family-name:var(--font-headline)] mb-4">Diepgaande methodiek</h2>
              <p className="text-win-cream/80 text-lg">
                Bezoek onze gespecialiseerde kennisbank voor een gedetailleerde
                uiteenzetting van de Weerbaarheidstherapie.
              </p>
            </div>
            <a
              className="px-8 py-4 bg-win-gold text-white font-semibold flex items-center gap-2 hover:bg-win-gold/90 transition-colors shrink-0"
              href="https://weerbaarheidstherapie.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              weerbaarheidstherapie.nl
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Insights & Publications */}
      <section className="py-24 px-8 bg-win-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-[family-name:var(--font-headline)] text-win-olive mb-12 text-center md:text-left">
            Inzichten &amp; Publicaties
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "De impact van onverwerkt verlies op weerbaarheid",
                theme: "Thema: Emotionele Weerbaarheid",
                img: "/images/locatie/nimmerdor 13.jpeg",
              },
              {
                title: "Het zenuwstelsel als kompas bij burn-out preventie",
                theme: "Thema: Fysiologische Regulatie",
                img: "/images/locatie/nimmerdor 14.jpeg",
              },
              {
                title: "De rol van het lichaam in professioneel leiderschap",
                theme: "Thema: Psychofysiek Werken",
                img: "/images/locatie/nimmerdor 15.jpeg",
              },
            ].map((article) => (
              <article key={article.title} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                  <Image
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    src={article.img}
                    alt={article.title}
                    fill
                  />
                </div>
                <h3 className="text-xl font-[family-name:var(--font-headline)] text-win-olive mb-3 group-hover:text-win-gold transition-colors">
                  {article.title}
                </h3>
                <p className="text-win-charcoal/60 text-sm mb-4">{article.theme}</p>
                <span className="text-win-gold flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                  Lees Paper{" "}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-24 px-8 bg-win-olive text-win-cream text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-[family-name:var(--font-headline)] mb-6">Samenwerking</h2>
          <p className="text-lg opacity-80 mb-12">
            Het Kennisinstituut werkt samen met professionals, organisaties en
            partners om de kwaliteit van Weerbaarheid in Nederland naar een hoger
            plan te tillen. Wij geloven in de kracht van gedeelde expertise en
            interdisciplinaire dialoog.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-win-cream text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-[family-name:var(--font-headline)] text-win-olive mb-8">
            Zet de eerste stap naar verdieping
          </h2>
          <p className="text-win-charcoal/70 mb-12">
            Wilt u meer weten over onze methodiek of bent u geinteresseerd in een
            samenwerking met het WIN Kennisinstituut?
          </p>
          <Link
            className="inline-block bg-win-gold text-white px-12 py-5 rounded-full text-lg font-semibold hover:bg-win-olive transition-colors shadow-lg"
            href="/kennisinstituut"
          >
            Neem contact op
          </Link>
        </div>
      </section>
    </>
  );
}
