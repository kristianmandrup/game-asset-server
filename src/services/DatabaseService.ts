import { DataStore } from "../stores/DataStore";
import { Project, ProjectSchema } from "../models/Project";
import { Asset } from "../models/Asset";
import { DatabaseDataStore } from "../stores/sqldb/DatabaseDataStore";

export class DatabaseService {
  private dataStore: DataStore;

  constructor() {
    this.dataStore = new DatabaseDataStore();
  }

  createProject = async (project: Project): Promise<Project> => {
    try {
      const validatedProject = ProjectSchema.parse(project);
      const newProject = await this.dataStore.projects.createProject(
        validatedProject
      );
      return newProject;
    } catch (error) {
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
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  };

  deleteProject = async (id: string): Promise<void> => {
    await this.dataStore.projects.deleteProject(id);
  };

  createAsset = async (asset: Asset): Promise<Asset> => {
    try {
      return await this.dataStore.assets.createAsset(asset);
    } catch (error) {
      throw new Error(`Error creating asset: ${error.message}`);
    }
  };

  getAssets = async (query: any): Promise<Asset[]> => {
    return await this.dataStore.assets.getAssets(query);
  };

  getAssetById = async (id: string): Promise<Asset> => {
    return await this.dataStore.assets.getAssetById(id);
  };

  updateAsset = async (id: string, asset: Asset): Promise<Asset> => {
    try {
      return await this.dataStore.assets.updateAsset(id, asset);
    } catch (error) {
      throw new Error(`Error updating asset: ${error.message}`);
    }
  };

  deleteAsset = async (id: string): Promise<void> => {
    await this.dataStore.assets.deleteAsset(id);
  };
}
