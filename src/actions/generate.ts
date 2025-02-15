"use server";

import { authActionClient } from "~/lib/safe-action";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { env } from "~/env";

export const generateAction = authActionClient
  .metadata({ actionName: "generate" })
  .schema(
    z.object({
      prompt: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { prompt } = parsedInput;
    const google = createGoogleGenerativeAI({
      apiKey: env.GEMINI_API_KEY,
    });

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
      schema: z.object({
        text: z.string(),
      }),
    });

    return object;
  });
