import type { Config } from "drizzle-kit";

export default {
  schema: "app/drizzle/schema.ts",
  driver: "turso",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
  },
} satisfies Config;
