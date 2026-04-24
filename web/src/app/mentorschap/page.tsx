import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentorschap",
  description:
    "Exclusief mentorschap voor ondernemers, leiders en professionals die eindverantwoordelijkheid dragen. Weerbaarheid als fundament voor Groei en Leiderschap.",
};

export default function MentorschapPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-win-gold/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            <div className="flex items-center gap-4 text-win-gold uppercase tracking-[0.3em] text-xs font-bold">
              <span className="w-12 h-px bg-win-gold"></span>
              Exclusief Mentorschap
            </div>
            <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-headline)] font-extrabold text-win-olive leading-[1.05] tracking-tighter">
              WIN Mentorschap
            </h1>
            <p className="text-2xl font-[family-name:var(--font-headline)] font-light italic text-win-gold max-w-xl leading-snug">
              Weerbaarheid als fundament voor Groei en Leiderschap
            </p>
            <p className="text-xl text-win-charcoal/80 max-w-lg leading-relaxed font-light">
              Voor mensen die verantwoordelijkheid dragen en willen functioneren
              vanuit rust, kracht en regie.
            </p>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-2xl relative group">
              <Image
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="/images/portretten/20251206_Reza_14.jpg"
                alt="Reza - WIN Mentorschap"
                fill
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-win-olive text-win-cream p-8 hidden md:block">
              <span className="block text-4xl font-[family-name:var(--font-headline)] font-bold mb-2">35+</span>
              <span className="text-xs uppercase tracking-widest opacity-80">Jaar Expertise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] leading-relaxed text-win-olive font-light">
            &quot;Er komt een punt waarop inzicht niet meer voldoende is. Je hebt
            ervaring, je hebt verantwoordelijkheid, je weet hoe het werkt -- en
            toch merk je dat er momenten zijn waarop spanning oploopt, keuzes
            complexer worden en het steeds meer vraagt om{" "}
            <span className="text-win-gold font-semibold italic">
              scherpte, stabiliteit en innerlijke regie
            </span>
            .&quot;
          </p>
        </div>
      </section>

      {/* Wanneer het anders moet */}
      <section className="py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-olive leading-tight">
                Wanneer je merkt dat het anders moet.
              </h2>
              <div className="space-y-8 text-lg leading-relaxed text-win-charcoal/70">
                <p>
                  Functioneren onder constante druk is een vaardigheid, maar de
                  prijs die je betaalt voor de &apos;always-on&apos; stand kan te
                  hoog worden. De verantwoordelijkheid die je draagt voor teams,
                  organisaties of complexe trajecten vereist meer dan alleen
                  management skills.
                </p>
                <p>
                  Het vraagt om een belichaamde vorm van stabiliteit. Niet vanuit
                  wilskracht alleen, maar vanuit een fundament dat staat als een
                  huis, ook als het stormt.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 space-y-4 border-l-4 border-win-gold">
                <svg className="w-8 h-8 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
                <h4 className="font-bold text-win-olive">Always-on druk</h4>
                <p className="text-sm opacity-70 italic">De constante ruis die nooit helemaal verdwijnt.</p>
              </div>
              <div className="bg-white p-8 space-y-4 mt-8 border-l-4 border-win-olive">
                <svg className="w-8 h-8 text-win-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
                <h4 className="font-bold text-win-olive">Frictie</h4>
                <p className="text-sm opacity-70 italic">Wanneer weten wat je moet doen niet meer genoeg is.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voor wie dit bedoeld is */}
      <section className="py-32 bg-win-bronze text-win-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-win-olive opacity-30 transform skew-x-12"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-12">
            <div className="space-y-4">
              <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold">Exclusiviteit</span>
              <h2 className="text-5xl font-[family-name:var(--font-headline)] font-extrabold leading-tight">
                Dit is geen traject voor iedereen.
              </h2>
            </div>
            <p className="text-xl font-light text-win-cream/80 leading-relaxed">
              WIN Mentorschap is specifiek ontworpen voor ondernemers, leiders en
              professionals die eindverantwoordelijkheid dragen. Voor hen wiens
              beslissingen impact hebben op de levens van anderen en de
              stabiliteit van hun organisatie.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-win-gold/30">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-win-gold">Wie je bent</h3>
                <ul className="space-y-3 opacity-80 font-light">
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> Ondernemer of Eindverantwoordelijke</li>
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> Senior Leadership</li>
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> High-impact professionals</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-win-gold">Wat je zoekt</h3>
                <ul className="space-y-3 opacity-80 font-light">
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> Werkelijke innerlijke rust</li>
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> Mentorschap op niveau</li>
                  <li className="flex items-center gap-3"><span className="w-1 h-1 bg-win-gold rounded-full"></span> Psychofysieke integratie</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wat mentorschap anders maakt */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 aspect-[3/4] overflow-hidden bg-win-cream relative">
              <Image
                className="w-full h-full object-cover"
                src="/images/locatie/nimmerdor 3.jpeg"
                alt="Balans en kracht op landgoed Nimmerdor"
                fill
              />
              <div className="absolute inset-0 bg-win-gold/5"></div>
            </div>
            <div className="md:col-span-7 space-y-12">
              <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-olive">
                Wat mentorschap anders maakt.
              </h2>
              <p className="text-xl text-win-charcoal/70 leading-relaxed">
                Coaching gaat vaak over gedrag en doelen. Mentorschap bij WIN gaat
                dieper: we werken aan het fundament van jouw zijn. We brengen{" "}
                <span className="italic text-win-olive font-medium">
                  denken, voelen en handelen
                </span>{" "}
                in lijn.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-win-cream flex items-center justify-center">
                    <svg className="w-6 h-6 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-win-olive uppercase tracking-wider text-sm">Psychofysiek</h4>
                  <p className="text-sm text-win-charcoal/60">Je lichaam weet vaak eerder dan je brein dat de balans weg is. We gebruiken fysieke intelligentie als kompas.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-win-cream flex items-center justify-center">
                    <svg className="w-6 h-6 text-win-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-win-olive uppercase tracking-wider text-sm">Integratief</h4>
                  <p className="text-sm text-win-charcoal/60">Geen losse trucjes, maar een volledige integratie van methodieken (NLP, systemisch werk, therapie).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ontwikkellijn Section */}
      <section className="py-32 bg-win-cream">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block">De WIN Methode</span>
          <h2 className="text-5xl font-[family-name:var(--font-headline)] font-bold text-win-olive">De Ontwikkellijn</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-win-gold/20 hidden md:block -translate-y-1/2"></div>
            {[
              { num: "01", title: "Fundamenteren", desc: "Terug naar de basis van je fysieke en mentale gesteldheid.", mt: "" },
              { num: "02", title: "Stabiliseren", desc: "Borgen van rust en overzicht, ook in complexe situaties.", mt: "md:mt-8" },
              { num: "03", title: "Versterken", desc: "Uitbouwen van je vermogen om vanuit regie te handelen.", mt: "" },
              { num: "04", title: "Leiderschap", desc: "Leidinggeven vanuit een onwrikbaar innerlijk kompas.", mt: "md:mt-8" },
            ].map((step) => (
              <div key={step.num} className={`relative bg-white p-10 space-y-6 group hover:bg-win-gold transition-all duration-500 hover:-translate-y-2 ${step.mt}`}>
                <span className="text-5xl font-[family-name:var(--font-headline)] font-black text-win-gold/20 group-hover:text-white/20 transition-colors">{step.num}</span>
                <h3 className="text-xl font-bold text-win-olive group-hover:text-white uppercase tracking-widest">{step.title}</h3>
                <p className="text-sm text-win-charcoal/60 group-hover:text-white/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-32 bg-win-olive text-win-cream">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold">Wat dit je oplevert.</h2>
            <div className="space-y-6">
              {[
                { title: "Rust en stabiliteit onder druk", desc: "Niet meer meegesleurd worden door de waan van de dag." },
                { title: "Scherpte in besluitvorming", desc: "Keuzes maken vanuit helderheid in plaats van angst of noodzaak." },
                { title: "Stevigheid in positionering", desc: "Authentiek en congruent aanwezig zijn in elke interactie." },
                { title: "Duurzame energie", desc: "Effectief zijn zonder dat het ten koste gaat van je gezondheid of relaties." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-win-gold mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="opacity-70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-square border border-win-gold/30 p-12 flex flex-col justify-center items-center text-center space-y-6">
              <div className="text-7xl font-[family-name:var(--font-headline)] font-black text-win-gold/20 group-hover:text-win-gold transition-colors duration-700 italic">
                &quot;Lijf &amp; Brein in lijn&quot;
              </div>
              <p className="text-xl italic font-light opacity-80">-- Reza (De Weerbaarheidsmentor&reg;)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investering Section */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <span className="text-win-gold uppercase tracking-[0.4em] text-xs font-bold">Commitment</span>
          <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold text-win-olive">
            Investering in Meesterschap
          </h2>
          <div className="h-px w-24 bg-win-gold mx-auto"></div>
          <p className="text-xl text-win-charcoal/80 leading-relaxed italic">
            &quot;De instap voor WIN Mentorschap start vanaf{" "}
            <span className="text-win-olive font-bold">&euro;5.000</span> voor
            een traject van 3 maanden.&quot;
          </p>
          <p className="text-sm text-win-charcoal/50 max-w-lg mx-auto">
            Deze investering reflecteert de intensiteit, de 1-op-1
            beschikbaarheid van Reza en de diepgaande transformatie van jouw
            professionele en persoonlijke fundament.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-win-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-win-olive tracking-tighter leading-tight">
            Werk op het niveau waar het verschil{" "}
            <br className="hidden md:block" /> daadwerkelijk wordt gemaakt.
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              className="bg-win-gold text-win-cream px-12 py-5 font-[family-name:var(--font-headline)] uppercase tracking-widest text-sm font-bold hover:scale-105 transition-all shadow-xl"
              href="/mentorschap"
            >
              Plan een kennismaking
            </Link>
            <Link href="/wininstituut" className="text-sm opacity-50 tracking-widest uppercase">
              Of ontdek de methodiek
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/50 to-transparent -z-10"></div>
      </section>
    </>
  );
}
