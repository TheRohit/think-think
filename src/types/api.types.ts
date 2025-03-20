import { ContentItem } from "./dashboard.types";

// Vector Search API Types
export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    text?: string;
    type?: string;
    title?: string;
    createdAt?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

export interface SearchSuccessResponse {
  success: boolean;
  results: SearchResult[];
  total: number;
}

export interface SearchErrorResponse {
  error: string;
  message?: string;
  validationErrors?: Record<string, unknown>;
}

// Content API Types
export interface ContentResponse {
  success: boolean;
  data: ContentItem[];
  total: number;
}

export interface ContentErrorResponse {
  error: string;
  message?: string;
}
