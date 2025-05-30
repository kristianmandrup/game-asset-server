import { Project } from "../../models/Project";
import { ProjectStore, DataStore } from "../DataStore";
import { v4 as uuidv4 } from "uuid";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";

type DrizzleDb =
  | NodePgDatabase<typeof schema>
  | BetterSQLite3Database<typeof schema>;

export class DatabaseProjectStore implements ProjectStore {
  private db: DrizzleDb;
  private dataStore: DataStore;

  constructor(db: DrizzleDb, dataStore: DataStore) {
    this.db = db;
    this.dataStore = dataStore;
  }

  async createProject(project: Project): Promise<Project> {
    const newProject = {
      ...project,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await (this.db as any)
      .insert(schema.projects)
      .values(newProject)
      .returning();
    return result[0];
  }

  async getProjects(query: any): Promise<Project[]> {
    return await (this.db as any).query.projects.findMany();
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await (this.db as any).query.projects.findFirst({
      where: eq(schema.projects.id, id),
    });
    if (!project) {
      throw new Error(`Project with id ${id} not found.`);
    }
    return project;
  }

  async updateProject(id: string, project: Project): Promise<Project> {
    const updatedProject = {
      ...project,
      updatedAt: new Date(),
    };
    const result = await (this.db as any)
      .update(schema.projects)
      .set(updatedProject)
      .where(eq(schema.projects.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`Project with id ${id} not found.`);
    }
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    const result = await (this.db as any)
      .delete(schema.projects)
      .where(eq(schema.projects.id, id))
      .returning();
    if (result.length === 0) {
      throw new Error(`Project with id ${id} not found.`);
    }
  }
}
