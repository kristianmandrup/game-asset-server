import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { SpriteSheet } from "../../models/SpriteSheet";
import { DataStore } from "../DataStore";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type

export class DatabaseSpriteSheetAssetStore extends DatabaseAssetStore<SpriteSheet> {
  constructor(db: DrizzleDb, dataStore: DataStore) {
    super(db, dataStore, "spritesheets");
  }
}
