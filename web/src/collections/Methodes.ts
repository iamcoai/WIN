import type { CollectionConfig } from 'payload'
import { isIngelogd } from '@/payload/access'
import { revalidateAlles } from '@/payload/revalidate'

export const Methodes: CollectionConfig = {
  slug: 'methodes',
  labels: { singular: 'Methode', plural: 'Methodes (integratief palet)' },
  admin: {
    useAsTitle: 'titel',
    group: 'Bouwstenen',
    defaultColumns: ['titel', 'volgorde'],
    description:
      'Het integratieve palet op de Methodiek-pagina. Je mag methodes toevoegen of verwijderen — het raster past zich aan.',
  },
  access: {
    read: () => true,
    create: isIngelogd,
    update: isIngelogd,
    delete: isIngelogd,
  },
  hooks: { afterChange: [revalidateAlles] },
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true, maxLength: 60 },
    {
      name: 'omschrijving',
      label: 'Omschrijving',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'volgorde',
      label: 'Volgorde',
      type: 'number',
      defaultValue: 1,
      admin: { position: 'sidebar' },
    },
  ],
}
