import { AssetStore, CombinedAssetStore } from "../DataStore";
import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemorySpriteSheetAssetStore } from "./InMemorySpriteSheetAssetStore";
import { InMemoryTileSetAssetStore } from "./InMemoryTileSetAssetStore";
import { InMemorySoundAssetStore } from "./InMemorySoundAssetStore"; // Import InMemorySoundAssetStore
import { Asset } from "../../models/Asset";
import { InMemoryDataStore } from "./InMemoryDataStore"; // Import InMemoryDataStore

export class InMemoryCombinedAssetStore implements CombinedAssetStore {
  spritesheets: InMemorySpriteSheetAssetStore;
  tilesets: InMemoryTileSetAssetStore;
  sounds: InMemorySoundAssetStore;
  assets: InMemoryAssetStore<Asset>;

  protected assetStoreMap: Map<string, any>;

  constructor(dataStore: InMemoryDataStore) {
    this.assets = new InMemoryAssetStore<Asset>(dataStore);
    this.spritesheets = new InMemorySpriteSheetAssetStore(dataStore);
    this.tilesets = new InMemoryTileSetAssetStore(dataStore);
    this.sounds = new InMemorySoundAssetStore(dataStore); // Initialize InMemorySoundAssetStore

    this.assetStoreMap = new Map<string, any>();
    this.assetStoreMap.set("spritesheet", this.spritesheets);
    this.assetStoreMap.set("tileset", this.tilesets);
    this.assetStoreMap.set("sound", this.sounds);
  }

  async createAsset(asset: Asset): Promise<Asset> {
    const specializedStore = this.assetStoreMap.get(asset.type);
    return (
      (specializedStore && specializedStore.createAsset(asset)) ||
      this.assets.createAsset(asset)
    );
  }

  async getAssets(query: Partial<Asset>): Promise<Asset[]> {
    if (query.type) {
      // Check if query.type is defined
      const specializedStore = this.assetStoreMap.get(query.type);
      return (
        (specializedStore && specializedStore.getAssets(query)) ||
        this.assets.getAssets(query)
      );
    }
    return this.assets.getAssets(query);
  }

  async getAssetById(id: string, type?: string): Promise<Asset | undefined> {
    if (type) {
      // Check if query.type is defined
      const specializedStore = this.assetStoreMap.get(type);
      return (
        (specializedStore && specializedStore.getAssetById(id)) ||
        this.assets.getAssetById(id)
      );
    }
    // Iterate through specialized stores to find the asset
    for (const store of this.assetStoreMap.values()) {
      // Attempt to call specific getById methods based on store type
      return await store.getAssetById(id);
    }
    return this.assets.getAssetById(id);
  }

  async updateAsset(id: string, asset: Asset): Promise<Asset> {
    const specializedStore = this.assetStoreMap.get(asset.type);
    return (
      (specializedStore && specializedStore.updateAsset(id, asset)) ||
      this.assets.updateAsset(id, asset)
    );
  }

  async deleteAsset(id: string, type?: string): Promise<void> {
    if (type) {
      // Check if query.type is defined
      const specializedStore = this.assetStoreMap.get(type);
      return (
        (specializedStore && specializedStore.deleteAsset(id)) ||
        this.assets.deleteAsset(id)
      );
    }

    // Iterate through specialized stores to delete the asset
    for (const store of this.assetStoreMap.values()) {
      // Attempt to call specific delete methods based on store type
      return await store.deleteAsset(id);
    }
    return this.assets.deleteAsset(id);
  }
}
