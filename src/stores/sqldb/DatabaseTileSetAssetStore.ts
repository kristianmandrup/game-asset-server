import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { Database } from "sqlite3";
import { TileSet } from "../../models/TileSet";

export class DatabaseTileSetAssetStore extends DatabaseAssetStore<TileSet> {
  constructor(db: Database) {
    super(db, "tilesets");
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
          tileset_data TEXT,
          collision_box_data TEXT,
          path_data TEXT
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

  protected serialize(asset: TileSet): any[] {
    return [
      asset.id,
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      JSON.stringify(asset.tileset),
      asset.collision_box ? JSON.stringify(asset.collision_box) : null,
      asset.path ? JSON.stringify(asset.path) : null,
    ];
  }

  protected deserialize(row: any): TileSet {
    return {
      id: row.id,
      project_id: row.project_id,
      type: row.type,
      tag: row.tag,
      name: row.name,
      asset_file: row.asset_file,
      file_size: row.file_size,
      tileset: JSON.parse(row.tileset_data),
      collision_box: row.collision_box_data
        ? JSON.parse(row.collision_box_data)
        : undefined,
      path: row.path_data ? JSON.parse(row.path_data) : undefined,
    } as TileSet;
  }

  protected getColumns(): string {
    return "id, project_id, type, tag, name, asset_file, file_size, tileset_data, collision_box_data, path_data";
  }

  protected getPlaceholders(): string {
    return "?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
  }

  protected getUpdateSet(): string {
    return "project_id = ?, type = ?, tag = ?, name = ?, asset_file = ?, file_size = ?, tileset_data = ?, collision_box_data = ?, path_data = ?";
  }

  protected serializeUpdate(asset: TileSet): any[] {
    return [
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      JSON.stringify(asset.tileset),
      asset.collision_box ? JSON.stringify(asset.collision_box) : null,
      asset.path ? JSON.stringify(asset.path) : null,
      asset.id,
    ];
  }
}
