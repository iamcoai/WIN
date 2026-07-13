import type { Block } from 'payload'
import { alineaVeld, ctaVeld, fotoVeld, kopMetAccent } from '@/payload/fields'

/* ------------------------------------------------------------------ */
/* Gedeelde stukjes                                                    */
/* ------------------------------------------------------------------ */

const stijlSelect = (opties: { label: string; value: string }[], defaultValue: string) => ({
  name: 'stijl' as const,
  label: 'Stijl (goedgekeurde variant)',
  type: 'select' as const,
  options: opties,
  defaultValue,
  required: true,
})

const itemsArray = (
  name: string,
  label: string,
  velden: import('payload').Field[],
  minRows?: number,
  maxRows?: number,
) => ({
  name,
  label,
  type: 'array' as const,
  minRows,
  maxRows,
  fields: velden,
})

const titelOmschrijving: import('payload').Field[] = [
  { name: 'titel', label: 'Titel', type: 'text', maxLength: 80 },
  { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
]

/* ------------------------------------------------------------------ */
/* 1. introSplit — tekst + beeld, alle intro-achtige secties           */
/* ------------------------------------------------------------------ */

export const IntroSplit: Block = {
  slug: 'introSplit',
  interfaceName: 'IntroSplitBlok',
  labels: { singular: 'Intro-sectie (tekst + foto)', plural: 'Intro-secties' },
  fields: [
    stijlSelect(
      [
        { label: 'Home-intro (foto rechts + gouden quote-kaart)', value: 'homeIntro' },
        { label: 'Quote boven tekst, foto rechts (methodiek/coaching)', value: 'quoteTekstFoto' },
        { label: 'Oorsprong (tekst links, quote-kaart rechts)', value: 'oorsprong' },
        { label: 'Foto links met goud label-kaart (kennisinstituut)', value: 'fotoLabelKaart' },
        { label: 'Cirkelfoto links (basis van leiderschap)', value: 'cirkelfoto' },
        { label: 'Wortels (foto rechts, blockquote in tekst)', value: 'wortels' },
        { label: 'Mini-kaarten rechts (mentorschap)', value: 'miniKaarten' },
        { label: 'Feature-kaarten rechts (mentorschap "anders maakt")', value: 'featureKaarten' },
        { label: 'Twee koloms tekst (ontwikkellijn-intro)', value: 'tweeKolomsTekst' },
        { label: 'Full-bleed foto rechts (ontwikkellijn)', value: 'fullBleedFoto' },
        { label: 'Gecentreerde intro-tekst (mentor/kennisinstituut)', value: 'gecentreerd' },
      ],
      'quoteTekstFoto',
    ),
    { name: 'eyebrow', label: 'Klein label boven de kop', type: 'text', maxLength: 60 },
    kopMetAccent('kop', 'Kop'),
    alineaVeld('quote', 'Quote (cursief, boven of naast de tekst)'),
    itemsArray('alineas', 'Alinea’s', [alineaVeld('tekst', 'Alinea', true)], 0, 4),
    alineaVeld('blockquote', 'Uitgelichte quote (met gouden rand)'),
    { name: 'citeLabel', label: 'Quote-ondertekening (bv. "— Reza")', type: 'text', maxLength: 60 },
    fotoVeld('foto', 'Foto'),
    alineaVeld('fotoKaartTekst', 'Tekst op de kaart bij de foto'),
    itemsArray(
      'tegels',
      'Kleine tegels / mini-kaarten',
      [
        { name: 'titel', label: 'Titel', type: 'text', maxLength: 60 },
        { name: 'tekst', label: 'Tekst', type: 'textarea' },
      ],
      0,
      2,
    ),
    itemsArray('bullets', 'Bullets (met gouden check)', [
      { name: 'label', label: 'Vet label (optioneel)', type: 'text', maxLength: 60 },
      { name: 'tekst', label: 'Tekst', type: 'text', maxLength: 200 },
    ], 0, 5),
  ],
}

/* ------------------------------------------------------------------ */
/* 2. kaartenGrid — FeatureCard-rasters                                */
/* ------------------------------------------------------------------ */

export const KaartenGrid: Block = {
  slug: 'kaartenGrid',
  interfaceName: 'KaartenGridBlok',
  labels: { singular: 'Kaarten-raster', plural: 'Kaarten-rasters' },
  fields: [
    stijlSelect(
      [
        { label: '4 domeinen (met iconen)', value: 'domeinen' },
        { label: 'Kaarten zonder icoon (gouden streep)', value: 'zonderIcoon' },
        { label: 'Waardedriehoek (3 witte kaarten, goud woord)', value: 'waardedriehoek' },
        { label: 'Domeinen-variant Over WIN (ronde iconen)', value: 'domeinenRond' },
        { label: 'Uit collectie Methodes (integratief palet)', value: 'methodes' },
        { label: 'In wit kader (opleidingen-resultaten)', value: 'witKader' },
        { label: 'Voor wie-tegels met check (ontwikkellijn)', value: 'voorWieTegels' },
      ],
      'zonderIcoon',
    ),
    kopMetAccent('kop', 'Sectiekop'),
    alineaVeld('introZin', 'Introzin onder de kop'),
    alineaVeld('afsluitQuote', 'Afsluitende quote onder het raster'),
    itemsArray('items', 'Kaarten', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 60 },
      { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
      {
        name: 'icoon',
        label: 'Icoon',
        type: 'select',
        options: ['fysiek', 'mentaal', 'sociaal', 'emotioneel', 'ster', 'geen'].map((v) => ({
          label: v,
          value: v,
        })),
        defaultValue: 'geen',
      },
    ], 0, 8),
  ],
}

/* ------------------------------------------------------------------ */
/* 3. quoteBand — statement/quote-secties                              */
/* ------------------------------------------------------------------ */

export const QuoteBand: Block = {
  slug: 'quoteBand',
  interfaceName: 'QuoteBandBlok',
  labels: { singular: 'Quote-band', plural: 'Quote-banden' },
  fields: [
    stijlSelect(
      [
        { label: 'Navy band (home-statement)', value: 'navyBand' },
        { label: 'Kaart met gouden rand links (opleidingen)', value: 'kaartGoudrand' },
        { label: 'Gecentreerd licht (mentorschap-intro)', value: 'gecentreerdLicht' },
        { label: 'Statement met gouden rand links (organisaties)', value: 'statementRand' },
        { label: 'Navy band met tekst (samenwerking)', value: 'navyTekst' },
      ],
      'navyBand',
    ),
    kopMetAccent('kop', 'Kop (alleen bij tekst-variant)'),
    alineaVeld('quote', 'Quote / statement', true),
    { name: 'accentDeel', label: 'Deel van de quote in goud', type: 'text', maxLength: 120 },
    {
      name: 'toonWaardedriehoek',
      label: 'Toon Zin · Betekenis · Vrijheid eronder',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 4. herkenningSplit — checklist + foto                               */
/* ------------------------------------------------------------------ */

export const HerkenningSplit: Block = {
  slug: 'herkenningSplit',
  interfaceName: 'HerkenningSplitBlok',
  labels: { singular: 'Herkenning / checklist + foto', plural: 'Herkenning-secties' },
  fields: [
    stijlSelect(
      [
        { label: 'Witte kaart met foto rechts (Herken je dit?)', value: 'herkenning' },
        { label: 'Lijf & Brein (foto links, bullets rechts)', value: 'lijfBrein' },
        { label: 'Regie-lijst met foto en quote-kaart (mentor)', value: 'regie' },
        { label: 'Bullets met vet label (Over WIN)', value: 'labelBullets' },
      ],
      'lijfBrein',
    ),
    kopMetAccent('kop', 'Kop'),
    alineaVeld('introZin', 'Introzin'),
    alineaVeld('alinea', 'Alinea onder de kop'),
    itemsArray('items', 'Checklist-items', [
      { name: 'titel', label: 'Vet label (optioneel)', type: 'text', maxLength: 80 },
      { name: 'tekst', label: 'Tekst', type: 'textarea' },
    ], 1, 5),
    alineaVeld('afsluiter', 'Afsluitende zin (cursief)'),
    ctaVeld('cta', 'Knop (optioneel)'),
    fotoVeld('foto', 'Foto'),
    alineaVeld('fotoQuote', 'Quote op kaart bij de foto'),
  ],
}

/* ------------------------------------------------------------------ */
/* 5. ontwikkellijnBand — de 4 fasen, 5 varianten                      */
/* ------------------------------------------------------------------ */

export const OntwikkellijnBand: Block = {
  slug: 'ontwikkellijnBand',
  interfaceName: 'OntwikkellijnBandBlok',
  labels: { singular: 'Ontwikkellijn (4 fasen)', plural: 'Ontwikkellijn-secties' },
  fields: [
    stijlSelect(
      [
        { label: 'Navy kaarten (methodiek)', value: 'navyKaarten' },
        { label: 'Bronze kaarten (coaching)', value: 'bronzeKaarten' },
        { label: 'Cirkels op gouden lijn (aanbod)', value: 'cirkels' },
        { label: 'Verspringende witte kaarten (mentorschap)', value: 'verspringend' },
        { label: 'Uitgebreid met sub-items (ontwikkellijn-pagina)', value: 'uitgebreid' },
      ],
      'navyKaarten',
    ),
    kopMetAccent('kop', 'Kop'),
    { name: 'eyebrow', label: 'Klein label boven de kop', type: 'text', maxLength: 60 },
    alineaVeld('introZin', 'Introzin'),
    {
      name: 'fasen',
      label: 'De vier fasen (titels staan vast: Fundamenteren · Stabiliseren · Versterken · Leiderschap)',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      fields: [
        { name: 'omschrijving', label: 'Omschrijving', type: 'textarea', required: true },
        itemsArray('subItems', 'Sub-punten (alleen uitgebreide variant)', [
          { name: 'label', label: 'Label', type: 'text', maxLength: 40 },
        ], 0, 2),
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 6-8. diensten / trajecten / checklist-kaart                         */
/* ------------------------------------------------------------------ */

export const DienstenKaarten: Block = {
  slug: 'dienstenKaarten',
  interfaceName: 'DienstenKaartenBlok',
  labels: { singular: 'Diensten-kaarten (uit Diensten & Prijzen)', plural: 'Diensten-kaarten' },
  fields: [
    {
      name: 'info',
      type: 'text',
      label: 'ℹ️ De kaarten komen uit Bouwstenen → Diensten & Prijzen',
      admin: { readOnly: true },
    },
  ],
}

export const TrajectenKaarten: Block = {
  slug: 'trajectenKaarten',
  interfaceName: 'TrajectenKaartenBlok',
  labels: { singular: 'Trajecten-kaarten (coaching)', plural: 'Trajecten-kaarten' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    itemsArray('kaarten', 'Kaarten', [
      { name: 'label', label: 'Klein label (bv. "Individueel")', type: 'text', maxLength: 30 },
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 50 },
      { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
      {
        name: 'dienst',
        label: 'Prijs uit dienst (optioneel — anders prijstekst hieronder)',
        type: 'relationship',
        relationTo: 'diensten',
      },
      { name: 'prijsTekst', label: 'Prijstekst (bv. "Op aanvraag")', type: 'text', maxLength: 50 },
      {
        name: 'donker',
        label: 'Donkere (navy) uitgelichte kaart',
        type: 'checkbox',
        defaultValue: false,
      },
      ctaVeld('link', 'Lees meer-link'),
    ], 3, 3),
  ],
}

export const ChecklistKaart: Block = {
  slug: 'checklistKaart',
  interfaceName: 'ChecklistKaartBlok',
  labels: { singular: 'Checklist-kaart (voor wie)', plural: 'Checklist-kaarten' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    itemsArray('items', 'Items', [{ name: 'tekst', label: 'Tekst', type: 'textarea', required: true }], 3, 5),
  ],
}

/* ------------------------------------------------------------------ */
/* 9-12. organisaties-secties + donker paneel                          */
/* ------------------------------------------------------------------ */

export const ContrastKolommen: Block = {
  slug: 'contrastKolommen',
  interfaceName: 'ContrastKolommenBlok',
  labels: { singular: 'Contrast-kolommen (probleem/oplossing)', plural: 'Contrast-kolommen' },
  fields: [
    {
      name: 'kolomLinks',
      label: 'Linkerkolom (wanneer het ontbreekt)',
      type: 'group',
      fields: [
        { name: 'koptitel', label: 'Koptitel', type: 'text', maxLength: 60 },
        itemsArray('items', 'Items', titelOmschrijving, 4, 4),
      ],
    },
    {
      name: 'kolomRechts',
      label: 'Rechterkolom (versterkt)',
      type: 'group',
      fields: [
        { name: 'koptitel', label: 'Koptitel', type: 'text', maxLength: 60 },
        itemsArray('items', 'Items', titelOmschrijving, 4, 4),
      ],
    },
  ],
}

export const PijlersDrieluik: Block = {
  slug: 'pijlersDrieluik',
  interfaceName: 'PijlersDrieluikBlok',
  labels: { singular: 'Drie pijlers met puntenlijsten', plural: 'Pijler-drieluiken' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    alineaVeld('introZin', 'Introzin'),
    itemsArray('pijlers', 'Pijlers', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 60 },
      itemsArray('punten', 'Punten', [{ name: 'tekst', label: 'Punt', type: 'text', maxLength: 60 }], 4, 4),
    ], 3, 3),
  ],
}

export const FotoLabelsSplit: Block = {
  slug: 'fotoLabelsSplit',
  interfaceName: 'FotoLabelsSplitBlok',
  labels: { singular: 'Foto + labels (incompany / begeleidingsvormen)', plural: 'Foto + labels-secties' },
  fields: [
    stijlSelect(
      [
        { label: 'Incompany (foto links, labels groot/klein)', value: 'incompany' },
        { label: 'Begeleidingsvormen (navy, checklijst + foto rechts)', value: 'begeleidingsvormen' },
      ],
      'incompany',
    ),
    kopMetAccent('kop', 'Kop'),
    alineaVeld('alinea', 'Alinea'),
    itemsArray('items', 'Labels / vormen', [
      { name: 'groot', label: 'Grote tekst / titel', type: 'text', maxLength: 60 },
      { name: 'klein', label: 'Kleine tekst / omschrijving', type: 'textarea' },
    ], 2, 3),
    fotoVeld('foto', 'Foto'),
    { name: 'badgeTekst', label: 'Tekst op de foto-badge', type: 'text', maxLength: 60 },
    alineaVeld('fotoQuote', 'Quote op de foto'),
    ctaVeld('link', 'Link onderaan (optioneel)'),
  ],
}

export const DonkerPaneel: Block = {
  slug: 'donkerPaneel',
  interfaceName: 'DonkerPaneelBlok',
  labels: { singular: 'Donker paneel (exclusiviteit / rouw & verlies)', plural: 'Donkere panelen' },
  fields: [
    stijlSelect(
      [
        { label: 'Bronze met schuine vlak (mentorschap)', value: 'bronzeSkew' },
        { label: 'Navy gecentreerd (rouw & verlies)', value: 'navyCentered' },
      ],
      'navyCentered',
    ),
    { name: 'eyebrow', label: 'Klein goud label', type: 'text', maxLength: 60 },
    kopMetAccent('kop', 'Kop'),
    alineaVeld('alinea', 'Alinea'),
    itemsArray('kolommen', 'Kolommen / kaarten', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 60 },
      alineaVeld('tekst', 'Tekst (of items hieronder)'),
      itemsArray('items', 'Lijst-items', [{ name: 'tekst', label: 'Item', type: 'text', maxLength: 80 }], 0, 4),
    ], 0, 2),
  ],
}

/* ------------------------------------------------------------------ */
/* 13-18. bento / lijsten / badges / tabel / progressie / fotokaarten  */
/* ------------------------------------------------------------------ */

export const BentoGrid: Block = {
  slug: 'bentoGrid',
  interfaceName: 'BentoGridBlok',
  labels: { singular: 'Bento-raster (4 kaarten)', plural: 'Bento-rasters' },
  fields: [
    stijlSelect(
      [
        { label: 'Opleidingsgebieden (navy/wit/goud)', value: 'opleidingen' },
        { label: 'Wat het brengt (navy band, donkere kaarten)', value: 'watHetBrengt' },
      ],
      'opleidingen',
    ),
    kopMetAccent('kop', 'Kop'),
    { name: 'subLabel', label: 'Sub-label (goud, boven of onder kop)', type: 'text', maxLength: 80 },
    itemsArray('kaarten', 'Kaarten', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 80 },
      { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
    ], 4, 4),
  ],
}

export const GenummerdeLijst: Block = {
  slug: 'genummerdeLijst',
  interfaceName: 'GenummerdeLijstBlok',
  labels: { singular: 'Genummerde lijst (resultaat / leeraanpak)', plural: 'Genummerde lijsten' },
  fields: [
    stijlSelect(
      [
        { label: 'Resultaat (2 koloms, nummers + lijnen)', value: 'resultaat' },
        { label: 'Leeraanpak (navy, cirkelfoto rechts)', value: 'leeraanpak' },
        { label: 'Oplevert (navy, checks + quote-kader)', value: 'oplevert' },
        { label: 'Fundament-links (navy, 3 dienst-links)', value: 'fundamentLinks' },
      ],
      'resultaat',
    ),
    kopMetAccent('kop', 'Kop'),
    { name: 'accentregel', label: 'Accentregel (cursief goud)', type: 'text', maxLength: 80 },
    alineaVeld('alinea', 'Alinea'),
    itemsArray('items', 'Items', [
      { name: 'titel', label: 'Titel (optioneel)', type: 'text', maxLength: 80 },
      { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
      ctaVeld('link', 'Link (alleen fundament-variant)'),
    ], 3, 4),
    fotoVeld('foto', 'Foto (alleen leeraanpak)'),
    alineaVeld('kaderQuote', 'Quote in het kader (alleen oplevert)'),
    { name: 'kaderOnderschrift', label: 'Onderschrift bij de quote', type: 'text', maxLength: 80 },
  ],
}

export const BadgesRij: Block = {
  slug: 'badgesRij',
  interfaceName: 'BadgesRijBlok',
  labels: { singular: 'Badges-rij (expertise / rollen / doelgroepen)', plural: 'Badges-rijen' },
  fields: [
    stijlSelect(
      [
        { label: 'Expertise-badges (cirkel + ster)', value: 'expertise' },
        { label: 'Rollen (opleidingen: voor wie)', value: 'rollen' },
        { label: 'Doelgroep-tegels met iconen (Over WIN)', value: 'doelgroepen' },
      ],
      'expertise',
    ),
    kopMetAccent('kop', 'Kop'),
    alineaVeld('alinea', 'Alinea'),
    fotoVeld('foto', 'Foto (alleen doelgroepen-variant)'),
    itemsArray('badges', 'Badges', [
      { name: 'label', label: 'Label', type: 'text', maxLength: 40 },
      { name: 'subLabel', label: 'Sub-label', type: 'text', maxLength: 40 },
    ], 4, 8),
  ],
}

export const TabelSectie: Block = {
  slug: 'tabelSectie',
  interfaceName: 'TabelSectieBlok',
  labels: { singular: 'Tabel (domeinen van transformatie)', plural: 'Tabellen' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    { name: 'kolomkop1', label: 'Kolomkop links', type: 'text', maxLength: 40 },
    { name: 'kolomkop2', label: 'Kolomkop rechts', type: 'text', maxLength: 40 },
    itemsArray('rijen', 'Rijen', [
      { name: 'kolom1', label: 'Links (vet)', type: 'text', maxLength: 80 },
      { name: 'kolom2', label: 'Rechts (cursief)', type: 'textarea' },
    ], 3, 8),
  ],
}

export const ProgressieCirkels: Block = {
  slug: 'progressieCirkels',
  interfaceName: 'ProgressieCirkelsBlok',
  labels: { singular: 'Progressie-cirkels (Weerbaarheid → Groei → Leiderschap)', plural: 'Progressie-cirkels' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    alineaVeld('afsluitQuote', 'Afsluitende quote'),
  ],
}

export const FotoKaartenRij: Block = {
  slug: 'fotoKaartenRij',
  interfaceName: 'FotoKaartenRijBlok',
  labels: { singular: 'Foto-kaarten (3 pijlers met foto)', plural: 'Foto-kaarten-rijen' },
  fields: [
    itemsArray('kaarten', 'Kaarten', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 40 },
      { name: 'omschrijving', label: 'Omschrijving', type: 'textarea' },
      { name: 'linkTekst', label: 'Linktekst', type: 'text', maxLength: 40 },
      ctaVeld('link', 'Link'),
      fotoVeld('foto', 'Foto'),
    ], 3, 3),
  ],
}

/* ------------------------------------------------------------------ */
/* 19-24. publicaties / callout / investering / kennismaking / cta     */
/* ------------------------------------------------------------------ */

export const PublicatiesGrid: Block = {
  slug: 'publicatiesGrid',
  interfaceName: 'PublicatiesGridBlok',
  labels: { singular: 'Publicaties-raster (uit Publicaties)', plural: 'Publicaties-rasters' },
  fields: [kopMetAccent('kop', 'Kop')],
}

export const CalloutBand: Block = {
  slug: 'calloutBand',
  interfaceName: 'CalloutBandBlok',
  labels: { singular: 'Callout-band (externe link)', plural: 'Callout-banden' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    alineaVeld('alinea', 'Alinea'),
    { name: 'knopLabel', label: 'Knoptekst', type: 'text', maxLength: 40 },
    {
      name: 'externeUrl',
      label: 'Externe URL (alleen door admin te wijzigen)',
      type: 'text',
      access: {
        update: ({ req: { user } }) => (user as { rol?: string } | null)?.rol === 'admin',
      },
    },
  ],
}

export const InvesteringBlok: Block = {
  slug: 'investeringBlok',
  interfaceName: 'InvesteringBlok',
  labels: { singular: 'Investering (prijs uit dienst)', plural: 'Investering-blokken' },
  fields: [
    { name: 'eyebrow', label: 'Klein goud label', type: 'text', maxLength: 40 },
    kopMetAccent('kop', 'Kop'),
    {
      name: 'dienst',
      label: 'Dienst (voor de prijsregel)',
      type: 'relationship',
      relationTo: 'diensten',
    },
    alineaVeld('prijsZin', 'Prijszin — gebruik {prijs} waar de prijs moet komen'),
    alineaVeld('rationale', 'Toelichting onder de prijs'),
  ],
}

export const VerwachtingenLijst: Block = {
  slug: 'verwachtingenLijst',
  interfaceName: 'VerwachtingenLijstBlok',
  labels: { singular: 'Verwachtingen-lijst (kennismaking)', plural: 'Verwachtingen-lijsten' },
  fields: [
    kopMetAccent('kop', 'Kop'),
    itemsArray('items', 'Verwachtingen', [
      { name: 'titel', label: 'Titel', type: 'text', maxLength: 60 },
      { name: 'tekst', label: 'Tekst', type: 'textarea' },
    ], 3, 3),
  ],
}

export const AgendaPlaceholder: Block = {
  slug: 'agendaPlaceholder',
  interfaceName: 'AgendaPlaceholderBlok',
  labels: { singular: 'Agenda-placeholder', plural: 'Agenda-placeholders' },
  fields: [
    { name: 'kopTekst', label: 'Kop', type: 'text', maxLength: 60 },
    alineaVeld('tekst', 'Tekst'),
    { name: 'statusLabel', label: 'Status-label', type: 'text', maxLength: 40 },
  ],
}

export const Booking: Block = {
  slug: 'booking',
  interfaceName: 'BookingBlok',
  labels: { singular: 'Boeken / Kennismaking', plural: 'Boeken / Kennismaking' },
  fields: [
    {
      name: 'intro',
      label: 'Introtekst boven het boekingsformulier',
      type: 'textarea',
      defaultValue: 'Plan direct een gratis kennismaking van 30 minuten.',
      admin: {
        description:
          'De beschikbaarheid en de formuliervelden komen uit het platform-dashboard — hier stel je alleen de introtekst in.',
      },
    },
  ],
}

export const CtaBand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlok',
  labels: { singular: 'CTA-band (eind-sectie)', plural: 'CTA-banden' },
  fields: [
    stijlSelect(
      [
        { label: 'Navy', value: 'navy' },
        { label: 'Goud', value: 'goud' },
        { label: 'Cream', value: 'cream' },
        { label: 'Cream met goud kader (opleidingen)', value: 'creamKader' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Witte kaart met contact-paneel (organisaties)', value: 'witKaart' },
        { label: 'Mentorschap (grote kop, hoekige knop)', value: 'mentorschap' },
      ],
      'navy',
    ),
    kopMetAccent('kop', 'Kop'),
    alineaVeld('alinea', 'Alinea onder de kop'),
    ctaVeld('cta', 'Knop'),
    ctaVeld('secundaireCta', 'Tweede knop / link (optioneel)'),
    { name: 'secundaireTekst', label: 'Tekst tweede link (als geen knop)', type: 'text', maxLength: 60 },
    alineaVeld('disclaimer', 'Kleine tekst onder de knop'),
    { name: 'contactTitel', label: 'Contact-paneel titel (wit-kaart variant)', type: 'text', maxLength: 40 },
    { name: 'contactSub', label: 'Contact-paneel subtekst', type: 'text', maxLength: 60 },
  ],
}

export const alleBlokken: Block[] = [
  IntroSplit,
  KaartenGrid,
  QuoteBand,
  HerkenningSplit,
  OntwikkellijnBand,
  DienstenKaarten,
  TrajectenKaarten,
  ChecklistKaart,
  ContrastKolommen,
  PijlersDrieluik,
  FotoLabelsSplit,
  DonkerPaneel,
  BentoGrid,
  GenummerdeLijst,
  BadgesRij,
  TabelSectie,
  ProgressieCirkels,
  FotoKaartenRij,
  PublicatiesGrid,
  CalloutBand,
  InvesteringBlok,
  VerwachtingenLijst,
  AgendaPlaceholder,
  Booking,
  CtaBand,
]
