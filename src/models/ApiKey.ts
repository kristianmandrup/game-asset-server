import { z } from "zod";

export const ApiKeySchema = z.object({
  id: z.string().uuid().optional(),
  key_hash: z.string(), // Hashed API key
  user_id: z.string().uuid(), // Foreign key to User
  name: z.string().optional(), // User-defined name for the key
  permissions: z.array(z.string()).optional(), // e.g., ["read:assets", "write:projects"]
  rate_limit_tier: z.string().optional(), // e.g., "free", "pro"
  created_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  last_used_at: z.string().datetime().nullable().optional(),
  is_active: z.boolean().default(true).optional(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;
