import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { isAdmin, isIngelogd } from '@/payload/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Foto', plural: 'Mediabibliotheek' },
  admin: {
    group: 'Media',
    description:
      'Upload hier foto’s. Alt-tekst is verplicht (toegankelijkheid + vindbaarheid). Gebruik het focuspunt om te bepalen wat in beeld blijft.',
  },
  access: {
    read: () => true,
    create: isIngelogd,
    update: isIngelogd,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    focalPoint: true,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true },
      { name: 'kaart', width: 800, withoutEnlargement: true },
      { name: 'hero', width: 1920, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt-tekst (beschrijf wat er op de foto staat)',
      type: 'text',
      required: true,
    },
    { name: 'credit', label: 'Fotograaf / credit (optioneel)', type: 'text' },
  ],
}
