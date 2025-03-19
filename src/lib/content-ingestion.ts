import { db } from "~/server/db";
import { Content, content, contentType } from "~/server/db/schema";
import { processContentForVectorDB } from "./pinecone-utils";

/**
 * Interface representing processed content ready for ingestion
 */
export interface ProcessedContent {
  type: (typeof contentType)[number];
  text: string;
  metadata: Record<string, unknown>;
  tags: string[];
}

/**
 * Generic function to ingest content into the database and vector store
 * @param userId The user ID associated with the content
 * @param processedContent The processed content data
 * @returns The inserted content record
 */
export async function ingestContent(
  userId: string,
  processedContent: ProcessedContent,
): Promise<Content> {
  try {
    // Prepare data for database insertion
    const contentData = {
      type: processedContent.type,
      userId,
      content: {
        text: processedContent.text,
        ...processedContent.metadata,
      },
      tags: processedContent.tags,
    };

    // Insert into database
    const [inserted] = await db.insert(content).values(contentData).returning();

    if (!inserted) {
      throw new Error(`Failed to insert ${processedContent.type}`);
    }

    console.log(`${processedContent.type} saved to database`);

    // Process for vector database (embedding + storage)
    await processContentForVectorDB(inserted);

    return inserted;
  } catch (error) {
    console.error(`Error ingesting ${processedContent.type}:`, error);
    throw new Error(
      error instanceof Error
        ? `Failed to ingest ${processedContent.type}: ${error.message}`
        : `Failed to ingest ${processedContent.type}`,
    );
  }
}
