import type { GlobalConfig } from 'payload'
import { isIngelogd } from '@/payload/access'
import { revalidateAllesGlobal } from '@/payload/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Site' },
  access: { read: () => true, update: isIngelogd },
  hooks: { afterChange: [revalidateAllesGlobal] },
  fields: [
    {
      name: 'tagline',
      label: 'Tagline',
      type: 'text',
      required: true,
      maxLength: 90,
      defaultValue: 'Hét Instituut voor Weerbaarheidstherapie & -coaching.',
    },
    { name: 'adresRegel1', label: 'Adres — straat', type: 'text', required: true, defaultValue: 'Zuiderinslag 8N' },
    { name: 'adresRegel2', label: 'Adres — postcode + plaats', type: 'text', required: true, defaultValue: '3871 MR Hoevelaken' },
    {
      name: 'mapsUrl',
      label: 'Google Maps-link',
      type: 'text',
      required: true,
      defaultValue:
        'https://www.google.com/maps/search/?api=1&query=Zuiderinslag+8N%2C+3871+MR+Hoevelaken',
    },
    { name: 'kvkNummer', label: 'KVK-nummer', type: 'text', required: true, maxLength: 20, defaultValue: '50946315' },
    {
      name: 'copyrightSuffix',
      label: 'Copyright-toevoeging',
      type: 'text',
      required: true,
      maxLength: 80,
      defaultValue: 'Integratief · Psychofysiek · Systemisch.',
    },
  ],
}
