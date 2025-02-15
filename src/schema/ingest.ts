import { z } from "zod";

export const ingestCombinedSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      content: z.string(),
      tags: z.array(z.string()).optional(),
      metadata: z.record(z.any()).optional(),
      createdAt: z
        .string()
        .datetime()
        .optional()
        .default(() => new Date().toISOString()),
      updatedAt: z
        .string()
        .datetime()
        .optional()
        .default(() => new Date().toISOString()),
    }),
  ),
});
