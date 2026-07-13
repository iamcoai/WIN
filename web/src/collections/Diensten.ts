import type { CollectionConfig } from 'payload'
import { isAdmin, isIngelogd } from '@/payload/access'
import { revalidateAlles } from '@/payload/revalidate'
import { ROUTE_OPTIES } from '@/payload/fields'

export const Diensten: CollectionConfig = {
  slug: 'diensten',
  labels: { singular: 'Dienst', plural: 'Diensten & Prijzen' },
  admin: {
    useAsTitle: 'naam',
    group: 'Bouwstenen',
    defaultColumns: ['naam', 'prijsLabel', 'volgorde'],
    description:
      'Eén plek voor prijzen en dienstteksten — een wijziging hier werkt automatisch door op elke pagina waar de dienst getoond wordt.',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isIngelogd,
    // het design verwacht precies deze diensten — verwijderen is aan de admin
    delete: isAdmin,
  },
  hooks: { afterChange: [revalidateAlles] },
  fields: [
    { name: 'naam', label: 'Naam', type: 'text', required: true, maxLength: 40 },
    {
      name: 'route',
      label: 'Pagina van deze dienst',
      type: 'select',
      options: ROUTE_OPTIES,
      required: true,
    },
    {
      name: 'kaartOmschrijving',
      label: 'Omschrijving (op de aanbod-kaart)',
      type: 'textarea',
      required: true,
    },
    {
      name: 'prijsLabel',
      label: 'Prijsregel (bv. "Vanaf € 2.000,- per traject")',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    { name: 'prijsDetail', label: 'Prijstoevoeging (bv. "/ 3 mnd")', type: 'text', maxLength: 30 },
    { name: 'linkTekst', label: 'Linktekst (bv. "Bekijk trajecten")', type: 'text', maxLength: 40 },
    {
      name: 'volgorde',
      label: 'Volgorde',
      type: 'number',
      defaultValue: 1,
      admin: { position: 'sidebar' },
    },
  ],
}
