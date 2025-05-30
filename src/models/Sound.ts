import { z } from "zod";
import { AssetBaseSchema } from "./Asset";

export const SoundSchema = AssetBaseSchema.extend({
  type: z.literal("sound"),
  name: z.string(),
  volume: z.number().optional(),
  duration: z.number().optional(),
});

export const CompositeAssetSchema = AssetBaseSchema.extend({
  type: z.literal("composite"),
  name: z.string(),
  tags: z.array(z.string()),
  components: z.array(
    z.object({
      name: z.string(),
      tags: z.array(z.string()),
      sounds: z.array(SoundSchema),
      animations: z
        .array(
          z.object({
            name: z.string(),
            duration: z.number().optional(),
            frames: z.array(z.number()),
            frame_details: z
              .array(
                z.object({
                  offset: z.number().optional(),
                  duration: z.number(),
                  modulation: z.number().optional(),
                })
              )
              .optional(),
          })
        )
        .optional(),
    })
  ),
});

export type Sound = z.infer<typeof SoundSchema>;
export type CompositeAsset = z.infer<typeof CompositeAssetSchema>;
