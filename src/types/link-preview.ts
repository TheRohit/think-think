// Define content types
export type ContentType = "youtube" | "website";

// Link preview data structure
export type LinkPreviewData = {
  title: string;
  description: string;
  image: string | undefined;
  siteName: string;
  url: string;
  type: ContentType;
};

// API response structure
export type LinkPreviewResponse = {
  success: boolean;
  data?: LinkPreviewData;
  error?: string;
  validationErrors?: {
    url?: {
      _errors: string[];
    };
  };
};

// Helper function to determine content type
export function getContentType(url: string): ContentType {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  return youtubeRegex.test(url) ? "youtube" : "website";
}
