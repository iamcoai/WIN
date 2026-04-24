# WIN Platform

Coaching platform for WIN (Weerbaarheids Instituut Nederland) clients,
coaches, and admins. Built alongside `/web` (marketing site) in the same
monorepo.

## Stack

- **Next.js 16.2.4** (app router, Turbopack, typed routes)
- **React 19.2.4**
- **Tailwind 4** (tokens in `src/app/globals.css`)
- **BetterAuth 1.6.x** (email + password, 7-day sessions)
- **Drizzle ORM 0.45.x** over `postgres-js`
- **Supabase** (dev project `ujlkvaxlmrsvzgmlakgn`)
- **TypeScript 5, strict mode**

## Running locally

This workspace installs from the repo root — do **not** run `npm install`
here. From the repo root:

```bash
# Install everything
npm install

# Run the platform dev server (port 3001)
npm run dev:platform

# Or build + start
npm run build:platform
npm run --workspace=platform start
```

## Environment variables

Copy `.env.example` → `.env.local` and fill in the blanks. The
`.env.local` file is gitignored.

| Variable | Required | Where to get it |
|---|---|---|
| `DATABASE_URL` | yes | Supabase → Project → Settings → Database → Connection string (pooler, port 6543) |
| `BETTER_AUTH_SECRET` | yes | `npx @better-auth/cli secret` or `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | `http://localhost:3001` in dev; production URL in prod |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | `https://ujlkvaxlmrsvzgmlakgn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase dashboard → API settings |
| `PLUGANDPAY_API_KEY` | PR 03b+ | Plug and Pay admin → tokens |

## Database

Schema source of truth: `src/lib/db/schema/*.ts` (Drizzle). Generated
schema types: `src/lib/db/types-generated.ts`.

### Migration workflow

Two flavours depending on what the change expresses:

**Declarative (Drizzle-capable)** — column adds, FK changes, enum value
additions, index creates:

```bash
# 1. Edit src/lib/db/schema/*.ts
# 2. Generate SQL
npm run db:generate
# 3. Preview drizzle/<NNNN>_<name>.sql → show Chris → get GO
# 4. Apply via Supabase MCP (win-supabase-mcp skill)
# 5. Regenerate TS types via MCP generate_typescript_types
```

**Imperative (raw DDL)** — RLS toggles, role grants, triggers, functions,
policies, extensions. Drizzle can't express these:

```bash
# 1. Draft SQL inline and preview to Chris
# 2. Apply via MCP apply_migration
# 3. Save the SQL to drizzle/custom/<YYYYMMDD>_<slug>.sql for git history
```

MCP is the source of truth; the SQL files here are reference. See
`drizzle/custom/README.md`.

### Seed

```bash
SEED_PASSWORD=<min-8-chars> npm run db:seed
```

Creates three users via BetterAuth's sign-up API (so password hashes
are generated canonically, never touched directly):

- admin : `chris@co-creatie.ai`
- coach : `reza@win.nl`
- client : `demo-client@win.nl`

Idempotent — re-running after a partial failure skips users that already
exist.

## Auth

BetterAuth with the Drizzle adapter over Postgres. Tables:

- `user` (id, name, email, email_verified, image, timestamps)
- `session` (id, user_id, token, expires_at, ip, ua, timestamps)
- `account` (id, user_id, provider_id, account_id, password hash, tokens,
  timestamps) — `provider_id = "credential"` for email+password
- `verification` (id, identifier, value, expires_at, timestamps)

RLS is **off** on these four tables; access is controlled at the
application layer by BetterAuth's session validation in server actions.
Anon/authenticated Postgres roles have been revoked, so PostgREST
cannot expose these tables to clients.

Business-domain tables (added in later PRs) **must** keep RLS enabled
with explicit per-role policies. See `drizzle/custom/README.md`.

## Layout

```
platform/
├── drizzle/                     # generated migrations
│   └── custom/                  # imperative SQL applied via MCP
├── scripts/
│   └── seed.ts                  # BetterAuth-based user seed
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/   # BetterAuth handler
│   │   ├── login/               # email/password form
│   │   ├── signup/              # invite-only stub
│   │   ├── layout.tsx           # Manrope + Inter, NL, WIN tokens
│   │   ├── page.tsx             # → redirect /login
│   │   └── globals.css          # Tailwind 4 + WIN theme tokens
│   ├── components/              # shared UI
│   ├── lib/
│   │   ├── auth.ts              # BetterAuth config
│   │   ├── auth-client.ts       # client-side auth hooks
│   │   └── db/                  # Drizzle client + schema
│   └── proxy.ts                 # Next 16 proxy (renamed from middleware)
├── drizzle.config.ts
├── next.config.ts               # typedRoutes, monorepo root
└── package.json
```

## Port conventions

- `/web` → `http://localhost:3000`
- `/platform` → `http://localhost:3001`

Both are separate Next.js apps in one monorepo. They share nothing at
runtime (different processes, different builds). Same design tokens in
CSS, enforced by eyeball during review.
