import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Keys Table
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyHash: text("key_hash").unique().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

// Projects Table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  assets: many(assets),
}));

// Assets Table (Base for all asset types)
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'sound', 'spritesheet', 'tileset'
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  tag: text("tag"),
  assetFile: text("asset_file").notNull(), // URL or path to the asset file
  fileSize: integer("file_size").notNull(), // in bytes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Specific fields for different asset types (stored as JSONB for flexibility)
  soundDetails: jsonb("sound_details"), // { duration: number, volume: number }
  spriteSheetDetails: jsonb("spritesheet_details"), // { frameWidth: number, frameHeight: number, animations: { name: string, frames: number[] }[] }
  tileSetDetails: jsonb("tileset_details"), // { tileWidth: number, tileHeight: number, properties: any }
});

export const assetsRelations = relations(assets, ({ one }) => ({
  project: one(projects, {
    fields: [assets.projectId],
    references: [projects.id],
  }),
}));
