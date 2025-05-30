import { DataStore, ProjectStore, AssetStore } from "../DataStore";
import { JSONFileProjectStore } from "./JSONFileProjectStore";
import { JSONFileAssetStore } from "./JSONFileAssetStore";

export class JSONFileDataStore implements DataStore {
  projects: ProjectStore;
  assets: AssetStore;

  constructor() {
    this.projects = new JSONFileProjectStore(this);
    this.assets = new JSONFileAssetStore(this);
  }
}
