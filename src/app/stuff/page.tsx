"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { generateTitleAction } from "~/actions/generate-title";
import { ingestData } from "~/actions/ingest-data";
import { queryVectorDb } from "~/actions/query-vector-db";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { fetchTweet } from "react-tweet/api";

export default function StuffPage() {
  const [queryText, setQueryText] = useState("");
  const { executeAsync: query, isPending: isQueryingPending } = useAction(
    queryVectorDb,
    {
      onSuccess: (data) => {
        if (data.data) {
          console.log(data.data);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const { executeAsync: ingest, isPending: isIngestingPending } = useAction(
    ingestData,
    {
      onSuccess: (data) => {
        if (data.data) {
          console.log(data.data);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const {
    executeAsync: generateTitle,
    isPending: isGeneratingTitlePending,
    result,
  } = useAction(generateTitleAction, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <Textarea
        placeholder="What is the capital of France?"
        className="h-96"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />
      <div>
        <Button
          isLoading={isGeneratingTitlePending}
          onClick={() => generateTitle({ context: queryText })}
        >
          Generate Title
        </Button>
      </div>

      {result && <p>{result.data}</p>}

      {isQueryingPending && <p>Querying...</p>}
    </div>
  );
}
