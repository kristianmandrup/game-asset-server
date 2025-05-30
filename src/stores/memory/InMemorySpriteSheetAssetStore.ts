import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { SpriteSheet, SpriteSheetSchema } from "../../models/SpriteSheet";

export class InMemorySpriteSheetAssetStore extends InMemoryAssetStore<SpriteSheet> {
  constructor(dataStore: InMemoryDataStore) {
    super(dataStore);
  }

  /**
   * Creates a new SpriteSheet asset.
   * @param spritesheet The SpriteSheet asset to create.
   * @returns A Promise that resolves to the created SpriteSheet asset.
   */
  createSpriteSheet = async (
    spritesheet: SpriteSheet
  ): Promise<SpriteSheet> => {
    try {
      SpriteSheetSchema.parse(spritesheet); // Validate the spritesheet asset
      return this.createAsset(spritesheet);
    } catch (error: any) {
      throw new Error(`Error creating spritesheet asset: ${error.message}`);
    }
  };

  /**
   * Retrieves all SpriteSheet assets, optionally filtered by a query.
   * @param query An optional query object to filter SpriteSheet assets.
   * @returns A Promise that resolves to an array of SpriteSheet assets.
   */
  getSpriteSheets = async (
    query?: Partial<SpriteSheet>
  ): Promise<SpriteSheet[]> => {
    const assets = await this.getAssets(query || {});
    return assets.filter(
      (asset): asset is SpriteSheet => asset.type === "spritesheet"
    );
  };

  /**
   * Retrieves a SpriteSheet asset by its ID.
   * @param id The ID of the SpriteSheet asset to retrieve.
   * @returns A Promise that resolves to the SpriteSheet asset, or undefined if not found or not a spritesheet.
   */
  getSpriteSheetById = async (id: string): Promise<SpriteSheet | undefined> => {
    const asset = await this.getAssetById(id);
    if (asset && asset.type === "spritesheet") {
      return asset as SpriteSheet;
    }
    return undefined;
  };

  /**
   * Updates an existing SpriteSheet asset.
   * @param id The ID of the SpriteSheet asset to update.
   * @param spritesheet The updated SpriteSheet asset data.
   * @returns A Promise that resolves to the updated SpriteSheet asset.
   */
  updateSpriteSheet = async (
    id: string,
    spritesheet: SpriteSheet
  ): Promise<SpriteSheet> => {
    try {
      SpriteSheetSchema.parse(spritesheet); // Validate the spritesheet asset
      return this.updateAsset(id, spritesheet);
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
    if (assetToDelete && assetToDelete.type === "spritesheet") {
      return this.deleteAsset(id);
    }
    // If it's not a spritesheet, or not found, do nothing or throw an error
    throw new Error(
      `Asset with ID ${id} is not a spritesheet or does not exist.`
    );
  };
}
