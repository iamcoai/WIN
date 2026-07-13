import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { haalPagina } from '@/lib/paginas'
import { LivePreviewListener } from '@/components/live-preview-listener'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'paginas',
    limit: 100,
    select: { slug: true },
  })
  return docs.filter((d) => d.slug !== 'home').map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pagina = await haalPagina(slug)
  if (!pagina) return {}
  return {
    title: pagina.metaTitel ?? pagina.titel,
    description: pagina.metaOmschrijving ?? undefined,
  }
}

export default async function PaginaRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug === 'home') notFound()
  const pagina = await haalPagina(slug)
  if (!pagina) notFound()
  const { isEnabled: draft } = await draftMode()

  return (
    <>
      {draft && <LivePreviewListener />}
      <RenderHero hero={pagina.hero} />
      <RenderBlocks blocks={pagina.layout} />
    </>
  )
}
