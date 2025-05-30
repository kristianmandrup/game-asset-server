import { SpriteSheet } from "../../models/SpriteSheet";
import { JSONFileAssetStore } from "./JSONFileAssetStore";
import { DataStore } from "../DataStore";

export class JSONFileSpriteSheetAssetStore extends JSONFileAssetStore<SpriteSheet> {
  constructor(dataStore: DataStore, filePath: string) {
    super(dataStore, filePath);
  }
}
