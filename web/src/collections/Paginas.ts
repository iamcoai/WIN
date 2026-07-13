import type { CollectionConfig } from 'payload'
import { gepubliceerdOfIngelogd, isAdmin, isIngelogd } from '@/payload/access'
import { revalidatePagina, revalidatePaginaDelete } from '@/payload/revalidate'
import { heroVeld } from '@/heros/config'
import { alleBlokken } from '@/blocks/configs'

export const Paginas: CollectionConfig = {
  slug: 'paginas',
  labels: { singular: 'Pagina', plural: "Pagina's" },
  admin: {
    useAsTitle: 'titel',
    group: 'Content',
    defaultColumns: ['titel', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const pad = data?.slug === 'home' ? '' : `/${data?.slug ?? ''}`
        return `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/next/preview?slug=${data?.slug}&pad=${encodeURIComponent(pad || '/')}`
      },
    },
    preview: (data) => {
      const pad = data?.slug === 'home' ? '' : `/${(data as { slug?: string })?.slug ?? ''}`
      return `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/next/preview?slug=${(data as { slug?: string })?.slug}&pad=${encodeURIComponent(pad || '/')}`
    },
  },
  versions: {
    // interval 100ms: het officiële template-advies voor vloeiende live preview
    drafts: { autosave: { interval: 100 } },
    maxPerDoc: 50,
  },
  access: {
    read: gepubliceerdOfIngelogd,
    update: isIngelogd,
    // nieuwe pagina's zijn codewerk (Kick) — Reza kan geen pagina's aanmaken of weggooien
    create: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePagina],
    afterDelete: [revalidatePaginaDelete],
  },
  fields: [
    { name: 'titel', label: 'Paginanaam (intern)', type: 'text', required: true },
    {
      // bewust geen slugField(): de URL van een pagina is site-structuur en
      // hoort vast te staan — alleen de admin kan hem wijzigen
      name: 'slug',
      label: 'URL-slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: { update: ({ req: { user } }) => (user as { rol?: string } | null)?.rol === 'admin' },
      admin: { position: 'sidebar', description: 'Alleen door admin te wijzigen — links en navigatie hangen hieraan.' },
    },
    {
      type: 'tabs',
      tabs: [
        { label: 'Hero', fields: [heroVeld] },
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'layout',
              label: 'Secties',
              type: 'blocks',
              blocks: alleBlokken,
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitel', label: 'Meta-titel', type: 'text', maxLength: 60 },
            { name: 'metaOmschrijving', label: 'Meta-omschrijving', type: 'textarea', maxLength: 160 },
          ],
        },
      ],
    },
  ],
}
