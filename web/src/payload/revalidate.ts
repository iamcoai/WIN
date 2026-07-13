import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

const naarPad = (slug?: string | null) => (slug === 'home' || !slug ? '/' : `/${slug}`)

/** Buiten een Next-request (seed-scripts, CLI) bestaat de revalidation-store
 *  niet — revalidatie is daar zinloos én gooit een Invariant-error. */
async function veiligRevalidate(pad: string, type?: 'layout') {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath(pad, type)
  } catch {
    // geen Next-context (bv. seed) — niets te revalideren
  }
}

export const revalidatePagina: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  if (doc._status === 'published' || previousDoc?._status === 'published') {
    await veiligRevalidate(naarPad(doc.slug))
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await veiligRevalidate(naarPad(previousDoc.slug))
    }
  }
  return doc
}

export const revalidatePaginaDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await veiligRevalidate(naarPad(doc?.slug))
}

/** Bouwstenen (diensten/methodes/publicaties) en site-globals worden op meerdere
 *  pagina's gerenderd — bij wijziging de hele site revalideren. */
export const revalidateAlles: CollectionAfterChangeHook = async ({ doc }) => {
  await veiligRevalidate('/', 'layout')
  return doc
}

export const revalidateAllesGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await veiligRevalidate('/', 'layout')
  return doc
}
