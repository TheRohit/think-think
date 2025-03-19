import { pinecone } from "./pinecone";
import { Content } from "~/server/db/schema";
import { JsonObject } from "type-fest";

const MODEL_NAME = "multilingual-e5-large";

/**
 * Creates an embedding for the provided text using Pinecone
 */
export async function createEmbedding(text: string) {
  const embeddingResponse = await pinecone.inference.embed(MODEL_NAME, [text], {
    inputType: "passage",
    truncate: "END",
  });

  const embedding = embeddingResponse.data[0];
  if (!embedding || embedding.vectorType !== "dense") {
    throw new Error(
      `Expected dense embedding, but got ${embedding?.vectorType ?? "undefined"}`,
    );
  }

  return embedding.values;
}

/**
 * Stores content with its embedding in Pinecone
 */
export async function upsertContentToVectorDB(
  content: Content,
  embedding: number[],
) {
  const index = pinecone.index(MODEL_NAME);

  // Extract text from content object for metadata
  const contentObj = content.content as JsonObject;
  const text = (contentObj.text as string) || "";

  const vectorRecord = {
    id: content.id,
    values: embedding,
    metadata: {
      text,
      userId: content.userId,
      type: content.type,
      createdAt: content.createdAt.toISOString(),
      dbId: content.id,
      ...contentObj,
    },
  };

  await index.upsert([vectorRecord]);
  return true;
}

/**
 * Processes content: creates embedding and stores in Pinecone
 * This combines the embedding and upserting steps into a single operation
 */
export async function processContentForVectorDB(content: Content) {
  try {
    const contentObj = content.content as JsonObject;
    const text = contentObj.text as string;

    if (!text) {
      throw new Error("Content text is required for embedding");
    }

    const embedding = await createEmbedding(text);
    await upsertContentToVectorDB(content, embedding);

    console.log(`${content.type} saved to vector database`);
    return true;
  } catch (error) {
    console.error(`Error processing content for vector DB:`, error);
    throw error;
  }
}
