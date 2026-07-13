import type { Field } from 'payload'
import { ctaVeld, fotoVeld, kopMetAccent } from '@/payload/fields'

const isType = (...types: string[]) => (_data: unknown, siblingData: { type?: string }) =>
  types.includes(siblingData?.type ?? '')

/** De hero bovenaan elke pagina. Drie types, elk exact één bestaand ontwerp. */
export const heroVeld: Field = {
  name: 'hero',
  label: 'Hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      defaultValue: 'paginaHero',
      options: [
        { label: 'Homepage-hero (volledig scherm)', value: 'homeHero' },
        { label: 'Pagina-hero (foto + titel links)', value: 'paginaHero' },
        { label: 'Kop-header (licht, gecentreerd — kennismaking)', value: 'kopHeader' },
      ],
    },
    kopMetAccent('kop', 'Titel'),
    {
      name: 'subtitel',
      label: 'Subtitel',
      type: 'text',
      maxLength: 160,
      admin: { condition: isType('homeHero', 'paginaHero') },
    },
    {
      name: 'introZin',
      label: 'Introzin',
      type: 'textarea',
      admin: { condition: isType('homeHero', 'kopHeader') },
    },
    {
      name: 'pillLabel',
      label: 'Pill-label (bv. "WIN • Kennismaking")',
      type: 'text',
      maxLength: 40,
      admin: { condition: isType('kopHeader') },
    },
    fotoVeld('foto', 'Achtergrondfoto', true),
    {
      name: 'fotoFocus',
      label: 'Foto-focus (verticale positie van het beeld)',
      type: 'select',
      defaultValue: 'center 25%',
      options: [
        'center 12%',
        'center 15%',
        'center 20%',
        'center 22%',
        'center 25%',
        'center 28%',
        'center 30%',
        'center center',
      ].map((v) => ({ label: v, value: v })),
      admin: { condition: isType('paginaHero') },
    },
    ctaVeld('cta', 'Knop'),
    ctaVeld('secundaireCta', 'Tweede knop (optioneel)'),
  ],
}
