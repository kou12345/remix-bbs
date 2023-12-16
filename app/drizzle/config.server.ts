import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const url = process.env.TURSO_URL;
if (!url) {
  throw new Error("TURSO_URL is not set");
}

const authToken = process.env.TURSO_AUTH_TOKEN;
if (!authToken) {
  throw new Error("TURSO_AUTH_TOKEN is not set");
}

const client = createClient({ url, authToken });

export const db = drizzle(client);
