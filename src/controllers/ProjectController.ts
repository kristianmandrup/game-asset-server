import { Request, Response } from "express";
import { ProjectSchema } from "../models/Project";
import { DatabaseService } from "../services/DatabaseService";

export class ProjectController {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  createProject = async (req: Request, res: Response) => {
    try {
      const project = ProjectSchema.parse(req.body);
      const savedProject = await this.databaseService.createProject(project);
      res.status(201).json(savedProject);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getProjects = async (req: Request, res: Response) => {
    try {
      const projects = await this.databaseService.getProjects(req.query);
      res.status(200).json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getProjectById = async (req: Request, res: Response) => {
    try {
      const project = await this.databaseService.getProjectById(req.params.id);
      res.status(200).json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateProject = async (req: Request, res: Response) => {
    try {
      const project = ProjectSchema.parse(req.body);
      const updatedProject = await this.databaseService.updateProject(
        req.params.id,
        project
      );
      res.status(200).json(updatedProject);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    try {
      await this.databaseService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
