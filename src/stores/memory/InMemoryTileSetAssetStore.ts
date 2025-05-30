import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { Asset } from "../../models/Asset";
import { TileSetSchema } from "../../models/TileSet";

export class InMemoryTileSetAssetStore extends InMemoryAssetStore {
  constructor(dataStore: InMemoryDataStore) {
    super(dataStore);
  }

  /**
   * Creates a new TileSet asset.
   * @param tileset The TileSet asset to create.
   * @returns A Promise that resolves to the created TileSet asset.
   */
  createTileSet = async (tileset: Asset): Promise<Asset> => {
    if (tileset.type !== "tileset") {
      throw new Error("Asset type must be 'tileset' for createTileSet.");
    }
    try {
      // Validate the tileset-specific data
      if (tileset.tileset) {
        TileSetSchema.parse(tileset.tileset);
      } else {
        throw new Error("TileSet data is missing.");
      }
      return this.createAsset(tileset);
    } catch (error: any) {
      throw new Error(`Error creating tileset asset: ${error.message}`);
    }
  };

  /**
   * Retrieves all TileSet assets, optionally filtered by a query.
   * @param query An optional query object to filter TileSet assets.
   * @returns A Promise that resolves to an array of TileSet assets.
   */
  getTileSets = async (query?: Partial<Asset>): Promise<Asset[]> => {
    const combinedQuery: Partial<Asset> = { ...query, type: "tileset" };
    return this.getAssets(combinedQuery);
  };

  /**
   * Retrieves a TileSet asset by its ID.
   * @param id The ID of the TileSet asset to retrieve.
   * @returns A Promise that resolves to the TileSet asset, or an empty object if not found.
   */
  getTileSetById = async (id: string): Promise<Asset> => {
    const asset = await this.getAssetById(id);
    if (asset.type === "tileset") {
      return asset;
    }
    return {} as Asset; // Return empty object if not a tileset or not found
  };

  /**
   * Updates an existing TileSet asset.
   * @param id The ID of the TileSet asset to update.
   * @param tileset The updated TileSet asset data.
   * @returns A Promise that resolves to the updated TileSet asset.
   */
  updateTileSet = async (id: string, tileset: Asset): Promise<Asset> => {
    if (tileset.type !== "tileset") {
      throw new Error("Asset type must be 'tileset' for updateTileSet.");
    }
    try {
      // Validate the tileset-specific data
      if (tileset.tileset) {
        TileSetSchema.parse(tileset.tileset);
      } else {
        throw new Error("TileSet data is missing.");
      }
      return this.updateAsset(id, tileset);
    } catch (error: any) {
      throw new Error(`Error updating tileset asset: ${error.message}`);
    }
  };

  /**
   * Deletes a TileSet asset by its ID.
   * @param id The ID of the TileSet asset to delete.
   * @returns A Promise that resolves when the TileSet asset is deleted.
   */
  deleteTileSet = async (id: string): Promise<void> => {
    // First, verify it's a tileset before deleting
    const assetToDelete = await this.getAssetById(id);
    if (assetToDelete.type === "tileset") {
      return this.deleteAsset(id);
    }
    // If it's not a tileset, or not found, do nothing or throw an error
    throw new Error(`Asset with ID ${id} is not a tileset or does not exist.`);
  };
}
