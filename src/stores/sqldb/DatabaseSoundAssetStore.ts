import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { Sound } from "../../models/Sound";
import { DataStore } from "../DataStore";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type

export class DatabaseSoundAssetStore extends DatabaseAssetStore<Sound> {
  constructor(db: DrizzleDb, dataStore: DataStore) {
    super(db, dataStore, "sounds");
  }
}
