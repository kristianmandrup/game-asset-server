import { ApiKey } from "../../models/ApiKey";
import { ApiKeyStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

export class InMemoryApiKeyStore implements ApiKeyStore {
  private apiKeys: Map<string, ApiKey> = new Map();
  private dataStore: DataStore;
  private readonly saltRounds = 10; // For bcrypt hashing

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  async createApiKey(apiKey: ApiKey): Promise<ApiKey> {
    apiKey.id = uuidv4();
    apiKey.created_at = new Date().toISOString();
    apiKey.is_active = true; // Default to active

    // Hash the API key before storing
    const hashedKey = await bcrypt.hash(apiKey.key_hash, this.saltRounds);
    apiKey.key_hash = hashedKey;

    this.apiKeys.set(apiKey.id, { ...apiKey }); // Store a copy
    return Promise.resolve(apiKey);
  }

  async getApiKey(keyHash: string): Promise<ApiKey | undefined> {
    // In a real scenario, you'd iterate and compare hashed keys.
    // For in-memory, we'll simulate by finding the first match.
    for (const apiKey of this.apiKeys.values()) {
      const match = await bcrypt.compare(keyHash, apiKey.key_hash);
      if (match) {
        return Promise.resolve({ ...apiKey });
      }
    }
    return Promise.resolve(undefined);
  }

  async getApiKeyById(id: string): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    return Promise.resolve(apiKey ? { ...apiKey } : undefined);
  }

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    const userApiKeys: ApiKey[] = [];
    for (const apiKey of this.apiKeys.values()) {
      if (apiKey.user_id === userId) {
        userApiKeys.push({ ...apiKey });
      }
    }
    return Promise.resolve(userApiKeys);
  }

  async updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey> {
    const existingKey = this.apiKeys.get(id);
    if (!existingKey) {
      throw new Error(`API Key with id ${id} not found.`);
    }

    const updatedKey = { ...existingKey, ...apiKey };

    // If key_hash is updated, re-hash it
    if (apiKey.key_hash && apiKey.key_hash !== existingKey.key_hash) {
      updatedKey.key_hash = await bcrypt.hash(apiKey.key_hash, this.saltRounds);
    }

    this.apiKeys.set(id, updatedKey);
    return Promise.resolve({ ...updatedKey });
  }

  async deleteApiKey(id: string): Promise<void> {
    const deleted = this.apiKeys.delete(id);
    if (!deleted) {
      throw new Error(`API Key with id ${id} not found.`);
    }
    return Promise.resolve();
  }
}
