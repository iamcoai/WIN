import type { GlobalConfig } from 'payload'
import { isIngelogd } from '@/payload/access'
import { revalidateAllesGlobal } from '@/payload/revalidate'

export const Navigatie: GlobalConfig = {
  slug: 'navigatie',
  label: 'Navigatie',
  admin: {
    group: 'Site',
    description:
      'De teksten van het menu. De routes en volgorde zelf zijn onderdeel van de site-structuur en worden in code beheerd.',
  },
  access: { read: () => true, update: isIngelogd },
  hooks: { afterChange: [revalidateAllesGlobal] },
  fields: [
    {
      name: 'hoofdmenu',
      label: 'Hoofdmenu-labels',
      type: 'array',
      minRows: 7,
      maxRows: 7,
      admin: { description: 'Volgorde: Methodiek · Aanbod · Coaching · Mentorschap · Opleidingen · Organisaties · Over WIN' },
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 25 }],
    },
    {
      name: 'meerMenu',
      label: '"Meer"-menu-labels',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      admin: { description: 'Volgorde: Kennisinstituut · De Mentor · Ontwikkellijn' },
      fields: [{ name: 'label', type: 'text', required: true, maxLength: 25 }],
    },
    { name: 'ctaLabel', label: 'Gouden knop', type: 'text', required: true, maxLength: 30, defaultValue: 'Gratis Kennismaking' },
    { name: 'inloggenLabel', label: 'Inloggen-knop', type: 'text', required: true, maxLength: 20, defaultValue: 'Inloggen' },
  ],
}
