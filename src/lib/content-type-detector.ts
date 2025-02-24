import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "~/env";
import { createOpenAI } from "@ai-sdk/openai";

const urlPattern = /^(https?:\/\/[^\s]+)$/;
const youtubePattern =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

// Basic content type detection based on patterns
export function detectContentType(
  input: string,
): "note" | "youtube" | "link" | null {
  // Check if it's a URL
  if (urlPattern.test(input.trim())) {
    // Check if it's a YouTube URL
    if (youtubePattern.test(input.trim())) {
      return "youtube";
    }
    return "link";
  }

  // If it's not a URL, it's probably a note
  if (input.length > 0) {
    return "note";
  }

  return null;
}

const contentTypeSchema = z.object({
  type: z.enum(["note", "youtube", "pdf", "link"]),
  confidence: z.number().min(0).max(1),
});

// AI-assisted content type detection for more complex cases
export async function detectContentTypeWithAI(input: string) {
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const { object } = await generateObject({
    model: groq("llama-3.1-8b-instant"),
    prompt: `Analyze this content and determine its type. Consider the following types:
    - note: for text notes, thoughts, or general writing
    - youtube: for YouTube video links or content
    - pdf: for PDF documents or content
    - link: for general web links
    
    Content to analyze: ${input}`,
    schema: contentTypeSchema,
  });

  if (object.confidence > 0.7) {
    return object.type;
  }

  return null;
}

// Schema for content metadata
export const contentMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  fileName: z.string().optional(),
  pageNumber: z.number().optional(),
  totalPages: z.number().optional(),
});

// Function to extract metadata based on content type
export async function extractContentMetadata(
  input: string,
  contentType: string,
) {
  const google = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
  });

  const { object } = await generateObject({
    model: google("gemini-2.0-flash-001"),
    prompt: `Extract metadata from this ${contentType} content. Only include relevant fields that can be confidently extracted.
  
    Content: ${input}`,
    schema: contentMetadataSchema,
  });

  return object;
}
