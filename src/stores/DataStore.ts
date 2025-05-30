import { Project } from "../models/Project";
import { Asset } from "../models/Asset";

export interface DataStore {
  projects: ProjectStore;
  assets: AssetStore<Asset>;
}

export interface ProjectStore {
  createProject(project: Project): Promise<Project>;
  getProjects(query: any): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  updateProject(id: string, project: Project): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}

export interface AssetStore<T extends Asset> {
  createAsset(asset: T): Promise<T>;
  getAssets(query?: Partial<T>): Promise<T[]>;
  getAssetById(id: string): Promise<T | undefined>;
  updateAsset(id: string, asset: T): Promise<T>;
  deleteAsset(id: string): Promise<void>;
}
