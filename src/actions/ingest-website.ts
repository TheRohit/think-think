"use server";

import "server-only";
import { authActionClient } from "~/lib/safe-action";
import {
  mapWebsiteForIngestion,
  websiteIngestionSchema,
} from "~/utils/website-mapper";
import { ingestContent } from "~/lib/content-ingestion";
import { LinkPreviewData } from "~/types/link-preview";
import { revalidatePath } from "next/cache";
export const ingestWebsiteAction = authActionClient
  .metadata({ actionName: "ingest-website" })
  .schema(websiteIngestionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const { website } = parsedInput as { website: LinkPreviewData };

    try {
      const processedWebsite = mapWebsiteForIngestion(website);

      const inserted = await ingestContent(userId, processedWebsite);
      revalidatePath("/dashboard");
      return {
        success: true,
        data: inserted,
      };
    } catch (error) {
      console.error("Error ingesting website:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to ingest website: ${error.message}`
          : "Failed to ingest website",
      );
    }
  });
