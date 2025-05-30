import express from "express";
import { ProjectController } from "../controllers/ProjectController";
import { AssetController } from "../controllers/AssetController";
import { DatabaseService } from "../services/DatabaseService";

const router = express.Router();

const databaseService = new DatabaseService();

const projectController = new ProjectController(databaseService);
const assetController = new AssetController(databaseService);

// Project routes
router.post("/projects", projectController.createProject);
router.get("/projects", projectController.getProjects);
router.get("/projects/:id", projectController.getProjectById);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);

// Asset routes
router.post("/assets", assetController.createAsset);
router.get("/assets", assetController.getAssets);
router.get("/assets/:id", assetController.getAssetById);
router.put("/assets/:id", assetController.updateAsset);
router.delete("/assets/:id", assetController.deleteAsset);

export default router;
