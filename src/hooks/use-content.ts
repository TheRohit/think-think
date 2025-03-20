import { useQuery } from "@tanstack/react-query";
import { ContentItem } from "~/types/dashboard.types";
import { ContentResponse } from "~/types/api.types";

export function useContent(initialData?: ContentItem[]) {
  return useQuery({
    queryKey: ["content"],
    queryFn: async (): Promise<ContentItem[]> => {
      const response = await fetch("/api/content");

      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }

      const data = (await response.json()) as ContentResponse;

      if (!data.success) {
        throw new Error("Content fetch was unsuccessful");
      }

      return data.data;
    },
    initialData,
    staleTime: 60 * 1000, // 1 minute
  });
}
