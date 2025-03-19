/* eslint-disable @next/next/no-img-element */
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useLinkPreview } from "./ingest.queries";

import { useAction } from "next-safe-action/hooks";
import {
  EnrichedTweet,
  enrichTweet,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInfo,
  TweetMedia,
  TweetSkeleton,
} from "react-tweet";
import { fetchTweetAction } from "~/actions/fetch-tweet";
import { YouTubeCard } from "./youtube-card";

export const WebsiteTab = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [tweetDisplayId, setTweetDisplayId] = useState<string | null>(null);
  const [tweet, setTweet] = useState<EnrichedTweet | null>(null);

  const { data, isLoading, isError, error, refetch } = useLinkPreview(url);

  const request = debounce(async () => {
    await refetch();
  }, 400);

  const debounceRequest = useCallback(async () => {
    await request();
  }, [request]);

  const { executeAsync: fetchTweet, isPending: isFetchingTweetPending } =
    useAction(fetchTweetAction, {
      onSuccess: (data) => {
        if (data.data) {
          const tweet = enrichTweet(data.data);
          setTweet(tweet);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const { tweetId, isTweet } = getTweetId(e.target.value);
    if (isTweet && tweetId) {
      setTweetDisplayId(tweetId);
      await fetchTweet({ tweetId });
    } else {
      setUrl(e.target.value);
      setTweetDisplayId(null);
      await debounceRequest();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website or Tweet URL</CardTitle>
        <CardDescription>
          Add a website or tweet URL to your diary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="text"
            placeholder="https://www.google.com"
            value={text}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        <div>
          {isFetchingTweetPending && <TweetSkeleton />}
          {tweetDisplayId && !isFetchingTweetPending && tweet && (
            <TweetContainer>
              <TweetHeader tweet={tweet} />
              <TweetBody tweet={tweet} />
              {tweet?.mediaDetails?.length ? (
                <TweetMedia tweet={tweet} />
              ) : null}
              <TweetInfo tweet={tweet} />
            </TweetContainer>
          )}
        </div>

        {data && (
          <>
            {data.type === "youtube" && data.title && data.description ? (
              <YouTubeCard
                metadata={{
                  title: data.title,
                  description: data.description,
                  image: data.image,
                  type: data.type,
                }}
              />
            ) : (
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{data.title}</p>
                    {data.type && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Website
                      </span>
                    )}
                  </div>
                  {data.description && (
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {data.description}
                    </p>
                  )}
                  {data.image && (
                    <div className="mt-2 justify-center overflow-hidden rounded-md align-middle">
                      <img
                        width={100}
                        height={100}
                        src={data.image}
                        alt={data.title || "Preview"}
                        className="h-auto max-h-32 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <CardFooter className="flex justify-end">
          <Button disabled={!data}>Add Memory</Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export const getTweetId = (url: string) => {
  // Strict regex to match only twitter.com and x.com domains with status URLs
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/i;
  const tweetIdMatch = regex.exec(url);
  return {
    tweetId: tweetIdMatch?.[1],
    isTweet: !!tweetIdMatch,
  };
};
