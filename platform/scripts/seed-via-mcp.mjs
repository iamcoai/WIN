#!/usr/bin/env node
/**
 * Offline-seed helper: generates BetterAuth-compatible password hashes
 * and random IDs locally (no DB connection needed), then prints the
 * exact INSERT SQL to stdout. Pipe the output to Supabase MCP
 * apply_migration.
 *
 * Usage:
 *   SEED_PASSWORD='<min 8 chars>' node platform/scripts/seed-via-mcp.mjs
 */

import { hashPassword } from "@better-auth/utils/password";
import { randomBytes } from "node:crypto";

const password = process.env.SEED_PASSWORD;
if (!password || password.length < 8) {
  console.error("SEED_PASSWORD is required (min 8 chars).");
  process.exit(1);
}

const id = () => randomBytes(16).toString("hex");

const users = [
  { role: "admin", email: "chris@co-creatie.ai", name: "Christian Bleeker" },
  { role: "coach", email: "reza@win.nl", name: "Reza" },
  { role: "client", email: "demo-client@win.nl", name: "Demo Cliënt" },
];

const hash = await hashPassword(password);

const rows = users.map((u) => {
  const userId = id();
  const accountId = id();
  return { ...u, userId, accountId };
});

const sqlEscape = (s) => s.replace(/'/g, "''");

const userInserts = rows
  .map(
    (r) =>
      `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at) ` +
      `VALUES ('${r.userId}', '${sqlEscape(r.name)}', '${sqlEscape(r.email)}', false, NOW(), NOW()) ` +
      `ON CONFLICT (email) DO NOTHING;`,
  )
  .join("\n");

const accountInserts = rows
  .map(
    (r) =>
      `INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at) ` +
      `SELECT '${r.accountId}', u.id, 'credential', u.id, '${hash}', NOW(), NOW() ` +
      `FROM "user" u WHERE u.email = '${sqlEscape(r.email)}' ` +
      `AND NOT EXISTS (SELECT 1 FROM "account" a WHERE a.user_id = u.id AND a.provider_id = 'credential');`,
  )
  .join("\n");

const sql = `-- Seed: 3 users + credential accounts. Idempotent on email + (user_id, provider).\n-- Password hash is shared across all three users for dev convenience.\n\n${userInserts}\n\n${accountInserts}`;

console.log(sql);
console.error("\nRows to insert:");
for (const r of rows) {
  console.error(`  ${r.role.padEnd(6)} ${r.email}  (user_id=${r.userId})`);
}
