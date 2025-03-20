export interface LinkContent {
  url: string;
  title: string;
  siteName: string;
  description: string;
  image?: string;
  contentType: string;
}

export interface TweetContent {
  tweetId: string;
  text: string;
  hasMedia: boolean;
  photoUrls?: string[];
  mediaCount: number;
  authorName: string;
  authorUsername: string;
  authorVerified: boolean;
  originalUrl: string;
  favoriteCount: number;
  conversationCount: number;
  createdAt: string;
}

export interface NoteContent {
  text: string;
  title?: string;
  content?: string;
  description?: string;
  ingestedAt?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  content: LinkContent | TweetContent | NoteContent | Record<string, unknown>;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}
