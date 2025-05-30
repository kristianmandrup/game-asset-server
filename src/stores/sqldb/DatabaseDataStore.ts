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
import * as sqlite3 from "sqlite3";
import * as path from "path";
import { DatabaseTileSetAssetStore } from "./DatabaseTileSetAssetStore";
import { DatabaseSpriteSheetAssetStore } from "./DatabaseSpriteSheetAssetStore";

export class DatabaseDataStore implements DataStore {
  projects: ProjectStore;
  spritesheets: DatabaseSpriteSheetAssetStore;
  tilesets: DatabaseTileSetAssetStore;
  sounds: DatabaseSoundAssetStore;
  users: UserStore; // Add users store
  apiKeys: ApiKeyStore; // Add apiKeys store
  private db: sqlite3.Database;

  constructor(
    dbPath: string = path.join(__dirname, "../data/game_asset_server.db")
  ) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });

    this.projects = new DatabaseProjectStore(this.db, this);
    this.spritesheets = new DatabaseSpriteSheetAssetStore(this.db, this);
    this.tilesets = new DatabaseTileSetAssetStore(this.db, this);
    this.sounds = new DatabaseSoundAssetStore(this.db, this);
    this.users = new DatabaseUserStore(this.db, this); // Instantiate DatabaseUserStore
    this.apiKeys = new DatabaseApiKeyStore(this.db, this); // Instantiate DatabaseApiKeyStore
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error("Error closing database:", err.message);
          reject(err);
        } else {
          console.log("Closed the SQLite database connection.");
          resolve();
        }
      });
    });
  }
}
