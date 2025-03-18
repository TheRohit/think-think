/* eslint-disable @next/next/no-img-element */
import { CardContent, CardFooter } from "~/components/ui/card";

import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useLinkPreview from "./ingest.queries";
import { YouTubeCard } from "./youtube-card";

export const WebsiteTab = () => {
  const [url, setUrl] = useState("");

  const { data, isLoading, isError, error, refetch } = useLinkPreview(url);

  const request = debounce(async () => {
    await refetch();
  }, 400);

  const debounceRequest = useCallback(async () => {
    await request();
  }, [request]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    await debounceRequest();
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
            id="url"
            placeholder="https://www.google.com"
            value={url}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}

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
