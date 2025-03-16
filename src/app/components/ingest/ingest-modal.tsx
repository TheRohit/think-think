/* eslint-disable @next/next/no-img-element */
"use client";

import { FileText, Link, Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { debounce } from "lodash";
import DialogBox from "~/components/dialog-box";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DialogClose } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";

import useLinkPreview from "./ingest.queries";
import { YouTubeCard } from "./youtube-card";

export default function IngestModal() {
  return (
    <div>
      <DialogBox
        className="max-w-2xl"
        title="Add Memory"
        description="Add a link, tweet, note, document, or import from integrations to your memories"
        content={<Content />}
      >
        <Button
          variant="noShadow"
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <Plus className="h-10 w-10" /> Add Memory
        </Button>
      </DialogBox>
    </div>
  );
}

const WebsiteTab = () => {
  const [url, setUrl] = useState("");
  const [debouncedUrl, setDebouncedUrl] = useState("");

  const debouncedSetUrlRef = useRef(
    debounce((value: string) => {
      setDebouncedUrl(value);
    }, 500),
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    debouncedSetUrlRef.current(newUrl);
  };

  const { data, isLoading, isError, error } = useLinkPreview(debouncedUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website or Tweet URL</CardTitle>
        <CardDescription>
          Add a website or tweet URL to your diary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="https://www.google.com"
            value={url}
            onChange={handleUrlChange}
            className="w-full"
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}

        {data && (
          <>
            {data.type === "youtube" && data.title && data.description ? (
              <YouTubeCard
                metadata={{
                  title: data.title,
                  description: data.description,
                  image: data.image,
                  type: data.type,
                }}
              />
            ) : (
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{data.title}</p>
                    {data.type && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Website
                      </span>
                    )}
                  </div>
                  {data.description && (
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {data.description}
                    </p>
                  )}
                  {data.image && (
                    <div className="mt-2 justify-center overflow-hidden rounded-md align-middle">
                      <img
                        width={100}
                        height={100}
                        src={data.image}
                        alt={data.title || "Preview"}
                        className="h-auto max-h-32 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <CardFooter className="flex justify-end">
          <Button disabled={!data}>Add Memory</Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

const NoteTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Note</CardTitle>
        <CardDescription>Write a note</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note">Note Content</Label>
          <Textarea
            id="note"
            placeholder="Write your note here..."
            className="relative min-h-[120px] bg-white/20 backdrop-blur-xl focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/30 sm:min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Add Note</Button>
      </CardFooter>
    </Card>
  );
};

const DocumentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a Document</CardTitle>
        <CardDescription>
          Upload a PDF or other document to your memories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 p-6 dark:border-gray-700">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Drag and drop a PDF or other document here</p>
            <p className="text-sm">or</p>
          </div>
          <Button variant="neutral" size="sm">
            Browse Files
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button disabled>Add Document</Button>
      </CardFooter>
    </Card>
  );
};

const TabTriggers = () => {
  return (
    <TabsList className="mb-2 grid w-full grid-cols-3 bg-gray-100 p-1 dark:bg-gray-800/50">
      <TabsTrigger
        value="website"
        className="flex items-center justify-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
      >
        <Link className="h-4 w-4 text-indigo-500" />
        <span className="hidden sm:inline">Website</span>
      </TabsTrigger>
      <TabsTrigger
        value="note"
        className="flex items-center justify-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
      >
        <FileText className="h-4 w-4 text-green-500" />
        <span className="hidden sm:inline">Note</span>
      </TabsTrigger>
      <TabsTrigger
        value="document"
        className="flex items-center justify-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
      >
        <Upload className="h-4 w-4 text-amber-500" />
        <span className="hidden sm:inline">Document</span>
      </TabsTrigger>
    </TabsList>
  );
};

// Content Component
const Content = () => {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="website" className="w-full">
        <TabTriggers />

        <TabsContent value="website">
          <WebsiteTab />
        </TabsContent>

        <TabsContent value="note">
          <NoteTab />
        </TabsContent>

        <TabsContent value="document">
          <DocumentTab />
        </TabsContent>
      </Tabs>
      <DialogClose asChild>
        <div className="mt-4 flex justify-between">
          <Button variant="neutral">Cancel</Button>
        </div>
      </DialogClose>
    </div>
  );
};
