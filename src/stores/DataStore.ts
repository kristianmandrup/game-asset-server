import { Project } from "../models/Project";
import { Asset } from "../models/Asset";
import { Sound } from "../models/Sound";

export interface DataStore {
  projects: ProjectStore;
  assets: AssetStore;
  sounds: SoundAssetStore; // Add this line
}

export interface ProjectStore {
  createProject(project: Project): Promise<Project>;
  getProjects(query: any): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  updateProject(id: string, project: Project): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}

export interface AssetStore {
  createAsset(asset: Asset): Promise<Asset>;
  getAssets(query: any): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset>;
  updateAsset(id: string, asset: Asset): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
}

export interface SoundAssetStore {
  createSound(sound: Asset): Promise<Asset>;
  getSounds(query?: Partial<Asset>): Promise<Asset[]>;
  getSoundById(id: string): Promise<Asset>;
  updateSound(id: string, sound: Asset): Promise<Asset>;
  deleteSound(id: string): Promise<void>;
}
