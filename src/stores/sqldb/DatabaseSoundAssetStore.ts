import { Asset } from "../../models/Asset";
import { SoundAssetStore, DataStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { SoundSchema } from "../../models/Sound";

export class DatabaseSoundAssetStore implements SoundAssetStore {
  private db: sqlite3.Database;
  private dataStore: DataStore; // This might not be strictly needed for SoundAssetStore, but keeping for consistency

  constructor(db: sqlite3.Database, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
    this.initSchema();
  }

  private initSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sounds (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        name TEXT NOT NULL,
        file TEXT NOT NULL,
        volume REAL,
        duration REAL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);
  }

  async createSound(soundAsset: Asset): Promise<Asset> {
    soundAsset.id = uuidv4();
    if (!soundAsset.sound) {
      throw new Error("Sound data is missing for sound asset creation.");
    }
    const soundData = SoundSchema.parse(soundAsset.sound);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO sounds (id, project_id, name, file, volume, duration) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          soundAsset.id,
          soundAsset.project_id,
          soundData.name,
          soundData.file,
          soundData.volume || null,
          soundData.duration || null,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(soundAsset);
          }
        }
      );
    });
  }

  async getSounds(query?: Partial<Asset>): Promise<Asset[]> {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM sounds`;
      const params: any[] = [];
      if (query && query.project_id) {
        sql += ` WHERE project_id = ?`;
        params.push(query.project_id);
      }
      // Add other query parameters if needed (e.g., name, tag)
      // For now, assuming only project_id for filtering
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const soundAssets: Asset[] = rows.map((row) => ({
            id: row.id,
            project_id: row.project_id,
            type: "sound", // Explicitly set type
            tag: "default", // Assuming a default tag or fetch from somewhere if needed
            name: row.name,
            asset_file: row.file, // Map file to asset_file
            file_size: 0, // Placeholder, as file_size is on Asset, not Sound
            sound: {
              name: row.name,
              file: row.file,
              volume: row.volume,
              duration: row.duration,
            },
          }));
          resolve(soundAssets);
        }
      });
    });
  }

  async getSoundById(id: string): Promise<Asset> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM sounds WHERE id = ?`,
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error(`Sound asset with id ${id} not found.`));
          } else {
            const soundAsset: Asset = {
              id: row.id,
              project_id: row.project_id,
              type: "sound",
              tag: "default",
              name: row.name,
              asset_file: row.file,
              file_size: 0, // Placeholder
              sound: {
                name: row.name,
                file: row.file,
                volume: row.volume,
                duration: row.duration,
              },
            };
            resolve(soundAsset);
          }
        }
      );
    });
  }

  async updateSound(id: string, soundAsset: Asset): Promise<Asset> {
    if (!soundAsset.sound) {
      throw new Error("Sound data is missing for sound asset update.");
    }
    const soundData = SoundSchema.parse(soundAsset.sound);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE sounds SET project_id = ?, name = ?, file = ?, volume = ?, duration = ? WHERE id = ?`,
        [
          soundAsset.project_id,
          soundData.name,
          soundData.file,
          soundData.volume || null,
          soundData.duration || null,
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`Sound asset with id ${id} not found.`));
          } else {
            resolve({ ...soundAsset, id });
          }
        }
      );
    });
  }

  async deleteSound(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM sounds WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`Sound asset with id ${id} not found.`));
        } else {
          resolve();
        }
      });
    });
  }
}
