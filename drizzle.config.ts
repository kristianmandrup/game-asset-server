import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // This is the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
