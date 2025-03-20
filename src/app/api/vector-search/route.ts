import { auth } from "~/lib/auth";
import { pinecone } from "~/lib/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  limit: z.number().min(1).max(100).default(10),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = (await request.json()) as unknown;
    const result = querySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: result.error.issues },
        { status: 400 },
      );
    }

    const { query, limit } = result.data;
    const userId = session.user.id;

    // Create embeddings using Pinecone
    const model = "multilingual-e5-large";
    const embeddings = await pinecone.inference.embed(model, [query], {
      inputType: "query",
    });

    const embedding = embeddings.data[0];
    if (!embedding || embedding.vectorType !== "dense") {
      throw new Error(
        `Expected dense embedding at index ${0}, but got ${embedding?.vectorType ?? "undefined"}`,
      );
    }

    // Query the vector database
    const index = pinecone.index("multilingual-e5-large");
    const queryResponse = await index.query({
      topK: limit,
      vector: embedding.values,
      includeValues: false,
      includeMetadata: true,
      filter: {
        userId: { $eq: userId },
      },
    });

    // Format and return results
    const results = queryResponse.matches.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("Error querying vector database:", error);
    return NextResponse.json(
      {
        error: "Failed to query vector database",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
