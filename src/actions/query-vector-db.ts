"use server";

import "server-only";
import { z } from "zod";
import { pinecone } from "~/lib/pinecone";
import { authActionClient } from "~/lib/safe-action";

export const queryVectorDb = authActionClient
  .metadata({ actionName: "query-vector-db" })
  .schema(
    z.object({
      query: z.string(),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { query, limit } = parsedInput;
    const { userId } = ctx;

    try {
      const model = "multilingual-e5-large";

      const embeddings = await pinecone.inference.embed(model, [query], {
        inputType: "query",
      });

      const index = pinecone.index("multilingual-e5-large");

      const queryResponse = await index.query({
        topK: limit,
        vector: (embeddings[0] as unknown as { values: number[] }).values,
        includeValues: false,
        includeMetadata: true,
        filter: {
          userId: { $eq: userId },
        },
      });

      const results = queryResponse.matches.map((match) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      }));

      return {
        success: true,
        results,
        total: results.length,
      };
    } catch (error) {
      console.error("Error querying vector database:", error);
      throw new Error("Failed to query vector database");
    }
  });
