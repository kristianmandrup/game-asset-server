import { Project, ProjectSchema } from "../../models/Project";
import { v4 as uuidv4 } from "uuid";
import { ProjectStore } from "../DataStore";
import { InMemoryDataStore } from "./InMemoryDataStore";

export class InMemoryProjectStore implements ProjectStore {
  private dataStore: InMemoryDataStore;
  private projects: Project[] = [];

  private projectQueryAttributes = ["id", "name", "type", "map", "tags"];

  constructor(dataStore: InMemoryDataStore) {
    this.dataStore = dataStore;
  }

  createProject = async (project: Project): Promise<Project> => {
    try {
      // Validate the project data against the ProjectSchema
      const validatedProject = ProjectSchema.parse(project);
      const newProject = { ...validatedProject, id: uuidv4() };
      this.projects.push(newProject);
      return newProject;
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  };

  getProjects = async (query: Partial<Project>): Promise<Project[]> => {
    // Filter the projects based on the provided query object
    return this.projects.filter((project) => {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const queryValue = query[key as keyof Project];
          const projectValue = project[key as keyof Project];

          if (key === "tags") {
            // If the query has tags, check if all query tags are present in project tags
            const queryTags = queryValue as string[];
            const projectTags = projectValue as string[];
            if (queryTags && queryTags.length > 0) {
              if (!queryTags.every((tag) => projectTags.includes(tag))) {
                return false;
              }
            }
          } else if (
            this.projectQueryAttributes.includes(key) &&
            queryValue !== undefined &&
            projectValue !== queryValue
          ) {
            // For id, name, type, and map, perform a direct comparison
            return projectValue === queryValue;
          }
        }
      }
      return true;
    });
  };

  getProjectById = async (id: string): Promise<Project> => {
    return this.projects.find((p) => p.id === id) || ({} as Project);
  };

  updateProject = async (id: string, project: Project): Promise<Project> => {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...project, id };
    }
    return { ...project, id };
  };

  deleteProject = async (id: string): Promise<void> => {
    this.projects = this.projects.filter((p) => p.id !== id);
  };
}
