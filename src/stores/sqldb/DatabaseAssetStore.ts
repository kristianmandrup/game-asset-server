import { Asset } from "../../models/Asset";
import { AssetStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

export class DatabaseAssetStore<T extends Asset> implements AssetStore<T> {
  protected db: DrizzleDb;
  protected dataStore: DataStore;
  protected tableName: string; // Keep tableName for consistency, though not directly used in Drizzle queries

  constructor(db: DrizzleDb, dataStore: DataStore, tableName: string) {
    this.db = db;
    this.dataStore = dataStore;
    this.tableName = tableName;
  }

  async createAsset(asset: T): Promise<T> {
    const newAsset = {
      ...asset,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      // Handle asset-specific details for JSONB columns
      soundDetails: asset.type === "sound" ? (asset as any).soundDetails : null,
      spriteSheetDetails:
        asset.type === "spritesheet" ? (asset as any).spriteSheetDetails : null,
      tileSetDetails:
        asset.type === "tileset" ? (asset as any).tileSetDetails : null,
    };

    const result = await (this.db as any)
      .insert(schema.assets)
      .values(newAsset)
      .returning();
    return result[0] as T;
  }

  async getAssets(query?: Partial<T>): Promise<T[]> {
    const conditions = [];
    if (query?.projectId) {
      conditions.push(eq(schema.assets.projectId, query.projectId));
    }
    if (query?.type) {
      conditions.push(eq(schema.assets.type, query.type));
    }
    if (query?.tag) {
      conditions.push(eq(schema.assets.tag, query.tag));
    }
    if (query?.name) {
      conditions.push(eq(schema.assets.name, query.name));
    }

    const assets = await (this.db as any).query.assets.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
    });
    return assets as T[];
  }

  async getAssetById(id: string): Promise<T | undefined> {
    const asset = await (this.db as any).query.assets.findFirst({
      where: eq(schema.assets.id, id),
    });
    return asset as T | undefined;
  }

  async updateAsset(id: string, asset: T): Promise<T> {
    const updatedAsset = {
      ...asset,
      updatedAt: new Date(),
      // Handle asset-specific details for JSONB columns
      soundDetails: asset.type === "sound" ? (asset as any).soundDetails : null,
      spriteSheetDetails:
        asset.type === "spritesheet" ? (asset as any).spriteSheetDetails : null,
      tileSetDetails:
        asset.type === "tileset" ? (asset as any).tileSetDetails : null,
    };

    const result = await (this.db as any)
      .update(schema.assets)
      .set(updatedAsset)
      .where(eq(schema.assets.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`Asset with id ${id} not found.`);
    }
    return result[0] as T;
  }

  async deleteAsset(id: string): Promise<void> {
    const result = await (this.db as any)
      .delete(schema.assets)
      .where(eq(schema.assets.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`Asset with id ${id} not found.`);
    }
  }
}
