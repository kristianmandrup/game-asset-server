import { Project } from "../models/Project";
import { Asset } from "../models/Asset";

export interface DataStore {
  projects: ProjectStore;
  assets: AssetStore;
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
