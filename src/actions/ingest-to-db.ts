"use server";

import { z } from "zod";
import { authActionClient } from "~/lib/safe-action";
import { db } from "~/server/db";
import { content } from "~/server/db/schema";

// Base schema for common fields across all content types
const baseContentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  userId: z.string(),
  tags: z.array(z.string()).default([]),
});

// Schema for plain text notes
const noteSchema = baseContentSchema.extend({
  type: z.literal("note"),
  content: z.object({
    text: z.string().min(1, "Note content cannot be empty"),
  }),
});

// Schema for YouTube links
const youtubeSchema = baseContentSchema.extend({
  type: z.literal("youtube"),
  content: z.object({
    url: z
      .string()
      .url()
      .refine((url) => {
        return url.includes("youtube.com") || url.includes("youtu.be");
      }, "Must be a valid YouTube URL"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    thumbnailUrl: z.string().url().optional(),
  }),
});

// Schema for PDF documents
const pdfSchema = baseContentSchema.extend({
  type: z.literal("pdf"),
  content: z.object({
    fileName: z.string().min(1, "File name is required"),
    fileUrl: z.string().url(),
    fileSize: z.number().positive(),
    pageCount: z.number().positive().optional(),
    description: z.string().optional(),
  }),
});

// Schema for web links/bookmarks
const linkSchema = baseContentSchema.extend({
  type: z.literal("link"),
  content: z.object({
    url: z.string().url(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    favicon: z.string().url().optional(),
  }),
});

// Combined schema using discriminated union
const contentSchema = z.discriminatedUnion("type", [
  noteSchema,
  youtubeSchema,
  pdfSchema,
  linkSchema,
]);

// Schema for the input array
const schema = z.object({
  data: z.array(contentSchema),
});

// Infer TypeScript types from the schema
type Content = z.infer<typeof contentSchema>;
type ContentInput = z.input<typeof contentSchema>;

export const ingestData = authActionClient
  .metadata({ actionName: "ingest-data" })
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput;
    const { userId } = ctx;

    try {
      // Begin a transaction to ensure all inserts succeed or none do
      const insertedContent = await db.transaction(async (tx) => {
        const results = await Promise.all(
          data.map(async (item) => {
            const contentData = {
              id: item.id,
              type: item.type,
              userId,
              content: item.content,
              tags: item.tags,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };

            const [inserted] = await tx
              .insert(content)
              .values(contentData)
              .returning();

            return inserted;
          }),
        );

        return results;
      });

      return {
        success: true,
        data: insertedContent,
      };
    } catch (error) {
      console.error("Error ingesting content:", error);
      throw new Error("Failed to store content in database");
    }
  });

// Export types and schemas for use in other parts of the application
export { contentSchema };
export type { Content, ContentInput };
