"use server";

import "server-only";
import { pinecone } from "~/lib/pinecone";
import { authActionClient } from "~/lib/safe-action";
import { ingestSchema } from "~/schema/ingest-schema";
import { db } from "~/server/db";
import { content } from "~/server/db/schema";

export const ingestData = authActionClient
  .metadata({ actionName: "ingest-data" })
  .schema(ingestSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput;
    const { userId } = ctx;

    try {
      const dbRecords = await Promise.all(
        data.map(async (item) => {
          const contentData = {
            type: item.type,
            userId,
            content: {
              text: item.text,
              ...item.metadata,
            },
            tags: item.tags,
          };

          const [inserted] = await db
            .insert(content)
            .values(contentData)
            .returning();

          if (!inserted) {
            throw new Error("Failed to insert content");
          }

          return inserted;
        }),
      );

      console.log(dbRecords);
      console.log("saved to db");

      const model = "multilingual-e5-large";

      const embeddings = await pinecone.inference.embed(
        model,
        dbRecords.map((record) => (record.content as { text: string }).text),
        {
          inputType: "passage",
          truncate: "END",
        },
      );

      const index = pinecone.index("multilingual-e5-large");

      const vectorRecords = dbRecords.map((record, i) => {
        // Ensure the embedding exists and is a dense embedding
        const embedding = embeddings.data[i];
        if (!embedding || embedding.vectorType !== "dense") {
          throw new Error(
            `Expected dense embedding at index ${i}, but got ${embedding?.vectorType ?? "undefined"}`,
          );
        }

        return {
          id: record.id,
          values: embedding.values,
          metadata: {
            text: (record.content as { text: string }).text,
            userId,
            type: record.type,
            createdAt: record.createdAt.toISOString(),
            dbId: record.id,
            ...(record.content as Record<string, unknown>),
          },
        };
      });

      await index.upsert(vectorRecords);

      console.log("saved to vector db");

      return {
        success: true,
        data: dbRecords,
        vectorCount: vectorRecords.length,
      };
    } catch (error) {
      console.error("Error ingesting data:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to ingest data: ${error.message}`
          : "Failed to ingest data",
      );
    }
  });
