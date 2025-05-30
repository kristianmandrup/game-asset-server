import { ApiKey, ApiKeySchema } from "../../models/ApiKey";
import { ApiKeyStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type
import * as schema from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class DatabaseApiKeyStore implements ApiKeyStore {
  private db: DrizzleDb;
  private dataStore: DataStore;
  private readonly saltRounds = 10; // For bcrypt hashing

  constructor(db: DrizzleDb, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
  }

  async createApiKey(apiKey: ApiKey): Promise<ApiKey> {
    const hashedKey = await bcrypt.hash(apiKey.key_hash, this.saltRounds);
    const newApiKey = {
      ...apiKey,
      id: uuidv4(),
      key_hash: hashedKey,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true, // Default to active
      // Ensure permissions is stored as JSONB
      permissions: apiKey.permissions || null,
      expires_at: apiKey.expires_at || null,
      last_used_at: apiKey.last_used_at || null,
    };

    const result = await (this.db as any)
      .insert(schema.apiKeys)
      .values(newApiKey)
      .returning();
    return result[0];
  }

  async getApiKey(key_hash: string): Promise<ApiKey | undefined> {
    // When retrieving, we need to compare the provided key_hash with the stored hashed key
    // This typically means iterating through all keys and comparing, or storing a searchable prefix
    // For simplicity and security, Drizzle doesn't directly support bcrypt comparison in queries.
    // A common pattern is to retrieve by user_id and then compare, or if keyHash is unique, retrieve by keyHash.
    // Since keyHash is unique, we'll retrieve by it and then compare.
    // NOTE: This is not how API key validation usually works. You'd hash the incoming key and compare to stored hash.
    // The `getApiKey` method here seems to imply getting by the *hashed* key, which is unusual for an external API.
    // Assuming `keyHash` here means the *stored hashed key* for lookup.
    const apiKey = await (this.db as any).query.apiKeys.findFirst({
      where: eq(schema.apiKeys.keyHash, key_hash),
    });
    return apiKey;
  }

  async getApiKeyById(id: string): Promise<ApiKey | undefined> {
    const apiKey = await (this.db as any).query.apiKeys.findFirst({
      where: eq(schema.apiKeys.id, id),
    });
    return apiKey;
  }

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    const apiKeys = await (this.db as any).query.apiKeys.findMany({
      where: eq(schema.apiKeys.userId, userId),
    });
    return apiKeys;
  }

  async updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey> {
    const updatedApiKey = {
      ...apiKey,
      updated_at: new Date(),
      // Ensure permissions is stored as JSONB
      permissions:
        apiKey.permissions === undefined
          ? undefined
          : apiKey.permissions || null,
      expires_at:
        apiKey.expires_at === undefined ? undefined : apiKey.expires_at || null,
      last_used_at:
        apiKey.last_used_at === undefined
          ? undefined
          : apiKey.last_used_at || null,
      is_active: apiKey.is_active === undefined ? undefined : apiKey.is_active,
    };

    // If key_hash is being updated, hash it
    if (updatedApiKey.key_hash) {
      updatedApiKey.key_hash = await bcrypt.hash(
        updatedApiKey.key_hash,
        this.saltRounds
      );
    }

    const result = await (this.db as any)
      .update(schema.apiKeys)
      .set(updatedApiKey)
      .where(eq(schema.apiKeys.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`API Key with id ${id} not found.`);
    }
    return result[0];
  }

  async deleteApiKey(id: string): Promise<void> {
    const result = await (this.db as any)
      .delete(schema.apiKeys)
      .where(eq(schema.apiKeys.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`API Key with id ${id} not found.`);
    }
  }
}
