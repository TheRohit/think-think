"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { ingestData } from "~/actions/ingest-data";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function HomePage() {
  // const { executeAsync: generate, isPending: isGeneratingPending } = useAction(
  //   generateAction,
  //   {
  //     onSuccess: (data) => {
  //       if (data.data) {
  //         console.log(data.data);
  //       }
  //     },
  //     onError: (error) => {
  //       console.error(error);
  //     },
  //   },
  // );

  const [text, setText] = useState("");

  const { executeAsync: ingest, isPending: isIngestingPending } = useAction(
    ingestData,
    {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  const handleIngest = async () => {
    await ingest({ data: [{ text, type: "note" }] });
  };

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to the AI-powered something
        </h1>
        <Textarea
          placeholder="Enter your text here"
          className="w-full max-w-md"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        <Button
          onClick={handleIngest}
          disabled={isIngestingPending || text.length === 0}
          isLoading={isIngestingPending}
          variant={"secondary"}
        >
          Ingest
        </Button>
      </div>
    </main>
  );
}
