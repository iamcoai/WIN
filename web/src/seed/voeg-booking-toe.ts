/* Hulpscript: zet het booking-block op /kennismaking (idempotent).
   Draai: npm run payload run src/seed/voeg-booking-toe.ts (DATABASE_URI bepaalt dev/prod). */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const res = await payload.find({
  collection: 'paginas',
  where: { slug: { equals: 'kennismaking' } },
  limit: 1,
})
const pagina = res.docs[0]
if (!pagina) throw new Error('Pagina /kennismaking niet gevonden')

const layout = (pagina.layout ?? []) as { blockType: string }[]
// De oude placeholder ("agenda in aanbouw") vervalt zodra echt boeken kan.
const zonderPlaceholder = layout.filter((b) => b.blockType !== 'agendaPlaceholder')
if (
  zonderPlaceholder.some((b) => b.blockType === 'booking') &&
  zonderPlaceholder.length === layout.length
) {
  console.log('booking-block staat er al en geen placeholder — niets te doen')
  process.exit(0)
}

// Booking bovenaan (direct onder de hero), verwachtingen eronder.
const nieuw = zonderPlaceholder.some((b) => b.blockType === 'booking')
  ? zonderPlaceholder
  : [
      {
        blockType: 'booking',
        intro: 'Plan direct een gratis kennismaking van 30 minuten. Kies een moment dat jou past.',
      },
      ...zonderPlaceholder,
    ]

await payload.update({
  collection: 'paginas',
  id: pagina.id,
  data: { layout: nieuw as never, _status: 'published' },
  draft: false,
})
console.log('booking-block toegevoegd aan /kennismaking')
process.exit(0)
