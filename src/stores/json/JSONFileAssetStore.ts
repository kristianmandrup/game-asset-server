import { Asset } from "../../models/Asset";
import { AssetStore, DataStore } from "../DataStore";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export class JSONFileAssetStore<T extends Asset> implements AssetStore<T> {
  private filePath: string;
  private assets: Map<string, T> = new Map();
  private dataStore: DataStore;

  constructor(
    dataStore: DataStore,
    filePath: string = path.join(__dirname, "../data/assets.json")
  ) {
    this.filePath = filePath;
    this.dataStore = dataStore;
    this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const assetsArray: T[] = JSON.parse(data);
      this.assets = new Map(
        assetsArray
          .filter((asset) => asset.id !== undefined)
          .map((asset) => [asset.id as string, asset])
      );
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // File does not exist, initialize with empty data
        await this.saveAssets();
      } else {
        console.error("Error loading assets:", error);
      }
    }
  }

  private async saveAssets(): Promise<void> {
    try {
      const assetsArray = Array.from(this.assets.values());
      await fs.writeFile(
        this.filePath,
        JSON.stringify(assetsArray, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error saving assets:", error);
    }
  }

  async createAsset(asset: T): Promise<T> {
    asset.id = uuidv4();
    this.assets.set(asset.id, asset);
    await this.saveAssets();
    return asset;
  }

  async getAssets(query: any): Promise<T[]> {
    // For simplicity, query is not fully implemented. Returns all assets.
    return Array.from(this.assets.values());
  }

  async getAssetById(id: string): Promise<T> {
    return this.assets.get(id) as T;
  }

  async updateAsset(id: string, asset: T): Promise<T> {
    if (!this.assets.has(id)) {
      throw new Error(`Asset with id ${id} not found.`);
    }
    this.assets.set(id, { ...this.assets.get(id), ...asset, id });
    await this.saveAssets();
    return this.assets.get(id) as T;
  }

  async deleteAsset(id: string): Promise<void> {
    if (!this.assets.has(id)) {
      throw new Error(`Asset with id ${id} not found.`);
    }
    this.assets.delete(id);
    await this.saveAssets();
  }
}
