import { User } from "../../models/User";
import { UserStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";

export class InMemoryUserStore implements UserStore {
  private users: Map<string, User> = new Map();
  private dataStore: DataStore;

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  async createUser(user: User): Promise<User> {
    user.id = uuidv4();
    user.created_at = new Date().toISOString();
    user.updated_at = new Date().toISOString();
    this.users.set(user.id, { ...user }); // Store a copy
    return Promise.resolve(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return Promise.resolve({ ...user });
      }
    }
    return Promise.resolve(undefined);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = this.users.get(id);
    return Promise.resolve(user ? { ...user } : undefined);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found.`);
    }

    const updatedUser = { ...existingUser, ...user };
    updatedUser.updated_at = new Date().toISOString();

    this.users.set(id, updatedUser);
    return Promise.resolve({ ...updatedUser });
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = this.users.delete(id);
    if (!deleted) {
      throw new Error(`User with id ${id} not found.`);
    }
    return Promise.resolve();
  }
}
