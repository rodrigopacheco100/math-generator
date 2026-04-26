// Database module - only for server-side use
// This file is excluded from client bundles by the Next.js webpack config

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/schemas";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export function getDb() {
  if (!db) {
    db = drizzle(getPool(), { schema });
  }
  return db;
}
