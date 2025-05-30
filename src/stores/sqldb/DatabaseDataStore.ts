import {
  DataStore,
  ProjectStore,
  UserStore, // Import UserStore
  ApiKeyStore, // Import ApiKeyStore
} from "../DataStore";
import { DatabaseProjectStore } from "./DatabaseProjectStore";
import { DatabaseSoundAssetStore } from "./DatabaseSoundAssetStore";
import { DatabaseUserStore } from "./DatabaseUserStore"; // Import DatabaseUserStore
import { DatabaseApiKeyStore } from "./DatabaseApiKeyStore"; // Import DatabaseApiKeyStore
import { DatabaseTileSetAssetStore } from "./DatabaseTileSetAssetStore";
import { DatabaseSpriteSheetAssetStore } from "./DatabaseSpriteSheetAssetStore";
import { Client } from "pg";
import SqliteDatabase from "better-sqlite3";
import {
  NodePgDatabase,
  drizzle as drizzlePg,
} from "drizzle-orm/node-postgres";
import {
  BetterSQLite3Database,
  drizzle as drizzleSqlite,
} from "drizzle-orm/better-sqlite3";
import * as schema from "../../db/schema";

export type DrizzleDb =
  | NodePgDatabase<typeof schema>
  | BetterSQLite3Database<typeof schema>;

export class DatabaseDataStore implements DataStore {
  projects: ProjectStore;
  spritesheets: DatabaseSpriteSheetAssetStore;
  tilesets: DatabaseTileSetAssetStore;
  sounds: DatabaseSoundAssetStore;
  users: UserStore;
  apiKeys: ApiKeyStore;
  private db: DrizzleDb;
  private pgClient?: Client;
  private sqliteClient?: InstanceType<typeof SqliteDatabase>;

  constructor() {
    if (process.env.DB_DIALECT === "sqlite") {
      this.sqliteClient = new SqliteDatabase("./sqlite.db");
      this.db = drizzleSqlite(this.sqliteClient, { schema });
      console.log("Connected to SQLite database.");
    } else {
      this.pgClient = new Client({
        connectionString: process.env.DATABASE_URL!,
      });
      this.pgClient.connect();
      this.db = drizzlePg(this.pgClient, { schema });
      console.log("Connected to PostgreSQL database.");
    }

    this.projects = new DatabaseProjectStore(this.db, this);
    this.spritesheets = new DatabaseSpriteSheetAssetStore(this.db, this);
    this.tilesets = new DatabaseTileSetAssetStore(this.db, this);
    this.sounds = new DatabaseSoundAssetStore(this.db, this);
    this.users = new DatabaseUserStore(this.db, this);
    this.apiKeys = new DatabaseApiKeyStore(this.db, this);
  }

  async close(): Promise<void> {
    if (this.pgClient) {
      await this.pgClient.end();
      console.log("Closed PostgreSQL database connection.");
    } else if (this.sqliteClient) {
      this.sqliteClient.close();
      console.log("Closed SQLite database connection.");
    }
  }
}
