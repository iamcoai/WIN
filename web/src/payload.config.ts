import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nl } from '@payloadcms/translations/languages/nl'
import sharp from 'sharp'

import { Gebruikers } from '@/collections/Gebruikers'
import { Media } from '@/collections/Media'
import { Paginas } from '@/collections/Paginas'
import { Diensten } from '@/collections/Diensten'
import { Methodes } from '@/collections/Methodes'
import { Publicaties } from '@/collections/Publicaties'
import { Navigatie } from '@/globals/Navigatie'
import { Footer } from '@/globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'gebruikers',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — WIN CMS',
    },
  },
  i18n: { supportedLanguages: { nl }, fallbackLanguage: 'nl' },
  collections: [Paginas, Diensten, Methodes, Publicaties, Media, Gebruikers],
  globals: [Navigatie, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 10,
      idleTimeoutMillis: 10_000,
    },
  }),
  sharp,
  plugins: [
    // Media naar Vercel Blob zodra het token er is; zonder token (lokale dev)
    // vallen uploads terug op web/public/media via de collection-config.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
