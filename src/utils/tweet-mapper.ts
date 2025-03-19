import { EnrichedTweet } from "react-tweet";
import { z } from "zod";

/**
 * Extracts the most relevant information from a tweet for RAG retrieval
 */
export function mapTweetForIngestion(tweet: EnrichedTweet) {
  const plainText = tweet.text.replace(/https:\/\/t\.co\/\w+/g, "").trim();

  // Extract photo URLs
  const photoUrls = (tweet.photos ?? []).map((photo) => photo.url);

  const entitiesText = tweet.entities?.[0]?.text ?? "";

  return {
    type: "tweet",
    text: plainText,
    metadata: {
      tweetId: tweet.id_str,
      authorName: tweet.user.name,
      authorUsername: tweet.user.screen_name,
      authorVerified: tweet.user.verified || tweet.user.is_blue_verified,
      createdAt: tweet.created_at,
      favoriteCount: tweet.favorite_count,
      language: tweet.lang,
      photoUrls,
      originalUrl: tweet.url,
      entitiesText,
      conversationCount: tweet.conversation_count,
    },
    tags: ["tweet", tweet.lang, `user:${tweet.user.screen_name}`],
  };
}

export const tweetIngestionSchema = z.object({
  tweets: z.array(
    z.object({
      id_str: z.string(),
      text: z.string(),
      created_at: z.string(),
      user: z.object({
        name: z.string(),
        screen_name: z.string(),
        verified: z.boolean().optional(),
        is_blue_verified: z.boolean().optional(),
      }),
      favorite_count: z.number().optional(),
      lang: z.string().optional(),
      url: z.string().optional(),
      conversation_count: z.number().optional(),
      photos: z
        .array(
          z.object({
            url: z.string(),
          }),
        )
        .optional(),
      entities: z
        .array(
          z.object({
            text: z.string(),
            type: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

export type TweetIngestionInput = z.infer<typeof tweetIngestionSchema>;
