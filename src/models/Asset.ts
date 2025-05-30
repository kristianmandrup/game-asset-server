import { z } from "zod";
import { TileSetSchema } from "./TileSet";
import { SpriteSheetSchema } from "./SpriteSheet";
import { SoundSchema, CompositeAssetSchema } from "./Sound";

export const AssetBaseSchema = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  tag: z.string(),
  name: z.string(),
  asset_file: z.string(), // New required field for binary asset file data
  file_size: z.number(),
});

export const AssetSchema = z.discriminatedUnion("type", [
  TileSetSchema.extend({ type: z.literal("tileset") }),
  SpriteSheetSchema.extend({ type: z.literal("spritesheet") }),
  SoundSchema.extend({ type: z.literal("sound") }),
  CompositeAssetSchema.extend({ type: z.literal("composite") }),
]);

export type Asset = z.infer<typeof AssetSchema>;
export type AssetBase = z.infer<typeof AssetBaseSchema>;
export type TileSet = z.infer<typeof TileSetSchema>;
export type SpriteSheet = z.infer<typeof SpriteSheetSchema>;
export type Sound = z.infer<typeof SoundSchema>;
export type CompositeAsset = z.infer<typeof CompositeAssetSchema>;
