"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { generateTitleAction } from "~/actions/generate-title";
import { ingestData } from "~/actions/ingest-data";
import { queryVectorDb } from "~/actions/query-vector-db";
import ContentMasonry from "~/components/content-masonary";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

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

  return <ContentMasonry />;
}
