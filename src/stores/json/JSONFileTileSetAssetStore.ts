import { TileSet } from "../../models/TileSet";
import { JSONFileAssetStore } from "./JSONFileAssetStore";
import { DataStore } from "../DataStore";

export class JSONFileTileSetAssetStore extends JSONFileAssetStore<TileSet> {
  constructor(dataStore: DataStore, filePath: string) {
    super(dataStore, filePath);
  }
}
