/* Hulpscript: publiceert alle pagina's (bv. na een seed die als draft landde). */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const res = await payload.update({
  collection: 'paginas',
  where: { slug: { exists: true } },
  data: { _status: 'published' },
  draft: false,
})
console.log('gepubliceerd:', res.docs.map((d) => d.slug).join(', '))
if (res.errors?.length) console.error('fouten:', res.errors)
process.exit(0)
