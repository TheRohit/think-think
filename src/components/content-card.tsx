"use client";

import Link from "next/link";
import DialogBox from "./dialog-box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

// Helper function to format dates that can be either Date objects or strings
const formatDate = (dateInput: Date | string): string => {
  try {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "Unknown date";
  }
};

// Content types
type LinkContent = {
  url: string;
  text?: string;
  image?: string;
  title?: string;
  siteName?: string;
  description?: string;
  contentType?: string;
  ingestedAt?: string;
};

type TweetContent = {
  text: string;
  tweetId: string;
  hasMedia?: boolean;
  isEdited?: boolean;
  language?: string;
  createdAt: string;
  photoUrls?: string[];
  authorName?: string;
  mediaCount?: number;
  originalUrl: string;
  favoriteCount?: number;
  authorUsername?: string;
  authorVerified?: boolean;
  conversationCount?: number;
};

type NoteContent = {
  text: string;
  title?: string;
  content?: string;
  description?: string;
  ingestedAt?: string;
};

// Content item props
type ContentItemProps = {
  id: string;
  type: string;
  content: LinkContent | TweetContent | NoteContent | Record<string, unknown>;
  tags: string[] | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function ContentCard({ item }: { item: ContentItemProps }) {
  // Render different card based on content type
  switch (item.type) {
    case "link":
      return <LinkCard item={item} />;
    case "tweet":
      return <TweetCard item={item} />;
    case "note":
      return <NoteCard item={item} />;
    default:
      return <DefaultCard item={item} />;
  }
}

function LinkCard({ item }: { item: ContentItemProps }) {
  const content = item.content as LinkContent;

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-md">
      <Link href={content.url} target="_blank" className="block h-full">
        <div className="flex flex-col gap-4 p-4 md:flex-row">
          {content.image && (
            <div className="relative h-40 overflow-hidden rounded-md md:h-36 md:w-48">
              <img
                src={content.image}
                alt={content.title ?? "Link image"}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="line-clamp-2 text-lg font-bold">
                {content.title ?? "Untitled Link"}
              </CardTitle>
              {content.siteName && (
                <CardDescription className="text-sm text-zinc-800">
                  {content.siteName}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {content.description && (
                <p className="mb-2 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                  {content.description}
                </p>
              )}
              <div className="mt-auto text-xs text-gray-500">
                {formatDate(item.createdAt)} • {item.type}
              </div>
            </CardContent>
          </div>
        </div>
      </Link>
    </Card>
  );
}

function TweetCard({ item }: { item: ContentItemProps }) {
  const content = item.content as TweetContent;
  const tweetImageUrl = content.photoUrls?.[0];

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-md">
      <Link href={content.originalUrl} target="_blank" className="block h-full">
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-white">
              <span className="text-xs font-bold">@</span>
            </div>
            <div>
              <p className="font-semibold">
                {content.authorName ?? "Unknown Author"}
              </p>
              <p className="text-xs text-gray-500">
                @{content.authorUsername ?? "unknown"}
              </p>
            </div>
          </div>

          <p className="mb-3 text-sm">{content.text}</p>

          {content.hasMedia && tweetImageUrl && (
            <div className="relative mb-3 h-40 overflow-hidden rounded-md">
              <img
                src={tweetImageUrl}
                alt="Tweet media"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(content.createdAt)}</span>
            {content.favoriteCount !== undefined && (
              <span>♥ {content.favoriteCount}</span>
            )}
            {content.conversationCount !== undefined && (
              <span>💬 {content.conversationCount}</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

function NoteCard({ item }: { item: ContentItemProps }) {
  const content = item.content as NoteContent;

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {content.title ?? "Untitled Note"}
        </CardTitle>
        <CardDescription className="text-sm text-zinc-800">
          {formatDate(item.createdAt)}
        </CardDescription>
      </CardHeader>
      <DialogBox
        title={content.title ?? "Untitled Note"}
        description=""
        content={
          <ScrollArea className="h-[60vh] w-full rounded-base border-2 border-border bg-main p-4 text-mtext shadow-shadow">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content.content ?? content.text}
            </div>
          </ScrollArea>
        }
      >
        <CardContent>
          <ScrollArea className="h-[100px] w-full rounded-base border-2 border-border bg-main p-2 text-mtext shadow-shadow">
            <p className="line-clamp-5 text-sm">
              {content.content ?? content.text}
            </p>
          </ScrollArea>
        </CardContent>
      </DialogBox>
    </Card>
  );
}

function DefaultCard({ item }: { item: ContentItemProps }) {
  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Unknown Content Type</CardTitle>
        <CardDescription>Type: {item.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
          {JSON.stringify(item.content, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
