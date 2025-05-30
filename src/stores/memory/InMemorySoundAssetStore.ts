import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { Asset } from "../../models/Asset";
import { SoundSchema } from "../../models/Sound";

export class InMemorySoundAssetStore extends InMemoryAssetStore {
  constructor(dataStore: InMemoryDataStore) {
    super(dataStore);
  }

  /**
   * Creates a new Sound asset.
   * @param sound The Sound asset to create.
   * @returns A Promise that resolves to the created Sound asset.
   */
  createSound = async (sound: Asset): Promise<Asset> => {
    if (sound.type !== "sound") {
      throw new Error("Asset type must be 'sound' for createSound.");
    }
    try {
      // Validate the sound-specific data
      if (sound.sound) {
        SoundSchema.parse(sound.sound);
      } else {
        throw new Error("Sound data is missing.");
      }
      return this.createAsset(sound);
    } catch (error: any) {
      throw new Error(`Error creating sound asset: ${error.message}`);
    }
  };

  /**
   * Retrieves all Sound assets, optionally filtered by a query.
   * @param query An optional query object to filter Sound assets.
   * @returns A Promise that resolves to an array of Sound assets.
   */
  getSounds = async (query?: Partial<Asset>): Promise<Asset[]> => {
    const combinedQuery: Partial<Asset> = { ...query, type: "sound" };
    return this.getAssets(combinedQuery);
  };

  /**
   * Retrieves a Sound asset by its ID.
   * @param id The ID of the Sound asset to retrieve.
   * @returns A Promise that resolves to the Sound asset, or an empty object if not found.
   */
  getSoundById = async (id: string): Promise<Asset> => {
    const asset = await this.getAssetById(id);
    if (asset.type === "sound") {
      return asset;
    }
    return {} as Asset; // Return empty object if not a sound or not found
  };

  /**
   * Updates an existing Sound asset.
   * @param id The ID of the Sound asset to update.
   * @param sound The updated Sound asset data.
   * @returns A Promise that resolves to the updated Sound asset.
   */
  updateSound = async (id: string, sound: Asset): Promise<Asset> => {
    if (sound.type !== "sound") {
      throw new Error("Asset type must be 'sound' for updateSound.");
    }
    try {
      // Validate the sound-specific data
      if (sound.sound) {
        SoundSchema.parse(sound.sound);
      } else {
        throw new Error("Sound data is missing.");
      }
      return this.updateAsset(id, sound);
    } catch (error: any) {
      throw new Error(`Error updating sound asset: ${error.message}`);
    }
  };

  /**
   * Deletes a Sound asset by its ID.
   * @param id The ID of the Sound asset to delete.
   * @returns A Promise that resolves when the Sound asset is deleted.
   */
  deleteSound = async (id: string): Promise<void> => {
    // First, verify it's a sound before deleting
    const assetToDelete = await this.getAssetById(id);
    if (assetToDelete.type === "sound") {
      return this.deleteAsset(id);
    }
    // If it's not a sound, or not found, do nothing or throw an error
    throw new Error(`Asset with ID ${id} is not a sound or does not exist.`);
  };
}
