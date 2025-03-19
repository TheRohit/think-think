"use server";

import { Tweet } from "react-tweet/api";
import "server-only";
import { pinecone } from "~/lib/pinecone";
import { authActionClient } from "~/lib/safe-action";
import { db } from "~/server/db";
import { content } from "~/server/db/schema";
import {
  mapTweetForIngestion,
  tweetIngestionSchema,
} from "~/utils/tweet-mapper";

export const ingestTweetAction = authActionClient
  .metadata({ actionName: "ingest-tweet" })
  .schema(tweetIngestionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const { tweet } = parsedInput as { tweet: Tweet };

    try {
      const processedTweet = mapTweetForIngestion(tweet);

      const contentData = {
        type: processedTweet.type,
        userId,
        content: {
          text: processedTweet.text,
          ...processedTweet.metadata,
        },
        tags: processedTweet.tags,
      };

      const [inserted] = await db
        .insert(content)
        .values(contentData)
        .returning();

      if (!inserted) {
        throw new Error("Failed to insert tweet");
      }

      console.log("Tweet saved to database");

      const model = "multilingual-e5-large";
      const embeddingResponse = await pinecone.inference.embed(
        model,
        [(inserted.content as { text: string }).text],
        {
          inputType: "passage",
          truncate: "END",
        },
      );

      const embedding = embeddingResponse.data[0];
      if (!embedding || embedding.vectorType !== "dense") {
        throw new Error(
          `Expected dense embedding, but got ${embedding?.vectorType ?? "undefined"}`,
        );
      }

      const index = pinecone.index("multilingual-e5-large");

      const vectorRecord = {
        id: inserted.id,
        values: embedding.values,
        metadata: {
          text: (inserted.content as { text: string }).text,
          userId,
          type: inserted.type,
          createdAt: inserted.createdAt.toISOString(),
          dbId: inserted.id,
          tweetId: (inserted.content as { tweetId: string }).tweetId,
          authorUsername: (inserted.content as { authorUsername: string })
            .authorUsername,
          ...(inserted.content as Record<string, unknown>),
        },
      };

      await index.upsert([vectorRecord]);

      console.log("Tweet saved to vector database");

      return {
        success: true,
        data: inserted,
      };
    } catch (error) {
      console.error("Error ingesting tweet:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to ingest tweet: ${error.message}`
          : "Failed to ingest tweet",
      );
    }
  });
