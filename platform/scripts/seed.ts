#!/usr/bin/env tsx
/**
 * Seed the dev database with three canonical users:
 *   - admin  : chris@co-creatie.ai
 *   - coach  : reza@win.nl
 *   - client : demo-client@win.nl
 *
 * Uses BetterAuth's sign-up API so password hashing, id generation,
 * and the account/user row split all happen the canonical way — we
 * never touch the hash column directly.
 *
 * Run: SEED_PASSWORD=... npm run db:seed  (from platform/)
 *
 * Idempotent: if a user already exists the sign-up call throws and
 * we log + continue. Safe to re-run after partial failures.
 *
 * Roles are not yet modeled (PR 03 adds the role column). For now
 * the three users are structurally identical; their emails encode
 * the intended role so later migrations can backfill deterministically.
 */

import "dotenv/config";
import { auth } from "../src/lib/auth";

type SeedUser = { email: string; name: string; role: "admin" | "coach" | "client" };

const USERS: SeedUser[] = [
  { email: "chris@co-creatie.ai", name: "Christian Bleeker", role: "admin" },
  { email: "reza@win.nl", name: "Reza", role: "coach" },
  { email: "demo-client@win.nl", name: "Demo Cliënt", role: "client" },
];

async function main() {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error(
      "SEED_PASSWORD is required (min 8 chars). Set it in the command: " +
        "`SEED_PASSWORD=... npm run db:seed`",
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes("PLACEHOLDER")) {
    throw new Error(
      "DATABASE_URL is not set to a real value. Paste the Supabase pooler " +
        "connection string into platform/.env.local first.",
    );
  }

  let created = 0;
  let skipped = 0;

  for (const user of USERS) {
    try {
      await auth.api.signUpEmail({
        body: { email: user.email, password, name: user.name },
        headers: new Headers(),
      });
      console.log(`  created  ${user.role.padEnd(6)} ${user.email}`);
      created++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/exists|already|duplicate|unique/i.test(message)) {
        console.log(`  exists   ${user.role.padEnd(6)} ${user.email}`);
        skipped++;
      } else {
        console.error(`  FAILED   ${user.role.padEnd(6)} ${user.email}`);
        console.error(`           ${message}`);
        throw err;
      }
    }
  }

  console.log(
    `\n  ${USERS.length} users total · ${created} created · ${skipped} existed`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
