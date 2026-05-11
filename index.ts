import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Database url is missing. Cheack your .env file.");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
