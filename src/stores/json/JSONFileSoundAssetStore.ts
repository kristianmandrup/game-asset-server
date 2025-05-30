import { Sound } from "../../models/Sound";
import { JSONFileAssetStore } from "./JSONFileAssetStore";
import { DataStore } from "../DataStore";

export class JSONFileSoundAssetStore extends JSONFileAssetStore<Sound> {
  constructor(dataStore: DataStore, filePath: string) {
    super(dataStore, filePath);
  }
}
