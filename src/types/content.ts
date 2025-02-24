import { z } from "zod";

export const noteContent = z.object({
  text: z.string(),
  title: z.string(),
  description: z.string(), // TODO: update schema
});

export const youtubeContent = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export const pdfContent = z.object({
  url: z.string(),
  fileName: z.string(),
  pageNumber: z.number().optional(),
  totalPages: z.number().optional(),
});

export const linkContent = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export const contentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("note"), content: noteContent }),
  z.object({ type: z.literal("youtube"), content: youtubeContent }),
  z.object({ type: z.literal("pdf"), content: pdfContent }),
  z.object({ type: z.literal("link"), content: linkContent }),
]);

export type ContentType = z.infer<typeof contentSchema>;
export type NoteContent = z.infer<typeof noteContent>;
export type YoutubeContent = z.infer<typeof youtubeContent>;
export type PdfContent = z.infer<typeof pdfContent>;
export type LinkContent = z.infer<typeof linkContent>;
