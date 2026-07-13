import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pad = searchParams.get('pad') || '/'

  // alleen ingelogde CMS-gebruikers mogen concepten zien
  const payload = await getPayload({ config })
  const requestHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) {
    return new Response('Niet ingelogd in het CMS.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(pad)
}
