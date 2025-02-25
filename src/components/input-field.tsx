"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function InputField() {
  const [input, setInput] = useState("");

  return (
    <div className="focus-within:ring-primary relative flex w-full flex-col gap-2 rounded-lg border-2 border-black bg-zinc-100 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-purple-200 dark:bg-purple-900 dark:shadow-[4px_4px_0px_0px_rgba(216,180,254,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(216,180,254,1)] sm:p-4 md:w-3/4 lg:w-1/2">
      <div className="absolute inset-0 rounded-lg bg-white/20 backdrop-blur-xl dark:bg-purple-950/30" />
      <Textarea
        className="relative min-h-[120px] bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[200px]"
        rows={1}
        placeholder="Ask anything..."
        name="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="relative flex flex-row justify-end gap-2">
        <Button className="text-sm sm:text-base">Search</Button>
      </div>
    </div>
  );
}
