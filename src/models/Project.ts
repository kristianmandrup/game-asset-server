import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(), // Added description field
  type: z.string(),
  map: z.string(),
  tags: z.array(z.string()),
  creation_date: z.string(), // Added creation_date field
  last_modified_date: z.string(), // Added last_modified_date field
});

export type Project = z.infer<typeof ProjectSchema>;
