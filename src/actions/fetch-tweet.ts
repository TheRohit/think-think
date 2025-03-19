"use server";

import { fetchTweet } from "react-tweet/api";
import { z } from "zod";
import { authActionClient } from "~/lib/safe-action";

export const fetchTweetAction = authActionClient
  .metadata({ actionName: "fetch-tweet" })
  .schema(
    z.object({
      tweetId: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { tweetId } = parsedInput;

    if (!tweetId) {
      throw new Error("Invalid tweet URL");
    }

    const tweet = await fetchTweet(tweetId);

    return tweet.data;
  });
