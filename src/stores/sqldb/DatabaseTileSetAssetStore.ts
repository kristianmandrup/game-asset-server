import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { TileSet } from "../../models/TileSet";
import { DataStore } from "../DataStore";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type

export class DatabaseTileSetAssetStore extends DatabaseAssetStore<TileSet> {
  constructor(db: DrizzleDb, dataStore: DataStore) {
    super(db, dataStore, "tilesets");
  }
}
