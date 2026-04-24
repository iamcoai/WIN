import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/lib/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://PLACEHOLDER:PLACEHOLDER@localhost:5432/placeholder",
  },
  verbose: true,
  strict: true,
} satisfies Config;
