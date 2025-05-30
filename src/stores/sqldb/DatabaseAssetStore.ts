import { Asset } from "../../models/Asset";
import { AssetStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export abstract class DatabaseAssetStore<T extends Asset>
  implements AssetStore<T>
{
  protected db: sqlite3.Database;
  protected tableName: string;

  constructor(db: sqlite3.Database, tableName: string) {
    this.db = db;
    this.tableName = tableName;
    this.createTable(); // Call createTable in the constructor
  }

  protected abstract createTable(): Promise<void>;
  protected abstract serialize(asset: T): any[];
  protected abstract deserialize(row: any): T;
  protected abstract getColumns(): string;
  protected abstract getPlaceholders(): string;
  protected abstract getUpdateSet(): string;
  protected abstract serializeUpdate(asset: T): any[];

  async createAsset(asset: T): Promise<T> {
    asset.id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO ${
          this.tableName
        } (${this.getColumns()}) VALUES (${this.getPlaceholders()})`,
        this.serialize(asset),
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

  async getAssets(query?: Partial<T>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      let sql = `SELECT ${this.getColumns()} FROM ${this.tableName}`;
      const params: any[] = [];
      if (query && query.project_id) {
        sql += ` WHERE project_id = ?`;
        params.push(query.project_id);
      }
      // Add more query parameters as needed based on common asset properties
      if (query && query.type) {
        sql += `${params.length > 0 ? " AND" : " WHERE"} type = ?`;
        params.push(query.type);
      }
      if (query && query.tag) {
        sql += `${params.length > 0 ? " AND" : " WHERE"} tag = ?`;
        params.push(query.tag);
      }
      if (query && query.name) {
        sql += `${params.length > 0 ? " AND" : " WHERE"} name = ?`;
        params.push(query.name);
      }

      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const assets: T[] = rows.map((row) => this.deserialize(row));
          resolve(assets);
        }
      });
    });
  }

  async getAssetById(id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT ${this.getColumns()} FROM ${this.tableName} WHERE id = ?`,
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(undefined); // Return undefined if not found
          } else {
            resolve(this.deserialize(row));
          }
        }
      );
    });
  }

  async updateAsset(id: string, asset: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.tableName} SET ${this.getUpdateSet()} WHERE id = ?`,
        this.serializeUpdate(asset),
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
      this.db.run(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`Asset with id ${id} not found.`));
          } else {
            resolve();
          }
        }
      );
    });
  }
}
