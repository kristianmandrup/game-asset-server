import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { Database } from "sqlite3";
import { Sound } from "../../models/Sound";
import { DataStore } from "../DataStore";

export class DatabaseSoundAssetStore extends DatabaseAssetStore<Sound> {
  constructor(db: Database, dataStore: DataStore) {
    super(db, dataStore, "sounds");
  }

  protected async createTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          type TEXT NOT NULL,
          tag TEXT NOT NULL,
          name TEXT NOT NULL,
          asset_file TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          volume REAL,
          duration REAL
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  protected serialize(asset: Sound): any[] {
    return [
      asset.id,
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      asset.volume || null,
      asset.duration || null,
    ];
  }

  protected deserialize(row: any): Sound {
    return {
      id: row.id,
      project_id: row.project_id,
      type: row.type,
      tag: row.tag,
      name: row.name,
      asset_file: row.asset_file,
      file_size: row.file_size,
      volume: row.volume,
      duration: row.duration,
    } as Sound;
  }

  protected getColumns(): string {
    return "id, project_id, type, tag, name, asset_file, file_size, volume, duration";
  }

  protected getPlaceholders(): string {
    return "?, ?, ?, ?, ?, ?, ?, ?, ?";
  }

  protected getUpdateSet(): string {
    return "project_id = ?, type = ?, tag = ?, name = ?, asset_file = ?, file_size = ?, volume = ?, duration = ?";
  }

  protected serializeUpdate(asset: Sound): any[] {
    return [
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      asset.volume || null,
      asset.duration || null,
      asset.id,
    ];
  }
}
