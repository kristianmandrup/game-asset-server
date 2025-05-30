import {
  DataStore,
  ProjectStore,
  AssetStore,
  SoundAssetStore,
} from "../DataStore";
import { DatabaseProjectStore } from "./DatabaseProjectStore";
import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { DatabaseSoundAssetStore } from "./DatabaseSoundAssetStore";
import * as sqlite3 from "sqlite3";
import * as path from "path";

export class DatabaseDataStore implements DataStore {
  projects: ProjectStore;
  assets: AssetStore;
  sounds: SoundAssetStore; // Add this line
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
    this.assets = new DatabaseAssetStore(this.db, this);
    this.sounds = new DatabaseSoundAssetStore(this.db, this); // Add this line
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
