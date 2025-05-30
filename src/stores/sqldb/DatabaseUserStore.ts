import { User, UserSchema } from "../../models/User";
import { UserStore, DataStore } from "../DataStore";
import * as sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export class DatabaseUserStore implements UserStore {
  private db: sqlite3.Database;
  private dataStore: DataStore;

  constructor(db: sqlite3.Database, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
    this.initSchema();
  }

  private initSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  }

  async createUser(user: User): Promise<User> {
    user.id = uuidv4();
    user.created_at = new Date().toISOString();
    user.updated_at = new Date().toISOString();
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
        [
          user.id,
          user.email,
          user.password_hash,
          user.created_at,
          user.updated_at,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        }
      );
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async getUserById(id: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE id = ?`,
        [id],
        (err, row: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    user.updated_at = new Date().toISOString();
    const fields = Object.keys(user)
      .filter((key) => key !== "id")
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(user).filter(
      (_val, idx) => Object.keys(user)[idx] !== "id"
    );

    const _dataStore = this.dataStore; // Capture this.dataStore

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET ${fields} WHERE id = ?`,
        [...values, id],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error(`User with id ${id} not found.`));
          } else {
            // Fetch the updated user to return the complete object
            _dataStore.users
              .getUserById(id)
              .then((updatedUser) => {
                if (updatedUser) {
                  resolve(updatedUser);
                } else {
                  reject(
                    new Error(`User with id ${id} not found after update.`)
                  );
                }
              })
              .catch(reject);
          }
        }
      );
    });
  }

  async deleteUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`User with id ${id} not found.`));
        } else {
          resolve();
        }
      });
    });
  }
}
