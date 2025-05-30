import { ApiKey, ApiKeySchema } from "../../models/ApiKey";
import { ApiKeyStore, DataStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

export class DatabaseApiKeyStore implements ApiKeyStore {
  private db: sqlite3.Database;
  private dataStore: DataStore;
  private readonly saltRounds = 10; // For bcrypt hashing

  constructor(db: sqlite3.Database, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
    this.initSchema();
  }

  private initSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        key_hash TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        name TEXT,
        permissions TEXT, -- Stored as JSON string
        rate_limit_tier TEXT,
        created_at TEXT NOT NULL,
        expires_at TEXT,
        last_used_at TEXT,
        is_active INTEGER NOT NULL, -- SQLite stores booleans as INTEGER (0 or 1)
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }

  async createApiKey(apiKey: ApiKey): Promise<ApiKey> {
    apiKey.id = uuidv4();
    apiKey.created_at = new Date().toISOString();
    apiKey.is_active = true; // Default to active

    // Hash the API key before storing
    const hashedKey = await bcrypt.hash(apiKey.key_hash, this.saltRounds);
    apiKey.key_hash = hashedKey;

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO api_keys (id, key_hash, user_id, name, permissions, rate_limit_tier, created_at, expires_at, last_used_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          apiKey.id,
          apiKey.key_hash,
          apiKey.user_id,
          apiKey.name,
          JSON.stringify(apiKey.permissions), // Store array as JSON string
          apiKey.rate_limit_tier,
          apiKey.created_at,
          apiKey.expires_at,
          apiKey.last_used_at,
          apiKey.is_active ? 1 : 0, // Convert boolean to integer
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(apiKey);
          }
        }
      );
    });
  }

  private parseApiKeyRow(row: any): ApiKey {
    if (row.permissions) {
      row.permissions = JSON.parse(row.permissions as string);
    }
    row.is_active = (row.is_active as number) === 1;
    return row as ApiKey;
  }

  async getApiKey(keyHash: string): Promise<ApiKey | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM api_keys WHERE key_hash = ?`,
        [keyHash],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(this.parseApiKeyRow(row));
          } else {
            resolve(undefined);
          }
        }
      );
    });
  }

  async getApiKeyById(id: string): Promise<ApiKey | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM api_keys WHERE id = ?`,
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(this.parseApiKeyRow(row));
          } else {
            resolve(undefined);
          }
        }
      );
    });
  }

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM api_keys WHERE user_id = ?`,
        [userId],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            const apiKeys = rows.map((row) => this.parseApiKeyRow(row));
            resolve(apiKeys);
          }
        }
      );
    });
  }

  async updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey> {
    apiKey.expires_at = apiKey.expires_at || null; // Ensure null for no expiry
    apiKey.last_used_at = apiKey.last_used_at || null; // Ensure null for no last used

    const fields: string[] = [];
    const values: any[] = [];

    for (const key in apiKey) {
      if (apiKey.hasOwnProperty(key) && key !== "id") {
        let value = (apiKey as any)[key];
        if (key === "permissions") {
          value = JSON.stringify(value);
        } else if (key === "is_active") {
          value = value ? 1 : 0;
        }
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.getApiKeyById(id) // Use getApiKeyById
        .then((foundKey) => {
          if (!foundKey) {
            throw new Error(`API Key with id ${id} not found.`);
          }
          return foundKey;
        })
        .catch((err) => {
          throw err;
        });
    }

    const _dataStore = this.dataStore; // Capture this.dataStore

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE api_keys SET ${fields.join(", ")} WHERE id = ?`,
        [...values, id],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`API Key with id ${id} not found.`));
          } else {
            _dataStore.apiKeys
              .getApiKeyById(id) // Use getApiKeyById
              .then((updatedKey) => {
                if (updatedKey) {
                  resolve(updatedKey);
                } else {
                  reject(
                    new Error(`API Key with id ${id} not found after update.`)
                  );
                }
              })
              .catch(reject);
          }
        }
      );
    });
  }

  async deleteApiKey(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM api_keys WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`API Key with id ${id} not found.`));
        } else {
          resolve();
        }
      });
    });
  }
}
