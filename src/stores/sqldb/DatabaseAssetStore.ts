import { Asset } from "../../models/Asset";
import { AssetStore, DataStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export class DatabaseAssetStore implements AssetStore {
  private db: sqlite3.Database;
  private dataStore: DataStore;

  constructor(db: sqlite3.Database, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
    this.initSchema();
  }

  private initSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        type TEXT NOT NULL,
        tag TEXT NOT NULL,
        name TEXT NOT NULL,
        asset_file TEXT NOT NULL,
        tileset TEXT,
        spritesheet TEXT,
        sound TEXT,
        composite TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);
  }

  async createAsset(asset: Asset): Promise<Asset> {
    asset.id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO assets (id, project_id, type, tag, name, asset_file, tileset, spritesheet, sound, composite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          asset.id,
          asset.project_id,
          asset.type,
          asset.tag,
          asset.name,
          asset.asset_file,
          asset.tileset ? JSON.stringify(asset.tileset) : null,
          asset.spritesheet ? JSON.stringify(asset.spritesheet) : null,
          asset.sound ? JSON.stringify(asset.sound) : null,
          asset.composite ? JSON.stringify(asset.composite) : null,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(asset);
          }
        }
      );
    });
  }

  async getAssets(query: any): Promise<Asset[]> {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM assets`;
      const params: any[] = [];
      if (query.project_id) {
        sql += ` WHERE project_id = ?`;
        params.push(query.project_id);
      }
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const assets: Asset[] = rows.map((row) => ({
            ...row,
            tileset: row.tileset ? JSON.parse(row.tileset) : undefined,
            spritesheet: row.spritesheet
              ? JSON.parse(row.spritesheet)
              : undefined,
            sound: row.sound ? JSON.parse(row.sound) : undefined,
            composite: row.composite ? JSON.parse(row.composite) : undefined,
          }));
          resolve(assets);
        }
      });
    });
  }

  async getAssetById(id: string): Promise<Asset> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM assets WHERE id = ?`,
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error(`Asset with id ${id} not found.`));
          } else {
            const asset: Asset = {
              ...row,
              tileset: row.tileset ? JSON.parse(row.tileset) : undefined,
              spritesheet: row.spritesheet
                ? JSON.parse(row.spritesheet)
                : undefined,
              sound: row.sound ? JSON.parse(row.sound) : undefined,
              composite: row.composite ? JSON.parse(row.composite) : undefined,
            };
            resolve(asset);
          }
        }
      );
    });
  }

  async updateAsset(id: string, asset: Asset): Promise<Asset> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE assets SET project_id = ?, type = ?, tag = ?, name = ?, asset_file = ?, tileset = ?, spritesheet = ?, sound = ?, composite = ? WHERE id = ?`,
        [
          asset.project_id,
          asset.type,
          asset.tag,
          asset.name,
          asset.asset_file,
          asset.tileset ? JSON.stringify(asset.tileset) : null,
          asset.spritesheet ? JSON.stringify(asset.spritesheet) : null,
          asset.sound ? JSON.stringify(asset.sound) : null,
          asset.composite ? JSON.stringify(asset.composite) : null,
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`Asset with id ${id} not found.`));
          } else {
            resolve({ ...asset, id });
          }
        }
      );
    });
  }

  async deleteAsset(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM assets WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`Asset with id ${id} not found.`));
        } else {
          resolve();
        }
      });
    });
  }
}
