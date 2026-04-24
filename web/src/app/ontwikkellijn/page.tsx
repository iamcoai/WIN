import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "De WIN Ontwikkellijn",
  description:
    "Van functioneren op wilskracht naar leven en leiden vanuit rust, kracht en regie. De vier fasen van transformatie bij WIN.",
};

export default function OntwikkellijnPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <Image
            className="w-full h-full object-cover grayscale-[20%] brightness-75"
            src="/images/locatie/nimmerdor 17.jpeg"
            alt="Mistig herfstbos met gouden bladeren"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-win-bronze/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 mb-6 bg-win-gold/20 backdrop-blur-sm border border-win-gold/30 text-win-gold rounded-full text-sm font-bold tracking-widest uppercase">
              Methodiek
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 font-[family-name:var(--font-headline)]">
              De WIN <span className="text-win-gold">&bull;</span> Ontwikkellijn
            </h1>
            <p className="text-xl md:text-2xl text-stone-100 font-light leading-relaxed max-w-2xl">
              Van functioneren op wilskracht naar leven en leiden vanuit rust,
              kracht en regie.
            </p>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-win-gold font-bold mb-6">
                Herstel de Samenhang
              </h2>
              <p className="text-3xl md:text-4xl font-light text-win-charcoal leading-snug font-[family-name:var(--font-headline)]">
                Veel mensen functioneren ogenschijnlijk goed, maar doen dat op
                spanning, aanpassing of compensatie.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-stone-600 leading-relaxed">
                Binnen WIN werken we vanuit een integratieve en psychofysieke
                benadering waarin{" "}
                <span className="text-win-olive font-semibold italic">
                  Lijf &amp; Brein
                </span>{" "}
                opnieuw in lijn worden gebracht. Het is de weg terug naar je
                natuurlijke staat van weerbaarheid.
              </p>
              <div className="h-1 w-20 bg-win-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Phases Section */}
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-win-olive mb-4 font-[family-name:var(--font-headline)]">
              De Vier Fasen van Transformatie
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Een gestructureerde weg van fundament naar authentiek leiderschap.
            </p>
          </div>
          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 -z-0"></div>
            {[
              {
                num: "01",
                title: "Phase 1 -- Fundamenteren",
                desc: "Je brengt Lijf & Brein opnieuw in lijn en herstelt de basis. Je krijgt zicht op patronen, reacties en automatische gedragingen. Hier ontstaat rust en stabiliteit.",
                items: ["Inzicht in patronen", "Lichaamsbewustzijn"],
                mt: "",
              },
              {
                num: "02",
                title: "Phase 2 -- Stabiliseren",
                desc: "Je ontwikkelt draagkracht en zelfregulatie. Je leert spanning herkennen, dragen en reguleren zonder jezelf te verliezen.",
                items: ["Emotieregulatie", "Stressbeheersing"],
                mt: "mt-8 lg:mt-12",
              },
              {
                num: "03",
                title: "Phase 3 -- Versterken",
                desc: "Je ontwikkelt richting, positionering en besluitkracht. Je neemt meer ruimte in, maakt heldere keuzes vanuit vertrouwen.",
                items: ["Grensbewaking", "Authenticiteit"],
                mt: "mt-0 lg:mt-6",
              },
              {
                num: "04",
                title: "Phase 4 -- Leiderschap",
                desc: "Je integreert Weerbaarheid in hoe je leeft en werkt. Je functioneert vanuit samenhang, rust en kracht.",
                items: ["Belichaamd leiden", "Impact & Rust"],
                mt: "mt-8 lg:mt-16",
              },
            ].map((phase) => (
              <div
                key={phase.num}
                className={`relative z-10 bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group ${phase.mt}`}
              >
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-win-gold transition-colors">
                  <span className="text-win-gold font-bold group-hover:text-white">
                    {phase.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-win-olive mb-4 font-[family-name:var(--font-headline)]">
                  {phase.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {phase.desc}
                </p>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-stone-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

      {/* Integratief en Psychofysiek Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-win-charcoal mb-8 leading-tight font-[family-name:var(--font-headline)]">
              Integratief en <br />
              <span className="text-win-gold italic font-light">
                Psychofysiek
              </span>
            </h2>
            <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
              <p>
                Echte verandering vindt niet alleen plaats in je hoofd. Praten
                over spanning lost de spanning in je zenuwstelsel vaak niet op.
              </p>
              <p>
                Onze methode gaat over wat je{" "}
                <span className="text-win-olive font-semibold">voelt</span> en
                wat je{" "}
                <span className="text-win-olive font-semibold">
                  lichaam toont
                </span>
                . We gebruiken het lijf als ingang om het brein te informeren,
                zodat handelen weer in lijn komt met je intenties.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative min-h-[400px]">
            <Image
              className="absolute inset-0 w-full h-full object-cover"
              src="/images/portretten/20251206_Reza_22.jpg"
              alt="Coaching sessie met warme sfeer"
              fill
            />
          </div>
        </div>
      </section>

      {/* Voor Wie Section */}
      <section className="py-24 bg-win-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-win-olive mb-8 font-[family-name:var(--font-headline)]">
            Voor wie is dit?
          </h2>
          <p className="text-xl text-win-charcoal leading-relaxed mb-12">
            De WIN Ontwikkellijn is specifiek ontworpen voor professionals,
            ondernemers en leiders die voelen dat enkel{" "}
            <span className="italic">inzicht</span> niet meer volstaat. Je bent
            klaar om de stap te maken naar echte ontwikkeling in{" "}
            <span className="font-bold">denken, voelen en handelen</span>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              "Je ervaart interne frictie ondanks je succes.",
              "Je wilt leiden vanuit rust in plaats van druk.",
              "Je zoekt naar een fundament dat echt beklijft.",
            ].map((item) => (
              <div key={item} className="bg-white/50 p-6 rounded-lg border border-stone-200">
                <p className="text-stone-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-24 bg-win-olive text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-headline)]">
              Het Fundament van al onze Diensten
            </h2>
            <p className="text-stone-300 text-lg mb-12">
              De WIN Ontwikkellijn is de rode draad door alles wat we doen. Of je
              nu bij ons komt voor individuele groei of organisatiebrede
              verandering.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Coaching", desc: "Individuele trajecten gericht op persoonlijke doorbraak.", link: "/coaching" },
                { title: "Opleidingen", desc: "Professionalisering voor coaches en trainers.", link: "/opleidingen" },
                { title: "Organisaties", desc: "Cultuurverandering en veerkrachtig leiderschap.", link: "/organisaties" },
              ].map((item) => (
                <Link key={item.title} href={item.link} className="block">
                  <h4 className="text-win-gold font-bold mb-2 uppercase tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-sm text-stone-400">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-win-gold">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 font-[family-name:var(--font-headline)]">
            Versterk je Weerbaarheid.
          </h2>
          <p className="text-xl text-yellow-100 mb-12">
            Plan een kennismaking en ontdek hoe de WIN Ontwikkellijn jouw pad kan
            verhelderen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className="bg-win-bronze text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform inline-block"
              href="/coaching"
            >
              Plan Kennismaking
            </Link>
            <Link
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/30 transition-all inline-block"
              href="/aanbod"
            >
              Bekijk Aanbod
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
