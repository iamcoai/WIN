import type { Pagina } from '@/payload-types'
import { Booking } from '@/blocks/components/Booking'
import { IntroSplit } from '@/blocks/components/IntroSplit'
import { BadgesRij, BentoGrid, FotoKaartenRij, KaartenGrid, PublicatiesGrid } from '@/blocks/components/Grids'
import {
  CalloutBand,
  CtaBand,
  DonkerPaneel,
  OntwikkellijnBand,
  ProgressieCirkels,
  QuoteBand,
} from '@/blocks/components/Banden'
import {
  AgendaPlaceholder,
  ChecklistKaart,
  ContrastKolommen,
  DienstenKaarten,
  FotoLabelsSplit,
  GenummerdeLijst,
  HerkenningSplit,
  InvesteringBlok,
  PijlersDrieluik,
  TabelSectie,
  TrajectenKaarten,
  VerwachtingenLijst,
} from '@/blocks/components/Secties'

type Blok = NonNullable<Pagina['layout']>[number]

export function RenderBlocks({ blocks }: { blocks?: Pagina['layout'] }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock key={block.id ?? `${block.blockType}-${i}`} block={block} />
      ))}
    </>
  )
}

function RenderBlock({ block }: { block: Blok }) {
  switch (block.blockType) {
    case 'introSplit':
      return <IntroSplit {...block} />
    case 'kaartenGrid':
      return <KaartenGrid {...block} />
    case 'quoteBand':
      return <QuoteBand {...block} />
    case 'herkenningSplit':
      return <HerkenningSplit {...block} />
    case 'ontwikkellijnBand':
      return <OntwikkellijnBand {...block} />
    case 'dienstenKaarten':
      return <DienstenKaarten {...block} />
    case 'trajectenKaarten':
      return <TrajectenKaarten {...block} />
    case 'checklistKaart':
      return <ChecklistKaart {...block} />
    case 'contrastKolommen':
      return <ContrastKolommen {...block} />
    case 'pijlersDrieluik':
      return <PijlersDrieluik {...block} />
    case 'fotoLabelsSplit':
      return <FotoLabelsSplit {...block} />
    case 'donkerPaneel':
      return <DonkerPaneel {...block} />
    case 'bentoGrid':
      return <BentoGrid {...block} />
    case 'genummerdeLijst':
      return <GenummerdeLijst {...block} />
    case 'badgesRij':
      return <BadgesRij {...block} />
    case 'tabelSectie':
      return <TabelSectie {...block} />
    case 'progressieCirkels':
      return <ProgressieCirkels {...block} />
    case 'fotoKaartenRij':
      return <FotoKaartenRij {...block} />
    case 'publicatiesGrid':
      return <PublicatiesGrid {...block} />
    case 'calloutBand':
      return <CalloutBand {...block} />
    case 'investeringBlok':
      return <InvesteringBlok {...block} />
    case 'verwachtingenLijst':
      return <VerwachtingenLijst {...block} />
    case 'agendaPlaceholder':
      return <AgendaPlaceholder {...block} />
    case 'booking':
      return <Booking {...block} />
    case 'ctaBand':
      return <CtaBand {...block} />
    default:
      return null
  }
}
