import {
  AssetStore,
  DataStore,
  ProjectStore,
  SoundAssetStore,
} from "../DataStore";
import { InMemoryProjectStore } from "./InMemoryProjectStore";
import { InMemorySoundAssetStore } from "./InMemorySoundAssetStore";
import { InMemoryCombinedAssetStore } from "./InMemoryCombinedAssetStore";

export class InMemoryDataStore implements DataStore {
  projects: ProjectStore;
  assets: AssetStore;
  sounds: SoundAssetStore;

  constructor() {
    this.projects = new InMemoryProjectStore(this);
    this.assets = new InMemoryCombinedAssetStore(this);
    this.sounds = new InMemorySoundAssetStore(this);
  }
}
