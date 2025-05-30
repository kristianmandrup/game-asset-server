import { z } from "zod";

export const TileSetSchema = z.object({
  tileset: z.object({
    type: z.literal("grid").or(z.literal("scatter")),
    size: z.tuple([z.number(), z.number()]).optional(),
    offset: z.tuple([z.number(), z.number()]).optional(),
    tiles: z.object({
      size: z.tuple([z.number(), z.number()]),
    }),
  }),
  collision_box: z.array(z.array(z.tuple([z.number(), z.number()]))).optional(),
  path: z.array(z.tuple([z.number(), z.number()])).optional(),
});

export type TileSet = z.infer<typeof TileSetSchema>;
