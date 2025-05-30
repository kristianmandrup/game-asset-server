import { DatabaseAssetStore } from "./DatabaseAssetStore";
import { Database } from "sqlite3";
import { SpriteSheet } from "../../models/SpriteSheet";

export class DatabaseSpriteSheetAssetStore extends DatabaseAssetStore<SpriteSheet> {
  constructor(db: Database) {
    super(db, "spritesheets");
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
          spritesheet_data TEXT,
          sprites_data TEXT,
          frames_data TEXT,
          animations_data TEXT
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

  protected serialize(asset: SpriteSheet): any[] {
    return [
      asset.id,
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      JSON.stringify(asset.spritesheet),
      asset.sprites ? JSON.stringify(asset.sprites) : null,
      asset.frames ? JSON.stringify(asset.frames) : null,
      asset.animations ? JSON.stringify(asset.animations) : null,
    ];
  }

  protected deserialize(row: any): SpriteSheet {
    return {
      id: row.id,
      project_id: row.project_id,
      type: row.type,
      tag: row.tag,
      name: row.name,
      asset_file: row.asset_file,
      file_size: row.file_size,
      spritesheet: JSON.parse(row.spritesheet_data),
      sprites: row.sprites_data ? JSON.parse(row.sprites_data) : undefined,
      frames: row.frames_data ? JSON.parse(row.frames_data) : undefined,
      animations: row.animations_data
        ? JSON.parse(row.animations_data)
        : undefined,
    } as SpriteSheet;
  }

  protected getColumns(): string {
    return "id, project_id, type, tag, name, asset_file, file_size, spritesheet_data, sprites_data, frames_data, animations_data";
  }

  protected getPlaceholders(): string {
    return "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
  }

  protected getUpdateSet(): string {
    return "project_id = ?, type = ?, tag = ?, name = ?, asset_file = ?, file_size = ?, spritesheet_data = ?, sprites_data = ?, frames_data = ?, animations_data = ?";
  }

  protected serializeUpdate(asset: SpriteSheet): any[] {
    return [
      asset.project_id,
      asset.type,
      asset.tag,
      asset.name,
      asset.asset_file,
      asset.file_size,
      JSON.stringify(asset.spritesheet),
      asset.sprites ? JSON.stringify(asset.sprites) : null,
      asset.frames ? JSON.stringify(asset.frames) : null,
      asset.animations ? JSON.stringify(asset.animations) : null,
      asset.id,
    ];
  }
}
