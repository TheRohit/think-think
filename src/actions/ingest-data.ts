"use server";

import { z } from "zod";
import { pinecone } from "~/lib/pinecone";
import { authActionClient } from "~/lib/safe-action";
import { v4 as uuidv4 } from "uuid";

// Base schema for common fields across all content types
const baseVectorSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  text: z.string().min(1, "Embedding text cannot be empty"), // Main text for embedding
});

// Schema for plain text notes
const noteVectorSchema = baseVectorSchema.extend({
  type: z.literal("note"),
  metadata: z
    .object({
      title: z.string().optional(),
      tags: z.array(z.string()).default([]),
    })
    .optional(),
});

// Schema for YouTube links
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

// Schema for PDF documents
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

// Schema for web links/bookmarks
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

// Combined schema using discriminated union
const vectorContentSchema = z.discriminatedUnion("type", [
  noteVectorSchema,
  youtubeVectorSchema,
  pdfVectorSchema,
  linkVectorSchema,
]);

// Schema for the input array
const schema = z.object({
  data: z.array(vectorContentSchema),
});

// Infer TypeScript types from the schema
type VectorContent = z.infer<typeof vectorContentSchema>;
type VectorContentInput = z.input<typeof vectorContentSchema>;

export const ingestData = authActionClient
  .metadata({ actionName: "ingest-data" })
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput;
    const { userId } = ctx;

    const model = "multilingual-e5-large";

    const embeddings = await pinecone.inference.embed(
      model,
      data.map((d) => d.text),
      {
        inputType: "passage",
        truncate: "END",
      },
    );

    const index = pinecone.index("multilingual-e5-large");

    const records = data.map((d, i) => ({
      id: d.id,
      values: (embeddings[i] as unknown as { values: number[] }).values,
      metadata: {
        text: d.text,
        userId,
        type: d.type,
        createdAt: new Date().toISOString(),
        ...d.metadata,
      },
    }));

    await index.upsert(records);

    return {
      success: true,
      count: records.length,
    };
  });

// Export types and schemas for use in other parts of the application
export type { VectorContent, VectorContentInput };
export { vectorContentSchema };
