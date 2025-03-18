import { useQuery } from "@tanstack/react-query";
import type { LinkPreviewResponse } from "~/types/link-preview";

const useLinkPreview = (queryUrl: string) => {
  return useQuery({
    queryKey: ["linkPreview", queryUrl],
    queryFn: async () => {
      if (!queryUrl) return null;
      const encodedUrl = encodeURIComponent(queryUrl);
      const response = await fetch(`/api/link-preview?url=${encodedUrl}`);
      const result = (await response.json()) as LinkPreviewResponse;

      if (!result.success) {
        if (result.validationErrors?.url?._errors) {
          throw new Error(
            result.validationErrors.url._errors[0] ?? "Invalid URL format",
          );
        } else {
          throw new Error(result.error ?? "Failed to fetch metadata");
        }
      }
      return result.data;
    },
    enabled: false,
  });
};

export default useLinkPreview;
