import { z } from "zod";
import { AssetBaseSchema } from "./Asset";

export const SpriteSheetSchema = AssetBaseSchema.extend({
  type: z.literal("spritesheet"),
  spritesheet: z.object({
    type: z.literal("grid").or(z.literal("scatter")),
    size: z.tuple([z.number(), z.number()]).optional(),
    offset: z.tuple([z.number(), z.number()]).optional(),
    tiles: z.object({
      size: z.tuple([z.number(), z.number()]),
    }),
  }),
  sprites: z
    .array(
      z.object({
        name: z.string(),
        offset: z.tuple([z.number(), z.number()]),
        size: z.tuple([z.number(), z.number()]),
      })
    )
    .optional(),
  frames: z
    .array(
      z.object({
        start: z.tuple([z.number(), z.number()]),
        end: z.tuple([z.number(), z.number()]),
        duration: z.number(),
      })
    )
    .optional(),
  animations: z
    .array(
      z.object({
        name: z.string(),
        frame_indexes: z.array(z.number()),
        duration: z.number(),
      })
    )
    .optional(),
});

export type SpriteSheet = z.infer<typeof SpriteSheetSchema>;
