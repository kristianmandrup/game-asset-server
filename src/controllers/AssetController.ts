import { Request, Response } from "express";
import { AssetSchema } from "../models/Asset";
import { SoundSchema } from "../models/Sound";
import { SpriteSheetSchema } from "../models/SpriteSheet";
import { TileSetSchema } from "../models/TileSet";
import { DatabaseService } from "../services/DatabaseService";

export class AssetController {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  createAsset = async (req: Request, res: Response) => {
    try {
      const asset = AssetSchema.parse(req.body);
      const savedAsset = await this.databaseService.createAsset(asset);
      res.status(201).json(savedAsset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getAssets = async (req: Request, res: Response) => {
    try {
      const assets = await this.databaseService.getAssets(req.query);
      res.status(200).json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getAssetById = async (req: Request, res: Response) => {
    try {
      const asset = await this.databaseService.getAssetById(req.params.id);
      res.status(200).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateAsset = async (req: Request, res: Response) => {
    try {
      const asset = AssetSchema.parse(req.body);
      const updatedAsset = await this.databaseService.updateAsset(
        req.params.id,
        asset
      );
      res.status(200).json(updatedAsset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteAsset = async (req: Request, res: Response) => {
    try {
      await this.databaseService.deleteAsset(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Sound Asset methods
  createSound = async (req: Request, res: Response) => {
    try {
      const sound = SoundSchema.parse(req.body);
      const savedSound = await this.databaseService.createSound(sound);
      res.status(201).json(savedSound);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getSounds = async (req: Request, res: Response) => {
    try {
      const sounds = await this.databaseService.getSounds(req.query);
      res.status(200).json(sounds);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getSoundById = async (req: Request, res: Response) => {
    try {
      const sound = await this.databaseService.getSoundById(req.params.id);
      res.status(200).json(sound);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateSound = async (req: Request, res: Response) => {
    try {
      const sound = SoundSchema.parse(req.body);
      const updatedSound = await this.databaseService.updateSound(
        req.params.id,
        sound
      );
      res.status(200).json(updatedSound);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteSound = async (req: Request, res: Response) => {
    try {
      await this.databaseService.deleteSound(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // SpriteSheet Asset methods
  createSpriteSheet = async (req: Request, res: Response) => {
    try {
      const spritesheet = SpriteSheetSchema.parse(req.body);
      const savedSpriteSheet = await this.databaseService.createSpriteSheet(
        spritesheet
      );
      res.status(201).json(savedSpriteSheet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getSpriteSheets = async (req: Request, res: Response) => {
    try {
      const spritesheets = await this.databaseService.getSpriteSheets(
        req.query
      );
      res.status(200).json(spritesheets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getSpriteSheetById = async (req: Request, res: Response) => {
    try {
      const spritesheet = await this.databaseService.getSpriteSheetById(
        req.params.id
      );
      res.status(200).json(spritesheet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateSpriteSheet = async (req: Request, res: Response) => {
    try {
      const spritesheet = SpriteSheetSchema.parse(req.body);
      const updatedSpriteSheet = await this.databaseService.updateSpriteSheet(
        req.params.id,
        spritesheet
      );
      res.status(200).json(updatedSpriteSheet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteSpriteSheet = async (req: Request, res: Response) => {
    try {
      await this.databaseService.deleteSpriteSheet(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // TileSet Asset methods
  createTileSet = async (req: Request, res: Response) => {
    try {
      const tileset = TileSetSchema.parse(req.body);
      const savedTileSet = await this.databaseService.createTileSet(tileset);
      res.status(201).json(savedTileSet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getTileSets = async (req: Request, res: Response) => {
    try {
      const tilesets = await this.databaseService.getTileSets(req.query);
      res.status(200).json(tilesets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getTileSetById = async (req: Request, res: Response) => {
    try {
      const tileset = await this.databaseService.getTileSetById(req.params.id);
      res.status(200).json(tileset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateTileSet = async (req: Request, res: Response) => {
    try {
      const tileset = TileSetSchema.parse(req.body);
      const updatedTileSet = await this.databaseService.updateTileSet(
        req.params.id,
        tileset
      );
      res.status(200).json(updatedTileSet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteTileSet = async (req: Request, res: Response) => {
    try {
      await this.databaseService.deleteTileSet(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
