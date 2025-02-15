"use client";

import { useAction } from "next-safe-action/hooks";
import { generateAction } from "~/actions/generate";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function HomePage() {
  const { executeAsync: generate, isPending: isGeneratingPending } = useAction(
    generateAction,
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

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to the AI-powered something
        </h1>
        <Textarea
          placeholder="Enter your text here"
          className="w-full max-w-md"
        />

        <Button
          onClick={() => generate({ prompt: "write a poem about a cat" })}
          variant={"secondary"}
        >
          Generate
        </Button>
      </div>
    </main>
  );
}
