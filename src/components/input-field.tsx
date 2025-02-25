"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function InputField() {
  const [input, setInput] = useState("");

  return (
    <div className="focus-within:ring-primary relative flex w-full flex-col gap-2 rounded-lg border-2 border-black bg-zinc-100 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-sky-400 dark:bg-zinc-900/80 dark:shadow-[4px_4px_0px_0px_rgba(56,189,248,0.8)] dark:hover:shadow-[2px_2px_0px_0px_rgba(56,189,248,0.8)] sm:p-4 md:w-3/4 lg:w-1/2">
      <div className="absolute inset-0 rounded-lg bg-white/20 backdrop-blur-xl dark:bg-zinc-900/30" />
      <Textarea
        className="relative min-h-[120px] bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[200px]"
        rows={1}
        placeholder="Ask anything..."
        name="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="relative flex flex-row justify-end gap-2">
        <Button className="text-sm dark:bg-sky-500 dark:text-white dark:hover:bg-sky-400 sm:text-base">
          Search
        </Button>
      </div>
    </div>
  );
}
