import { Project } from "../../models/Project";
import { AssetStore, DataStore, ProjectStore } from "../DataStore";
import { InMemoryProjectStore } from "./InMemoryProjectStore";
import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemorySpriteSheetAssetStore } from "./InMemorySpriteSheetAssetStore";
import { InMemoryTileSetAssetStore } from "./InMemoryTileSetAssetStore";
import { Asset } from "../../models/Asset";

class InMemoryCombinedAssetStore implements AssetStore {
  private inMemoryAssetStore: InMemoryAssetStore;
  private inMemorySpriteSheetAssetStore: InMemorySpriteSheetAssetStore;
  private inMemoryTileSetAssetStore: InMemoryTileSetAssetStore;

  constructor(dataStore: InMemoryDataStore) {
    this.inMemoryAssetStore = new InMemoryAssetStore(dataStore);
    this.inMemorySpriteSheetAssetStore = new InMemorySpriteSheetAssetStore(
      dataStore
    );
    this.inMemoryTileSetAssetStore = new InMemoryTileSetAssetStore(dataStore);
  }

  async createAsset(asset: Asset): Promise<Asset> {
    if (asset.type === "spritesheet") {
      return this.inMemorySpriteSheetAssetStore.createSpriteSheet(asset);
    } else if (asset.type === "tileset") {
      return this.inMemoryTileSetAssetStore.createTileSet(asset);
    }
    return this.inMemoryAssetStore.createAsset(asset);
  }

  async getAssets(query: Partial<Asset>): Promise<Asset[]> {
    if (query.type === "spritesheet") {
      return this.inMemorySpriteSheetAssetStore.getSpriteSheets(query);
    } else if (query.type === "tileset") {
      return this.inMemoryTileSetAssetStore.getTileSets(query);
    }
    return this.inMemoryAssetStore.getAssets(query);
  }

  async getAssetById(id: string): Promise<Asset> {
    // Try to get from specialized stores first, then generic
    let asset = await this.inMemorySpriteSheetAssetStore.getSpriteSheetById(id);
    if (Object.keys(asset).length > 0) return asset; // Check if asset is not empty object

    asset = await this.inMemoryTileSetAssetStore.getTileSetById(id);
    if (Object.keys(asset).length > 0) return asset;

    return this.inMemoryAssetStore.getAssetById(id);
  }

  async updateAsset(id: string, asset: Asset): Promise<Asset> {
    if (asset.type === "spritesheet") {
      return this.inMemorySpriteSheetAssetStore.updateSpriteSheet(id, asset);
    } else if (asset.type === "tileset") {
      return this.inMemoryTileSetAssetStore.updateTileSet(id, asset);
    }
    return this.inMemoryAssetStore.updateAsset(id, asset);
  }

  async deleteAsset(id: string): Promise<void> {
    // Try to delete from specialized stores first, then generic
    try {
      await this.inMemorySpriteSheetAssetStore.deleteSpriteSheet(id);
      return;
    } catch (e) {
      // Ignore if not found in spritesheet store
    }

    try {
      await this.inMemoryTileSetAssetStore.deleteTileSet(id);
      return;
    } catch (e) {
      // Ignore if not found in tileset store
    }

    return this.inMemoryAssetStore.deleteAsset(id);
  }
}

export class InMemoryDataStore implements DataStore {
  projects: ProjectStore;
  assets: AssetStore;

  constructor() {
    this.projects = new InMemoryProjectStore(this);
    this.assets = new InMemoryCombinedAssetStore(this);
  }
}
