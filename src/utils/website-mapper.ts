import { z } from "zod";
import { LinkPreviewData } from "~/types/link-preview";
import { ProcessedContent } from "~/lib/content-ingestion";

/**
 * Maps website preview data for ingestion into the database
 */
export function mapWebsiteForIngestion(
  website: LinkPreviewData,
): ProcessedContent {
  return {
    type: "link" as const,
    text: `${website.title}\n${website.description ?? ""}`,
    metadata: {
      title: website.title,
      description: website.description ?? "",
      image: website.image ?? null,
      siteName: website.siteName ?? "",
      url: website.url,
      contentType: website.type,
      ingestedAt: new Date().toISOString(),
    },
    tags: [
      "link",
      website.type,
      `site:${website.siteName ?? new URL(website.url).hostname}`,
      ...(website.image ? ["has_image"] : []),
    ],
  };
}

export const websiteIngestionSchema = z.object({
  website: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional().nullable(),
    siteName: z.string().optional(),
    url: z.string().url(),
    type: z.enum(["youtube", "website"]),
  }),
});

export type WebsiteSchema = z.infer<typeof websiteIngestionSchema>;
export type WebsiteIngestionInput = z.infer<typeof websiteIngestionSchema>;
