"use server";

import "server-only";
import { authActionClient } from "~/lib/safe-action";
import { z } from "zod";
import { ProcessedContent, ingestContent } from "~/lib/content-ingestion";
import { generateObject } from "ai";
import { groq } from "~/lib/groq";
import { revalidatePath } from "next/cache";
// Schema for note ingestion
const noteIngestionSchema = z.object({
  note: z.string().min(1, "Note content is required"),
  title: z.string().optional(),
});

export type NoteIngestionInput = z.infer<typeof noteIngestionSchema>;

/**
 * Maps note data for ingestion into the database
 */
function mapNoteForIngestion(note: string, title: string): ProcessedContent {
  return {
    type: "note" as const,
    text: `${title}\n\n${note}`,
    metadata: {
      title: title,
      content: note,
      ingestedAt: new Date().toISOString(),
    },
    tags: ["note"],
  };
}

export const ingestNoteAction = authActionClient
  .metadata({ actionName: "ingest-note" })
  .schema(noteIngestionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const { note, title } = parsedInput;

    try {
      // Generate title if not provided
      let noteTitle = title;

      if (!noteTitle || noteTitle.trim() === "") {
        const normalizedContext = note.trim().replace(/\s+/g, " ");

        const { object } = await generateObject({
          model: groq("llama-3.1-8b-instant"),
          prompt: `Generate a concise and relevant title for the following note: ${normalizedContext}`,
          schema: z.object({
            title: z.string(),
          }),
        });

        noteTitle = object.title;
      }

      const processedNote = mapNoteForIngestion(note, noteTitle);
      const inserted = await ingestContent(userId, processedNote);
      revalidatePath("/dashboard");

      return {
        success: true,
        data: inserted,
      };
    } catch (error) {
      console.error("Error ingesting note:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to ingest note: ${error.message}`
          : "Failed to ingest note",
      );
    }
  });
