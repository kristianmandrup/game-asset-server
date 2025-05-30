import { DataStore } from "../stores/DataStore";
import { Project, ProjectSchema } from "../models/Project";
import { Asset } from "../models/Asset";
import { Sound } from "../models/Sound";
import { SpriteSheet } from "../models/SpriteSheet";
import { TileSet } from "../models/TileSet";

export class DatabaseService {
  private dataStore: DataStore;

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  createProject = async (project: Project): Promise<Project> => {
    try {
      const validatedProject = ProjectSchema.parse(project);
      const newProject = await this.dataStore.projects.createProject(
        validatedProject
      );
      return newProject;
    } catch (error: any) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  };

  getProjects = async (query: any): Promise<Project[]> => {
    return await this.dataStore.projects.getProjects(query);
  };

  getProjectById = async (id: string): Promise<Project> => {
    return await this.dataStore.projects.getProjectById(id);
  };

  updateProject = async (id: string, project: Project): Promise<Project> => {
    try {
      return await this.dataStore.projects.updateProject(id, project);
    } catch (error: any) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  };

  deleteProject = async (id: string): Promise<void> => {
    await this.dataStore.projects.deleteProject(id);
  };

  createAsset = async (asset: Asset): Promise<Asset> => {
    try {
      return await this.dataStore.assets!.createAsset(asset);
    } catch (error: any) {
      throw new Error(`Error creating asset: ${error.message}`);
    }
  };

  getAssets = async (query: any): Promise<Asset[]> => {
    return await this.dataStore.assets!.getAssets(query);
  };

  getAssetById = async (id: string): Promise<Asset | undefined> => {
    return await this.dataStore.assets!.getAssetById(id);
  };

  updateAsset = async (id: string, asset: Asset): Promise<Asset> => {
    try {
      return await this.dataStore.assets!.updateAsset(id, asset);
    } catch (error: any) {
      throw new Error(`Error updating asset: ${error.message}`);
    }
  };

  deleteAsset = async (id: string): Promise<void> => {
    await this.dataStore.assets!.deleteAsset(id);
  };

  createSound = async (sound: Sound): Promise<Sound> => {
    try {
      return await this.dataStore.assets!.sounds.createAsset(sound);
    } catch (error: any) {
      throw new Error(`Error creating sound asset: ${error.message}`);
    }
  };

  getSounds = async (query: any): Promise<Sound[]> => {
    return await this.dataStore.assets!.sounds.getAssets(query);
  };

  getSoundById = async (id: string): Promise<Sound | undefined> => {
    return await this.dataStore.assets!.sounds.getAssetById(id);
  };

  updateSound = async (id: string, sound: Sound): Promise<Sound> => {
    try {
      return await this.dataStore.assets!.sounds.updateAsset(id, sound);
    } catch (error: any) {
      throw new Error(`Error updating sound asset: ${error.message}`);
    }
  };

  deleteSound = async (id: string): Promise<void> => {
    await this.dataStore.assets!.sounds.deleteAsset(id);
  };

  createSpriteSheet = async (
    spritesheet: SpriteSheet
  ): Promise<SpriteSheet> => {
    try {
      return await this.dataStore.assets!.spritesheets.createAsset(spritesheet);
    } catch (error: any) {
      throw new Error(`Error creating spritesheet asset: ${error.message}`);
    }
  };

  getSpriteSheets = async (query: any): Promise<SpriteSheet[]> => {
    return await this.dataStore.assets!.spritesheets.getAssets(query);
  };

  getSpriteSheetById = async (id: string): Promise<SpriteSheet | undefined> => {
    return await this.dataStore.assets!.spritesheets.getAssetById(id);
  };

  updateSpriteSheet = async (
    id: string,
    spritesheet: SpriteSheet
  ): Promise<SpriteSheet> => {
    try {
      return await this.dataStore.assets!.spritesheets.updateAsset(
        id,
        spritesheet
      );
    } catch (error: any) {
      throw new Error(`Error updating spritesheet asset: ${error.message}`);
    }
  };

  deleteSpriteSheet = async (id: string): Promise<void> => {
    await this.dataStore.assets!.spritesheets.deleteAsset(id);
  };

  createTileSet = async (tileset: TileSet): Promise<TileSet> => {
    try {
      return await this.dataStore.assets!.tilesets.createAsset(tileset);
    } catch (error: any) {
      throw new Error(`Error creating tileset asset: ${error.message}`);
    }
  };

  getTileSets = async (query: any): Promise<TileSet[]> => {
    return await this.dataStore.assets!.tilesets.getAssets(query);
  };

  getTileSetById = async (id: string): Promise<TileSet | undefined> => {
    return await this.dataStore.assets!.tilesets.getAssetById(id);
  };

  updateTileSet = async (id: string, tileset: TileSet): Promise<TileSet> => {
    try {
      return await this.dataStore.assets!.tilesets.updateAsset(id, tileset);
    } catch (error: any) {
      throw new Error(`Error updating tileset asset: ${error.message}`);
    }
  };

  deleteTileSet = async (id: string): Promise<void> => {
    await this.dataStore.assets!.tilesets.deleteAsset(id);
  };
}
