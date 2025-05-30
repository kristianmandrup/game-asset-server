import { InMemoryAssetStore } from "./InMemoryAssetStore";
import { InMemoryDataStore } from "./InMemoryDataStore";
import { Asset } from "../../models/Asset";
import { Sound, SoundSchema } from "../../models/Sound";

export class InMemorySoundAssetStore extends InMemoryAssetStore<Sound> {
  constructor(dataStore: InMemoryDataStore) {
    super(dataStore);
  }

  /**
   * Creates a new Sound asset.
   * @param sound The Sound asset to create.
   * @returns A Promise that resolves to the created Sound asset.
   */
  createSound = async (sound: Sound): Promise<Sound> => {
    try {
      SoundSchema.parse(sound); // Validate the sound asset
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
  getSounds = async (query?: Partial<Sound>): Promise<Sound[]> => {
    const assets = await this.getAssets(query || {});
    return assets.filter((asset): asset is Sound => asset.type === "sound");
  };

  /**
   * Retrieves a Sound asset by its ID.
   * @param id The ID of the Sound asset to retrieve.
   * @returns A Promise that resolves to the Sound asset, or undefined if not found or not a sound.
   */
  getSoundById = async (id: string): Promise<Sound | undefined> => {
    const asset = await this.getAssetById(id);
    if (asset && asset.type === "sound") {
      return asset as Sound;
    }
    return undefined;
  };

  /**
   * Updates an existing Sound asset.
   * @param id The ID of the Sound asset to update.
   * @param sound The updated Sound asset data.
   * @returns A Promise that resolves to the updated Sound asset.
   */
  updateSound = async (id: string, sound: Sound): Promise<Sound> => {
    try {
      SoundSchema.parse(sound); // Validate the sound asset
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
    if (assetToDelete && assetToDelete.type === "sound") {
      return this.deleteAsset(id);
    }
    // If it's not a sound, or not found, do nothing or throw an error
    throw new Error(`Asset with ID ${id} is not a sound or does not exist.`);
  };
}
