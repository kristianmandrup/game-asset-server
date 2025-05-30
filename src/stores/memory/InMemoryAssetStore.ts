import { Asset, AssetSchema } from "../../models/Asset";
import { v4 as uuidv4 } from "uuid";
import { AssetStore } from "../DataStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { z } from "zod";

export class InMemoryAssetStore<T extends Asset> implements AssetStore<T> {
  private dataStore: InMemoryDataStore;
  private assets: T[] = [];
  private assetQueryAttributes = ["id", "project_id", "type", "name", "tag"];

  constructor(dataStore: InMemoryDataStore) {
    this.dataStore = dataStore;
  }

  async createAsset(asset: T): Promise<T> {
    try {
      // Validate the asset data against the appropriate schema (e.g. SpriteSheetSchema, TileSetSchema, etc.)
      // We need to use the specific schema for T, but AssetSchema is a union.
      // For InMemoryAssetStore, we can assume the incoming asset is already validated by the specific store (e.g., InMemorySoundAssetStore)
      // Or, we can try to parse it with the general AssetSchema and rely on Zod's discriminated union to pick the right one.
      const validatedAsset = AssetSchema.parse(asset) as T; // Cast to T after parsing
      const newAsset = { ...validatedAsset, id: uuidv4() };
      this.assets.push(newAsset);
      return newAsset;
    } catch (error: any) {
      throw new Error(`Error creating asset: ${error.message}`);
    }
  }

  async getAssets(query: Partial<T>): Promise<T[]> {
    // Filter the assets based on the provided query object
    return this.assets.filter((asset) => {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const queryValue = query[key as keyof T];
          const assetValue = asset[key as keyof T];

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
  }

  async getAssetById(id: string): Promise<T | undefined> {
    return this.assets.find((a) => a.id === id);
  }

  async updateAsset(id: string, asset: T): Promise<T> {
    try {
      const index = this.assets.findIndex((a) => a.id === id);
      if (index !== -1) {
        const validatedAsset = AssetSchema.parse(asset) as T; // Cast to T after parsing
        this.assets[index] = { ...validatedAsset, id };
        return this.assets[index];
      }
      throw new Error(`Asset with id ${id} not found.`);
    } catch (error: any) {
      throw new Error(`Error updating asset: ${error.message}`);
    }
  }

  async deleteAsset(id: string): Promise<void> {
    this.assets = this.assets.filter((a) => a.id !== id);
  }
}
