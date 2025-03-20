import { useMutation } from "@tanstack/react-query";
import { toast } from "~/hooks/use-toast";
import { ContentItem } from "~/types/dashboard.types";
import { SearchErrorResponse, SearchSuccessResponse } from "~/types/api.types";

export function useVectorSearch() {
  return useMutation({
    mutationFn: async (query: string): Promise<ContentItem[]> => {
      if (!query.trim()) {
        return [];
      }

      const response = await fetch("/api/vector-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as SearchErrorResponse;
        throw new Error(errorData.message ?? "Failed to search");
      }

      const data = (await response.json()) as SearchSuccessResponse;

      if (!data.success) {
        throw new Error("Search was unsuccessful");
      }

      // Transform the vector search results into ContentItem format
      return data.results.map((result) => {
        const metadata = result.metadata ?? {};
        return {
          id: result.id,
          type: metadata.type ?? "note",
          content: {
            text: metadata.text ?? "",
            title: metadata.title ?? "",
            ...metadata,
          },
          tags: metadata.tags ?? [],
          createdAt: new Date(metadata.createdAt ?? Date.now()),
          updatedAt: new Date(),
          score: result.score,
        } as ContentItem;
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Search Error",
        description:
          error instanceof Error ? error.message : "Failed to search",
      });
    },
  });
}
