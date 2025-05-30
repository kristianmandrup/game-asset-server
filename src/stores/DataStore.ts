import { Project } from "../models/Project";
import { Asset } from "../models/Asset";
import { Sound } from "../models/Sound";
import { TileSet } from "../models/TileSet"; // Import TileSet model
import { SpriteSheet } from "../models/SpriteSheet"; // Import SpriteSheet model
import { User } from "../models/User";
import { ApiKey } from "../models/ApiKey";
import { InMemoryCombinedAssetStore } from "./memory/InMemoryCombinedAssetStore";

export interface DataStore {
  projects: ProjectStore;
  assets?: CombinedAssetStore;
  users: UserStore;
  apiKeys: ApiKeyStore;
}

export interface CombinedAssetStore extends AssetStore<Asset> {
  spritesheets: AssetStore<SpriteSheet>;
  tilesets: AssetStore<TileSet>;
  sounds: AssetStore<Sound>;
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

export interface UserStore {
  createUser(user: User): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface ApiKeyStore {
  createApiKey(apiKey: ApiKey): Promise<ApiKey>;
  getApiKey(keyHash: string): Promise<ApiKey | undefined>; // Get by hashed key
  getApiKeyById(id: string): Promise<ApiKey | undefined>; // Get by ID
  getApiKeysByUserId(userId: string): Promise<ApiKey[]>;
  updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey>;
  deleteApiKey(id: string): Promise<void>;
}
