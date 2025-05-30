import express from "express";
import { ProjectController } from "../controllers/ProjectController";
import { AssetController } from "../controllers/AssetController";
import { DatabaseService } from "../services/DatabaseService";
import { DatabaseDataStore } from "../stores/sqldb/DatabaseDataStore"; // Import DatabaseDataStore
import * as path from "path"; // Import path for default database path

// Export a function that takes an optional DatabaseService as an argument
export const apiRouter = (injectedDatabaseService?: DatabaseService) => {
  const router = express.Router();

  let databaseService: DatabaseService;

  if (injectedDatabaseService) {
    databaseService = injectedDatabaseService;
  } else {
    // Default instance if not injected
    const defaultDbPath = path.join(
      __dirname,
      "../../src/data/game_asset_server.db"
    );
    const defaultDataStore = new DatabaseDataStore(defaultDbPath);
    databaseService = new DatabaseService(defaultDataStore);
  }

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

  // Add routes for specific asset types (Sound, SpriteSheet, TileSet)
  router.post("/sounds", assetController.createSound);
  router.get("/sounds", assetController.getSounds);
  router.get("/sounds/:id", assetController.getSoundById);
  router.put("/sounds/:id", assetController.updateSound);
  router.delete("/sounds/:id", assetController.deleteSound);

  router.post("/spritesheets", assetController.createSpriteSheet);
  router.get("/spritesheets", assetController.getSpriteSheets);
  router.get("/spritesheets/:id", assetController.getSpriteSheetById);
  router.put("/spritesheets/:id", assetController.updateSpriteSheet);
  router.delete("/spritesheets/:id", assetController.deleteSpriteSheet);

  router.post("/tilesets", assetController.createTileSet);
  router.get("/tilesets", assetController.getTileSets);
  router.get("/tilesets/:id", assetController.getTileSetById);
  router.put("/tilesets/:id", assetController.updateTileSet);
  router.delete("/tilesets/:id", assetController.deleteTileSet);

  return router;
};
