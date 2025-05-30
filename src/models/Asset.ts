import { z } from "zod";
import { TileSetSchema } from "./TileSet";
import { SpriteSheetSchema } from "./SpriteSheet";
import { SoundSchema } from "./Sound"; // Removed CompositeAssetSchema import

export const AssetBaseSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(), // 'sound', 'spritesheet', 'tileset'
  projectId: z.string(),
  tag: z.string().nullable().optional(),
  assetFile: z.string(), // URL or path to the asset file
  fileSize: z.number(), // in bytes
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  // JSONB fields for specific asset details
  soundDetails: z.any().nullable().optional(),
  spriteSheetDetails: z.any().nullable().optional(),
  tileSetDetails: z.any().nullable().optional(),
});

export const AssetSchema = z.discriminatedUnion("type", [
  TileSetSchema.extend({ type: z.literal("tileset") }),
  SpriteSheetSchema.extend({ type: z.literal("spritesheet") }),
  SoundSchema.extend({ type: z.literal("sound") }),
]);

export type Asset = z.infer<typeof AssetSchema>;
export type AssetBase = z.infer<typeof AssetBaseSchema>;
export type TileSet = z.infer<typeof TileSetSchema>;
export type SpriteSheet = z.infer<typeof SpriteSheetSchema>;
export type Sound = z.infer<typeof SoundSchema>;
