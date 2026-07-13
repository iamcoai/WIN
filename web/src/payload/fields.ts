import type { Field } from 'payload'

/** Vaste routes — knoppen kunnen nooit naar een dode link wijzen. */
export const ROUTE_OPTIES = [
  { label: 'Home', value: '/' },
  { label: 'Methodiek', value: '/methodiek' },
  { label: 'Aanbod', value: '/aanbod' },
  { label: 'Coaching', value: '/coaching' },
  { label: 'Mentorschap', value: '/mentorschap' },
  { label: 'Opleidingen', value: '/opleidingen' },
  { label: 'Organisaties', value: '/organisaties' },
  { label: 'Over WIN', value: '/wininstituut' },
  { label: 'De Weerbaarheidsmentor', value: '/weerbaarheidsmentor' },
  { label: 'Kennisinstituut', value: '/kennisinstituut' },
  { label: 'Ontwikkellijn', value: '/ontwikkellijn' },
  { label: 'Gratis Kennismaking', value: '/kennismaking' },
]

/** Kop waarin één woord het gouden accent krijgt — het effect zelf zit in code. */
export const kopMetAccent = (name = 'kop', label = 'Kop'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'voor', label: 'Tekst vóór het accent', type: 'text' },
    { name: 'accent', label: 'Accentwoord (goud)', type: 'text' },
    { name: 'na', label: 'Tekst ná het accent', type: 'text' },
  ],
})

export const ctaVeld = (name = 'cta', label = 'Knop'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'label', label: 'Knoptekst', type: 'text', maxLength: 60 },
    {
      name: 'doel',
      label: 'Waar gaat de knop heen?',
      type: 'select',
      options: ROUTE_OPTIES,
      defaultValue: '/kennismaking',
    },
  ],
})

export const fotoVeld = (name = 'foto', label = 'Foto', required = false): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  required,
})

export const alineaVeld = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: 'textarea',
  required,
})
