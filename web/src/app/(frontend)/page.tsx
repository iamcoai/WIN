import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { haalPagina } from '@/lib/paginas'
import { LivePreviewListener } from '@/components/live-preview-listener'

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await haalPagina('home')
  if (!pagina) return {}
  return {
    title: pagina.metaTitel ?? pagina.titel,
    description: pagina.metaOmschrijving ?? undefined,
  }
}

export default async function HomePage() {
  const pagina = await haalPagina('home')
  if (!pagina) return null
  const { isEnabled: draft } = await draftMode()

  return (
    <>
      {draft && <LivePreviewListener />}
      <RenderHero hero={pagina.hero} />
      <RenderBlocks blocks={pagina.layout} />
    </>
  )
}
