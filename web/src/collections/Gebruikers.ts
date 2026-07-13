import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/payload/access'

export const Gebruikers: CollectionConfig = {
  slug: 'gebruikers',
  labels: { singular: 'Gebruiker', plural: 'Gebruikers' },
  auth: true,
  admin: {
    useAsTitle: 'naam',
    group: 'Beheer',
    hidden: ({ user }) => (user as { rol?: string } | null)?.rol !== 'admin',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    // admin-panel toegang voor iedere ingelogde gebruiker
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'naam', label: 'Naam', type: 'text', required: true },
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      options: [
        { label: 'Admin (Chris/Kick — alles)', value: 'admin' },
        { label: 'Editor (Reza — content)', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      saveToJWT: true,
      access: { update: ({ req: { user } }) => (user as { rol?: string } | null)?.rol === 'admin' },
    },
  ],
}
