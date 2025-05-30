import { User, UserSchema } from "../../models/User";
import { UserStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";
import { DrizzleDb } from "./DatabaseDataStore"; // Import DrizzleDb type
import * as schema from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class DatabaseUserStore implements UserStore {
  private db: DrizzleDb;
  private dataStore: DataStore;

  constructor(db: DrizzleDb, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
  }

  async createUser(user: User): Promise<User> {
    const newUser = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await (this.db as any)
      .insert(schema.users)
      .values(newUser)
      .returning();
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await (this.db as any).query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await (this.db as any).query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return user;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = {
      ...user,
      updatedAt: new Date(),
    };
    const result = await (this.db as any)
      .update(schema.users)
      .set(updatedUser)
      .where(eq(schema.users.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`User with id ${id} not found.`);
    }
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    const result = await (this.db as any)
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`User with id ${id} not found.`);
    }
  }
}
