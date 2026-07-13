import type { Access } from 'payload'

type GebruikerMetRol = { rol?: 'admin' | 'editor' | null }

export const isAdmin: Access = ({ req: { user } }) =>
  (user as GebruikerMetRol | null)?.rol === 'admin'

export const isIngelogd: Access = ({ req: { user } }) => Boolean(user)

/** Publiek leest alleen gepubliceerde documenten; ingelogd (admin/editor) ziet ook drafts (nodig voor live preview). */
export const gepubliceerdOfIngelogd: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
