"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { groq } from "~/lib/groq";
import { authActionClient } from "~/lib/safe-action";

export const generateTitleAction = authActionClient
  .metadata({ actionName: "generate-title" })
  .schema(
    z.object({
      context: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { context } = parsedInput;
    const normalizedContext = context.trim().replace(/\s+/g, " ");

    const { object } = await generateObject({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate a title for the following context: ${normalizedContext}`,
      schema: z.object({
        title: z.string(),
      }),
    });

    return object.title;
  });
