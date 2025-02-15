import { z } from "zod";

const baseVectorSchema = z.object({
  text: z.string().min(1, "Embedding text cannot be empty"),
  tags: z.array(z.string()).default([]),
});

const noteVectorSchema = baseVectorSchema.extend({
  type: z.literal("note"),
  metadata: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
});

const youtubeVectorSchema = baseVectorSchema.extend({
  type: z.literal("youtube"),
  metadata: z
    .object({
      url: z
        .string()
        .url()
        .refine(
          (url) => url.includes("youtube.com") || url.includes("youtu.be"),
          "Must be a valid YouTube URL",
        ),
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
    })
    .optional(),
});

const pdfVectorSchema = baseVectorSchema.extend({
  type: z.literal("pdf"),
  metadata: z
    .object({
      fileName: z.string().min(1, "File name is required"),
      pageNumber: z.number().positive().optional(),
      totalPages: z.number().positive().optional(),
    })
    .optional(),
});

const linkVectorSchema = baseVectorSchema.extend({
  type: z.literal("link"),
  metadata: z
    .object({
      url: z.string().url(),
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
    })
    .optional(),
});

const vectorContentSchema = z.discriminatedUnion("type", [
  noteVectorSchema,
  youtubeVectorSchema,
  pdfVectorSchema,
  linkVectorSchema,
]);

export const ingestSchema = z.object({
  data: z.array(vectorContentSchema),
});

type VectorContent = z.infer<typeof vectorContentSchema>;
type VectorContentInput = z.input<typeof vectorContentSchema>;

export type { VectorContent, VectorContentInput };
export { vectorContentSchema };
