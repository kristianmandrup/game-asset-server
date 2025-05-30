import { Project } from "../../models/Project";
import { ProjectStore, DataStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export class DatabaseProjectStore implements ProjectStore {
  private db: sqlite3.Database;
  private dataStore: DataStore;

  constructor(db: sqlite3.Database, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
    this.initSchema();
  }

  private initSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        creation_date TEXT NOT NULL,
        last_modified_date TEXT NOT NULL
      )
    `);
  }

  async createProject(project: Project): Promise<Project> {
    project.id = uuidv4();
    project.creation_date = new Date().toISOString();
    project.last_modified_date = new Date().toISOString();
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO projects (id, name, description, creation_date, last_modified_date) VALUES (?, ?, ?, ?, ?)`,
        [
          project.id,
          project.name,
          project.description,
          project.creation_date,
          project.last_modified_date,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(project);
          }
        }
      );
    });
  }

  async getProjects(query: any): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM projects`, (err, rows: Project[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getProjectById(id: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM projects WHERE id = ?`,
        [id],
        (err, row: Project) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error(`Project with id ${id} not found.`));
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async updateProject(id: string, project: Project): Promise<Project> {
    project.last_modified_date = new Date().toISOString();
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE projects SET name = ?, description = ?, last_modified_date = ? WHERE id = ?`,
        [project.name, project.description, project.last_modified_date, id],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`Project with id ${id} not found.`));
          } else {
            resolve({ ...project, id });
          }
        }
      );
    });
  }

  async deleteProject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM projects WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`Project with id ${id} not found.`));
        } else {
          resolve();
        }
      });
    });
  }
}
