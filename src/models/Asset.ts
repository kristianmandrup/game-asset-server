import { z } from "zod";
import { TileSetSchema } from "./TileSet";
import { SpriteSheetSchema } from "./SpriteSheet";
import { SoundSchema, CompositeAssetSchema } from "./Sound";

export const AssetSchema = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  type: z.union([
    z.literal("tileset"),
    z.literal("spritesheet"),
    z.literal("sound"),
    z.literal("composite"),
  ]),
  tag: z.string(),
  name: z.string(),
  asset_file: z.string(), // New required field for binary asset file path
  tileset: TileSetSchema.optional(),
  spritesheet: SpriteSheetSchema.optional(),
  sound: SoundSchema.optional(),
  composite: CompositeAssetSchema.optional(),
});

export type Asset = z.infer<typeof AssetSchema>;
export type TileSet = z.infer<typeof TileSetSchema>;
export type SpriteSheet = z.infer<typeof SpriteSheetSchema>;
export type Sound = z.infer<typeof SoundSchema>;
export type CompositeAsset = z.infer<typeof CompositeAssetSchema>;
