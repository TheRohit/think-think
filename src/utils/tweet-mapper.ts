import { Tweet } from "react-tweet/api";
import { z } from "zod";

/**
 * Extracts the most relevant information from a tweet for RAG retrieval
 */
export function mapTweetForIngestion(tweet: Tweet) {
  const plainText = tweet.text.replace(/https:\/\/t\.co\/\w+/g, "").trim();

  const photoUrls = (tweet.photos ?? []).map((photo) => photo.url);

  return {
    type: "tweet" as const,
    text: plainText,
    metadata: {
      tweetId: tweet.id_str,
      authorName: tweet.user.name,
      authorUsername: tweet.user.screen_name,
      authorVerified:
        tweet.user.verified ?? tweet.user.is_blue_verified ?? false,
      createdAt: tweet.created_at,
      favoriteCount: tweet.favorite_count ?? 0,
      language: tweet.lang ?? "unknown",
      photoUrls,
      originalUrl: `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      conversationCount: tweet.conversation_count ?? 0,
      isEdited: tweet.isEdited,
      mediaCount: tweet.mediaDetails?.length ?? 0,
      hasMedia: (tweet.mediaDetails?.length ?? 0) > 0,
    },
    tags: [
      "tweet",
      tweet.lang ?? "unknown",
      `user:${tweet.user.screen_name}`,
      ...(tweet.possibly_sensitive ? ["sensitive"] : []),
      ...(tweet.isEdited ? ["edited"] : []),
      ...(tweet.photos?.length ? ["has_photos"] : []),
    ],
  };
}

export const tweetIngestionSchema = z.object({
  tweet: z.record(z.any()),
});

export type TweetSchema = z.infer<typeof tweetIngestionSchema>;
export type TweetIngestionInput = z.infer<typeof tweetIngestionSchema>;
