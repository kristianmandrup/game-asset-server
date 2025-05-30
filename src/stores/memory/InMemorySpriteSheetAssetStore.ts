import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { Asset } from "../../models/Asset";
import { SpriteSheetSchema } from "../../models/SpriteSheet";

export class InMemorySpriteSheetAssetStore extends InMemoryAssetStore {
  constructor(dataStore: InMemoryDataStore) {
    super(dataStore);
  }

  /**
   * Creates a new SpriteSheet asset.
   * @param asset The SpriteSheet asset to create.
   * @returns A Promise that resolves to the created SpriteSheet asset.
   */
  createSpriteSheet = async (asset: Asset): Promise<Asset> => {
    if (asset.type !== "spritesheet") {
      throw new Error(
        "Asset type must be 'spritesheet' for createSpriteSheet."
      );
    }
    try {
      // Validate the spritesheet-specific data
      if (asset.spritesheet) {
        SpriteSheetSchema.parse(asset.spritesheet);
      } else {
        throw new Error("SpriteSheet data is missing.");
      }
      return this.createAsset(asset);
    } catch (error: any) {
      throw new Error(`Error creating spritesheet asset: ${error.message}`);
    }
  };

  /**
   * Retrieves all SpriteSheet assets, optionally filtered by a query.
   * @param query An optional query object to filter SpriteSheet assets.
   * @returns A Promise that resolves to an array of SpriteSheet assets.
   */
  getSpriteSheets = async (query?: Partial<Asset>): Promise<Asset[]> => {
    const combinedQuery: Partial<Asset> = { ...query, type: "spritesheet" };
    return this.getAssets(combinedQuery);
  };

  /**
   * Retrieves a SpriteSheet asset by its ID.
   * @param id The ID of the SpriteSheet asset to retrieve.
   * @returns A Promise that resolves to the SpriteSheet asset, or an empty object if not found.
   */
  getSpriteSheetById = async (id: string): Promise<Asset> => {
    const asset = await this.getAssetById(id);
    if (asset.type === "spritesheet") {
      return asset;
    }
    return {} as Asset; // Return empty object if not a spritesheet or not found
  };

  /**
   * Updates an existing SpriteSheet asset.
   * @param id The ID of the SpriteSheet asset to update.
   * @param asset The updated SpriteSheet asset data.
   * @returns A Promise that resolves to the updated SpriteSheet asset.
   */
  updateSpriteSheet = async (id: string, asset: Asset): Promise<Asset> => {
    if (asset.type !== "spritesheet") {
      throw new Error(
        "Asset type must be 'spritesheet' for updateSpriteSheet."
      );
    }
    try {
      // Validate the spritesheet-specific data
      if (asset.spritesheet) {
        SpriteSheetSchema.parse(asset.spritesheet);
      } else {
        throw new Error("SpriteSheet data is missing.");
      }
      return this.updateAsset(id, asset);
    } catch (error: any) {
      throw new Error(`Error updating spritesheet asset: ${error.message}`);
    }
  };

  /**
   * Deletes a SpriteSheet asset by its ID.
   * @param id The ID of the SpriteSheet asset to delete.
   * @returns A Promise that resolves when the SpriteSheet asset is deleted.
   */
  deleteSpriteSheet = async (id: string): Promise<void> => {
    // First, verify it's a spritesheet before deleting
    const assetToDelete = await this.getAssetById(id);
    if (assetToDelete.type === "spritesheet") {
      return this.deleteAsset(id);
    }
    // If it's not a spritesheet, or not found, do nothing or throw an error
    throw new Error(
      `Asset with ID ${id} is not a spritesheet or does not exist.`
    );
  };
}
