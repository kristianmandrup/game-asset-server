import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  password_hash: z.string().optional(), // For future local auth, currently optional for OAuth
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;
