"use server";

import { revalidatePath } from "next/cache";
import { Tweet } from "react-tweet/api";
import "server-only";
import { ingestContent } from "~/lib/content-ingestion";
import { authActionClient } from "~/lib/safe-action";
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

      const inserted = await ingestContent(userId, processedTweet);
      revalidatePath("/dashboard");

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
