import { Request, Response } from "express";
import { AssetSchema } from "../models/Asset";
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
}
