/* Eenmalige content-import: zet de bestaande site 1-op-1 in Payload.
 * Draaien: npm run seed (idempotent — wist en hervult de content-collecties). */
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG = path.resolve(dirname, '../../public/images')

const fotos: Record<string, { pad: string; alt: string }> = {
  nimmerdor1: { pad: 'locatie/nimmerdor 1.jpeg', alt: 'Landgoed Nimmerdor in herfstlicht' },
  nimmerdor2: { pad: 'locatie/nimmerdor 2.jpeg', alt: 'Reza in het bos van Nimmerdor' },
  nimmerdor3: { pad: 'locatie/nimmerdor 3.jpeg', alt: 'Balans en kracht op landgoed Nimmerdor' },
  nimmerdor4: { pad: 'locatie/nimmerdor 4.jpeg', alt: 'Educatie bij WIN' },
  nimmerdor5: { pad: 'locatie/nimmerdor 5.jpeg', alt: 'Natuur als spiegel' },
  nimmerdor6: { pad: 'locatie/nimmerdor 6.jpeg', alt: 'Professioneel leiderschap' },
  nimmerdor7: { pad: 'locatie/nimmerdor 7.jpeg', alt: 'Team workshop' },
  nimmerdor8: { pad: 'locatie/nimmerdor 8.jpeg', alt: 'Reza op landgoed Nimmerdor' },
  nimmerdor9: { pad: 'locatie/nimmerdor 9.jpeg', alt: 'Reza in het herfstbos van Nimmerdor' },
  nimmerdor11: { pad: 'locatie/nimmerdor 11.jpeg', alt: 'Sfeervolle setting bij WIN' },
  nimmerdor12: { pad: 'locatie/nimmerdor 12.jpeg', alt: 'Methodiek en patronen' },
  nimmerdor13: { pad: 'locatie/nimmerdor 13.jpeg', alt: 'De impact van onverwerkt verlies op weerbaarheid' },
  nimmerdor14: { pad: 'locatie/nimmerdor 14.jpeg', alt: 'Het zenuwstelsel als kompas bij burn-out preventie' },
  nimmerdor15: { pad: 'locatie/nimmerdor 15.jpeg', alt: 'De rol van het lichaam in professioneel leiderschap' },
  nimmerdor16: { pad: 'locatie/nimmerdor 16.jpeg', alt: 'Natuurlijke rust bij Nimmerdor' },
  nimmerdor17: { pad: 'locatie/nimmerdor 17.jpeg', alt: 'Reza in herfstig bos' },
  nimmerdor18: { pad: 'locatie/nimmerdor 18.jpeg', alt: 'Reza — De Weerbaarheidsmentor' },
  reza1: { pad: 'portretten/20251206_Reza_1.jpg', alt: 'Reza - De Weerbaarheidsmentor' },
  reza11: { pad: 'portretten/20251206_Reza_11.jpg', alt: 'Reza in coaching sessie' },
  reza12: { pad: 'portretten/20251206_Reza_12.jpg', alt: 'Reza in een rustige, natuurlijk verlichte werkruimte' },
  reza13: { pad: 'portretten/20251206_Reza_13.jpg', alt: 'Coaching sessie bij WIN' },
  reza14: { pad: 'portretten/20251206_Reza_14.jpg', alt: 'Reza — WIN Mentorschap' },
  reza15: { pad: 'portretten/20251206_Reza_15.jpg', alt: 'Reza kijkt nadenkend uit het raam' },
  reza18: { pad: 'portretten/20251206_Reza_18.jpg', alt: 'Psychofysiek fundament' },
  reza20: { pad: 'portretten/20251206_Reza_20.jpg', alt: 'Reza, trainer, coach en therapeut bij WIN' },
  reza22: { pad: 'portretten/20251206_Reza_22.jpg', alt: 'Coaching sessie met warme sfeer' },
  herkenJeDit: { pad: 'herken-je-dit.jpg', alt: 'Reza in gesprek met een client' },
  lijfBrein: { pad: 'lijf-brein-in-lijn.jpg', alt: 'Lijf & Brein in lijn — Reza in gesprek' },
}

async function run() {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  log('Content-collecties leegmaken...')
  for (const col of ['paginas', 'publicaties', 'methodes', 'diensten', 'media'] as const) {
    await payload.delete({ collection: col, where: { id: { exists: true } } })
  }

  log('Media importeren...')
  const m: Record<string, number> = {}
  for (const [key, f] of Object.entries(fotos)) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: f.alt },
      filePath: path.join(IMG, f.pad),
    })
    m[key] = doc.id as number
  }

  log('Diensten & Prijzen...')
  await payload.create({ collection: 'diensten', data: { naam: 'Coaching', route: '/coaching', kaartOmschrijving: 'Focus op individuele transformatie voor professionals. We werken aan het herstellen van de balans tussen lijf en brein, zodat je weer regie krijgt over je eigen handelen.', prijsLabel: 'Vanaf €2.000 per traject', linkTekst: 'Bekijk trajecten', volgorde: 1 } })
  const dienstMentorschap = await payload.create({ collection: 'diensten', data: { naam: 'Mentorschap', route: '/mentorschap', kaartOmschrijving: 'Exclusieve 1-op-1 begeleiding voor leiders en ondernemers die op het hoogste niveau opereren en behoefte hebben aan een klankbord vanuit kalme kracht.', prijsLabel: 'Vanaf €5.000 per kwartaal', linkTekst: 'Intensieve begeleiding', volgorde: 2 } })
  await payload.create({ collection: 'diensten', data: { naam: 'Opleidingen', route: '/opleidingen', kaartOmschrijving: 'Word zelf een expert in weerbaarheidstherapie. Onze geaccrediteerde opleidingen combineren NLP, systemisch werk en psychofysieke methodieken.', prijsLabel: 'Voor coaches & therapeuten', linkTekst: 'Bekijk curriculum', volgorde: 3 } })
  await payload.create({ collection: 'diensten', data: { naam: 'Organisaties', route: '/organisaties', kaartOmschrijving: 'Incompany trajecten gericht op veerkrachtige teams, leiderschapscultuur en professionele omgang met verlies en trauma binnen de organisatie.', prijsLabel: 'Maatwerk oplossingen', linkTekst: 'Naar zakelijk aanbod', volgorde: 4 } })

  log('Methodes (integratief palet)...')
  const methodes = [
    ['NLP', 'Neuro Linguïstisch Programmeren: inzicht in hoe je gedachten, gevoelens en gedrag elkaar beïnvloeden — en hoe je die beïnvloeding bewust inzet.'],
    ['Organisatie- & familie-opstellingen', 'Systemisch werk dat onzichtbare patronen en dynamieken in je systeem zichtbaar en hanteerbaar maakt.'],
    ['Therapeutisch & systemisch kickboksen', 'Psychofysieke training waarin je via het lichaam mentale barrières doorbreekt en grenzen leert voelen en stellen.'],
    ['Rouw- & verliesverweving', 'Ruimte en begeleiding om verlies te verwerken en te verweven in je verhaal, zodat het je kracht niet langer blokkeert.'],
    ['Kracht- & conditietraining', 'Een sterk lichaam als fundament: energiehuishouding, veerkracht en het fysiek kunnen dragen van druk.'],
    ['Psychosociale begeleiding', 'Gesprekstherapie en ondersteuning waarin je wensen, grenzen en behoeften centraal staan.'],
    ['Koudetherapie', 'Bewust werken met kou en ademhaling om je stress-respons te reguleren en je kalme kern te versterken.'],
    ['Positieve psychologie & gezondheid', 'Bouwen vanuit wat werkt: betekenis, veerkracht en gezonde gewoontes als motor voor duurzame groei.'],
  ]
  for (let i = 0; i < methodes.length; i++) {
    await payload.create({ collection: 'methodes', data: { titel: methodes[i][0], omschrijving: methodes[i][1], volgorde: i + 1 } })
  }

  log('Publicaties...')
  const pubs: [string, string, number][] = [
    ['De impact van onverwerkt verlies op weerbaarheid', 'Thema: Emotionele Weerbaarheid', m.nimmerdor13],
    ['Het zenuwstelsel als kompas bij burn-out preventie', 'Thema: Fysiologische Regulatie', m.nimmerdor14],
    ['De rol van het lichaam in professioneel leiderschap', 'Thema: Psychofysiek Werken', m.nimmerdor15],
  ]
  for (let i = 0; i < pubs.length; i++) {
    await payload.create({ collection: 'publicaties', data: { titel: pubs[i][0], themaLabel: pubs[i][1], foto: pubs[i][2], volgorde: i + 1 } })
  }

  log('Site-globals...')
  await payload.updateGlobal({ slug: 'navigatie', data: {
    hoofdmenu: ['Methodiek', 'Aanbod', 'Coaching', 'Mentorschap', 'Opleidingen', 'Organisaties', 'Over WIN'].map((label) => ({ label })),
    meerMenu: ['Kennisinstituut', 'De Mentor', 'Ontwikkellijn'].map((label) => ({ label })),
    ctaLabel: 'Gratis Kennismaking',
    inloggenLabel: 'Inloggen',
  } })
  await payload.updateGlobal({ slug: 'footer', data: {
    tagline: 'Hét Instituut voor Weerbaarheidstherapie & -coaching.',
    adresRegel1: 'Zuiderinslag 8N',
    adresRegel2: '3871 MR Hoevelaken',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zuiderinslag+8N%2C+3871+MR+Hoevelaken',
    kvkNummer: '50946315',
    copyrightSuffix: 'Integratief · Psychofysiek · Systemisch.',
  } })

  log("Pagina's...")
  const maakPagina = async (data: Record<string, unknown>) =>
    payload.create({ collection: 'paginas', data: { ...data, _status: 'published' } as never, draft: false })

  await maakPagina({
    titel: 'Home', slug: 'home',
    metaTitel: 'Welkom bij WIN',
    metaOmschrijving: 'De buitenwereld ziet succes, maar binnenin voel je de frictie. Wij helpen professionals de balans te herstellen tussen externe prestatie en interne rust.',
    hero: { type: 'homeHero', kop: { voor: 'Welkom bij', accent: 'WIN' }, subtitel: 'Weerbaarheids Instituut Nederland', introZin: 'De buitenwereld ziet succes, maar binnenin voel je de frictie. Wij helpen professionals de balans te herstellen tussen externe prestatie en interne rust.', foto: m.nimmerdor1, cta: { label: 'Ontdek de Methodiek', doel: '/methodiek' }, secundaireCta: { label: 'Over de Mentor', doel: '/weerbaarheidsmentor' } },
    layout: [
      { blockType: 'introSplit', stijl: 'homeIntro', kop: { voor: 'Bij WIN herstellen we de verbinding tussen je', accent: 'binnenwereld', na: 'en je buitenwereld.' }, alineas: [
        { tekst: "\"Lijf & Brein in lijn\" -- dat is de kern. In een wereld die altijd 'aan' staat, raken we vaak de verbinding met ons eigen lichaam en onze werkelijke drijfveren kwijt. We functioneren op de automatische piloot, terwijl de interne frictie toeneemt." },
        { tekst: 'Onze methodiek is integratief en psychofysiek. We praten niet alleen over verandering; we laten je lichaam en geest in samenhang functioneren, zodat denken, voelen en handelen weer een lijn vormen.' },
      ], foto: m.reza1, fotoKaartTekst: '"Weerbaarheid is niet het afstoten van druk, maar het absorberen ervan vanuit een kalme kern."' },
      { blockType: 'kaartenGrid', stijl: 'domeinen', kop: { voor: 'De 4 Domeinen van Weerbaarheid' }, introZin: 'Wij benaderen persoonlijke groei vanuit een holistisch perspectief. Elk domein is essentieel voor een onwankelbaar fundament.', items: [
        { titel: 'Fysiek', omschrijving: 'Lichaamsbewustzijn, energiebeheer en het fysiek kunnen dragen van verantwoordelijkheid.', icoon: 'fysiek' },
        { titel: 'Mentaal', omschrijving: 'Cognitieve weerbaarheid, mindset en het vermogen om heldere keuzes te maken onder druk.', icoon: 'mentaal' },
        { titel: 'Sociaal', omschrijving: 'Verbinding, grenzen stellen en gezonde, effectieve professionele relaties.', icoon: 'sociaal' },
        { titel: 'Emotioneel', omschrijving: 'Emotionele intelligentie, zelfregulatie en het volgen van je interne kompas.', icoon: 'emotioneel' },
      ] },
      { blockType: 'quoteBand', stijl: 'navyBand', quote: 'Wanneer deze vier domeinen in samenhang functioneren, ontstaat Weerbaarheid als stevig fundament voor duurzame groei en krachtig leiderschap.', toonWaardedriehoek: true },
      { blockType: 'herkenningSplit', stijl: 'herkenning', kop: { voor: 'Herken je dit?' }, introZin: 'Voor veel van onze clienten zijn deze situaties de dagelijkse realiteit voordat ze bij ons komen:', items: [
        { tekst: 'Je blijft optimaal functioneren, maar het kost je steeds meer energie om je masker op te houden.' },
        { tekst: "Je ervaart een constante innerlijke onrust of frictie, zelfs wanneer je 'vrij' bent." },
        { tekst: 'De balans tussen je ambitieuze buitenwereld en je persoonlijke binnenwereld is volledig zoek.' },
        { tekst: 'Je voelt dat je potentieel hebt voor meer, maar je wordt geblokkeerd door onbewuste patronen.' },
      ], afsluiter: 'Dit hoeft niet je standaard te zijn. Er is een weg terug naar kalme kracht.', cta: { label: 'Plan een GRATIS kennismaking', doel: '/kennismaking' }, foto: m.herkenJeDit },
    ],
  })

  await maakPagina({
    titel: 'Methodiek', slug: 'methodiek',
    metaTitel: 'Ontdek de Methodiek',
    metaOmschrijving: 'De WIN-methodiek: Weerbaarheidstherapie. Integratief & psychofysiek, Lijf & Brein in lijn. Van Kennis naar Kracht, over vier domeinen van weerbaarheid.',
    hero: { type: 'paginaHero', kop: { voor: 'De', accent: 'Methodiek', na: 'achter Weerbaarheidstherapie' }, subtitel: 'Lijf & Brein in lijn • integratief & psychofysiek', foto: m.nimmerdor1, fotoFocus: 'center 28%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'introSplit', stijl: 'quoteTekstFoto', quote: 'Weerbaarheid is niet het afstoten van druk, maar het absorberen ervan vanuit een kalme kern.', alineas: [
        { tekst: 'Weerbaarheidstherapie is geen enkele techniek, maar een integratieve methodiek. Ze verweeft beproefde therapie- en coachingsvormen met geleefde ervaring uit verschillende (sub)culturen, breedtesport en topsport. De rode draad is telkens dezelfde: het hoofd (ratio), het hart (gevoel) en het lichaam (actie) weer laten samenwerken in plaats van tegenwerken.' },
        { tekst: 'De beweging is er een van **Kennis naar Kracht**: niet alleen begrijpen, maar het geleerde belichamen — in zelfbewustzijn, weerbaarheid en persoonlijk leiderschap.' },
      ], foto: m.reza1 },
      { blockType: 'kaartenGrid', stijl: 'zonderIcoon', kop: { voor: 'De vier domeinen van Weerbaarheid' }, introZin: 'De methodiek werkt niet op één vlak, maar op de integrale verbinding tussen vier essentiële domeinen.', afsluitQuote: 'Wanneer deze vier domeinen in samenhang functioneren, ontstaat Weerbaarheid als stevig fundament voor duurzame groei en krachtig leiderschap.', items: [
        { titel: 'Fysiek', omschrijving: 'Lichaamsbewustzijn, energiebeheer en het fysiek kunnen dragen van verantwoordelijkheid.', icoon: 'fysiek' },
        { titel: 'Mentaal', omschrijving: 'Cognitieve weerbaarheid, mindset en het vermogen om heldere keuzes te maken onder druk.', icoon: 'mentaal' },
        { titel: 'Sociaal', omschrijving: 'Verbinding, grenzen stellen en gezonde, effectieve professionele relaties.', icoon: 'sociaal' },
        { titel: 'Emotioneel', omschrijving: 'Emotionele intelligentie, zelfregulatie en het volgen van je interne kompas.', icoon: 'emotioneel' },
      ] },
      { blockType: 'kaartenGrid', stijl: 'methodes', kop: { voor: 'Het integratieve palet' }, introZin: 'Geen protocol, maar maatwerk. Uit een breed palet aan beproefde methodes wordt telkens gekozen wat past bij jouw situatie en het moment.' },
      { blockType: 'herkenningSplit', stijl: 'lijfBrein', kop: { voor: 'Lijf & Brein in lijn' }, alinea: 'Wat de methodiek onderscheidt van klassieke praat-coaching, is dat we niet bij het hoofd stoppen. Ratio, gevoel en actie moeten in samenhang functioneren — anders blijft inzicht een gedachte die nooit kracht wordt.', items: [
        { tekst: 'Herkennen van fysieke stress-signalen vóór ze blokkeren.' },
        { tekst: 'Psychofysieke training om mentale barrières te doorbreken.' },
        { tekst: 'Integratie van NLP en systemisch werk in de dagelijkse praktijk.' },
        { tekst: 'Van inzicht naar belichaming: het geleerde ga je voelen en doen.' },
      ], foto: m.lijfBrein },
      { blockType: 'ontwikkellijnBand', stijl: 'navyKaarten', kop: { voor: 'De WIN Ontwikkellijn' }, introZin: 'De methodiek is geen losse sessie, maar een opbouw. Vier fasen die op elkaar voortbouwen.', fasen: [
        { omschrijving: 'Het herstellen van de basis. Rust, overzicht en het stoppen van de energetische lekkage.' },
        { omschrijving: 'Het inbouwen van structuren en routines die jouw weerbaarheid dagelijks ondersteunen.' },
        { omschrijving: 'Groeien vanuit kracht. Het vergroten van je draaglast en het verfijnen van je impact.' },
        { omschrijving: 'Natuurlijk overwicht vanuit een geïntegreerd systeem. Rust in de storm.' },
      ] },
      { blockType: 'introSplit', stijl: 'wortels', eyebrow: 'De mentor achter de methodiek', kop: { voor: 'Reza' }, alineas: [
        { tekst: 'De methodiek is niet uit een boek gehaald, maar geleefd. Reza bouwt op meer dan 30 jaar praktijkervaring in leidinggeven en bestuursfuncties, opgedaan in verschillende (sub)culturen en in rollen binnen breedtesport en topsport.' },
        { tekst: 'Die ervaring is verankerd in internationale certificeringen in NLP, Weerbaarheidstherapie en mastercoaching — en steeds vertaald naar de vraag die telkens centraal staat: hoe zet je je kracht in vanuit gevoel, in het moment?' },
      ], blockquote: 'Bij WIN staan jouw wensen, grenzen en behoeften centraal. Wij bieden je veiligheid, begeleiding en ondersteuning waarmee je duurzame verbindingen opbouwt en versterkt.', foto: m.reza20 },
      { blockType: 'kaartenGrid', stijl: 'waardedriehoek', kop: { voor: 'Waar het uiteindelijk om draait' }, items: [
        { titel: 'Zin', omschrijving: 'Weer voelen waar je energie vandaan komt en waarom je doet wat je doet.' },
        { titel: 'Betekenis', omschrijving: 'Handelen vanuit een innerlijk kompas, niet vanuit de automatische piloot.' },
        { titel: 'Vrijheid', omschrijving: 'Kiezen vanuit een kalme kern, in plaats van reageren vanuit druk.' },
      ] },
      { blockType: 'ctaBand', stijl: 'navy', kop: { voor: 'Ervaar de methodiek zelf.' }, alinea: 'De beste manier om de methodiek te begrijpen is haar te voelen. Plan een vrijblijvende kennismaking en ontdek wat Lijf & Brein in lijn voor jou betekent.', cta: { label: 'Plan een kennismaking', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'Aanbod', slug: 'aanbod',
    metaTitel: 'Aanbod',
    metaOmschrijving: 'Bij WIN werken we op het snijvlak van psychologie en fysieke kracht. We helpen professionals, leiders en organisaties om frictie om te zetten in veerkracht.',
    hero: { type: 'paginaHero', kop: { voor: 'Aanbod' }, subtitel: 'Weerbaarheid ontwikkelen, verdiepen en verankeren', foto: m.nimmerdor9, fotoFocus: 'center 22%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'ontwikkellijnBand', stijl: 'cirkels', kop: { voor: 'De WIN Ontwikkellijn®' }, introZin: 'Van herstel naar meesterschap', fasen: [
        { omschrijving: 'De basis leggen voor fysiek en mentaal herstel.' },
        { omschrijving: 'Rust creeren in het systeem en grenzen leren hanteren.' },
        { omschrijving: 'Het vergroten van de draagkracht en effectiviteit.' },
        { omschrijving: 'Leven en werken vanuit authentieke, kalme kracht.' },
      ] },
      { blockType: 'dienstenKaarten' },
      { blockType: 'fotoLabelsSplit', stijl: 'begeleidingsvormen', kop: { voor: 'Vormen van begeleiding' }, alinea: 'De methode van Reza is integratief en psychofysiek. We bieden verschillende contexten aan waarin deze transformatie kan plaatsvinden.', items: [
        { groot: 'Individueel (1-op-1)', klein: 'Maximale focus op persoonlijke diepgang en vertrouwelijkheid.' },
        { groot: 'Groepstrajecten', klein: 'Leren van en met gelijkgestemden in een veilige setting.' },
        { groot: 'Incompany & Teams', klein: 'Versterken van de gezamenlijke veerkracht en communicatie.' },
      ], foto: m.reza11, fotoQuote: 'Lijf & Brein in lijn' },
      { blockType: 'ctaBand', stijl: 'cream', kop: { voor: 'Versterk je Weerbaarheid als fundament voor', accent: 'Groei en Leiderschap', na: 'in werk, prive en leven.' }, cta: { label: 'Plan een kennismaking', doel: '/kennismaking' }, disclaimer: 'Geheel vrijblijvend, gericht op jouw specifieke situatie.' },
    ],
  })

  await maakPagina({
    titel: 'Coaching', slug: 'coaching',
    metaTitel: 'Coaching',
    metaOmschrijving: 'Weerbaarheid als fundament voor Groei en Leiderschap. Lijf & Brein in lijn -- integratief & psychofysiek.',
    hero: { type: 'paginaHero', kop: { voor: 'Weerbaarheid als', accent: 'fundament', na: 'voor Groei en Leiderschap' }, subtitel: 'Lijf & Brein in lijn • integratief & psychofysiek', foto: m.nimmerdor2, fotoFocus: 'center 12%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'introSplit', stijl: 'quoteTekstFoto', quote: 'Je kunt blijven functioneren op pure wilskracht, maar tegen welke prijs?', alineas: [
        { tekst: "Veel professionals ervaren dat hun brein altijd 'aan' staat, terwijl hun lijf signalen van stress afgeeft die worden genegeerd. Uiteindelijk ontstaat er frictie. Bij WIN geloven we dat werkelijke impact pas ontstaat wanneer jouw interne systeem niet langer tegenwerkt, maar samenwerkt. Het in lijn brengen van Lijf & Brein is geen luxe, maar een noodzakelijk fundament voor duurzaam leiderschap." },
      ], foto: m.reza12 },
      { blockType: 'kaartenGrid', stijl: 'zonderIcoon', kop: { voor: 'Functioneren vanuit Weerbaarheid' }, introZin: 'Weerbaarheid is de integrale verbinding tussen vier essentiele domeinen.', items: [
        { titel: 'Fysiek', omschrijving: 'Belichaamde kracht, energiehuishouding en het fysiek kunnen dragen van verantwoordelijkheid.' },
        { titel: 'Mentaal', omschrijving: 'Focus, cognitieve flexibiliteit en het vermogen om heldere keuzes te maken onder druk.' },
        { titel: 'Sociaal', omschrijving: 'Verbinding met de omgeving, grenzen stellen en effectieve interactie met anderen.' },
        { titel: 'Emotioneel', omschrijving: 'Zelfregulatie, het begrijpen van interne signalen en emotionele stabiliteit.' },
      ] },
      { blockType: 'herkenningSplit', stijl: 'lijfBrein', kop: { voor: 'Lijf & Brein in lijn' }, alinea: 'Onze methodiek gaat verder dan traditionele praat-coaching. We werken integratief: het hoofd (ratio), het hart (gevoel) en het lichaam (actie) moeten in samenhang functioneren.', items: [
        { tekst: 'Herkennen van fysieke stress-signalen voor ze blokkeren.' },
        { tekst: 'Psychofysieke training om mentale barrieres te doorbreken.' },
        { tekst: 'Integratie van NLP en systemisch werk in de dagelijkse praktijk.' },
      ], foto: m.reza13 },
      { blockType: 'ontwikkellijnBand', stijl: 'bronzeKaarten', kop: { voor: 'De WIN Ontwikkellijn' }, fasen: [
        { omschrijving: 'Het herstellen van de basis. Rust, overzicht en het stoppen van de energetische lekkage.' },
        { omschrijving: 'Het inbouwen van structuren en routines die jouw weerbaarheid dagelijks ondersteunen.' },
        { omschrijving: 'Groeien vanuit kracht. Het vergroten van je draaglast en het verfijnen van je impact.' },
        { omschrijving: 'Natuurlijk overwicht vanuit een geintegreerd systeem. Rust in de storm.' },
      ] },
      { blockType: 'checklistKaart', kop: { voor: 'Voor wie is dit traject?' }, items: [
        { tekst: 'Professionals die op hoog niveau presteren maar intern frictie en uitputting ervaren.' },
        { tekst: 'Leiders die voelen dat ze op de automatische piloot draaien en de verbinding met hun essentie zoeken.' },
        { tekst: "Degenen die niet langer willen 'compenseren' met discipline, maar willen functioneren vanuit flow." },
        { tekst: 'Ondernemers die hun weerbaarheid als strategisch kapitaal zien voor hun organisatie.' },
      ] },
      { blockType: 'trajectenKaarten', kop: { voor: 'Onze Trajecten' }, kaarten: [
        { label: 'Individueel', titel: 'Solo trajecten', omschrijving: 'Maatwerk begeleiding volledig afgestemd op jouw specifieke context en doelen. Intensief en transformatief.', prijsTekst: 'Vanaf € 2.000,-', link: { label: 'Lees meer', doel: '/coaching' } },
        { label: 'Samen Groeien', titel: 'Groepstrajecten', omschrijving: 'Leer van en met gelijkgestemden in een veilige, high-end omgeving. Focus op gedeelde dynamieken.', prijsTekst: 'Op aanvraag', link: { label: 'Lees meer', doel: '/coaching' } },
        { label: 'Elite', titel: 'Mentorschap', omschrijving: 'Exclusieve 1-op-1 begeleiding voor leiders. Strategisch, diepgaand en beschikbaar op afroep.', prijsTekst: 'Vanaf € 5.000,- / 3 mnd', donker: true, link: { label: 'Lees meer', doel: '/mentorschap' } },
      ] },
      { blockType: 'genummerdeLijst', stijl: 'resultaat', kop: { voor: 'Het Resultaat' }, alinea: 'Investeren in weerbaarheid levert rendement op alle vlakken van je leven. Niet door harder te werken, maar door effectiever te zijn in je rust en je actie.', items: [
        { omschrijving: 'Meer rust, minder ruis in het hoofd.' },
        { omschrijving: 'Heldere focus en scherpe besluitvorming.' },
        { omschrijving: 'Stevige en natuurlijke positionering.' },
        { omschrijving: 'Optimale zelfregulatie onder hoogspanning.' },
      ] },
      { blockType: 'ctaBand', stijl: 'navy', kop: { voor: 'Versterk je Weerbaarheid als fundament voor Groei en Leiderschap.' }, alinea: 'Zet vandaag de eerste stap naar een geintegreerd systeem. Plan een vrijblijvende kennismaking.', cta: { label: 'Plan een kennismaking', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'Mentorschap', slug: 'mentorschap',
    metaTitel: 'Mentorschap',
    metaOmschrijving: 'Exclusief mentorschap voor ondernemers, leiders en professionals die eindverantwoordelijkheid dragen. Weerbaarheid als fundament voor Groei en Leiderschap.',
    hero: { type: 'paginaHero', kop: { voor: 'WIN Mentorschap' }, subtitel: 'Weerbaarheid als fundament voor Groei en Leiderschap', foto: m.reza14, fotoFocus: 'center 20%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'quoteBand', stijl: 'gecentreerdLicht', quote: 'Er komt een punt waarop inzicht niet meer voldoende is. Je hebt ervaring, je hebt verantwoordelijkheid, je weet hoe het werkt -- en toch merk je dat er momenten zijn waarop spanning oploopt, keuzes complexer worden en het steeds meer vraagt om **scherpte, stabiliteit en innerlijke regie**.' },
      { blockType: 'introSplit', stijl: 'miniKaarten', kop: { voor: 'Wanneer je merkt dat het anders moet.' }, alineas: [
        { tekst: "Functioneren onder constante druk is een vaardigheid, maar de prijs die je betaalt voor de 'always-on' stand kan te hoog worden. De verantwoordelijkheid die je draagt voor teams, organisaties of complexe trajecten vereist meer dan alleen management skills." },
        { tekst: 'Het vraagt om een belichaamde vorm van stabiliteit. Niet vanuit wilskracht alleen, maar vanuit een fundament dat staat als een huis, ook als het stormt.' },
      ], tegels: [
        { titel: 'Always-on druk', tekst: 'De constante ruis die nooit helemaal verdwijnt.' },
        { titel: 'Frictie', tekst: 'Wanneer weten wat je moet doen niet meer genoeg is.' },
      ] },
      { blockType: 'donkerPaneel', stijl: 'bronzeSkew', eyebrow: 'Exclusiviteit', kop: { voor: 'Dit is geen traject voor iedereen.' }, alinea: 'WIN Mentorschap is specifiek ontworpen voor ondernemers, leiders en professionals die eindverantwoordelijkheid dragen. Voor hen wiens beslissingen impact hebben op de levens van anderen en de stabiliteit van hun organisatie.', kolommen: [
        { titel: 'Wie je bent', items: [{ tekst: 'Ondernemer of Eindverantwoordelijke' }, { tekst: 'Senior Leadership' }, { tekst: 'High-impact professionals' }] },
        { titel: 'Wat je zoekt', items: [{ tekst: 'Werkelijke innerlijke rust' }, { tekst: 'Mentorschap op niveau' }, { tekst: 'Psychofysieke integratie' }] },
      ] },
      { blockType: 'introSplit', stijl: 'featureKaarten', kop: { voor: 'Wat mentorschap anders maakt.' }, alineas: [
        { tekst: 'Coaching gaat vaak over gedrag en doelen. Mentorschap bij WIN gaat dieper: we werken aan het fundament van jouw zijn. We brengen *denken, voelen en handelen* in lijn.' },
      ], tegels: [
        { titel: 'Psychofysiek', tekst: 'Je lichaam weet vaak eerder dan je brein dat de balans weg is. We gebruiken fysieke intelligentie als kompas.' },
        { titel: 'Integratief', tekst: 'Geen losse trucjes, maar een volledige integratie van methodieken (NLP, systemisch werk, therapie).' },
      ], foto: m.nimmerdor3 },
      { blockType: 'ontwikkellijnBand', stijl: 'verspringend', eyebrow: 'De WIN Methode', kop: { voor: 'De Ontwikkellijn' }, fasen: [
        { omschrijving: 'Terug naar de basis van je fysieke en mentale gesteldheid.' },
        { omschrijving: 'Borgen van rust en overzicht, ook in complexe situaties.' },
        { omschrijving: 'Uitbouwen van je vermogen om vanuit regie te handelen.' },
        { omschrijving: 'Leidinggeven vanuit een onwrikbaar innerlijk kompas.' },
      ] },
      { blockType: 'genummerdeLijst', stijl: 'oplevert', kop: { voor: 'Wat dit je oplevert.' }, items: [
        { titel: 'Rust en stabiliteit onder druk', omschrijving: 'Niet meer meegesleurd worden door de waan van de dag.' },
        { titel: 'Scherpte in besluitvorming', omschrijving: 'Keuzes maken vanuit helderheid in plaats van angst of noodzaak.' },
        { titel: 'Stevigheid in positionering', omschrijving: 'Authentiek en congruent aanwezig zijn in elke interactie.' },
        { titel: 'Duurzame energie', omschrijving: 'Effectief zijn zonder dat het ten koste gaat van je gezondheid of relaties.' },
      ], kaderQuote: 'Lijf & Brein in lijn', kaderOnderschrift: 'Reza (De Weerbaarheidsmentor®)' },
      { blockType: 'investeringBlok', eyebrow: 'Commitment', kop: { voor: 'Investering in Meesterschap' }, dienst: dienstMentorschap.id, prijsZin: 'De instap voor WIN Mentorschap start vanaf €5.000 voor een traject van 3 maanden.', rationale: 'Deze investering reflecteert de intensiteit, de 1-op-1 beschikbaarheid van Reza en de diepgaande transformatie van jouw professionele en persoonlijke fundament.' },
      { blockType: 'ctaBand', stijl: 'mentorschap', kop: { voor: 'Werk op het niveau waar het verschil daadwerkelijk wordt gemaakt.' }, cta: { label: 'Plan een kennismaking', doel: '/kennismaking' }, secundaireCta: { label: 'Of ontdek de methodiek', doel: '/methodiek' } },
    ],
  })

  await maakPagina({
    titel: 'Opleidingen', slug: 'opleidingen',
    metaTitel: 'Opleidingen',
    metaOmschrijving: 'Professionaliseren in integratief & psychofysiek werken voor Weerbaarheid, Groei & Leiderschap. WIN Opleidingen.',
    hero: { type: 'paginaHero', kop: { voor: 'Opleidingen' }, subtitel: 'Professionaliseren in integratief & psychofysiek werken voor Weerbaarheid • Groei & Leiderschap.', foto: m.nimmerdor4, fotoFocus: 'center 25%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'quoteBand', stijl: 'kaartGoudrand', quote: 'Veel professionals beschikken over kennis, vaardigheden en ervaring, maar missen het vermogen om **daadwerkelijk te begeleiden** wat er onder de oppervlakte speelt.' },
      { blockType: 'badgesRij', stijl: 'rollen', kop: { voor: 'Voor wie is dit bedoeld?' }, badges: [
        { label: 'Coaches' }, { label: 'Begeleiders' }, { label: 'Trainers' }, { label: 'Leidinggevenden' }, { label: 'HR Professionals' }, { label: 'Mensgericht' },
      ] },
      { blockType: 'bentoGrid', stijl: 'opleidingen', kaarten: [
        { titel: 'Weerbaarheidstherapie & -coaching', omschrijving: 'De kernmethodiek van WIN. Leer professionals begeleiden in het herstellen van de balans tussen lijf en brein door middel van integratieve interventies.' },
        { titel: 'NLP (wNLP)', omschrijving: 'De WIN-benadering van Neuro Linguistisch Programmeren. Communicatie, bewustwording en gedragsverandering met een focus op belichaamde aanwezigheid.' },
        { titel: 'Systemisch werk en opstellingen', omschrijving: 'Werken met de diepere dynamieken binnen systemen. Begrijp hoe onzichtbare krachten professioneel en persoonlijk functioneren beinvloeden.' },
        { titel: 'Integratief en psychofysiek werken', omschrijving: 'Lichaam, ervaring en bewustzijn samengebracht. Leer werken met fysieke signalen als ingang voor mentale transformatie.' },
      ] },
      { blockType: 'genummerdeLijst', stijl: 'leeraanpak', kop: { voor: 'Onze Leeraanpak:' }, accentregel: 'Ervaren boven weten', items: [
        { titel: 'Experiential learning', omschrijving: 'Geen droge theorie, maar diepgaande persoonlijke ervaring als basis voor professionele groei.' },
        { titel: 'Zelfregulatie', omschrijving: "Beheers de kunst van het 'midden' vinden, zodat je als baken van rust kunt fungeren voor anderen." },
        { titel: 'Werken met spanning', omschrijving: 'Leer frictie en weerstand niet te vermijden, maar in te zetten als bron voor transformatie.' },
      ], foto: m.nimmerdor5 },
      { blockType: 'kaartenGrid', stijl: 'witKader', items: [
        { titel: 'Verdiept inzicht', omschrijving: 'Begrijp de patronen die menselijk gedrag en weerbaarheid sturen.' },
        { titel: 'Begeleidings­vermogen', omschrijving: 'Interventies die werkelijk raken en blijvende verandering realiseren.' },
        { titel: 'Zelfregulatie', omschrijving: 'Belichaamde aanwezigheid en balans, ook onder intense druk.' },
        { titel: 'Congruent Handelen', omschrijving: 'Een professionele houding waar woord en daad volledig in lijn zijn.' },
      ] },
      { blockType: 'ctaBand', stijl: 'creamKader', kop: { voor: 'Klaar voor de volgende stap?' }, alinea: 'Ontwikkel jezelf als de professional die jij wilt zijn. Onze opleidingen starten op diverse momenten in het jaar op landgoed Nimmerdor.', cta: { label: 'Plan een kennismaking', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'Organisaties', slug: 'organisaties',
    metaTitel: 'Organisaties',
    metaOmschrijving: 'Weerbaarheid als fundament voor leiderschap, samenwerking en duurzame prestaties onder druk. WIN voor HR & C-Suite.',
    hero: { type: 'paginaHero', kop: { voor: 'Organisaties' }, subtitel: 'Weerbaarheid als fundament voor leiderschap, samenwerking en duurzame prestaties onder druk.', foto: m.nimmerdor6, fotoFocus: 'center 25%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'quoteBand', stijl: 'statementRand', quote: 'Organisaties functioneren via mensen. Wanneer mensen functioneren vanuit **spanning, aanpassing of onduidelijkheid**, vertaalt zich dat direct naar samenwerking, leiderschap en resultaten.' },
      { blockType: 'contrastKolommen', kolomLinks: { koptitel: 'Wanneer weerbaarheid ontbreekt', items: [
        { titel: 'Miscommunicatie', omschrijving: 'Indirect gedrag, aannames en ruis die de effectiviteit ondermijnen.' },
        { titel: 'Vermijding', omschrijving: 'Het niet aangaan van de noodzakelijke spanning of lastige gesprekken.' },
        { titel: 'Overbelasting', omschrijving: "Een 'always-on' cultuur zonder herstelvermogen of duidelijke grenzen." },
        { titel: 'Verlies van richting', omschrijving: 'Focus op de waan van de dag in plaats van strategische koers.' },
      ] }, kolomRechts: { koptitel: 'Versterkte weerbaarheid', items: [
        { titel: 'Innerlijke Rust', omschrijving: 'Handelen vanuit overzicht en kalmte, zelfs in crisissituaties.' },
        { titel: 'Positionering', omschrijving: 'Inname van de juiste rol en verantwoordelijkheid binnen de hierarchie.' },
        { titel: 'Effectieve Samenwerking', omschrijving: 'Constructief omgaan met verschillen en gezamenlijk eigenaarschap.' },
        { titel: 'Duurzaam Functioneren', omschrijving: 'Balans tussen prestatie en herstel voor langdurige inzetbaarheid.' },
      ] } },
      { blockType: 'pijlersDrieluik', kop: { voor: 'De Drie Pijlers van Weerbaarheid' }, introZin: 'De integrale aanpak voor een vitale organisatiecultuur.', pijlers: [
        { titel: 'Leiderschap', punten: [{ tekst: 'Spanning dragen' }, { tekst: 'Richting houden' }, { tekst: 'Helder communiceren' }, { tekst: 'Veiligheid creeren' }] },
        { titel: 'Teams en samenwerking', punten: [{ tekst: 'Verschillen hanteren' }, { tekst: 'Spanning reguleren' }, { tekst: 'Elkaar durven aanspreken' }, { tekst: 'Gezamenlijke verantwoordelijkheid' }] },
        { titel: 'Cultuur en veiligheid', punten: [{ tekst: 'Gedrag bepaalt cultuur' }, { tekst: 'Duidelijkheid biedt houvast' }, { tekst: 'Verantwoordelijkheid nemen' }, { tekst: 'Echte verbinding' }] },
      ] },
      { blockType: 'fotoLabelsSplit', stijl: 'incompany', kop: { voor: 'Incompany Trajecten' }, alinea: "Wij geloven niet in 'one size fits all'. Onze incompany trajecten zijn een synthese van wetenschappelijke inzichten, jarenlange praktijkervaring en direct toepasbare methodieken.", items: [
        { groot: 'Deep Insight', klein: 'Analyse van de onderstroom' },
        { groot: 'Actionable', klein: 'Directe toepassing op de werkvloer' },
      ], foto: m.nimmerdor7, badgeTekst: 'Maatwerk dat beklijft', link: { label: 'ONTDEK DE WIN METHODIEK', doel: '/methodiek' } },
      { blockType: 'donkerPaneel', stijl: 'navyCentered', eyebrow: 'Specialistische Expertise', kop: { voor: 'Rouw en Verlies in Organisaties' }, alinea: 'Verlies binnen een organisatie -- of het nu gaat om het overlijden van een collega, ingrijpende reorganisaties of persoonlijk verlies van medewerkers -- vraagt om een bijzondere vorm van weerbaarheid. Wij bieden een sensitieve doch professionele begeleiding voor leiders en teams in deze kritieke fasen.', kolommen: [
        { titel: 'Voor Leidinggevenden', tekst: 'Hoe faciliteer je een veilige bedding voor rouw terwijl de continuiteit van de organisatie gewaarborgd blijft?' },
        { titel: 'Team Dynamiek', tekst: 'Het herstellen van de onderlinge verbinding en het verwerken van gezamenlijk verlies.' },
      ] },
      { blockType: 'ctaBand', stijl: 'witKaart', kop: { voor: 'Versterk Weerbaarheid in leiderschap, teams en organisatie.' }, alinea: 'Neem contact op voor een strategisch gesprek over de uitdagingen binnen uw organisatie en hoe de WIN-methodiek een duurzaam verschil kan maken.', cta: { label: 'Plan een kennismaking', doel: '/kennismaking' }, contactTitel: 'Direct Contact?', contactSub: 'Neem contact op' },
    ],
  })

  await maakPagina({
    titel: 'Over WIN', slug: 'wininstituut',
    metaTitel: 'Over WIN',
    metaOmschrijving: 'WIN is een opleidings-, coaching- en kennisinstituut voor Weerbaarheid, Groei & Leiderschap. Integratief & Psychofysiek.',
    hero: { type: 'paginaHero', kop: { voor: 'WIN' }, subtitel: 'Opleiding, coaching en kennisinstituut voor Weerbaarheid, Groei, Leiderschap', foto: m.nimmerdor8, fotoFocus: 'center 22%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'introSplit', stijl: 'oorsprong', kop: { voor: 'Doorleefde ervaring, professionele praktijk en meegegeven waarden.' }, alineas: [
        { tekst: 'Het fundament van WIN ligt in het besef dat echte weerbaarheid niet enkel uit een boekje komt. Het is een optelsom van jarenlange ervaring in de frontlinie van menselijk gedrag, gecombineerd met wetenschappelijke inzichten en diepe persoonlijke transformatie.' },
        { tekst: "Reza's visie op het Weerbaarheids Instituut Nederland ontstond uit de overtuiging dat professionals en leiders die opereren onder hoge druk een plek nodig hebben waar 'Lijf & Brein' werkelijk in lijn worden gebracht." },
      ], quote: 'Weerbaarheid is niet het vermogen om de storm te overleven, maar de kunst om de storm te gebruiken als brandstof voor je volgende stap.', citeLabel: 'Reza, De Weerbaarheidsmentor®' },
      { blockType: 'kaartenGrid', stijl: 'domeinenRond', kop: { voor: 'Integratief & Psychofysiek' }, introZin: 'Niet symptoombestrijding, maar de onderliggende patronen aanpakken door de vier domeinen van mens-zijn te verenigen.', items: [
        { titel: 'Fysiek', omschrijving: 'Het lichaam als kompas. Biofeedback, belichaamde stress en fysieke paraatheid.' },
        { titel: 'Mentaal', omschrijving: 'Focus, mindset en de kracht van intentie. Het herprogrammeren van belemmerende overtuigingen.' },
        { titel: 'Sociaal', omschrijving: 'Interactie, grenzen stellen en verbinding. Hoe beweeg jij je ten opzichte van de ander?' },
        { titel: 'Emotioneel', omschrijving: 'Zelfregulatie en emotionele intelligentie. De onderstroom herkennen en sturen.' },
      ] },
      { blockType: 'herkenningSplit', stijl: 'labelBullets', kop: { voor: 'Lijf & Brein in lijn' }, alinea: 'Wanneer denken, voelen en handelen niet op een lijn zitten, ontstaat interne frictie. Dit vreet energie en belemmert je besluitvorming. WIN richt zich op het herstellen van deze interne coherentie.', items: [
        { titel: 'Onuitputtelijke Energie:', tekst: 'Stop het lekken van energie door interne conflicten.' },
        { titel: 'Absolute Helderheid:', tekst: 'Zie de essentie in complexe situaties.' },
        { titel: 'Besluitvaardigheid:', tekst: 'Handel vanuit je kern in plaats van reactiviteit.' },
      ], foto: m.reza15 },
      { blockType: 'progressieCirkels', kop: { voor: 'Weerbaarheid • Groei • Leiderschap' }, afsluitQuote: 'Eerst jezelf leiden, dan pas de ander.' },
      { blockType: 'badgesRij', stijl: 'doelgroepen', kop: { voor: 'Voor wie is het WIN?' }, alinea: "Wij werken met mensen die de lat hoog leggen voor zichzelf, maar merken dat de druk van de 'outside world' hun 'inside world' begint te domineren.", badges: [
        { label: 'Ondernemers' }, { label: 'Professionals' }, { label: 'Leidinggevenden' }, { label: 'Coaches & Trainers' }, { label: 'Organisaties & Teams' },
      ], foto: m.nimmerdor3 },
      { blockType: 'fotoKaartenRij', kaarten: [
        { titel: 'Coaching', omschrijving: 'Individuele en groepsgerichte begeleiding die tot de kern gaat. Voor transformatie op de lange termijn.', linkTekst: 'Ontdek Coaching', link: { label: 'Ontdek Coaching', doel: '/coaching' }, foto: m.nimmerdor2 },
        { titel: 'Opleidingen', omschrijving: 'Professionalisering voor coaches en trainers. Leer werken met de unieke WIN methodiek.', linkTekst: 'Ontdek Opleidingen', link: { label: 'Ontdek Opleidingen', doel: '/opleidingen' }, foto: m.nimmerdor4 },
        { titel: 'Organisaties', omschrijving: 'Voor leiders, teams en cultuur. Bouwen aan een weerbare organisatie die floreert onder druk.', linkTekst: 'Voor Organisaties', link: { label: 'Voor Organisaties', doel: '/organisaties' }, foto: m.nimmerdor6 },
      ] },
      { blockType: 'ctaBand', stijl: 'charcoal', kop: { voor: 'Versterk je Weerbaarheid.' }, alinea: 'Zet vandaag de eerste stap naar een leven en loopbaan in lijn.', cta: { label: 'Plan een kennismaking', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'De Weerbaarheidsmentor', slug: 'weerbaarheidsmentor',
    metaTitel: 'De Weerbaarheidsmentor',
    metaOmschrijving: 'Reza - De Weerbaarheidsmentor. Regie over Lijf & Brein. Integratief & psychofysiek werken aan Weerbaarheid, Groei & Leiderschap.',
    hero: { type: 'paginaHero', kop: { voor: 'De', accent: 'Weerbaarheidsmentor', na: '®' }, subtitel: 'Regie over Lijf & Brein', foto: m.nimmerdor18, fotoFocus: 'center 20%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'introSplit', stijl: 'gecentreerd', kop: { voor: 'Echte kracht ontstaat wanneer je stopt met overleven op karakter en begint te leiden vanuit', accent: 'innerlijke stabiliteit', na: '.' }, alineas: [
        { tekst: "In een wereld die altijd 'aan' staat, verliezen we vaak de verbinding met ons fundament. Mijn methodiek brengt jouw denken, voelen en handelen weer in een lijn. Geen losse vaardigheden, maar een diepgaande transformatie van binnenuit." },
      ] },
      { blockType: 'herkenningSplit', stijl: 'regie', kop: { voor: 'Voor wie de regie', accent: 'echt', na: 'wil pakken.' }, introZin: 'Herken jij jezelf in de frictie van het moderne presteren?', items: [
        { titel: 'Vastlopen in spanning', tekst: 'Je functioneert op hoog niveau, maar de interne druk wordt onhoudbaar.' },
        { titel: 'Presteren ten koste van energie', tekst: 'Successen voelen leeg omdat ze je fysiek en mentaal uitputten.' },
        { titel: 'Blijven analyseren zonder verandering', tekst: 'Je weet rationeel wat er moet gebeuren, maar je lichaam volgt niet.' },
        { titel: 'Verantwoordelijkheid met onrust', tekst: 'Je draagt grote lasten, maar ervaart intern een constante storm.' },
      ], foto: m.nimmerdor16, fotoQuote: 'Het bos van Nimmerdor is mijn buiten-praktijk, waar de natuur de spiegel is voor jouw innerlijke proces.' },
      { blockType: 'bentoGrid', stijl: 'watHetBrengt', kop: { voor: 'Lijf & Brein in lijn' }, subLabel: 'Wat de WIN-methodiek jou brengt', kaarten: [
        { titel: 'Rust & Stabiliteit', omschrijving: 'Een kalm zenuwstelsel, ongeacht de chaos om je heen.' },
        { titel: 'Helderheid in keuzes', omschrijving: 'Weten wat je te doen staat omdat je toegang hebt tot je volledige potentieel -- zowel cognitief als intuitief.' },
        { titel: 'Krachtig onder druk', omschrijving: 'Je verliest jezelf niet in de waan van de dag, maar blijft gepositioneerd in jouw eigen kracht en waarden.' },
        { titel: 'Regie over energie', omschrijving: 'Bewust sturen op je emoties, gedrag en vitale reserves.' },
      ] },
      { blockType: 'introSplit', stijl: 'cirkelfoto', eyebrow: 'De Methodiek', kop: { voor: 'De Basis van Leiderschap' }, alineas: [
        { tekst: 'Echte groei en leiderschap beginnen niet bij een nieuwe managementvaardigheid of een hippe tool. Het begint bij de basis: **Weerbaarheid**.' },
        { tekst: 'Mijn psychofysieke aanpak integreert de nieuwste inzichten uit de neuropsychologie met eeuwenoude wijsheid over lichaamsbewustzijn. We werken op de laag waar echte verandering beklijft.' },
      ], tegels: [
        { titel: 'Fundament', tekst: 'Lijf & Brein' },
        { titel: 'Impact', tekst: 'Groei & Vrijheid' },
      ], foto: m.reza18 },
      { blockType: 'introSplit', stijl: 'wortels', kop: { voor: 'De Wortels van', accent: 'Weerbaarheid' }, alineas: [
        { tekst: 'Mijn reis begon lang voordat ik coach werd. Als kind van een vader die me de waarde van discipline en innerlijke kracht bijbracht, leerde ik vroeg wat het betekent om te staan in de storm.' },
        { tekst: 'Weerbaarheid is voor mij geen theoretisch concept. Het is geleefde ervaring. Vanuit de fysieke training en jarenlange ervaring in crisis- en verandermanagement zag ik steeds hetzelfde patroon: wie zijn basis niet op orde heeft, verliest zichzelf in de complexiteit van de buitenwereld.' },
      ], blockquote: 'Ik help professionals de weg terug te vinden naar hun eigen kern, zodat ze weer kunnen leiden vanuit rust in plaats van onrust.', foto: m.reza20 },
      { blockType: 'badgesRij', stijl: 'expertise', kop: { voor: 'Ervaring en Expertise' }, badges: [
        { label: '35+ Jaar', subLabel: 'Ervaring' },
        { label: 'NLP Trainer', subLabel: 'Gecertificeerd' },
        { label: 'Psychofysiek', subLabel: 'Sinds 1993' },
        { label: 'Crisis/Change', subLabel: 'Management' },
        { label: 'Systeemwerk', subLabel: 'Samengesteld gezin' },
        { label: 'Organisaties', subLabel: 'Cultuur & Teams' },
      ] },
      { blockType: 'tabelSectie', kop: { voor: 'Domeinen van Transformatie' }, kolomkop1: 'Domein', kolomkop2: 'Focus & Impact', rijen: [
        { kolom1: 'Persoonlijke Ontwikkeling', kolom2: 'De weg naar binnen. Herstel van balans, verwerken van stress en het herontdekken van je authentieke kracht.' },
        { kolom1: '(Zelf)leiderschap', kolom2: 'Positionering vanuit rust. Helderheid in visie en krachtig handelen zonder jezelf te verliezen.' },
        { kolom1: 'Relationele Samenwerking', kolom2: 'Verbinding zonder verlies van autonomie. Systemisch kijken naar patronen in interactie.' },
        { kolom1: 'Sport & Performance', kolom2: 'De psychologie van de winnaar. Fysieke weerbaarheid vertalen naar mentale overmacht.' },
        { kolom1: 'Teams & Organisaties', kolom2: 'Collectieve weerbaarheid. Van reactieve cultuur naar proactief leiderschap binnen het hele systeem.' },
      ] },
      { blockType: 'ctaBand', stijl: 'navy', kop: { voor: 'Wil jij de regie terug en', accent: 'Lijf & Brein', na: 'duurzaam in lijn brengen?' }, alinea: 'Zet vandaag de eerste stap naar een leven en loopbaan vanuit kalme kracht.', cta: { label: 'Plan een kennismaking met De Weerbaarheidsmentor®', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'Kennisinstituut', slug: 'kennisinstituut',
    metaTitel: 'Kennisinstituut',
    metaOmschrijving: 'Het WIN Kennisinstituut: het fundament onder Weerbaarheidstherapie & -coaching. Methodiekontwikkeling, kennisvertaling en kwaliteitsborging.',
    hero: { type: 'paginaHero', kop: { voor: 'WIN Kennisinstituut' }, subtitel: 'Het fundament onder Weerbaarheidstherapie & -coaching', foto: m.nimmerdor11, fotoFocus: 'center 25%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'quoteBand', stijl: 'gecentreerdLicht', quote: 'WIN is een opleidings-, coaching- en kennisinstituut, gebouwd op meer dan 40 jaar doorleefde ervaring in Weerbaarheid.' },
      { blockType: 'introSplit', stijl: 'fotoLabelKaart', kop: { voor: 'Weerbaarheidstherapie & -coaching' }, alineas: [
        { tekst: 'Bij WIN gaan we verder dan cognitief inzicht. Echte verandering vindt plaats daar waar patronen ontstaan en zich nestelen: in de wisselwerking tussen psyche en fysiologie.' },
        { tekst: 'Het Kennisinstituut vormt de academische en empirische ruggengraat van onze methodiek. Wij werken op het snijvlak van neurologie, psychologie en systeemgericht werk om professionals te begeleiden naar duurzame weerbaarheid.' },
      ], quote: 'Wij werken daar waar patronen zichtbaar worden en verandering werkelijkheid is.', fotoKaartTekst: 'Lijf & Brein\nin lijn.', foto: m.nimmerdor12 },
      { blockType: 'kaartenGrid', stijl: 'zonderIcoon', kop: { voor: 'De Rol van het Kennisinstituut' }, introZin: 'De Pijlers', items: [
        { titel: 'Methodiekontwikkeling', omschrijving: 'Het voortdurend verfijnen en doorontwikkelen van de integratieve WIN-benadering, gebaseerd op de nieuwste wetenschappelijke inzichten en decennia aan praktijkervaring.' },
        { titel: 'Kennisvertaling', omschrijving: 'Complexe psychofysieke processen vertalen naar heldere, effectieve interventies die direct toepasbaar zijn in coaching- en therapietrajecten.' },
        { titel: 'Kwaliteit en borging', omschrijving: 'Bewaken van de diepgang en effectiviteit van de WIN-ontwikkellijn, zodat elke interventie bijdraagt aan het fundament van de client.' },
      ] },
      { blockType: 'calloutBand', kop: { voor: 'Diepgaande methodiek' }, alinea: 'Bezoek onze gespecialiseerde kennisbank voor een gedetailleerde uiteenzetting van de Weerbaarheidstherapie.', knopLabel: 'weerbaarheidstherapie.nl', externeUrl: 'https://weerbaarheidstherapie.nl' },
      { blockType: 'publicatiesGrid', kop: { voor: 'Inzichten & Publicaties' } },
      { blockType: 'quoteBand', stijl: 'navyTekst', kop: { voor: 'Samenwerking' }, quote: 'Het Kennisinstituut werkt samen met professionals, organisaties en partners om de kwaliteit van Weerbaarheid in Nederland naar een hoger plan te tillen. Wij geloven in de kracht van gedeelde expertise en interdisciplinaire dialoog.' },
      { blockType: 'ctaBand', stijl: 'cream', kop: { voor: 'Zet de eerste stap naar verdieping' }, alinea: 'Wilt u meer weten over onze methodiek of bent u geinteresseerd in een samenwerking met het WIN Kennisinstituut?', cta: { label: 'Neem contact op', doel: '/kennismaking' } },
    ],
  })

  await maakPagina({
    titel: 'Ontwikkellijn', slug: 'ontwikkellijn',
    metaTitel: 'De WIN Ontwikkellijn',
    metaOmschrijving: 'Van functioneren op wilskracht naar leven en leiden vanuit rust, kracht en regie. De vier fasen van transformatie bij WIN.',
    hero: { type: 'paginaHero', kop: { voor: 'De WIN', accent: 'Ontwikkellijn' }, subtitel: 'Van functioneren op wilskracht naar leven en leiden vanuit rust, kracht en regie.', foto: m.nimmerdor17, fotoFocus: 'center 22%', cta: { label: 'Gratis Kennismaking', doel: '/kennismaking' } },
    layout: [
      { blockType: 'introSplit', stijl: 'tweeKolomsTekst', eyebrow: 'Herstel de Samenhang', quote: 'Veel mensen functioneren ogenschijnlijk goed, maar doen dat op spanning, aanpassing of compensatie.', alineas: [
        { tekst: 'Binnen WIN werken we vanuit een integratieve en psychofysieke benadering waarin __Lijf & Brein__ opnieuw in lijn worden gebracht. Het is de weg terug naar je natuurlijke staat van weerbaarheid.' },
      ] },
      { blockType: 'ontwikkellijnBand', stijl: 'uitgebreid', kop: { voor: 'De Vier Fasen van Transformatie' }, introZin: 'Een gestructureerde weg van fundament naar authentiek leiderschap.', fasen: [
        { omschrijving: 'Je brengt Lijf & Brein opnieuw in lijn en herstelt de basis. Je krijgt zicht op patronen, reacties en automatische gedragingen. Hier ontstaat rust en stabiliteit.', subItems: [{ label: 'Inzicht in patronen' }, { label: 'Lichaamsbewustzijn' }] },
        { omschrijving: 'Je ontwikkelt draagkracht en zelfregulatie. Je leert spanning herkennen, dragen en reguleren zonder jezelf te verliezen.', subItems: [{ label: 'Emotieregulatie' }, { label: 'Stressbeheersing' }] },
        { omschrijving: 'Je ontwikkelt richting, positionering en besluitkracht. Je neemt meer ruimte in, maakt heldere keuzes vanuit vertrouwen.', subItems: [{ label: 'Grensbewaking' }, { label: 'Authenticiteit' }] },
        { omschrijving: 'Je integreert Weerbaarheid in hoe je leeft en werkt. Je functioneert vanuit samenhang, rust en kracht.', subItems: [{ label: 'Belichaamd leiden' }, { label: 'Impact & Rust' }] },
      ] },
      { blockType: 'introSplit', stijl: 'fullBleedFoto', kop: { voor: 'Integratief en', accent: 'Psychofysiek' }, alineas: [
        { tekst: 'Echte verandering vindt niet alleen plaats in je hoofd. Praten over spanning lost de spanning in je zenuwstelsel vaak niet op.' },
        { tekst: 'Onze methode gaat over wat je __voelt__ en wat je __lichaam toont__. We gebruiken het lijf als ingang om het brein te informeren, zodat handelen weer in lijn komt met je intenties.' },
      ], foto: m.reza22 },
      { blockType: 'kaartenGrid', stijl: 'voorWieTegels', kop: { voor: 'Voor wie is dit?' }, introZin: 'De WIN Ontwikkellijn is specifiek ontworpen voor professionals, ondernemers en leiders die voelen dat enkel *inzicht* niet meer volstaat. Je bent klaar om de stap te maken naar echte ontwikkeling in **denken, voelen en handelen**.', items: [
        { omschrijving: 'Je ervaart interne frictie ondanks je succes.' },
        { omschrijving: 'Je wilt leiden vanuit rust in plaats van druk.' },
        { omschrijving: 'Je zoekt naar een fundament dat echt beklijft.' },
      ] },
      { blockType: 'genummerdeLijst', stijl: 'fundamentLinks', kop: { voor: 'Het Fundament van al onze Diensten' }, alinea: 'De WIN Ontwikkellijn is de rode draad door alles wat we doen. Of je nu bij ons komt voor individuele groei of organisatiebrede verandering.', items: [
        { titel: 'Coaching', omschrijving: 'Individuele trajecten gericht op persoonlijke doorbraak.', link: { label: 'Coaching', doel: '/coaching' } },
        { titel: 'Opleidingen', omschrijving: 'Professionalisering voor coaches en trainers.', link: { label: 'Opleidingen', doel: '/opleidingen' } },
        { titel: 'Organisaties', omschrijving: 'Cultuurverandering en veerkrachtig leiderschap.', link: { label: 'Organisaties', doel: '/organisaties' } },
      ] },
      { blockType: 'ctaBand', stijl: 'goud', kop: { voor: 'Versterk je Weerbaarheid.' }, alinea: 'Plan een kennismaking en ontdek hoe de WIN Ontwikkellijn jouw pad kan verhelderen.', cta: { label: 'Plan Kennismaking', doel: '/kennismaking' }, secundaireCta: { label: 'Bekijk Aanbod', doel: '/aanbod' } },
    ],
  })

  await maakPagina({
    titel: 'Kennismaking', slug: 'kennismaking',
    metaTitel: 'Gratis Kennismaking',
    metaOmschrijving: 'Plan een vrijblijvende kennismaking met WIN. Een kalm gesprek over waar je staat en wat weerbaarheid voor jou kan betekenen.',
    hero: { type: 'kopHeader', pillLabel: 'WIN • Kennismaking', kop: { voor: 'Plan je', accent: 'gratis', na: 'kennismaking' }, introZin: 'Weerbaarheid begint met een eerste, eerlijk gesprek. Vrijblijvend en zonder verplichting -- we kijken samen of er een klik is en of de methodiek bij je past.', foto: m.nimmerdor1 },
    layout: [
      { blockType: 'verwachtingenLijst', kop: { voor: 'Wat je kunt verwachten' }, items: [
        { titel: 'Een kalm, open gesprek', tekst: 'Geen intakeformulier, geen verkooppraatje. We nemen de tijd om te horen waar je nu staat en wat er speelt.' },
        { titel: 'Herkenning, geen oordeel', tekst: 'We kijken samen naar de frictie tussen je buitenwereld en je binnenwereld -- en wat daaronder ligt.' },
        { titel: 'Een eerste richting', tekst: 'Je verlaat het gesprek met helderheid over of en hoe de weerbaarheidsmethodiek bij je past.' },
      ] },
    ],
  })

  log('Gebruikers...')
  const bestaand = await payload.find({ collection: 'gebruikers', limit: 1 })
  if (bestaand.totalDocs === 0) {
    const adminWachtwoord = crypto.randomBytes(9).toString('base64url')
    const editorWachtwoord = crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'gebruikers', data: { naam: 'Chris (admin)', email: 'info@co-creatie.ai', password: adminWachtwoord, rol: 'admin' } })
    await payload.create({ collection: 'gebruikers', data: { naam: 'Reza', email: 'reza@wininstituut.nl', password: editorWachtwoord, rol: 'editor' } })
    log(`LOGIN admin  → info@co-creatie.ai / ${adminWachtwoord}`)
    log(`LOGIN editor → reza@wininstituut.nl / ${editorWachtwoord}`)
    log('(wachtwoorden direct wijzigen via het admin-panel)')
  } else {
    log('Gebruikers bestaan al — overgeslagen.')
  }

  log('KLAAR ✓')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
