import type { CollectionConfig } from 'payload'
import { isIngelogd } from '@/payload/access'
import { revalidateAlles } from '@/payload/revalidate'
import { fotoVeld } from '@/payload/fields'

export const Publicaties: CollectionConfig = {
  slug: 'publicaties',
  labels: { singular: 'Publicatie', plural: 'Publicaties' },
  admin: {
    useAsTitle: 'titel',
    group: 'Bouwstenen',
    defaultColumns: ['titel', 'themaLabel', 'volgorde'],
    description: 'De inzichten & publicaties op de Kennisinstituut-pagina.',
  },
  access: {
    read: () => true,
    create: isIngelogd,
    update: isIngelogd,
    delete: isIngelogd,
  },
  hooks: { afterChange: [revalidateAlles] },
  fields: [
    { name: 'titel', label: 'Titel', type: 'text', required: true, maxLength: 120 },
    {
      name: 'themaLabel',
      label: 'Thema-label (bv. "Thema: Emotionele Weerbaarheid")',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    fotoVeld('foto', 'Foto', true),
    {
      name: 'inhoud',
      label: 'Inhoud (voor toekomstige detailpagina)',
      type: 'richText',
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
