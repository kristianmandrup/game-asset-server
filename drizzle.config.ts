import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: process.env.DB_DIALECT === "sqlite" ? "sqlite" : "postgresql",
  dbCredentials:
    process.env.DB_DIALECT === "sqlite"
      ? { url: "./sqlite.db" }
      : { url: process.env.DATABASE_URL! },
} satisfies Config;
