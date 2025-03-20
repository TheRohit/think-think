/* eslint-disable @next/next/no-img-element */
"use client";

import { Calendar, Clock, FileText, Tag } from "lucide-react";
import Link from "next/link";

import { YouTubeLogo } from "~/components/icons/youtube-logo";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import DialogBox from "./dialog-box";
import { ClientTweetCard } from "./magicui/client-tweet";

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

// Helper function to format relative time
const formatRelativeTime = (dateInput: Date | string): string => {
  try {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(date);
  } catch {
    return "Unknown time";
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
    <Card className="flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border bg-transparent p-4 backdrop-blur-md">
      <Link href={content.url} target="_blank" className="block h-full">
        <div className="flex flex-col">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="line-clamp-2 text-xl font-bold text-blue-700">
              {content.title ?? "Untitled Link"}
            </CardTitle>
            {content.siteName && (
              <CardDescription className="mt-1 flex items-center gap-1 text-sm">
                <span className="font-medium text-gray-600">
                  {content.siteName}
                </span>
                {content.siteName === "YouTube" && (
                  <YouTubeLogo size={30} className="ml-1" />
                )}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="flex-grow p-0 py-2">
            {content.description && (
              <p className="mb-3 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                {content.description}
              </p>
            )}
            {content.image && (
              <img
                src={content.image || "/placeholder.svg"}
                alt={content.title ?? "Link image"}
                className={`h-full w-full rounded-lg object-cover transition-transform duration-500`}
              />
            )}
          </CardContent>

          <CardFooter className="mt-auto flex items-center justify-between p-0 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={14} />
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1 overflow-hidden">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="neutral" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="neutral" className="text-xs">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}

function TweetCard({ item }: { item: ContentItemProps }) {
  const content = item.content as TweetContent;

  return <ClientTweetCard id={content.tweetId} />;
}

function NoteCard({ item }: { item: ContentItemProps }) {
  const content = item.content as NoteContent;

  const contentPreview = content.content ?? content.text ?? "";

  return (
    <Card className="flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border bg-transparent p-4 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-amber-700">
          {content.title ?? "Untitled Note"}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} />
          <span>{formatRelativeTime(item.createdAt)}</span>

          {item.tags && item.tags.length > 0 && (
            <>
              <span className="mx-1">•</span>
              <Tag size={14} />
              <span>{item.tags.length} tags</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <DialogBox
        title={content.title ?? "Untitled Note"}
        description={`Created on ${formatDate(item.createdAt)}`}
        content={
          <ScrollArea className="h-[60vh] w-full rounded-lg border border-gray-200 bg-white p-6 text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content.content ?? content.text}
            </div>
          </ScrollArea>
        }
      >
        <CardContent>
          <div className="relative">
            <ScrollArea className="h-[120px] w-full rounded-lg border border-gray-200 bg-amber-50/50 p-4 text-gray-800">
              <p className="text-sm leading-relaxed">{contentPreview}</p>
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-2">
          {/* <Button variant="default" size="sm" className="gap-1 text-xs">
            <Bookmark size={14} />
            Save
          </Button>
          <Button variant="default" size="sm" className="gap-1 text-xs">
            <Share2 size={14} />
            Share
          </Button> */}
          <Button size="sm" className="bg-amber-500 text-xs hover:bg-amber-600">
            Read More
          </Button>
        </CardFooter>
      </DialogBox>
    </Card>
  );
}

function DefaultCard({ item }: { item: ContentItemProps }) {
  return (
    <Card className="w-full border-l-4 border-l-purple-500 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="rounded-full bg-purple-100 p-1.5 text-purple-700">
            <FileText size={16} />
          </div>
          Unknown Content Type: {item.type}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Calendar size={14} />
          <span>{formatDate(item.createdAt)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs">
          <pre>{JSON.stringify(item.content, null, 2)}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
