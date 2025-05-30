import { Project } from "../../models/Project";
import { ProjectStore, DataStore } from "../DataStore";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export class JSONFileProjectStore implements ProjectStore {
  private filePath: string;
  private projects: Map<string, Project> = new Map();
  private dataStore: DataStore;

  constructor(
    dataStore: DataStore,
    filePath: string = path.join(__dirname, "../data/projects.json")
  ) {
    this.filePath = filePath;
    this.dataStore = dataStore;
    this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const projectsArray: Project[] = JSON.parse(data);
      this.projects = new Map(
        projectsArray
          .filter((project) => project.id !== undefined)
          .map((project) => [project.id as string, project])
      );
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // File does not exist, initialize with empty data
        await this.saveProjects();
      } else {
        console.error("Error loading projects:", error);
      }
    }
  }

  private async saveProjects(): Promise<void> {
    try {
      const projectsArray = Array.from(this.projects.values());
      await fs.writeFile(
        this.filePath,
        JSON.stringify(projectsArray, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error saving projects:", error);
    }
  }

  async createProject(project: Project): Promise<Project> {
    project.id = uuidv4();
    this.projects.set(project.id, project);
    await this.saveProjects();
    return project;
  }

  async getProjects(query: any): Promise<Project[]> {
    // For simplicity, query is not fully implemented. Returns all projects.
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<Project> {
    return this.projects.get(id) as Project;
  }

  async updateProject(id: string, project: Project): Promise<Project> {
    if (!this.projects.has(id)) {
      throw new Error(`Project with id ${id} not found.`);
    }
    this.projects.set(id, { ...this.projects.get(id), ...project, id });
    await this.saveProjects();
    return this.projects.get(id) as Project;
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.projects.has(id)) {
      throw new Error(`Project with id ${id} not found.`);
    }
    this.projects.delete(id);
    await this.saveProjects();
  }
}
