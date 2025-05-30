import { Asset, AssetSchema } from "../../models/Asset";
import { v4 as uuidv4 } from "uuid";
import { AssetStore } from "../DataStore";
import { InMemoryDataStore } from "./InMemoryDataStore";

export class InMemoryAssetStore implements AssetStore {
  private dataStore: InMemoryDataStore;
  private assets: Asset[] = [];
  private assetQueryAttributes = ["id", "project_id", "type", "name", "tag"];

  constructor(dataStore: InMemoryDataStore) {
    this.dataStore = dataStore;
  }

  createAsset = async (asset: Asset): Promise<Asset> => {
    try {
      // Validate the asset data against the appropriate schema (e.g. SpriteSheetSchema, TileSetSchema, etc.)
      const validatedAsset = AssetSchema.parse(asset);
      const newAsset = { ...validatedAsset, id: uuidv4() };
      this.assets.push(newAsset);
      return newAsset;
    } catch (error) {
      throw new Error(`Error creating asset: ${error.message}`);
    }
  };

  getAssets = async (query: Partial<Asset>): Promise<Asset[]> => {
    // Filter the assets based on the provided query object
    return this.assets.filter((asset) => {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const queryValue = query[key as keyof Asset];
          const assetValue = asset[key as keyof Asset];

          if (
            this.assetQueryAttributes.includes(key) &&
            queryValue !== undefined &&
            assetValue !== queryValue
          ) {
            // For id, project_id, type, name, and tag, perform a direct comparison
            return false;
          }
        }
      }
      return true;
    });
  };

  getAssetById = async (id: string): Promise<Asset> => {
    return this.assets.find((a) => a.id === id) || ({} as Asset);
  };

  updateAsset = async (id: string, asset: Asset): Promise<Asset> => {
    try {
      const index = this.assets.findIndex((a) => a.id === id);
      if (index !== -1) {
        const validatedAsset = AssetSchema.parse(asset);
        this.assets[index] = { ...validatedAsset, id };
      }
      return { ...asset, id };
    } catch (error) {
      throw new Error(`Error updating asset: ${error.message}`);
    }
  };

  deleteAsset = async (id: string): Promise<void> => {
    this.assets = this.assets.filter((a) => a.id !== id);
  };
}
