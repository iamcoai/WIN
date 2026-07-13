import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Pagina } from '@/payload-types'

export async function haalPagina(slug: string): Promise<Pagina | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'paginas',
    where: { slug: { equals: slug } },
    limit: 1,
    draft,
    overrideAccess: draft,
  })
  return docs[0] ?? null
}
